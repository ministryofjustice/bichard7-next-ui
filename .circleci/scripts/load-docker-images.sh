#!/bin/sh

echo "Loading UI"
docker image load < "images/ui:latest"

echo "Loading nodejs-20-2023"
docker image load < "images/nodejs-20-2023"

echo "Loading user-service"
docker image load < "images/user-service"

echo "Loading ngnix-auth-proxy"
docker image load < "images/nginx-auth-proxy"

echo "Loading message-forwarder"
docker image load < "images/message-forwarder"

echo "Loading audit-log-api"
docker image save < "images/audit-log-api"

echo "Loading event-handler"
docker image save < "images/event-handler"

echo "Finished loading"
