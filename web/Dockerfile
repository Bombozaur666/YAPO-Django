FROM node:24-alpine AS builder

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run build -- --configuration production

FROM nginx:1.29-alpine AS server

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /usr/src/app/dist/Yapo/browser /usr/share/nginx/html
