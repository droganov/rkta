#!/bin/sh

/root/convert.sh &

exec /root/run.sh mongod --replSet rs0
