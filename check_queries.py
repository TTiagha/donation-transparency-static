#!/usr/bin/env python3
"""Check Google Search Console for search queries and their performance."""

import json
from google.oauth2 import service_account
from googleapiclient.discovery import build
from datetime import datetime, timedelta

# Load credentials
SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly']
SERVICE_ACCOUNT_FILE = 'makedotcom-422712-49bd5846f0b5.json'
SITE_URL = 'sc-domain:donationtransparency.org'

def get_search_queries():
    """Get search query data from Search Console."""
    # Authenticate
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    
    # Build the service
    service = build('searchconsole', 'v1', credentials=credentials)
    
    print("Fetching search query data...\n")
    
    # Get search analytics data by query
    try:
        # Date range for last 28 days (more data)
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=28)
        
        # First, get overall query performance
        request = {
            'startDate': start_date.strftime('%Y-%m-%d'),
            'endDate': end_date.strftime('%Y-%m-%d'),
            'dimensions': ['query'],
            'rowLimit': 100,
            'startRow': 0
        }
        
        response = service.searchanalytics().query(
            siteUrl=SITE_URL, body=request).execute()
        
        if 'rows' in response:
            print(f"Top search queries (last 28 days):")
            print(f"{'Query':<60} {'Clicks':<8} {'Impr':<8} {'CTR':<8} {'Pos'}")
            print("-" * 90)
            
            for row in response['rows']:
                query = row['keys'][0]
                if len(query) > 55:
                    query = query[:52] + '...'
                
                clicks = row.get('clicks', 0)
                impressions = row.get('impressions', 0)
                ctr = row.get('ctr', 0)
                position = row.get('position', 0)
                
                print(f"{query:<60} {clicks:<8} {impressions:<8} {ctr:<8.1%} {position:.1f}")
        
        # Now get query + page combinations for top pages
        print("\n\nQuery breakdown for top pages:")
        
        top_pages = [
            'https://donationtransparency.org/',
            'https://donationtransparency.org/guides/complete-fundraising-starter.html',
            'https://donationtransparency.org/transparency/index.html',
            'https://donationtransparency.org/guides/community-local-fundraising.html'
        ]
        
        for page in top_pages:
            print(f"\n{page.replace('https://donationtransparency.org', '')}:")
            
            request = {
                'startDate': start_date.strftime('%Y-%m-%d'),
                'endDate': end_date.strftime('%Y-%m-%d'),
                'dimensions': ['query'],
                'dimensionFilterGroups': [{
                    'filters': [{
                        'dimension': 'page',
                        'operator': 'equals',
                        'expression': page
                    }]
                }],
                'rowLimit': 10
            }
            
            response = service.searchanalytics().query(
                siteUrl=SITE_URL, body=request).execute()
            
            if 'rows' in response:
                for row in response['rows']:
                    query = row['keys'][0]
                    if len(query) > 45:
                        query = query[:42] + '...'
                    impressions = row.get('impressions', 0)
                    position = row.get('position', 0)
                    clicks = row.get('clicks', 0)
                    
                    print(f"  {query:<50} Impr: {impressions:<6} Pos: {position:<6.1f} Clicks: {clicks}")
            else:
                print("  No query data available")
                
    except Exception as e:
        print(f"Error getting search analytics: {e}")

if __name__ == '__main__':
    get_search_queries()