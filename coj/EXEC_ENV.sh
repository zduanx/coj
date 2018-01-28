#!/bin/bash

curl -fsSL https://get.docker.com/ | sh

sudo usermod -aG docker $(whoami)

sudo apt-get update

sudo apt-get -y install python3-pip