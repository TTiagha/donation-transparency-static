#!/usr/bin/env python3
"""
Comprehensive link checker for the static site
Extracts all internal links and checks if target files exist
"""

import os
import re
import glob
from urllib.parse import urlparse, urljoin
from pathlib import Path

# Base directory for the static site
BASE_DIR = "/mnt/c/shock/static-pages"

def extract_links_from_file(file_path):
    """Extract all href links from an HTML file"""
    links = []
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Find all href attributes
        href_pattern = r'href=["\'](.*?)["\']'
        matches = re.findall(href_pattern, content)
        
        for match in matches:
            # Skip external links, mailto, tel, javascript, and fragments
            if (match.startswith('http://') or 
                match.startswith('https://') or 
                match.startswith('mailto:') or 
                match.startswith('tel:') or 
                match.startswith('javascript:') or 
                match.startswith('#') or
                match == ''):
                continue
                
            links.append(match)
    
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        
    return links

def resolve_link_path(link, source_file):
    """Resolve a relative link path to an absolute file path"""
    source_dir = os.path.dirname(source_file)
    
    # Handle relative links
    if link.startswith('./'):
        link = link[2:]
    elif link.startswith('../'):
        # Count how many directories to go up
        parts = link.split('/')
        up_count = 0
        remaining_parts = []
        
        for part in parts:
            if part == '..':
                up_count += 1
            else:
                remaining_parts.append(part)
        
        # Go up the required number of directories
        target_dir = source_dir
        for _ in range(up_count):
            target_dir = os.path.dirname(target_dir)
        
        # Join with remaining path
        link = '/'.join(remaining_parts)
        resolved_path = os.path.join(target_dir, link)
    else:
        # Absolute link within site
        if link.startswith('/'):
            resolved_path = os.path.join(BASE_DIR, link[1:])
        else:
            resolved_path = os.path.join(source_dir, link)
    
    return os.path.normpath(resolved_path)

def check_file_exists(file_path):
    """Check if a file exists, handling both with and without .html extension"""
    if os.path.exists(file_path):
        return True
    
    # If it doesn't exist, try adding .html extension
    if not file_path.endswith('.html'):
        html_path = file_path + '.html'
        if os.path.exists(html_path):
            return True
    
    # Try without .html extension
    if file_path.endswith('.html'):
        base_path = file_path[:-5]
        if os.path.exists(base_path):
            return True
    
    return False

def main():
    """Main function to check all links"""
    print("🔍 Checking all internal links across the static site...")
    print("=" * 60)
    
    # Get all HTML files
    html_files = glob.glob(os.path.join(BASE_DIR, "**/*.html"), recursive=True)
    
    total_links = 0
    broken_links = []
    all_links = []
    
    for html_file in html_files:
        relative_path = os.path.relpath(html_file, BASE_DIR)
        print(f"\n📄 Checking: {relative_path}")
        
        links = extract_links_from_file(html_file)
        
        for link in links:
            total_links += 1
            resolved_path = resolve_link_path(link, html_file)
            
            # Store link info
            link_info = {
                'source': relative_path,
                'link': link,
                'resolved_path': resolved_path,
                'exists': check_file_exists(resolved_path)
            }
            all_links.append(link_info)
            
            if not link_info['exists']:
                broken_links.append(link_info)
                print(f"  ❌ BROKEN: {link} → {resolved_path}")
            else:
                print(f"  ✅ OK: {link}")
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 LINK CHECK SUMMARY")
    print("=" * 60)
    print(f"Total links checked: {total_links}")
    print(f"Broken links found: {len(broken_links)}")
    print(f"Success rate: {((total_links - len(broken_links)) / total_links * 100):.1f}%")
    
    if broken_links:
        print("\n❌ BROKEN LINKS DETAILS:")
        print("-" * 40)
        for broken in broken_links:
            print(f"Source: {broken['source']}")
            print(f"Link: {broken['link']}")
            print(f"Resolved to: {broken['resolved_path']}")
            print()
    
    # Check specific areas mentioned in the request
    print("\n🎯 KEY AREAS ANALYSIS:")
    print("-" * 40)
    
    # Navigation links analysis
    nav_files = ['/index.html', '/transparency/index.html', '/guides/index.html']
    for nav_file in nav_files:
        full_path = BASE_DIR + nav_file
        if os.path.exists(full_path):
            nav_links = [link for link in all_links if link['source'] == nav_file.lstrip('/')]
            broken_nav = [link for link in nav_links if not link['exists']]
            print(f"{nav_file}: {len(nav_links)} links, {len(broken_nav)} broken")
    
    # Template links analysis
    template_files = ['/assets/js/templates/header.js', '/assets/js/templates/footer.js']
    for template_file in template_files:
        full_path = BASE_DIR + template_file
        if os.path.exists(full_path):
            print(f"\n📋 Checking template: {template_file}")
            # Would need to parse JS files for template links
    
    return len(broken_links) == 0

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)