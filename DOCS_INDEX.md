# 📚 DoodLance Documentation Index

> **Quick navigation to all backend and system documentation**

---

## 🎯 Start Here

### New to the Codebase?
1. Read [APP_FLOWS.md](./APP_FLOWS.md) - Understand how the app works
2. Read [BACKEND_SYSTEM_GUIDE.md](./BACKEND_SYSTEM_GUIDE.md) - Complete architecture overview
3. Review [DATABASE_SCHEMA_SUMMARY.md](./DATABASE_SCHEMA_SUMMARY.md) - Database structure
4. Check [CURSOR_RULES.md](./CURSOR_RULES.md) - Code style guidelines

### Building a Feature?
→ Use [API_QUICKSTART.md](./API_QUICKSTART.md) for code templates

### Deploying to Production?
→ Follow [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

---

## 📖 Core Documentation

### Backend & Database

| Document | Description | Use When |
|----------|-------------|----------|
| **[BACKEND_SYSTEM_GUIDE.md](./BACKEND_SYSTEM_GUIDE.md)** | Complete backend reference - architecture, patterns, RLS policies, migrations | Reference for any backend work |
| **[API_QUICKSTART.md](./API_QUICKSTART.md)** | Code snippets and quick reference | Creating new API routes |
| **[APP_FLOWS.md](./APP_FLOWS.md)** | Complete user journey documentation - all flows from public to client to freelancer | Understanding app behavior and user experience |
| **[DATABASE_SCHEMA_SUMMARY.md](./DATABASE_SCHEMA_SUMMARY.md)** | Database models and relationships | Understanding data structure |
| **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** | Production deployment guide | Before every deploy |

### Development Guides

| Document | Description |
|----------|-------------|
| **[CURSOR_RULES.md](./CURSOR_RULES.md)** | Code style and best practices |
| **[DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)** | Local development setup |
| **[JOB_SYSTEM_API.md](./JOB_SYSTEM_API.md)** | Job posting and application system |
| **[USER_DISPLAY_ID.md](./USER_DISPLAY_ID.md)** | User ID generation system |

### Production & Planning

| Document | Description |
|----------|-------------|
| **[PRODUCTION_TODO.md](./PRODUCTION_TODO.md)** | Production readiness checklist |
| **[CHANGELOG.md](./CHANGELOG.md)** | Version history |
| **[ADMIN_PANEL_README.md](./ADMIN_PANEL_README.md)** | Admin panel documentation |

---

## 🔥 Common Tasks

### I need to...

**Create a new API endpoint**
1. Copy template from [API_QUICKSTART.md](./API_QUICKSTART.md)
2. Follow auth pattern from [BACKEND_SYSTEM_GUIDE.md](./BACKEND_SYSTEM_GUIDE.md)
3. Test with curl examples

**Add a database field**
1. Update `prisma/schema.prisma`
2. Run `npm run db:generate`
3. Create migration in `supabase/migrations/`
4. Follow migration workflow in [BACKEND_SYSTEM_GUIDE.md](./BACKEND_SYSTEM_GUIDE.md)

**Fix a bug**
1. Check [BACKEND_SYSTEM_GUIDE.md - Common Issues](./BACKEND_SYSTEM_GUIDE.md#-common-issues--solutions)
2. Review related API routes
3. Test fix locally

**Deploy to production**
1. Open [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
2. Check off each item
3. Deploy via Vercel
4. Verify deployment

---

## 🎓 Key Concepts

### RLS Policy Guidelines

> **Important:** Do NOT use RLS on tables accessed via Prisma. Authorization should be in API routes.

See [BACKEND_SYSTEM_GUIDE.md - RLS Policy Guidelines](./BACKEND_SYSTEM_GUIDE.md#-rls-policy-guidelines)

### Standard API Pattern

Every protected API route follows this pattern:

```typescript
// 1. Authenticate with Supabase
const supabase = createClient();
const { data: { user }, error } = await supabase.auth.getUser();

// 2. Authorize with Prisma WHERE clause
const data = await prisma.model.findMany({
  where: { userId: user.id }
});
```

See [BACKEND_SYSTEM_GUIDE.md - Standard Patterns](./BACKEND_SYSTEM_GUIDE.md#-standard-implementation-patterns)

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────┐
│           Frontend (Next.js 14)         │
│  - App Router                           │
│  - React 18 + TypeScript                │
│  - Tailwind CSS + shadcn/ui             │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         API Routes (Next.js)            │
│  - Authentication (Supabase Auth)       │
│  - Authorization (WHERE clauses)        │
│  - Data Access (Prisma)                 │
└─────────────────┬───────────────────────┘
                  │
      ┌───────────┴───────────┐
      │                       │
┌─────▼──────┐      ┌─────────▼────────┐
│  Supabase  │      │   PostgreSQL     │
│   Auth     │      │   (via Prisma)   │
│  Storage   │      │  20+ tables      │
└────────────┘      └──────────────────┘
```

Detailed architecture in [BACKEND_SYSTEM_GUIDE.md](./BACKEND_SYSTEM_GUIDE.md)

---

## 🆘 Getting Help

1. **Search this documentation** - Use Cmd+F in relevant doc
2. **Check existing API routes** - Browse `src/app/api/` for examples
3. **Review error logs** - Vercel dashboard or Supabase logs
4. **Common issues guide** - [BACKEND_SYSTEM_GUIDE.md - Common Issues](./BACKEND_SYSTEM_GUIDE.md#-common-issues--solutions)

---

## 🔄 Keeping Docs Updated

These docs should evolve with the codebase:

- Update when patterns change
- Add new common issues as discovered
- Document new features
- Keep version history in CHANGELOG.md

**Documentation is code** - Treat it with the same care!

---

**Last Updated:** January 2, 2026  
**Documentation Version:** 1.0.0

📚 Happy coding!
