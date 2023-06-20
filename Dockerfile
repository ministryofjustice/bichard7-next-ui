ARG BUILD_IMAGE="nginx-nodejs-supervisord"

# Build UI app

FROM ${BUILD_IMAGE} as app_builder

LABEL maintainer="CJSE"

WORKDIR /src/ui

# Currently needed for core postinstall script
RUN yum install jq -y

# Copy in package info so we don't have to re-install packages for every code change
COPY package.json .
COPY package-lock.json .
COPY ./scripts/copy-govuk-frontend-assets.sh scripts/copy-govuk-frontend-assets.sh
COPY ./scripts/copy-moj-frontend-assets.sh scripts/copy-moj-frontend-assets.sh

RUN npm ci && \
    npm run install:assets

COPY . ./

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Run UI app

FROM ${BUILD_IMAGE} as runner

RUN useradd nextjs && \
    groupadd nodejs && \
    usermod -a -G nodejs nextjs && \
    npm config set cache /tmp/npm --global

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

WORKDIR /app

COPY --from=app_builder /src/ui/next.config.js ./
COPY --from=app_builder /src/ui/package*.json ./
COPY --from=app_builder /src/ui/public ./public
COPY --from=app_builder /src/ui/.next/standalone .
COPY --from=app_builder /src/ui/.next/static ./.next/static

COPY docker/conf/nginx.conf /etc/nginx/nginx.conf
COPY docker/conf/supervisord.conf /etc/supervisord.conf

EXPOSE 80
EXPOSE 443

CMD [ "/usr/bin/supervisord", "-c", "/etc/supervisord.conf" ]
