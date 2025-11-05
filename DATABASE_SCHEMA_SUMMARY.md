# DoodLance Database Schema Summary

## Overview
This document outlines the comprehensive MongoDB database schema for the DoodLance cricket services marketplace, designed to support all the features described in your app flow.

## Core Features Supported

### 🏏 Cricket Services Marketplace
- **14 Cricket Service Categories** organized into 4 main groups
- **Dual Role System** - Users can switch between client and freelancer roles
- **Hyperlocal Search** with geolocation support
- **Service Packages** with multiple pricing tiers
- **Real-time Messaging** and communication
- **Wallet System** with app coins
- **Identity Verification** (KYC)
- **Referral System**

## Database Models

### 1. User Management
- **User** - Core user authentication and profile
- **FreelancerProfile** - Comprehensive freelancer details
- **ClientProfile** - Minimal client information
- **Session** - AuthKit session management

### 2. Service & Booking System
- **Category** - Hierarchical service categories
- **Service** - Service offerings with packages
- **Booking** - Direct service bookings
- **Job** - Job postings by clients
- **Application** - Freelancer applications to jobs

### 3. Communication
- **Conversation** - Chat conversations
- **Message** - Individual messages with rich content support
- **Notification** - System notifications

### 4. Financial System
- **Wallet** - User wallets with balance and coins
- **Transaction** - All financial transactions

### 5. Profile Enhancement
- **Experience** - Freelancer work history
- **Portfolio** - Showcase of work
- **Review** - Client feedback and ratings

## Cricket Service Categories

### 🏏 Playing Services (4 services)
1. **Match Player** - Professional players for matches
2. **Net Bowler** - Bowling practice sessions
3. **Net Batsman** - Batting practice sessions
4. **Sidearm** - Sidearm specialists for training

### 👨‍🏫 Coaching & Training (3 services)
1. **Coach** - Professional cricket coaching
2. **Sports Conditioning Trainer** - Cricket-specific fitness
3. **Fitness Trainer** - General fitness training

### 📊 Support Staff (4 services)
1. **Analyst** - Match and performance analysis
2. **Physio** - Sports physiotherapy
3. **Scorer** - Professional match scoring
4. **Umpire** - Certified match officiating

### 📷 Media & Content (3 services)
1. **Cricket Photo/Videography** - Professional photography
2. **Cricket Content Creator** - Social media content
3. **Commentator** - Match commentary services

## Key Features Implementation

### Role Switching
- `User.currentRole` field allows seamless switching between client/freelancer
- Both `FreelancerProfile` and `ClientProfile` can exist for same user

### Geolocation & Hyperlocal Search
- `coords` fields store [longitude, latitude] for users, services, and bookings
- `serviceRadius` in freelancer profiles for service area coverage
- Support for both list and map view searches

### Service Packages
- `Service.packages` JSON field stores multiple pricing tiers
- `Service.serviceType` supports "online", "in-person", "hybrid"
- `Service.requirements` lists what clients need to provide

### Wallet & Coins System
- `Wallet` model with separate `balance` and `coins` fields
- `Transaction` model tracks all financial activities
- Support for referral bonuses and coin redemption

### Communication System
- Rich messaging with file attachments, voice, video support
- Separate unread counts for clients and freelancers
- Call duration tracking for video/voice calls

### Identity Verification
- `isVerified` flags on User and profiles
- `verificationDocs` JSON field for KYC documents
- `verifiedAt` timestamp tracking

### Performance Metrics
- Comprehensive stats in `FreelancerProfile`:
  - `completionRate`, `repeatClientRate`
  - `totalEarnings`, `thisMonthEarnings`
  - `responseTime`, `deliveryTime`

## Sample Data Included

The database has been seeded with:
- **4 main categories** with proper slugs
- **14 cricket services** across all categories
- **3 sample users** (1 client, 2 freelancers)
- **Complete freelancer profiles** with skills, availability, and metrics
- **Wallet accounts** with initial balances and coins
- **Sample services** including AI consultation and cricket coaching
- **Reviews and portfolio items**
- **Job postings and notifications**

## Database Commands

```bash
# Generate Prisma client
npm run db:generate

# Seed database with sample data
npm run db:seed

# Run comprehensive seed script
npx tsx scripts/seed-data.ts
```

## Schema Highlights

### Enhanced User Model
```typescript
model User {
  // Dual role support
  role: String @default("client")
  currentRole: String @default("client")
  
  // Geolocation
  coords: Float[] // [longitude, latitude]
  
  // Verification & Referrals
  isVerified: Boolean @default(false)
  referralCode: String? @unique
  referredBy: String?
}
```

### Comprehensive Service Model
```typescript
model Service {
  // Service delivery
  serviceType: String // "online", "in-person", "hybrid"
  deliveryTime: String?
  packages: Json? // Multiple pricing tiers
  
  // Requirements & Location
  requirements: String[]
  coords: Float[]
  
  // Performance metrics
  totalOrders: Int @default(0)
}
```

### Rich Messaging System
```typescript
model Message {
  messageType: MessageType @default(TEXT)
  attachments: String[]
  isRead: Boolean @default(false)
  isDelivered: Boolean @default(false)
  replyToId: String? @db.ObjectId
}
```

This schema provides a solid foundation for your cricket services marketplace with all the features you described, including role switching, hyperlocal search, comprehensive profiles, wallet system, and rich communication features.
