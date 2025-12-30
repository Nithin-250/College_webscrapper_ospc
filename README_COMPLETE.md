# VIT EventHub - College Event Management Platform

A modern, full-stack web application for managing and displaying college events. Built with React, Node.js, and deployed on Netlify (frontend) and Render (backend).

## 🚀 Live Demo

- **Frontend**: https://college-webscrapper-ospc.netlify.app
- **Backend API**: https://college-webscrapper-ospc.onrender.com

## ✨ Features

### 🎯 Event Management
- **Dynamic Event Display**: Browse all approved college events
- **Advanced Filtering**: Filter by category, date, fee type, and search
- **Event Details**: View comprehensive event information
- **Calendar View**: Visual calendar representation of events
- **Real-time Updates**: Events update automatically when Excel file changes

### 🛠 Technical Features
- **Modern Tech Stack**: React 18, TypeScript, Tailwind CSS
- **Serverless Ready**: Netlify Functions for API proxying
- **CORS Handled**: Proper cross-origin configuration
- **Responsive Design**: Mobile-first, responsive UI
- **Performance Optimized**: React Query for efficient data fetching
- **Component Library**: Radix UI + shadcn/ui components

### 📊 Data Management
- **Excel Integration**: Events managed via Excel spreadsheet
- **Automatic Sync**: Excel changes reflect immediately in the app
- **Data Validation**: Proper event formatting and validation
- **Backup Systems**: Multiple data sources (Excel, Database, Google Sheets)

## 🏗 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Data Source   │
│                 │    │                 │    │                 │
│ React + TS      │◄──►│ Node.js + Exp   │◄──►│ Excel File      │
│ Tailwind CSS    │    │ MongoDB         │    │ VIT_EventHub_   │
│ React Query     │    │ CORS Config     │    │ Filled.xlsx     │
│ Radix UI        │    │ Rate Limiting   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
       │                       │                       │
       ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Deployment    │    │   Deployment    │    │   Management    │
│                 │    │                 │    │                 │
│ Netlify         │    │ Render          │    │ GitHub Repo     │
│ Auto-deploys    │    │ Auto-deploys    │    │ Git Versioning  │
│ CDN + Edge      │    │ API Server      │    │ Excel Updates   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠 Tech Stack

### Frontend
- **React 18** - UI framework with hooks
- **TypeScript** - Type safety and better DX
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible components
- **shadcn/ui** - Component library built on Radix UI
- **React Query** - Server state management
- **React Router** - Client-side routing
- **Lucide React** - Icon library
- **date-fns** - Date manipulation utilities

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger
- **Rate Limiting** - API rate limiting
- **XLSX** - Excel file parsing

### Deployment & DevOps
- **Netlify** - Frontend hosting and CDN
- **Render** - Backend hosting and database
- **GitHub** - Version control and CI/CD
- **Netlify Functions** - Serverless functions (backup)

## 📁 Project Structure

```
event-hub-pro-main/
├── frontend/                 # Frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   └── styles/         # Global styles
│   ├── public/             # Static assets
│   └── dist/               # Build output
├── backend/                 # Backend application
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   ├── utils/          # Utility functions
│   │   └── services/       # Business logic
│   └── scripts/           # Database scripts
├── netlify/                # Netlify functions
├── public/                 # Static files
├── src/                    # Frontend source (root level)
├── VIT_EventHub_Filled.xlsx # Excel data source
├── package.json            # Dependencies and scripts
├── netlify.toml           # Netlify configuration
├── render.yaml            # Render configuration
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Git
- MongoDB (for local development)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Nithin-250/College_webscrapper_ospc.git
cd College_webscrapper_ospc
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Copy environment files
cp .env.example .env
cp .env.production.example .env.production

# Edit with your values
# .env for development
# .env.production for production
```

4. **Start development servers**
```bash
# Start frontend (http://localhost:5173)
npm run dev

# Start backend (http://localhost:5000) - in separate terminal
cd backend
npm run dev
```

## ⚙️ Configuration

### Environment Variables

#### Frontend (.env)
```env
VITE_BACKEND_URL=http://localhost:5000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

#### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/eventhub
CORS_ORIGIN=http://localhost:5173,http://localhost:3000

# Optional: Google Sheets integration
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account@email.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
GOOGLE_SHEET_ID=your_sheet_id
GOOGLE_SHEET_RANGE=Sheet1!A2:N
```

### Netlify Configuration

`netlify.toml`:
```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Render Configuration

`render.yaml`:
```yaml
services:
  - type: web
    name: college-webscrapper-ospc
    env: node
    buildCommand: cd backend && npm install
    startCommand: cd backend && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5000
