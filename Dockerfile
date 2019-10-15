FROM node:8.16.0-alpine as build

RUN apk update && \
    apk upgrade && \
    apk add --no-cache bash curl libpng-dev gcc make musl-dev make nodejs libpng-dev libpng git

COPY package.json /src/package.json
COPY . /src/

WORKDIR /src/
RUN yarn install && yarn generate:caddy

#  ------ Last Stage ------
FROM abiosoft/caddy

COPY Caddyfile /etc/Caddyfile
COPY --from=build /src/public/ /srv/
