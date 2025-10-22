# 🔧 Supabase Setup Manual

## Karena MCP Supabase tidak terkoneksi, mari setup manual:

### 1. Buat Project Supabase

1. **Pergi ke** [supabase.com](https://supabase.com)
2. **Login** dengan GitHub/Google account
3. **New Project**:
   - Organization: Personal (atau buat baru)
   - Name: `expense-tracker-db`
   - Database Password: `ExpenseTracker2024!` (contoh, gunakan yang kuat)
   - Region: `Southeast Asia (Singapore)`

### 2. Setup Database Schema

Setelah project siap (~2 menit), pergi ke **SQL Editor** dan run:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function untuk generate expense ID
CREATE OR REPLACE FUNCTION generate_expense_id()
RETURNS TEXT AS $$
BEGIN
    RETURN 'exp_' || REPLACE(uuid_generate_v4()::text, '-', '');
END;
$$ LANGUAGE plpgsql;

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY DEFAULT generate_expense_id(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    description TEXT NOT NULL CHECK (length(description) > 0 AND length(description) <= 255),
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    category TEXT NOT NULL CHECK (category IN ('Food', 'Transport', 'Work', 'Entertainment', 'Health', 'Shopping', 'Bills', 'Other')),
    date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);

-- Enable RLS
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own expenses" ON expenses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own expenses" ON expenses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own expenses" ON expenses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own expenses" ON expenses
    FOR DELETE USING (auth.uid() = user_id);
```

### 3. Buat Test User

**Pergi ke Authentication > Users**:
- Klik **"Add User"**
- Email: `test@expense.com`
- Password: `TestPassword123!`
- Email Confirmed: `Yes`

### 4. Insert Dummy Data

Copy User UID dari dashboard, lalu run di SQL Editor:

```sql
-- Ganti USER_ID_HERE dengan UUID yang di-copy
INSERT INTO expenses (user_id, description, amount, category, date) VALUES
    ('USER_ID_HERE', 'Morning Coffee', 4.50, 'Food', '2024-10-22T08:30:00.000Z'),
    ('USER_ID_HERE', 'Lunch Meeting', 25.75, 'Food', '2024-10-22T12:30:00.000Z'),
    ('USER_ID_HERE', 'Taxi to Office', 15.00, 'Transport', '2024-10-22T09:00:00.000Z'),
    ('USER_ID_HERE', 'Office Supplies', 67.90, 'Work', '2024-10-21T14:30:00.000Z'),
    ('USER_ID_HERE', 'Movie Tickets', 24.00, 'Entertainment', '2024-10-21T19:00:00.000Z');
```

### 5. Get API Credentials

**Pergi ke Settings > API**:
- Copy `Project URL`
- Copy `anon public` key  
- Copy `service_role secret` key

### 6. Update .env

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Setelah ini selesai, restart server dan test API! 🚀