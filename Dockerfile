ARG JAVAPLATFORM

FROM --platform=$JAVAPLATFORM node:21-bullseye-slim

LABEL maintainer="https://github.com/karyeet"

COPY ./necesse-server /necesse-server

COPY ./necesse-wrapper.js /necesse-server

RUN chmod -R +x /necesse-server

ENTRYPOINT ["node", "/necesse-server/necesse-wrapper.js"]