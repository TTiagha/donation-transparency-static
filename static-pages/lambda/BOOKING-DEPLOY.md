# Booking System Lambda Deployment Guide

## Prerequisites

1. **AWS CLI configured** with appropriate permissions
2. **Google Cloud Console project** set up with Calendar API enabled
3. **AWS Secrets Manager** configured for Google credentials
4. **Domain verification** completed for Google OAuth

## Step 1: Google Calendar API Setup

### 1.1 Enable APIs in Google Cloud Console

```bash
# Go to: https://console.cloud.google.com/
# Enable these APIs:
# - Google Calendar API
# - Google People API (for profile pictures)
```

### 1.2 Create OAuth2 Credentials

1. Go to **APIs & Services > Credentials**
2. Click **Create Credentials > OAuth 2.0 Client IDs**
3. Set Application Type: **Web application**
4. Add Authorized redirect URIs:
   - `https://donationtransparency.org/booking/auth/callback`
   - `http://localhost:8080/auth/callback` (for testing)

### 1.3 Get Initial Refresh Token

```bash
# Run the Google OAuth flow to get refresh token
# This is a one-time setup process
node get-refresh-token.js
```

## Step 2: AWS Secrets Manager Setup

### 2.1 Store Google Credentials

```bash
aws secretsmanager create-secret \
  --name "booking/google-credentials" \
  --description "Google Calendar API credentials for booking system" \
  --secret-string '{
    "client_id": "your-client-id.apps.googleusercontent.com",
    "client_secret": "your-client-secret",
    "refresh_token": "your-refresh-token",
    "redirect_uris": ["https://donationtransparency.org/booking/auth/callback"]
  }' \
  --region us-east-1
```

### 2.2 Verify Secret

```bash
aws secretsmanager get-secret-value \
  --secret-id "booking/google-credentials" \
  --region us-east-1
```

## Step 3: Lambda Function Deployment

### 3.1 Install Dependencies

```bash
cd /mnt/c/shock/static-pages/lambda/
npm install
```

### 3.2 Package and Deploy

```bash
# Create deployment package
zip -r booking-system.zip . \
  -x "*.md" "deploy.sh" "node_modules/.cache/*" "*.git*"

# Create/Update Lambda function
aws lambda create-function \
  --function-name booking-system \
  --runtime nodejs18.x \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/lambda-booking-execution-role \
  --handler booking-handler.handler \
  --zip-file fileb://booking-system.zip \
  --timeout 30 \
  --memory-size 512 \
  --environment Variables='{
    "REGION": "us-east-1",
    "GOOGLE_CREDENTIALS_SECRET_NAME": "booking/google-credentials",
    "ADMIN_EMAIL": "support@donationtransparency.org"
  }' \
  --region us-east-1
```

### 3.3 Create Function URL

```bash
# Create public Function URL with CORS
aws lambda create-function-url-config \
  --function-name booking-system \
  --config '{
    "AuthType": "NONE",
    "Cors": {
      "AllowCredentials": false,
      "AllowHeaders": ["Content-Type"],
      "AllowMethods": ["GET", "POST", "OPTIONS"],
      "AllowOrigins": ["https://donationtransparency.org", "http://localhost:3000"],
      "ExposeHeaders": [],
      "MaxAge": 86400
    }
  }' \
  --region us-east-1
```

### 3.4 Update Function (for subsequent deployments)

```bash
# Update function code
aws lambda update-function-code \
  --function-name booking-system \
  --zip-file fileb://booking-system.zip \
  --region us-east-1

# Update environment variables if needed
aws lambda update-function-configuration \
  --function-name booking-system \
  --environment Variables='{
    "REGION": "us-east-1",
    "GOOGLE_CREDENTIALS_SECRET_NAME": "booking/google-credentials",
    "ADMIN_EMAIL": "support@donationtransparency.org"
  }' \
  --region us-east-1
```

## Step 4: IAM Permissions

### 4.1 Create Execution Role

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream", 
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail",
        "ses:SendRawEmail"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": "arn:aws:secretsmanager:us-east-1:*:secret:booking/google-credentials-*"
    }
  ]
}
```

## Step 5: Frontend Configuration

### 5.1 Update Lambda Endpoint

Edit `/static-pages/booking/assets/booking.js`:

```javascript
const BookingApp = {
    config: {
        lambdaEndpoint: 'https://YOUR_FUNCTION_URL.lambda-url.us-east-1.on.aws/',
        // ... other config
    }
}
```

### 5.2 Update Admin Panel

Edit `/static-pages/booking/assets/admin.js`:

```javascript
const AdminPanel = {
    config: {
        lambdaEndpoint: 'https://YOUR_FUNCTION_URL.lambda-url.us-east-1.on.aws/',
        // ... other config
    }
}
```

## Step 6: Testing

### 6.1 Test Calendar Integration

```bash
# Test availability endpoint
curl -X POST https://YOUR_FUNCTION_URL.lambda-url.us-east-1.on.aws/ \
  -H "Content-Type: application/json" \
  -d '{
    "action": "getAvailability",
    "startDate": "2025-01-22T00:00:00.000Z",
    "endDate": "2025-01-29T00:00:00.000Z"
  }'
