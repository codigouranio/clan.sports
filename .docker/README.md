# docker build --progress=plain --no-cache -t clan-sports-app:latest -f .docker/Dockerfile .
# docker inspect --format '{{.Confing.Env}}'
# docker run -p 3000:3000 clan-sports-app 
# docker run -i -t clan-sports-app:latest /bin/bash