FROM frolvlad/alpine-glibc
MAINTAINER Mykola Grechukh (nick.grechukh@gmail.com)

RUN apk add --update curl tar nodejs-lts && \
    ln -s /usr/bin/node /usr/bin/nodejs && \
    curl http://syncapp.bittorrent.com/1.4.111/btsync_x64-1.4.111.tar.gz | tar xvfz - -C /usr/bin/ btsync && \
    apk del --purge curl tar \
    ; rm -rf /var/cache/apk/*

# from https://github.com/aduermael/btsync-docker with own improvements
ADD btsync /btsync
RUN mkdir /btsync/storage

EXPOSE 55555

WORKDIR /btsync

# Arguments: DIR SECRET
ENTRYPOINT ["/bin/sh", "./start.sh"]
