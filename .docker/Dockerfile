# docker build --progress=plain --no-cache -t clan-sports-app:latest -f .docker/Dockerfile .
# docker inspect --format '{{.Confing.Env}}'
# docker run -p 3000:3000 clan-sports-app 
# conda env export > environment_droplet.yml
# conda env create -f environment.yml
# docker run -p 3000:3000 clan-sports-app  
# docker run -i -t clan-sports-app:latest /bin/bash

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

FROM base AS deps_react_app
COPY ./app/react_app/package.json .
RUN npm i --no-scripts

FROM base as build_react_app
COPY ./app/react_app .
COPY --from=deps_react_app /home/node/app/node_modules ./node_modules
RUN npm run build

FROM python:3.9 AS release

ENV POETRY_VERSION=1.1.11 \
  POETRY_HOME="/opt/poetry" \
  POETRY_NO_INTERACTION=1 \
  POETRY_VIRTUALENVS_CREATE=false

# ENV POETRY_CACHE_DIR=/tmp/poetry_cache

ENV FLASK_RUN_HOST=0.0.0.0 \
  FLASK_RUN_PORT=5000

ENV ENVIRONMENT=dev

RUN apt-get update && \
  apt-get install -y && \
  pip3 install poetry

WORKDIR /home/flask/app

COPY --from=deps_pages /home/node/app/node_modules ./app/pages/node_modules
COPY --from=build_pages /home/node/app/build ./app/pages/build
COPY --from=deps_react_app /home/node/app/node_modules ./app/react_app/node_modules
COPY --from=build_react_app /home/node/app/build ./app/react_app/build

COPY ./ .  
# && rm -rf $POETRY_CACHE_DIR
RUN poetry install --no-root --no-dev

# --no-dev --only main 

EXPOSE 3000

RUN mv .docker/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT [ "docker-entrypoint.sh" ]

# ENTRYPOINT ["uwsgi", "--ini", "./wsgi.ini"]





