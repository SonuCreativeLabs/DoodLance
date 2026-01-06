# DoodLance Production Deployment Checklist

> **Use this checklist before every production deployment to catch issues early**

---

## ✅ Pre-Deployment Checklist

### 1. Code Quality

- [ ] All TypeScript errors resolved (`npm run build` succeeds)
- [ ] No `console.log` statements in production code (except intentional logging)
- [ ] No commented-out code blocks
- [ ] No TODO comments for critical features
- [ ] All imports are used (no unused imports)

### 2. Environment Variables

- [ ] `.env.production` file exists and is configured
- [ ] `NEXT_PUBLIC_SUPABASE_URL` is set
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
- [ ] `DATABASE_URL` points to production database
- [ ] All Vercel environment variables are synced
- [ ] No sensitive keys are committed to Git

**Verify:**
```bash
# Check .env.production exists
ls -la .env.production

# Verify required variables (don't print values!)
grep -c "NEXT_PUBLIC_SUPABASE_URL" .env.production
grep -c "DATABASE_URL" .env.production
```

### 3. Database Migrations

- [ ] All migration files in `supabase/migrations/` are tested locally
- [ ] Migration files are named with timestamp format: `YYYYMMDD_description.sql`
- [ ] Migrations are idempotent (can be run multiple times safely)
- [ ] Migrations include rollback instructions in comments
- [ ] Production database backup taken before migration

**Apply Migrations:**
```bash
# Test locally first
npx supabase db push

# For production (via Supabase Dashboard SQL Editor)
# Paste migration SQL and run manually
# OR use CLI with production connection string
```

### 4. Prisma Schema

- [ ] `prisma/schema.prisma` is in sync with database
- [ ] Prisma client is generated (`npm run db:generate`)
- [ ] No Prisma warnings during build
- [ ] `postinstall` script includes `prisma generate`

**Verify:**
```bash
npm run db:generate
# Should show: "✔ Generated Prisma Client"
```

### 5. API Routes

- [ ] All protected routes have authentication checks
- [ ] Authorization is implemented (users can only access their own data)
- [ ] Input validation is in place
- [ ] Error handling with try/catch
- [ ] Appropriate HTTP status codes used
- [ ] No hard-coded user IDs or test data

### 6. RLS Policies

- [ ] RLS is **NOT** enabled on tables accessed via Prisma
- [ ] RLS **IS** enabled on Supabase Storage buckets
- [ ] Storage policies allow users to upload/read their own files
- [ ] No overly permissive policies (`USING (true)` for writes)

**Verify Storage RLS:**
```sql
-- Run in Supabase SQL Editor
SELECT schemaname, tablename, policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'storage'
ORDER BY tablename, policyname;
```

### 7. Dependencies

- [ ] No security vulnerabilities (`npm audit`)
- [ ] All dependencies are up to date (or known safe versions)
- [ ] `package-lock.json` is committed
- [ ] No peer dependency warnings

**Check:**
```bash
npm audit
# Address any HIGH or CRITICAL vulnerabilities
```

---

## 🧪 Testing Checklist

### Manual Testing (Pre-Deployment)

#### Authentication Flow
- [ ] Email OTP login works
- [ ] Phone OTP login works
- [ ] Session persists after page refresh
- [ ] Logout works correctly
- [ ] Protected routes redirect to login when not authenticated

#### User Profile
- [ ] Phone number persists after save and refresh
- [ ] Profile updates are reflected immediately
- [ ] Avatar upload works
- [ ] Username validation works
- [ ] Location updates correctly

#### Freelancer Features
- [ ] Create service works
- [ ] Edit service works
- [ ] Service appears in listings
- [ ] Portfolio upload works
- [ ] Availability settings save

#### Client Features
- [ ] Job posting works
- [ ] Viewing applications works
- [ ] Accepting/rejecting applications works
- [ ] Messaging freelancers works

