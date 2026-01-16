# Testing the Onboarding Flow

This guide explains how to test the ComplianceHub onboarding flow endpoints before filling out the frontend form.

## Quick Start

### Option 1: Automated Test (Recommended)
Run the complete onboarding flow test:

```bash
chmod +x test-onboarding.sh
./test-onboarding.sh
```

This will:
- ✅ Register a new user
- ✅ Log them in and get access token
- ✅ Create a company (tenant)
- ✅ List available plans
- ✅ Create a subscription
- ✅ Verify all data was created

### Option 2: Manual Testing with VS Code REST Client
1. Install the REST Client extension: `REST Client` by Humao
2. Open `onboarding-flow-test.http` file
3. Replace placeholder values:
   - `YOUR_ACCESS_TOKEN` → token from login response
   - `PLAN_ID` → plan ID from plans list
   - `TENANT_ID` → tenant ID from create response
4. Click "Send Request" above each endpoint

### Option 3: Manual Testing with cURL
Use the commands below in your terminal.

---

## Onboarding Flow Endpoints

### Step 1: User Registration
Create a new user account.

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }'
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid-here",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

---

### Step 2: User Login
Authenticate user and get access token.

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }'
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400
}
```

**Save the `accessToken` for the next steps!**

---

### Step 3: Get User Profile
Verify the logged-in user's information.

```bash
curl -X GET http://localhost:3000/api/v1/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "status": "active",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### Step 4: Create Company (Tenant)
After completing the company setup form, this endpoint creates the company.

```bash
curl -X POST http://localhost:3000/api/v1/tenants \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "Acme Corporation Nigeria",
    "slug": "acme-corp-ng",
    "description": "Leading tech company in Nigeria",
    "website": "https://acme-ng.com",
    "industry": "Technology",
    "maxUsers": 50
  }'
```

**Response (201 Created):**
```json
{
  "id": "tenant-uuid-here",
  "name": "Acme Corporation Nigeria",
  "slug": "acme-corp-ng",
  "description": "Leading tech company in Nigeria",
  "website": "https://acme-ng.com",
  "industry": "Technology",
  "maxUsers": 50,
  "status": "active",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Save the `id` (tenant ID) for later steps!**

---

### Step 5: List User's Companies
Verify the company was created and linked to the user.

```bash
curl -X GET http://localhost:3000/api/v1/tenants \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response (200 OK):**
```json
[
  {
    "id": "tenant-uuid",
    "name": "Acme Corporation Nigeria",
    "slug": "acme-corp-ng",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "tenantUsers": [...]
  }
]
```

---

### Step 6: Get Available Plans
Fetch all subscription plans (Free, Pro, Enterprise).

```bash
curl -X GET http://localhost:3000/api/v1/subscriptions/plans
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "plan-uuid-1",
      "name": "Free",
      "monthlyPrice": 0,
      "annualPrice": 0,
      "maxUsers": 5,
      "features": ["Basic PAYE", "Email Reminders"],
      "status": "active"
    },
    {
      "id": "plan-uuid-2",
      "name": "Pro",
      "monthlyPrice": 15000,
      "annualPrice": 150000,
      "maxUsers": 50,
      "features": ["Auto PAYE Filing", "Pension Integration", "VAT Support"],
      "status": "active"
    },
    {
      "id": "plan-uuid-3",
      "name": "Enterprise",
      "monthlyPrice": 75000,
      "annualPrice": 750000,
      "maxUsers": 999,
      "features": ["Everything in Pro", "Multi-company", "Dedicated Support"],
      "status": "active"
    }
  ],
  "total": 3,
  "limit": 10,
  "offset": 0
}
```

**Save a plan `id` to subscribe to!**

---

### Step 7: Get Specific Plan Details
Get detailed information about a single plan.

```bash
curl -X GET http://localhost:3000/api/v1/subscriptions/plans/PLAN_ID
```

**Response (200 OK):**
```json
{
  "id": "plan-uuid-2",
  "name": "Pro",
  "description": "For growing SMEs",
  "monthlyPrice": 15000,
  "annualPrice": 150000,
  "maxUsers": 50,
  "maxTenants": 1,
  "features": {
    "auto_paye_filing": true,
    "pension_integration": true,
    "vat_support": true,
    "multi_user": true,
    "api_access": true
  },
  "status": "active"
}
```

---

### Step 8: Create Subscription
Subscribe to a plan after selecting it during checkout.

```bash
curl -X POST http://localhost:3000/api/v1/subscriptions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "planId": "plan-uuid-2",
    "billingCycle": "monthly",
    "autoRenew": true
  }'
```

**Response (201 Created):**
```json
{
  "id": "subscription-uuid",
  "userId": "user-uuid",
  "planId": "plan-uuid-2",
  "status": "active",
  "billingCycle": "monthly",
  "autoRenew": true,
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-02-01T00:00:00.000Z",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### Step 9: Get Current Subscription
Verify the user's active subscription.

```bash
curl -X GET http://localhost:3000/api/v1/subscriptions/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response (200 OK):**
```json
{
  "id": "subscription-uuid",
  "status": "active",
  "plan": {
    "id": "plan-uuid-2",
    "name": "Pro",
    "monthlyPrice": 15000
  },
  "billingCycle": "monthly",
  "nextBillingDate": "2024-02-01T00:00:00.000Z"
}
```

---

### Step 10: Get Tenant Details
Fetch complete information about a company.

```bash
curl -X GET http://localhost:3000/api/v1/tenants/TENANT_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response (200 OK):**
```json
{
  "id": "tenant-uuid",
  "name": "Acme Corporation Nigeria",
  "slug": "acme-corp-ng",
  "description": "Leading tech company in Nigeria",
  "website": "https://acme-ng.com",
  "industry": "Technology",
  "maxUsers": 50,
  "status": "active",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## Testing Checklist

After running the automated test or manual steps, verify:

- [ ] User registration returns user ID
- [ ] Login returns access token
- [ ] User profile is retrievable with token
- [ ] Company/tenant is created with all details
- [ ] User's company list shows the new company
- [ ] Plans are available and retrievable
- [ ] Subscription is created with correct plan
- [ ] Current subscription shows active status
- [ ] Company details are fully populated

---

## Common Issues & Fixes

### "Backend is not running"
```bash
# Start the NestJS backend
cd "NestJS backend/compliancehub"
npm install  # If needed
npm run start:dev
```

### "No plans found"
Plans must be seeded in the database first. Check if there's a seed script:
```bash
cd "NestJS backend/compliancehub"
npm run seed  # Or check package.json for available scripts
```

### "Invalid token"
Make sure:
1. You copied the full `accessToken` from login response
2. Token is valid (not expired)
3. It's in the format: `Authorization: Bearer YOUR_TOKEN`

### "Tenant creation failed"
Check:
1. Slug must be unique (use timestamps if testing multiple times)
2. All required fields are provided
3. You have a valid access token

---

## Next Steps

After successful onboarding flow testing:

1. **Test the Frontend**: Navigate to http://localhost:5173/signin with test credentials
2. **Test Employee Management**: Create employees via the API or frontend
3. **Test Payroll**: Create a payroll run
4. **Test Compliance**: Set up compliance obligations
5. **Test User Management**: Invite team members to the company

---

## API Documentation

For complete API reference, see: [`API_ENDPOINTS.md`](NestJS%20backend/compliancehub/API_ENDPOINTS.md)

