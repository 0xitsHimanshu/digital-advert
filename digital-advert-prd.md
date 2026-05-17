# Digital Advert — Product Requirements Document

**Version:** 1.0.0
**Status:** Draft
**Last Updated:** 2025

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Product Goals](#2-product-goals)
3. [Target Users](#3-target-users)
4. [Platform and Tech Stack](#4-platform-and-tech-stack)
5. [Feature Specifications](#5-feature-specifications)
   - [5.1 Authentication](#51-authentication)
   - [5.2 Navigation and UI Structure](#52-navigation-and-ui-structure)
   - [5.3 Services Listing](#53-services-listing)
   - [5.4 Service Details](#54-service-details)
   - [5.5 Cart and Checkout](#55-cart-and-checkout)
   - [5.6 Sales Team Indent](#56-sales-team-indent)
   - [5.7 Payment](#57-payment)
   - [5.8 Order Confirmation](#58-order-confirmation)
   - [5.9 User Profile and Account](#59-user-profile-and-account)
   - [5.10 Admin Dashboard](#510-admin-dashboard)
6. [User Flows](#6-user-flows)
7. [API Design Guidelines](#7-api-design-guidelines)
8. [Third-Party Integrations](#8-third-party-integrations)
9. [Non-Functional Requirements](#9-non-functional-requirements)
10. [Deliverables](#10-deliverables)
11. [Out of Scope](#11-out-of-scope)
12. [Maintenance and Support](#12-maintenance-and-support)
13. [Client Responsibilities](#13-client-responsibilities)

---

## 1. Project Overview

Digital Advert is a mobile-first service marketplace application built with Expo (React Native). It enables customers to discover, browse, and purchase services through a clean mobile interface, while providing internal admin staff a web-based dashboard to manage operations. The backend is powered by Express.js with a PostgreSQL database.

---

## 2. Product Goals

- Deliver intuitive service discovery and browsing for end customers.
- Enable a seamless and secure checkout and payment flow.
- Provide a Sales Team Indent mechanism for services requiring follow-up instead of direct purchase.
- Allow admin staff to efficiently manage services, orders, customers, and sales indents through a CRM-style dashboard.
- Build a scalable, maintainable, and secure codebase adhering to platform standards.

---

## 3. Target Users

| User Group | Description |
|---|---|
| Customers (Primary) | End users who browse, select, and purchase services via the mobile app. |
| Admin Team (Secondary) | Internal staff who manage services, orders, customers, and sales indents via the web dashboard. |

---

## 4. Platform and Tech Stack

### 4.1 Mobile Application

| Layer | Technology | Version |
|---|---|---|
| Framework | React Native via Expo (managed workflow) | Expo SDK 54+ |
| Language | TypeScript | 5.9 |
| Navigation | Expo Router (file-based routing) | 4.x |
| State Management | Zustand | 5.x |
| Data Fetching | TanStack Query (React Query) | 5.x |
| Forms | React Hook Form + Zod | RHF 7.x / Zod 3.x |
| UI Components | NativeWind (Tailwind for RN) + custom component library | NativeWind 4.x |
| HTTP Client | Axios | 1.x |

### 4.2 Backend

| Layer | Technology | Version |
|---|---|---|
| Runtime | Node.js | 22.x LTS |
| Framework | Express.js | 5.x |
| Language | TypeScript | 5.x |
| ORM | Prisma | 6.x |
| Database | PostgreSQL | 16.x |
| Auth | Firebase Auth + Passport.js + JWT | Passport 0.7.x |
| Validation | class-validator + class-transformer | Latest stable |
| API Documentation | Swagger (OpenAPI 3.0) | Latest stable |

### 4.3 Admin Dashboard

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 15.x |
| Language | TypeScript | 5.x |
| UI Library | shadcn/ui + Tailwind CSS | Latest stable |
| State / Data Fetching | TanStack Query | 5.x |
| Forms | React Hook Form + Zod | Latest stable |
| Tables | TanStack Table | 8.x |

### 4.4 Infrastructure

| Concern | Technology |
|---|---|
| Containerization | Docker + Docker Compose (local dev) |
| Environment Config | dotenv / Express.js configuration |
| Push Notifications | Firebase Cloud Messaging (FCM) |
| OTP | For Auth OTP we are using Firebase Auth and for other OTPs we are using MSG91 (primary) / Twilio (fallback) |
| Payment | Razorpay |
| File Storage | AWS S3 or Cloudinary (for service images) |

---

## 5. Feature Specifications

### 5.1 Authentication

**Scope:** Mobile App

#### 5.1.1 Phone Number Login (OTP)

- User enters a 10-digit mobile number.
- System sends a 6-digit OTP via Firebase Auth where we are using Phone Authentication to the provided number.
- On successful OTP verification, the backend issues a signed JWT access token and a refresh token.
- Refresh token is stored securely using `expo-secure-store`.
- If no account exists for the phone number, a new account is created on successful OTP verification (auto-registration).


#### 5.1.2 Session Management

- Access token expiry: 15 minutes.
- Refresh token expiry: 30 days.
- Silent refresh is handled by an Axios request interceptor using the stored refresh token.
- Logout clears both tokens from `expo-secure-store` and calls the backend logout endpoint to invalidate the refresh token.

#### 5.1.3 Guards and Authorization

- All protected API routes require a valid Bearer token.
- Admin routes require role-based access: `ROLE_ADMIN`.
- Customer routes require `ROLE_CUSTOMER`.

---

### 5.2 Navigation and UI Structure

**Scope:** Mobile App

The app uses a bottom tab navigator with 4 primary tabs.

| Tab Index | Tab Label | Root Screen |
|---|---|---|
| 1 | Services | Services Listing |
| 2 | Cart | Cart Screen |
| 3 | Orders | My Orders |
| 4 | Account | Profile / Account |

- Each tab root is a stack navigator to allow nested navigation (e.g., Services > Service Details).
- Unauthenticated users can browse services but are redirected to Login on attempting to add to cart or checkout.
- A global header component displays the app logo and optional notification icon.

---

### 5.3 Services Listing

**Scope:** Mobile App

#### 5.3.1 Display

- Shows all active services as a vertically scrollable list or grid (2 columns, configurable).
- Each service card displays: Service Image, Service Name, Short Description, Price (or "Get Quote" if Sales Indent only).
- Supports category-based filtering via horizontal chip tabs at the top.
- Supports search by service name (client-side filter on fetched data; server-side search for large datasets).

#### 5.3.2 Data Fetching

- Services are fetched from `GET /api/v1/services` with pagination (cursor-based).
- TanStack Query handles caching and background refetch on focus.
- Skeleton loading cards are shown while data is being fetched.
- Empty state UI is displayed when no services are available.

---

### 5.4 Service Details

**Scope:** Mobile App

#### 5.4.1 Display

- Full-width image carousel at the top (supports multiple images per service).
- Service name, full description, price, and category.
- Call-to-action buttons: "Add to Cart" (for direct purchase services) or "Request Quote / Indent" (for Sales Team Indent services).
- Related services section at the bottom (optional, shown if available).

#### 5.4.2 Data Fetching

- Fetched from `GET /api/v1/services/:id`.
- Screen receives `serviceId` as a route param from the Services Listing screen.

---

### 5.5 Cart and Checkout

**Scope:** Mobile App

#### 5.5.1 Cart

- Users can add services to the cart from the Service Details screen.
- Cart state is managed globally via Zustand and persisted to `AsyncStorage` for offline resilience.
- Cart screen shows: list of added services, quantity controls (if applicable), individual line totals, and order total.
- Users can remove individual items or clear the entire cart.

#### 5.5.2 Checkout

- Checkout screen shows a final order summary with itemized list and grand total.
- User confirms billing details (pre-filled from profile if available).
- Proceeds to payment on tapping "Proceed to Pay".

---

### 5.6 Sales Team Indent

**Scope:** Mobile App + Backend + Admin Dashboard

#### 5.6.1 Purpose

Certain services are not available for direct purchase. Instead, the user submits an "Indent" which notifies the Sales Team to follow up.

#### 5.6.2 Mobile App Flow

- On the Service Details screen, if the service is flagged as `indentOnly: true`, the "Add to Cart" button is replaced with "Request Quote".
- On tapping "Request Quote", user sees a bottom sheet / modal with optional fields: notes, preferred contact time.
- On submission, a `POST /api/v1/indents` call is made with the service ID, user ID, and optional notes.
- User receives an in-app success confirmation: "Our team will contact you shortly."

#### 5.6.3 Backend

- Indent record is created with status `PENDING`.
- Status lifecycle: `PENDING` → `CONTACTED` → `CONVERTED` | `CLOSED`.
- Admin can update status via the dashboard.

#### 5.6.4 Admin Dashboard

- Dedicated "Sales Indents" section in the admin panel.
- Table view with columns: Customer Name, Phone, Service Name, Notes, Status, Created At.
- Inline status update dropdown per row.
- Filter by status and date range.

---

### 5.7 Payment

**Scope:** Mobile App + Backend

#### 5.7.1 Razorpay Integration

- Backend creates a Razorpay order via `POST /api/v1/payments/create-order` before the payment sheet opens.
- The mobile app opens the Razorpay checkout using `react-native-razorpay`.
- On payment success, the app sends `razorpay_payment_id`, `razorpay_order_id`, and `razorpay_signature` to `POST /api/v1/payments/verify`.
- Backend verifies the HMAC signature server-side before marking the order as `PAID`.
- On verification failure, order status is set to `PAYMENT_FAILED` and user is shown an error screen with retry option.

#### 5.7.2 Order Status Lifecycle

`CREATED` → `PAYMENT_PENDING` → `PAID` | `PAYMENT_FAILED`

---

### 5.8 Order Confirmation

**Scope:** Mobile App + Backend

- On successful payment verification, user is navigated to an Order Confirmation screen.
- Screen displays: Order ID, list of purchased services, total paid, and estimated contact/fulfillment info.
- Backend sends a push notification via FCM confirming the order.
- Order is recorded and accessible under the "Orders" tab.

---

### 5.9 User Profile and Account

**Scope:** Mobile App

#### 5.9.1 Profile Screen

- Displays: Name, Phone Number, Email, Profile Picture (optional).
- Edit profile: allows updating name and email.
- Logout button with confirmation dialog.

#### 5.9.2 My Orders

- List of all past and current orders sorted by date descending.
- Each order row shows: Order ID, service names, total amount, status badge, and date.
- Tap on an order to view full order details.

#### 5.9.3 My Indents

- List of all submitted Sales Team Indents with current status.

---

### 5.10 Admin Dashboard

**Scope:** Web (Next.js)

#### 5.10.1 Authentication

- Email and password login for admin users only.
- JWT-based session. No OTP required for admin login.
- Protected routes via Next.js middleware checking for valid session.

#### 5.10.2 Dashboard Overview

- Summary cards: Total Users, Total Orders, Total Revenue, Pending Indents.
- Recent orders table (last 10).
- Revenue chart (last 30 days, line chart).

#### 5.10.3 Services Management

- List all services with search and filter by category and status.
- Create service: name, description, price, category, images, `indentOnly` flag, active/inactive toggle.
- Edit service: all fields editable inline or via modal.
- Soft delete (deactivate) service — no hard delete.

#### 5.10.4 Orders Management

- Full order list with filters: status, date range, customer search.
- Order detail view: customer info, itemized services, payment details, timestamps.
- Ability to manually update order status if required (e.g., mark as `FULFILLED`).

#### 5.10.5 Sales Indents Management

- Described in Section 5.6.4.

#### 5.10.6 Customer Management

- List all registered customers with search by name, phone, or email.
- View customer profile: registration date, total orders, total spend, submitted indents.
- No ability to delete customer records (compliance).

#### 5.10.7 Admin User Management

- Super admin can create, edit, and deactivate admin accounts.
- Role assignment: `SUPER_ADMIN`, `ADMIN`.

---

## 6. User Flows

### 6.1 Direct Purchase Flow

```
App Launch
  → OTP Login (Phone / Email)
    → Services Listing
      → Service Details
        → Add to Cart
          → Cart Review
            → Checkout
              → Razorpay Payment Sheet
                → Payment Verification (Backend)
                  → Order Confirmation Screen
                    → Push Notification (FCM)
```

### 6.2 Sales Team Indent Flow

```
App Launch
  → OTP Login (Phone / Email)
    → Services Listing
      → Service Details (indentOnly service)
        → Tap "Request Quote"
          → Notes Input (optional)
            → POST /api/v1/indents
              → In-App Success Confirmation
                → Admin Dashboard: New Indent appears under Sales Indents
                  → Admin updates status → CONTACTED
```

### 6.3 Admin Order Management Flow

```
Admin Login
  → Dashboard Overview
    → Orders List
      → Filter / Search
        → Open Order Detail
          → Update Order Status
```

---

## 7. API Design Guidelines

- All endpoints are prefixed with `/api/v1/`.
- RESTful resource naming conventions apply.
- All responses follow a consistent envelope:

```json
{
  "success": true,
  "data": {},
  "message": "string",
  "timestamp": "ISO8601"
}
```

- Error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  },
  "timestamp": "ISO8601"
}
```

### 7.1 Key Endpoints (Reference)

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/v1/auth/otp/send` | Send OTP to phone or email | Public |
| POST | `/api/v1/auth/otp/verify` | Verify OTP and return tokens | Public |
| POST | `/api/v1/auth/refresh` | Refresh access token | Refresh token |
| POST | `/api/v1/auth/logout` | Invalidate refresh token | Bearer |
| GET | `/api/v1/services` | List services (paginated) | Public |
| GET | `/api/v1/services/:id` | Get service detail | Public |
| POST | `/api/v1/cart/checkout` | Create order from cart | Bearer (Customer) |
| POST | `/api/v1/payments/create-order` | Create Razorpay order | Bearer (Customer) |
| POST | `/api/v1/payments/verify` | Verify Razorpay payment | Bearer (Customer) |
| POST | `/api/v1/indents` | Submit Sales Team Indent | Bearer (Customer) |
| GET | `/api/v1/orders` | Get user order history | Bearer (Customer) |
| GET | `/api/v1/admin/orders` | Get all orders (admin) | Bearer (Admin) |
| PUT | `/api/v1/admin/orders/:id` | Update order status | Bearer (Admin) |
| GET | `/api/v1/admin/indents` | Get all indents (admin) | Bearer (Admin) |
| PUT | `/api/v1/admin/indents/:id` | Update indent status | Bearer (Admin) |
| POST | `/api/v1/admin/services` | Create service | Bearer (Admin) |
| PUT | `/api/v1/admin/services/:id` | Update service | Bearer (Admin) |

---

## 8. Third-Party Integrations

| Service | Purpose | Package / SDK |
|---|---|---|
| Razorpay | Payment processing | `react-native-razorpay` (mobile), `razorpay` Node SDK (backend) |
| MSG91 | OTP delivery via SMS | REST API via Axios |
| Firebase Cloud Messaging | Push notifications | `@react-native-firebase/messaging`, `firebase-admin` (backend) |
| AWS S3 / Cloudinary | Service image storage | `@aws-sdk/client-s3` or `cloudinary` Node SDK |

---

## 9. Non-Functional Requirements

### 9.1 Performance

- Services Listing and Service Details screens must achieve a Time to Interactive (TTI) of under 3 seconds on a standard 4G connection.
- Backend API P95 response time must not exceed 500ms for read operations under normal load.
- Image assets must be compressed and served via CDN.

### 9.2 Security

- All PII (name, phone, email) must be encrypted at rest (PostgreSQL column-level encryption or field-level using Prisma middleware) and in transit (HTTPS/TLS 1.3).
- OTP codes are hashed before storage. Plain OTP is never persisted.
- JWT secret rotation policy must be documented.
- Razorpay payment signature verification is mandatory on every payment webhook and client callback.
- API rate limiting is applied on all public endpoints using express-rate-limit (default: 100 requests per minute per IP).
- Helmet.js middleware enabled on all Express.js routes.

### 9.3 Scalability

- Backend architecture must support a minimum of 10,000 concurrent active users.
- Database connection pooling via Prisma with configurable pool size.
- Stateless backend design to allow horizontal scaling behind a load balancer.

### 9.4 Maintainability

- Codebase follows ESLint + Prettier enforced conventions across all packages.
- Monorepo structure (Turborepo) recommended to share types and utility packages between mobile, backend, and dashboard.
- All public API contracts are documented via Swagger UI at `/api/v1/docs`.
- Minimum 70% unit test coverage on backend service layer using Jest.

### 9.5 Accessibility

- Mobile app targets WCAG 2.1 Level AA compliance.
- All interactive elements have accessible labels (`accessibilityLabel` props).
- Minimum tap target size of 44x44 points.
- Color contrast ratios must meet AA standards.

---

## 10. Deliverables

| Deliverable | Description |
|---|---|
| Mobile Application | Production-ready Android (.aab) and iOS (.ipa) builds submitted to respective stores |
| Admin Dashboard | Deployed Next.js web application |
| Backend APIs | Express.js application deployed and running |
| Database Setup | PostgreSQL schema, Prisma migrations, and seed scripts |
| Swagger Documentation | API docs accessible at `/api/v1/docs` |
| Technical Documentation | README files for each package, environment variable reference, deployment guide |
| Deployment | Production deployment on client-provided hosting infrastructure |

---

## 11. Out of Scope

- Tablet-specific UI layouts (focus is exclusively on mobile phone screens).
- Deep-linking or Universal Links for external marketing campaigns.
- Third-party analytics integration beyond platform-native reporting (Firebase Analytics may be added in a future phase).
- Multi-language (i18n) support.
- Loyalty or rewards program.
- In-app chat or support ticketing.
- Social login (Google, Apple) in v1.

---

## 12. Maintenance and Support

- 30 calendar days of bug fix support post-launch at no additional cost.
- Bug fix scope is limited to defects traceable to the originally specified requirements.
- Feature additions, design changes, and new integrations post-launch are out of scope and will be quoted separately.

---

## 13. Client Responsibilities

The following are the client's responsibility and are not included in the development scope:

| Item | Billing Frequency |
|---|---|
| Razorpay account and payment gateway setup | Per Razorpay pricing |
| Domain name registration | Annually |
| Hosting / cloud server (backend + database) | Monthly |
| Apple Developer Program enrollment | Annually |
| Google Play Developer account | One-time |

---

## Approval

| Role | Name | Signature | Date |
|---|---|---|---|
| Client | | | |
| Project Lead | | | |

---

*End of Document*
