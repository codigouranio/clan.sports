# docker build --progress=plain --no-cache -t clan-sports-app:latest -f .docker/Dockerfile .
# docker inspect --format '{{.Confing.Env}}'
# docker run -p 3000:3000 clan-sports-app 
# docker run -i -t clan-sports-app:latest /bin/bash
# docker system prune --all --force
<!-- docker build --build-arg AWS_DEFAULT_REGION=us-east-1  --progress=plain --no-cache -t clan-sports-app:latest -f .docker/Dockerfile . -->