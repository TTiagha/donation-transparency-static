# Booking System Troubleshooting Guide

## System Architecture Overview

The booking system consists of:
1. **Frontend**: Static HTML/JS hosted on AWS Amplify (`/booking/`)
2. **Backend**: AWS Lambda function (`booking-system`)
3. **Calendar Integration**: Google Calendar API via OAuth2
4. **Email Service**: AWS SES for confirmations
5. **Configuration**: AWS Systems Manager Parameter Store

## Common Issues and Solutions

### 1. Time Slots Not Showing Correctly

#### Symptom: Morning slots (9 AM) not appearing
**Root Cause**: Timezone/DST handling issues

**Solution**:
```javascript
// Check timezone offset in lambda/index.js
// EDT (summer): UTC-4
// EST (winter): UTC-5
const isDST = monthNum >= 2 && monthNum <= 10; // March-November
const offset = isDST ? 4 : 5;
```

**Debugging Steps**:
1. Check Lambda logs for timezone calculations
2. Verify the `userTimezone` parameter is being passed
3. Confirm DST is being handled correctly for the date

#### Symptom: No slots showing for a specific day
**Possible Causes**:
- Day marked as "day off" in configuration
- Minimum notice period filtering (default: 24 hours, now 6 hours)
- All slots blocked by Google Calendar events

**Debugging**:
```bash
# Check Lambda logs for the specific date
aws logs get-log-events --log-group-name "/aws/lambda/booking-system" \
  --log-stream-name "LATEST_STREAM" --region us-east-1 | \
  grep "2025-08-25"
```

### 2. Google Calendar Sync Issues

#### Verifying Calendar Integration
1. **Check credentials in Parameter Store**:
```bash
aws ssm get-parameters --names \
  "/booking/google/client_id" \
  "/booking/google/client_secret" \
  "/booking/google/refresh_token" \
  --region us-east-1
```

2. **Verify Calendar API is detecting busy times**:
- Check Lambda logs for "busyTimes" count
- Confirm events are in UTC format

#### Common Calendar Issues:
- **Wrong calendar**: Ensure using 'primary' calendar
- **Timezone mismatch**: Calendar events must be in the correct timezone
- **Visibility settings**: Events should have default visibility

### 3. Lambda Deployment Issues

#### "Cannot find package 'googleapis'" Error
**Cause**: Dependencies not included in deployment package

**Solution**: Use the full deployment script
```bash
./deploy-lambda-full.sh  # Includes all node_modules
# NOT ./deploy-lambda-minimal.sh (code only)
```

#### Lambda URL Configuration
**Important**: Two Lambda functions exist:
- `booking-system`: Main booking handler
- `waitlist-handler`: Waitlist signup (different URL)

**Get correct URL**:
```bash
aws lambda get-function-url-config --function-name booking-system \
  --region us-east-1 --query 'FunctionUrl'
```

**Update frontend**:
```javascript
// booking/assets/booking.js
config: {
    lambdaEndpoint: 'https://l22j3krfkgy2k35ezzezqd3nzy0gosml.lambda-url.us-east-1.on.aws/',
    // NOT the waitlist URL!
}
```

### 4. Deployment Process

#### Quick Code-Only Deploy (when dependencies unchanged):
```bash
/mnt/c/shock/static-pages/deploy-lambda-minimal.sh
```

#### Full Deploy with Dependencies:
```bash
/mnt/c/shock/static-pages/deploy-lambda-full.sh
```

#### Deployment Package Size Limits:
- Direct upload: 50MB max
- Via S3: 250MB max
- Current package: ~17MB compressed (139MB uncompressed)

### 5. Testing Availability API

#### Test with curl:
```bash
curl -X POST https://l22j3krfkgy2k35ezzezqd3nzy0gosml.lambda-url.us-east-1.on.aws/ \
  -H "Content-Type: application/json" \
  -d '{
    "action": "getAvailability",
    "startDate": "2025-08-28",
    "endDate": "2025-08-28",
    "timezone": "America/New_York"
  }'
```

