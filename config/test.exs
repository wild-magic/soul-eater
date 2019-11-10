import Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :beowulf, BeowulfWeb.Endpoint,
  http: [port: 4002],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

# Configure your database
config :beowulf, Beowulf.Repo,
  database: "beowulf_test",
  hostname: "db",
  password: "postgres",
  pool: Ecto.Adapters.SQL.Sandbox,
  username: "postgres"
