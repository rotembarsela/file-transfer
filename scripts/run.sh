#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: ./run.sh <dev|prod>"
  exit 1
fi

ENVIRONMENT=$1

if [ "$ENVIRONMENT" == "dev" ]; then
  export BUILD_TARGET=dev
  export NODE_ENV=development
  PROFILE="dev"
elif [ "$ENVIRONMENT" == "prod" ]; then
  export BUILD_TARGET=prod
  export NODE_ENV=production
  PROFILE="prod"
else
  echo "Invalid environment specified. Use 'dev' or 'prod'."
  exit 1
fi

echo "Running in $ENVIRONMENT mode..."
docker compose --profile $PROFILE up --build