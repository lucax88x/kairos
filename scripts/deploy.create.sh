#!/bin/bash

HOTFIX=${1}
CURRENT_VERSION=`./scripts/version.read.sh`

echo "Current version is $CURRENT_VERSION, please input the new version"
read -p "" VERSION

if [ -z "$(git status --porcelain)" ]; then
  git fetch

  git checkout -b temp

  if [ "$HOTFIX" = "hotfix" ]; then
    SOURCE_BRANCH=master;
    TARGET_BRANCH_FOLDER=hotfix;
    echo Creating Hotfix to $SOURCE_BRANCH
  else
    SOURCE_BRANCH=develop;
    TARGET_BRANCH_FOLDER=release;
    echo Creating Release to $SOURCE_BRANCH
  fi

  # CREATE TARGET BRANCH
  git branch -D $SOURCE_BRANCH
  git checkout -b $SOURCE_BRANCH --track origin/$SOURCE_BRANCH
  git checkout -b $TARGET_BRANCH_FOLDER/$VERSION

  # BUMP VERSION
  yarn version --new-version $VERSION --no-git-tag-version
  git add package.json
  git commit -m "Bumped version to $VERSION"

  # PUSHES TARGET BRANCH
  git push origin $TARGET_BRANCH_FOLDER/$VERSION

  git branch -D temp

  echo "Now you can commit your stuffs in this branch, once done create PR to develop AND master"
else
  echo "Working directory not clean!" && exit 1;
fi
