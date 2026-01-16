# 🧪 Onboarding Flow Testing - Complete Guide

I've created testing files for the ComplianceHub onboarding flow. Here's what controls it:

## 📋 Onboarding Flow Endpoints

The onboarding follows this sequence:

| Step | Endpoint | Method | Purpose |
|------|----------|--------|---------|
| 1 | `/auth/register` | POST | User signs up |
| 2 | `/auth/login` | POST | User logs in → get access token |
| 3 | `/users/me` | GET | Get user profile |
| 4 | `/tenants` | POST | Create company (from setup form) |
| 5 | `/tenants` | GET | List user's companies |
| 6 | `/subscriptions/plans` | GET | View available plans |
| 7 | `/subscriptions/plans/:id` | GET | View specific plan details |
| 8 | `/subscriptions` | POST | Subscribe to plan (checkout) |
| 9 | `/subscriptions/me` | GET | Verify active subscription |
| 10 | `/tenants/:id` | GET | Get company details |

## 🚀 How to Test

### **Option 1: Automated Test (Recommended)**

```bash
cd /home/ifeanyireed/aegis-flow
./test-onboarding.sh
```

**This will:**
✅ Register a new user  
✅ Log them in and get access token  
✅ Create a test company  
✅ List available plans  
✅ Subscribe to a plan  
✅ Verify all data was created  

**Before running:**
- Start the backend first:
  ```bash
  cd "NestJS backend/compliancehub"
  npm run start:dev
  ```

### **Option 2: Manual Testing with REST Client (VS Code)**

1. Install REST Client extension: https://marketplace.visualstudio.com/items?itemName=humao.rest-client
2. Open the file: `onboarding-flow-test.http`
3. Replace placeholder values with actual responses from previous requests
4. Click "Send Request" above each endpoint

### **Option 3: Manual Testing with cURL**

See `ONBOARDING_FLOW_TESTING.md` for detailed cURL examples of each step.

---

## 📊 Request/Response Examples

### **Sign Up**
```bash
POST http://localhost:3000/api/v1/auth/register

{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```
Returns: `user { id, email, firstName, lastName }`

### **Login**
```bash
POST http://localhost:3000/api/v1/auth/login

{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```
Returns: `{ accessToken, refreshToken, expiresIn }`

### **Create Company (Tenant)**
```bash
POST http://localhost:3000/api/v1/tenants
Authorization: Bearer {accessToken}

{
  "name": "Acme Corporation",
  "slug": "acme-corp",
  "description": "My company",
  "website": "https://acme.com",
  "industry": "Technology",
  "maxUsers": 50
}
```
Returns: Tenant object with `id` (save this!)

### **Get Plans**
```bash
GET http://localhost:3000/api/v1/subscriptions/plans
```
Returns: Array of plans (Free, Pro, Enterprise) with pricing and features

### **Subscribe to Plan**
```bash
POST http://localhost:3000/api/v1/subscriptions
Authorization: Bearer {accessToken}

{
  "planId": "{plan_id_from_step_6}",
  "billingCycle": "monthly",
  "autoRenew": true
}
```
Returns: Subscription object with status

---

## 📁 Files Created

| File | Purpose |
|------|---------|
| `onboarding-flow-test.http` | VS Code REST Client requests (click "Send Request") |
| `test-onboarding.sh` | Bash script for automated full flow test |
| `ONBOARDING_FLOW_TESTING.md` | Detailed guide with all cURL examples |

---

## 🔗 Key Data to Track

When testing, save these values to use in subsequent requests:

```
User Registration:
  - user.id → Use for GET /users/me

Login:
  - accessToken → Use for all protected endpoints (Bearer token)

Company Creation:
  - tenant.id → Use for GET /tenants/{id}

Plan Selection:
  - plan.id → Use for subscription creation

Subscription:
  - subscription.id → For future subscription management
```

---

## ✅ Testing Checklist

- [ ] Backend is running on `http://localhost:3000`
- [ ] User can register successfully
- [ ] User can log in and get access token
- [ ] User profile can be fetched
- [ ] Company/tenant can be created
- [ ] Plans can be listed
- [ ] Subscription can be created
- [ ] All responses return correct data

---

## 🐛 Troubleshooting

**Backend won't start?**
```bash
cd "NestJS backend/compliancehub"
npm install  # If node_modules is missing
npm run start:dev
```

**"No plans found" error?**
Check if plans are seeded:
```bash
npm run seed  # If available in package.json
```

**"Invalid token" error?**
- Copy the full `accessToken` from login response
- Use format: `Authorization: Bearer YOUR_TOKEN_HERE`
- Tokens expire after 24 hours

**"Tenant creation failed"?**
- Each slug must be unique
- Use timestamps: `test-sme-${Date.now()}`

---

## 📚 Complete Documentation

See `API_ENDPOINTS.md` for:
- All 50+ API endpoints
- Complete request/response schemas
- Error handling
- Rate limiting information

