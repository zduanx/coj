#!/bin/bash

fuser -k 5000/tcp

cd ./executor
pip3 install -r requirements.txt
sudo python3 executor_server.py &