FOR WEB_SERVER:

# setup environment
sudo bash SERVER_ENV.sh

# setup nginx
follow guide in nginx/README.md

# run server
sudo bash SERVER_launcher.sh

-------------------------------------------------------------

FOR EXECUTOR SERVER:

# setup environment
sudo bash EXEC_ENV.sh

# need to re-login your system
# to enable sudo docker mode

# run server
sudo bash EXEC_launcher.sh