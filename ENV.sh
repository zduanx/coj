#!/bin/bash
sudo apt-get update

curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -

sudo apt-get install -y nodejs

sudo npm install -g nodemon

sudo apt-get install git