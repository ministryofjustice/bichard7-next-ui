#!/bin/sh

echo "Installing Cypress..."

# Install Cypress dependencies
sudo apt-get update
sudo apt-get install libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb -y

# Install Cypress
npx cypress install

touch cypressInstalled