#### Job Application Flow
- [ ] Freelancer can apply to jobs
- [ ] Application appears in client's dashboard
- [ ] Application appears in freelancer's dashboard
- [ ] Status updates work (pending → accepted/rejected)
- [ ] Notifications are created

### API Testing

Test critical endpoints with curl or Postman:

```bash
# Health check
curl https://doodlance.vercel.app/api/health

# Get user profile (authenticated)
curl https://doodlance.vercel.app/api/freelancer/profile \
  -H "Cookie: sb-access-token=YOUR_TOKEN"

# Create application (authenticated)
curl -X POST https://doodlance.vercel.app/api/applications \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-access-token=YOUR_TOKEN" \
  -d '{
    "jobId": "test-job-id",
    "coverLetter": "Test",
    "proposedRate": 5000,
    "estimatedDays": 7,
    "freelancerId": "test-user-id"
  }'
```

### Database Testing

```sql
-- Verify critical data exists
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM freelancer_profiles;
SELECT COUNT(*) FROM services;
SELECT COUNT(*) FROM jobs;

-- Check for orphaned records
SELECT COUNT(*) FROM bookings WHERE "serviceId" NOT IN (SELECT id FROM services);
SELECT COUNT(*) FROM applications WHERE "jobId" NOT IN (SELECT id FROM jobs);

-- Verify indexes exist (for performance)
SELECT tablename, indexname 
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

---

## 🚀 Deployment Process

### Step 1: Prepare Release

```bash
# 1. Create a release branch
git checkout -b release/v1.x.x

# 2. Update version (if using semantic versioning)
npm version patch  # or minor, or major

# 3. Test build locally
npm run build

# 4. Commit changes
git add .
git commit -m "chore: prepare release v1.x.x"

# 5. Push to GitHub
git push origin release/v1.x.x
```

### Step 2: Apply Database Migrations

```bash
# Option 1: Via Supabase Dashboard
# - Go to SQL Editor
# - Paste migration SQL
# - Run and verify

# Option 2: Via CLI
npx supabase db push --db-url "$PRODUCTION_DATABASE_URL"
```

### Step 3: Deploy to Vercel

```bash
# Option 1: Merge to main (auto-deploy)
git checkout main
git merge release/v1.x.x
git push origin main

# Option 2: Manual deploy via Vercel CLI
npm i -g vercel
vercel --prod
```

### Step 4: Verify Deployment

- [ ] Check Vercel deployment logs (no errors)
- [ ] Verify build completed successfully
- [ ] Check runtime logs for errors
- [ ] Test health endpoint: `https://your-domain.com/api/health`
- [ ] Test authentication flow end-to-end
- [ ] Verify database connectivity
- [ ] Check Sentry for any new errors (if configured)

---

## 🔥 Rollback Procedure

### If Deployment Fails

**Option 1: Revert in Vercel Dashboard**
1. Go to Vercel Dashboard > Deployments
2. Find the last working deployment
3. Click "..." menu → "Promote to Production"

**Option 2: Git Revert**
```bash
# Identify bad commit
git log --oneline

# Revert the commit
git revert <commit-hash>

# Push to trigger new deployment
git push origin main
```

### If Database Migration Fails

**Immediate Actions:**
1. Do NOT panic
2. Check error logs in Supabase Dashboard
3. If migration partially applied, document which statements succeeded

**Rollback Migration:**
```sql
-- Example: If you added a column
ALTER TABLE "public"."users" DROP COLUMN IF EXISTS "new_column";

-- Example: If you created a table
DROP TABLE IF EXISTS "public"."new_table";

-- Example: If you created an index
DROP INDEX IF EXISTS "public"."idx_name";
```

**Best Practice:**
Always include rollback SQL in migration file comments:

```sql
-- ============================================
-- Migration: Add Rating Column
-- Rollback: ALTER TABLE users DROP COLUMN rating;
-- ============================================
ALTER TABLE users ADD COLUMN rating DECIMAL(3,2);
```

