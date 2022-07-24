#!/bin/sh

rsync gtyProd:/var/www/db_dump/* ~/db_dump
rsync gtyProd:/var/www/dev_db_dump/* ~/dev_db_dump
