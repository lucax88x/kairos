#!/bin/bash

BUILD_ID=$1
PACKAGE_VERSION=$(sed -n 's/.*"version": "\([0-9.]*\)",/\1/p' package.json)

if [ -z "$PACKAGE_VERSION" ];
then
    PACKAGE_VERSION="0.0.0"
fi

if [ -z "$BUILD_ID" ];
then
    echo "$PACKAGE_VERSION"
else
    echo "$PACKAGE_VERSION.$BUILD_ID"
fi