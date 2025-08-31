# OAuth Token Monitoring Setup

## CloudWatch Alarm for OAuth Failures

### 1. Create Log Metric Filter
```bash
# Create a metric filter that detects "invalid_grant" errors
/home/admin2/.aws-venv/bin/aws logs put-metric-filter \
  --log-group-name "/aws/lambda/booking-system" \
  --filter-name "OAuth-Invalid-Grant-Errors" \
  --filter-pattern '"invalid_grant"' \
  --metric-transformations \
    metricName=OAuthTokenExpired,metricNamespace=BookingSystem,metricValue=1
```

### 2. Create CloudWatch Alarm
```bash
# Create alarm that triggers when OAuth tokens fail
/home/admin2/.aws-venv/bin/aws cloudwatch put-metric-alarm \
  --alarm-name "BookingSystem-OAuth-Token-Expired" \
  --alarm-description "OAuth tokens have expired for booking system" \
  --metric-name OAuthTokenExpired \
  --namespace BookingSystem \
  --statistic Sum \
  --period 300 \
  --threshold 1 \
  --comparison-operator GreaterThanOrEqualToThreshold \
  --evaluation-periods 1 \
  --alarm-actions "arn:aws:sns:us-east-1:504784824189:booking-alerts"
```

### 3. Health Check Lambda (Optional)
Create a Lambda function that runs weekly to test OAuth tokens:

```javascript
export const handler = async (event, context) => {
    try {
        // Test booking system health
        const response = await fetch('https://l22j3krfkgy2k35ezzezqd3nzy0gosml.lambda-url.us-east-1.on.aws/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'getAvailability',
                startDate: new Date().toISOString(),
                endDate: new Date(Date.now() + 24*60*60*1000).toISOString()
            })
        });
        
        const data = await response.json();
        
        if (data.error && data.message === 'invalid_grant') {
            // Send alert - OAuth token expired
            await sendAlert('OAuth tokens expired - booking system needs attention');
            return { statusCode: 500, body: 'OAuth tokens expired' };
        }
        
        return { statusCode: 200, body: 'Booking system healthy' };
    } catch (error) {
        await sendAlert(`Booking system health check failed: ${error.message}`);
        return { statusCode: 500, body: 'Health check failed' };
    }
};
```

## Email Alerts Setup

### Using AWS SES
```bash
# Create SNS topic for alerts
/home/admin2/.aws-venv/bin/aws sns create-topic --name booking-alerts --region us-east-1

# Subscribe your email
/home/admin2/.aws-venv/bin/aws sns subscribe \
  --topic-arn "arn:aws:sns:us-east-1:504784824189:booking-alerts" \
  --protocol email \
  --notification-endpoint "support@donationtransparency.org"
```

## Prevention Schedule

### Automated Approach
1. **Weekly Health Check**: Lambda function tests OAuth tokens
2. **Monthly Alert**: Proactive notification to check token status  
3. **Quarterly Refresh**: Scheduled token refresh before expiration

### Manual Approach
1. **Monthly Test**: Manually test booking system
2. **Calendar Reminder**: Set recurring calendar event to check tokens
3. **Documentation**: Keep this guide handy for quick fixes

## Token Lifespan Management

### Current Token Info
```bash
# Check when current token was last updated
/home/admin2/.aws-venv/bin/aws ssm describe-parameters \
  --parameter-filters "Key=Name,Values=/booking/google/refresh_token" \
  --query 'Parameters[0].LastModifiedDate' \
  --region us-east-1
```

### Best Practices
- **Refresh every 3-4 months** (before 6-month expiration)
- **Test after any Google account changes**
- **Keep backup of working OAuth credentials**
- **Document the refresh process** for team members