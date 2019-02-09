#!/bin/bash
sudo --validate

git fetch
git reset --hard origin/master

npm i
npm run build

./server/scripts/deploy_nginx.sh

sudo rm -rf public-live/
sudo mv public/ public-live/

./server/scripts/rolling_restart.sh
