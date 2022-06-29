#!/usr/bin/env bash

set -e

if [ $(arch) = "arm64" ]
then
    echo "Building for ARM(emulated linux/amd64)"
    docker build --platform=linux/amd64 -t ui:latest .
else
    echo "Building regular image"
    docker build -t ui:latest .
fi
