#!/usr/bin/env bash

set -e

echo `date`

cd ~/bichard7-next-core
echo $PWD

RETRIES=1
until SKIP_IMAGES=ui npm run all-legacy
do
    if [[ $RETRIES -gt 3 ]]; then break; fi
    sleep 10
    echo "Removing Beanconnect and PNC..."
    docker rm -f bichard-beanconnect-1 bichard-pnc-1
    sleep 1
    echo "Retrying, attempt $RETRIES ..."
    ((RETRIES++))
done