```

### 6.2 Test Profile Endpoint

```bash
curl -X POST https://YOUR_FUNCTION_URL.lambda-url.us-east-1.on.aws/ \
  -H "Content-Type: application/json" \
  -d '{"action": "getProfile"}'
```

### 6.3 Test Booking Creation

```bash
curl -X POST https://YOUR_FUNCTION_URL.lambda-url.us-east-1.on.aws/ \
  -H "Content-Type: application/json" \
  -d '{
    "action": "bookAppointment",
    "name": "Test User",
    "email": "test@example.com",
    "dateTime": "2025-01-25T15:00:00.000Z",
    "duration": 30,
    "meetingType": "consultation",
    "location": "google_meet",
    "timezone": "America/Los_Angeles",
    "notes": "Test booking",
    "timestamp": "'$(date +%s000)'",
    "submissionTime": "'$(date +%s000)'"
  }'
```

## Step 7: Monitoring and Logs

### 7.1 View Logs

```bash
aws logs tail /aws/lambda/booking-system --follow
```

### 7.2 Set Up CloudWatch Alarms

```bash
# Error rate alarm
aws cloudwatch put-metric-alarm \
  --alarm-name "BookingSystem-ErrorRate" \
  --alarm-description "High error rate in booking system" \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --statistic Sum \
  --period 300 \
  --threshold 5 \
  --comparison-operator GreaterThanOrEqualToThreshold \
  --dimensions Name=FunctionName,Value=booking-system \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:us-east-1:YOUR_ACCOUNT:booking-alerts
```

## Step 8: Security Hardening

### 8.1 Enable AWS WAF (Recommended)

- Rate limiting per IP
- Geo-blocking if needed
- SQL injection protection

### 8.2 Monitor for Abuse

- Set up CloudWatch alerts for high request volume
- Monitor for repeated failed requests
- Implement additional rate limiting if needed

## Troubleshooting

### Common Issues

1. **Calendar API Authentication Fails**
   - Verify refresh token is valid
   - Check Google Cloud Console for API quotas
   - Ensure calendar ID exists and is accessible

2. **Email Sending Fails**
   - Verify SES is configured and domain verified
   - Check IAM permissions for SES
   - Ensure from email is verified in SES

3. **Function Timeout**
   - Increase Lambda timeout (up to 15 minutes for large calendars)
   - Optimize calendar queries with date ranges
   - Implement caching for frequently accessed data

4. **CORS Issues**
   - Verify Function URL CORS configuration
   - Check that frontend domain is in allowed origins
   - Test with browser developer tools

### Debug Mode

Add this to environment variables for verbose logging:

```bash
aws lambda update-function-configuration \
  --function-name booking-system \
  --environment Variables='{
    "REGION": "us-east-1",
    "GOOGLE_CREDENTIALS_SECRET_NAME": "booking/google-credentials",
    "ADMIN_EMAIL": "support@donationtransparency.org",
    "DEBUG": "true"
  }'
```

## Production Checklist

- [ ] Google Calendar API credentials stored in Secrets Manager
- [ ] Lambda function deployed with correct IAM permissions
- [ ] Function URL created with proper CORS configuration
- [ ] SES verified for sending emails
- [ ] Frontend updated with production Lambda URL
- [ ] Admin panel secured with strong access key
- [ ] CloudWatch monitoring and alerts configured
- [ ] Error handling and logging implemented
- [ ] Rate limiting configured and tested
- [ ] SSL/TLS certificates valid
- [ ] DNS records pointing to correct endpoints

## Rollback Plan

If issues arise after deployment:

1. **Revert Lambda Function**
   ```bash
   aws lambda update-function-code \
     --function-name booking-system \
     --zip-file fileb://previous-version.zip
   ```

2. **Disable New Function**
   - Update frontend to use old waitlist system
   - Redirect booking page to contact form temporarily

3. **Monitor for Resolution**
   - Check logs for specific error patterns
   - Test individual components (calendar, email, database)
   - Fix issues and redeploy incrementally