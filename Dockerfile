FROM node:20-bookworm-slim

# APT: forzar HTTPS + IPv4 (soporta sources.list o debian.sources)
RUN set -eux; \
  echo 'Acquire::ForceIPv4 "true";' > /etc/apt/apt.conf.d/99force-ipv4; \
  if [ -f /etc/apt/sources.list ]; then \
    sed -i 's|http://deb.debian.org|https://deb.debian.org|g' /etc/apt/sources.list; \
    sed -i 's|http://security.debian.org|https://security.debian.org|g' /etc/apt/sources.list; \
  fi; \
  if [ -f /etc/apt/sources.list.d/debian.sources ]; then \
    sed -i 's|http://deb.debian.org|https://deb.debian.org|g' /etc/apt/sources.list.d/debian.sources; \
    sed -i 's|http://security.debian.org|https://security.debian.org|g' /etc/apt/sources.list.d/debian.sources; \
  fi; \
  apt-get update; \
  apt-get install -y --no-install-recommends ca-certificates libatomic1; \
  rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Si usas npm (como dicen tus logs)
COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["npm","start"]
