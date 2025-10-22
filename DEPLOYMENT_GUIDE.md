# 🚀 Expense Tracker Backend - Complete Setup Guide

Backend expense tracker sudah selesai dibuat dan siap untuk deployment! Berikut adalah panduan lengkap untuk setup dan deployment.

## ✅ Yang Sudah Selesai

✅ **Express.js API** dengan semua endpoint CRUD  
✅ **Supabase integration** dengan authentication dan database  
✅ **Security middleware** (CORS, Helmet, Rate limiting)  
✅ **Input validation** dan error handling  
✅ **Swagger documentation** di `/api-docs`  
✅ **Vercel configuration** untuk serverless deployment  
✅ **Health check** dan monitoring endpoints  

## 📋 Langkah Setup

### 1. **Setup Supabase Database**

1. Buat project baru di [Supabase.com](https://supabase.com)
2. Pergi ke **SQL Editor** di dashboard Supabase
3. Copy dan jalankan script SQL dari file: `pengeluaran_documentation_guide/expense-tracker-database-setup.sql`
4. Simpan credentials dari **Settings > API**:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY` 
   - `SUPABASE_SERVICE_ROLE_KEY`

### 2. **Setup Environment Variables**

Edit file `.env` dengan credentials Supabase:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NODE_ENV=development
PORT=3000
```

### 3. **Test Local Development**

```bash
# Install dependencies (sudah done)
npm install

# Start development server
npm run dev

# Test endpoints
curl http://localhost:3000/health
curl http://localhost:3000/api/v1/info

# Open documentation
open http://localhost:3000/api-docs
```

## 🚀 Deployment ke Vercel

### Option 1: Menggunakan Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login ke Vercel
vercel login

# Deploy
vercel --prod

# Set environment variables di Vercel
vercel env add SUPABASE_URL
vercel env add SUPABASE_SERVICE_ROLE_KEY  
vercel env add SUPABASE_ANON_KEY
```

### Option 2: Git Integration (Recommended)

1. **Push code ke GitHub**:
   ```bash
   git add .
   git commit -m "Complete expense tracker backend"
   git push origin main
   ```

2. **Connect di Vercel Dashboard**:
   - Login ke [vercel.com](https://vercel.com)
   - Import repository `new_expenses`
   - Vercel akan auto-detect sebagai Node.js project

3. **Set Environment Variables** di Vercel Dashboard:
   - Pergi ke **Settings > Environment Variables**
   - Add semua variables dari `.env`

4. **Deploy**: Auto-deploy setiap git push!

## 📱 Frontend Integration

Setelah API deploy, Anda bisa buat frontend dengan:

### Next.js + Shadcn UI (Recommended)

```bash
# Create frontend project
npx create-next-app@latest expense-tracker-frontend --typescript --tailwind

# Setup Shadcn UI
npx shadcn-ui@latest init
npx shadcn-ui@latest add form input button table dialog

# Install Supabase client
npm install @supabase/supabase-js @tanstack/react-query
```

### Environment untuk Frontend

```env
# .env.local di frontend project
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=https://your-api.vercel.app
```

## 🧪 Testing API

### Basic Authentication Test

```bash
# Register user di Supabase Auth (via dashboard atau frontend)
# Then test login:

curl -X POST https://your-api.vercel.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Response akan berisi access_token untuk request selanjutnya
```

### CRUD Operations Test

```bash
# Create expense (dengan token dari login)
curl -X POST https://your-api.vercel.app/api/v1/expenses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "description": "Coffee with client",
    "amount": 5.75,
    "category": "Food", 
    "date": "2024-10-22T10:00:00.000Z"
  }'

# Get expenses
curl https://your-api.vercel.app/api/v1/expenses \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📊 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### Expenses
- `GET /api/v1/expenses` - List expenses (with filters)
- `POST /api/v1/expenses` - Create expense
- `GET /api/v1/expenses/:id` - Get expense by ID
- `PUT /api/v1/expenses/:id` - Update expense  
- `DELETE /api/v1/expenses/:id` - Delete expense

### Utility
- `GET /health` - Health check
- `GET /api/v1/info` - API information
- `GET /api-docs` - Swagger documentation

## 🔐 Security Features

✅ **JWT Authentication** dengan Supabase  
✅ **Row Level Security (RLS)** di database  
✅ **Input validation** dan sanitization  
✅ **Rate limiting** (100 req/15min)  
✅ **CORS protection**  
✅ **Security headers** dengan Helmet  
✅ **Environment-based configuration**  

## 📈 Performance Features

✅ **Serverless functions** dengan auto-scaling  
✅ **Global Edge Network** via Vercel  
✅ **Response compression**  
✅ **Database connection pooling**  
✅ **Error tracking** dan monitoring  
✅ **Health checks** untuk uptime monitoring  

## 💰 Cost Estimate

### Development (FREE)
- Vercel: Free tier (100GB bandwidth)
- Supabase: Free tier (500MB database)
- **Total: $0/month**

### Production Scale
- Vercel Pro: $20/month (unlimited bandwidth)
- Supabase Pro: $25/month (8GB database)
- **Total: ~$45/month**

## 🛠️ Tech Stack Summary

- **Backend**: Node.js + Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel Serverless Functions
- **Documentation**: Swagger UI
- **Security**: Helmet + CORS + Rate limiting

## 📚 Documentation URLs

Setelah deployment, akses dokumentasi di:
- **API Docs**: `https://your-api.vercel.app/api-docs`
- **Health Check**: `https://your-api.vercel.app/health`
- **API Info**: `https://your-api.vercel.app/api/v1/info`

## 🎯 Next Steps

1. **Deploy API** ke Vercel (ikuti langkah di atas)
2. **Create frontend** menggunakan Shadcn UI guide di `shadcn-ui-development-guide.md`
3. **Setup monitoring** dan error tracking
4. **Add advanced features**: charts, exports, notifications
5. **Scale infrastructure** sesuai kebutuhan

---

**🎉 Backend Expense Tracker sudah siap production!**

Semua file sudah dikonfigurasi dengan best practices untuk security, performance, dan scalability. Anda tinggal setup Supabase dan deploy ke Vercel!

**Butuh bantuan?** 
- Check dokumentasi lengkap di folder `pengeluaran_documentation_guide/`
- Test API menggunakan Swagger UI
- Monitor performance via Vercel dashboard