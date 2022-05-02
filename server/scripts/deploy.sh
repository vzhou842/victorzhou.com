#!/bin/bash
sudo --validate

set -e

git fetch
git reset --hard origin/master

npm i --production=false # install devDeps too
npm run build

./server/scripts/deploy_nginx.sh

sudo rm -rf public-live/
sudo mv public/ public-live/

./server/scripts/rolling_restart.sh
