FROM elixir:1.9.2-slim AS builder

# The following are build arguments used to change variable parts of the image.
# The name of your application/release (required)
ARG APP_NAME
# The version of the application we are building (required)
# The environment to build with
ARG MIX_ENV=prod
# Set this to true if this release is not a Phoenix app
ARG SKIP_PHOENIX=false
# If you are using an umbrella project, you can change this
# argument to the directory the Phoenix app is in so that the assets
# can be built
ARG PHOENIX_SUBDIR=.

ENV SKIP_PHOENIX=${SKIP_PHOENIX} \
    APP_NAME=${APP_NAME} \
    MIX_ENV=${MIX_ENV} \
    LANG=en_US.utf8

# By convention, /opt is typically used for applications
WORKDIR /opt/build

# This step installs all the build tools we'll need
RUN apt-get update && \
  apt-get upgrade  && \
  apt-get install -y curl && \
  curl -sL https://deb.nodesource.com/setup_12.x | bash - && \
  curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
  echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
  apt-get update && \
  apt-get install -y \
    nodejs \
    yarn \
    git  \
    locales \
    && rm -rf /var/lib/apt/lists/* \
    && localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8 \
  && mix local.rebar --force \
  && mix local.hex --force


# This copies our app source code into the build container
COPY . .

RUN mix do deps.get, deps.compile, compile

# This step builds assets for the Phoenix app (if there is one)
# If you aren't building a Phoenix app, pass `--build-arg SKIP_PHOENIX=true`
# This is mostly here for demonstration purposes
RUN if [ ! "$SKIP_PHOENIX" = "true" ]; then \
  cd ${PHOENIX_SUBDIR}/assets && \
  yarn install && \
  yarn deploy && \
  cd - && \
  mix phx.digest; \
fi

RUN mix release ${APP_NAME}
RUN cp -R /opt/build/_build/${MIX_ENV}/rel /opt/build/rel

# From this line onwards, we're in a new image, which will be the image used in production
FROM debian:stretch

# The name of your application/release (required)
ARG APP_NAME

RUN apt-get update && \
    apt-get install -y \
    openssl \
    locales \
    && rm -rf /var/lib/apt/lists/* \
    && localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8

ENV APP_NAME=${APP_NAME} \
    LANG=en_US.utf8

WORKDIR /opt/app

COPY --from=builder /opt/build/rel/${APP_NAME} .

CMD /opt/app/bin/${APP_NAME} start
