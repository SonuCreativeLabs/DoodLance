# 🚀 Antigravity IDE Guide for BAILS

> A comprehensive guide to using Antigravity IDE for developing and maintaining the BAILS cricket services marketplace platform

---

## 📋 Table of Contents

1. [What is Antigravity?](#what-is-antigravity)
2. [Getting Started](#getting-started)
3. [Common Development Tasks](#common-development-tasks)
4. [Working with the Codebase](#working-with-the-codebase)
5. [Debugging & Testing](#debugging--testing)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

---

## What is Antigravity?

Antigravity is a powerful agentic AI coding assistant designed by the Google DeepMind team. It can:

- **Understand and navigate** complex codebases
- **Write, edit, and refactor** code across multiple files
- **Run commands** and perform testing
- **Debug issues** by analyzing logs and errors
- **Create documentation** and generate images/assets
- **Browse the web** for research and documentation
- **Plan and execute** multi-step development tasks

### Key Capabilities for BAILS Development

- Full TypeScript/Next.js awareness
- Database schema understanding (Prisma + Supabase)
- API route creation and modification
- Component development with React and Tailwind CSS
- Testing and verification workflows
- Documentation generation

---

## Getting Started

### Initial Setup

When you first open the project in Antigravity, the IDE automatically:
- Scans the project structure
- Indexes all files for quick search
- Understands the tech stack from `package.json`
- Recognizes the Next.js app router structure

### First Interaction

Simply describe what you want to do in natural language:

```
"Add a new field to the freelancer profile to track cricket certifications"
```

```
"Debug why the time slots are not showing on the booking page"
```

```
"Create a new API endpoint to fetch popular cricket services"
```

Antigravity will:
1. **Plan** the changes needed
2. **Show you** the implementation plan for review
3. **Execute** the changes after approval
4. **Verify** the changes work correctly

---

## Common Development Tasks

### 1. Creating New Features

#### Example: Add a New API Endpoint

**Your Request:**
```
"Create a new API endpoint at /api/freelancer/certifications that allows 
freelancers to add cricket certifications to their profile"
```

**What Antigravity Will Do:**
1. Analyze the database schema
2. Create implementation plan
3. Generate the API route file
4. Show you type definitions
5. Test the endpoint
6. Update documentation

#### Example: Create a New Component

**Your Request:**
```
"Create a CertificationCard component that displays a cricket certification 
with the certificate name, issuing authority, date, and a verified badge"
```

**What Antigravity Will Do:**
1. Create the component file in the appropriate directory
2. Use existing UI patterns from shadcn/ui
3. Apply Tailwind CSS styling matching the app design
4. Add TypeScript types
5. Create a demo/preview

### 2. Debugging Issues

#### Example: Fix a Bug

**Your Request:**
```
"The time slots are showing as available but no slots appear when I click 
on Thursday for Sathishraj's profile. Debug this issue."
```

**What Antigravity Will Do:**
1. Examine the availability context
2. Check the booking date page logic
3. Inspect the time slot generation function
4. Identify the root cause
5. Propose a fix
6. Test the fix

### 3. Database Changes

#### Example: Add a Field

**Your Request:**
```
"Add a 'certifications' JSON field to the User table to store cricket 
certifications"
```

**What Antigravity Will Do:**
1. Update `prisma/schema.prisma`
2. Generate Prisma client with `npm run db:generate`
3. Create a Supabase migration file
4. Update TypeScript types
5. Suggest API changes needed

### 4. Refactoring Code

**Your Request:**
```
"Refactor the ServicesContext to better separate loading states and error 
handling"
```

**What Antigravity Will Do:**
1. Analyze current implementation
2. Create refactoring plan
3. Show before/after code
4. Update all files that import the context
5. Verify no breaking changes

### 5. Creating Documentation

**Your Request:**
```
"Create a markdown guide explaining how the booking flow works from client 
selection to payment confirmation"
```

**What Antigravity Will Do:**
1. Analyze the booking flow code
2. Create a comprehensive markdown document
3. Add diagrams if helpful
4. Include code examples
5. Save to the project

---

## Working with the Codebase

### Understanding Project Structure

Antigravity understands the BAILS project structure:

```
/Users/sonu/CascadeProjects/DoodLance/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API routes
│   │   ├── client/       # Client-facing pages
│   │   ├── freelancer/   # Freelancer-facing pages
│   │   └── admin/        # Admin panel
│   ├── components/       # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── auth/         # Auth components
│   │   ├── client/       # Client components
│   │   └── freelancer/   # Freelancer components
│   ├── contexts/         # React contexts
│   ├── lib/              # Utility functions
│   ├── hooks/            # Custom React hooks
│   └── types/            # TypeScript types
├── prisma/              # Database schema
├── supabase/            # Supabase migrations
├── public/              # Static assets
└── scripts/             # Build and utility scripts
```

### Key Files to Reference

When working on BAILS, Antigravity uses these reference documents:

| File | Purpose |
|------|---------|
| `APP_FLOWS.md` | Complete user journey documentation |
| `BACKEND_SYSTEM_GUIDE.md` | Backend architecture and patterns |
| `API_QUICKSTART.md` | API route templates |
| `DATABASE_SCHEMA_SUMMARY.md` | Database structure |
| `CURSOR_RULES.md` | Code style guidelines |

**How to Use with Antigravity:**

```
"Follow the patterns in BACKEND_SYSTEM_GUIDE.md to create this new API route"
```

```
"Create a user flow diagram based on APP_FLOWS.md for the booking process"
```

---

## Debugging & Testing

### Running the Development Server

Antigravity can interact with your running dev server:

**You can ask:**
```
"Check if the dev server is running"
```

```
"Start the development server"
```

```
"Restart the dev server to pick up the latest changes"
```

### Browser Testing

Antigravity has browser automation capabilities:

**Example:**
```
"Navigate to localhost:3000/client/services and check if the Popular 
Services section displays the Sidearm Thrower card"
```

**What Antigravity Will Do:**
1. Open a browser
2. Navigate to the page
3. Take screenshots
4. Check DOM elements
5. Report findings
6. Save a recording

### Running Scripts

**Example:**
```
"Run the database seeding script to add test data"
```

**Antigravity Will:**
1. Identify the correct script
2. Run `npm run db:seed`
3. Monitor output
4. Report results

### Inspecting Logs

**Example:**
```
"Check the terminal output for the dev server and tell me if there are 
any errors"
```

---

## Best Practices

### 1. Be Specific with Requests

❌ **Vague:**
```
"Fix the booking page"
```

✅ **Specific:**
```
"Fix the time slot generation on the booking page - available days show 
but no time slots appear for Thursdays and Saturdays"
```

### 2. Provide Context

Include relevant information:
- What are you trying to achieve?
- What's the current behavior?
- What's the expected behavior?
- Any error messages?
- What have you tried?

**Example:**
```
"I'm trying to add a 'certifications' field to the freelancer profile. 
I've already updated the Prisma schema, but I need help creating the UI 
component and API route. The certification should have: name, authority, 
date, and verification status."
```

### 3. Review Before Approval

When Antigravity creates an implementation plan:
1. **Read the proposed changes** carefully
2. **Check for breaking changes** it may have flagged
3. **Verify the approach** matches your expectations
4. **Ask questions** if anything is unclear

### 4. Use Task Mode for Complex Work

For complex features, Antigravity enters "task mode" which:
- Creates a task breakdown (`task.md`)
- Shows progress through checklist items
- Provides implementation plan (`implementation_plan.md`)
- Creates walkthrough documentation after completion

### 5. Leverage Existing Documentation

Reference project docs:

```
"Create this following the patterns in CURSOR_RULES.md"
```

```
"Check APP_FLOWS.md to understand how this should work"
```

### 6. Iterative Development

Work in small, testable chunks:

```
"First, let's add the database field and migration"
```

Then:
```
"Now create the API endpoint to save certifications"
```

Then:
```
"Finally, create the UI component to display certifications"
```

---

## Troubleshooting

### Common Issues

#### "I need to make a small change to one file"

**Simple approach:**
```
"In src/components/Header.tsx, change the logo text from 'BAILS' to 
'BAILS Cricket Services'"
```

Antigravity will make the single focused edit.

#### "The change didn't work as expected"

**Example:**
```
"The certification field is saving but not displaying on the profile. 
Can you debug why?"
```

Antigravity will:
1. Check the API route
2. Verify data is saving
3. Check the component rendering logic
4. Identify the issue
5. Fix and test

#### "I need to understand how something works"

**Example:**
```
"Explain how the availability context works and how it integrates with 
the booking page"
```

Antigravity will:
1. Analyze the code
2. Create a detailed explanation
3. Provide code examples
4. Create diagrams if helpful

#### "I made changes manually and broke something"

**Example:**
```
"I updated the PersonalDetailsContext but now the profile page is 
showing errors. Can you help fix it?"
```

Antigravity will:
1. Examine your changes
2. Identify the issues
3. Propose fixes
4. Test the fixes

### Getting Help

If you're stuck:

1. **Describe the problem clearly**
2. **Share error messages** (from browser console or terminal)
3. **Mention what you've tried**
4. **Ask for explanation** of how things work

**Example:**
```
"I'm getting a '406 Not Acceptable' error when trying to save the phone 
number in the profile settings. I've checked the API route and the form 
submission. The error appears in the browser console. Can you help debug 
this?"
```

---

## Advanced Features

### 1. Web Research

Antigravity can search the web for documentation:

```
"Look up the latest best practices for Next.js 14 API routes with 
Supabase authentication"
```

### 2. Image Generation

Create UI mockups or assets:

```
"Generate a cricket-themed icon for the certifications section - it 
should be simple and match the app's color scheme"
```

### 3. Multi-File Refactoring

Handle complex changes:

```
"Refactor the entire services architecture to support sub-categories. 
This needs changes to the database schema, API routes, contexts, and UI 
components"
```

Antigravity will:
1. Create comprehensive implementation plan
2. Break down into logical steps
3. Update all affected files
4. Maintain consistency
5. Verify nothing breaks

### 4. Database Migrations

```
"Create a Supabase migration to add RLS policies for the certifications 
field"
```

### 5. Performance Optimization

```
"Analyze the booking page for performance issues and suggest 
optimizations"
```

---

## Quick Reference Commands

### Development
- `"Start the dev server"`
- `"Check if there are any TypeScript errors"`
- `"Run the linter"`
- `"Build the production version"`

### Database
- `"Generate Prisma client"`
- `"Run database migrations"`
- `"Seed the database with test data"`
- `"Open Prisma Studio"`

### Code Navigation
- `"Show me the Profile component"`
- `"Find all files that import ServicesContext"`
- `"Search for where we handle time slot generation"`

### Testing
- `"Test the booking flow in the browser"`
- `"Check if the API endpoint returns correct data"`
- `"Verify the certifications are displaying correctly"`

### Documentation
- `"Create a README for the certifications feature"`
- `"Document the booking API endpoints"`
- `"Explain how the auth flow works"`

---

## Tips for Maximum Productivity

### 1. Work in Context
Keep related changes together in one conversation. This helps Antigravity maintain context about what you're working on.

### 2. Use Descriptive Requests
The more context you provide, the better Antigravity can help.

### 3. Review Plans
Always review implementation plans before approving complex changes.

### 4. Ask Questions
If you don't understand something, ask! Antigravity can explain code, patterns, and decisions.

### 5. Save Important Artifacts
Important plans and walkthroughs are saved in:
```
/Users/sonu/.gemini/antigravity/brain/<conversation-id>/
```

### 6. Leverage Project Standards
Reference BAILS-specific docs:
- `CURSOR_RULES.md` - code style
- `APP_FLOWS.md` - user flows
- `BACKEND_SYSTEM_GUIDE.md` - architecture
- `API_QUICKSTART.md` - API patterns

---

## Example Workflows

### Adding a New Feature End-to-End

**Step 1: Planning**
```
"I want to add a cricket certifications feature to freelancer profiles. 
Freelancers should be able to add certifications with name, issuing 
authority, date, and upload a certificate image. Admins should be able 
to verify these. Can you create an implementation plan?"
```

**Step 2: Database**
```
"Start by updating the database schema and creating migrations"
```

**Step 3: API**
```
"Create the API routes for CRUD operations on certifications"
```

**Step 4: UI Components**
```
"Create the UI components for displaying and managing certifications"
```

**Step 5: Integration**
```
"Integrate the certifications into the freelancer profile page and 
admin panel"
```

**Step 6: Testing**
```
"Test the entire certification flow from adding to admin verification"
```

**Step 7: Documentation**
```
"Create documentation for the certifications feature"
```

### Debugging a Production Issue

**Step 1: Understand**
```
"Users are reporting that time slots don't appear on Thursdays. Help me 
understand the time slot generation logic"
```

**Step 2: Reproduce**
```
"Navigate to the booking page and check if the issue is visible"
```

**Step 3: Investigate**
```
"Debug the availability context and time slot generation function to 
find the root cause"
```

**Step 4: Fix**
```
"Implement a fix for the time slot issue and test it"
```

**Step 5: Verify**
```
"Test the fix by checking multiple freelancer profiles and different 
days"
```

### Code Cleanup

```
"Review the ServicesContext and identify any mock data or unused code 
that should be removed. Also check if there are any console.log 
statements that should be cleaned up."
```

---

## Project-Specific Guidelines

### BAILS Cricket Platform Architecture

#### Key Concepts
1. **Dual Role System**: Users can be both clients and freelancers
2. **Cricket-Specific Services**: 5 main categories (Playing, Coaching, Support, Media, Ground)
3. **Booking System**: Time-based scheduling with availability management
4. **Location-Based**: Chennai-focused with map integration
5. **PWA**: Progressive Web App with offline support

#### Tech Stack
- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui, Framer Motion
- **Database**: PostgreSQL via Prisma, Supabase (auth & storage)
- **Maps**: Mapbox GL
- **Forms**: React Hook Form + Zod validation
- **State**: React Context API
- **Charts**: Recharts

#### Code Patterns

**API Routes Pattern:**
```typescript
// 1. Authenticate
const supabase = createClient();
const { data: { user }, error } = await supabase.auth.getUser();

// 2. Authorize with Prisma WHERE clause
const data = await prisma.model.findMany({
  where: { userId: user.id }
});
```

**Component Pattern:**
```typescript
// Use contexts for global state
const { services, isLoading } = useServices();

// Show skeleton loaders during loading
if (isLoading) return <SkeletonLoader />;

// Show empty states when no data
if (services.length === 0) return <EmptyState />;
```

**Styling Pattern:**
```typescript
// Use shadcn/ui components
import { Button } from "@/components/ui/button";

// Use Tailwind for custom styling
<div className="flex items-center gap-4 p-6 rounded-lg bg-card">
```

---

## Common BAILS-Specific Tasks

### Working with Services
```
"Add a new service category called 'Equipment Rental' with sub-categories 
for different cricket equipment"
```

### Managing Availability
```
"Update the availability logic to support recurring weekly schedules with 
specific time slots for each day"
```

### Booking Flow
```
"Modify the booking confirmation to include WhatsApp notification option"
```

### Admin Panel
```
"Add analytics to the admin dashboard showing booking trends by service 
category"
```

### Profile Management
```
"Enhance the freelancer profile to show cricket statistics and match 
history"
```

---

## Version Control Integration

Antigravity works alongside Git:

### Checking Changes
```
"Show me the git diff for the changes you just made"
```

### Creating Commits
```
"Create a git commit with an appropriate message for the certification 
feature we just added"
```

### Branch Management
```
"Create a new branch for the certifications feature"
```

---

## Final Tips

1. **Trust but Verify**: Antigravity is powerful but always review changes
2. **Iterate**: Start small, test, then expand
3. **Document**: Ask Antigravity to document complex features
4. **Learn**: Use Antigravity to understand the codebase better
5. **Collaborate**: Antigravity is a pair programming partner, not a replacement

---

## Getting More Help

### Within the IDE
- Just ask! Antigravity can explain anything about the codebase
- Reference existing documentation
- Request clarification on any topic

### Project Documentation
- [APP_FLOWS.md](./APP_FLOWS.md) - User journey flows
- [BACKEND_SYSTEM_GUIDE.md](./BACKEND_SYSTEM_GUIDE.md) - Architecture
- [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) - Setup guide
- [DOCS_INDEX.md](./DOCS_INDEX.md) - Documentation hub

---

**Last Updated:** January 20, 2026  
**Version:** 1.0.0

🏏 Happy coding with Antigravity and BAILS!
