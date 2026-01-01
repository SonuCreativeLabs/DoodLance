-- Enable RLS
ALTER TABLE freelancer_profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" 
ON freelancer_profiles FOR SELECT 
USING (auth.uid() = "userId");

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" 
ON freelancer_profiles FOR UPDATE 
USING (auth.uid() = "userId");

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile" 
ON freelancer_profiles FOR INSERT 
WITH CHECK (auth.uid() = "userId");

-- OPTIONAL: Allow public to view all profiles (for marketplace)
-- If this is desired, uncomment the below:
CREATE POLICY "Public profiles are viewable by everyone" 
ON freelancer_profiles FOR SELECT 
USING (true);
