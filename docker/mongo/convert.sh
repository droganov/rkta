#!/bin/sh

set -e

echo -n "waiting for mongo "

while ! nc -w 1 127.0.0.1 27017 2>/dev/null
do
  echo -n .
  sleep 1
done

echo ''
echo 'rs.initiate begin'

mongo '127.0.0.1:27017/sdlk-rkta' --eval "rs.initiate()" >> /dev/null

echo "rs.initiate done"
