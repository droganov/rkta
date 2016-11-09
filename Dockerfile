FROM mhart/alpine-node:7

RUN mkdir -p /app/src
COPY package.json /docker/node/script.js /app/

RUN node /app/script.js && \
    apk add --no-cache git curl python make g++ krb5-dev && \
    cd /app && \
    echo -n 'npm install ...' && \
    npm install > /dev/null && \
    npm cache clean && \
    echo ' done.' && \
    echo -n 'download dumb-init ...' && \
    curl -fsSL -o /usr/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.0.0/dumb-init_1.0.0_amd64 &> /dev/null && \
    chmod 0755 /usr/bin/dumb-init && \
    echo ' done.' && \
    echo -n 'cleaning ...' && \
    apk del git curl python make g++ krb5-dev &> /dev/null && \
    rm /app/script.js && \
    echo ' done.'

WORKDIR /app/src

EXPOSE    3000

ENTRYPOINT ["/usr/bin/dumb-init", "--"]

CMD       ["npm", "start"]
