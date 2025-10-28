# Postman Collection Guide - Updated

## Overview

Postman collection untuk Expense Tracker API dengan struktur response yang sudah distandardisasi sesuai Zalando REST API Guidelines.

## Response Structure

### Success Response
```json
{
  "data": {
    // Response data
  },
  "meta": {
    // Optional metadata (pagination, etc)
  }
}
```

### Error Response
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {
      // Optional additional error details
    }
  }
}
```

## Files

1. **Expense_Tracker_API_Updated.postman_collection.json** - Complete API collection
2. **Expense_Tracker_Environments.postman_environment.json** - Environment variables

## Import Instructions

### Option 1: Import Collection Only
1. Open Postman
2. Click **Import** button
3. Select `Expense_Tracker_API_Updated.postman_collection.json`
4. Collection akan menggunakan production URL secara default

### Option 2: Import Collection + Environment
1. Import collection file
2. Import environment file
3. Select environment dari dropdown di kanan atas Postman

## Auto-Save Features

Collection ini memiliki automatic variable management:

### 1. Login Endpoint
Setelah login berhasil, otomatis menyimpan:
- `accessToken` - Digunakan untuk semua protected endpoints
- `userId` - ID user yang sedang login

```javascript
// Auto-save script di Login request
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.collectionVariables.set('accessToken', response.data.accessToken);
    pm.collectionVariables.set('userId', response.data.user.id);
}
```

### 2. Create Expense Endpoint
Setelah membuat expense, otomatis menyimpan:
- `expenseId` - Digunakan untuk update/delete/get by ID

```javascript
// Auto-save script di Create Expense request
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.collectionVariables.set('expenseId', response.data.id);
}
```

### 3. Signup Endpoint
Setelah signup berhasil, otomatis menyimpan:
- `userId` - ID user yang baru dibuat

## Collection Structure

### Authentication Folder
| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| Signup | POST | Register user baru | No |
| Login | POST | Login dan dapatkan token | No |
| Logout | POST | Logout user | Yes |

### Expenses Folder
| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| Get All Expenses | GET | List expenses dengan pagination | Yes |
| Create Expense | POST | Buat expense baru | Yes |
| Get Expense by ID | GET | Detail single expense | Yes |
| Update Expense | PUT | Update expense | Yes |
| Delete Expense | DELETE | Hapus expense | Yes |

## Usage Flow

### 1. First Time Setup
```
1. Import collection ke Postman
2. Run "Login" request dengan credentials yang valid
   - Email: lele@gmail.com
   - Password: test1234
3. Token otomatis tersimpan
4. Semua protected endpoints siap digunakan
```

### 2. Create & Manage Expense
```
1. Run "Create Expense" 
   → expenseId tersimpan otomatis
2. Run "Get Expense by ID" 
   → menggunakan expenseId yang tersimpan
3. Run "Update Expense" 
   → update expense yang sama
4. Run "Delete Expense" 
   → hapus expense
```

### 3. List with Filters
```
Get All Expenses dengan query parameters:
- page=1 (page number)
- limit=10 (items per page)
- category=Food (optional filter)
- startDate=2025-10-01T00:00:00.000Z (optional)
- endDate=2025-10-31T23:59:59.999Z (optional)
```

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | Invalid input data |
| UNAUTHORIZED | 401 | Missing or invalid token |
| INVALID_CREDENTIALS | 401 | Wrong email/password |
| FORBIDDEN | 403 | Access denied |
| NOT_FOUND | 404 | Resource not found |
| USER_ALREADY_EXISTS | 409 | Email already registered |
| INTERNAL_ERROR | 500 | Server error |

## Environment Variables

### Collection Variables (Auto-managed)
- `baseUrl`: https://newexpenses.vercel.app
- `accessToken`: JWT token (auto-saved after login)
- `userId`: Current user ID (auto-saved)
- `expenseId`: Last created expense ID (auto-saved)

### Manual Override
Jika ingin test dengan specific expense ID:
1. Klik collection "Expense Tracker API - Updated"
2. Tab "Variables"
3. Update value `expenseId`

## Example Requests

### 1. Signup New User
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "test1234",
  "fullName": "New User"
}
```

