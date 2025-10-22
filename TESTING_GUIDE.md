# 🧪 Testing Guide untuk Expense Tracker API

## 📋 Setup Test User

Untuk testing REST API di Swagger UI, Anda perlu membuat user test terlebih dahulu.

### 1. Akses Swagger UI
Buka browser dan navigasi ke: **http://localhost:3000/api-docs**

### 2. Membuat Test User

#### Cara 1: Menggunakan Endpoint Signup
1. Di Swagger UI, cari endpoint `POST /auth/signup`
2. Klik "Try it out"
3. Masukkan data berikut:
```json
{
  "email": "test@example.com",
  "password": "testpassword123"
}
```
4. Klik "Execute"
5. Jika berhasil, Anda akan mendapat response dengan `access_token`

#### Cara 2: Menggunakan curl (Terminal)
```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123"
  }'
```

### 3. Login untuk Mendapatkan Access Token

#### Di Swagger UI:
1. Cari endpoint `POST /auth/login`
2. Klik "Try it out"
3. Masukkan:
```json
{
  "email": "test@example.com",
  "password": "testpassword123"
}
```
4. **SALIN access_token dari response!**

#### Menggunakan curl:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123"
  }'
```

### 4. Authorize di Swagger UI

1. Scroll ke atas halaman Swagger UI
2. Klik tombol **"Authorize"** 🔒
3. Masukkan: `Bearer YOUR_ACCESS_TOKEN`
   - Contoh: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
4. Klik "Authorize"
5. Klik "Close"

## 🚀 Testing Expense Endpoints

Setelah authorized, Anda bisa test semua endpoint expenses:

### 1. GET /api/v1/expenses
- Melihat semua expenses
- **Sudah ada dummy data** di database untuk testing

### 2. POST /api/v1/expenses
- Membuat expense baru
- Contoh data:
```json
{
  "description": "Makan siang di cafe",
  "amount": 25000,
  "category": "Food",
  "date": "2025-10-22"
}
```

### 3. GET /api/v1/expenses/{id}
- Melihat detail expense
- Gunakan ID dari dummy data: `exp_0054d83f916d448ba0d356c00d18b935`

### 4. PUT /api/v1/expenses/{id}
- Update expense
- Menggunakan ID yang sama

### 5. DELETE /api/v1/expenses/{id}
- Hapus expense
- **Hati-hati:** data akan benar-benar terhapus

## 📊 Data Dummy untuk Testing

Database sudah memiliki **10 dummy expenses** dengan user_id: `8922d5b2-46b1-49dd-a203-058bedd2c8c6`

Pastikan user test Anda menggunakan ID yang sama atau data won't show up!

## ⚠️ Troubleshooting

### Server tidak jalan?
```bash
# Kill existing process
pkill -f "node.*api/index.js"

# Start server
npm start
```

### Environment variables tidak loaded?
```bash
# Menggunakan script startup
./start-server.sh
```

### "Invalid API key" error?
- Pastikan file `.env` ada dan berisi Supabase credentials
- Restart server dengan `./start-server.sh`

### Token expired?
- Login ulang untuk mendapat access_token baru
- Update authorization di Swagger UI

## 🔧 Test Data Examples

### Valid Categories:
- Food
- Transport  
- Work
- Entertainment
- Health
- Shopping
- Bills
- Other

### Sample Test Expenses:
```json
[
  {
    "description": "Breakfast at McDonald's",
    "amount": 15000,
    "category": "Food",
    "date": "2025-10-22"
  },
  {
    "description": "Bus ticket to office",
    "amount": 5000,
    "category": "Transport",
    "date": "2025-10-22"
  },
  {
    "description": "Netflix subscription",
    "amount": 65000,
    "category": "Entertainment",
    "date": "2025-10-22"
  }
]
```

## 📱 Quick Test Flow

1. **Start Server**: `npm start`
2. **Open Swagger**: http://localhost:3000/api-docs
3. **Signup**: POST /auth/signup dengan email & password
4. **Login**: POST /auth/login untuk dapat token
5. **Authorize**: Klik Authorize, masukkan `Bearer TOKEN`
6. **Test Endpoints**: Coba semua expense endpoints
7. **Check Data**: GET /api/v1/expenses untuk lihat dummy data

## 🎯 Success Indicators

✅ **Signup berhasil**: Response 201 dengan user data
✅ **Login berhasil**: Response 200 dengan access_token  
✅ **Authorization berhasil**: Swagger UI shows "🔓 Authorized"
✅ **GET expenses berhasil**: Response 200 dengan array data
✅ **POST expense berhasil**: Response 201 dengan data baru
✅ **Health check**: http://localhost:3000/health shows "healthy"

Happy Testing! 🚀