#!/bin/bash

# 🚀 Quick Deployment Script untuk Expense Tracker API
# Usage: ./deploy.sh

echo "🚀 Expense Tracker API Deployment"
echo "=================================="

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found."
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "📝 Please create .env file with your Supabase credentials:"
    echo ""
    echo "SUPABASE_URL=https://your-project.supabase.co"
    echo "SUPABASE_ANON_KEY=your-anon-key" 
    echo "SUPABASE_SERVICE_ROLE_KEY=your-service-role-key"
    echo ""
    echo "💡 Copy from .env.example and fill in your values"
    exit 1
fi

# Test local server first
echo "🧪 Testing local server..."
npm start &
SERVER_PID=$!
sleep 5

# Test health endpoint
HEALTH_CHECK=$(curl -s http://localhost:3000/health)
if [[ $HEALTH_CHECK == *"healthy"* ]]; then
    echo "✅ Local server test passed"
else
    echo "❌ Local server test failed"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

# Stop test server
kill $SERVER_PID 2>/dev/null
sleep 2

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

# Check if deployment was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deployment successful!"
    echo ""
    echo "📚 Next steps:"
    echo "1. Set environment variables in Vercel Dashboard"
    echo "2. Test your API endpoints"
    echo "3. Create frontend application"
    echo ""
    echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"
else
    echo "❌ Deployment failed!"
    echo "💡 Try deploying manually with: vercel --prod"
fi