#!/bin/bash
[ -z $1 ] && echo "Build id is missing" && exit 1

BUILD_ID=$1
LAST_TAG=`git describe --abbrev=0`
CURRENT_TAG=`git describe`

LAST_TAG="${LAST_TAG:-0.0.1}"
CURRENT_TAG="${CURRENT_TAG:-0.0.0}"

echo last tag is ${LAST_TAG} 
echo current tag is ${CURRENT_TAG}

if [ $LAST_TAG = $CURRENT_TAG ];
then
    echo Tags equalling, Production build 
    VERSION="${LAST_TAG}.${BUILD_ID}"
else
    echo Tags are Different, Development build
    VERSION="${LAST_TAG}.${BUILD_ID}-dev"
fi

echo Writing version as $VERSION

echo "{ \"version\": \"${VERSION}\" }" > src/kairos.app/src/version.json
