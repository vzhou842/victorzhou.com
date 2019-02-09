function restart() {
	uid="web-$1"
	echo ">>> Restarting $uid..."
	sudo forever restart $uid
}

restart 8000
sleep 15
restart 8001
