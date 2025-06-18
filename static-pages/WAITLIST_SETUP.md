# Waitlist Setup Instructions

## Overview
This waitlist system captures visitor information when they click "Get Started" and provides a professional experience similar to what you see on other websites. Users receive a confirmation email and you get notified of new signups.

## Features
- Professional modal popup with form validation
- Captures: First Name, Last Name, Email, Organization Type
- Prevents duplicate signups
- Sends HTML confirmation email to users
- Sends notification email to admin
- Stores data in CSV file (easily exportable)
- Mobile-responsive design
- Professional messaging similar to other waitlist sites

## Email Setup
The system works like WordPress's wp-mail-ses plugin. You need to configure your email settings:

### Option 1: Use Default PHP Mail (Simplest)
- Works out of the box if your server supports PHP mail()
- May end up in spam folders
- Good for testing

### Option 2: Configure SMTP (Recommended)
Edit `config/email-config.php` and update the SMTP settings:
```php
'smtp' => [
    'host' => 'smtp.gmail.com',
    'username' => 'your-email@gmail.com',
    'password' => 'your-app-password',
    // ... other settings
],
```

### Option 3: Use AWS SES (Best for Production)
Similar to wp-mail-ses plugin:
1. Set up AWS SES account
2. Update config with your AWS credentials
3. Verify your domain/email addresses

## File Structure
```
static-pages/
├── api/
│   └── waitlist.php          # Handles form submissions
├── config/
│   └── email-config.php      # Email service configuration
├── templates/
│   └── waitlist_confirmation.html  # Email template
├── assets/js/
│   └── main.js               # Updated with modal functions
├── .htaccess                 # URL routing
├── waitlist_data.csv         # Generated: stores signups
└── WAITLIST_SETUP.md         # This file
```

## Testing
1. Open your website
2. Click any "Get Started" button
3. Fill out the form and submit
4. Check that:
   - Success modal appears
   - Confirmation email is sent
   - Admin notification email is sent
   - Data is saved to waitlist_data.csv

## Customization
- **Popup Message**: Edit the text in `index.html` in the modal sections
- **Email Template**: Modify `templates/waitlist_confirmation.html`
- **Styling**: Modal uses your existing Tailwind CSS classes
- **Data Storage**: Replace CSV with database in `api/waitlist.php`

## Professional Waitlist Messaging
The popup uses professional language like:
- "Join Our Early Access List"
- "We're putting the finishing touches on our platform"
- "Join our waitlist and we'll notify you the moment we're ready"
- "You're On The List!" (success message)

This creates the professional experience you see on other websites while maintaining your brand voice.

## Troubleshooting
- **Emails not sending**: Check PHP mail configuration or set up SMTP
- **Form not submitting**: Check browser console for JavaScript errors
- **Data not saving**: Check file permissions on the static-pages directory
- **Modal not appearing**: Ensure JavaScript is enabled and main.js is loading

## Next Steps
1. Test the waitlist system
2. Configure your preferred email service
3. Customize the messaging to match your brand
4. Monitor signups in waitlist_data.csv
5. Set up email campaigns for your waitlist members