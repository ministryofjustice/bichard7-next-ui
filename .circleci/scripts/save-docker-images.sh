#!/bin/sh

echo "Saving nodejs-20-2023"
docker images save -o "images/nodejs-20-2023" "nodejs-20-2023"

echo "Saving user-service"
docker images save -o "images/user-service" "user-service"

echo "Saving nginx-auth-proxy"
docker images save -o "images/nginx-auth-proxy" "nginx-auth-proxy"

echo "Finished saving"
