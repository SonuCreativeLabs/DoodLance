-- Migration: Auto-create User Trigger
-- Description: Automatically creates a public.users row when a new user signs up via Supabase Auth.
-- Created: 2025-01-02

-- 1. Create the Function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role, coords, "updatedAt")
  VALUES (
    new.id::text, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'New User'), 
    'client', -- Default role
    '[0,0]', -- Default coords
    NOW() -- Default updatedAt
  );
  RETURN new;
END;
$$;

-- 2. Create the Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Backfill (Optional - Safe to run)
-- This ensures existing auth users also have a public.users row if missing
INSERT INTO public.users (id, email, name, role, coords, "updatedAt")
SELECT 
  id::text, 
  email, 
  COALESCE(raw_user_meta_data->>'full_name', 'Existing User'),
  'client',
  '[0,0]',
  NOW()
FROM auth.users
WHERE id::text NOT IN (SELECT id FROM public.users)
ON CONFLICT (id) DO NOTHING;
