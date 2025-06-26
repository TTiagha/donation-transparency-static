<?php
// Email Configuration
// Similar to wp-mail-ses plugin configuration

return [
    // Email Service Configuration
    'email_service' => 'smtp', // 'smtp', 'ses', 'sendgrid', 'mailgun', 'local'
    
    // SMTP Configuration (if using SMTP)
    'smtp' => [
        'host' => 'smtp.gmail.com', // or your SMTP server
        'port' => 587,
        'username' => '', // Your email username
        'password' => '', // Your email password or app password
        'encryption' => 'tls', // 'tls' or 'ssl'
        'auth' => true,
    ],
    
    // AWS SES Configuration (if using AWS SES)
    'ses' => [
        'region' => 'us-east-1',
        'access_key' => '', // Your AWS Access Key
        'secret_key' => '', // Your AWS Secret Key
        'from_email' => 'noreply@donationtransparency.com',
        'from_name' => 'Donation Transparency',
    ],
    
    // SendGrid Configuration (if using SendGrid)
    'sendgrid' => [
        'api_key' => '', // Your SendGrid API Key
        'from_email' => 'noreply@donationtransparency.com',
        'from_name' => 'Donation Transparency',
    ],
    
    // Mailgun Configuration (if using Mailgun)
    'mailgun' => [
        'domain' => '', // Your Mailgun domain
        'api_key' => '', // Your Mailgun API Key
        'from_email' => 'noreply@donationtransparency.com',
        'from_name' => 'Donation Transparency',
    ],
    
    // Default Email Settings
    'from_email' => 'noreply@donationtransparency.com',
    'from_name' => 'Donation Transparency',
    'admin_email' => 'support@donationtransparency.org',
    
    // Email Templates
    'templates' => [
        'waitlist_confirmation' => [
            'subject' => 'Welcome to the Donation Transparency Waitlist!',
            'template_file' => 'waitlist_confirmation.html',
        ],
        'admin_notification' => [
            'subject' => 'New Waitlist Signup - Donation Transparency',
            'template_file' => 'admin_notification.html',
        ],
    ],
];
?>