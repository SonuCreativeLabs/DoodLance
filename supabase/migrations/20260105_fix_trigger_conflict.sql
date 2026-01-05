-- Migration: Fix Auto-create User Trigger (Handle Conflicts)
-- Description: Updates the handle_new_user function to gracefully handle duplicate emails/IDs.
-- Created: 2026-01-05

-- 1. Update the Function with ON CONFLICT
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
  )
  ON CONFLICT (email) DO NOTHING; -- Gracefully ignore if email already exists
  
  -- Use ON CONFLICT (email) because 'users_email_key' is the error we saw.
  -- Ideally, auth.users and public.users should be 1:1, but manual inserts might break this.
  
  RETURN new;
END;
$$;
