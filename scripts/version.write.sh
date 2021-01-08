#!/bin/bash
[ -z $1 ] && echo "Version is missing" && exit 1

FULL_VERSION=$1

echo "Writing version as $FULL_VERSION"

echo "{ \"version\": \"$FULL_VERSION\" }" > ./src/kairos.app/version.json
echo "VERSION=$FULL_VERSION" > ./.env