---

## 📊 Post-Deployment Monitoring

### First 30 Minutes

- [ ] Check Vercel runtime logs (no 500 errors)
- [ ] Monitor error rate in Sentry (if configured)
- [ ] Test critical user flows manually
- [ ] Check database query performance
- [ ] Monitor API response times

### First 24 Hours

- [ ] Review error logs daily
- [ ] Check user-reported issues
- [ ] Monitor database size/usage
- [ ] Check for any unusual patterns
- [ ] Verify scheduled tasks are running (if any)

### Monitoring Queries

```sql
-- Check recent errors (if you have error logging)
SELECT * FROM error_logs 
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;

-- Check recent user activity
SELECT COUNT(*) as active_users, DATE(created_at) as date
FROM users
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at);

-- Check application submission rate
SELECT COUNT(*) as total, status
FROM applications
WHERE created_at > NOW() - INTERVAL '1 day'
GROUP BY status;
```

---

## 🆘 Common Issues & Quick Fixes

### Issue: Build Fails with TypeScript Error

**Quick Fix:**
```bash
# See exact error
npm run build

# Common causes:
# - Missing type imports
# - Unused variables
# - Implicit 'any' types

# Fix then rebuild
npm run build
```

### Issue: Database Connection Error

**Check:**
1. Verify `DATABASE_URL` in Vercel environment variables
2. Check Supabase project is not paused
3. Verify connection string format: `postgresql://postgres:[password]@HOST:6543/postgres?pgbouncer=true`

**Test Connection:**
```typescript
// Add to a test API route
import prisma from '@/lib/db';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return Response.json({ status: 'ok' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
```

### Issue: Authentication Not Working

**Check:**
1. Verify Supabase URL and anon key in Vercel env vars
2. Check Supabase project settings > Auth > Site URL
3. Verify redirect URLs in Supabase settings
4. Check browser cookies are enabled

**Debug:**
```typescript
// In API route
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Auth user:', user?.id || 'No user');
```

### Issue: Slow API Response

**Check:**
1. Missing database indexes
2. N+1 query problem (use `include` in Prisma)
3. Large JSON fields being parsed repeatedly

**Add Index:**
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_applications_freelancer ON applications("freelancerId");
CREATE INDEX idx_jobs_client ON jobs("clientId");
```

---

## 🎯 Success Criteria

Deployment is successful when:

- ✅ Build completes without errors
- ✅ All environment variables are configured
- ✅ Database migrations applied successfully
- ✅ Health check endpoint returns 200 OK
- ✅ Authentication flow works end-to-end
- ✅ Critical user flows work (job posting, applications, etc.)
- ✅ No 500 errors in first hour
- ✅ Database queries are performant
- ✅ File uploads work
- ✅ Notifications are being created

---

## 📝 Deployment Log Template

Keep a log of each deployment:

```markdown
## Deployment: v1.2.3
**Date:** 2026-01-02  
**Deployed By:** [Your Name]  
**Deployment Time:** 18:30 IST

### Changes
- Fixed phone number persistence issue
- Updated RLS policies for freelancer profiles
- Added verification document upload

### Migrations Applied
- 20260102_fix_freelancer_rls_final.sql

### Verification
- [x] Build successful
- [x] Health check passed
- [x] Auth flow tested
- [x] Phone number persistence verified
- [x] File upload tested

### Issues Encountered
None

### Rollback Required
No
```

---

## 🔗 Quick Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Sentry (Errors):** [Your Sentry URL if configured]
- **Production Site:** https://doodlance.vercel.app
- **Health Check:** https://doodlance.vercel.app/api/health

---

**Last Updated:** January 2, 2026  
**Version:** 1.0.0

> [!TIP]
> Print this checklist and check off items as you go through the deployment process. It's easy to miss critical steps when deploying under pressure!
