# 🎯 Onboarding Flow - Testing Summary

## What Controls the Onboarding Flow?

The onboarding is controlled by **10 REST API endpoints** in the NestJS backend:

```
Registration → Login → Profile → Company Setup → Plans → Subscription → Done
```

### Endpoint Chain

| # | Endpoint | Method | What It Does |
|---|----------|--------|-------------|
| 1️⃣ | `/auth/register` | POST | User creates account |
| 2️⃣ | `/auth/login` | POST | User logs in → **get access token** |
| 3️⃣ | `/users/me` | GET | Verify user profile |
| 4️⃣ | `/tenants` | POST | Create company (setup form data) |
| 5️⃣ | `/tenants` | GET | List user's companies |
| 6️⃣ | `/subscriptions/plans` | GET | Show Free/Pro/Enterprise plans |
| 7️⃣ | `/subscriptions/plans/:id` | GET | Show plan details & pricing |
| 8️⃣ | `/subscriptions` | POST | Subscribe to selected plan |
| 9️⃣ | `/subscriptions/me` | GET | Verify active subscription |
| 🔟 | `/tenants/:id` | GET | Get company details |

---

## 📦 Testing Tools I Created

### 1. **Automated Test Script** (`test-onboarding.sh`)
Runs the entire flow automatically and shows results.

```bash
./test-onboarding.sh
```

**Output shows:**
- ✅ User registration with ID
- ✅ Login token
- ✅ Company created with ID
- ✅ Plans available
- ✅ Subscription active

---

### 2. **VS Code REST Client** (`onboarding-flow-test.http`)
Interactive testing - click "Send Request" button above each endpoint.

**Setup:**
1. Install REST Client extension
2. Open `onboarding-flow-test.http`
3. Copy values from responses into next request
4. See real JSON responses

---

### 3. **Postman Collection** (`ComplianceHub_Onboarding_Postman.json`)
Import this into Postman for full UI-based testing.

**Import:**
1. Open Postman
2. File → Import
3. Select `ComplianceHub_Onboarding_Postman.json`
4. Variables auto-filled with placeholders
5. Run requests in sequence

---

### 4. **Complete Documentation** (`ONBOARDING_FLOW_TESTING.md`)
Detailed guide with cURL examples for every endpoint + expected responses.

---

## 🚀 Quick Start (30 seconds)

### Step 1: Start Backend
```bash
cd "NestJS backend/compliancehub"
npm run start:dev
```

### Step 2: Run Test
```bash
./test-onboarding.sh
```

### Step 3: See Results
```
✓ ONBOARDING FLOW TEST COMPLETE

Test Summary:
  User Email: testuser-1704067200000@example.com
  User ID: uuid-here
  Company ID: tenant-uuid-here
  Company Name: Test SME Company
  Plan ID: plan-uuid-here
```

---

## 📊 Example Request/Response

### Create Company Endpoint
**Request:**
```json
POST /tenants

{
  "name": "My Company Ltd",
  "slug": "my-company",
  "description": "Nigerian SME",
  "website": "https://mycompany.com",
  "industry": "Technology",
  "maxUsers": 50
}
```

**Response (201 Created):**
```json
{
  "id": "12345-uuid-here",
  "name": "My Company Ltd",
  "slug": "my-company",
  "status": "active",
  "createdAt": "2025-12-24T10:30:00Z"
}
```

---

## 🔑 Key Concept: Access Token

After login, you get an **accessToken**. This is required for all protected endpoints:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Keep this token** - it's needed for:
- Creating company
- Getting plans
- Creating subscription
- Getting company details

---

## 📋 Testing Sequence

```
1. Register → Get user ID
2. Login → Get accessToken ⭐ SAVE THIS
3. Get Profile → Verify token works
4. Create Company → Get tenantId ⭐ SAVE THIS
5. List Companies → See all companies
6. Get Plans → See Free/Pro/Enterprise, get planId ⭐ SAVE THIS
7. View Plan → See details & pricing
8. Subscribe → Create subscription
9. Get Subscription → Verify it's active
10. Get Company → See all company details
```

---

## 💡 Before Testing Form

You can now:
- ✅ Test each endpoint independently
- ✅ See exactly what data is required
- ✅ See exactly what data is returned
- ✅ Verify backend is working before frontend
- ✅ Debug any issues with raw JSON responses

This way you know the API works **before** filling the form!

---

## 📂 Files Location

All testing files in `/home/ifeanyireed/aegis-flow/`:

```
├── test-onboarding.sh                    ← Run this
├── onboarding-flow-test.http            ← VS Code REST Client
├── ComplianceHub_Onboarding_Postman.json ← Import to Postman
├── ONBOARDING_FLOW_TESTING.md           ← Detailed guide
└── TESTING_QUICK_START.md               ← This file
```

---

## 🎓 Next Steps

1. **Run the automated test** to verify backend works
2. **Test with REST Client** for interactive exploration
3. **Import Postman collection** for team collaboration
4. **Test the frontend form** with verified API
5. **Add employees** and run payroll

---

## ❓ Issues?

**Backend won't start?**
```bash
npm install  # Install dependencies
npm run start:dev  # Start with watch mode
```

**No plans in database?**
Check if there's a seed script or create plans via:
```bash
POST /subscriptions/plans
```

**Token expired?**
Tokens last 24 hours. Login again for new token.

---

**Happy testing! 🚀**
