FROM alpine

ARG build_number=0
ENV BUILD_NUMBER ${build_number}

RUN addgroup woorank
RUN adduser -D -G woorank -g "Woorank" -s /bin/sh woorank
RUN echo "woorank ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers
RUN mkdir -p /opt/app
RUN chown woorank:woorank /opt/app
RUN apk --update add sudo nodejs
RUN npm install -g npm

COPY ./package.json /opt/app/package.json
COPY ./src /opt/app/src
COPY ./test /opt/app/test

USER woorank
WORKDIR /opt/app
RUN npm install

CMD [ "npm", "start" ]
