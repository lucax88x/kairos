#!/bin/bash

VERSION=${1:-'0.0.0'}
ENVIRONMENT=${2:-'DEV'}

case $ENVIRONMENT in
    LOCAL)
        REGISTRY='192.168.205.100'
    ;;
    *)
        echo Wrong Environment $ENVIRONMENT
        exit 1
    ;;
esac

curl https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/static/mandatory.yaml -o ingress-nginx.yaml
sed \
-e "s/namespace: ingress-nginx/namespace: kairos/g" \
-e "s/app.kubernetes.io\/part-of: ingress-nginx/app.kubernetes.io\/part-of: kairos/g" \
-e "s/- --configmap=\$(POD_NAMESPACE)\/nginx-configuration/- --ingress-class=kairos-nginx\r\n            - --configmap=\$(POD_NAMESPACE)\/nginx-configuration/g" \
ingress-nginx.yaml | kubectl apply -f -
kubectl apply -f k8s/kairos//ingress-nginx.service.yaml

kubectl apply -f k8s/kairos/kairos.namespace.yaml

sed \
-e "s/%REGISTRY/$REGISTRY/g" \
-e "s/%VERSION/$VERSION/g" \
k8s/kairos/kairos.web-app.deployment.yaml | kubectl apply -f -

kubectl apply -f k8s/kairos/kairos.web-app.service.yaml

kubectl apply -f k8s/kairos/kairos.ingress.yaml