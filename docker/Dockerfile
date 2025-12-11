# Stage 1. collect static site
FROM alpine:3.21 AS assets
WORKDIR /site
COPY . /site

# Stage 2. nginx runtime
FROM nginx:mainline-alpine-slim

# custom nginx config
COPY docker/nginx.conf /etc/nginx/nginx.conf

# prepare directories and permissions
RUN rm -f /etc/nginx/conf.d/default.conf \
    && mkdir -p /var/cache/nginx /var/run/nginx /var/log/nginx \
    && chown -R nginx:nginx /var/cache/nginx /var/run/nginx /var/log/nginx

# copy site assets
COPY --from=assets --chown=nginx:nginx /site /usr/share/nginx/html

# non root
USER nginx

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]

### For building ARM64 image locally, use the following command:
# docker buildx build --platform linux/arm64 -t engabelal/cloudycode-dev-preview:arm-v2 -f docker/Dockerfile . --load



### For building AMD64 image locally, use the following command:
# docker buildx build --platform linux/amd64 -t engabelal/cloudycode-dev-preview:amd-v2 -f docker/Dockerfile . --push
