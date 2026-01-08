FROM node:20-bookworm-slim

# Forzar apt por HTTPS + IPv4 (evita el error de deb.debian.org:80 / IPv6)
RUN set -eux; \
  sed -i 's|http://deb.debian.org|https://deb.debian.org|g' /etc/apt/sources.list; \
  sed -i 's|http://security.debian.org|https://security.debian.org|g' /etc/apt/sources.list; \
  echo 'Acquire::ForceIPv4 "true";' > /etc/apt/apt.conf.d/99force-ipv4; \
  apt-get update; \
  apt-get install -y --no-install-recommends libatomic1; \
  rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Instala dependencias (si usas npm)
COPY package.json package-lock.json* ./
RUN npm ci

# Copia el resto y build
COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["npm","start"]
