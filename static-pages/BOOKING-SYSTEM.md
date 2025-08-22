# Donation Transparency Booking System

A complete Calendly-style booking system integrated with Google Calendar, AWS Lambda, and professional email notifications.

## 🌟 Features

### Core Functionality
- **Real-time availability** - Syncs with Google Calendar to show only available time slots
- **Automatic scheduling** - Creates calendar events instantly upon booking
- **Email confirmations** - Professional branded emails sent to both client and admin
- **Timezone handling** - Detects user timezone with manual override option
- **Mobile responsive** - Works perfectly on all devices
- **Anti-spam protection** - Honeypot fields, rate limiting, and submission timing validation

### Meeting Options
- **Multiple durations**: 15, 30, or 60-minute meetings
- **Meeting types**: Consultation, Demo, Support, Custom
- **Location options**: 
  - Google Meet (auto-generated links)
  - Zoom (details sent separately)
  - Phone call
  - In-person (address provided)

### Security & Access Control
- **Invite code protection** - Requires `?invite=abc123` parameter
- **Rate limiting** - Prevents spam and abuse
- **Input validation** - Comprehensive server-side validation
- **CORS protection** - Secure cross-origin requests

## 🚀 Live URLs

### Public Booking Page
```
https://donationtransparency.org/booking/?invite=abc123
```

### Admin Dashboard
```
https://donationtransparency.org/booking/admin.html?invite=abc123
```

### Test Suite (Development)
```
https://donationtransparency.org/booking/test.html?invite=abc123
```

### Debug Test Page (Simplified)
```
https://donationtransparency.org/booking/debug-test.html
```

## 📋 How to Use

### For Clients (Booking a Meeting)
1. **Visit the booking page** with the invite code
2. **Select meeting type** (Consultation, Demo, etc.)
3. **Choose duration** (15, 30, or 60 minutes)
4. **Pick available time slot** - only open times from your calendar are shown
5. **Select location preference** (Google Meet, Zoom, Phone, In-person)
6. **Fill out contact information** (Name, Email, Phone optional)
7. **Add notes** if needed
8. **Submit booking**

### For Admin (You)
1. **Check calendar** - All bookings appear in your Google Calendar automatically
2. **Review emails** - Confirmation emails sent to `support@donationtransparency.org`
3. **Access admin dashboard** - View booking statistics and manage settings
4. **Test functionality** - Use test suite to verify system health

## 🔧 Technical Architecture

### Frontend Stack
- **React** (via CDN) - Component-based UI
- **Vanilla JavaScript** - Calendar logic and form handling
- **Modern CSS** - Responsive design with CSS Grid/Flexbox
- **Google Fonts** - Professional typography (Inter font)

### Backend Infrastructure
- **AWS Lambda** - Serverless function handling all booking logic
- **AWS Parameter Store** - Secure credential storage
- **AWS SES** - Professional email delivery
- **Google Calendar API v3** - Real-time calendar integration
- **Google OAuth 2.0** - Secure authentication

### Key Files Structure
```
/booking/
├── index.html              # Main booking page
├── admin.html              # Admin dashboard
├── test.html               # Test suite
├── debug-test.html         # Simple debug page
├── assets/
│   ├── booking.css         # Main stylesheet
│   ├── booking.js          # Frontend JavaScript
│   └── admin.js            # Admin dashboard logic
└── /lambda/
    ├── booking-handler.js  # Main Lambda function
    ├── package.json        # Dependencies
    └── deploy-booking.sh   # Deployment script
```

## ⚙️ Admin Dashboard Features

Access at: `https://donationtransparency.org/booking/admin.html?invite=abc123`

### Current Capabilities
- **System health monitoring** - Check Lambda function status
- **Configuration management** - Update booking settings
- **Basic analytics** - View booking success rates
- **Test functions** - Verify Google Calendar and email integration

