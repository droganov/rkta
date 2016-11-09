#!/usr/bin/dumb-init /bin/sh

set -e

echo -n "waiting for mongo and elastic "

while ! nc -w 1 mongo 27017 2>/dev/null
do
  echo -n .
  sleep 1
done

while ! nc -w 1 elastic 9200 2>/dev/null
do
  echo -n .
  sleep 1
done

echo 'starting connector'

exec mongo-connector --stdout -n sdlk-rkta.classy -e _type -m mongodb://mongo:27017/docker -t http://elastic:9200 -d elastic2_doc_manager
