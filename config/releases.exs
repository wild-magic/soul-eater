import Config

config :beowulf, Beowulf.Repo,
  username: System.fetch_env!("DATABASE_USER"),
  password: System.fetch_env!("DATABASE_PASS"),
  database: System.fetch_env!("DATABASE_NAME"),
  hostname: System.fetch_env!("DATABASE_HOST"),
  pool_size: 15

# port = String.to_integer(System.fetch_env!("PORT") || "8080")
# config :beowulf, Beowulf.Endpoint,
#   http: [port: port],
#   url: [host: System.fetch_env!("HOSTNAME"), port: port],
#   root: ".",
#   secret_key_base: System.fetch_env!("SECRET_KEY_BASE")

config :beowulf, BeowulfWeb.Endpoint,
  http: [:inet6, port: System.fetch_env!("PORT") || 4000],
  # This is critical for ensuring web-sockets properly authorize.
  url: [host: "localhost", port: System.fetch_env!("PORT")],
  cache_static_manifest: "priv/static/cache_manifest.json",
  server: true,
  root: ".",
  version: Application.spec(:beowulf, :vsn)
