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

# FROM python:3.11-alpine as release
FROM python:3.11-slim-buster as release

ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG AWS_DEFAULT_REGION
ARG SEC_REPO_TOKEN

EXPOSE 80

WORKDIR /home/flask/app

RUN apt-get update && \
  apt-get install -y gcc g++ cmake make git 
# pip install "polars==1.12.0" "pyarrow==12.0.1" --prefer-binary

ENV AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
  AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
  AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION} \
  SEC_REPO_TOKEN=${SEC_REPO_TOKEN}

ENV REPO_DATABASE_URL=${REPO_DATABASE_URL}

ENV FLASK_RUN_HOST=0.0.0.0 \
  FLASK_RUN_PORT=5000

ENV GIT_PYTHON_GIT_EXECUTABLE /usr/bin/git

ENV ENVIRONMENT=dev

# Install necessary build dependencies
# RUN apk add --no-cache \
#   build-base \
#   linux-headers \
#   musl-dev \
#   libffi-dev \
#   libressl-dev \
#   openblas-dev \
#   cmake \
#   git \
#   wget
# cargo \
# rust

# RUN apk update \
#   && \
#   apk add wget

# RUN wget -Oinit.sh https://sh.rustup.rs && \
#   sh init.sh -y && \
#   rm init.sh

# ENV PATH="/root/.cargo/bin:${PATH}"

# RUN rustup install nightly && \
#   rustup default nightly

# RUN pip install --no-cache-dir 'polars[numpy,pandas]>=1.12.0' --prefer-binary  
# RUN pip install "polars==1.12.0" "pyarrow==12.0.1" --prefer-binary

# ENV RUSTFLAGS="-C target-feature=-crt-static"  

# RUN cargo add polars -F lazy

# RUN apk update && \
#   apk add --no-cache build-base musl-dev linux-headers && \
#   apk add --no-cache uwsgi-python3 git openssh curl cmake


# Install necessary build dependencies
# RUN apk add --no-cache \
#   build-base \
#   linux-headers \
#   musl-dev \
#   libffi-dev \
#   libressl-dev \
#   openblas-dev \
#   # Add other libraries that may be needed for your project
#   && apk add --no-cache --virtual .build-deps \
#   gcc \
#   g++ \
#   make \
#   cmake \
#   cargo \
#   rust

# RUN apk add --no-cache \
#   build-base \
#   linux-headers \
#   musl-dev \
#   libffi-dev \
#   libressl-dev \
#   openblas-dev \
#   cmake \
#   git \
#   cargo \
#   rust

# RUN curl https://sh.rustup.rs -sSf | sh -s -- -y --default-toolchain nightly && \
#   source $HOME/.cargo/env

# Set environment path for Rust
# ENV PATH="/root/.cargo/bin:${PATH}"  

# RUN pip install --no-cache-dir hashbrown
# RUN pip install --no-cache-dir itertools
# Install polars and any required extras
# RUN pip install --no-cache-dir 'polars[numpy]==1.1.0' --prefer-binary

# Clean up build dependencies
# RUN apk del .build-deps


RUN pip install --upgrade pip
RUN pip install flask

COPY --from=builder /home/flask/app/requirements.txt ./
RUN pip install -r requirements.txt --no-cache-dir

COPY --from=build_pages /home/node/app/build ./app/pages/build
COPY --from=build_home /home/node/app/build ./app/home/build

COPY . ./

# RUN pip install alembic
RUN mkdir -p instance/
RUN alembic upgrade head

COPY .docker/docker-entrypoint.sh .

RUN mkdir -p /root/.ssh
RUN ssh-keyscan github.com >> /root/.ssh/known_hosts

RUN mv .docker/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT [ "docker-entrypoint.sh" ]
