# CORS Fix for Render Backend

Add this to your Render backend to allow requests from your Netlify site:

## If using Express.js:

```javascript
const cors = require('cors');

// Add this middleware to your app
app.use(cors({
  origin: [
    'https://college-webscrapper-ospc.netlify.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Or allow all origins (less secure but for testing):
app.use(cors());
```

## If using plain Node.js:

```javascript
// Add this to your response headers
res.setHeader('Access-Control-Allow-Origin', 'https://fascinating-tiramisu-4c70e0.netlify.app');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
```

## If using other frameworks:

- **Fastify**: Use `@fastify/cors` plugin
- **Koa**: Use `@koa/cors` middleware  
- **Next.js**: Add to `next.config.js`
- **Django**: Use `django-cors-headers`
- **Flask**: Use `flask-cors`

## Deploy Steps:
1. Add CORS configuration to your backend
2. Deploy to Render
3. Test the updated Netlify site

This will fix the CORS issue at the source!
