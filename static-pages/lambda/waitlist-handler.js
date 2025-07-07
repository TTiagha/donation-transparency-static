import { SES, SendEmailCommand } from '@aws-sdk/client-ses';

// Configure AWS SES
const ses = new SES({
    region: process.env.REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY
    }
});

export const handler = async (event, context) => {
    // CORS headers for Function URLs (only set if not already configured at Function level)
    const headers = {};

    try {
        // Parse request body
        const body = JSON.parse(event.body);
        const { firstName, lastName, email, organizationType, type, source, subject, message } = body;

        // Validate required fields
        if (!firstName || !lastName || !email || !organizationType) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'All fields are required' })
            };
        }

        // Determine email template based on request type
        const isDemoNotification = type === 'demo-notification';
        const isContactMessage = type === 'contact-message';
        
        // Email template for demo notifications
        const demoNotificationEmailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .highlight { background: #6EC1E4; color: white; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .steps { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Demo Notification Requested!</h1>
        </div>
        
        <p>Hi there,</p>
        
        <div class="highlight">
            <h3>📧 We'll keep you posted!</h3>
            <p>Thank you for your interest in our enhanced sample nonprofit profile demonstration.</p>
        </div>
        
        <p>We're working on creating an even more powerful interactive demo that will showcase radical transparency in action with real-time features, live transaction feeds, and transparent impact tracking.</p>
        
        <div class="steps">
            <h3>What to expect:</h3>
            <p>🔨 <strong>We're building</strong> - Enhanced demo with live features</p>
            <p>📧 <strong>We'll notify you</strong> - Email when the demo is ready</p>
            <p>🎯 <strong>First access</strong> - You'll be among the first to experience it</p>
            <p>📞 <strong>Personal demo available now</strong> - Don't want to wait? Schedule a live demo!</p>
        </div>
        
        <p>Can't wait for the enhanced demo? <a href="https://donationtransparency.org/contact.html" style="color: #6EC1E4; text-decoration: none;"><strong>Contact us for a personal demo right now</strong></a> and see our transparency platform in action today.</p>
        
        <p>Best regards,<br><strong>The Donation Transparency Team</strong></p>
        
        <p style="font-style: italic; color: #666;">P.S. The enhanced demo will be worth the wait, but a personal demo today might be even better!</p>
    </div>
</body>
</html>`;

        // Email template for waitlist signups
        const waitlistEmailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .highlight { background: #6EC1E4; color: white; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .steps { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>You're In The Queue!</h1>
        </div>
        
        <p>Hi ${firstName},</p>
        
        <div class="highlight">
            <h3>🎯 Your spot is reserved!</h3>
            <p>We've added you to our access queue. We're carefully rolling out invitations to ensure each user gets the personal attention they deserve.</p>
        </div>
        
        <p>We're granting access gradually to provide the best possible experience as you transform your fundraising with complete transparency.</p>
        
        <div class="steps">
            <h3>What happens next:</h3>
            <p>✅ <strong>You're in queue</strong> - Your position is secured in our access lineup</p>
            <p>👥 <strong>We're working through requests</strong> - Processing applications in the order received</p>
            <p>📞 <strong>Personal contact</strong> - We'll reach out directly when it's your turn</p>
            <p>🚀 <strong>Full access granted</strong> - Complete platform access with personal onboarding</p>
        </div>
        
        <p>Questions about your queue position? Just reply to this email - we're here to help!</p>
        
        <p>Best regards,<br><strong>The Donation Transparency Team</strong></p>
        
        <p style="font-style: italic; color: #666;">P.S. We'll contact you personally when it's your turn - no spam, just a direct invitation to join!</p>
    </div>
</body>
</html>`;

        // Email template for contact messages
        const contactMessageEmailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .highlight { background: #6EC1E4; color: white; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .steps { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Thank You for Contacting Us!</h1>
        </div>
        
        <p>Hi ${firstName},</p>
        
        <div class="highlight">
            <h3>📧 Message Received!</h3>
            <p>Thank you for reaching out to Donation Transparency. We've received your message and will get back to you soon.</p>
        </div>
        
        <p>Your message about "${subject || 'General Inquiry'}" is important to us, and our team will review it carefully. We typically respond within 24 hours during business days.</p>
        
        <div class="steps">
            <h3>What happens next:</h3>
            <p>📥 <strong>Message received</strong> - Your inquiry is in our system</p>
            <p>👀 <strong>Team review</strong> - We'll carefully read your message</p>
            <p>📞 <strong>Personal response</strong> - We'll get back to you directly</p>
            <p>🤝 <strong>Next steps</strong> - We'll help with your specific needs</p>
        </div>
        
        <p>In the meantime, feel free to explore our <a href="https://donationtransparency.org/features/" style="color: #6EC1E4; text-decoration: none;">transparency features</a> or learn more about <a href="https://donationtransparency.org/transparency/" style="color: #6EC1E4; text-decoration: none;">radical openness in fundraising</a>.</p>
        
        <p>Best regards,<br><strong>The Donation Transparency Team</strong></p>
        
        <p style="font-style: italic; color: #666;">P.S. If your message is urgent, feel free to reply to this email and we'll prioritize it!</p>
    </div>
</body>
</html>`;

        // Select appropriate template
        const userEmailHtml = isContactMessage ? contactMessageEmailHtml : 
                             isDemoNotification ? demoNotificationEmailHtml : 
                             waitlistEmailHtml;

        // Email subject and text content based on type
        const emailSubject = isContactMessage 
            ? "Thank You for Contacting Us - Donation Transparency"
            : isDemoNotification 
                ? "Demo Notification Requested - Donation Transparency"
                : "You're In The Queue - Donation Transparency";
                
        const textContent = isContactMessage 
            ? `Hi ${firstName},

Thank you for reaching out to Donation Transparency! We've received your message about "${subject || 'General Inquiry'}" and will get back to you soon.

We typically respond within 24 hours during business days. Your inquiry is important to us and our team will review it carefully.

Best regards,
The Donation Transparency Team`
            : isDemoNotification 
                ? `Hi there,

Thank you for your interest in our enhanced sample nonprofit profile demonstration!

We're working on creating an even more powerful interactive demo that will showcase radical transparency in action. You'll be among the first to know when it's ready.

Can't wait? Contact us for a personal demo: https://donationtransparency.org/contact.html

Best regards,
The Donation Transparency Team`
                : `Hi ${firstName},

Your spot is reserved! We've added you to our access queue.

We're carefully rolling out invitations to ensure each user gets the personal attention they deserve. We'll reach out directly when it's your turn.

Best regards,
The Donation Transparency Team`;

        // Email parameters for user confirmation
        const userEmailParams = {
            Source: 'support@donationtransparency.org',
            Destination: {
                ToAddresses: [email]
            },
            Message: {
                Subject: {
                    Data: emailSubject
                },
                Body: {
                    Html: {
                        Data: userEmailHtml
                    },
                    Text: {
                        Data: textContent
                    }
                }
            }
        };

        // Admin notification subject and content based on type
        const adminSubject = isContactMessage 
            ? 'New Contact Form Message - Donation Transparency'
            : isDemoNotification 
                ? 'New Demo Notification Request - Donation Transparency'
                : 'New Waitlist Signup - Donation Transparency';
                
        const adminContent = isContactMessage 
            ? `New contact form message:

Name: ${firstName} ${lastName}
Email: ${email}
Subject: ${subject || 'No subject'}
Source: ${source || 'contact-page'}
Timestamp: ${new Date().toISOString()}

Message:
${message || 'No message provided'}

Please respond to this inquiry promptly.`
            : isDemoNotification 
                ? `New demo notification request:

Email: ${email}
Request Type: Demo Notification
Source: ${source || 'sample-profile-page'}
Timestamp: ${new Date().toISOString()}

This person wants to be notified when the enhanced sample profile demo is ready.`
                : `New waitlist signup:

Name: ${firstName} ${lastName}
Email: ${email}
Organization Type: ${organizationType}
Source: ${source || 'homepage-waitlist'}
Timestamp: ${new Date().toISOString()}

Source: Donation Transparency Waitlist`;

        // Email parameters for admin notification
        const adminEmailParams = {
            Source: 'support@donationtransparency.org',
            Destination: {
                ToAddresses: [process.env.ADMIN_EMAIL || 'support@donationtransparency.org']
            },
            Message: {
                Subject: {
                    Data: adminSubject
                },
                Body: {
                    Text: {
                        Data: adminContent
                    }
                }
            }
        };

        // Send both emails
        await Promise.all([
            ses.send(new SendEmailCommand(userEmailParams)),
            ses.send(new SendEmailCommand(adminEmailParams))
        ]);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Successfully joined waitlist'
            })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Internal server error',
                message: error.message
            })
        };
    }
};