#!/bin/bash

VERSION=${1:-'0.0.0'}
ENVIRONMENT=${2:-'DEV'}

case $ENVIRONMENT in
    LOCAL)
        REGISTRY='192.168.205.100'
        WRITE_DB_CONNECTIONSTRING='ConnectTo=tcp:\/\/admin:changeit@event-store:1113; HeartBeatTimeout=500'
        READ_DB_ENDPOINT='redis'
        READ_DB_DATABASE='1'
        AUTH_DOMAIN='https:\/\/kairos.eu.auth0.com\/'
        AUTH_AUDIENCE='http:\/\/localhost:3000'
    ;;
    PROD)
        REGISTRY='registry.kairos.rocks'
        WRITE_DB_CONNECTIONSTRING='ConnectTo=tcp:\/\/admin:changeit@event-store:1113; HeartBeatTimeout=500'
        READ_DB_ENDPOINT='redis'
        READ_DB_DATABASE='1'
        AUTH_DOMAIN='https:\/\/kairos.eu.auth0.com\/'
        AUTH_AUDIENCE='https:\/\/kairos.rocks'
    ;;
    *)
        echo Wrong Environment $ENVIRONMENT
        exit 1
    ;;
esac

# # copy regcred made by our k8s bare-metal
# kubectl get secret regcred --namespace=default -o yaml |\
#    kubectl apply --namespace=kairos -f -

kubectl apply -f k8s/kairos/kairos.namespace.yaml

kubectl apply -f k8s/kairos/kairos.rbac.yaml
kubectl apply -f k8s/kairos/kairos-tls.secret.yaml
kubectl apply -f k8s/kairos/letsencrypt.job.yaml
kubectl apply -f k8s/kairos/letsencrypt.service.yaml

kubectl apply -f k8s/kairos/kairos.redis.persistent-volume.yaml
kubectl apply -f k8s/kairos/kairos.redis.deployment.yaml
kubectl apply -f k8s/kairos/kairos.redis.service.yaml

kubectl apply -f k8s/kairos/kairos.event-store.persistent-volume.yaml
kubectl apply -f k8s/kairos/kairos.event-store.deployment.yaml
kubectl apply -f k8s/kairos/kairos.event-store.service.yaml

sed \
-e "s/%REGISTRY/$REGISTRY/g" \
-e "s/%VERSION/$VERSION/g" \
k8s/kairos/kairos.web-app.deployment.yaml | kubectl apply -f -
kubectl apply -f k8s/kairos/kairos.web-app.service.yaml

kubectl apply -f k8s/kairos/kairos.web-api.persistent-volume.yaml

sed \
-e "s/%READ_DB_ENDPOINT/$READ_DB_ENDPOINT/g" \
-e "s/%READ_DB_DATABASE/$READ_DB_DATABASE/g" \
-e "s/%AUTH_DOMAIN/$AUTH_DOMAIN/g" \
-e "s/%AUTH_AUDIENCE/$AUTH_AUDIENCE/g" \
k8s/kairos/kairos.web-api.config-map.yaml | kubectl apply -f -

sed \
-e "s/%WRITE_DB_CONNECTIONSTRING/$WRITE_DB_CONNECTIONSTRING/g" \
k8s/kairos/kairos.web-api.secret.yaml | kubectl apply -f -

sed \
-e "s/%REGISTRY/$REGISTRY/g" \
-e "s/%VERSION/$VERSION/g" \
k8s/kairos/kairos.web-api.deployment.yaml | kubectl apply -f -

kubectl apply -f k8s/kairos/kairos.web-api.service.yaml

kubectl apply -f k8s/kairos/kairos.ingress.yaml