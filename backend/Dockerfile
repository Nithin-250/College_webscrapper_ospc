FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Install Caddy server
RUN apk update && \
    apk add --no-cache curl tar gzip ca-certificates && \
    curl -L "https://github.com/caddyserver/caddy/releases/download/v2.10.2/caddy_2.10.2_linux_amd64.tar.gz" \
    -o caddy.tar.gz && \
    tar -xzf caddy.tar.gz && \
    mv caddy /usr/bin/caddy && \
    chmod +x /usr/bin/caddy

# Copy source code
COPY . .

# Build frontend
COPY ../package*.json .././
RUN cd .. && npm ci && npm run build

# Create uploads directory for Excel file
RUN mkdir -p uploads

# Copy the Excel file to the container
COPY ../VIT_EventHub_Filled.xlsx ./uploads/

# Copy built frontend
COPY ../dist ./dist/

# Copy Caddyfile
COPY Caddyfile /etc/caddy/Caddyfile

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start both backend and Caddy
CMD ["sh", "-c", "npm start & caddy run --config /etc/caddy/Caddyfile"]
