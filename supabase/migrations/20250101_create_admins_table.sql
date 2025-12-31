-- Create Admin table in Supabase
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('SUPER_ADMIN', 'SUPPORT', 'FINANCE', 'MARKETING')),
    permissions JSONB DEFAULT '[]'::jsonb,
    avatar TEXT,
    last_login_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Create policy: Admins can read their own data
CREATE POLICY "Admins can view own data"
    ON public.admins
    FOR SELECT
    USING (true); -- Will be controlled via API, not direct access

-- Create policy: Only super admins can insert/update/delete
CREATE POLICY "Super admins manage admins"
    ON public.admins
    FOR ALL
    USING (false); -- All admin management via API only

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_admins_email ON public.admins(email);

-- Insert default super admin (password: admin123)
INSERT INTO public.admins (email, password_hash, name, role, permissions)
VALUES (
    'admin@doodlance.com',
    '$2a$10$FiK8yi4OyqzbTxgNdIa6S.Uo2n9.xV.aemRN4xAU3KxI.h/QVjq6y',
    'Super Admin',
    'SUPER_ADMIN',
    '[]'::jsonb
)
ON CONFLICT (email) DO NOTHING;

-- Insert support admin (password: support123)
INSERT INTO public.admins (email, password_hash, name, role, permissions)
VALUES (
    'support@doodlance.com',
    '$2a$10$6ezkBWrgXP.TCZbXVOh5iucm2//JYumutl6aMbpMxej4sX5X19JIe',
    'Support Team',
    'SUPPORT',
    '["users.view", "bookings.view", "support.view", "support.manage"]'::jsonb
)
ON CONFLICT (email) DO NOTHING;

-- Insert finance admin (password: finance123)
INSERT INTO public.admins (email, password_hash, name, role, permissions)
VALUES (
    'finance@doodlance.com',
    '$2a$10$ubERDD9OEDgNKaBClLEWoO8HBwmb6abrJLRkEc1YSDRgdHyPRlMoS',
    'Finance Team',
    'FINANCE',
    '["transactions.view", "transactions.manage", "reports.view", "reports.export"]'::jsonb
)
ON CONFLICT (email) DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_admins_updated_at
    BEFORE UPDATE ON public.admins
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
