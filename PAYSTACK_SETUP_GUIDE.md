# Paystack Payment Integration Setup Guide

## Overview
This guide explains how to configure and use the Paystack payment integration for the ComplianceHub application. The system handles payment initiation, webhook processing, and subscription activation.

## Environment Configuration

### Frontend (.env.local)
```env
# Paystack Configuration
VITE_PAYSTACK_PUBLIC_KEY=pk_live_29e6ae6c...
VITE_PAYSTACK_TEST_KEY=pk_test_1573581f39d4a4aa...
VITE_ENABLE_PAYSTACK_SANDBOX=true  # Set to 'false' for production
```

### Backend (.env)
```env
# Paystack Configuration
PAYSTACK_SECRET_KEY=sk_live_9fa5d92c63599d80c9d726124b3adac16b61fbe9
PAYSTACK_TEST_SECRET_KEY=sk_test_816d1a83161ed849b4d7fc4e865e9ebab080ca91
PAYSTACK_SANDBOX_MODE=false  # Set to false for production
```

## Payment Flow

### 1. Frontend: Plan Selection
- User selects Pro or Enterprise plan on `/plan-selection`
- Button redirects to `/checkout?plan=pro&billing=monthly` (or annual)

### 2. Frontend: Checkout Page (/checkout)
- User fills contact information (auto-filled from user/company data)
- User reviews order summary with VAT calculation (7.5%)
- User clicks "Pay ₦X,XXX" button

### 3. Backend: Payment Initiation
**Endpoint:** `POST /api/v1/subscriptions/initiate-payment`

**Request:**
```json
{
  "companyId": "uuid-here",
  "planName": "pro",
  "billingCycle": "monthly"
}
```

**Response:**
```json
{
  "success": true,
  "subscriptionId": "uuid-here",
  "paymentReference": "company_uuid-here_timestamp_random",
  "amount": 15000,
  "currency": "NGN",
  "planName": "pro",
  "billingCycle": "monthly"
}
```

**What happens:**
- Creates a `Subscription` record with status `pending`
- Generates unique payment reference: `company_{companyId}_{timestamp}_{random}`
- Stores reference in database for webhook verification
- Returns reference to frontend for Paystack payment

### 4. Frontend: Paystack Payment Modal
- Frontend receives payment reference from backend
- Loads Paystack script dynamically
- Opens Paystack payment modal with:
  - Email: user's email
  - Amount: total with VAT (in kobo, so multiply by 100)
  - Reference: from backend (e.g., `company_uuid_timestamp_random`)
  - First Name, Last Name, Phone, Company

**Code Flow:**
```typescript
// 1. Backend creates subscription with reference
const backendResponse = await initiatePaymentOnBackend();

// 2. Extract reference from response
const paymentData = {
  reference: backendResponse.paymentReference,  // Unique per payment
  amount: totalAmountInKobo,
  email: user.email,
  ...
};

// 3. Open Paystack modal with reference
openPaystackModal(paymentData);
```

### 5. Paystack: Payment Processing
- User completes payment on Paystack servers
- Paystack processes the transaction
- Paystack sends webhook to backend

### 6. Backend: Webhook Processing
**Endpoint:** `POST /api/v1/subscriptions/paystack-webhook`

**Paystack Configuration:**
The webhook must be configured in your Paystack dashboard:
- Go to: Dashboard → Settings → Webhooks
- Add webhook URL: `https://your-domain.com/api/v1/subscriptions/paystack-webhook`
- Select events: `charge.success` and `charge.failed`

**Webhook Flow:**
1. Paystack sends POST request with:
   ```json
   {
     "event": "charge.success",
     "data": {
       "reference": "company_uuid_timestamp_random",
       "amount": 1500000,  // in kobo
       "customer": {
         "email": "user@example.com"
       },
       "gateway_response": "Successful",
       ...
     }
   }
   ```

2. Backend verifies signature using:
   ```
   hash = HMAC-SHA512(body, secret_key)
   if (hash === request.signature) → Valid
   ```

3. On success (`charge.success`):
   - Extract payment reference
   - Find subscription by reference in database
   - Update subscription status to `active`
   - Record payment in `payment_transactions` table
   - Update company subscription tier (optional, if needed)

4. On failure (`charge.failed`):
   - Record failed payment transaction
   - Keep subscription status as `pending`

**Return Response:**
- Always return `200 OK` to prevent Paystack retries
- Paystack will retry if not 200 OK

## Testing with Sandbox Mode

### Enable Sandbox in Frontend (.env.local):
```env
VITE_ENABLE_PAYSTACK_SANDBOX=true
```

