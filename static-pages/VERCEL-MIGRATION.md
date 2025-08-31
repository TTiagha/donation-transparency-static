# Booking System Migration: AWS Lambda → Vercel Functions

## Overview
This migration moves the booking system from AWS Lambda to Vercel Functions for simpler deployment and maintenance.

## Benefits of Vercel Migration
- ✅ **Simpler Deployment**: Git-based deployment, no ZIP files
- ✅ **Automatic Dependencies**: No more node_modules packaging issues
- ✅ **Better DX**: Easier debugging and logging
- ✅ **No Cold Starts**: Better performance for users
- ✅ **Integrated Environment**: Single dashboard for everything

## Required Environment Variables

Set these in the Vercel dashboard (Settings → Environment Variables):

```env
# Google Calendar Integration
GOOGLE_CLIENT_ID=1028988516834-pivbaorgjv8epmhfl5bmaoqrnj6a9k94.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_REFRESH_TOKEN=your_refresh_token_here

# Admin Configuration
ADMIN_EMAIL=support@donationtransparency.org

# Optional: Email Service (for future implementation)
# SENDGRID_API_KEY=your_sendgrid_key
# RESEND_API_KEY=your_resend_key
```

## Migration Steps

### 1. Vercel Setup (User Action Required)
1. Create account at https://vercel.com
2. Connect to GitHub repository: `TTiagha/donation-transparency-static`
3. Import project and select the `/mnt/c/shock/static-pages` directory

### 2. Environment Variables (User Action Required)
In Vercel dashboard:
1. Go to Settings → Environment Variables
2. Add all variables listed above
3. Set them for Production, Preview, and Development

### 3. Deploy (Automatic)
- Vercel will automatically deploy on git push
- New endpoint will be: `https://your-project.vercel.app/api/booking`

### 4. Update Frontend (Automated)
- Update `booking.js` to use new Vercel endpoint
- Test all booking flows

## API Endpoint Changes

### Before (Lambda)
```
https://l22j3krfkgy2k35ezzezqd3nzy0gosml.lambda-url.us-east-1.on.aws/
```

### After (Vercel)
```
https://your-project.vercel.app/api/booking
```

## Supported Actions
- `getAvailability` - Get available time slots
- `bookAppointment` - Create a booking
- `getProfile` - Get profile information

## Fallback Mode
The new system includes automatic fallback when Google Calendar is unavailable:
- Shows open calendar slots
- Logs booking attempts for manual processing
- User experience remains smooth

## Email Integration Options

### Option 1: SendGrid (Recommended)
```bash
npm install @sendgrid/mail
```

### Option 2: Resend (Modern Alternative)
```bash
npm install resend
```

### Option 3: Vercel Email (Coming Soon)
Built-in email service by Vercel

## Testing

### Local Development
```bash
cd /mnt/c/shock/static-pages
npm install
vercel dev
```

### API Testing
```bash
curl -X POST https://your-project.vercel.app/api/booking \
  -H "Content-Type: application/json" \
  -d '{"action": "getProfile"}'
```

## Monitoring & Debugging

### Vercel Dashboard
- Real-time function logs
- Performance metrics
- Error tracking
- Usage analytics

### Console Logs
All console.log statements will appear in Vercel Function Logs

## Rollback Plan

If issues occur, the Lambda function remains available:
1. Revert frontend to use Lambda endpoint
2. Debug Vercel issues
3. Re-deploy when fixed

## Performance Improvements

### Cold Start Elimination
- Vercel Functions have faster cold starts
- Better user experience for first-time visitors

### Automatic Scaling
- Vercel handles traffic spikes automatically
- No manual Lambda concurrency configuration

## Security Features

### Rate Limiting
- Built-in rate limiting (same as Lambda version)
- IP-based restrictions

### CORS Configuration
- Configured for donationtransparency.org
- Secure cross-origin requests

### Environment Security
- Vercel encrypts environment variables
- No secrets in code repository

## Next Steps After Migration

1. **Email Service Integration**: Choose and implement email provider
2. **Admin Panel Updates**: Update admin panel API calls
3. **Enhanced Logging**: Implement structured logging
4. **Performance Monitoring**: Set up alerts for function errors
5. **Backup Strategy**: Document data export procedures

## Support

For issues during migration:
1. Check Vercel Function Logs
2. Verify environment variables
3. Test Google Calendar connectivity
4. Check CORS configuration

The migration provides a more maintainable and reliable booking system while preserving all existing functionality.