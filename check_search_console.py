#!/usr/bin/env python3
"""Check Google Search Console for indexed pages."""

import json
from google.oauth2 import service_account
from googleapiclient.discovery import build
from datetime import datetime, timedelta

# Load credentials
SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly']
SERVICE_ACCOUNT_FILE = 'makedotcom-422712-49bd5846f0b5.json'
SITE_URL = 'sc-domain:donationtransparency.org'

def get_search_console_data():
    """Get Search Console data for the site."""
    # Authenticate
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    
    # Build the service
    service = build('searchconsole', 'v1', credentials=credentials)
    
    # Get URL inspection data for homepage
    print("Checking indexing status...\n")
    
    # First, let's verify site ownership
    try:
        sites = service.sites().list().execute()
        print("Verified sites:")
        if 'siteEntry' in sites:
            for site in sites['siteEntry']:
                print(f"  - {site['siteUrl']}")
        print()
    except Exception as e:
        print(f"Error listing sites: {e}")
    
    # Get search analytics data
    try:
        # Date range for last 7 days
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=7)
        
        request = {
            'startDate': start_date.strftime('%Y-%m-%d'),
            'endDate': end_date.strftime('%Y-%m-%d'),
            'dimensions': ['page'],
            'dimensionFilterGroups': [{
                'filters': [{
                    'dimension': 'page',
                    'operator': 'contains',
                    'expression': 'donationtransparency.org'
                }]
            }],
            'rowLimit': 100
        }
        
        response = service.searchanalytics().query(
            siteUrl=SITE_URL, body=request).execute()
        
        if 'rows' in response:
            print(f"Indexed pages with impressions in the last 7 days:")
            print(f"{'Page':<80} {'Clicks':<10} {'Impressions':<12} {'CTR':<8} {'Position'}")
            print("-" * 120)
            
            for row in response['rows']:
                page = row['keys'][0]
                # Shorten URL for display
                display_page = page.replace('https://donationtransparency.org', '')
                if len(display_page) > 75:
                    display_page = display_page[:72] + '...'
                
                clicks = row.get('clicks', 0)
                impressions = row.get('impressions', 0)
                ctr = row.get('ctr', 0)
                position = row.get('position', 0)
                
                print(f"{display_page:<80} {clicks:<10} {impressions:<12} {ctr:<8.2%} {position:.1f}")
        else:
            print("No indexed pages found with impressions in the last 7 days.")
            
    except Exception as e:
        print(f"Error getting search analytics: {e}")
    
    # Try to get URL inspection data for key pages
    print("\n\nURL Inspection for key pages:")
    key_pages = [
        'https://donationtransparency.org/',
        'https://donationtransparency.org/features/',
        'https://donationtransparency.org/transparency/',
        'https://donationtransparency.org/guides/',
        'https://donationtransparency.org/about.html'
    ]
    
    for url in key_pages:
        try:
            result = service.urlInspection().index().inspect(
                body={
                    'inspectionUrl': url,
                    'siteUrl': SITE_URL
                }
            ).execute()
            
            status = result.get('inspectionResult', {})
            index_status = status.get('indexStatusResult', {})
            coverage = index_status.get('coverageState', 'UNKNOWN')
            verdict = index_status.get('verdict', 'UNKNOWN')
            
            print(f"\n{url}")
            print(f"  Coverage: {coverage}")
            print(f"  Verdict: {verdict}")
            
            if 'lastCrawlTime' in index_status:
                print(f"  Last crawled: {index_status['lastCrawlTime']}")
                
        except Exception as e:
            print(f"\n{url}")
            print(f"  Error: {e}")

if __name__ == '__main__':
    get_search_console_data()