```

## 📊 Data Management

### Excel File Structure

The `VIT_EventHub_Filled.xlsx` file should contain these columns:

| Column | Required | Description |
|--------|----------|-------------|
| Event Name | ✅ | Name of the event |
| Event Date | ✅ | Date of the event |
| Organizer | ✅ | Organizing department/club |
| Event Venue | Optional | Location of the event |
| End Date | Optional | End date for multi-day events |
| Deadline | Optional | Registration deadline |
| Event Time | Optional | Time of the event |
| Fee | Optional | Registration fee |
| Eligibility | Optional | Who can participate |
| Team Size | Optional | Team size requirements |
| Status | Optional | Registration status |
| Link | Optional | Registration/event link |

### Adding/Updating Events

1. **Open Excel File**: Edit `VIT_EventHub_Filled.xlsx`
2. **Add/Modify Events**: Update event details
3. **Save Changes**: Save the Excel file
4. **Push to GitHub**: Commit and push changes
5. **Auto-Deploy**: Render and Netlify will automatically update

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start frontend dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Backend (in backend/ directory)
npm run dev          # Start backend dev server
npm start            # Start production server
npm test             # Run tests
```

### Code Style

- **ESLint**: Configured with React and TypeScript rules
- **Prettier**: Code formatting (optional)
- **TypeScript**: Strict type checking enabled
- **Component Structure**: Follow atomic design principles

### API Endpoints

#### Events
- `GET /api/events` - Get all events (with filtering)
- `GET /api/events/:id` - Get specific event
- `POST /api/events` - Create new event (admin)
- `PUT /api/events/:id` - Update event (admin)
- `DELETE /api/events/:id` - Delete event (admin)

#### Health & Debug
- `GET /api/health` - Health check
- `GET /api/debug` - Debug information

#### Query Parameters
```javascript
// Filtering
GET /api/events?category=Hackathon&status=approved
GET /api/events?fee=free&search=workshop
GET /api/events?startDate=2024-01-01&endDate=2024-12-31

// Sorting
GET /api/events?sortBy=start_date&sortOrder=desc

// Pagination
GET /api/events?page=1&limit=20
```

## 🚀 Deployment

### Frontend (Netlify)

1. **Connect Repository**: Link GitHub repository to Netlify
2. **Configure Build**: Set build command and publish directory
3. **Environment Variables**: Add production environment variables
4. **Deploy**: Automatic deployment on push to main branch

### Backend (Render)

1. **Create Web Service**: New Node.js service on Render
2. **Connect Repository**: Link GitHub repository
3. **Configure Build**: Set build and start commands
4. **Environment Variables**: Add production environment variables
5. **Deploy**: Automatic deployment on push to main branch

### Database (MongoDB Atlas)

1. **Create Cluster**: Set up MongoDB Atlas cluster
2. **Configure Network**: Allow access from Render IP
3. **Get Connection String**: Copy MongoDB URI
4. **Update Environment**: Add MONGODB_URI to Render

## 🔒 Security

### CORS Configuration
```javascript
app.use(cors({
  origin: [
    'https://college-webscrapper-ospc.netlify.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true
}));
```

### Security Headers
```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
```

### Rate Limiting
```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
```

## 🐛 Troubleshooting

### Common Issues

#### CORS Errors
```bash
# Check if backend is running
curl https://college-webscrapper-ospc.onrender.com/api/health

# Check CORS headers
curl -H "Origin: https://college-webscrapper-ospc.netlify.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://college-webscrapper-ospc.onrender.com/api/events
```

#### Excel File Not Found
```bash
# Check if Excel file exists in backend
curl https://college-webscrapper-ospc.onrender.com/api/debug
```

#### Build Errors
```bash
# Clear dependencies and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run lint
```

### Debug Mode

Enable debug logging:
```bash
# Backend
DEBUG=* npm run dev

# Frontend
VITE_DEBUG=true npm run dev
```

## 📈 Performance

### Frontend Optimization
- **Code Splitting**: Automatic with React.lazy
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Webpack Bundle Analyzer
- **Caching**: React Query with staleTime and cacheTime

### Backend Optimization
- **Database Indexing**: Optimized queries
- **Response Caching**: ETAG and Cache-Control headers
- **Compression**: Gzip compression enabled
- **Connection Pooling**: MongoDB connection pooling

### Monitoring
- **Render Metrics**: CPU, memory, and response time
- **Netlify Analytics**: Page views and performance
- **Error Tracking**: Console error monitoring

## 🤝 Contributing

1. **Fork Repository**: Create your fork
2. **Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Commit Changes**: `git commit -m 'Add amazing feature'`
4. **Push Branch**: `git push origin feature/amazing-feature`
5. **Pull Request**: Create PR to main branch

### Development Guidelines
- **Code Style**: Follow existing patterns
- **TypeScript**: Use strict typing
- **Testing**: Add tests for new features
- **Documentation**: Update README and comments
- **Performance**: Consider impact on load time

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **VIT Chennai** - For providing the event data
- **React Team** - For the amazing React framework
- **Radix UI** - For accessible component primitives
- **Tailwind CSS** - For the utility-first CSS framework
- **Netlify** - For the generous hosting platform
- **Render** - For the excellent Node.js hosting

## 📞 Support

For support and questions:
- **Issues**: [GitHub Issues](https://github.com/Nithin-250/College_webscrapper_ospc/issues)
- **Email**: nithin@example.com
- **Discord**: [Join our Discord](https://discord.gg/vit-events)

---

**Built with ❤️ by VIT Chennai Students**
