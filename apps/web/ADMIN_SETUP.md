# Admin panel setup

Production admin UI for Digital Advert, built on Next.js App Router with Firebase Email/Password auth and Firestore (Admin SDK on the server).

## Folder structure

```
apps/web/src/
├── app/
│   ├── admin/                 # Protected UI routes
│   │   ├── login/
│   │   ├── users/[id]/
│   │   ├── services/
│   │   ├── coupons/
│   │   ├── orders/
│   │   ├── carts/
│   │   └── analytics/
│   └── api/admin/             # Server-only Firestore APIs
├── components/admin/          # Layout, tables, states
├── components/ui/             # shadcn-style primitives
├── hooks/                     # useAdminQuery, useAdminMe
├── lib/
│   ├── firebase/              # client, admin, session
│   ├── services/              # Firestore data layer
│   ├── types/admin.ts
│   └── admin-api.ts
├── providers/admin-auth-provider.tsx
└── middleware.ts              # Cookie gate (full verify in API/layout)
```

## Environment

Copy `apps/web/.env.example` to `apps/web/.env.local` and fill in:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_FIREBASE_*` | Web app config from Firebase Console |
| `FIREBASE_SERVICE_ACCOUNT_JSON` or `GOOGLE_APPLICATION_CREDENTIALS` | Admin SDK credentials (same as `apps/server`) |
| `ADMIN_SESSION_COOKIE_NAME` | Optional, default `__admin_session` |
| `ADMIN_CART_ABANDONMENT_HOURS` | Default `24` |

## Firebase Authentication

1. Firebase Console → **Authentication** → **Sign-in method** → enable **Email/Password**.
2. Create an admin user (email + password).
3. Copy the user **UID** from Authentication → Users.

## Admin allowlist (`admins` collection)

Only UIDs listed in Firestore can sign in. Create a document:

**Path:** `admins/{uid}`

```json
{
  "email": "admin@example.com",
  "role": "admin",
  "displayName": "Ops Admin",
  "active": true,
  "createdAt": "2026-05-24T00:00:00.000Z"
}
```

Use Firebase Console or:

```bash
# After setting FIREBASE_SERVICE_ACCOUNT_JSON in apps/server/.env
bun run --cwd apps/server tsx -e "
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)) });
await getFirestore().collection('admins').doc('YOUR_FIREBASE_AUTH_UID').set({
  email: 'admin@example.com',
  role: 'admin',
  active: true,
  createdAt: new Date().toISOString(),
});
console.log('Admin document created');
"
```

## Firestore schema

| Collection | Document ID | Purpose |
|------------|-------------|---------|
| `services` | service slug | Product catalog |
| `customers` | Firebase uid | User profiles |
| `customers/{uid}/orders` | order uuid | Payments / purchases |
| `customers/{uid}/activity_logs` | auto id | Mobile activity |
| `coupons` | COUPON_CODE | Discount codes |
| `customer_carts` | customer uid | Cart abandonment snapshots |
| `admins` | admin Firebase uid | Admin allowlist |

### Customer profile fields

`name`, `phoneNumber`, `email?`, `address?`, `avatarUrl`, `updatedAt`, `signupAt?`, `lastActiveAt?`

### Coupon fields

`code`, `type` (`percentage` \| `fixed`), `value`, `minSubtotalCents?`, `expiresAt?`, `usageLimit?`, `usageCount`, `redeemedBy[]`, `active`, `createdAt`, `updatedAt`

## Security rules

See repo root `firestore.rules`. All admin writes go through Next.js API routes using the **Admin SDK** (bypasses rules). Mobile clients must not write `coupons`, `customer_carts`, or `admins`.

Deploy rules:

```bash
npx -y firebase-tools@latest deploy --only firestore:rules,firestore:indexes
```

## Run locally

```bash
# Terminal 1 — API (mobile + cart sync)
bun run --cwd apps/server dev

# Terminal 2 — Admin web
bun run --cwd apps/web dev
```

Open [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

## Mobile integration (cart & activity)

The admin panel reads:

- `POST /api/profile/cart-sync` — sync cart for abandonment tracking
- `POST /api/profile/activity` — append activity logs

Call these from the mobile app when the cart changes or on key screen events (authenticated with customer JWT).

## Auth flow

1. Admin signs in with Firebase Email/Password (client SDK).
2. Client posts ID token to `POST /api/admin/auth/session`.
3. Server verifies token + `admins/{uid}` document, sets httpOnly session cookie.
4. Middleware checks cookie on `/admin/*` and `/api/admin/*`.
5. API routes call `verifyAdminSession()` with Firebase Admin `verifySessionCookie`.

## Deploy notes

- Set all env vars on your host (Vercel, Firebase App Hosting, etc.).
- Use HTTPS in production (`secure` session cookies).
- Restrict admin URLs at the network level if needed (VPN, IP allowlist).
