#!/usr/bin/env python3
"""Request manual indexing for transparency pages in Google Search Console."""

import json
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# Load credentials
SCOPES = ['https://www.googleapis.com/auth/webmasters']
SERVICE_ACCOUNT_FILE = 'makedotcom-422712-49bd5846f0b5.json'
SITE_URL = 'sc-domain:donationtransparency.org'

def request_indexing():
    """Request manual indexing for transparency pages."""
    # Authenticate
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    
    # Build the service
    service = build('indexing', 'v3', credentials=credentials)
    
    # URLs to request indexing for (after our fixes)
    urls_to_index = [
        'https://donationtransparency.org/transparency/',
        'https://donationtransparency.org/transparency/power-of-openness.html',
        'https://donationtransparency.org/transparency/accountability-principles.html',
        'https://donationtransparency.org/transparency/trust-building.html'
    ]
    
    print("Requesting indexing for transparency pages after SEO fixes...\n")
    
    for url in urls_to_index:
        try:
            request_body = {
                'url': url,
                'type': 'URL_UPDATED'
            }
            
            response = service.urlNotifications().publish(body=request_body).execute()
            print(f"✅ Indexing requested for: {url}")
            print(f"   Response: {response.get('urlNotificationMetadata', {}).get('url', 'Success')}")
            
        except HttpError as e:
            print(f"❌ Error requesting indexing for {url}: {e}")
        except Exception as e:
            print(f"❌ Unexpected error for {url}: {e}")
        
        print()

if __name__ == '__main__':
    request_indexing()
    print("🔄 Indexing requests submitted! Google will process these within 24-48 hours.")
    print("💡 Monitor status with: python3 check_search_console.py")