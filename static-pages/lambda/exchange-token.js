/**
 * Exchange authorization code for refresh token
 */

const { google } = require('googleapis');

const CLIENT_ID = '1028988516834-pivbaorgjv8epmhfl5bmaoqrnj6a9k94.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:8080/auth/callback';

// Your authorization code
const AUTH_CODE = '4/0AVMBsJhDeslNDA9OQI7LiAyjYROOhWzliM13kq2C6RrEqFzft8fCDVzE4nxaheKKnggpxQ';

async function exchangeCodeForTokens() {
  try {
    console.log('🔄 Exchanging authorization code for tokens...');
    
    const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    const { tokens } = await oauth2Client.getToken(AUTH_CODE);
    
    console.log('\n✅ SUCCESS! Here are your credentials:');
    console.log('=====================================');
    console.log('REFRESH_TOKEN:', tokens.refresh_token);
    console.log('ACCESS_TOKEN:', tokens.access_token);
    
    console.log('\n📋 AWS SECRETS MANAGER JSON:');
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
    
    // Test the refresh token
    await testCalendarAccess(tokens.refresh_token);
    
  } catch (error) {
    console.error('\n❌ Error exchanging code for tokens:');
    console.error(error.message);
  }
}

async function testCalendarAccess(refreshToken) {
  try {
    console.log('\n🧪 Testing Calendar API access...');
    
    const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    oauth2Client.setCredentials({ refresh_token: refreshToken });
    
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const response = await calendar.calendars.get({ calendarId: 'primary' });
    
    console.log('✅ Calendar API test successful!');
    console.log('📅 Calendar name:', response.data.summary);
    console.log('🌍 Calendar timezone:', response.data.timeZone);
    
  } catch (error) {
    console.error('⚠️  Calendar API test failed:', error.message);
    console.log('Make sure Calendar API is enabled in Google Cloud Console');
  }
}

exchangeCodeForTokens();