#!/usr/bin/env bash

set -e

echo `date`

cd ~/bichard7-next-core
echo $PWD

RETRIES=1
until docker compose -f environment/docker-compose.yml build message-forwarder
do
    if [[ $RETRIES -gt 3 ]]; then break; fi
    sleep 10
    echo "Retrying, attempt $RETRIES ..."
    ((RETRIES++))
done
