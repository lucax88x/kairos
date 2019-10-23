#!/bin/bash

ENVIRONMENT=${2:-'DEV'}

case $ENVIRONMENT in
    LOCAL)
        REGISTRY='192.168.205.100'
        USERNAME='test'
        PASSWORD='test'
    ;;
    *)
        echo Wrong Environment $ENVIRONMENT
        exit 1
    ;;
esac

docker login $REGISTRY --username $USERNAME --password $PASSWORD