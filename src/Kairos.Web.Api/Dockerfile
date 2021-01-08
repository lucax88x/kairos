FROM mcr.microsoft.com/dotnet/sdk:5.0 AS server-compiler

COPY . /build

WORKDIR /build/src/Kairos.Web.Api

RUN dotnet restore
RUN dotnet publish --no-restore -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:5.0

COPY --from=server-compiler /build/src/Kairos.Web.Api/out ./Kairos.Web.Api

WORKDIR /Kairos.Web.Api

ENTRYPOINT ["dotnet", "Kairos.Web.Api.dll"]
