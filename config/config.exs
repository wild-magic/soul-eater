# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
import Config

config :beowulf,
  ecto_repos: [Beowulf.Repo]

# Configures the endpoint
config :beowulf, BeowulfWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "cRwke/iUK4Cfo7DTw3G+eGL7oXKfC428nBY03wrhxEovm6IETYsFWlPS7HTRKydY",
  render_errors: [view: BeowulfWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Beowulf.PubSub, adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

config :beowulf, :pow,
  user: Beowulf.Users.User,
  repo: Beowulf.Repo

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
