# DoodLance API Quick-Start Guide

> **Quick reference for common development tasks. For comprehensive documentation, see [BACKEND_SYSTEM_GUIDE.md](./BACKEND_SYSTEM_GUIDE.md)**

---

## 🚀 Creating a New API Route

### 1. Protected GET Endpoint (Read Data)

**File:** `src/app/api/your-endpoint/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Get query parameters (optional)
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // 3. Query database with authorization
    const data = await prisma.yourModel.findMany({
      where: { 
        userId: user.id,  // Authorization: user can only see their own data
        ...(status && { status })  // Optional filter
      },
      include: {
        relatedModel: true  // Include related data
      },
      orderBy: { createdAt: 'desc' }
    });

    // 4. Parse JSON fields if needed
    const parsed = data.map(item => ({
      ...item,
      jsonField: typeof item.jsonField === 'string' 
        ? JSON.parse(item.jsonField) 
        : item.jsonField
    }));

    return NextResponse.json({ data: parsed });

  } catch (error) {
    console.error('[API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
```

### 2. Protected POST Endpoint (Create Data)

```typescript
export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse request body
    const body = await request.json();
    const { title, description, tags, price } = body;

    // 3. Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 4. Create data with authorization
    const created = await prisma.yourModel.create({
      data: {
        userId: user.id,  // Link to authenticated user
        title,
        description,
        tags: JSON.stringify(tags || []),  // Stringify arrays
        price: parseFloat(price),
        status: 'ACTIVE'
      }
    });

    // 5. Optional: Create notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Item Created',
        message: `Your "${title}" has been created successfully`,
        type: 'ITEM_CREATED',
        entityId: created.id,
        entityType: 'item'
      }
    });

    return NextResponse.json(created, { status: 201 });

  } catch (error) {
    console.error('[API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    );
  }
}
```

### 3. Protected PATCH Endpoint (Update Data)

```typescript
export async function PATCH(request: NextRequest) {
  try {
    // 1. Authenticate
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse request
    const body = await request.json();
    const { id, title, description, status } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    // 3. Check ownership (authorization)
    const existing = await prisma.yourModel.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 4. Build update object dynamically
    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (status !== undefined) updates.status = status;

    // 5. Update
    const updated = await prisma.yourModel.update({
      where: { id },
      data: updates
    });

    return NextResponse.json(updated);

  } catch (error) {
    console.error('[API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    );
  }
}
```

### 4. Dynamic Route (with ID parameter)

**File:** `src/app/api/items/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get ID from URL params
    const { id } = params;

    const item = await prisma.yourModel.findUnique({
      where: { id },
      include: { relatedData: true }
    });

    if (!item) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(item);

  } catch (error) {
    console.error('[API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch item' },
      { status: 500 }
    );
  }
}
```

---

## 🗄️ Common Database Queries

### Find Operations

```typescript
// Find one by ID
const user = await prisma.user.findUnique({
  where: { id: userId }
});

// Find one by unique field
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' }
});

// Find many with filters
const jobs = await prisma.job.findMany({
  where: {
    clientId: userId,
    status: 'OPEN',
    budget: { gte: 1000 }  // Greater than or equal
  },
  include: {
    client: true,
    applications: {
      where: { status: 'PENDING' }
    }
  },
  orderBy: { createdAt: 'desc' },
  take: 10,  // Limit
  skip: 0    // Offset for pagination
});

// Find first matching record
const application = await prisma.application.findFirst({
  where: {
    jobId,
    freelancerId: userId
  }
});
```

### Create Operations

```typescript
// Create single record
const service = await prisma.service.create({
  data: {
    providerId: userId,
    title: 'Cricket Coaching',
    description: 'Professional coaching',
    categoryId: 'category-id',
    price: 5000,
    duration: 60,
    coords: '77.5946,12.9716',
    serviceType: 'in-person',
    images: JSON.stringify(['image1.jpg', 'image2.jpg']),
    tags: JSON.stringify(['cricket', 'coaching']),
    requirements: JSON.stringify(['Cricket kit', 'Ground access'])
  }
});

// Create with nested relations
const booking = await prisma.booking.create({
  data: {
    clientId: userId,
    serviceId,
    totalPrice: 5000,
    duration: 60,
    status: 'PENDING',
    scheduledAt: new Date('2026-01-10'),
    coords: '77.5946,12.9716'
  },
  include: {
    service: true,
    client: true
  }
});
```

### Update Operations

```typescript
// Update single record
await prisma.user.update({
  where: { id: userId },
  data: {
    phone: '+919876543210',
    phoneVerified: true,
    phoneVerifiedAt: new Date()
  }
});

// Increment/Decrement
await prisma.job.update({
  where: { id: jobId },
  data: {
    proposals: { increment: 1 }
  }
});

// Update many (batch update)
await prisma.notification.updateMany({
  where: { userId, isRead: false },
  data: { isRead: true, readAt: new Date() }
});
```

### Delete Operations

```typescript
// Delete single
await prisma.service.delete({
  where: { id: serviceId }
});

// Delete many
await prisma.notification.deleteMany({
  where: {
    userId,
    createdAt: {
      lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)  // Older than 30 days
    }
  }
});
```

