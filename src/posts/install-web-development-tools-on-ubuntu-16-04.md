---
title: "Install Web Development Tools on Ubuntu"
date: 2026-06-18
description: "Set up Git, Node.js, npm, Composer, and other essential web development tools on Ubuntu."
tags: ["Ubuntu", "Git", "Node.js", "Web Development"]
status: published
---

Setting up a web development environment on Ubuntu from scratch can feel tedious. This guide walks through installing the most common tools you will need, along with basic configuration for Git and SSH.

## Git

Git is the version control system used by almost every development team. Install it with apt:

```bash
sudo apt-get update
sudo apt-get install git
```

Once installed, configure your identity so commits are attributed to you:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

## Node.js and npm

Node.js lets you run JavaScript outside the browser, and npm is its package manager. The Ubuntu repositories may have an older version, so use the NodeSource repository for the latest LTS release:

```bash
sudo apt-get install nodejs npm
```

If `node` is not found after installation, create a symlink:

```bash
sudo ln -s /usr/bin/nodejs /usr/bin/node
```

Verify the installation:

```bash
node --version
npm --version
```

## Composer (for PHP)

Composer is the dependency manager for PHP projects. Install it globally:

```bash
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

## PHP CodeSniffer

PHP CodeSniffer checks your PHP code against coding standards. Install it through PEAR:

```bash
sudo pear install --alldeps php_codesniffer
```

## Build Tools: Grunt, Gulp, and Bower

These tools automate tasks like minification, compilation, and package management. Install them globally with npm:

```bash
sudo npm install -g grunt-cli
sudo npm install --global gulp
sudo npm install -g bower
```

## WP-CLI (for WordPress)

If you work with WordPress, WP-CLI lets you manage installations from the command line:

```bash
curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
chmod +x wp-cli.phar
sudo mv wp-cli.phar /usr/local/bin/wp
```

## SSH Key Setup

SSH keys let you authenticate with GitHub and remote servers without entering a password each time.

Generate a key if you do not already have one:

```bash
if [ ! -f ~/.ssh/id_rsa ]; then
  ssh-keygen -f ~/.ssh/id_rsa -N ""
else
  echo "SSH key already exists"
fi
```

Copy the public key to your clipboard and add it to GitHub or your server:

```bash
cat ~/.ssh/id_rsa.pub
```

## Wrapping Up

With Git, Node.js, npm, and your SSH key in place, you have the foundation for most web development workflows. Add Composer if you work with PHP, and WP-CLI if you manage WordPress sites. From here you can install framework-specific tools as your projects require.
