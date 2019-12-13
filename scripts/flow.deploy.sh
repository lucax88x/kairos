#!/bin/bash

if [ -z $1 ] ; then
    LAST_TAG=`git describe --abbrev=0`

    echo "Version Needed! (last tag: ${LAST_TAG})" && exit 1;
fi

VERSION=${1}

git fetch
git branch -D develop
git branch -D master

git checkout -b develop --track origin/develop
git checkout -b master --track origin/master

# disables interaction
export GIT_MERGE_AUTOEDIT=no
git flow release start $VERSION
git flow release finish -m '${VERSION}' $VERSION
# enables interaction back
unset GIT_MERGE_AUTOEDIT

# push tag
git push origin $VERSION

# push develop
git checkout develop
git push -u origin develop

# push master
git checkout master
git push -u origin master