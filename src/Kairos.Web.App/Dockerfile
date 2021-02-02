FROM node:14-alpine as app-compiler

COPY . /build

WORKDIR /build

RUN yarn --frozen-lockfile

WORKDIR /build/src/kairos.app

RUN yarn --frozen-lockfile

WORKDIR /build

RUN yarn frontend:publish

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS server-compiler
    
COPY --from=app-compiler /build ./build

WORKDIR /build/src/Kairos.Web.App

RUN dotnet restore
RUN dotnet publish --no-restore -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:5.0

COPY --from=server-compiler /build/src/Kairos.Web.App/out ./Kairos.Web.App

WORKDIR /Kairos.Web.App

ENTRYPOINT ["dotnet", "Kairos.Web.App.dll"]
