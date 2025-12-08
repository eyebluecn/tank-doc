#!/bin/bash

echo "-- start --"

HOME_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

DIST_DIR=${HOME_DIR}/docs/.vuepress/dist

PRODUCTION_DIR=${HOME_DIR}/production

cd ${HOME_DIR}

echo " --- reset to HEAD --- "
git reset --hard HEAD

echo " --- pull from git server --- "
git pull

echo " --- npm install --- "
cnpm install

echo " --- vuepress build docs --- "
./node_modules/.bin/vuepress build docs

echo " --- move to production folder --- "
if [[ ! -d "$PRODUCTION_DIR" ]] ; then
    mkdir -p ${PRODUCTION_DIR}
fi
cp -rf ${DIST_DIR}/* ${PRODUCTION_DIR}

echo " --- finish updating! --- "
