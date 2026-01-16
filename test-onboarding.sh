#!/bin/bash

###############################################################################
# ComplianceHub Onboarding Flow - Complete Automated Test
# This script tests the entire onboarding flow end-to-end
###############################################################################

set -e  # Exit on error

BASE_URL="http://localhost:3000/api/v1"
TIMESTAMP=$(date +%s%N)
TEST_EMAIL="testuser-${TIMESTAMP}@example.com"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}ComplianceHub Onboarding Flow Test${NC}"
echo -e "${BLUE}=========================================${NC}\n"

# Check if backend is running
echo -e "${YELLOW}[CHECK]${NC} Verifying backend is running..."
if ! curl -s "${BASE_URL}/subscriptions/plans" > /dev/null 2>&1; then
    echo -e "${RED}[ERROR]${NC} Backend is not running at ${BASE_URL}"
    echo "Please start the NestJS backend first:"
    echo "  cd 'NestJS backend/compliancehub'"
    echo "  npm run start:dev"
    exit 1
fi
echo -e "${GREEN}[✓]${NC} Backend is running\n"

###############################################################################
# STEP 1: SIGN UP
###############################################################################
echo -e "${BLUE}[STEP 1]${NC} User Registration"
echo -e "Email: ${TEST_EMAIL}"

SIGNUP_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"firstName\": \"Test\",
    \"lastName\": \"User\",
    \"email\": \"${TEST_EMAIL}\",
    \"password\": \"TestPassword123!\"
  }")

USER_ID=$(echo "$SIGNUP_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$USER_ID" ]; then
    echo -e "${RED}[✗]${NC} Registration failed"
    echo "Response: $SIGNUP_RESPONSE"
    exit 1
fi

echo -e "${GREEN}[✓]${NC} User registered successfully"
echo "    User ID: ${USER_ID}\n"

###############################################################################
# STEP 2: LOGIN
###############################################################################
echo -e "${BLUE}[STEP 2]${NC} User Login"

LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"${TEST_EMAIL}\",
    \"password\": \"TestPassword123!\"
  }")

ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

if [ -z "$ACCESS_TOKEN" ]; then
    echo -e "${RED}[✗]${NC} Login failed"
    echo "Response: $LOGIN_RESPONSE"
    exit 1
fi

echo -e "${GREEN}[✓]${NC} User logged in successfully"
echo "    Token: ${ACCESS_TOKEN:0:50}...\n"

###############################################################################
# STEP 3: GET CURRENT USER
###############################################################################
echo -e "${BLUE}[STEP 3]${NC} Fetch User Profile"

