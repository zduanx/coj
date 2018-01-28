sudo wget http://nginx.org/keys/nginx_signing.key

sudo apt-key add nginx_signing.key

(For ubuntu 16.04) Add following two lines into /etc/apt/sources.list

deb http://nginx.org/packages/ubuntu/ xenial nginx

deb-src http://nginx.org/packages/ubuntu/ xenial nginx

Then run:

sudo apt-get update

sudo apt-get install nginx

-----------------------------------

put following line in /etc/hosts

127.0.0.1 executor

-----------------------------------

sudo /bin/mkdir -p /etc/nginx/sites-available;

sudo /bin/mkdir -p /etc/nginx/sites-enabled

copy file 'executor' to /etc/nginx/sites-available 

sudo /bin/cp -f executor /etc/nginx/sites-available

modify server list in /etc/nginx/sites-available/executor

sudo /bin/ln -s /etc/nginx/sites-available/executor /etc/nginx/sites-enabled/

modify last line in /etc/nginx/nginx.conf to
include /etc/nginx/sites-enabled/*;

-----------------------------------