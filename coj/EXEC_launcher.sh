#!/bin/bash

fuser -k 5000/tcp

cd ./executor
pip3 install -r requirements.txt
python3 executor_server.py &