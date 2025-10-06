# MongoDB Setup - DoodLance

## ✅ Completed Setup

Your DoodLance application is now fully synced with MongoDB! All data models have been created and the database has been seeded with initial data.

## 📊 Database Collections

### Core Collections
1. **users** - User authentication and profiles (clients & freelancers)
2. **sessions** - AuthKit session management
3. **categories** - Service categories
4. **services** - Freelancer service offerings
5. **bookings** - Client bookings/orders
6. **transactions** - Wallet transactions

### New Collections Added
7. **jobs** - Job postings from clients
8. **applications** - Freelancer applications to jobs
9. **conversations** - Chat conversations between users
10. **messages** - Individual chat messages
11. **freelancer_profiles** - Extended freelancer profile data
12. **experiences** - Freelancer work experience
13. **portfolios** - Freelancer portfolio items
14. **reviews** - Client reviews for freelancers

## 🎯 Seeded Data

The database has been populated with:
- **4 main categories** (Playing Services, Coaching & Training, Support Staff, Media & Content)
- **13 subcategory services**:
  - **Playing Services**: Bowler, Batsman, Sidearm
  - **Coaching & Training**: Coach, Sports Conditioning Trainer, Fitness Trainer
  - **Support Staff**: Analyst, Physio, Scorer, Umpire
  - **Media & Content**: Cricket Photo/Videography, Cricket Content Creator, Commentator
- **3 sample users** (1 client, 2 freelancers)

## 🛠️ Available Commands

```bash
# Generate Prisma Client (after schema changes)
npm run db:generate

# Push schema changes to MongoDB
npm run db:push

# Open Prisma Studio (GUI for database)
npm run db:studio

# Clean and reseed database with correct data
npm run db:seed
```

## 📝 How to Edit Data

### Option 1: Prisma Studio (Recommended)
```bash
npm run db:studio
```
This opens a web interface at `http://localhost:5555` where you can:
- View all collections
- Add, edit, and delete records
- Filter and search data
- No coding required!

### Option 2: MongoDB Compass
1. Download from https://www.mongodb.com/try/download/compass
2. Connect using your `DATABASE_URL` from `.env`
3. Full-featured desktop GUI for MongoDB

### Option 3: VS Code Extension
1. Install "MongoDB for VS Code" extension
2. Connect to your database
3. Browse and edit directly in VS Code

### Option 4: Programmatically (Prisma Client)
```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Example: Create a new user
const user = await prisma.user.create({
  data: {
    email: 'newuser@example.com',
    name: 'New User',
    role: 'client',
  },
})

// Example: Query users
const users = await prisma.user.findMany({
  where: { role: 'freelancer' },
  include: { freelancerProfile: true },
})
```

## 🔧 Schema Management

### Making Schema Changes
1. Edit `prisma/schema.prisma`
2. Run `npm run db:generate` to update Prisma Client
3. Run `npm run db:push` to sync with MongoDB

### Important Notes
- MongoDB is schema-less, but Prisma enforces schema at the application level
- Always regenerate Prisma Client after schema changes
- Use `db:push` for development (no migration files)
- For production, consider using Prisma Migrate

## 🔐 Environment Variables

Make sure your `.env` file contains:
```
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/doodlance_db"
```

## 📚 Data Model Relationships

```
User
├── Session (1:many)
├── Booking (1:many as client)
├── Service (1:many as provider)
├── Job (1:many as client)
├── Application (1:many as freelancer)
└── FreelancerProfile (1:1)
    ├── Experience (1:many)
    ├── Portfolio (1:many)
    └── Review (1:many)

Job
└── Application (1:many)

Conversation
└── Message (1:many)

Category
└── Service (1:many)

Booking
└── Service (many:1)
```

## 🚀 Next Steps

1. **Test the setup**: Run `npm run db:studio` to view your data
2. **Integrate with your app**: Use Prisma Client in your API routes
3. **Add more seed data**: Edit `scripts/seed-data.ts` and run `npm run db:seed`
4. **Build features**: Start building features using the new data models

## 📖 Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Prisma with MongoDB](https://www.prisma.io/docs/concepts/database-connectors/mongodb)
- [Prisma Studio](https://www.prisma.io/studio)

---

**Setup completed on:** October 5, 2025
**Database:** MongoDB Atlas
**Collections:** 14 total
**Status:** ✅ Ready for development
