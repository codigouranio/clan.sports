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

FROM python:3.11 AS builder

WORKDIR /home/flask/app

RUN apt-get update && \
  apt-get install -y && \
  pip3 install poetry

COPY ./pyproject.toml .  
RUN poetry export -f requirements.txt --output requirements.txt

FROM python:3.11-alpine as release

ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG AWS_DEFAULT_REGION

EXPOSE 80

WORKDIR /home/flask/app

ENV AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
  AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
  AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION}

ENV FLASK_RUN_HOST=0.0.0.0 \
  FLASK_RUN_PORT=5000

ENV ENVIRONMENT=dev

RUN apk update && \
  apk add --no-cache build-base \
  musl-dev linux-headers && \
  apk add uwsgi-python3

RUN pip install --upgrade pip
RUN pip install flask

COPY --from=builder /home/flask/app/requirements.txt ./
RUN pip install -r requirements.txt

COPY --from=build_pages /home/node/app/build ./app/pages/build
COPY --from=build_home /home/node/app/build ./app/home/build

COPY . ./

# RUN pip install alembic
RUN mkdir -p instance/
RUN alembic upgrade head

COPY .docker/docker-entrypoint.sh .

RUN mv .docker/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT [ "docker-entrypoint.sh" ]
