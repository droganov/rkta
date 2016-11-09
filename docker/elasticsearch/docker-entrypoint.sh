#!/usr/bin/dumb-init /bin/bash

set -e

# Add elasticsearch as command if needed
if [ "${1:0:1}" = '-' ]; then
	set -- elasticsearch "$@"
fi

# Drop root privileges if we are running elasticsearch
# allow the container to be started with `--user`
if [ "$1" = 'elasticsearch' -a "$(id -u)" = '0' ]; then
	chown -R elasticsearch:elasticsearch /usr/share/elasticsearch/data

	set -- gosu elasticsearch "$@"
fi

exec "$@"
