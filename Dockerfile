FROM node:16-alpine as build-stage

RUN apk add --no-cache libc6-compat git python3 py3-pip make g++

WORKDIR /app

COPY ./ /app/

RUN yarn install

RUN yarn run build

FROM nginx:1.25

RUN mkdir -p /usr/share/nginx/wallet-connect
RUN mkdir -p /usr/share/nginx/tx-builder

COPY --from=build-stage /app/apps/wallet-connect/build/ /usr/share/nginx/wallet-connect/
COPY --from=build-stage /app/apps/tx-builder/build/ /usr/share/nginx/tx-builder/

COPY index.html /usr/share/nginx/html/

COPY nginx.conf /etc/nginx/conf.d/default.conf