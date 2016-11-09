FROM alpine:3.4

RUN apk --no-cache add python curl && \
    curl -o /get-pip.py https://bootstrap.pypa.io/get-pip.py && \
    python /get-pip.py && rm /get-pip.py && \
    pip install mongo-connector && \
    pip install elastic2-doc-manager && \
    curl -fsSL -o /usr/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.0.0/dumb-init_1.0.0_amd64 && \
    chmod 0755 /usr/bin/dumb-init

COPY run.sh /root

ENTRYPOINT [ "/root/run.sh" ]
