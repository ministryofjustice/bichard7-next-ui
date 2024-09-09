#!/bin/sh

echo "Loading UI"
docker image load < "images/ui:latest"

echo "Loading nodejs-20-2023"
docker image load < "images/nodejs-20-2023"

echo "Loading user-service"
docker image load < "images/user-service"

echo "Loading ngnix-auth-proxy"
docker image load < "images/nginx-auth-proxy"

echo "Finished loading"
