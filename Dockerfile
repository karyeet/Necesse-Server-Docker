ARG JAVAPLATFORM

FROM --platform=$JAVAPLATFORM node:21-bullseye-slim

LABEL maintainer="https://github.com/karyeet"

COPY ./necesse-server /necesse-server

COPY ./bootstrap.sh /necesse-server

COPY ./necesse-wrapper.js /necesse-server

RUN chmod -R +x /necesse-server

CMD node /necesse-server/necesse-wrapper.js