# Expense Tracker - Full Stack Application

Aplikasi full-stack expense tracker menggunakan Next.js frontend dan Express.js backend, dengan Supabase sebagai database, dan di-deploy ke Vercel.

## 🏗️ Architecture

```
new_expenses/
├── api/                         # Backend (Express.js)
│   └── index.js
├── client/                      # Frontend (Next.js)
│   ├── src/
│   │   ├── app/                # Next.js App Router
│   │   ├── components/         # React Components (shadcn/ui)
│   │   ├── hooks/              # Custom React Hooks
│   │   └── lib/                # Utilities & API Client
│   ├── package.json
│   └── next.config.ts
├── shared/                     # Shared Types & Constants
│   ├── types/                  # TypeScript Definitions
│   └── constants/              # App Constants
├── package.json                # Root Package (Monorepo)
├── vercel.json                 # Deployment Configuration
└── README.md
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install all dependencies (root + client)
npm run install:all
```

### 2. Setup Database (Supabase)

1. Buat project baru di [Supabase](https://supabase.com)
2. Copy SQL script dari `pengeluaran_documentation_guide/expense-tracker-database-setup.sql`
3. Jalankan script di Supabase SQL Editor
4. Simpan URL dan API keys dari Settings > API

### 3. Setup Environment Variables

**Root `.env`:**
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PORT=3000
NODE_ENV=development
```

**Client `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Run Development

```bash
# Start both frontend and backend
npm run dev

# Or start individually:
npm run dev:api      # Backend only (port 3000)
npm run dev:client   # Frontend only (port 3001)
```

**Akses Aplikasi:**
- �️ Frontend: http://localhost:3001
- 🔌 Backend API: http://localhost:3000
- 📚 API Docs: http://localhost:3000/api-docs

## 🎨 Frontend Features

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Language**: TypeScript
- **State Management**: React Hooks
- **HTTP Client**: Fetch API

### Components
- ✅ **ExpenseForm**: Add/Edit expense with validation
- ✅ **ExpenseList**: Table view with edit/delete actions
- ✅ **ExpenseFilters**: Filter by category, date, search
- ✅ **ExpenseSummary**: Analytics dashboard with charts
- ✅ **Responsive Design**: Mobile-first approach

### Features
- ✅ CRUD operations for expenses
- ✅ Real-time filtering and search
- ✅ Pagination support
- ✅ Form validation with error handling
- ✅ Toast notifications
- ✅ Loading states and error boundaries
- ✅ Currency formatting (IDR)
- ✅ Date formatting and validation

## 🔧 Backend Features

### Tech Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel Serverless Functions

### API Endpoints
- `GET /api/expenses` - Get user expenses (with filtering)
- `POST /api/expenses` - Create new expense
- `GET /api/expenses/:id` - Get specific expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/summary` - Get expense analytics
- `GET /health` - Health check
- `GET /api-docs` - Swagger documentation

## 🚀 Deploy to Vercel

### 1. Prepare for Deployment

```bash
# Build client
npm run build

# Test production build locally
npm run start:client
```

### 2. Deploy

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Login
vercel login

# Deploy
npm run deploy
```

### 3. Set Environment Variables

Via Vercel CLI:
```bash
vercel env add SUPABASE_URL
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add SUPABASE_ANON_KEY
```

Atau melalui Vercel Dashboard > Settings > Environment Variables

## 📱 Usage Guide

### Adding Expenses
1. Klik "Add New Expense" di header
2. Isi form dengan amount, description, category, dan date
3. Klik "Save Expense"

### Filtering Expenses
1. Gunakan filters card untuk set category, date range, atau search
2. Klik "Apply Filters"
3. Use "Reset" untuk clear semua filters

### Viewing Analytics
- Summary card menampilkan total amount dan transaction count
- Category breakdown dengan percentage dan visual charts
- Real-time updates berdasarkan filters yang active

### Managing Expenses
- Klik "Edit" untuk modify existing expense
- Klik "Delete" dengan confirmation untuk remove expense
- Use pagination untuk navigate large datasets

## 🧪 Testing

### Frontend Testing
```bash
cd client
npm run test           # Run unit tests
npm run test:e2e       # Run E2E tests (if configured)
```

### API Testing
```bash
# Health check
curl http://localhost:3000/health

# Test expense creation
curl -X POST http://localhost:3000/api/expenses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"amount":50000,"description":"Lunch","category":"Food & Dining","date":"2024-01-15"}'
```

## 🔒 Security Features

- ✅ JWT Authentication dengan Supabase
- ✅ Row Level Security (RLS) di database
- ✅ Input validation dan sanitization
- ✅ Rate limiting (100 requests/15 minutes)
- ✅ CORS configuration
- ✅ Security headers dengan Helmet
- ✅ XSS protection via React
- ✅ Environment variables protection

## 📊 Performance Optimizations

### Frontend
- ✅ Next.js App Router dengan streaming
- ✅ Image optimization
- ✅ Code splitting dengan dynamic imports
- ✅ React Compiler enabled
- ✅ CSS optimization
- ✅ Debounced search inputs

### Backend
- ✅ Response compression
- ✅ Database query optimization
- ✅ Connection pooling via Supabase
- ✅ Serverless functions auto-scaling
- ✅ Global CDN distribution

## �️ Development Scripts

```bash
# Root level
npm run dev              # Start both frontend & backend
npm run dev:api          # Backend only
npm run dev:client       # Frontend only
npm run build            # Build client for production
npm run install:all      # Install all dependencies
npm run deploy          # Deploy to Vercel

# Client level (cd client)
npm run dev             # Start Next.js dev server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
```

## 🔍 Monitoring & Debugging

### Development
- Hot reload untuk both frontend & backend
- Detailed error messages dengan stack traces
- Browser dev tools integration
- API request/response logging

### Production
- Vercel Analytics integration
- Error tracking dengan boundaries
- Performance monitoring
- Health check endpoints

## 📚 Documentation

- [Frontend Components](./client/src/components/README.md)
- [API Documentation](https://your-api.vercel.app/api-docs)
- [Database Schema](./pengeluaran_documentation_guide/expense-tracker-database-setup.sql)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Make changes
4. Test locally (`npm run dev`)
5. Build and test production (`npm run build`)
6. Deploy to preview environment
7. Submit pull request

## 🐛 Troubleshooting

### Common Issues

**Frontend tidak connect ke backend:**
- Check `NEXT_PUBLIC_API_URL` di `.env.local`
- Pastikan backend running di port 3000
- Check CORS settings di `api/index.js`

**Database errors:**
- Verify Supabase credentials
- Check RLS policies di Supabase dashboard
- Ensure database tables exist

**Build errors:**
- Check TypeScript errors: `cd client && npm run build`
- Verify all imports dan exports
- Check shared types path resolution

**Deployment issues:**
- Check Vercel environment variables
- Verify `vercel.json` configuration
- Check build logs di Vercel dashboard

---

**🎉 Happy coding!**

Untuk support atau questions, buka issue di GitHub repository atau contact [dhimas.saputra@example.com](mailto:dhimas.saputra@example.com).