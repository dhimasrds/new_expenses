# 🎯 Quick Setup Guide untuk Testing API dengan Dummy Data

## Langkah 1: Setup Supabase Project

1. **Buat Project Baru**:
   - Pergi ke [supabase.com](https://supabase.com)
   - Login → New Project
   - Name: `expense-tracker`
   - Password: buat yang kuat
   - Region: Singapore/Tokyo

2. **Setup Database**:
   - Pergi ke **SQL Editor**
   - Copy & paste script dari `expense-tracker-database-setup.sql`
   - Run script

## Langkah 2: Buat Test User

1. **Pergi ke Authentication > Users**
2. **Klik "Add User"**:
   - Email: `test@example.com`
   - Password: `testpassword123`
   - Email Confirm: `Yes`
3. **Copy User UID** (format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

## Langkah 3: Insert Dummy Data

1. **Edit file `dummy-data.sql`**:
   - Ganti semua `USER_ID_DISINI` dengan UUID user yang sudah di-copy
   
2. **Run di SQL Editor**:
   - Copy script dari `dummy-data.sql` yang sudah diedit
   - Run di Supabase SQL Editor

## Langkah 4: Update Environment Variables

1. **Pergi ke Settings > API di Supabase**
2. **Copy credentials**:
   - Project URL
   - `anon` key
   - `service_role` key

3. **Update file `.env`**:
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
# ... rest of config
```

## Langkah 5: Restart Server & Test

```bash
# Stop server saat ini (Ctrl+C di terminal yang running)
# Atau kill process:
pkill -f "node api/index.js"

# Start server lagi
npm start

# Test login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpassword123"}'

# Copy access_token dari response, lalu test expenses:
curl http://localhost:3000/api/v1/expenses \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🎯 Expected Results

Setelah setup selesai, Anda akan mendapatkan:

- ✅ **15 dummy expenses** dengan berbagai kategori
- ✅ **Authentication working** dengan test user
- ✅ **All CRUD endpoints** bisa di-test via Swagger UI
- ✅ **Database queries** dengan filtering dan pagination

## 🧪 Testing di Swagger UI

1. **Login** dengan test user di `/auth/login`
2. **Copy access_token** dari response
3. **Klik "Authorize"** di Swagger UI
4. **Paste token** (dengan prefix "Bearer ")
5. **Test semua endpoints** expenses dengan data dummy

---

**Total time setup: ~10-15 menit** ⏱️

Setelah ini selesai, semua endpoint akan fully functional dengan data dummy! 🚀