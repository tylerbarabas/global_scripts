#!/bin/sh

rsync gty1:/var/www/db_dump/* ~/db_dump
rsync gty1:/var/www/dev_db_dump/* ~/dev_db_dump
