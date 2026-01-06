# User Display ID Implementation

## ✅ Implemented

Sequential client IDs have been added to the DoodLance platform.

## Format

```
C00001  - 1st client
C00002  - 2nd client
F00001  - 1st freelancer
F00002  - 2nd freelancer
```

- **Clients:** `C` + 5-digit number (C00001, C00002, ...)
- **Freelancers:** `F` + 5-digit number (F00001, F00002, ...)

## Implementation Details

### 1. Database Schema
Added `displayId` field to User model:
```prisma
model User {
  id        String   @id @default(cuid())
  displayId String?  @unique // C00001, F00001
  // ... other fields
}
```

### 2. Files Created

**`/src/lib/user-id-utils.ts`**
- `generateUserDisplayId(role)` - Generates sequential IDs
- `parseUserDisplayId(displayId)` - Extracts type and sequence
- `isValidUserDisplayId(displayId)` - Validates format

**`/scripts/assign-display-ids.ts`**
- Migration script to assign IDs to existing users
- Run with: `npx tsx scripts/assign-display-ids.ts`

### 3. Files Modified

**`/prisma/schema.prisma`**
- Added `displayId String? @unique` field

**`/src/app/api/jobs/route.ts`**
- Auto-generates display ID when creating new users

**`/src/app/api/auth/session/route.ts`**
- Returns display ID in session response

## Usage

### Automatic Generation
Display IDs are automatically generated when:
- New user registers
- User creates their first job/booking
- User is created via API

### Access Display ID
```typescript
// From session
const session = await fetch('/api/auth/session');
const { user } = await session.json();
console.log(user.displayId); // "C00001"

// From database
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: { displayId: true }
});
console.log(user.displayId); // "C00001"
```

### Generate Manually
```typescript
import { generateUserDisplayId } from '@/lib/user-id-utils';

const displayId = await generateUserDisplayId('client');
// Returns: "C00001" (or next available)
```

## Display Examples

### User Profile
```
Name: John Doe
ID: C00523
Email: john@example.com
```

### Customer Support
```
Ticket #12345
User: C00523 (John Doe)
Issue: Payment problem
```

### Analytics
```
Total Clients: C00001 - C01234 (1,234 clients)
Total Freelancers: F00001 - F00567 (567 freelancers)
```

## Benefits

✅ **Human-readable** - Easy to communicate verbally  
✅ **Sequential** - Shows growth over time  
✅ **Unique** - Guaranteed no duplicates  
✅ **Role-aware** - Instantly know if client or freelancer  
✅ **Short** - Only 6 characters  
✅ **Professional** - Looks clean in UI  

## Migration Status

- [x] Database schema updated
- [x] Prisma client regenerated
- [x] Generation utility created
- [x] Job creation endpoint updated
- [x] Session endpoint updated
- [x] Migration script created
- [x] Existing users migrated (0 users needed IDs)

## Next Steps (Optional)

1. **Display in UI**
   - Show display ID in user profile
   - Add to dashboard header
   - Include in email signatures

2. **Customer Support Integration**
   - Use display ID in support tickets
   - Add to chat headers
   - Include in notifications

3. **Analytics**
   - Track user growth by ID sequence
   - Generate reports by ID ranges
   - Monitor registration trends

## Testing

### Test New User Creation
```bash
# Create a new user (via job posting or registration)
# Check that displayId is auto-generated

# Expected result:
{
  "id": "clx1234...",
  "displayId": "C00001",
  "email": "test@example.com"
}
```

### Test Session Response
```bash
curl http://localhost:3000/api/auth/session

# Expected response includes:
{
  "user": {
    "id": "clx1234...",
    "displayId": "C00001",
    "email": "test@example.com",
    "role": "client"
  }
}
```

## Notes

- Display IDs are **optional** (nullable) for backward compatibility
- Existing users without IDs can be assigned via migration script
- IDs are **sequential per role** (clients and freelancers have separate sequences)
- Format is **fixed at 6 characters** (1 letter + 5 digits)