This will:
- Use test public key (`pk_test_...`)
- Display "Sandbox Mode Enabled" notice
- Use sandbox Paystack environment

### Test Card Details:
Paystack provides test cards:
- Card: 4084084084084081
- Expiry: Any future date (e.g., 12/25)
- CVV: Any 3 digits (e.g., 123)
- OTP: 123456

### Testing Webhook Locally:
For local development, use ngrok to expose your local server:

```bash
# Terminal 1: Start ngrok
ngrok http 3000

# This gives you a URL like: https://abc123def.ngrok.io

# Terminal 2: Update Paystack dashboard
# Webhook URL: https://abc123def.ngrok.io/api/v1/subscriptions/paystack-webhook
```

Then test the flow locally.

## Production Checklist

1. **Paystack Account Setup:**
   - [ ] Create Paystack business account
   - [ ] Get live API keys (pk_live_..., sk_live_...)
   - [ ] Verify business details
   - [ ] Enable webhook in settings

2. **Configuration:**
   - [ ] Set VITE_ENABLE_PAYSTACK_SANDBOX=false in frontend
   - [ ] Set PAYSTACK_SANDBOX_MODE=false in backend
   - [ ] Update public keys (pk_live_...)
   - [ ] Update secret keys (sk_live_...)
   - [ ] Set webhook URL to production domain

3. **Database:**
   - [ ] Verify subscription table has paymentReference column
   - [ ] Verify payment_transactions table exists
   - [ ] Run migrations if needed

4. **Testing:**
   - [ ] Test full payment flow with real test cards
   - [ ] Verify webhook receives payment notifications
   - [ ] Verify subscription status updates on payment success
   - [ ] Verify payment transactions are recorded

5. **Monitoring:**
   - [ ] Monitor webhook logs for errors
   - [ ] Set up alerts for failed payments
   - [ ] Track payment success rate
   - [ ] Monitor Paystack dashboard for transaction issues

## Subscription Status Flow

```
[Free Plan] 
↓
User selects Pro/Enterprise
↓
Navigate to /checkout
↓
POST /subscriptions/initiate-payment
↓
[Subscription status: PENDING]
↓
Frontend opens Paystack modal
↓
User completes payment on Paystack
↓
Paystack sends webhook (charge.success)
↓
Backend webhook handler updates subscription
↓
[Subscription status: ACTIVE]
↓
User can access Pro/Enterprise features
↓
Payment recorded in payment_transactions
```

## Troubleshooting

### "Paystack key is not properly configured"
- Check VITE_PAYSTACK_PUBLIC_KEY is set in .env.local
- Verify it starts with pk_test_ or pk_live_
- Reload page to load environment variables

### Webhook not being received
- Verify webhook URL in Paystack dashboard
- Check that URL is publicly accessible
- Verify charge.success event is selected
- Check backend logs for webhook requests

### "Invalid signature" in webhook
- Verify PAYSTACK_SECRET_KEY is correct in .env
- Ensure secret key matches environment (live vs test)
- Check that webhook secret hasn't changed

### Payment modal doesn't open
- Check browser console for errors
- Verify Paystack script loads (check Network tab)
- Verify payment reference is generated by backend
- Check that amount is in kobo (multiply by 100)

### Subscription not activated after payment
- Check backend logs for webhook processing
- Verify subscription exists with correct reference
- Verify webhook signature verification passed
- Check that subscription update succeeded in database

## Database Schema

### subscription table
```sql
- id (UUID)
- companyId (UUID, FK)
- planName (VARCHAR: 'pro', 'enterprise')
- billingCycle (VARCHAR: 'monthly', 'annual')
- amount (DECIMAL)
- currency (VARCHAR: 'NGN')
- status (VARCHAR: 'pending', 'active', 'cancelled')
- paymentReference (VARCHAR, UNIQUE)
- paidAt (TIMESTAMP)
- periodStart (TIMESTAMP)
- periodEnd (TIMESTAMP)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

### payment_transactions table
```sql
- id (UUID)
- subscriptionId (UUID, FK)
- amount (DECIMAL)
- currency (VARCHAR)
- status (VARCHAR: 'successful', 'failed', 'pending')
- provider (VARCHAR: 'paystack')
- transactionReference (VARCHAR, UNIQUE)
- metadata (JSON)
- createdAt (TIMESTAMP)
```

## Support

For issues with:
- **Paystack integration:** Check Paystack documentation at https://paystack.com/docs/api
- **NestJS webhook handling:** Check NestJS Guards documentation
- **Frontend payment flow:** Check console logs for JavaScript errors
- **Database issues:** Check migration logs and TypeORM entity configuration
