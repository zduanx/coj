#!/bin/bash

fuser -k 3000/tcp
sudo service nginx start

cd ./oj-server
sudo node server.js &
