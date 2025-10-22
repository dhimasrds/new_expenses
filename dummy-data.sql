-- ================================================
-- DUMMY DATA UNTUK TESTING EXPENSE TRACKER
-- ================================================

-- 1. BUAT TEST USER (Via Supabase Auth Dashboard)
-- Pergi ke Authentication > Users di Supabase dashboard
-- Klik "Add User" dan buat user dengan:
-- Email: test@example.com
-- Password: testpassword123
-- Konfirmasi: Yes

-- 2. DAPATKAN USER ID
-- Setelah user dibuat, copy UUID dari kolom "User UID"
-- Ganti 'USER_ID_DISINI' di bawah dengan UUID tersebut

-- 3. INSERT DUMMY EXPENSES
-- Ganti USER_ID_DISINI dengan UUID user yang sudah dibuat
INSERT INTO expenses (user_id, description, amount, category, date) VALUES
    ('USER_ID_DISINI', 'Morning Coffee', 4.50, 'Food', '2024-10-22T08:30:00.000Z'),
    ('USER_ID_DISINI', 'Lunch at Restaurant', 18.75, 'Food', '2024-10-22T12:30:00.000Z'),
    ('USER_ID_DISINI', 'Uber to Office', 12.00, 'Transport', '2024-10-22T09:00:00.000Z'),
    ('USER_ID_DISINI', 'Office Supplies', 45.90, 'Work', '2024-10-21T14:30:00.000Z'),
    ('USER_ID_DISINI', 'Movie Ticket', 15.00, 'Entertainment', '2024-10-21T19:00:00.000Z'),
    ('USER_ID_DISINI', 'Pharmacy', 25.60, 'Health', '2024-10-20T16:45:00.000Z'),
    ('USER_ID_DISINI', 'Grocery Shopping', 67.30, 'Shopping', '2024-10-20T10:15:00.000Z'),
    ('USER_ID_DISINI', 'Electricity Bill', 125.00, 'Bills', '2024-10-19T00:00:00.000Z'),
    ('USER_ID_DISINI', 'Gas Station', 55.80, 'Transport', '2024-10-19T17:20:00.000Z'),
    ('USER_ID_DISINI', 'Team Lunch', 32.50, 'Work', '2024-10-18T13:00:00.000Z'),
    ('USER_ID_DISINI', 'Netflix Subscription', 12.99, 'Entertainment', '2024-10-18T00:00:00.000Z'),
    ('USER_ID_DISINI', 'Coffee Beans', 24.90, 'Shopping', '2024-10-17T11:30:00.000Z'),
    ('USER_ID_DISINI', 'Doctor Visit', 150.00, 'Health', '2024-10-17T14:00:00.000Z'),
    ('USER_ID_DISINI', 'Dinner with Friends', 45.20, 'Food', '2024-10-16T20:30:00.000Z'),
    ('USER_ID_DISINI', 'Book Purchase', 29.99, 'Other', '2024-10-16T15:45:00.000Z');

-- 4. VERIFY DATA
SELECT 
    id,
    description,
    amount,
    category,
    date,
    created_at
FROM expenses 
WHERE user_id = 'USER_ID_DISINI'
ORDER BY date DESC;

-- 5. SUMMARY BY CATEGORY
SELECT 
    category,
    COUNT(*) as total_expenses,
    SUM(amount) as total_amount,
    AVG(amount) as average_amount
FROM expenses 
WHERE user_id = 'USER_ID_DISINI'
GROUP BY category
ORDER BY total_amount DESC;