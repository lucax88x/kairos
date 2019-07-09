#!/bin/bash

if [ -z $1 ] ; then
    echo "Give a project name, without Prefix 'Kairos.'" && exit 1;
fi

PROJECT_NAME=${1}

dotnet new classlib \
-n "Kairos.$PROJECT_NAME" \
-f netstandard2.0 \
--langVersion 7.3 \
-o src/Kairos.$PROJECT_NAME \

dotnet add src/Kairos.$PROJECT_NAME package Autofac -v 4.9.2

dotnet new xunit \
-n "Kairos.$PROJECT_NAME.Tests" \
-f netcoreapp2.2 \
-o src/Kairos.$PROJECT_NAME.Tests

dotnet add src/Kairos.$PROJECT_NAME.Tests package Autofac -v 4.9.2
dotnet add src/Kairos.$PROJECT_NAME.Tests package NSubstitute -v 4.2.0
dotnet add src/Kairos.$PROJECT_NAME.Tests package FluentAssertions -v 5.7.0

dotnet sln src/Kairos.sln add src/Kairos.$PROJECT_NAME/Kairos.$PROJECT_NAME.csproj
dotnet sln src/Kairos.sln add src/Kairos.$PROJECT_NAME.Tests/Kairos.$PROJECT_NAME.Tests.csproj

