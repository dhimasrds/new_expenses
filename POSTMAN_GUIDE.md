# Postman Collection - Expense Tracker API

## 📦 Files Included

1. **Expense_Tracker_API.postman_collection.json** - Complete API collection
2. **Expense_Tracker_Production.postman_environment.json** - Production environment
3. **Expense_Tracker_Local.postman_environment.json** - Local development environment

## 🚀 How to Import

### Import Collection
1. Open Postman
2. Click **Import** button (top left)
3. Select `Expense_Tracker_API.postman_collection.json`
4. Collection will appear in left sidebar

### Import Environment
1. Click **Import** button
2. Select **both** environment files:
   - `Expense_Tracker_Production.postman_environment.json`
   - `Expense_Tracker_Local.postman_environment.json`
3. Environments will appear in top-right dropdown

## 🔧 Setup

### 1. Select Environment
Click the environment dropdown (top-right) and select:
- **Expense Tracker - Production** (for https://newexpenses.vercel.app)
- **Expense Tracker - Local** (for http://localhost:3001)

### 2. Authentication Flow
The collection uses automatic token management:

1. **Run Login request** in `Authentication` folder
   - Pre-filled with test credentials: `lele@gmail.com` / `test1234`
   - Token automatically saved to environment variable `access_token`
   - User ID saved to `user_id`

2. **All other requests automatically use the token**
   - Authorization header: `Bearer {{access_token}}`

## 📋 Available Endpoints

### Authentication
- **Login** - `POST /api/auth/login`
  - Auto-saves token on success
  - Pre-filled credentials: lele@gmail.com / test1234
  
- **Signup** - `POST /api/auth/signup`
  - Auto-saves token on success
  - Creates new user account

### Expenses
- **Get All Expenses** - `GET /api/expenses`
  - Query params: `page`, `limit`, `category`, `dateFrom`, `dateTo`, `search`
  - All filters are optional and can be enabled/disabled
  
- **Get Expense by ID** - `GET /api/expenses/:id`
  - Uses `{{expense_id}}` variable
  
- **Create Expense** - `POST /api/expenses`
  - Auto-saves expense ID on success
  - Body: description, amount, category, date
  
- **Update Expense** - `PUT /api/expenses/:id`
  - Uses `{{expense_id}}` variable
  
- **Delete Expense** - `DELETE /api/expenses/:id`
  - Uses `{{expense_id}}` variable
  
- **Get Expense Summary** - `GET /api/expenses/summary`
  - Optional filters: category, dateFrom, dateTo
  - Returns total, count, and category breakdown

### Health Check
- **Health Check** - `GET /health`
  - No authentication required
  - Check if API is running

## 🔑 Environment Variables

Auto-managed by collection scripts:

| Variable | Description | Auto-set |
|----------|-------------|----------|
| `base_url` | API base URL | ✅ (by environment) |
| `access_token` | JWT token | ✅ (after login) |
| `user_id` | Current user ID | ✅ (after login) |
| `expense_id` | Last created expense ID | ✅ (after create) |

## 🎯 Quick Start Guide

### First Time Setup
1. Import collection and environments
2. Select **Expense Tracker - Production** environment
3. Run **Authentication → Login**
   - Token automatically saved
4. Run any expense endpoint
   - Token automatically included

### Testing Workflow
```
1. Login (saves token)
   ↓
2. Create Expense (saves expense_id)
   ↓
3. Get All Expenses (view all)
   ↓
4. Get Expense by ID (uses saved expense_id)
   ↓
5. Update Expense (uses saved expense_id)
   ↓
6. Delete Expense (uses saved expense_id)
```

## 🧪 Sample Data

### Login
```json
{
  "email": "lele@gmail.com",
  "password": "test1234"
}
```

### Create Expense
```json
{
  "description": "Grocery Shopping",
  "amount": 89.50,
  "category": "Shopping",
  "date": "2024-10-26"
}
```

### Available Categories
- Shopping
- Food & Dining
- Transportation
- Entertainment
- Bills & Utilities
- Healthcare
- Education
- Other

## 📊 Response Examples

### Login Success
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "56bd5008-dd82-4893-abaf-05be9798b3d6",
      "email": "lele@gmail.com"
    },
    "access_token": "eyJhbGci...",
    "session": {...}
  },
  "message": "Login successful"
}
```

### Get Expenses Success
```json
{
  "success": true,
  "data": {
    "expenses": [
      {
        "id": "exp_fb549f73...",
        "userId": "56bd5008...",
        "description": "Grocery Shopping",
        "amount": 89.3,
        "category": "Shopping",
        "date": "2024-10-20T10:15:00.000Z",
        "createdAt": "2025-10-22T09:21:23.571681+00:00",
        "updatedAt": "2025-10-22T09:21:23.571681+00:00"
      }
    ],
    "total": 1
  },
  "message": "Expenses retrieved successfully"
}
```

### Expense Summary Success
```json
{
  "success": true,
  "data": {
    "total": 89.3,
    "count": 1,
    "byCategory": [
      {
        "category": "Shopping",
        "total": 89.3,
        "count": 1
      }
    ]
  },
  "message": "Expense summary retrieved successfully"
}
```

## 🔒 Authentication

All endpoints except `/health` require JWT Bearer token:
```
Authorization: Bearer {{access_token}}
```

Token is automatically:
- Obtained when you login/signup
- Saved to environment variable
- Included in subsequent requests

## 🌐 Environments

### Production
- **Base URL:** https://newexpenses.vercel.app
- **Use for:** Testing deployed application
- **Database:** Supabase production

### Local
- **Base URL:** http://localhost:3001
- **Use for:** Local development
- **Database:** Same Supabase (shared)

## 💡 Tips

1. **Enable query parameters** by toggling checkboxes in Params tab
2. **View auto-saved variables** in environment (top-right → eye icon)
3. **Check Console** (bottom panel) to see auto-save logs
4. **Use Tests tab** to see automation scripts
5. **Duplicate requests** to test different scenarios

## 🐛 Troubleshooting

### Token Not Working
- Re-run Login request
- Check environment is selected (top-right)
- Verify `access_token` is set (eye icon)

### 404 Not Found
- Check environment's `base_url` is correct
- Ensure backend is running (for Local environment)

### 401 Unauthorized
- Token may be expired (re-login)
- Check Authorization header is enabled

### 500 Server Error
- Check request body format
- View response for error details
- Check Swagger docs: https://newexpenses.vercel.app/api-docs

## 📚 Additional Resources

- **Swagger Documentation:** https://newexpenses.vercel.app/api-docs
- **GitHub Repository:** https://github.com/dhimasrds/new_expenses
- **Production URL:** https://newexpenses.vercel.app

## 🎉 Ready to Test!

You're all set! Start with the Login request and explore the API. The collection handles authentication automatically.
