#!/usr/bin/env python3
"""
Homepage Query Analysis - Extract Non-Brand Queries for Title Optimization
"""

import os
import json
from datetime import datetime, timedelta
from google.oauth2 import service_account
from googleapiclient.discovery import build

# Configuration
SERVICE_ACCOUNT_FILE = '/mnt/c/shock/makedotcom-422712-49bd5846f0b5.json'
SITE_URL = 'sc-domain:donationtransparency.org'
HOMEPAGE_URL = 'https://donationtransparency.org/'

def create_service():
    """Create authenticated service object"""
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE,
        scopes=['https://www.googleapis.com/auth/webmasters.readonly']
    )
    return build('searchconsole', 'v1', credentials=credentials)

def get_homepage_queries(service):
    """Get query-level data specifically for homepage"""
    print("🔍 HOMEPAGE QUERY ANALYSIS")
    print("=" * 60)
    print(f"Analyzing queries for: {HOMEPAGE_URL}")
    
    # Get last 30 days of data
    end_date = datetime.now().strftime('%Y-%m-%d')
    start_date = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
    
    try:
        request = {
            'startDate': start_date,
            'endDate': end_date,
            'dimensions': ['query'],
            'rowLimit': 25,
            'dimensionFilterGroups': [{
                'filters': [{
                    'dimension': 'page',
                    'expression': HOMEPAGE_URL,
                    'operator': 'equals'
                }]
            }]
        }
        
        result = service.searchanalytics().query(siteUrl=SITE_URL, body=request).execute()
        
        if 'rows' in result:
            print(f"\n📊 HOMEPAGE QUERIES (Last 30 days):")
            print(f"Total queries analyzed: {len(result['rows'])}")
            print(f"Homepage URL: {HOMEPAGE_URL}")
            
            brand_queries = []
            non_brand_queries = []
            
            for i, row in enumerate(result['rows'][:25], 1):
                query = row['keys'][0]
                clicks = row['clicks']
                impressions = row['impressions']
                ctr = row['ctr'] * 100
                position = row['position']
                
                # Categorize brand vs non-brand queries
                is_brand = any(brand_term in query.lower() for brand_term in 
                             ['donation transparency', 'donationtransparency'])
                
                query_data = {
                    'query': query,
                    'clicks': clicks,
                    'impressions': impressions,
                    'ctr': ctr,
                    'position': position
                }
                
                if is_brand:
                    brand_queries.append(query_data)
                else:
                    non_brand_queries.append(query_data)
                
                print(f"{i:2d}. {query}")
                print(f"    Clicks: {clicks}, Impressions: {impressions}, CTR: {ctr:.1f}%, Pos: {position:.1f}")
                if is_brand:
                    print("    ✅ BRAND QUERY")
                else:
                    print("    🎯 NON-BRAND QUERY")
                print()
            
            # Summary Analysis
            print("\n🎯 QUERY ANALYSIS SUMMARY:")
            print("=" * 40)
            print(f"Total Brand Queries: {len(brand_queries)}")
            print(f"Total Non-Brand Queries: {len(non_brand_queries)}")
            
            if brand_queries:
                brand_impressions = sum(q['impressions'] for q in brand_queries)
                brand_clicks = sum(q['clicks'] for q in brand_queries)
                print(f"\nBrand Query Performance:")
                print(f"  Impressions: {brand_impressions}")
                print(f"  Clicks: {brand_clicks}")
                print(f"  CTR: {(brand_clicks/brand_impressions)*100:.1f}%" if brand_impressions > 0 else "  CTR: 0%")
            
            if non_brand_queries:
                non_brand_impressions = sum(q['impressions'] for q in non_brand_queries)
                non_brand_clicks = sum(q['clicks'] for q in non_brand_queries)
                print(f"\nNon-Brand Query Performance:")
                print(f"  Impressions: {non_brand_impressions}")
                print(f"  Clicks: {non_brand_clicks}")
                print(f"  CTR: {(non_brand_clicks/non_brand_impressions)*100:.1f}%" if non_brand_impressions > 0 else "  CTR: 0%")
                
                print(f"\n🚨 TOP NON-BRAND OPTIMIZATION OPPORTUNITIES:")
                for i, query in enumerate(non_brand_queries[:5], 1):
                    print(f"{i}. '{query['query']}' - {query['impressions']} impressions, pos {query['position']:.1f}")
            
            return {
                'brand_queries': brand_queries,
                'non_brand_queries': non_brand_queries,
                'total_queries': len(result['rows'])
            }
            
        else:
            print("❌ No query data available for homepage")
            return None
            
    except Exception as e:
        print(f"❌ Error getting homepage query data: {e}")
        return None

def main():
    """Main execution"""
    print("🔍 HOMEPAGE QUERY ANALYSIS FOR TITLE OPTIMIZATION")
    print("=" * 60)
    print(f"Target: {HOMEPAGE_URL}")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    try:
        service = create_service()
        query_data = get_homepage_queries(service)
        
        if query_data:
            print(f"\n✅ HOMEPAGE QUERY ANALYSIS COMPLETED")
            print("=" * 60)
            print("📋 Next Steps:")
            print("1. Focus title optimization on top non-brand queries")
            print("2. Consider query intent when crafting new title")
            print("3. Monitor CTR improvement over next 2-4 weeks")
            
            # Save results for reference
            with open('/mnt/c/shock/homepage_query_analysis.json', 'w') as f:
                json.dump(query_data, f, indent=2)
            print(f"📄 Results saved to: homepage_query_analysis.json")
        else:
            print("❌ Unable to complete analysis")
            
    except Exception as e:
        print(f"❌ Critical error: {e}")

if __name__ == "__main__":
    main()