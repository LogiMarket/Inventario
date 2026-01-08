FROM node:20-bookworm-slim

# APT: forzar IPv4 (sin tocar sources; así evita el problema de certificados por HTTPS)
RUN set -eux; \
  echo 'Acquire::ForceIPv4 "true";' > /etc/apt/apt.conf.d/99force-ipv4; \
  apt-get update; \
  apt-get install -y --no-install-recommends libatomic1; \
  rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["npm","start"]
