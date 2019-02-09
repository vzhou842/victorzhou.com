sudo --validate
git fetch
git reset --hard origin/master
npm i
npm run build
./server/scripts/deploy_nginx.sh
./server/scripts/rolling_restart.sh
