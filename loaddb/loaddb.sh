#!/bin/sh
if [ -z "$1" ]
then
  echo "Please select a file"
else
  zcat $1 | sudo mysql -u root -p billgodfrey
fi
