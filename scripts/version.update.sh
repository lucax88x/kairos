#!/bin/bash

BUILD_ID=${1:-'dev'}

VERSION=$(./scripts/version.read.sh $BUILD_ID)

sh ./scripts/version.write.sh $VERSION

