# DoodLance Backend System Documentation

## Executive Summary

This document establishes the **single source of truth** for backend, database, and API implementation in the DoodLance application. Follow these guidelines to ensure consistency, prevent recurring bugs, and maintain a production-ready system.

---

## 🔍 Current Architecture Overview

### Technology Stack

```
Frontend:   Next.js 14 (App Router), React 18, TypeScript
Backend:    Next.js API Routes (Server-Side)
Database:   PostgreSQL (via Supabase)
ORM:        Prisma Client
Auth:       Supabase Auth (Email/Phone OTP)
Storage:    Supabase Storage (File uploads)
Hosting:    Vercel (Frontend + API Routes)
```

### Dual Database Architecture

> [!IMPORTANT]
> The app uses **Prisma as the primary data access layer** but relies on **Supabase for authentication and storage**.

**Key Points:**
- **Prisma** handles all database queries (bypasses Supabase RLS)
- **Supabase Auth** manages user authentication (email/phone OTP)
- **Supabase Storage** handles file uploads with RLS policies
- Row Level Security (RLS) is **enabled but primarily for Supabase Storage**, not for table access via API routes

---

## 🚨 Identified Pain Points & Solutions

### 1. **Recurring RLS Policy Bugs**

**Problem:** Multiple migration files fixing the same RLS issues repeatedly
- `20250101_fix_profile_rls.sql`
- `20260102_fix_freelancer_rls.sql`
- `20260102_fix_freelancer_rls_v2.sql`
- `20260102_fix_freelancer_rls_final.sql`

**Root Cause:**
- RLS policies being applied inconsistently
- Policies not matching the actual data access pattern (Prisma bypasses RLS)
- Manual SQL execution in Supabase dashboard instead of proper migrations

**Solution:**
1. **Stop applying RLS to tables accessed via Prisma** - Prisma uses a service role connection that bypasses RLS
2. **Only use RLS for Supabase Storage buckets**
3. **Implement authorization in API routes** (see API Patterns section)
4. **Use migrations for ALL database changes** - never execute raw SQL in production

### 2. **Inconsistent User ID Handling**

**Problem:** Mixing `auth.uid()` (Supabase Auth) with Prisma User IDs

**Solution:**
- **In API Routes:** Use `supabase.auth.getUser()` to get authenticated user, then query Prisma by `userId`
- **Ensure user creation:** Maintain `supabaseUid` field in `users` table to link Prisma users to Supabase Auth users

Pattern:
```typescript
// ✅ CORRECT
const supabase = createClient();
const { data: { user }, error } = await supabase.auth.getUser();
const dbUser = await prisma.user.findUnique({ where: { id: user.id } });

// ❌ WRONG - Don't use auth.uid() in RLS policies for Prisma-accessed tables
```

### 3. **Migration Files Not Applied Consistently**

**Problem:** Migration files exist but may not be applied to production database

**Solution:**
- Use Supabase CLI for migrations: `npx supabase db push`
- Track migration history in `supabase/migrations` folder
- Apply migrations in order (timestamp-based naming)
- **Never** manually run SQL in Supabase Dashboard for production

---

## 📐 Standard Implementation Patterns

### API Route Authentication Pattern

**Every protected API route MUST follow this pattern:**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // 1. Get authenticated user from Supabase
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Query data with Prisma using user.id for authorization
    const data = await prisma.yourModel.findMany({
      where: { userId: user.id }, // Authorization check
    });

    // 3. Return response
    return NextResponse.json({ data });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Data Serialization Pattern

**Problem:** Prisma stores arrays/objects as JSON strings

**Solution:** Parse on read, stringify on write

```typescript
// ✅ CORRECT - Reading data
const applications = await prisma.application.findMany();
const parsed = applications.map(app => ({
  ...app,
  skills: typeof app.skills === 'string' ? JSON.parse(app.skills) : app.skills,
  attachments: typeof app.attachments === 'string' ? JSON.parse(app.attachments) : app.attachments,
}));

// ✅ CORRECT - Writing data
await prisma.application.create({
  data: {
    skills: JSON.stringify(skills || []),
    attachments: JSON.stringify(attachments || []),
  }
});
```

