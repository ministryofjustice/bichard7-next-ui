ARG BUILD_IMAGE="nginx-nodejs-supervisord"

# Build next-ui app

FROM ${BUILD_IMAGE} as app_builder

LABEL maintainer="CJSE"

WORKDIR /src/next-ui

COPY ./package*.json ./
COPY ./scripts/ ./scripts/

RUN npm install

COPY . ./

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Run next-ui app

FROM ${BUILD_IMAGE} as runner

RUN useradd nextjs && \
    groupadd nodejs && \
    usermod -a -G nodejs nextjs

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

WORKDIR /app
COPY ./package*.json ./

RUN npm install --production

COPY --from=app_builder /src/next-ui/next.config.js ./
COPY --from=app_builder /src/next-ui/public ./public
COPY --from=app_builder --chown=nextjs:nodejs /src/next-ui/.next ./.next

COPY docker/conf/nginx.conf /etc/nginx/nginx.conf
COPY docker/conf/supervisord.conf /etc/supervisord.conf

EXPOSE 80
EXPOSE 443

CMD [ "/usr/bin/supervisord", "-c", "/etc/supervisord.conf" ]
