#!/bin/bash

echo "-- start --"

HOME_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

DIST_DIR=${HOME_DIR}/docs/.vuepress/dist

PRODUCTION_DIR=${HOME_DIR}/production

cd ${HOME_DIR}

echo " --- reset to HEAD --- "
sudo git reset --hard HEAD

echo " --- pull from git server --- "
sudo git pull

echo " --- npm install --- "
sudo cnpm install

echo " --- npm run build --- "
sudo npm run docs:build

echo " --- move to production folder --- "
if [[ ! -d "$PRODUCTION_DIR" ]] ; then
    mkdir -p ${PRODUCTION_DIR}
fi
cp -rf ${DIST_DIR}/* ${PRODUCTION_DIR}

echo " --- finish updating! --- "
