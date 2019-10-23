#!/bin/bash

VERSION=${1:-'0.0.0'}
ENVIRONMENT=${2:-'DEV'}

case $ENVIRONMENT in
    LOCAL)
        REGISTRY='192.168.205.100'
        WRITE_DB_CONNECTIONSTRING='ConnectTo=tcp://admin:changeit@eventstore:1113; HeartBeatTimeout=500'
        READ_DB_ENDPOINT='redis'
        READ_DB_DATABASE='1'
        AUTH_DOMAIN='https://kairos.eu.auth0.com/'
        AUTH_AUDIENCE='http://localhost:3000'
    ;;
    *)
        echo Wrong Environment $ENVIRONMENT
        exit 1
    ;;
esac

kubectl apply -f k8s/kairos/kairos.namespace.yaml

curl https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/static/mandatory.yaml -o ingress-nginx.yaml
sed \
-e "s/namespace: ingress-nginx/namespace: kairos/g" \
-e "s/app.kubernetes.io\/part-of: ingress-nginx/app.kubernetes.io\/part-of: kairos/g" \
-e "s/- --configmap=\$(POD_NAMESPACE)\/nginx-configuration/- --ingress-class=kairos-nginx\r\n            - --configmap=\$(POD_NAMESPACE)\/nginx-configuration/g" \
ingress-nginx.yaml | kubectl apply -f -

kubectl apply -f k8s/kairos/ingress-nginx.service.yaml
kubectl apply -f kis/kairos/letsencrypt.staging.issuer.yaml
kubectl apply -f kis/kairos/kairos.redis.persitent-volume.yaml
kubectl apply -f kis/kairos/kairos.redis.deployment.yaml
kubectl apply -f kis/kairos/kairos.redis.service.yaml

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

# clean
rm ingress-nginx.yaml