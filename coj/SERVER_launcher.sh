#!/bin/bash

fuser -k 3000/tcp
service nginx start

cd ./oj-server
nodemon server.js &

service nginx stop