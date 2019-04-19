#!/bin/bash
set -e
sudo cp ./server/nginx/nginx.conf /etc/nginx/nginx.conf
sudo service nginx restart
