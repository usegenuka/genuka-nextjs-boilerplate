# Genuka Next.js Boilerplate

A professional Next.js boilerplate for quickly building Genuka applications with OAuth, database management, and modern architecture.

## Features

- ✅ **Genuka OAuth** - Complete authentication with token management
- ✅ **JWT Session Management** - Secure session handling with jose library
- ✅ **Double Cookie Security** - Session + refresh cookies for secure token refresh
- ✅ **Database** - Prisma ORM with MariaDB/MySQL
- ✅ **Modular Architecture** - Services, utilities, and centralized configuration
- ✅ **TypeScript** - 100% type-safe
- ✅ **Next.js 16** - App Router with Server Components
- ✅ **Webhooks** - Ready to receive Genuka events

## Prerequisites

- Node.js 18+ or Bun
- MySQL/MariaDB
- A Genuka developer account

## Installation

### 1. Clone the project

```bash
git clone https://github.com/usegenuka/genuka-nextjs-boilerplate.git
cd genuka-nextjs-boilerplate
```

### 2. Install dependencies

```bash
bun install
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and configure:

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/database"
DB_HOST="localhost"
DB_PORT="3306"
DB_USER="root"
DB_PASSWORD=""
DB_NAME=""

# Genuka OAuth
GENUKA_URL="https://api.genuka.com"
GENUKA_CLIENT_ID=""
GENUKA_CLIENT_SECRET=""
GENUKA_REDIRECT_URI="http://localhost:3000/api/auth/callback"
```

### 4. Initialize the database

```bash
# Generate Prisma client
bun run db:generate

# Create tables
bun run db:push
```

### 5. Start the development server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```text
genuka-nextjs-boilerplate/
├── app/
│   ├── api/auth/          # OAuth and webhook routes
│   ├── layout.tsx
│   └── page.tsx
├── config/                # Centralized configuration
│   ├── env.ts            # Validated environment variables
│   └── constants.ts       # App constants
├── lib/                   # Utilities
│   ├── prisma.ts         # Prisma client
│   └── genuka.ts         # Genuka SDK helpers
├── services/              # Business logic
│   ├── auth/             # OAuth services
│   └── database/         # DB services
├── types/                 # TypeScript types
└── prisma/
    └── schema.prisma      # Database schema
```

## Genuka OAuth Configuration

### 1. Create a Genuka application

1. Log in to your Genuka developer account
2. Create a new application
3. Note your `CLIENT_ID` and `CLIENT_SECRET`

### 2. Configure the Redirect URI

In your Genuka app settings, add:

```text
http://localhost:3000/api/auth/callback
```

For production, use your domain:

```text
https://your-domain.com/api/auth/callback
```

## Available Scripts

```bash
# Development
bun run dev              # Start dev server

# Database
bun run db:generate      # Generate Prisma client
bun run db:push          # Push schema to DB
bun run db:dev           # Create migration
bun run db:studio        # Open Prisma Studio

# Build
bun run build            # Build for production
bun run start            # Start in production
```

## Usage

### OAuth Flow

1. User clicks "Install App" in Genuka
2. Genuka redirects to `/api/auth/callback` with an authorization code
3. The app validates HMAC signature and timestamp
4. The app exchanges the code for tokens (`access_token` + `refresh_token`)
5. Company information is retrieved and stored in the database
6. **JWT session is created and stored in HTTP-only cookies**
7. Redirect to dashboard

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/auth/callback` | No | OAuth callback handler |
| POST | `/api/auth/webhook` | No | Webhook event handler |
| GET | `/api/auth/check` | No | Check if authenticated |
| POST | `/api/auth/refresh` | No | Refresh expired session |
| GET | `/api/auth/me` | Yes | Get current company info |
| POST | `/api/auth/logout` | Yes | Logout and destroy session |

## Authentication

### Double Cookie Security Pattern

This boilerplate uses a secure **double cookie pattern** for session management:

| Cookie | Duration | Purpose |
|--------|----------|---------|
| `session` | 7 hours | Access protected routes |
| `refresh_session` | 30 days | Securely refresh expired sessions |

Both cookies are **HTTP-only** (not accessible via JavaScript) and **signed JWT** (cannot be forged).

### Session Refresh (No Reinstall Required)

When the session expires, the client can securely refresh it:

```
POST /api/auth/refresh
// No body required! The refresh_session cookie is sent automatically
```

**Security Flow:**
1. Client calls `POST /api/auth/refresh` with no body
2. Server reads `refresh_session` cookie (HTTP-only, inaccessible to JS)
3. Server verifies the JWT signature (cannot be forged)
4. Server extracts `companyId` from the verified JWT
5. Server retrieves Genuka `refresh_token` from database
6. Server calls Genuka API with `refresh_token` + `client_secret`
7. Server updates tokens in database
8. Server creates new `session` + `refresh_session` cookies

**Why this is secure:**
- No data sent in request body (nothing to forge)
- `companyId` comes from a signed JWT cookie (tamper-proof)
- Cookies are HTTP-only (not accessible via JavaScript/XSS)
- Genuka `refresh_token` is never exposed to the client
- Genuka API validates with `client_secret` (server-side only)

### Auth Helper Functions

```typescript
import {
  createSession,
  getAuthenticatedCompany,
  isAuthenticated,
  requireAuth,
  destroySession,
} from '@/lib/auth';

// Create a session (automatically sets cookies)
await createSession(companyId);

// Get authenticated company from cookies
const company = await getAuthenticatedCompany();

// Check if authenticated
const isAuth = await isAuthenticated();

// Get company or throw error
const company = await requireAuth();

// Destroy session (logout)
await destroySession();
```

