-- Migration: Switch to Sequential Referral Codes (BAILS + Sequence)
-- Description: Updates handle_new_user to use a sequence for referral codes instead of random MD5.
-- Created: 2026-01-23

-- 1. Create a sequence for referral codes if it doesn't exist
CREATE SEQUENCE IF NOT EXISTS public.user_referral_seq
START WITH 1
INCREMENT BY 1;

-- 2. Update the handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  new_referral_code text;
BEGIN
  -- Generate Sequential Code: BAILS + Sequence Number
  -- e.g., BAILS1, BAILS2, etc.
  new_referral_code := 'BAILS' || nextval('public.user_referral_seq')::text;
  
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
