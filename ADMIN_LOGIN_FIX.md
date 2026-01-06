# Admin Login Fix - Final Steps

## Problem
The `admins` table has RLS (Row Level Security) enabled which is blocking API access, even with the service role key.

## Solution

### Step 1: Verify you're in the correct Supabase project
1. Go to https://supabase.com/dashboard
2. Select your project: `ykbvbtegmxawgrqctddt` (based on your SUPABASE_URL)
3. Go to **SQL Editor**

### Step 2: Run this EXACT SQL (copy all)

```sql
-- First, check if table exists and see current RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'admins';

-- If RLS is enabled (rowsecurity = true), disable it
ALTER TABLE public.admins DISABLE ROW LEVEL SECURITY;

-- Verify RLS is now disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'admins';

-- Test: Try to select admins
SELECT id, email, name, role, is_active 
FROM public.admins;
```

### Step 3: Expected Output
You should see:
1. First query: `rowsecurity = true` (if RLS was enabled)
2. After ALTER: no errors
3. Second query: `rowsecurity = false` 
4. Final SELECT: Shows your 3 admin accounts

### Step 4: Test Login
After running the SQL successfully:
1. Go to `http://localhost:3000/admin/login`
2. Login with:
   - Email: `admin@doodlance.com`
   - Password: `admin123`

### Step 5: Check Server Logs
Look at your terminal where `npm run dev` is running. You should see:
```
=== ADMIN LOGIN DEBUG ===
1. Email: admin@doodlance.com Password length: 8
2. Supabase configured: true true
3. Supabase query result: { hasData: true, error: undefined }
5. Admin found! Email: admin@doodlance.com Hash prefix: $2a$10$FiK8yi4O
6. Password validation result: true
8. SUCCESS: Password verified!
========================
```

## If It Still Fails

The most likely issue is that the SQL is being run on the wrong database or project. Double-check:
- You're in project `ykbvbtegmxawgrqctddt` 
- The table `admins` exists in the `public` schema
- You see 3 rows when you run: `SELECT * FROM public.admins;`

## Alternative: Use a Direct SQL Client
If the Supabase dashboard SQL editor isn't working, you can connect directly using `psql` or any PostgreSQL client with your connection string from Supabase project settings.