### Error Handling Pattern

```typescript
try {
  // Main logic
} catch (error) {
  // Log detailed error server-side
  console.error('[API ERROR] Detailed message:', error);
  if (error instanceof Error) {
    console.error('[API ERROR] Stack:', error.stack);
  }
  
  // Return generic error to client
  return NextResponse.json(
    { error: 'User-friendly message' },
    { status: 500 }
  );
}
```

---

## 🗄️ Database Schema Overview

### Core Models (20+ tables)

#### **Authentication & Users**
- `users` - Core user table (links to Supabase Auth via `supabaseUid`)
- `client_profiles` - Client-specific data
- `freelancer_profiles` - Freelancer-specific data
- `wallets` - User wallets
- `transactions` - Financial transactions

#### **Services & Bookings**
- `categories` - Service categories (hierarchical)
- `services` - Freelancer service offerings
- `bookings` - Service bookings/orders
- `jobs` - Job postings by clients
- `applications` - Freelancer applications to jobs

#### **Communication**
- `conversations` - Chat conversations
- `messages` - Individual messages
- `notifications` - System notifications

#### **Profile Enhancements**
- `experiences` - Freelancer work history
- `portfolios` - Freelancer portfolio items
- `reviews` - Client reviews

#### **Admin & Support**
- `admins` - Admin users
- `admin_logs` - Admin activity logs
- `support_tickets` - Support tickets
- `ticket_messages` - Ticket messages
- `promo_codes` - Promotional codes
- `promo_usages` - Promo code usage tracking

### Important Schema Patterns

#### 1. **String Arrays** (stored as JSON strings)
```prisma
skills        String   // JSON.stringify(['skill1', 'skill2'])
tags          String   // JSON.stringify(['tag1', 'tag2'])
images        String   // JSON.stringify(['url1', 'url2'])
```

#### 2. **Coordinates** (stored as string)
```prisma
coords        String   // "longitude,latitude" or JSON
```

#### 3. **JSON Objects** (stored as string)
```prisma
packages      String?  // JSON.stringify({ basic: {...}, premium: {...} })
availability  String?  // JSON.stringify({ monday: [...], tuesday: [...] })
```

---

## 🔐 RLS Policy Guidelines

### Current Approach: Minimal RLS

> [!WARNING]
> **Do NOT enable RLS on tables that are accessed exclusively via API routes with Prisma.**

#### Tables That **SHOULD NOT** Have RLS
- `users`, `freelancer_profiles`, `client_profiles`
- `services`, `bookings`, `jobs`, `applications`
- `conversations`, `messages`, `notifications`
- **Reason:** Authorization is handled in API routes using Prisma queries

#### Resources That **SHOULD** Have RLS
- **Supabase Storage Buckets** (avatars, verification docs, portfolio images)

#### Storage Bucket RLS Pattern

```sql
-- Create bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('verification-docs', 'verification-docs', false);

-- Allow authenticated users to upload their own files
CREATE POLICY "Users can upload own files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'verification-docs' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to read their own files
CREATE POLICY "Users can read own files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'verification-docs'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### If RLS Must Be Used on Tables

**Only for special cases (e.g., admin dashboard with direct Supabase client access):**

```sql
-- Enable RLS
ALTER TABLE "public"."freelancer_profiles" ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view all profiles
CREATE POLICY "Public profiles viewable"
ON "public"."freelancer_profiles"
FOR SELECT TO authenticated
USING (true);

-- Allow users to modify only their own profile
CREATE POLICY "Users can update own profile"
ON "public"."freelancer_profiles"
FOR UPDATE TO authenticated
USING (auth.uid()::text = "userId");
```

---

## 🛠️ Migration Workflow

### Creating a New Migration

```bash
# 1. Make changes to prisma/schema.prisma
# 2. Generate Prisma client
npm run db:generate

