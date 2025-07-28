#!/usr/bin/env python3
"""Get URLs with noindex tags from Google Search Console."""

import json
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import sys

# Load credentials
SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly']
SERVICE_ACCOUNT_FILE = 'makedotcom-422712-49bd5846f0b5.json'

def get_noindex_urls():
    """Try to get URLs with noindex tags."""
    # Authenticate
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    
    # Build the service
    service = build('searchconsole', 'v1', credentials=credentials)
    
    sites = [
        'sc-domain:donationtransparency.org',
        'sc-domain:app.donationtransparency.org'
    ]
    
    for site_url in sites:
        print(f"\nChecking {site_url} for noindex URLs...")
        
        try:
            # Try URL inspection for known problematic URLs
            test_urls = [
                'https://donationtransparency.org/api/',
                'https://donationtransparency.org/templates/',
                'https://donationtransparency.org/config/',
                'https://donationtransparency.org/lambda/',
                'https://donationtransparency.org/index2.html',
                'https://donationtransparency.org/favicon.html',
                'https://donationtransparency.org/404.html'
            ]
            
            for url in test_urls:
                try:
                    result = service.urlInspection().index().inspect(
                        body={
                            'inspectionUrl': url,
                            'siteUrl': site_url
                        }
                    ).execute()
                    
                    status = result.get('inspectionResult', {})
                    index_status = status.get('indexStatusResult', {})
                    
                    # Check for noindex
                    robots_txt = index_status.get('robotsTxtState', '')
                    page_fetch = index_status.get('pageFetchState', {})
                    
                    print(f"\n{url}:")
                    print(f"  Coverage: {index_status.get('coverageState', 'UNKNOWN')}")
                    print(f"  Verdict: {index_status.get('verdict', 'UNKNOWN')}")
                    
                    # Look for reasons
                    if 'indexingState' in index_status:
                        state = index_status['indexingState']
                        if state == 'INDEXING_ALLOWED_BUT_NOT_INDEXED':
                            reasons = index_status.get('indexingNotAllowedReasons', [])
                            if reasons:
                                print(f"  Reasons: {reasons}")
                                
                except HttpError as e:
                    if '404' in str(e):
                        print(f"  Status: Not found (404)")
                    else:
                        print(f"  Error: {e}")
                except Exception as e:
                    print(f"  Error: {e}")
                    
        except Exception as e:
            print(f"Error checking {site_url}: {e}")

if __name__ == '__main__':
    get_noindex_urls()
    print("\n💡 Note: The Search Console API doesn't provide a direct way to list all noindex URLs.")
    print("📋 You'll need to export from the web interface:")
    print("   1. Go to Search Console")
    print("   2. Index > Coverage")  
    print("   3. Click 'Excluded by noindex tag'")
    print("   4. Export the list")