# VIT Chennai Event Hub - Deployment Guide

## Overview
This is a full-stack application with a React frontend and Node.js/Express backend that syncs with Google Sheets for event data.

## Architecture
- **Frontend**: React + TypeScript + Vite (built to `/dist`)
- **Backend**: Node.js + Express + MongoDB/Google Sheets
- **Data Source**: Google Sheets (with local Excel fallback)

## Environment Variables Required

### Backend (.env in backend folder)
```bash
# Database (optional - falls back to local Excel if not provided)
MONGO_URI=mongodb://localhost:27017/vit_event_hub
MONGO_DB_NAME=vit_event_hub

# Google Sheets (OPTIONAL - only if using Google Sheets)
# GOOGLE_SHEET_ID=your_google_sheet_id
# GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account@gserviceaccount.com
# GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Local Excel (DEFAULT - works out of the box)
# Just place VIT_EventHub_Filled.xlsx in the project root

# Server
PORT=5000
CORS_ORIGIN=http://localhost:3000,http://localhost:8081
```

### Frontend (.env in root)
```bash
VITE_BACKEND_URL=http://localhost:5000
VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
VITE_SUPABASE_URL=https://your_project.supabase.co
```

## Deployment Options

### Option 1: Combined Deployment (Recommended)
1. Build the frontend:
```bash
npm run build
```

2. Deploy both backend and frontend together:
```bash
# In backend folder
node web.js  # Serves frontend on port 3000
```

### Option 2: Separate Deployments

#### Frontend Deployment (Static Hosting)
```bash
npm run build
# Deploy the /dist folder to:
# - Vercel, Netlify, GitHub Pages, or any static hosting
```

#### Backend Deployment (Server)
```bash
# In backend folder
npm install
npm start  # Runs on port 5000
```

## Platform-Specific Instructions

### Vercel Deployment
1. Create `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/backend/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/dist/$1"
    }
  ]
}
```

2. Deploy:
```bash
vercel --prod
```

### Railway Deployment
1. Create `railway.toml`:
```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "cd backend && npm start && cd .. && npm run build && cp -r dist/* backend/dist/"
```

### Docker Deployment
Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy and build frontend
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Copy and setup backend
COPY backend/package*.json ./backend/
RUN cd backend && npm ci

EXPOSE 3000

CMD ["node", "backend/web.js"]
```

## Post-Deployment Checklist
- [ ] Environment variables configured
- [ ] Google Sheets API access working
- [ ] MongoDB connection (if using)
- [ ] Frontend API URL pointing to deployed backend
- [ ] HTTPS/SSL configured
- [ ] Custom domain set up (if needed)

## Monitoring
- Backend health check: `GET /api/health`
- Events endpoint: `GET /api/events`
- Sheet sync runs automatically every 5 minutes

## Troubleshooting
- If events don't load: Check Google Sheets credentials and sheet ID
- If CORS errors: Verify CORS_ORIGIN includes your frontend domain
- If sync fails: Check Google Sheets API permissions and service account access
