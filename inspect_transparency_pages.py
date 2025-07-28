#!/usr/bin/env python3
"""Inspect transparency pages to get fresh status and encourage recrawl."""

import json
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# Load credentials
SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly']
SERVICE_ACCOUNT_FILE = 'makedotcom-422712-49bd5846f0b5.json'
SITE_URL = 'sc-domain:donationtransparency.org'

def inspect_transparency_pages():
    """Inspect transparency pages to get current status after our fixes."""
    # Authenticate
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    
    # Build the service
    service = build('searchconsole', 'v1', credentials=credentials)
    
    # URLs to inspect (after our SEO fixes)
    urls_to_inspect = [
        'https://donationtransparency.org/transparency/',
        'https://donationtransparency.org/transparency/power-of-openness.html',
        'https://donationtransparency.org/transparency/accountability-principles.html',
        'https://donationtransparency.org/transparency/trust-building.html'
    ]
    
    print("🔍 Inspecting transparency pages after SEO fixes:")
    print("=" * 60)
    
    for url in urls_to_inspect:
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
            
            print(f"\n📄 {url}")
            print(f"   Coverage: {coverage}")
            print(f"   Verdict: {verdict}")
            
            if 'lastCrawlTime' in index_status:
                print(f"   Last crawled: {index_status['lastCrawlTime']}")
            
            # Check for indexing issues
            if coverage == 'Crawled - currently not indexed':
                print(f"   ⚠️  Issue: Page crawled but not indexed")
                
            elif coverage == 'Submitted and indexed':
                print(f"   ✅ Status: Successfully indexed")
                
            # Check for any errors or warnings
            if 'crawlResult' in status:
                crawl_result = status['crawlResult']
                if 'error' in crawl_result:
                    print(f"   ❌ Crawl error: {crawl_result['error']}")
                    
        except HttpError as e:
            print(f"\n❌ Error inspecting {url}: {e}")
        except Exception as e:
            print(f"\n❌ Unexpected error for {url}: {e}")
    
    print(f"\n" + "=" * 60)
    print("📈 Next Steps:")
    print("1. Monitor these pages over the next 3-7 days")
    print("2. The title changes and new internal links should trigger fresh crawls")
    print("3. Run this script again to track improvements")
    print("4. Submit URLs manually in Search Console interface if needed")

if __name__ == '__main__':
    inspect_transparency_pages()