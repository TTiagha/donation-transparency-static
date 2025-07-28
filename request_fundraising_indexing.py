#!/usr/bin/env python3
"""Request manual indexing for the optimized fundraising guide."""

import json
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# Load credentials - needs indexing scope, not just webmasters
SCOPES = ['https://www.googleapis.com/auth/indexing']
SERVICE_ACCOUNT_FILE = 'makedotcom-422712-49bd5846f0b5.json'

def request_indexing():
    """Request manual indexing for the fundraising guide."""
    try:
        # Authenticate
        credentials = service_account.Credentials.from_service_account_file(
            SERVICE_ACCOUNT_FILE, scopes=SCOPES)
        
        # Build the service
        service = build('indexing', 'v3', credentials=credentials)
        
        # The optimized fundraising guide URL
        url = 'https://donationtransparency.org/guides/complete-fundraising-starter.html'
        
        print(f"Requesting indexing for optimized fundraising guide...\n")
        
        request_body = {
            'url': url,
            'type': 'URL_UPDATED'
        }
        
        response = service.urlNotifications().publish(body=request_body).execute()
        print(f"✅ Indexing requested for: {url}")
        print(f"   Response: {response.get('urlNotificationMetadata', {}).get('url', 'Success')}")
        
    except HttpError as e:
        if "insufficient authentication scopes" in str(e):
            print(f"❌ Authentication scope error: {e}")
            print("💡 The service account needs 'indexing' scope permissions in Google Cloud Console")
        else:
            print(f"❌ HTTP Error: {e}")
    except FileNotFoundError:
        print("❌ Service account credentials file not found")
        print("💡 Make sure makedotcom-422712-49bd5846f0b5.json is in the current directory")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

if __name__ == '__main__':
    request_indexing()
    print("\n🔄 If successful, Google will process the indexing request within 24-48 hours.")
    print("💡 You can also manually submit via Search Console URL Inspection tool")