# 3. Create migration file with timestamp
# Format: YYYYMMDD_description.sql
# Example: 20260103_add_rating_to_services.sql

# 4. Write migration SQL in supabase/migrations/
```

**Migration File Template:**

```sql
-- ============================================
-- Migration: Add Rating Field to Services
-- Date: 2026-01-03
-- ============================================

-- Add new column
ALTER TABLE "public"."services" 
ADD COLUMN IF NOT EXISTS "average_rating" DECIMAL(3,2) DEFAULT 0;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_services_rating 
ON "public"."services"("average_rating");

-- Verification query
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'services' AND column_name = 'average_rating';
```

### Applying Migrations

**Development:**
```bash
# Apply migrations to local Supabase
npx supabase db push
```

**Production:**
```bash
# Option 1: Use Supabase Dashboard > SQL Editor
# - Paste migration SQL
# - Run and verify

# Option 2: Use Supabase CLI (recommended)
npx supabase db push --db-url "your-production-connection-string"
```

### Migration Best Practices

1. **Always use IF NOT EXISTS / IF EXISTS** to make migrations idempotent
2. **Test locally first** before applying to production
3. **One migration per logical change** (don't combine unrelated changes)
4. **Include rollback SQL** in comments
5. **Never delete old migration files**
6. **Verify after applying** with a SELECT query

---

## 📋 API Development Checklist

When creating a new API route, ensure:

- [ ] **Authentication** - Use `createClient()` and `getUser()` for protected routes
- [ ] **Authorization** - Check user permissions in Prisma query (WHERE clause)
- [ ] **Validation** - Validate all input parameters
- [ ] **Error Handling** - Try/catch with proper error responses
- [ ] **Type Safety** - Use TypeScript interfaces
- [ ] **Data Serialization** - Parse JSON strings from Prisma
- [ ] **Logging** - Console.log important operations (with prefixes like `[API]`)
- [ ] **Status Codes** - Use appropriate HTTP status codes
  - `200` - Success
  - `201` - Created
  - `400` - Bad Request
  - `401` - Unauthorized
  - `404` - Not Found
  - `500` - Internal Server Error

---

## 🚀 Production Deployment Workflow

### Pre-Deployment Checklist

#### 1. **Environment Variables**
Ensure all required variables are set in `.env.production`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Database  
DATABASE_URL=postgresql://postgres:[password]@[host]:6543/postgres?pgbouncer=true

# Optional: Third-party services
SENTRY_DSN=your_sentry_dsn
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
```

#### 2. **Database Migrations**
```bash
# Verify all migrations are applied
npx supabase db push --db-url "$DATABASE_URL"

# Or manually run in Supabase SQL Editor
```

#### 3. **Build Test**
```bash
# Test production build locally
npm run build

# Check for TypeScript errors, missing dependencies
```

#### 4. **Prisma Client**
```bash
# Ensure Prisma client is generated
npm run db:generate

# Verify in package.json:
# "postinstall": "prisma generate"
```

### Deployment Steps (Vercel)

1. **Push to Git**
   ```bash
   git add .
   git commit -m "feat: description of changes"
   git push origin main
   ```

2. **Vercel Auto-Deploys** from main branch

3. **Verify Deployment**
   - Check build logs in Vercel dashboard
   - Test API health endpoint: `https://your-domain.com/api/health`
   - Test authentication flow
   - Verify database connectivity

### Post-Deployment Verification

```bash
# Test API health
curl https://your-domain.com/api/health

# Expected response:
# { "status": "ok", "timestamp": "..." }
```

---

## 🐛 Common Issues & Solutions

### Issue: "User is not authenticated" errors

**Cause:** Supabase session cookie not being set or expired

**Solution:**
1. Check middleware is refreshing sessions (`src/middleware.ts`)
2. Verify environment variables are set correctly
3. Check cookie settings in Supabase client configuration

### Issue: RLS policy violations

**Cause:** Trying to query Supabase directly with RLS enabled

**Solution:**
- Use Prisma for all table queries (bypasses RLS)
- Only use RLS for Supabase Storage
- Remove RLS policies from tables if using Prisma exclusively

