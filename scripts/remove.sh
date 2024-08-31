#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: ./remove.sh <dev|prod>"
  exit 1
fi

ENVIRONMENT=$1

if [ "$ENVIRONMENT" == "dev" ]; then
  PROFILE="dev"
elif [ "$ENVIRONMENT" == "prod" ]; then
  PROFILE="prod"
else
  echo "Invalid environment specified. Use 'dev' or 'prod'."
  exit 1
fi

echo "Stopping and removing $ENVIRONMENT environment..."
docker compose --profile $PROFILE down

# Optionally, if you want to remove volumes as well, uncomment the line below:
# docker compose --profile $PROFILE down -v