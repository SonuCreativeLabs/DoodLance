-- Add missing personal details fields to users and freelancer_profiles tables

-- Add date of birth to FreelancerProfile
ALTER TABLE "public"."freelancer_profiles"
ADD COLUMN IF NOT EXISTS "dateOfBirth" TIMESTAMP(3);

-- Add address fields to User table
ALTER TABLE "public"."users"
ADD COLUMN IF NOT EXISTS "address" TEXT,
ADD COLUMN IF NOT EXISTS "city" TEXT,
ADD COLUMN IF NOT EXISTS "state" TEXT,
ADD COLUMN IF NOT EXISTS "postalCode" TEXT;

-- Add comment explaining the schema
COMMENT ON COLUMN "public"."freelancer_profiles"."dateOfBirth" IS 'Freelancer date of birth';
COMMENT ON COLUMN "public"."users"."address" IS 'Street address';
COMMENT ON COLUMN "public"."users"."city" IS 'City name';
COMMENT ON COLUMN "public"."users"."state" IS 'State/County/Province';
COMMENT ON COLUMN "public"."users"."postalCode" IS 'Postal/ZIP code';
