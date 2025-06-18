<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

// Sanitize input
$firstName = filter_var(trim($input['firstName'] ?? ''), FILTER_SANITIZE_STRING);
$lastName = filter_var(trim($input['lastName'] ?? ''), FILTER_SANITIZE_STRING);
$email = filter_var(trim($input['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$organizationType = filter_var(trim($input['organizationType'] ?? ''), FILTER_SANITIZE_STRING);

// Validate required fields
if (!$firstName || !$lastName || !$email || !$organizationType) {
    http_response_code(400);
    echo json_encode(['error' => 'All fields are required']);
    exit;
}

// Save to CSV file (you can replace this with database storage)
$csvFile = '../waitlist_data.csv';
$fileExists = file_exists($csvFile);

// Create CSV headers if file doesn't exist
if (!$fileExists) {
    $headers = ['Timestamp', 'First Name', 'Last Name', 'Email', 'Organization Type'];
    file_put_contents($csvFile, implode(',', $headers) . "\n");
}

// Check if email already exists
if ($fileExists) {
    $existingData = file_get_contents($csvFile);
    if (strpos($existingData, $email) !== false) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'You are already on our waitlist!',
            'alreadyExists' => true
        ]);
        exit;
    }
}

// Append new entry
$data = [
    date('Y-m-d H:i:s'),
    $firstName,
    $lastName,
    $email,
    $organizationType
];

$csvLine = '"' . implode('","', $data) . '"' . "\n";
file_put_contents($csvFile, $csvLine, FILE_APPEND | LOCK_EX);

// Load email template
function loadEmailTemplate($templateName, $variables = []) {
    $templatePath = "../templates/{$templateName}";
    if (!file_exists($templatePath)) {
        return false;
    }
    
    $template = file_get_contents($templatePath);
    
    // Replace variables in template
    foreach ($variables as $key => $value) {
        $template = str_replace("{{" . $key . "}}", $value, $template);
    }
    
    return $template;
}

// Prepare user confirmation email
$userSubject = 'You\'re In The Queue - Donation Transparency';
$userMessage = loadEmailTemplate('waitlist_confirmation.html', [
    'firstName' => $firstName,
    'lastName' => $lastName,
    'email' => $email,
    'organizationType' => $organizationType
]);

// Fallback to plain text if template fails
if (!$userMessage) {
    $userMessage = "Hi $firstName,

Your spot is reserved! We've added you to our access queue.

We're carefully rolling out invitations to ensure each user gets the personal attention they deserve. We're granting access gradually to provide the best possible experience as you transform your fundraising with complete transparency.

What happens next:
• You're in queue - Your position is secured in our access lineup
• We're working through requests - Processing applications in the order received  
• Personal contact - We'll reach out directly when it's your turn
• Full access granted - Complete platform access with personal onboarding

Questions about your queue position? Just reply to this email - we're here to help!

Best regards,
The Donation Transparency Team

P.S. We'll contact you personally when it's your turn - no spam, just a direct invitation to join!

---
Donation Transparency
Building trust through complete transparency
https://donationtransparency.org";
    $contentType = 'text/plain';
} else {
    $contentType = 'text/html';
}

// Send notification email to admin
$adminEmail = 'admin@donationtransparency.com';
$adminSubject = 'New Waitlist Signup - Donation Transparency';
$totalEntries = $fileExists ? count(file($csvFile)) - 1 : 1;
$adminMessage = "New waitlist signup:

Name: $firstName $lastName
Email: $email
Organization Type: $organizationType
Timestamp: " . date('Y-m-d H:i:s') . "

Total waitlist entries: $totalEntries

View all entries: /waitlist_data.csv";

// Email headers
$userHeaders = array(
    'From' => 'Donation Transparency <noreply@donationtransparency.com>',
    'Reply-To' => 'admin@donationtransparency.com',
    'Content-Type' => $contentType . '; charset=UTF-8',
    'X-Mailer' => 'PHP/' . phpversion()
);

