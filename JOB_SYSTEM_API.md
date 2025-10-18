# DoodLance Job System API Documentation

## Overview
Complete API implementation for the job posting and application system in DoodLance cricket services marketplace.

## API Endpoints

### Jobs Management

#### GET `/api/jobs`
Get all active jobs with filtering options.

**Query Parameters:**
- `category` - Filter by job category
- `location` - Filter by location (partial match)
- `skills` - Comma-separated skills filter
- `budgetMin` - Minimum budget filter
- `budgetMax` - Maximum budget filter
- `experience` - Experience level filter

**Response:**
```json
[
  {
    "id": "job_id",
    "title": "Cricket Coach Needed",
    "description": "...",
    "category": "Coaching & Training",
    "budget": 2500,
    "location": "Chennai, TN",
    "coords": [80.2707, 13.0338],
    "skills": ["Coaching", "Batting"],
    "workMode": "remote",
    "type": "freelance",
    "experience": "Intermediate",
    "isActive": true,
    "proposals": 5,
    "createdAt": "2024-01-01T00:00:00Z",
    "client": {
      "id": "client_id",
      "name": "Rajesh Kumar",
      "avatar": "/avatars/rajesh.jpg",
      "location": "Chennai, TN",
      "isVerified": true
    },
    "_count": {
      "applications": 5
    }
  }
]
```

#### POST `/api/jobs`
Create a new job post (clients only).

**Request Body:**
```json
{
  "title": "Cricket Coach Needed for U-16 Academy",
  "description": "Looking for experienced cricket coach...",
  "category": "Coaching & Training",
  "budget": 2500,
  "budgetMin": 2000,
  "budgetMax": 3000,
  "location": "Chennai, Tamil Nadu",
  "coords": [80.2707, 13.0338],
  "skills": ["Coaching", "Batting", "Technique"],
  "workMode": "onsite",
  "type": "part-time",
  "duration": "3 months",
  "experience": "Expert"
}
```

#### GET `/api/jobs/[id]`
Get detailed job information with applications.

#### PUT `/api/jobs/[id]`
Update job details (client only).

#### DELETE `/api/jobs/[id]`
Delete job post (client only).

### Applications Management

#### GET `/api/applications`
Get applications with filtering.

**Query Parameters:**
- `userId` - Required: User ID
- `myApplications=true` - Get user's applications as freelancer
- `myJobs=true` - Get applications to user's job posts as client
- `jobId` - Filter by specific job
- `status` - Filter by application status

#### POST `/api/applications`
Submit job application (freelancers only).

**Request Body:**
```json
{
  "jobId": "job_id",
  "coverLetter": "I am very interested in this coaching position...",
  "proposedRate": 2200,
  "estimatedDays": 30,
  "skills": ["Coaching", "Batting"],
  "attachments": ["resume.pdf", "portfolio.pdf"],
  "freelancerId": "freelancer_id"
}
```

#### GET `/api/applications/[id]`
Get detailed application information.

#### PUT `/api/applications/[id]`
Update application status (clients only).

**Request Body:**
```json
{
  "status": "ACCEPTED", // PENDING, ACCEPTED, REJECTED, etc.
  "progress": 50
}
```

#### DELETE `/api/applications/[id]`
Withdraw application (freelancers only).

### Supporting APIs

#### GET `/api/categories`
Get all service categories.

#### GET `/api/freelancers/[id]`
Get freelancer profile with services and reviews.

## Authentication & Authorization

- **Job Creation**: Only users with `role: 'client'` or `currentRole: 'client'`
- **Job Applications**: Only users with `role: 'freelancer'` or `currentRole: 'freelancer'`
- **Job Updates/Deletions**: Only the client who created the job
- **Application Updates**: Only the client who posted the job

## Real-time Features

### Notifications
The API automatically creates notifications for:
- Job posting confirmations
- New applications (for clients)
- Application status updates (for freelancers)
- Application withdrawals

### Database Updates
- Job proposal counts update automatically
- Client profile project counts increment on job creation
- Freelancer application statuses tracked

## Error Handling

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created successfully
- `400` - Bad request (missing fields)
- `401` - Unauthorized
- `403` - Forbidden (wrong user role)
- `404` - Resource not found
- `409` - Conflict (duplicate application)
- `500` - Internal server error

## Usage Examples

### Frontend Integration

**Fetch Jobs for Freelancer Feed:**
```javascript
const response = await fetch('/api/jobs?category=Coaching&location=Chennai')
const jobs = await response.json()
// Jobs automatically appear in freelancer feed
```

**Submit Job Application:**
```javascript
const response = await fetch('/api/applications', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(applicationData)
})
const application = await response.json()
// Notification sent to both freelancer and client
```

**Update Application Status (Client):**
```javascript
const response = await fetch(`/api/applications/${applicationId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: 'ACCEPTED' })
})
// Notifications sent to freelancer
```

## Database Persistence
✅ **All operations auto-save to MongoDB**
✅ **Job posts immediately visible in freelancer feeds**
✅ **Applications tracked with full history**
✅ **Notifications created for all major actions**
✅ **Real-time updates via API polling or WebSocket (future)**
