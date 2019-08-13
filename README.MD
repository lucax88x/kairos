# KAIROS

# Environment variables

In order to fully run the backend locally, you need to set environment variables (you may need to login again / reboot)

## Ubuntu

```bash
sudo -H gedit /etc/environment
```

then manually write & save the following

```text
ASPNETCORE_ENVIRONMENT="development"

Kairos_WriteRepository__ConnectionString="ConnectTo=tcp://admin:changeit@localhost:1113; HeartBeatTimeout=500"
Kairos_ReadRepository__Database="1"
Kairos_ReadRepository__Endpoints__0="localhost"
Kairos_Auth__Domain="https://kairos.eu.auth0.com/"
Kairos_Auth__Audience="http://localhost:3000"
```
