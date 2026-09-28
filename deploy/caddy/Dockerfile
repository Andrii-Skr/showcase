ARG CADDY_VERSION=2.11.4

FROM caddy:${CADDY_VERSION}-builder AS builder

ARG CADDY_VERSION
ARG CADDY_RATELIMIT_COMMIT
RUN test -n "${CADDY_RATELIMIT_COMMIT}" && \
    xcaddy build "v${CADDY_VERSION}" \
      --with "github.com/mholt/caddy-ratelimit@${CADDY_RATELIMIT_COMMIT}"

FROM caddy:${CADDY_VERSION}

COPY --from=builder /usr/bin/caddy /usr/bin/caddy
