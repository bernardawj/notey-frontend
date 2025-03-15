FROM node:22.14-alpine3.20 AS build
COPY . /build
WORKDIR /build
RUN npm run build

FROM nginx:latest AS run
COPY --from=build /build/dist/notey-frontend /usr/share/nginx/html
COPY --from=build /build/nginx-default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
