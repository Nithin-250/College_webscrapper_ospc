FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy entire project
COPY . .

# Make sure uploads exists
RUN mkdir -p uploads

# Copy Excel file (must be inside repo!)
COPY VIT_EventHub_Filled.xlsx ./uploads/

# Expose API port
EXPOSE 5000

# Health Check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start Server
CMD ["npm", "start"]
