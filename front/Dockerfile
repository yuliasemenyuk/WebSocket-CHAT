FROM node:18-bullseye as Builder
COPY . /build
WORKDIR /build
ENV HOST=/
RUN npm install
RUN npm run build

FROM nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=Builder /build/dist/ /var/www/html/
