<?php
// Load environment variables
if (file_exists('../.env')) {
    $lines = file('../.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '=') !== false && substr($line, 0, 1) !== '#') {
            list($key, $value) = explode('=', $line, 2);
            $_ENV[trim($key)] = trim($value);
        }
    }
}

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

// Save to CSV file
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

// Load AWS SDK
require_once 'vendor/autoload.php';

use Aws\Ses\SesClient;
use Aws\Exception\AwsException;

// AWS SES Configuration
$sesClient = new SesClient([
    'version' => 'latest',
<<<<<<< HEAD
    'region' => 'us-east-1',
    'credentials' => [
        'key' => $_ENV['AWS_ACCESS_KEY_ID'] ?? '',
        'secret' => $_ENV['AWS_SECRET_ACCESS_KEY'] ?? '',
=======
    'region' => $_ENV['REGION'] ?? 'us-east-1',
    'credentials' => [
        'key' => $_ENV['ACCESS_KEY_ID'] ?? '',
        'secret' => $_ENV['SECRET_ACCESS_KEY'] ?? '',
>>>>>>> f799a233ae1023e5a288adf6e6e3705d89fe4026
    ]
]);

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

// AWS SES Email Function
function sendEmailViaSES($sesClient, $to, $subject, $htmlBody, $textBody = null) {
    try {
        $params = [
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
        
        if ($htmlBody) {
            $params['Message']['Body']['Html'] = [
                'Data' => $htmlBody,
                'Charset' => 'UTF-8'
            ];
        }
        
        if ($textBody) {
            $params['Message']['Body']['Text'] = [
                'Data' => $textBody,
                'Charset' => 'UTF-8'
            ];
        }
        
        $result = $sesClient->sendEmail($params);
        return true;
    } catch (AwsException $e) {
        error_log('AWS SES Error: ' . $e->getMessage());
        return false;
    }
}

// Prepare user confirmation email
$userSubject = 'You\'re In The Queue - Donation Transparency';
$userHtmlMessage = loadEmailTemplate('waitlist_confirmation.html', [
    'firstName' => $firstName,
    'lastName' => $lastName,
    'email' => $email,
    'organizationType' => $organizationType
]);

// Fallback plain text message
$userTextMessage = "Hi $firstName,

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

// Send notification email to admin
<<<<<<< HEAD
$adminEmail = 'admin@donationtransparency.com'; // Update this to your preferred email
=======
$adminEmail = $_ENV['ADMIN_EMAIL'] ?? 'support@donationtransparency.org';
>>>>>>> f799a233ae1023e5a288adf6e6e3705d89fe4026
$adminSubject = 'New Waitlist Signup - Donation Transparency';
$totalEntries = $fileExists ? count(file($csvFile)) - 1 : 1;
$adminMessage = "New waitlist signup:

Name: $firstName $lastName
Email: $email
Organization Type: $organizationType
Timestamp: " . date('Y-m-d H:i:s') . "

Total waitlist entries: $totalEntries

View all entries: /waitlist_data.csv";

// Send emails using AWS SES
$userEmailSent = sendEmailViaSES($sesClient, $email, $userSubject, $userHtmlMessage, $userTextMessage);
$adminEmailSent = sendEmailViaSES($sesClient, $adminEmail, $adminSubject, null, $adminMessage);

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