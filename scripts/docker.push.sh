#!/bin/bash

VERSION=${1:-'0.0.0'}
ENVIRONMENT=${2:-'LOCAL'}

case $ENVIRONMENT in
    LOCAL)
        REGISTRY='192.168.205.100'
    ;;
    PROD)
        REGISTRY='registry.kairos.rocks'
    ;;
    *)
        echo Wrong Environment $ENVIRONMENT
        exit 1
    ;;
esac

echo pushing ${VERSION} to registry ${REGISTRY}

docker push ${REGISTRY}/kairos/web.app:${VERSION}
# docker push ${REGISTRY}/kairos/web.api:${VERSION}

docker tag ${REGISTRY}/kairos/web.app:${VERSION} ${REGISTRY}/kairos/web.app:latest
# docker tag ${REGISTRY}/kairos/web.api:${VERSION} ${REGISTRY}/kairos/web.api:latest

docker push ${REGISTRY}/kairos/web.app:latest
# docker push ${REGISTRY}/kairos/web.api:latest

echo pushed