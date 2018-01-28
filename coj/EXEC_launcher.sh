#!/bin/bash

fuser -k 5000/tcp

cd ./executor
pip3 install -r requirements.txt

export FLASK_APP=executor_server.py

flask run --host=0.0.0.0 &