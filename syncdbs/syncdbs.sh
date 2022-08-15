#!/bin/sh

if [ -z "$1" ]
then
  echo "Please select a server."
else
  rsync $1:/root/bill-godfrey/data_dump/production ~/db_dump
  rsync $1:/root/bill-godfrey/data_dump/stage ~/dev_db_dump
fi
