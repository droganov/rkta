FROM alpine:3.4

ENV PATH /bin:/usr/share/elasticsearch/bin/:$PATH

RUN apk --update add bash curl openjdk8-jre \
	&& rm -rf /var/cache/apk/* \
	&& curl -fsSL -o /usr/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.0.0/dumb-init_1.0.0_amd64 \
  && chmod 0755 /usr/bin/dumb-init \
  && curl -fsSL -o /usr/local/bin/gosu https://github.com/tianon/gosu/releases/download/1.3/gosu-amd64 \
  && chmod +x /usr/local/bin/gosu \
	&& curl https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-5.0.0.tar.gz -o elasticsearch-5.0.0.tar.gz \
  && tar -xzf elasticsearch-5.0.0.tar.gz && rm elasticsearch-5.0.0.tar.gz \
  && mv elasticsearch-5.0.0 /usr/share/elasticsearch \
  && adduser -DH -s /sbin/nologin elasticsearch \
	&& echo 'vm.max_map_count=262144' >> /etc/sysctl.d/00-alpine.conf

WORKDIR /usr/share/elasticsearch

COPY config ./config
COPY ./plugins/ /usr/share/elasticsearch/plugins/
COPY docker-entrypoint.sh /

RUN chown elasticsearch:elasticsearch /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh && \
    chown -R elasticsearch:elasticsearch /usr/share/elasticsearch

USER elasticsearch

ENTRYPOINT ["/docker-entrypoint.sh"]

CMD "elasticsearch"

EXPOSE 9200
