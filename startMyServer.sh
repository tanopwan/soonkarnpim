#!/bin/bash
app_path=/Users/Nopwan/Soonkarnpim

#Kill process before start MONGOD & NODE
check_to_kill="$(ps aux| grep mongo | grep root)"
if [ -n "${check_to_kill}" ]
then
	sudo pkill mongod
	pkill node
	sleep 5
	echo "[COMPLETE] kill process mongod & node" 
fi

git remode add origin https://github.com/tanopwan/soonkarnpim.git
git pull

#START MONGOD
sudo mongod&
sleep 10

#START NODE, but check if MONGOD is running or not
check_mongod="$(ps aux| grep mongo | grep root)"
if [ -n "${check_mongod}" ]
then
	node $app_path/app.js&
	echo "[COMPLETE] Mongod started"
else
	echo "[ERROR] Mongod haven't start"
fi
