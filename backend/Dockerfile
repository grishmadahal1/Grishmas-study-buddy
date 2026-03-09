FROM node:22-alpine

WORKDIR /app

# Install dependencies (cached layer)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy source
COPY server.js ./
COPY src/ ./src/

EXPOSE 5001

CMD ["node", "server.js"]
