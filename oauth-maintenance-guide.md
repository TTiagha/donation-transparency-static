# Google OAuth Token Maintenance Guide

## Quick Fix When Token Expires

### Step 1: Detect the Issue
```bash
# Test the booking system
curl -X POST "https://l22j3krfkgy2k35ezzezqd3nzy0gosml.lambda-url.us-east-1.on.aws/" \
  -H "Content-Type: application/json" \
  -d '{"action": "getAvailability", "startDate": "2025-09-01T00:00:00.000Z", "endDate": "2025-09-01T23:59:59.999Z"}'

# If you see "invalid_grant", the token is expired
```

### Step 2: Generate New Token
1. Visit this authorization URL (replace with current client_id if needed):
```
https://accounts.google.com/o/oauth2/v2/auth?client_id=1028988516834-pivbaorgjv8epmhfl5bmaoqrnj6a9k94.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fdonationtransparency.org%2Fbooking%2Fauth%2Fcallback&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar.events&access_type=offline&prompt=consent
```

2. Copy the authorization code from the redirect URL

3. Exchange the code for a new refresh token:
```bash
# Create temporary script
cat > /tmp/refresh-oauth.js << 'EOF'
const https = require('https');
const { exec } = require('child_process');

const CLIENT_ID = '1028988516834-pivbaorgjv8epmhfl5bmaoqrnj6a9k94.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://donationtransparency.org/booking/auth/callback';

const authCode = process.argv[2];
const postData = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code: authCode,
    grant_type: 'authorization_code',
    redirect_uri: REDIRECT_URI
}).toString();

const options = {
    hostname: 'oauth2.googleapis.com',
    port: 443,
    path: '/token',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length
    }
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        const tokens = JSON.parse(data);
        if (tokens.refresh_token) {
            const cmd = `/home/admin2/.aws-venv/bin/aws ssm put-parameter --name "/booking/google/refresh_token" --value "${tokens.refresh_token}" --type "String" --overwrite --region us-east-1`;
            exec(cmd, (error) => {
                if (error) {
                    console.error('Failed to update Parameter Store:', error);
                } else {
                    console.log('✅ OAuth token refreshed successfully!');
                }
            });
        } else {
            console.error('No refresh token received:', tokens);
        }
    });
});

req.write(postData);
req.end();
EOF

# Run with the authorization code
node /tmp/refresh-oauth.js "PASTE_AUTH_CODE_HERE"

# Clean up
rm /tmp/refresh-oauth.js
```

### Step 3: Verify Fix
```bash
# Test the booking system again
curl -X POST "https://l22j3krfkgy2k35ezzezqd3nzy0gosml.lambda-url.us-east-1.on.aws/" \
  -H "Content-Type: application/json" \
  -d '{"action": "getAvailability", "startDate": "2025-09-01T00:00:00.000Z", "endDate": "2025-09-01T23:59:59.999Z"}'

# Should now return real availability data
```

## Prevention Strategies

### Option 1: Automated Token Health Check
Create a monthly CloudWatch event that calls the booking API and alerts if tokens are expired.

### Option 2: Proactive Refresh
Set up a Lambda function that refreshes tokens before they expire (every 3-4 months).

### Option 3: Monitoring
Set up CloudWatch alarms for Lambda errors containing "invalid_grant".

## Troubleshooting

### If the Auth URL Changes
Update the client_id in the authorization URL by checking AWS Parameter Store:
```bash
/home/admin2/.aws-venv/bin/aws ssm get-parameter --name "/booking/google/client_id" --region us-east-1
```

### If Google Changes OAuth Scopes
The booking system needs these specific permissions:
- `https://www.googleapis.com/auth/calendar`
- `https://www.googleapis.com/auth/calendar.events`

### Emergency Fallback
If OAuth can't be fixed immediately, the booking system will continue to show time slots (just not real availability). You can:
1. Disable online booking temporarily
2. Use the admin panel to manually manage appointments
3. Set up email notifications to handle booking requests manually

## Maintenance Schedule
- **Monthly**: Test booking system functionality
- **Quarterly**: Check token expiration proactively  
- **After Google Account Changes**: Immediately refresh tokens