### Available Actions
- **Update working hours** - Modify availability schedule
- **Change timezone settings** - Adjust default timezone
- **Test email delivery** - Verify SES configuration
- **Check calendar sync** - Ensure Google Calendar connection
- **View recent bookings** - Monitor booking activity

## 🔐 Security Features

### Access Control
- **Invite-only access** - Requires specific URL parameter
- **Rate limiting** - Prevents abuse (10 requests/hour general, 5 bookings/hour)
- **CORS protection** - Only allows requests from donationtransparency.org
- **Input sanitization** - Prevents XSS and injection attacks

### Anti-Spam Measures
- **Honeypot fields** - Hidden form fields to catch bots
- **Timing validation** - Rejects forms submitted too quickly
- **Email validation** - Server-side email format verification
- **Duplicate prevention** - Prevents multiple identical bookings

## 🛠️ Configuration

### Environment Variables (Lambda)
- `REGION` - AWS region (us-east-1)
- `ADMIN_EMAIL` - Admin notification email (support@donationtransparency.org)

### Parameter Store Values
- `/booking/google/client_id` - Google OAuth client ID
- `/booking/google/client_secret` - Google OAuth client secret
- `/booking/google/refresh_token` - Google API refresh token

### Working Hours & Availability
- **Default timezone**: America/Los_Angeles
- **Working days**: Monday-Friday
- **Working hours**: 9:00 AM - 5:00 PM
- **Buffer time**: 15 minutes between meetings
- **Advance booking**: Up to 14 days
- **Minimum notice**: 24 hours

## 📧 Email Templates

### Client Confirmation Email
- **Professional branding** with Donation Transparency logo
- **Meeting details** (date, time, duration, location)
- **Calendar attachment** (.ics file for easy calendar import)
- **Contact information** for questions or changes
- **Meeting preparation instructions**

### Admin Notification Email
- **New booking alert** with all client details
- **Meeting information** (type, duration, notes)
- **Client contact information**
- **Quick action links** (if needed for future features)

## 🔄 Maintenance

### Regular Tasks
- **Monitor CloudWatch logs** for errors or issues
- **Check SES sending statistics** to ensure email delivery
- **Verify Google Calendar sync** is working properly
- **Update OAuth tokens** if they expire (typically 6 months)

### Monthly Health Checks
- **Test all booking flows** using the test suite
- **Verify email delivery** to different providers
- **Check mobile responsiveness** on various devices
- **Monitor booking completion rates**

### Troubleshooting Resources
- **Test suite**: Comprehensive function testing
- **CloudWatch logs**: Detailed error tracking
- **Parameter Store**: Credential verification
- **Lambda metrics**: Performance monitoring

## 🚀 Future Enhancements

### Potential Improvements
- **Payment integration** - Stripe/PayPal for paid consultations
- **Automated reminders** - Email/SMS reminders before meetings
- **Meeting templates** - Pre-configured meeting types with custom durations
- **Advanced analytics** - Detailed booking reports and trends
- **Team scheduling** - Multiple staff member availability
- **Custom availability** - Per-day schedule overrides
- **Video conferencing** - Direct integration with Zoom/Google Meet
- **Client portal** - Dashboard for clients to manage their bookings

### Technical Improvements
- **Database integration** - Store booking history in DynamoDB
- **Caching layer** - Redis for improved performance
- **CDN optimization** - CloudFront for faster page loads
- **Mobile app** - React Native booking application
- **API documentation** - OpenAPI/Swagger documentation
- **Monitoring alerts** - Automated error notifications

---

## 📞 Support

For technical issues or questions about the booking system:

- **Email**: support@donationtransparency.org
- **Test Suite**: Use the built-in diagnostics at `/booking/test.html?invite=abc123`
- **Admin Dashboard**: Monitor system health at `/booking/admin.html?invite=abc123`

---

*This booking system was built with Claude Code and represents a complete, production-ready scheduling solution for Donation Transparency's client meetings and consultations.*