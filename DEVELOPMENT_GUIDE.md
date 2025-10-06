# DoodLance Development Guide

## 🚀 Quick Start

### Database Setup & Seeding

```bash
# Generate Prisma Client (run after schema changes)
npx prisma generate

# Seed database with all mock data (recommended for development)
npm run db:seed-all

# View database in Prisma Studio
npm run db:studio

# Start development server
npm run dev
```

---

## 📊 Database Commands

### **Complete Setup (Recommended)**
```bash
npm run db:seed-all
```
This command:
1. Cleans the entire database
2. Seeds base data (users, categories, services, profiles, wallets)
3. Adds enhanced mock data (jobs, applications, messages, transactions)

### **Base Data Only**
```bash
npm run db:seed
```
Seeds only the essential data:
- 3 users (1 client, 2 freelancers)
- 4 categories
- 13 cricket services
- 2 freelancer profiles
- 1 client profile
- 3 wallets

### **Enhanced Data Only**
```bash
npm run db:seed-enhanced
```
Adds realistic mock data (requires base data):
- 8 additional clients
- 11 job postings
- 5 applications with proposals
- 2 conversations with messages
- 6 transaction records

### **Other Commands**
```bash
npm run db:generate    # Generate Prisma Client
npm run db:push        # Push schema changes to database
npm run db:studio      # Open Prisma Studio (database GUI)
```

---

## 🏏 Cricket Services Structure

### **Categories (4)**
1. **Playing Services** 🏏
   - Match Player
   - Bowler
   - Batsman
   - Sidearm

2. **Coaching & Training** 👨‍🏫
   - Coach
   - Sports Conditioning Trainer
   - Fitness Trainer

3. **Support Staff** 📊
   - Analyst
   - Physio
   - Scorer
   - Umpire

4. **Media & Content** 📷
   - Cricket Photo/Videography
   - Cricket Content Creator
   - Commentator

---

## 👥 Mock Users

### **Base Users**
1. **Rajesh Kumar** (client@doodlance.com)
   - Role: Client
   - Company: Chennai Cricket Academy
   - Location: Chennai, Tamil Nadu

2. **Sathish Sonu** (freelancer@doodlance.com)
   - Role: Freelancer
   - Title: Cricket All-Rounder
   - Skills: RH Batsman, Sidearm Specialist, Off Spin, Coach, Analyst
   - Rating: 4.9/5

3. **Arjun Singh** (bowler@doodlance.com)
   - Role: Freelancer
   - Title: Fast Bowler & Net Specialist
   - Skills: Fast Bowling, Net Bowling, Pace Variations
   - Rating: 4.7/5

### **Additional Clients (Enhanced Data)**
- Chennai Super Kings Academy
- Tamil Nadu Cricket Academy
- Anna Nagar Cricket Club
- Chennai Cricket Association
- Chennai Cricket League
- Nungambakkam Cricket Club
- Velachery Cricket Academy
- Arjun Mehta (Parent)

---

## 💼 Sample Jobs Available

After running `npm run db:seed-all`, you'll have 11 realistic job postings:

1. **U-16 Academy Coach** - ₹2,500
2. **Sidearm Specialist — Powerplay & Death Overs** - ₹15,000
3. **Mystery Spin Training — Carrom Ball & Doosra** - ₹2,000
4. **Personal Batting Coach — Front-Foot Technique** - ₹2,000
5. **Fast Bowling Practice — 140+ kph Nets** - ₹1,800
6. **Match Footage Analysis — Technical Breakdown** - ₹3,500
7. **Tournament Photography — Action Shots & Highlights** - ₹5,000
8. **Social Media Content — Highlights & Player Profiles** - ₹18,000
9. **Tournament Officiating — T20 Weekend Panel** - ₹8,000
10. **Digital Scoring — Weekend T20 Tournament** - ₹5,000
11. **Sports Physiotherapy — Injury Prevention Program** - ₹12,000

---

## 💬 Sample Conversations

Two complete conversation threads with messages:
- Client-Freelancer discussion about U-16 coaching
- CSK Academy discussing bootcamp training

All messages include:
- Realistic timestamps
- Read/delivered status
- Proper sender/receiver tracking

---

## 💰 Financial Data

### **Wallets**
All users have wallets with:
- Balance (₹15,000 - ₹100,000)
- App coins (300 - 2,000)

### **Transactions**
6 sample transactions showing:
- Earnings from completed jobs
- Payment methods
- Job references
- Timestamps

---

## 🔧 Development Workflow

### **1. Initial Setup**
```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Seed database
npm run db:seed-all

# Start dev server
npm run dev
```

### **2. After Schema Changes**
```bash
# Regenerate Prisma Client
npx prisma generate

# Push changes to database
npm run db:push

# Reseed if needed
npm run db:seed-all
```

### **3. Testing Features**
```bash
# View database
npm run db:studio

# Check specific collections
# - Users, Jobs, Applications, Messages, etc.
```

---

## 📁 Key Files

### **Database**
- `/prisma/schema.prisma` - Database schema
- `/scripts/cleanup-and-reseed.ts` - Base data seeding
- `/scripts/seed-enhanced-data.ts` - Enhanced mock data
- `/DATABASE_SCHEMA_SUMMARY.md` - Schema documentation
- `/MOCK_DATA_MIGRATION.md` - Migration details

### **Services**
- `/src/data/services.ts` - Cricket services configuration
- `/src/components/freelancer/jobs/mock-data.ts` - Job types reference

### **Components**
- `/src/components/discover/ListView.tsx` - Service discovery
- `/src/components/freelancer/jobs/` - Job management
- `/src/components/freelancer/inbox/` - Messaging

---

## 🎯 Testing Scenarios

With the seeded data, you can test:

### **Job Posting Flow**
1. Browse 11 different job postings
2. View client profiles and requirements
3. Check job details and budgets

### **Application Flow**
1. View 5 sample applications
2. Check proposal details and cover letters
3. Test different statuses (PENDING, ACCEPTED, REJECTED)

### **Messaging Flow**
1. View 2 complete conversations
2. Check message timestamps and status
3. Test read/unread tracking

### **Financial Flow**
1. View wallet balances
2. Check transaction history
3. Track earnings from jobs

---

## 🐛 Troubleshooting

### **Prisma Client Issues**
```bash
# Regenerate Prisma Client
npx prisma generate

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### **Database Issues**
```bash
# Reset database completely
npm run db:seed-all

# View database in Studio
npm run db:studio
```

### **TypeScript Errors**
```bash
# Check for type errors
npx tsc --noEmit

# Regenerate Prisma types
npx prisma generate
```

---

## 📈 Next Steps

1. **Connect Frontend to Database**
   - Replace mock data imports with API calls
   - Fetch jobs from `/api/jobs`
   - Fetch applications from `/api/applications`
   - Fetch messages from `/api/messages`

2. **Implement Real-time Features**
   - WebSocket for live messaging
   - Real-time job updates
   - Notification system

3. **Add More Features**
   - Booking system
   - Payment integration
   - Review system
   - Portfolio management

---

## 🎉 You're All Set!

Your DoodLance database is fully populated with realistic cricket marketplace data. Start the dev server and explore all the features with real data!

```bash
npm run dev
```

Visit: http://localhost:3000
