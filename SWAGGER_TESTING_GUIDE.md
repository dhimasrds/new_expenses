# 🧪 Panduan Testing API di Swagger UI

## 🚀 Akses Swagger UI
Buka browser: **http://localhost:3000/api-docs**

## 📋 Akun Testing
```
Email: lele@gmail.com
Password: test1234
User ID: 56bd5008-dd82-4893-abaf-05be9798b3d6
```

## 🔐 Cara Testing Authentication di Swagger

### 1. Login untuk Mendapatkan Token

1. **Scroll ke section "Authentication"**
2. **Klik endpoint "POST /auth/login"**
3. **Klik "Try it out"**
4. **Masukkan request body:**
   ```json
   {
     "email": "lele@gmail.com", 
     "password": "test1234"
   }
   ```
5. **Klik "Execute"**
6. **Copy access_token dari response** (akan seperti: `eyJhbGciOiJIUzI1NiIs...`)

### 2. Setup Authorization di Swagger UI

1. **Cari tombol "Authorize" di kanan atas Swagger UI** 🔒
2. **Klik tombol "Authorize"**
3. **Di field "bearerAuth (http, Bearer)", masukkan:**
   ```
   Bearer YOUR_ACCESS_TOKEN_HERE
   ```
   **Contoh:**
   ```
   Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6IlBNUVJpNUIvUjRwRUpNR3oiLCJ0eXAiOiJKV1QifQ...
   ```
4. **Klik "Authorize"**
5. **Klik "Close"**

### 3. Test Protected Endpoints

Setelah setup authorization, semua endpoint yang memerlukan authentication akan secara otomatis mengirim Bearer token di header.

#### Endpoint yang Bisa Ditest:
- **GET /api/v1/expenses** - List semua expenses
- **POST /api/v1/expenses** - Buat expense baru
- **GET /api/v1/expenses/{id}** - Detail expense
- **PUT /api/v1/expenses/{id}** - Update expense  
- **DELETE /api/v1/expenses/{id}** - Hapus expense

## 🎯 Testing Scenarios

### Scenario 1: Read All Expenses
1. Setup authorization (langkah di atas)
2. Klik **GET /api/v1/expenses**
3. Klik **"Try it out" → "Execute"**
4. Akan menampilkan list expenses untuk user yang login

### Scenario 2: Create New Expense
1. Setup authorization
2. Klik **POST /api/v1/expenses**
3. Klik **"Try it out"**
4. Masukkan data:
   ```json
   {
     "description": "Test dari Swagger UI",
     "amount": 50.25,
     "category": "Food",
     "date": "2025-10-22T15:00:00.000Z"
   }
   ```
5. Klik **"Execute"**

### Scenario 3: Update Expense
1. Get ID dari response create atau list
2. Klik **PUT /api/v1/expenses/{id}**
3. Masukkan ID dan data update

## 🔧 Demo Endpoints (Tanpa Authentication)

Jika ada masalah dengan JWT verification, gunakan endpoint demo ini untuk melihat data:

### GET /api/v1/expenses/test
```bash
curl http://localhost:3000/api/v1/expenses/test
```

### GET /api/v1/expenses/demo  
```bash
curl http://localhost:3000/api/v1/expenses/demo
```

## ⚠️ Troubleshooting

### Masalah "Invalid or expired token"
1. **Pastikan format authorization:** `Bearer ACCESS_TOKEN` (ada spasi setelah Bearer)
2. **Token expires dalam 1 jam** - login ulang jika expired
3. **Pastikan tidak ada spasi extra** di awal/akhir token

### Masalah "No Authorization Header"
1. **Pastikan sudah klik tombol "Authorize"** di Swagger UI
2. **Pastikan token dimasukkan dengan format: `Bearer TOKEN`**
3. **Coba refresh halaman Swagger** dan setup ulang authorization

### Server Error
```bash
# Restart server jika ada masalah
npm start
```

## 📊 Data Dummy yang Tersedia

Database sudah berisi 10 dummy expenses:
1. Morning Coffee - $4.50
2. Lunch Meeting - $25.75  
3. Taxi to Office - $15.00
4. Office Supplies - $67.90
5. Movie Tickets - $24.00
6. Pharmacy Visit - $35.60
7. Grocery Shopping - $89.30
8. Electricity Bill - $125.00
9. Gas Station - $55.80
10. Team Lunch - $42.50

## 🔗 Links Penting

- **Swagger UI:** http://localhost:3000/api-docs
- **Health Check:** http://localhost:3000/health  
- **API Info:** http://localhost:3000/api/v1/info
- **Demo Endpoint:** http://localhost:3000/api/v1/expenses/demo

---
**Status:** ✅ Login | ✅ Database | ⚠️ JWT (gunakan demo endpoints jika ada masalah)

**Happy Testing! 🚀**