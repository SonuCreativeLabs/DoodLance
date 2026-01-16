-- Migration: Add Referral Logic to Auto-create User Trigger
-- Description: Updates handle_new_user to generate referralCode and capture referredBy.
-- Created: 2026-01-16

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  new_referral_code text;
BEGIN
  -- Generate unique 8-character referral code
  -- We loop to ensure uniqueness, though collision is rare with 8 chars from md5
  LOOP
    -- Generate potential code
    new_referral_code := upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 8));
    
    -- Check if it exists in public.users
    IF NOT EXISTS (SELECT 1 FROM public.users WHERE "referralCode" = new_referral_code) THEN
      EXIT;
    END IF;
  END LOOP;

  -- Insert the new user into public.users
  INSERT INTO public.users (
    id, 
    email, 
    name, 
    role, 
    coords, 
    "updatedAt", 
    "referralCode", 
    "referredBy"
  )
  VALUES (
    new.id::text, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'New User'), 
    'client', -- Default role
    '[0,0]',  -- Default coords
    NOW(),    -- Default updatedAt
    new_referral_code,
    new.raw_user_meta_data->>'referredBy'
  )
  ON CONFLICT (email) DO NOTHING;
  
  RETURN new;
END;
$$;
