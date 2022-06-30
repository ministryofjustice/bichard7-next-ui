#!/usr/bin/env bash

set -e

readonly DOCKER_REFERENCE="nginx-nodejs-supervisord"

function has_local_image() {
  IMAGES=$(docker images --filter=reference="${DOCKER_REFERENCE}:*" -q | wc -l)
  echo "${IMAGES}"
}

function pull_and_build_from_aws() {
  FETCHED_AWS_ACCOUNT_ID=$(aws sts get-caller-identity \
      --query 'Account' \
      --output text \
      2> /dev/null
  )

  AWS_STATUS=$?
  if [[ $AWS_STATUS -ne 0 ]]; then
      echo "Unable to authenticate with AWS - are you running this with aws-vault?" >&2
      exit $AWS_STATUS
  fi

  set -e

  echo "Building ui docker image on `date`"

  if [[ -z "${AWS_ACCOUNT_ID}" ]]; then
      AWS_ACCOUNT_ID=$FETCHED_AWS_ACCOUNT_ID
  fi

  aws ecr get-login-password --region eu-west-2 | docker login \
      --username AWS \
      --password-stdin \
      "${AWS_ACCOUNT_ID}.dkr.ecr.eu-west-2.amazonaws.com"

  # Get our latest staged nodejs image
  IMAGE_HASH=$(aws ecr describe-images --repository-name "${DOCKER_REFERENCE}" | jq '.imageDetails|sort_by(.imagePushedAt)[-1].imageDigest' | tr -d '"')

  DOCKER_IMAGE_HASH="${AWS_ACCOUNT_ID}.dkr.ecr.eu-west-2.amazonaws.com/${DOCKER_REFERENCE}@${IMAGE_HASH}"


if [ $(arch) = "arm64" ]
then
    echo "Building for ARM(emulated linux/amd64)"
    docker build --build-arg "BUILD_IMAGE=${DOCKER_IMAGE_HASH}" --platform=linux/amd64 -t ui .
else
    echo "Building regular image"
    docker build --build-arg "BUILD_IMAGE=${DOCKER_IMAGE_HASH}" -t ui .
fi

  if [[ -n "${CODEBUILD_RESOLVED_SOURCE_VERSION}" && -n "${CODEBUILD_START_TIME}" ]]; then

      ## Install goss/trivy
      curl -L https://github.com/aelsabbahy/goss/releases/latest/download/goss-linux-amd64 -o /usr/local/bin/goss
      chmod +rx /usr/local/bin/goss
      curl -L https://github.com/aelsabbahy/goss/releases/latest/download/dgoss -o /usr/local/bin/dgoss
      chmod +rx /usr/local/bin/dgoss

      export GOSS_PATH="/usr/local/bin/goss"

      install_trivy() {
        echo "Pulling trivy binary from s3"
        aws s3 cp \
          s3://"${ARTIFACT_BUCKET}"/trivy/binary/trivy_latest_Linux-64bit.rpm \
          .

        echo "Installing trivy binary"
        rpm -ivh trivy_latest_Linux-64bit.rpm
      }

      pull_trivy_db() {
        echo "Pulling trivy db from s3..."
        aws s3 cp \
          s3://"${ARTIFACT_BUCKET}"/trivy/db/trivy-offline.db.tgz \
          trivy/db/

        echo "Extracting trivy db to `pwd`/trivy/db/"
        tar -xvf trivy/db/trivy-offline.db.tgz -C trivy/db/
      }

      mkdir -p trivy/db
      install_trivy
      pull_trivy_db

      ## Run goss tests
      GOSS_SLEEP=15 dgoss run -e DB_HOST=172.17.0.1 "ui:latest"
      ## Run Trivy scan
      TRIVY_CACHE_DIR=trivy trivy image \
        --exit-code 1 \
        --severity "CRITICAL" \
        --skip-update "ui:latest" # we have the most recent db pulled locally

      docker tag \
          ui:latest \
          ${AWS_ACCOUNT_ID}.dkr.ecr.eu-west-2.amazonaws.com/ui:${CODEBUILD_RESOLVED_SOURCE_VERSION}-${CODEBUILD_START_TIME}

      echo "Push docker image on `date`"
      docker push \
          ${AWS_ACCOUNT_ID}.dkr.ecr.eu-west-2.amazonaws.com/ui:${CODEBUILD_RESOLVED_SOURCE_VERSION}-${CODEBUILD_START_TIME} | tee /tmp/docker.out
      export IMAGE_SHA_HASH=$(cat /tmp/docker.out | grep digest | cut -d':' -f3-4 | cut -d' ' -f2)

      if [ "${IS_CD}" = "true" ]; then
        cat <<EOF>/tmp/ui.json
        {
          "source-hash" : "${CODEBUILD_RESOLVED_SOURCE_VERSION}",
          "build-time": "${CODEBUILD_START_TIME}",
          "image-hash": "${IMAGE_SHA_HASH}"
        }
EOF
        aws s3 cp /tmp/ui.json s3://${ARTIFACT_BUCKET}/semaphores/ui.json
        export UI_HASH="${IMAGE_SHA_HASH}"
      fi
  fi
}

if [[ "$(has_local_image)" -gt 0 ]]; then
  if [ $(arch) = "arm64" ]
  then
      echo "Building for ARM"
      docker build --platform=linux/amd64 -t ui:latest .
  else
      echo "Building regular image"
      docker build -t ui:latest .
  fi
else
  pull_and_build_from_aws
fi
