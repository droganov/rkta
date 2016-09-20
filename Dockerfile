FROM node:6

RUN apt-get update

WORKDIR /public_html

ADD package.json package.json

RUN npm install --loglevel error && \
    echo 'install finished'

COPY . .

ENTRYPOINT ["npm", "start"]