**Response:**
```json
{
  "data": {
    "user": {
      "id": "uuid",
      "email": "newuser@example.com"
    }
  }
}
```

### 2. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "lele@gmail.com",
  "password": "test1234"
}
```

**Response:**
```json
{
  "data": {
    "user": {
      "id": "uuid",
      "email": "lele@gmail.com"
    },
    "accessToken": "eyJhbGci..."
  }
}
```

### 3. Create Expense
```http
POST /api/expenses
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
  "description": "Team lunch",
  "amount": 45.75,
  "category": "Food",
  "date": "2025-10-28T12:00:00.000Z"
}
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "description": "Team lunch",
    "amount": 45.75,
    "category": "Food",
    "date": "2025-10-28T12:00:00.000Z",
    "created_at": "2025-10-28T12:05:00.000Z",
    "updated_at": "2025-10-28T12:05:00.000Z"
  }
}
```

### 4. Get All Expenses (Paginated)
```http
GET /api/expenses?page=1&limit=10&category=Food
Authorization: Bearer {{accessToken}}
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "description": "Team lunch",
      "amount": 45.75,
      "category": "Food",
      "date": "2025-10-28T12:00:00.000Z",
      "created_at": "2025-10-28T12:05:00.000Z",
      "updated_at": "2025-10-28T12:05:00.000Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

### 5. Error Example
```http
POST /api/expenses
Authorization: Bearer invalid_token
```

**Response:**
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}
```

## Valid Categories

Expense categories yang bisa digunakan:
- Food
- Transport
- Work
- Entertainment
- Health
- Shopping
- Bills
- Other

## Tips & Tricks

### 1. Quick Test All Endpoints
1. Login terlebih dahulu
2. Gunakan "Run collection" untuk test semua endpoints sekaligus
3. Check hasil di Collection Runner

### 2. Test Error Scenarios
- Remove Bearer token untuk test unauthorized
- Gunakan invalid expenseId untuk test not found
- Send invalid data untuk test validation errors

### 3. Monitor Response Time
- Enable "Time" column di Postman
- Monitor performance untuk setiap endpoint
- Production target: < 500ms

### 4. Environment Switching
Jika ingin test di local:
1. Duplicate environment
2. Change `baseUrl` to `http://localhost:3001`
3. Switch environment di dropdown

## Troubleshooting

### Token Expired
**Error:** `{"error": {"code": "UNAUTHORIZED", "message": "Token expired"}}`

**Solution:** Run Login request lagi untuk mendapatkan token baru.

### Expense Not Found
**Error:** `{"error": {"code": "NOT_FOUND", "message": "Expense not found"}}`

**Solution:** 
1. Check apakah `expenseId` variable sudah di-set
2. Run "Create Expense" untuk membuat expense baru
3. Atau copy ID dari "Get All Expenses" response

### Invalid Category
**Error:** `{"error": {"code": "VALIDATION_ERROR", "message": "Invalid category"}}`

**Solution:** Gunakan salah satu dari valid categories (Food, Transport, Work, dll)

## Testing Checklist

- [ ] Signup new user → user created, userId saved
- [ ] Login existing user → token saved, userId saved
- [ ] Get all expenses → returns paginated list
- [ ] Create expense → expense created, expenseId saved
- [ ] Get expense by ID → returns single expense
- [ ] Update expense → expense updated
- [ ] Delete expense → expense deleted
- [ ] Logout → token invalidated
- [ ] Test pagination (page 1, 2, 3)
- [ ] Test filters (category, date range)
- [ ] Test error scenarios (invalid token, not found, etc)

## Additional Resources

- **Swagger Documentation:** https://newexpenses.vercel.app/api-docs
- **API Response Structure:** See `API_RESPONSE_STRUCTURE.md`
- **OpenAPI Spec:** See `pengeluaran_documentation_guide/expense-tracker-openapi.yaml`

## Support

Jika ada issue atau pertanyaan:
1. Check Swagger documentation
2. Review error response structure
3. Verify token belum expired
4. Check console logs di Postman

---

**Last Updated:** October 28, 2025
**API Version:** 2.0 (Standardized Response Structure)
