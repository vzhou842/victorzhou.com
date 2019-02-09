#!/bin/bash
function restart() {
	uid="web-$1"
	echo ">>> Restarting $uid..."
	sudo forever restart $uid
}

restart 8000
sleep 8
restart 8001
