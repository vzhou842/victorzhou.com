#!/bin/bash
function start() {
	NODE_ENV='production' \
	PORT=$1 \
	forever --uid "web-$1" -o $2 -e $3 --append start server/server.js
}

start 8000 ./out1.log ./err1.log
start 8001 ./out2.log ./err2.log
