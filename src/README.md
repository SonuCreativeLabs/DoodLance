# Project Structure

This project follows a feature-based architecture with separate interfaces for clients and freelancers.

## Directory Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── client/            # Client interface pages
│   │   ├── dashboard/     # Client dashboard
│   │   ├── jobs/          # Job management
│   │   ├── hire/          # Freelancer search and hiring
│   │   └── profile/       # Client profile
│   └── freelancer/        # Freelancer interface pages
│       ├── dashboard/     # Freelancer dashboard
│       ├── jobs/          # Job search and applications
│       ├── portfolio/     # Portfolio management
│       └── profile/       # Freelancer profile
│
├── components/            # Reusable UI components
│   ├── client/           # Client-specific components
│   │   ├── job-card/     # Job listing cards
│   │   ├── job-form/     # Job posting forms
│   │   └── hire/         # Hiring related components
│   └── freelancer/       # Freelancer-specific components
│       ├── profile/      # Profile components
│       ├── portfolio/    # Portfolio components
│       └── job-card/     # Job application cards
│
├── features/             # Feature-specific logic
│   ├── client/          # Client features
│   │   ├── job-posting/ # Job posting logic
│   │   ├── hiring/      # Hiring process logic
│   │   └── payments/    # Payment processing
│   └── freelancer/      # Freelancer features
│       ├── profile/     # Profile management
│       ├── portfolio/   # Portfolio management
│       └── applications/# Job application logic
│
├── lib/                 # Utility functions and configurations
│   ├── api/            # API client functions
│   │   ├── client/     # Client API endpoints
│   │   └── freelancer/ # Freelancer API endpoints
│   └── utils/          # Shared utility functions
│
└── types/              # TypeScript type definitions
    ├── client/         # Client-specific types
    └── freelancer/     # Freelancer-specific types
```

## Key Features

### Client Interface
- Job posting and management
- Freelancer search and hiring
- Payment processing
- Profile management
- Dashboard with analytics

### Freelancer Interface
- Profile and portfolio management
- Job search and applications
- Work history and reviews
- Earnings and payment tracking
- Dashboard with job recommendations

## Shared Components
- Authentication
- Navigation
- Common UI elements
- Notifications
- Chat system

## Development Guidelines
1. Keep client and freelancer code separate
2. Share common utilities and components
3. Follow consistent naming conventions
4. Maintain proper type safety
5. Document complex business logic 

# DoodLance UI Theme

## Primary Colors
- **Light Theme**: `#6B46C1`
- **Dark Theme**: `#8B66D1`

## Gradients
- **Primary Gradient**: `#6B46C1` (Light) / `#8B66D1` (Dark)
- **Secondary Gradient**: `from-purple-900` → `via-purple-800` → `to-purple-600`
  - `#4c1d95` → `#6b21a8` → `#9333ea`