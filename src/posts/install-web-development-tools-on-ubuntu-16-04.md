---
title: "Install web development tools on Ubuntu 16.04"
date: 2026-07-23
tags: ["ubuntu", "git", "npm", "web developement"]
status: draft
---

#!/bin/bash

# Git
sudo apt-get -y install git

# Node.js
sudo apt-get -y install nodejs
sudo apt-get -y install npm
sudo ln -s /usr/bin/nodejs /usr/bin/node

# Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# PHP CodeSniffer
sudo pear install --alldeps php_codesniffer

# Bower
sudo npm install -g bower

# Grunt
sudo npm install -g grunt-cli

# Gulp
sudo npm install --global gulp

# WP CLI
curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
chmod +x wp-cli.phar
sudo mv wp-cli.phar /usr/local/bin/wp

# Configure SSH
echo "Creating SSH key..."

if [ ! -f ~/.ssh/id_rsa ]; then
	ssh-keygen -f ~/.ssh/id_rsa -N ""
else
	echo "SSH key already exists"
fi

# Configure Git
echo "Configuring git..."

git config --get user.name > /dev/null
if [ $? != 0 ]; then
	echo -n "Enter your name: "
	read name
	git config --global user.name "$name"
else
	echo "Name already set."
fi

git config --get user.email > /dev/null
if [ $? != 0 ]; then
	echo -n "Enter your email: "
	read email
	git config --global user.email "$email"
else
	echo "Email already set."
fi

# Finished
echo "Finished"