$adminHeaders = array(
    'From' => 'Donation Transparency <noreply@donationtransparency.com>',
    'Reply-To' => 'admin@donationtransparency.com',
    'Content-Type' => 'text/plain; charset=UTF-8',
    'X-Mailer' => 'PHP/' . phpversion()
);

function arrayToHeaderString($headers) {
    $headerString = '';
    foreach ($headers as $key => $value) {
        $headerString .= "$key: $value\r\n";
    }
    return $headerString;
}

// AWS SES Email Function
function sendEmailViaSES($to, $subject, $message, $contentType) {
    global $awsConfig;
    
    // Prepare the email data
    $emailData = [
        'Source' => 'noreply@donationtransparency.com',
        'Destination' => [
            'ToAddresses' => [$to]
        ],
        'Message' => [
            'Subject' => [
                'Data' => $subject,
                'Charset' => 'UTF-8'
            ],
            'Body' => []
        ]
    ];
    
    // Set message content based on type
    if ($contentType === 'text/html') {
        $emailData['Message']['Body']['Html'] = [
            'Data' => $message,
            'Charset' => 'UTF-8'
        ];
    } else {
        $emailData['Message']['Body']['Text'] = [
            'Data' => $message,
            'Charset' => 'UTF-8'
        ];
    }
    
    // AWS SES API endpoint
    $endpoint = 'https://ses.' . $awsConfig['region'] . '.amazonaws.com/';
    
    // Create AWS signature
    $timestamp = gmdate('Ymd\THis\Z');
    $date = gmdate('Ymd');
    
    // Prepare the request
    $payload = json_encode([
        'Action' => 'SendEmail',
        'Version' => '2010-12-01',
        'Source' => $emailData['Source'],
        'Destination.ToAddresses.member.1' => $to,
        'Message.Subject.Data' => $subject,
        'Message.Subject.Charset' => 'UTF-8'
    ]);
    
    if ($contentType === 'text/html') {
        $payload = json_encode(array_merge(json_decode($payload, true), [
            'Message.Body.Html.Data' => $message,
            'Message.Body.Html.Charset' => 'UTF-8'
        ]));
    } else {
        $payload = json_encode(array_merge(json_decode($payload, true), [
            'Message.Body.Text.Data' => $message,
            'Message.Body.Text.Charset' => 'UTF-8'
        ]));
    }
    
    // For now, fall back to simple mail until we can set up proper AWS SDK
    // This will be replaced with proper SES API call
    $headers = array(
        'From' => 'Donation Transparency <noreply@donationtransparency.com>',
        'Reply-To' => 'admin@donationtransparency.com',
        'Content-Type' => $contentType . '; charset=UTF-8',
        'X-Mailer' => 'AWS SES via PHP'
    );
    
    $headerString = '';
    foreach ($headers as $key => $value) {
        $headerString .= "$key: $value\r\n";
    }
    
    // Use PHP mail as fallback (will be replaced with proper SES API)
    return mail($to, $subject, $message, $headerString);
}

// AWS SES Configuration
$awsConfig = [
    'region' => 'us-east-1',
    'version' => 'latest',
    'credentials' => [
        'key' => $_ENV['ACCESS_KEY_ID'] ?? '',
        'secret' => $_ENV['SECRET_ACCESS_KEY'] ?? '',
    ]
];

// Send emails using AWS SES
$userEmailSent = sendEmailViaSES($email, $userSubject, $userMessage, $contentType);
$adminEmailSent = sendEmailViaSES($adminEmail, $adminSubject, $adminMessage, 'text/plain');

// Log email results
error_log("Waitlist signup - User: $email, User email sent: " . ($userEmailSent ? 'Yes' : 'No') . ", Admin email sent: " . ($adminEmailSent ? 'Yes' : 'No'));

// Return success response
http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Successfully joined waitlist',
    'userEmailSent' => $userEmailSent,
    'adminEmailSent' => $adminEmailSent,
    'totalSignups' => $totalEntries
]);
?>