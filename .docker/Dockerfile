FROM node:19-alpine as base

RUN apk update && apk upgrade

WORKDIR /home/node/app

FROM base AS deps_pages
COPY ./app/pages/package.json .
RUN npm i --no-scripts

FROM base as build_pages
COPY ./app/pages .
COPY --from=deps_pages /home/node/app/node_modules ./node_modules
RUN npm run build

FROM base AS deps_home
COPY ./app/home/package.json .
RUN npm i --no-scripts

FROM base as build_home
COPY ./app/home .
COPY --from=deps_home /home/node/app/node_modules ./node_modules
RUN npm run build

FROM python:3.9 AS release

ENV POETRY_VERSION=1.1.11 \
  POETRY_HOME="/opt/poetry" \
  POETRY_NO_INTERACTION=1 \
  POETRY_VIRTUALENVS_CREATE=false

ENV POETRY_CACHE_DIR=/tmp/poetry_cache

ENV FLASK_RUN_HOST=0.0.0.0 \
  FLASK_RUN_PORT=5000

ENV ENVIRONMENT=dev

RUN apt-get update && \
  apt-get install -y && \
  pip3 install poetry

WORKDIR /home/flask/app

COPY --from=deps_pages /home/node/app/node_modules ./app/pages/node_modules
COPY --from=build_pages /home/node/app/build ./app/pages/build
COPY --from=deps_home /home/node/app/node_modules ./app/home/node_modules
COPY --from=build_home /home/node/app/build ./app/home/build

COPY ./ .  

RUN poetry install --no-root --no-dev && rm -rf $POETRY_CACHE_DIR

# --no-dev --only main 

EXPOSE 80

RUN mv .docker/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT [ "docker-entrypoint.sh" ]
