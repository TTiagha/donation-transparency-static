#!/usr/bin/env python3
"""
Google Search Console Status Checker
Checks indexing status and submits sitemap for donationtransparency.org
"""

import os
import json
from google.oauth2 import service_account
from googleapiclient.discovery import build
from datetime import datetime, timedelta

# Service account configuration
SERVICE_ACCOUNT_FILE = '/mnt/c/shock/makedotcom-422712-49bd5846f0b5.json'
SCOPES = ['https://www.googleapis.com/auth/webmasters']
SITE_URL = 'sc-domain:donationtransparency.org'
SITEMAP_URL = 'https://donationtransparency.org/sitemap.xml'

def get_search_console_service():
    """Initialize Google Search Console API service"""
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    return build('webmasters', 'v3', credentials=credentials)

def check_sitemap_status(service):
    """Check if sitemap is submitted and its status"""
    print("📊 SITEMAP STATUS")
    print("=" * 50)
    try:
        sitemaps = service.sitemaps().list(siteUrl=SITE_URL).execute()
        
        if 'sitemap' not in sitemaps:
            print("❌ No sitemaps found. Need to submit sitemap.")
            return False
            
        for sitemap in sitemaps['sitemap']:
            if sitemap['path'] == SITEMAP_URL:
                print(f"✅ Sitemap found: {sitemap['path']}")
                print(f"   Last submitted: {sitemap.get('lastSubmitted', 'Unknown')}")
                print(f"   Status: {sitemap.get('isPending', 'Unknown')}")
                if 'contents' in sitemap:
                    for content in sitemap['contents']:
                        print(f"   - {content.get('type', 'Unknown')}: {content.get('submitted', 0)} submitted, {content.get('indexed', 0)} indexed")
                return True
                
        print("❌ Our sitemap not found in submitted sitemaps")
        return False
        
    except Exception as e:
        print(f"❌ Error checking sitemap status: {e}")
        return False

def submit_sitemap(service):
    """Submit the sitemap to Google Search Console"""
    print(f"\n📤 SUBMITTING SITEMAP")
    print("=" * 50)
    try:
        service.sitemaps().submit(siteUrl=SITE_URL, feedpath=SITEMAP_URL).execute()
        print(f"✅ Successfully submitted sitemap: {SITEMAP_URL}")
        return True
    except Exception as e:
        print(f"❌ Error submitting sitemap: {e}")
        return False

def get_coverage_data(service):
    """Get comprehensive coverage data from Search Console"""
    print(f"\n📊 COVERAGE STATUS")
    print("=" * 50)
    
    try:
        # Get coverage data
        request = service.sites().get(siteUrl=SITE_URL).execute()
        print(f"✅ Site verified: {SITE_URL}")
        
        # Get detailed search analytics for broader date range
        end_date = datetime.now().strftime('%Y-%m-%d')
        start_date = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
        
        request = {
            'startDate': start_date,
            'endDate': end_date,
            'dimensions': ['page'],
            'rowLimit': 100,
            'dimensionFilterGroups': []
        }
        
        result = service.searchanalytics().query(siteUrl=SITE_URL, body=request).execute()
        
        if 'rows' in result:
            total_pages = len(result['rows'])
            total_clicks = sum(row['clicks'] for row in result['rows'])
            total_impressions = sum(row['impressions'] for row in result['rows'])
            avg_ctr = (total_clicks / total_impressions * 100) if total_impressions > 0 else 0
            
            print(f"📈 PERFORMANCE SUMMARY (Last 30 days)")
            print(f"   Total indexed pages: {total_pages}")
            print(f"   Total clicks: {total_clicks}")
            print(f"   Total impressions: {total_impressions}")
            print(f"   Average CTR: {avg_ctr:.2f}%")
            
            # Show pages with performance
            print(f"\n📊 INDEXED PAGES WITH TRAFFIC:")
            for i, row in enumerate(result['rows'][:20], 1):
                page = row['keys'][0]
                clicks = row['clicks']
                impressions = row['impressions']
                position = row['position']
                print(f"{i:2d}. {page}")
                print(f"    Clicks: {clicks}, Impressions: {impressions}, Avg Pos: {position:.1f}")
                
        else:
            print("❌ No search performance data available")
            
        return result.get('rows', []) if 'rows' in result else []
            
    except Exception as e:
        print(f"❌ Error getting coverage data: {e}")
        return []

def check_search_performance(service):
    """Check recent search performance data"""
    print("\n📈 SEARCH PERFORMANCE (Last 7 days)")
    print("=" * 50)
    
    end_date = datetime.now().strftime('%Y-%m-%d')
    start_date = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
    
    try:
        request = {
            'startDate': start_date,
            'endDate': end_date,
            'dimensions': ['page'],
            'rowLimit': 10,
            'dimensionFilterGroups': []
        }
        
        result = service.searchanalytics().query(siteUrl=SITE_URL, body=request).execute()
        
        if 'rows' in result:
            print(f"📊 Top performing pages:")
            for i, row in enumerate(result['rows'][:10], 1):
                page = row['keys'][0]
                clicks = row['clicks']
                impressions = row['impressions']
                ctr = row['ctr'] * 100
                position = row['position']
                print(f"{i:2d}. {page}")
                print(f"    Clicks: {clicks}, Impressions: {impressions}, CTR: {ctr:.1f}%, Pos: {position:.1f}")
        else:
            print("❌ No search performance data available")
            
    except Exception as e:
        print(f"❌ Error fetching search performance: {e}")

def main():
    """Main function to run all checks and actions"""
    print("🔍 GOOGLE SEARCH CONSOLE STATUS CHECK")
    print("=" * 60)
    print(f"Site: {SITE_URL}")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    try:
        service = get_search_console_service()
        
        # Check and submit sitemap
        sitemap_exists = check_sitemap_status(service)
        if not sitemap_exists:
            submit_sitemap(service)
        
        # Get comprehensive coverage data
        indexed_pages = get_coverage_data(service)
        
        # Check search performance
        check_search_performance(service)
        
        print("\n✅ GOOGLE SEARCH CONSOLE ACTIONS COMPLETED")
        print("=" * 60)
        print("Next steps:")
        print("- Monitor indexing status over next 24-48 hours")
        print("- Check for improved search performance with canonical URLs")
        print("- Verify sitemap processing in Search Console dashboard")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("Make sure the service account credentials are valid and have Search Console access")

if __name__ == "__main__":
    main()