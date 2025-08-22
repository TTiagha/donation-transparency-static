# Booking System Overview

A complete Calendly-style booking system integrated with Google Calendar, hosted on AWS Amplify with Lambda backend.

## Access URLs

**📅 Public Booking Page:** https://donationtransparency.org/booking/?invite=abc123  
**⚙️ Admin Panel:** https://donationtransparency.org/booking/admin.html?key=admin2025  
**🔗 Personal URL:** https://donationtransparency.org/meet-tem

## System Architecture

### Frontend
- **React Components:** Calendar interface built with React via CDN
- **Responsive Design:** Mobile-optimized booking experience
- **Timezone Support:** Automatic detection with manual override
- **Meeting Types:** 15/30/60 minute options with custom descriptions

### Backend
- **AWS Lambda:** Serverless function handling all booking operations
- **Google Calendar API:** Real-time availability checking and event creation
- **AWS SES:** Professional email confirmations and notifications
- **AWS Parameter Store:** Secure credential storage

### Key Features
- ✅ Real-time availability checking
- ✅ Automatic timezone detection and conversion
- ✅ Email confirmations for both attendee and organizer
- ✅ Google Calendar integration with event creation
- ✅ Admin panel for settings management
- ✅ Access control with invite codes
- ✅ Mobile-responsive design
- ✅ Professional branding and styling

## Technical Details

**Lambda Endpoint:** `https://l22j3krfkgy2k35ezzezqd3nzy0gosml.lambda-url.us-east-1.on.aws/`

**Google Calendar Integration:**
- OAuth2 authentication with refresh tokens
- Stored securely in AWS Parameter Store at `/booking/google-credentials`
- Automatic conflict checking and event creation

**Email System:**
- AWS SES integration for professional notifications
- Branded HTML templates for confirmations
- Admin notifications for every booking

## Admin Panel Features

The admin panel provides comprehensive control over the booking system:

### Profile Management
- Name, email, and bio customization
- Profile picture options (Google avatar or custom URL)
- Professional branding controls

### Availability Settings
- Working hours (start/end times)
- Timezone configuration
- Working days selection (Monday-Friday default)
- Buffer time between meetings
- Advance booking limits
- Minimum notice requirements

### Meeting Types
- Customizable meeting durations and descriptions
- Add/remove meeting types as needed
- Default types: Quick Chat (15min), Consultation (30min), Deep Dive (60min)

### Calendar Integration
- Real-time connection status
- Test calendar connectivity
- Reconnection tools if needed
- Last sync timestamp

### Access Control
- Booking page invite code management
- Direct booking URL generation
- Admin access key security

## File Structure

```
/booking/
├── index.html          # Main booking page
├── admin.html          # Admin panel
├── test.html           # Testing interface
├── meet-tem.html       # Personal redirect page
├── debug-test.html     # Debug utilities
└── assets/
    ├── booking.js      # Frontend booking logic
    ├── booking.css     # Styling and responsive design
    └── admin.js        # Admin panel functionality
```

## Security Features

- **Invite Code Protection:** Booking page requires `?invite=abc123`
- **Admin Access Control:** Admin panel requires `?key=admin2025`
- **Input Sanitization:** All user inputs validated and sanitized
- **Rate Limiting:** API endpoints protected against abuse
- **CORS Security:** Proper cross-origin request handling

## Deployment

The system is fully deployed and operational:
- ✅ Frontend hosted on AWS Amplify
- ✅ Lambda function deployed with Function URL
- ✅ Google Calendar OAuth configured
- ✅ AWS SES email notifications active
- ✅ All redirects configured in `_redirects` file

## Troubleshooting

**Admin Panel Access Issues:**
- Ensure using `?key=admin2025` not `?invite=abc123`
- Check browser console for JavaScript errors

**Booking Issues:**
- Verify Lambda endpoint is responding
- Check Google Calendar permissions
- Confirm AWS SES sending limits

**Calendar Sync:**
- Use admin panel "Test Calendar" button
- Check Parameter Store credentials
- Verify OAuth refresh token validity

## Support

For technical issues or modifications, reference the booking system code files or contact the development team.