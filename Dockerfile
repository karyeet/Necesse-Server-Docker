ARG JAVAPLATFORM

FROM --platform=$JAVAPLATFORM ubuntu:22.04

LABEL maintainer="https://github.com/karyeet"

COPY ./necesse-server /necesse-server

COPY ./bootstrap.sh /necesse-server

CMD chmod -R +x /necesse-server &&\
    /bin/bash /necesse-server/bootstrap.sh