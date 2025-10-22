# 🧪 API Testing Guide - Expense Tracker

## 📋 Account Information untuk Testing
```
Email: lele@gmail.com
Password: test1234
User ID: 56bd5008-dd82-4893-abaf-05be9798b3d6
```

## 🚀 Cara Testing di Swagger UI

### 1. Akses Swagger Documentation
Buka browser dan kunjungi: **http://localhost:3000/api-docs**

### 2. Login untuk Mendapatkan Access Token

#### Langkah-langkah:
1. Scroll ke section **Authentication**
2. Cari endpoint **POST /auth/login**
3. Klik **"Try it out"**
4. Masukkan request body:
```json
{
  "email": "lele@gmail.com",
  "password": "test1234"
}
```
5. Klik **"Execute"**
6. **Copy access_token** dari response

#### Expected Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsImtpZCI6...",
  "refresh_token": "xxx",
  "expires_in": 3600,
  "user": {
    "id": "56bd5008-dd82-4893-abaf-05be9798b3d6",
    "email": "lele@gmail.com",
    "created_at": "2025-10-22T10:11:11.341818Z"
  }
}
```

### 3. Setup Authorization di Swagger

#### Langkah-langkah:
1. Klik tombol **"Authorize"** di kanan atas Swagger UI
2. Masukkan: `Bearer YOUR_ACCESS_TOKEN`
   - **Contoh**: `Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6...`
3. Klik **"Authorize"**
4. Klik **"Close"**

### 4. Test Endpoints Expenses

#### 4.1 GET /api/v1/expenses - List All Expenses
- Klik **"Try it out"** → **"Execute"**
- Akan menampilkan semua expenses untuk user yang login

#### 4.2 POST /api/v1/expenses - Create New Expense
```json
{
  "description": "Test Expense dari Swagger",
  "amount": 50.25,
  "category": "Food",
  "date": "2025-10-22T10:30:00.000Z"
}
```

#### 4.3 GET /api/v1/expenses/{id} - Get Specific Expense
- Gunakan ID dari response sebelumnya
- **Contoh**: `exp_53e713a526794fbc87e21d1b0217ea14`

#### 4.4 PUT /api/v1/expenses/{id} - Update Expense
```json
{
  "description": "Updated Description",
  "amount": 75.50,
  "category": "Transport",
  "date": "2025-10-22T11:00:00.000Z"
}
```

#### 4.5 DELETE /api/v1/expenses/{id} - Delete Expense
- Masukkan ID expense yang ingin dihapus

## 🔧 Testing via cURL Commands

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "lele@gmail.com",
    "password": "test1234"
  }'
```

### Set Token (setelah login)
```bash
TOKEN="your_access_token_here"
```

### List Expenses
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/v1/expenses
```

### Create Expense
```bash
curl -X POST http://localhost:3000/api/v1/expenses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "description": "Test via cURL",
    "amount": 30.00,
    "category": "Food",
    "date": "2025-10-22T12:00:00.000Z"
  }'
```

## 📊 Dummy Data yang Tersedia

Database sudah berisi 5 dummy expenses:
1. **Morning Coffee** - $4.50 (Food)
2. **Lunch Meeting** - $25.75 (Food) 
3. **Taxi to Office** - $15.00 (Transport)
4. **Office Supplies** - $67.90 (Work)
5. **Movie Tickets** - $24.00 (Entertainment)

## ⚠️ Troubleshooting

### Error: "Invalid or expired token"
- Pastikan format Authorization header: `Bearer ACCESS_TOKEN`
- Access token berlaku 1 jam, login ulang jika expired
- Pastikan tidak ada spasi extra di token

### Error: "Validation failed"
- Check format data sesuai requirement
- Amount harus positive number
- Category harus salah satu: Food, Transport, Work, Entertainment, Health, Shopping, Bills, Other
- Date harus format ISO 8601

### Server tidak responding
```bash
# Restart server
npm start
```

## 🎯 Scenario Testing yang Disarankan

1. **Authentication Flow**: Login → Get token → Access protected endpoints
2. **CRUD Operations**: Create → Read → Update → Delete expense
3. **Validation Testing**: Try invalid data untuk test error handling
4. **Authorization**: Test tanpa token atau dengan token invalid

## 🔗 Useful Links

- **API Documentation**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health
- **API Info**: http://localhost:3000/api/v1/info

---
*Happy Testing! 🚀*