### Aggregation & Counting

```typescript
// Count
const applicationCount = await prisma.application.count({
  where: { freelancerId: userId, status: 'PENDING' }
});

// Aggregate
const stats = await prisma.transaction.aggregate({
  where: { walletId },
  _sum: { amount: true },
  _avg: { amount: true },
  _count: true
});

// Group by
const jobsByCategory = await prisma.job.groupBy({
  by: ['category'],
  _count: { id: true },
  where: { status: 'OPEN' }
});
```

---

## 🔐 File Upload (Supabase Storage)

### Upload User Avatar

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get file from form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/avatar-${Date.now()}.${fileExt}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('avatars')  // Bucket name
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Upload error:', error);
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    // Update user's avatar in database
    await prisma.user.update({
      where: { id: user.id },
      data: { avatar: publicUrl }
    });

    return NextResponse.json({ url: publicUrl });

  } catch (error) {
    console.error('[API] Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
```

### Verification Document Upload (Private)

```typescript
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const docType = formData.get('docType') as string;  // 'aadhar', 'pan', etc.

    if (!file || !docType) {
      return NextResponse.json({ error: 'Missing file or docType' }, { status: 400 });
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${docType}-${Date.now()}.${fileExt}`;

    // Upload to private bucket
    const { data, error } = await supabase.storage
      .from('verification-docs')
      .upload(fileName, file);

    if (error) {
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }

    // Store reference in database
    const verificationDoc = {
      type: docType,
      fileName: fileName,
      uploadedAt: new Date().toISOString()
    };

    await prisma.freelancerProfile.update({
      where: { userId: user.id },
      data: {
        verificationDocs: JSON.stringify(verificationDoc)
      }
    });

    return NextResponse.json({ success: true, fileName });

  } catch (error) {
    console.error('[API] Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
```

---

## 🔍 Common Troubleshooting

### Debug: Check if user is authenticated

```typescript
// In API route
console.log('Auth check:', {
  user: user?.id,
  email: user?.email,
  error: authError
});
```

### Debug: Check what data is being sent

```typescript
// In API route
const body = await request.json();
console.log('Request body:', JSON.stringify(body, null, 2));
```

### Debug: Check Prisma query results

```typescript
const data = await prisma.user.findUnique({ where: { id: userId } });
console.log('User found:', data ? 'Yes' : 'No');
console.log('User data:', JSON.stringify(data, null, 2));
```

### Fix: "User not authenticated" in frontend

```typescript
// Client-side: Check if user is logged in
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

// In component or page
const { data: { user } } = await supabase.auth.getUser();
console.log('Current user:', user);

if (!user) {
  // Redirect to login
  router.push('/auth/login');
}
```

### Fix: JSON parsing errors

```typescript
// Always check type before parsing
const parseJsonField = (field: any) => {
  if (typeof field === 'string') {
    try {
      return JSON.parse(field);
    } catch {
      return [];
    }
  }
  return field || [];
};

// Usage
const skills = parseJsonField(profile.skills);
```

---

## 📝 Testing Your API

### Using curl

```bash
# GET request
curl http://localhost:3000/api/your-endpoint

# POST request with JSON
curl -X POST http://localhost:3000/api/your-endpoint \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Test description"}'

# With cookies (authentication)
curl http://localhost:3000/api/your-endpoint \
  -H "Cookie: sb-access-token=YOUR_TOKEN"
```

### Using Thunder Client / Postman

1. **GET Request:**
   - URL: `http://localhost:3000/api/freelancer/profile?userId=xxx`
   - Method: GET
   - Headers: None (cookies are automatic in browser)

2. **POST Request:**
   - URL: `http://localhost:3000/api/applications`
   - Method: POST
   - Headers: `Content-Type: application/json`
   - Body:
     ```json
     {
       "jobId": "job-id",
       "coverLetter": "I am interested...",
       "proposedRate": 5000,
       "estimatedDays": 7,
       "skills": ["cricket", "coaching"],
       "freelancerId": "user-id"
     }
     ```

---

## 🎯 Quick Checklist for New Features

When adding a new feature:

- [ ] Update Prisma schema if adding new models/fields
- [ ] Run `npm run db:generate` to update Prisma client
- [ ] Create migration file in `supabase/migrations/`
- [ ] Apply migration: `npx supabase db push`
- [ ] Create API route in `src/app/api/`
- [ ] Add authentication check
- [ ] Add authorization (check user owns the resource)
- [ ] Validate input parameters
- [ ] Handle errors with try/catch
- [ ] Parse JSON fields when reading
- [ ] Stringify arrays when writing
- [ ] Test locally before deploying
- [ ] Check Vercel build logs after deployment

---

## 📚 Additional Resources

- [Full Backend Guide](./BACKEND_SYSTEM_GUIDE.md) - Comprehensive documentation
- [Database Schema](../../prisma/schema.prisma) - Prisma schema definition
- [Existing API Routes](../../src/app/api/) - Browse for examples

**Last Updated:** January 2, 2026
