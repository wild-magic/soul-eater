defmodule BeowulfWeb.RoomChannel do
  use BeowulfWeb, :channel
  require Logger

  @sphere_path "priv/static_json/sphere.json"
  @ground_path "priv/static_json/ground.json"

  def join("room:" <> room, payload, socket) do
    if authorized?(payload) do
      # Compute initial world (could be a function of the room & the payload,
      # which could have either user auth info or the world state the client
      # is starting from).
      client_world = load_world(room, payload)

      # Stick the world in the Channel process state for retrieval later.
      # i.e. so the client doesn't need to send it every frame
      new_socket = assign(socket, :client_world, client_world)
      schedule_tick()
      {:ok, %{"type" => "initial_world", "data" => %{"client_world" => client_world}}, new_socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("change", payload, socket = %{assigns: %{client_world: client_world}}) do
    Logger.info("[BeowulfWeb.RoomChannel] - current_state: #{inspect(client_world)}")
    Logger.info("[BeowchangeulfWeb.RoomChannel] - handle_in: #{inspect(payload)}")
    new_socket = assign(socket, :client_world, client_world)
    {:reply, {:ok, %{"type" => "change_resp", "data" => %{}}}, new_socket}

    # {:reply, {:error, %{"type" => "change_error", "data" => %{"error" => "some_error"}}}, socket}
  end

  def handle_info(
        :tick,
        socket = %{assigns: %{client_world: [sphere = %{"position" => old_position}, ground]}}
      ) do
    new_position = Map.update!(old_position, "x", &(&1 + 1))
    new_sphere = Map.put(sphere, "position", new_position)
    new_world = [new_sphere, ground]
    push(socket, "whisper", %{"type" => "new_world", "data" => %{"new_world" => new_world}})
    schedule_tick()
    {:noreply, assign(socket, :client_world, new_world)}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end

  def load_world(room, payload) do
    sphere = @sphere_path |> Path.expand() |> File.read!() |> Jason.decode!()
    ground = @ground_path |> Path.expand() |> File.read!() |> Jason.decode!()

    [sphere, ground]
  end

  def schedule_tick() do
    # tick betwen 2 and 10 seconds
    Process.send_after(self, :tick, max(100, :rand.uniform(1_000)))
  end
end
