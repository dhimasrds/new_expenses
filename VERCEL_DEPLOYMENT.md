# 🚀 Vercel Deployment Guide

## Quick Deploy

### Option 1: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Option 2: Deploy via GitHub (Recommended)

1. Push code to GitHub (already done ✅)
2. Go to https://vercel.com/new
3. Import your repository: `dhimasrds/new_expenses`
4. Configure project:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (keep as root)
   - **Build Command**: Leave empty or `npm install`
   - **Output Directory**: Leave empty
5. Add Environment Variables (see below)
6. Click **Deploy**

## Environment Variables in Vercel

Add these in Vercel Dashboard → Settings → Environment Variables:

```env
# Supabase Configuration
SUPABASE_URL=https://gtyuqtbulgfmtkbawwvq.supabase.co
SUPABASE_ANON_KEY=your-anon-key-from-supabase
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Environment
NODE_ENV=production

# CORS (optional - will use Vercel URL automatically)
ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app

# Rate Limiting (optional)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### How to Get Supabase Keys:

1. Go to https://supabase.com/dashboard
2. Select project: **pengeluaran**
3. Go to **Settings** → **API**
4. Copy:
   - Project URL → `SUPABASE_URL`
   - anon/public key → `SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

## After Deployment

### 1. Test API Endpoints

```bash
# Replace YOUR_DOMAIN with your Vercel URL
export API_URL="https://your-app.vercel.app"

# Test health endpoint
curl $API_URL/health

# Test API documentation
open $API_URL/api-docs

# Test login
curl -X POST $API_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"lele@gmail.com","password":"test1234"}'
```

### 2. Update Frontend to Use Production API

Update `client/.env.local`:
```env
NEXT_PUBLIC_API_URL=https://your-app.vercel.app
```

### 3. Configure CORS

If you get CORS errors, add your frontend URL to environment variables:
```env
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://www.your-frontend.vercel.app
```

## Project Structure for Vercel

```
new_expenses/
├── backend/              # Backend API (serverless)
│   ├── src/
│   │   └── main.js      # Main entry point
│   └── package.json     # Backend dependencies
├── client/              # Next.js frontend
│   └── ...
├── vercel.json          # Vercel configuration ✅
└── package.json         # Root package.json
```

## Vercel Configuration Explained

### `vercel.json`:
- **Builds**: Defines how to build backend and frontend
- **Routes**: Maps URLs to appropriate handlers
  - `/health` → Backend
  - `/api/*` → Backend
  - `/api-docs` → Backend Swagger
  - `/*` → Frontend Next.js
- **Functions**: Serverless function configuration
- **Env**: Environment variables

## Troubleshooting

### Issue: "Module not found"
**Solution**: Make sure all dependencies are in `backend/package.json`

### Issue: "Cannot find module .env"
**Solution**: Environment variables are set in Vercel dashboard, not via .env file

### Issue: CORS errors
**Solution**: Add frontend URL to `ALLOWED_ORIGINS` environment variable

### Issue: Swagger UI not loading
**Solution**: Check that route `/api-docs` is mapped correctly in vercel.json

### Issue: 404 on API endpoints
**Solution**: Verify routes in vercel.json match your API structure

## Useful Commands

```bash
# View deployment logs
vercel logs

# List deployments
vercel ls

# Inspect deployment
vercel inspect <deployment-url>

# Set environment variable
vercel env add SUPABASE_URL production

# Remove deployment
vercel rm <deployment-name>
```

## Monitoring

### Check Deployment Status:
1. Go to https://vercel.com/dashboard
2. Select your project
3. View **Deployments** tab for status
4. Click deployment for detailed logs

### View Function Logs:
1. Go to deployment details
2. Click **Functions** tab
3. View real-time logs

## Auto-Deploy Setup

Vercel will automatically deploy when you push to GitHub:
- **Push to main** → Production deployment
- **Push to other branches** → Preview deployment

### To disable auto-deploy:
1. Go to Project Settings
2. **Git** tab
3. Disable **Automatic Deployments**

## Performance Tips

1. **Cold Starts**: First request may be slow (serverless)
2. **Keep-Alive**: Subsequent requests are faster
3. **Caching**: Vercel Edge Network caches responses
4. **Regions**: Vercel deploys to multiple regions automatically

## Security Checklist

- ✅ Environment variables set in Vercel dashboard
- ✅ CORS configured correctly
- ✅ Rate limiting enabled
- ✅ Supabase RLS policies active
- ✅ No sensitive data in code
- ✅ HTTPS enabled (automatic on Vercel)

## Next Steps

After successful deployment:

1. **Update Frontend**: Point client to production API URL
2. **Test All Endpoints**: Use Swagger UI or curl
3. **Monitor Logs**: Check for errors in Vercel dashboard
4. **Setup Custom Domain** (optional):
   - Go to Project Settings → Domains
   - Add your custom domain
5. **Enable Analytics**:
   - Go to Analytics tab
   - View request metrics

## Support

- Vercel Docs: https://vercel.com/docs
- Vercel Discord: https://vercel.com/discord
- GitHub Issues: https://github.com/dhimasrds/new_expenses/issues

---

**Deployment URL**: After deployment, Vercel will provide:
- Production: `https://your-project.vercel.app`
- API: `https://your-project.vercel.app/api`
- Swagger: `https://your-project.vercel.app/api-docs`
