# SkilledMice - Hyper-local Service Marketplace

A Progressive Web App (PWA) that connects local service providers with clients, built with Next.js.

## Features

- PWA with offline support
- Animated splash screen
- Authentication with phone/email and social login
- Client and Freelancer modes
- Real-time notifications
- Modern, mobile-first UI
- Responsive layout

## Getting Started

Core Vision
A hyper-local platform connecting individuals and service providers for offline tasks (plumbing, tutoring, pet care, etc.) and skill monetization. Combines the flexibility of Upwork with the trust of Urban Company, focusing on neighborhood-based services.

Key Features
1. Dual Hiring Models
Post a Job: Clients describe tasks (e.g., "Need a dog walker in Velachery, ₹500/day").

Direct Hire: Browse freelancer profiles (skills, rates, reviews) and hire instantly.

2. AI-Powered Matching
Auto-Categorization: Instantly tags jobs into categories (e.g., "Need a diet cook" → Home Services).

Rate Suggestions: Recommends fair pricing based on local demand (e.g., "Plumbers in your area charge ₹300–500/hr").

3. Hyper-Local Discovery
Map Integration: Shows jobs/freelancers within 5km.

Neighborhood Feed: Prioritizes local gigs over distant ones.

4. User Roles
Freelancers: Create profiles with skills, rates, availability, and portfolios (e.g., photos of past work).

Clients: Post jobs, browse freelancers, and manage hires.

5. Trust & Safety
Verified Profiles: ID checks, skill certifications, and reviews.

In-App Chat: Communicate securely before hiring.

Real-Time Notifications: Alerts for new jobs, applications, and messages (via Supabase).

6. Responsive PWA Design
Mobile-First UI: Works seamlessly on all devices.

Offline Mode: Access recent job listings without internet.

Add to Home Screen: Install as a native-like app (iOS/Android).

User Flow & UI Design
1. Splash Screen
Animated loading bar with app logo.

2. Auth Screen
Phone/email login with OTP verification.

Social login (Google/Apple) for quick access.

3. Home Screen
Hero Card: Stylish banner with app motto (e.g., "Turn Skills into Earnings").

Search Bar: Find jobs/skills with autocomplete suggestions.

Dynamic Feed:

Jobs: Cards with title, budget, location, and "Apply" button.

Freelancers: Profile cards with ratings, skills, and "Hire Now" button.

4. Navigation
Top Header:

Hamburger Menu (Left): Access settings, help, and terms.

Notifications Bell (Right): Real-time alerts (e.g., "3 new applications").

Bottom Bar:

Home | Search | Mode Switch | Profile

Mode Switch Button: Toggle between client/freelancer views (inspired by Zoomcar’s host/user toggle).

5. Freelancer Mode
Dashboard: Manage applications, earnings, and availability.

Portfolio Upload: Showcase work samples (e.g., before/after plumbing photos).

6. Client Mode
Job Posting: Simple form with AI-assisted suggestions.

Hire History: Track ongoing/completed jobs.


## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion
- Shadcn/ui

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
