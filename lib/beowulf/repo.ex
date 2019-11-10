defmodule Beowulf.Repo do
  use Ecto.Repo,
    otp_app: :beowulf,
    adapter: Ecto.Adapters.Postgres
end
