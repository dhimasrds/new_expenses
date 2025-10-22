-- ================================================
-- EXPENSE TRACKER DATABASE SETUP
-- ================================================
-- Script ini berisi semua SQL commands yang dibutuhkan untuk setup database
-- expense tracker di Supabase dengan Row Level Security (RLS)

-- ================================================
-- 1. CREATE TABLES
-- ================================================

-- Enable UUID extension (biasanya sudah enabled di Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function untuk generate custom ID dengan prefix
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

-- Create indexes untuk performa
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON expenses(user_id, date);

-- ================================================
-- 2. CREATE TRIGGERS
-- ================================================

-- Function untuk auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger untuk auto-update updated_at pada expenses table
CREATE TRIGGER trigger_expenses_updated_at
    BEFORE UPDATE ON expenses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- 3. ROW LEVEL SECURITY (RLS) SETUP
-- ================================================

-- Enable RLS pada expenses table
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Policy untuk SELECT: user hanya bisa melihat expenses mereka sendiri
CREATE POLICY "Users can view their own expenses" ON expenses
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy untuk INSERT: user hanya bisa membuat expenses untuk diri mereka sendiri
CREATE POLICY "Users can create their own expenses" ON expenses
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy untuk UPDATE: user hanya bisa update expenses mereka sendiri
CREATE POLICY "Users can update their own expenses" ON expenses
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy untuk DELETE: user hanya bisa delete expenses mereka sendiri
CREATE POLICY "Users can delete their own expenses" ON expenses
    FOR DELETE
    USING (auth.uid() = user_id);

-- ================================================
-- 4. VIEWS (OPTIONAL)
-- ================================================

-- View untuk summary expenses per category
CREATE OR REPLACE VIEW expense_summary_by_category AS
SELECT 
    user_id,
    category,
    COUNT(*) as total_expenses,
    SUM(amount) as total_amount,
    AVG(amount) as average_amount,
    MIN(amount) as min_amount,
    MAX(amount) as max_amount
FROM expenses
GROUP BY user_id, category;

-- Enable RLS untuk view
ALTER VIEW expense_summary_by_category SET (security_barrier = true);

-- View untuk monthly summary
CREATE OR REPLACE VIEW expense_monthly_summary AS
SELECT 
    user_id,
    DATE_TRUNC('month', date) as month,
    COUNT(*) as total_expenses,
    SUM(amount) as total_amount,
    COUNT(DISTINCT category) as categories_used
FROM expenses
GROUP BY user_id, DATE_TRUNC('month', date)
ORDER BY month DESC;

-- Enable RLS untuk view
ALTER VIEW expense_monthly_summary SET (security_barrier = true);

-- ================================================
-- 5. FUNCTIONS UNTUK API ENDPOINTS
-- ================================================

-- Function untuk get expenses dengan filtering dan pagination
CREATE OR REPLACE FUNCTION get_user_expenses(
    p_user_id UUID,
    p_limit INTEGER DEFAULT 50,
    p_offset INTEGER DEFAULT 0,
    p_category TEXT DEFAULT NULL,
    p_date_from TIMESTAMPTZ DEFAULT NULL,
    p_date_to TIMESTAMPTZ DEFAULT NULL
)
RETURNS TABLE (
    id TEXT,
    user_id UUID,
    description TEXT,
    amount DECIMAL(10,2),
    category TEXT,
    date TIMESTAMPTZ,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id,
        e.user_id,
        e.description,
        e.amount,
        e.category,
        e.date,
        e.created_at,
        e.updated_at
    FROM expenses e
    WHERE e.user_id = p_user_id
        AND (p_category IS NULL OR e.category = p_category)
        AND (p_date_from IS NULL OR e.date >= p_date_from)
        AND (p_date_to IS NULL OR e.date <= p_date_to)
    ORDER BY e.date DESC, e.created_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permission untuk authenticated users
GRANT EXECUTE ON FUNCTION get_user_expenses TO authenticated;

-- ================================================
-- 6. SAMPLE DATA (UNTUK TESTING)
-- ================================================

-- Insert sample data (uncomment jika diperlukan untuk testing)
/*
-- Pastikan user sudah ada di auth.users
INSERT INTO expenses (user_id, description, amount, category, date) VALUES
    ('sample-user-uuid', 'Coffee with client', 5.75, 'Food', '2025-10-28T10:00:00.000Z'),
    ('sample-user-uuid', 'Office Supplies', 75.50, 'Work', '2025-10-15T14:30:00.000Z'),
    ('sample-user-uuid', 'Bus ticket', 2.50, 'Transport', '2025-10-20T08:15:00.000Z'),
    ('sample-user-uuid', 'Lunch', 12.00, 'Food', '2025-10-21T12:30:00.000Z'),
    ('sample-user-uuid', 'Movie ticket', 15.00, 'Entertainment', '2025-10-22T19:00:00.000Z');
*/

-- ================================================
-- 7. GRANTS DAN PERMISSIONS
-- ================================================

-- Grant permissions untuk authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON expenses TO authenticated;
GRANT SELECT ON expense_summary_by_category TO authenticated;
GRANT SELECT ON expense_monthly_summary TO authenticated;

-- Grant permission untuk sequences (jika ada)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ================================================
-- 8. VERIFICATION QUERIES
-- ================================================

-- Query untuk verify RLS policies
/*
-- Test sebagai authenticated user
SELECT * FROM expenses; -- Should only show user's own expenses

-- Test categories
SELECT DISTINCT category FROM expenses ORDER BY category;

-- Test summary view
SELECT * FROM expense_summary_by_category;

-- Test monthly summary
SELECT * FROM expense_monthly_summary;
*/

-- ================================================
-- 9. CLEANUP (JIKA DIPERLUKAN)
-- ================================================

-- Uncomment jika ingin reset semua
/*
DROP VIEW IF EXISTS expense_monthly_summary;
DROP VIEW IF EXISTS expense_summary_by_category;
DROP TRIGGER IF EXISTS trigger_expenses_updated_at ON expenses;
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS get_user_expenses(UUID, INTEGER, INTEGER, TEXT, TIMESTAMPTZ, TIMESTAMPTZ);
DROP FUNCTION IF EXISTS generate_expense_id();
DROP TABLE IF EXISTS expenses;
*/

-- ================================================
-- NOTES DAN BEST PRACTICES
-- ================================================

/*
1. RLS POLICIES:
   - Semua policies menggunakan auth.uid() untuk memastikan user hanya akses data mereka
   - Selalu test policies dengan user yang berbeda
   - Monitor performance impact dari RLS

2. INDEXES:
   - Index pada user_id untuk filtering cepat
   - Index pada date untuk range queries
   - Composite index untuk query yang sering digunakan

3. VALIDATIONS:
   - Check constraints untuk amount > 0
   - Check constraints untuk description length
   - Enum constraint untuk category

4. SECURITY:
   - Function menggunakan SECURITY DEFINER dengan hati-hati
   - Always validate input pada application level juga
   - Regular audit untuk permissions

5. PERFORMANCE:
   - Pagination dengan LIMIT dan OFFSET
   - Index yang tepat untuk query patterns
   - Monitor query performance dengan EXPLAIN ANALYZE

6. BACKUP:
   - Regular backup database
   - Test restore procedures
   - Monitor disk usage
*/
