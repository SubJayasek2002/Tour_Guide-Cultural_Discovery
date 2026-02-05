# PayHere Payment Setup Guide

## Quick Setup for Testing (Sandbox Mode)

### Step 1: Get PayHere Sandbox Credentials

1. **Sign up for FREE Sandbox Account**
   - Visit: https://sandbox.payhere.lk/merchant/sign-up
   - Complete the registration (takes 2 minutes)

2. **Get Merchant ID**
   - Login to Sandbox Dashboard
   - Go to: **Side Menu > Integrations**
   - Copy your **Merchant ID** (e.g., 1233905)

3. **Generate Merchant Secret**
   - In Integrations page, click **"Add Domain/App"**
   - Enter domain: `localhost` (for local development)
   - Click **"Request to Allow"**
   - Copy the **Merchant Secret** displayed

### Step 2: Configure Backend

1. **Open file:** `Server/src/main/resources/application.properties`

2. **Update these lines:**
   ```properties
   payhere.merchant.id=YOUR_MERCHANT_ID
   payhere.merchant.secret=YOUR_MERCHANT_SECRET
   ```

3. **Example:**
   ```properties
   payhere.merchant.id=1233905
   payhere.merchant.secret=MTIzMzkwNTEyMzQ1Njc4OTEyMzQ1Njc4OTEyMzQ1Njc=
   ```

### Step 3: Restart Backend Server

```bash
# Stop current server (Ctrl+C in terminal)
# Then restart
mvn spring-boot:run
```

### Step 4: Test Payment

1. Go to: http://localhost:5174/hotels/register
2. Fill in hotel details and register
3. On payment page, use test card:
   - **Card Number:** 4916217501611292 (Visa)
   - **CVV:** Any 3 digits (e.g., 123)
   - **Expiry:** Any future date (e.g., 12/25)
   - **Name:** Any name

✅ **No real money will be charged in sandbox mode!**

---

## Common Issues & Solutions

### Issue 1: "Unauthorized payment request"

**Cause:** Missing or incorrect Merchant Secret in backend

**Solution:**
1. Check `application.properties` has correct Merchant Secret
2. Make sure you copied the secret from the correct domain in PayHere Dashboard
3. Restart backend server after updating properties

### Issue 2: "Failed to generate payment hash"

**Cause:** Backend server not running or wrong port

**Solution:**
1. Ensure backend is running on port 8081
2. Check console for error messages
3. Verify `http://localhost:8081/api/payments/generate-hash` is accessible

### Issue 3: Payment popup doesn't appear

**Cause:** PayHere script not loaded or JavaScript errors

**Solution:**
1. Open browser DevTools (F12) > Console tab
2. Look for any errors
3. Refresh the page
4. Clear browser cache if needed

### Issue 4: "Invalid hash" error

**Cause:** Mismatch between Merchant ID and Secret

**Solution:**
1. Verify Merchant ID in `application.properties` matches PayHere Dashboard
2. Ensure Merchant Secret is from the SAME merchant account
3. Check no extra spaces in the property values

---

## For Production Deployment

### 1. Get Live Merchant Account
- Apply at: https://www.payhere.lk/merchant/sign-up
- Complete business verification (2-3 days)

### 2. Update Configuration
```properties
payhere.merchant.id=YOUR_LIVE_MERCHANT_ID
payhere.merchant.secret=YOUR_LIVE_MERCHANT_SECRET
```

### 3. Update Frontend
In `PaymentPage.tsx`:
```typescript
const PAYHERE_SANDBOX = false; // Change to false
```

### 4. Important for Production
- Use HTTPS (required by PayHere)
- Set proper `notify_url` to public endpoint
- Implement proper payment status update in database
- Add payment logging and monitoring

---

## Test Card Numbers

### Successful Payment
- **Visa:** 4916217501611292
- **MasterCard:** 5307732125531191
- **AMEX:** 346781005510225

### Failed Payment Scenarios
- **Insufficient Funds (Visa):** 4024007194349121
- **Limit Exceeded (MasterCard):** 5491182243178283
- **Do Not Honor (Visa):** 4929768900837248

---

## Need Help?

- **PayHere Documentation:** https://support.payhere.lk
- **Sandbox Portal:** https://sandbox.payhere.lk
- **Support:** https://www.payhere.lk/support

---

**Note:** Keep your Merchant Secret secure and never commit it to public repositories!
