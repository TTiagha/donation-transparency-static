/**
 * Google OAuth2 Refresh Token Generator
 * Run this script to get the refresh token needed for the booking system
 */

const { google } = require('googleapis');
const http = require('http');
const url = require('url');

// Replace these with your actual credentials from Google Cloud Console
const CLIENT_ID = '1028988516834-pivbaorgjv8epmhfl5bmaoqrnj6a9k94.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:8080/auth/callback';

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const scopes = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/userinfo.profile'
];

/**
 * Step 1: Generate authorization URL
 */
function generateAuthUrl() {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent' // Forces refresh token generation
  });

  console.log('\n🔐 GOOGLE OAUTH SETUP - STEP 1');
  console.log('=====================================');
  console.log('1. Visit this URL in your browser:');
  console.log('\n' + authUrl);
  console.log('\n2. Sign in with your Google account (the one that owns the calendar)');
  console.log('3. Grant permissions to the booking system');
  console.log('4. You\'ll be redirected to localhost:8080 (which will show an error - that\'s normal)');
  console.log('5. Copy the "code" parameter from the URL in your browser');
  console.log('6. Come back here and paste it when prompted\n');
  
  return authUrl;
}

/**
 * Step 2: Exchange authorization code for tokens
 */
async function exchangeCodeForTokens(code) {
  try {
    console.log('\n🔄 Exchanging authorization code for tokens...');
    
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    
    console.log('\n✅ SUCCESS! Here are your credentials:');
    console.log('=====================================');
    console.log('CLIENT_ID:', CLIENT_ID);
    console.log('CLIENT_SECRET:', CLIENT_SECRET);
    console.log('REFRESH_TOKEN:', tokens.refresh_token);
    console.log('ACCESS_TOKEN:', tokens.access_token);
    console.log('EXPIRES_IN:', tokens.expiry_date);
    
    console.log('\n📋 AWS SECRETS MANAGER FORMAT:');
    console.log('=====================================');
    const secretValue = {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: tokens.refresh_token,
      redirect_uris: [REDIRECT_URI, 'https://donationtransparency.org/booking/auth/callback']
    };
    
    console.log(JSON.stringify(secretValue, null, 2));
    
    console.log('\n🎯 NEXT STEPS:');
    console.log('=====================================');
    console.log('1. Copy the JSON above');
    console.log('2. Go to AWS Secrets Manager in us-east-1 region'); 
    console.log('3. Create a new secret with name: booking/google-credentials');
    console.log('4. Paste the JSON as the secret value');
    console.log('5. Deploy your Lambda function');
    
    // Test the refresh token
    await testRefreshToken(tokens.refresh_token);
    
  } catch (error) {
    console.error('\n❌ Error exchanging code for tokens:');
    console.error(error.message);
    console.log('\nTry running the script again and make sure:');
    console.log('- You copied the full authorization code');
    console.log('- Your CLIENT_ID and CLIENT_SECRET are correct');
    console.log('- You added your Gmail account as a test user in Google Cloud Console');
  }
}

/**
 * Test the refresh token by making a Calendar API call
 */
async function testRefreshToken(refreshToken) {
  try {
    console.log('\n🧪 Testing Calendar API access...');
    
    const testClient = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    testClient.setCredentials({ refresh_token: refreshToken });
    
    const calendar = google.calendar({ version: 'v3', auth: testClient });
    const response = await calendar.calendars.get({ calendarId: 'primary' });
    
    console.log('✅ Calendar API test successful!');
    console.log('Calendar name:', response.data.summary);
    console.log('Calendar timezone:', response.data.timeZone);
    
  } catch (error) {
    console.error('⚠️  Calendar API test failed:', error.message);
    console.log('This might be normal if Calendar API isn\'t enabled yet.');
  }
}

/**
 * Create a simple HTTP server to catch the redirect
 */
function startLocalServer() {
  const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    
    if (parsedUrl.pathname === '/auth/callback') {
      const code = parsedUrl.query.code;
      const error = parsedUrl.query.error;
      
      if (error) {
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.end(`
          <html>
            <body>
              <h1>❌ Authorization Error</h1>
              <p>Error: ${error}</p>
              <p>Go back to your terminal to try again.</p>
            </body>
          </html>
        `);
        console.log('\n❌ Authorization error:', error);
        return;
      }
      
      if (code) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          <html>
            <body>
              <h1>✅ Authorization Successful!</h1>
              <p>Authorization code received. Go back to your terminal.</p>
              <p>You can close this browser tab.</p>
            </body>
          </html>
        `);
        
        console.log('\n✅ Authorization code received!');
        server.close();
        exchangeCodeForTokens(code);
        return;
      }
    }
    
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 - Not Found</h1>');
  });
  
  server.listen(8080, () => {
    console.log('\n🌐 Local server started on http://localhost:8080');
    console.log('Waiting for authorization callback...');
  });
  
  return server;
}

/**
 * Interactive mode - prompt for credentials and run OAuth flow
 */
function runInteractiveSetup() {
  console.log('\n🚀 GOOGLE CALENDAR OAUTH SETUP');
  console.log('=====================================');
  
  if (CLIENT_ID === 'YOUR_CLIENT_ID_HERE.apps.googleusercontent.com' || 
      CLIENT_SECRET === 'YOUR_CLIENT_SECRET_HERE') {
    console.log('❌ Please update the CLIENT_ID and CLIENT_SECRET at the top of this file first!');
    console.log('\nGet these from:');
    console.log('1. Go to https://console.cloud.google.com/');
    console.log('2. APIs & Services > Credentials');
    console.log('3. Find your OAuth 2.0 Client ID');
    console.log('4. Copy the Client ID and Client Secret');
    console.log('5. Replace the values at the top of get-refresh-token.js');
    console.log('6. Run this script again');
    return;
  }
  
  console.log('✅ Credentials configured');
  console.log('🌐 Starting local server for OAuth callback...');
  
  const server = startLocalServer();
  
  setTimeout(() => {
    generateAuthUrl();
  }, 1000);
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n\n👋 Shutting down...');
    server.close();
    process.exit(0);
  });
}

// Run the interactive setup
if (require.main === module) {
  runInteractiveSetup();
}

module.exports = {
  generateAuthUrl,
  exchangeCodeForTokens
};