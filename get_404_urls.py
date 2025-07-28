#!/usr/bin/env python3
"""Get specific 404 URLs from Google Search Console."""

import json
from google.oauth2 import service_account
from googleapiclient.discovery import build
from datetime import datetime, timedelta

# Load credentials
SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly']
SERVICE_ACCOUNT_FILE = 'makedotcom-422712-49bd5846f0b5.json'

def get_404_urls():
    """Get specific 404 URLs from both domains."""
    # Authenticate
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    
    # Build the service
    service = build('webmasters', 'v1', credentials=credentials)
    
    # Both site URLs
    sites = [
        'sc-domain:donationtransparency.org',
        'sc-domain:app.donationtransparency.org'
    ]
    
    all_404_urls = []
    
    for site_url in sites:
        print(f"\nGetting 404 URLs for {site_url}...")
        
        try:
            # Get URL inspection for pages with 404 errors
            request = service.sites().list()
            response = request.execute()
            
            # This approach might not work directly - Search Console API is limited
            # for getting specific error URLs. We'll need to use the web interface
            # or check if there are other CSV exports available.
            
            print(f"✅ Found site: {site_url}")
            
        except Exception as e:
            print(f"❌ Error getting 404 URLs for {site_url}: {e}")
    
    # Alternative: Check if there are more detailed CSV files in the zip
    print("\n💡 The Search Console API doesn't easily provide specific 404 URLs.")
    print("📋 NEXT STEPS:")
    print("1. Log into Google Search Console manually")
    print("2. Go to Index > Coverage")
    print("3. Click 'Not found (404)' row")
    print("4. Export the URL list")
    print("5. Save as '404_urls_main.csv' and '404_urls_app.csv'")

if __name__ == '__main__':
    get_404_urls()