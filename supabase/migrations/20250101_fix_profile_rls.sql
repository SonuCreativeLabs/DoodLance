-- Enable RLS on freelancer_profiles
ALTER TABLE public.freelancer_profiles ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view their own profile
CREATE POLICY "Users can view their own profile"
ON public.freelancer_profiles
FOR SELECT
USING (auth.uid()::text = "userId");

-- Policy to allow users to update their own profile
CREATE POLICY "Users can update their own profile"
ON public.freelancer_profiles
FOR UPDATE
USING (auth.uid()::text = "userId");

-- Policy to allow users to insert their own profile
CREATE POLICY "Users can insert their own profile"
ON public.freelancer_profiles
FOR INSERT
WITH CHECK (auth.uid()::text = "userId");

-- Also check for client_profiles just in case
ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own client profile"
ON public.client_profiles
FOR SELECT
USING (auth.uid()::text = "userId");

CREATE POLICY "Users can update their own client profile"
ON public.client_profiles
FOR UPDATE
USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert their own client profile"
ON public.client_profiles
FOR INSERT
WITH CHECK (auth.uid()::text = "userId");


-- And public.users table if it exists and is used
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data" 
ON public.users 
FOR SELECT 
USING (auth.uid()::text = id);

CREATE POLICY "Users can update own data" 
ON public.users 
FOR UPDATE 
USING (auth.uid()::text = id);