## Client Usage (React Components)

This boilerplate includes a built-in `AuthProvider` and `useAuthStore` hook for managing authentication in React components.

### AuthProvider Setup

The `AuthProvider` is already configured in `app/layout.tsx`:

```tsx
import { AuthProvider } from "@/stores";
import { getAuthenticatedCompany } from "@/lib/auth";

export default async function RootLayout({ children }) {
  const company = await getAuthenticatedCompany();

  return (
    <html lang="en">
      <body>
        <AuthProvider company={company}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

### Using useAuthStore Hook

```tsx
"use client";

import { useAuthStore } from "@/stores";

export default function MyComponent() {
  const {
    company,        // Current company data (or null)
    isAuthenticated, // Boolean: is user logged in?
    isLoading,      // Boolean: is an auth operation in progress?
    error,          // Error message (or null)
    refresh,        // Function: refresh the session
    logout,         // Function: logout the user
    checkAuth,      // Function: check if session is valid
  } = useAuthStore();

  const handleRefresh = async () => {
    const success = await refresh();
    if (!success) {
      // Refresh failed, user needs to reinstall app
      console.log("Please reinstall the app");
    }
  };

  const handleLogout = async () => {
    await logout();
    // User is now logged out
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please install the app from Genuka</div>;
  }

  return (
    <div>
      <h1>Welcome, {company?.name}</h1>
      <button onClick={handleRefresh}>Refresh Session</button>
      <button onClick={handleLogout}>Logout</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
```

### Handling 401 Errors

When making API calls, handle 401 errors by calling `refresh()`:

```tsx
"use client";

import { useAuthStore } from "@/stores";

export default function DataComponent() {
  const { refresh } = useAuthStore();

  const fetchData = async () => {
    let res = await fetch("/api/my-endpoint", { credentials: "include" });

    // If 401, try to refresh and retry
    if (res.status === 401) {
      const refreshed = await refresh();
      if (refreshed) {
        res = await fetch("/api/my-endpoint", { credentials: "include" });
      }
    }

    return res.json();
  };

  // ...
}
```

### Important Notes

1. **Always use `credentials: 'include'`** - Required to send/receive HTTP-only cookies
2. **Handle 401 errors** - Always try to refresh before asking user to reinstall
3. **Server Components** - Use `requireAuth()` or `getAuthenticatedCompany()` from `@/lib/auth` for server-side auth

### Accessing Company Data

```typescript
import { CompanyDBService } from '@/services/database/company.service';

const companyService = new CompanyDBService();

// Get company by ID
const company = await companyService.findByCompanyId('company_id');

// Get by access token
const company = await companyService.findByAccessToken('token');
```

### Using the Genuka SDK

```typescript
import { initializeGenuka } from '@/lib/genuka';

// Initialize SDK
const genuka = await initializeGenuka('company_id');
```

## Webhooks

Genuka webhooks are received at `/api/auth/webhook`.

To process events, modify `app/api/auth/webhook/route.ts`:

```typescript
export async function POST(request: NextRequest) {
  const body = await request.json();

  switch (body.event) {
    case 'order.created':
      // Process new order
      break;
    case 'payment.completed':
      // Process payment
      break;
  }

  return NextResponse.json({ success: true });
}
```

## Database

### Company Model

```prisma
model Company {
  id                String     @id @unique
  handle            String?    @unique
  name              String
  description       String?
  logoUrl           String?
  authorizationCode String?
  accessToken       String?
  refreshToken      String?    // OAuth refresh token for session renewal
  tokenExpiresAt    DateTime?  // Access token expiration date
  phone             String?
  createdAt         DateTime   @default(now())
  updatedAt         DateTime   @updatedAt
}
```

### Adding a New Model

1. Modify `prisma/schema.prisma`
2. Create a migration: `bun run db:dev`
3. Generate the client: `bun run db:generate`

## Deployment

### Production Environment Variables

⚠️ **Important**: In production, remove `NODE_TLS_REJECT_UNAUTHORIZED=0`

```env
DATABASE_URL="mysql://..."
GENUKA_URL="https://api.genuka.com"
GENUKA_CLIENT_ID="..."
GENUKA_CLIENT_SECRET="..."
GENUKA_REDIRECT_URI="https://your-domain.com/api/auth/callback"
```

### Deploy to Vercel

1. Connect your GitHub repo
2. Configure environment variables
3. Deploy!

## Development

### Adding a New Service

1. Create a file in `services/`
2. Export a class with your methods
3. Use centralized config from `config/env.ts`

```typescript
import { env } from '@/config/env';

export class MyService {
  async myMethod() {
    const apiUrl = env.genuka.url;
    // ...
  }
}
```

### Adding a New API Route

1. Create a folder in `app/api/`
2. Add a `route.ts` with exports `GET`, `POST`, etc.
3. Use services for business logic

## Troubleshooting

### Database Connection Error

Verify that MySQL is running and credentials are correct:

```bash
mysql -u root -p
```

### "Invalid or expired authorization code"

OAuth codes expire quickly. Restart the installation flow from Genuka.

### SSL Error in Development

This is normal with `.test` domains. The `NODE_TLS_REJECT_UNAUTHORIZED=0` variable disables verification (dev only).

## Support

- [Genuka Documentation](https://docs.genuka.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

## License

MIT