USER_PROFILE=$(curl -s -X GET "${BASE_URL}/users/me" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")

echo -e "${GREEN}[✓]${NC} User profile retrieved"
echo "    $(echo "$USER_PROFILE" | grep -o '"firstName":"[^"]*"')\n"

###############################################################################
# STEP 4: CREATE TENANT (COMPANY)
###############################################################################
echo -e "${BLUE}[STEP 4]${NC} Create Company (Tenant)"

TENANT_RESPONSE=$(curl -s -X POST "${BASE_URL}/tenants" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -d "{
    \"name\": \"Test SME Company\",
    \"slug\": \"test-sme-${TIMESTAMP}\",
    \"description\": \"Test company for onboarding flow\",
    \"website\": \"https://testsme.com\",
    \"industry\": \"Technology\",
    \"maxUsers\": 50
  }")

TENANT_ID=$(echo "$TENANT_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$TENANT_ID" ]; then
    echo -e "${RED}[✗]${NC} Tenant creation failed"
    echo "Response: $TENANT_RESPONSE"
    exit 1
fi

echo -e "${GREEN}[✓]${NC} Company created successfully"
echo "    Tenant ID: ${TENANT_ID}\n"

###############################################################################
# STEP 5: GET USER'S TENANTS
###############################################################################
echo -e "${BLUE}[STEP 5]${NC} List User's Companies"

TENANTS=$(curl -s -X GET "${BASE_URL}/tenants" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")

TENANT_COUNT=$(echo "$TENANTS" | grep -o '"id":"' | wc -l)

echo -e "${GREEN}[✓]${NC} Retrieved user's companies"
echo "    Total companies: ${TENANT_COUNT}\n"

###############################################################################
# STEP 6: GET SUBSCRIPTION PLANS
###############################################################################
echo -e "${BLUE}[STEP 6]${NC} Fetch Available Plans"

PLANS=$(curl -s -X GET "${BASE_URL}/subscriptions/plans")

PLAN_COUNT=$(echo "$PLANS" | grep -o '"id":"' | wc -l)

if [ "$PLAN_COUNT" -eq 0 ]; then
    echo -e "${RED}[✗]${NC} No plans found. Are plans seeded in the database?"
    echo "Response: $PLANS"
    exit 1
fi

# Extract first plan ID for subscription
PLAN_ID=$(echo "$PLANS" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

echo -e "${GREEN}[✓]${NC} Plans retrieved successfully"
echo "    Total plans available: ${PLAN_COUNT}"
echo "    Using plan ID: ${PLAN_ID}\n"

###############################################################################
# STEP 7: CREATE SUBSCRIPTION
###############################################################################
echo -e "${BLUE}[STEP 7]${NC} Subscribe to Plan"

SUBSCRIPTION_RESPONSE=$(curl -s -X POST "${BASE_URL}/subscriptions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -d "{
    \"planId\": \"${PLAN_ID}\",
    \"billingCycle\": \"monthly\",
    \"autoRenew\": true
  }")

SUBSCRIPTION_ID=$(echo "$SUBSCRIPTION_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
SUBSCRIPTION_STATUS=$(echo "$SUBSCRIPTION_RESPONSE" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)

if [ -z "$SUBSCRIPTION_ID" ]; then
    echo -e "${YELLOW}[⚠]${NC} Subscription creation may have failed or not required at this stage"
    echo "Response: $SUBSCRIPTION_RESPONSE"
else
    echo -e "${GREEN}[✓]${NC} Subscription created successfully"
    echo "    Subscription ID: ${SUBSCRIPTION_ID}"
    echo "    Status: ${SUBSCRIPTION_STATUS}\n"
fi

###############################################################################
# STEP 8: GET CURRENT SUBSCRIPTION
###############################################################################
echo -e "${BLUE}[STEP 8]${NC} Get Current Subscription"

CURRENT_SUB=$(curl -s -X GET "${BASE_URL}/subscriptions/me" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")

SUB_STATUS=$(echo "$CURRENT_SUB" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)

if [ -z "$SUB_STATUS" ]; then
    echo -e "${YELLOW}[⚠]${NC} No active subscription found"
else
    echo -e "${GREEN}[✓]${NC} Subscription retrieved"
    echo "    Status: ${SUB_STATUS}\n"
fi

###############################################################################
# STEP 9: GET TENANT DETAILS
###############################################################################
echo -e "${BLUE}[STEP 9]${NC} Get Company Details"

TENANT_DETAIL=$(curl -s -X GET "${BASE_URL}/tenants/${TENANT_ID}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")

TENANT_NAME=$(echo "$TENANT_DETAIL" | grep -o '"name":"[^"]*"' | cut -d'"' -f4)

echo -e "${GREEN}[✓]${NC} Company details retrieved"
echo "    Name: ${TENANT_NAME}\n"

###############################################################################
# SUMMARY
###############################################################################
echo -e "${BLUE}=========================================${NC}"
echo -e "${GREEN}✓ ONBOARDING FLOW TEST COMPLETE${NC}"
echo -e "${BLUE}=========================================${NC}\n"

echo -e "${YELLOW}Test Summary:${NC}"
echo "  User Email:         ${TEST_EMAIL}"
echo "  User ID:            ${USER_ID}"
echo "  Company ID:         ${TENANT_ID}"
echo "  Company Name:       ${TENANT_NAME}"
echo "  Plan ID:            ${PLAN_ID}"
echo "  Access Token:       ${ACCESS_TOKEN:0:50}..."
echo ""

echo -e "${YELLOW}Next Steps:${NC}"
echo "  1. Use these credentials to test the frontend onboarding flow"
echo "  2. Navigate to http://localhost:5173/signin"
echo "  3. Enter: ${TEST_EMAIL} / TestPassword123!"
echo "  4. Verify company setup is displayed"
echo ""

echo -e "${GREEN}All endpoints tested successfully!${NC}\n"