#### Parse results:
```python
# Show times in EDT/EST
import json
from datetime import datetime

slots = response['availability']
for slot in slots:
    start = datetime.fromisoformat(slot['start'].replace('Z', '+00:00'))
    # August = EDT (UTC-4), January = EST (UTC-5)
    offset = 4 if start.month in [3,4,5,6,7,8,9,10,11] else 5
    local_hour = (start.hour - offset) % 24
    print(f"{local_hour}:00")
```

### 6. Configuration Management

#### Default Configuration (hardcoded):
Located in `lambda/index.js`:
```javascript
const CONFIG = {
    timezone: 'America/Los_Angeles',
    minimumNoticeHours: 6,  // Changed from 24
    dailySchedule: {
        monday: { start: 9, end: 17, isDayOff: false },
        // ...
    }
}
```

#### Per-User Settings:
Stored in Parameter Store as `/booking/settings/{email}`

#### Admin Settings Override:
Parameter Store: `/booking/settings/admin`

### 7. Monitoring and Logs

#### View Lambda Logs:
```bash
# Get latest log stream
aws logs describe-log-streams \
  --log-group-name "/aws/lambda/booking-system" \
  --region us-east-1 \
  --order-by LastEventTime \
  --descending --limit 1

# View logs
aws logs get-log-events \
  --log-group-name "/aws/lambda/booking-system" \
  --log-stream-name "STREAM_NAME" \
  --region us-east-1
```

#### Key Log Patterns to Search:
- `"Processing getAvailability"` - API requests
- `"Generating slots for day"` - Slot generation details
- `"busyTimes"` - Calendar conflicts
- `"error"` or `"Error"` - Errors

### 8. Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "All fields are required" | Wrong Lambda URL (using waitlist) | Use booking-system URL |
| "Cannot find package 'googleapis'" | Missing dependencies | Run full deployment |
| "Invalid action" | Malformed request | Check JSON structure |
| "Rate limit exceeded" | Too many requests | Wait and retry |

### 9. Access Control

The booking page requires an invite code:
- Code validated via Lambda
- Stored in `localStorage` after validation
- URL format: `/booking/?code=meet-onno`

### 10. Critical Files

- `/lambda/index.js` - Main Lambda handler
- `/lambda/package.json` - Dependencies
- `/booking/assets/booking.js` - Frontend logic
- `/booking/index.html` - Booking interface
- Deploy scripts:
  - `/deploy-lambda-full.sh` - Full deployment
  - `/deploy-lambda-minimal.sh` - Code only
  - `/CLAUDE.md` - Project documentation

## Troubleshooting Checklist

When debugging booking issues:

1. ✅ Verify correct Lambda URL in frontend
2. ✅ Check Lambda has all dependencies deployed
3. ✅ Confirm Google Calendar credentials are valid
4. ✅ Verify timezone/DST handling for the date
5. ✅ Check minimum notice period (currently 6 hours)
6. ✅ Review Lambda logs for specific errors
7. ✅ Test API directly with curl
8. ✅ Verify user's actual calendar availability
9. ✅ Check for rate limiting
10. ✅ Confirm CORS headers are set correctly

## Recent Fixes (January 2025)

1. **Fixed DST Handling**: Added proper EDT/EST detection based on month
2. **Fixed Timezone Conversion**: Corrected UTC offset calculations
3. **Fixed Lambda URL**: Updated frontend to use correct booking-system URL
4. **Fixed Dependencies**: Included googleapis and all node_modules in deployment
5. **Reduced Minimum Notice**: Changed from 24 hours to 6 hours for testing
6. **Fixed Date Range Bug**: Extended endDate to end of day when same as startDate

## Contact

For AWS access or credential issues, contact the DevOps team.
For Google Calendar API issues, check the Google Cloud Console project.