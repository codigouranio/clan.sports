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

FROM python:3.12 AS builder

WORKDIR /home/flask/app

RUN apt-get update && \
  apt-get install -y && \
  pip3 install poetry && \
  poetry self add poetry-plugin-export

COPY ./pyproject.toml .  
RUN poetry export -f requirements.txt --output requirements.txt

# FROM python:3.11-alpine as release
FROM python:3.11-slim as release

ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG AWS_DEFAULT_REGION
ARG SEC_REPO_TOKEN

EXPOSE 80

WORKDIR /home/flask/app

RUN apt-get update
RUN apt-get install -y --no-install-recommends build-essential \
  openssh-client \
  musl-dev \
  libffi-dev \
  libssl-dev \
  libopenblas-dev \
  openssl \
  uwsgi-plugin-python3 \
  libpcre3 \
  libpcre3-dev \
  cmake \
  git

RUN apt-get clean && \
  rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip

ENV AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
  AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
  AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION} \
  SEC_REPO_TOKEN=${SEC_REPO_TOKEN}

ENV REPO_DATABASE_URL=${REPO_DATABASE_URL}

ENV FLASK_RUN_HOST=0.0.0.0 \
  FLASK_RUN_PORT=5000

ENV GIT_PYTHON_GIT_EXECUTABLE /usr/bin/git

ENV ENVIRONMENT=dev

COPY --from=builder /home/flask/app/requirements.txt ./
RUN pip install -r requirements.txt --no-cache-dir

COPY --from=build_pages /home/node/app/build ./app/pages/build
COPY --from=build_home /home/node/app/build ./app/home/build

COPY . ./

RUN mkdir -p instance/
RUN alembic upgrade head

COPY .docker/docker-entrypoint.sh .

RUN mkdir -p /root/.ssh
RUN ssh-keyscan github.com >> /root/.ssh/known_hosts

RUN mv .docker/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT [ "docker-entrypoint.sh" ]