### Issue: Migration conflicts

**Cause:** Manual SQL changes not tracked in migration files

**Solution:**
1. Document ALL database changes as migration files
2. Never run raw SQL in production without creating a migration
3. If manual change was made, create a corresponding migration file retroactively

### Issue: JSON parsing errors

**Cause:** Expecting array/object but receiving string from Prisma

**Solution:**
```typescript
// Always check type before parsing
const skills = typeof data.skills === 'string' 
  ? JSON.parse(data.skills) 
  : (data.skills || []);
```

### Issue: Phone number not persisting

**Cause:** Field not included in update query or RLS policy blocking update

**Solution:**
1. Ensure field is in the Prisma update data object
2. Check RLS policies are not blocking the update
3. Use Prisma instead of direct Supabase queries

---

## 📖 Quick Reference

### File Locations

```
DoodLance/
├── prisma/
│   └── schema.prisma          # Database schema definition
├── supabase/
│   ├── config.toml            # Supabase configuration
│   ├── migrations/            # SQL migration files
│   └── fix_rls_policies.sql   # RLS policy fixes (deprecated - use migrations)
├── src/
│   ├── app/api/               # API routes
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── server.ts      # Server-side Supabase client
│   │   │   └── client.ts      # Client-side Supabase client
│   │   ├── db.ts              # Prisma client instance
│   │   └── auth.ts            # Auth utilities
│   └── middleware.ts          # Next.js middleware (session refresh)
└── .env.local / .env.production
```

### Key Commands

```bash
# Development
npm run dev                     # Start dev server
npm run db:studio              # Open Prisma Studio
npm run db:generate            # Generate Prisma client

# Database
npm run db:push                # Push schema to database
npx supabase db push           # Apply Supabase migrations

# Production
npm run build                  # Build for production
npm run start                  # Start production server
```

### Useful Prisma Queries

```typescript
// Find unique
const user = await prisma.user.findUnique({ where: { id } });

// Find many with filters
const jobs = await prisma.job.findMany({
  where: { clientId: userId, status: 'OPEN' },
  include: { client: true },
  orderBy: { createdAt: 'desc' }
});

// Create
const booking = await prisma.booking.create({
  data: { clientId, serviceId, totalPrice }
});

// Update
await prisma.user.update({
  where: { id },
  data: { phone, name }
});

// Delete
await prisma.service.delete({ where: { id } });

// Count
const count = await prisma.application.count({
  where: { freelancerId }
});
```

---

## 🎯 Next Steps for Production

Based on `PRODUCTION_TODO.md`, prioritize these items:

### Critical (Do First)
1. ✅ Database setup (PostgreSQL via Supabase) - **DONE**
2. ✅ Authentication (Supabase Auth) - **DONE**
3. ⚠️ **Fix recurring RLS issues** - Follow this document
4. 🔲 Payment Gateway (Razorpay/Stripe)
5. 🔲 Email Service (SendGrid/AWS SES)
6. 🔲 File Storage RLS policies (Supabase Storage)

### Important (Do Next)
7. 🔲 Error Monitoring (Sentry - configured but needs DSN)
8. 🔲 Database indexes optimization
9. 🔲 API rate limiting (basic implementation exists)
10. 🔲 Input validation with Zod

### Nice to Have
11. 🔲 Redis caching
12. 🔲 WebSocket for real-time features
13. 🔲 Analytics (Google Analytics)

---

## 📞 Support & Further Reading

- **Supabase Docs:** https://supabase.com/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **Next.js API Routes:** https://nextjs.org/docs/app/building-your-application/routing/route-handlers

**For Questions:**
1. Check this document first
2. Review existing similar API routes in `src/app/api/`
3. Check error logs in Vercel dashboard
4. Review Supabase logs in Supabase dashboard

---

**Last Updated:** January 2, 2026  
**Version:** 1.0.0  
**Maintained By:** Development Team

> [!CAUTION]
> **Always test changes locally before deploying to production. Never run untested SQL directly on the production database.**
