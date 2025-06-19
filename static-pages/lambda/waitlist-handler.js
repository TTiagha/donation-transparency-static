const AWS = require('aws-sdk');

// Configure AWS SES
const ses = new AWS.SES({
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
});

exports.handler = async (event, context) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // Handle OPTIONS preflight request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        // Parse request body
        const body = JSON.parse(event.body);
        const { firstName, lastName, email, organizationType } = body;

        // Validate required fields
        if (!firstName || !lastName || !email || !organizationType) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'All fields are required' })
            };
        }

        // Email template for user confirmation
        const userEmailHtml = `
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

        // Email parameters for user confirmation
        const userEmailParams = {
            Source: 'noreply@donationtransparency.com',
            Destination: {
                ToAddresses: [email]
            },
            Message: {
                Subject: {
                    Data: "You're In The Queue - Donation Transparency"
                },
                Body: {
                    Html: {
                        Data: userEmailHtml
                    },
                    Text: {
                        Data: `Hi ${firstName},

Your spot is reserved! We've added you to our access queue.

We're carefully rolling out invitations to ensure each user gets the personal attention they deserve. We'll reach out directly when it's your turn.

Best regards,
The Donation Transparency Team`
                    }
                }
            }
        };

        // Email parameters for admin notification
        const adminEmailParams = {
            Source: 'noreply@donationtransparency.com',
            Destination: {
                ToAddresses: [process.env.ADMIN_EMAIL || 'support@donationtransparency.org']
            },
            Message: {
                Subject: {
                    Data: 'New Waitlist Signup - Donation Transparency'
                },
                Body: {
                    Text: {
                        Data: `New waitlist signup:

Name: ${firstName} ${lastName}
Email: ${email}
Organization Type: ${organizationType}
Timestamp: ${new Date().toISOString()}

Source: Donation Transparency Waitlist`
                    }
                }
            }
        };

        // Send both emails
        await Promise.all([
            ses.sendEmail(userEmailParams).promise(),
            ses.sendEmail(adminEmailParams).promise()
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