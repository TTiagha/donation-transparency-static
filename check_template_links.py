#!/usr/bin/env python3
"""
Check links in JavaScript template files (header.js and footer.js)
"""

import os
import re

BASE_DIR = "/mnt/c/shock/static-pages"

def check_template_links():
    """Check links in header.js and footer.js templates"""
    print("🔍 Checking template file links...")
    print("=" * 50)
    
    template_files = [
        "/assets/js/templates/header.js",
        "/assets/js/templates/footer.js"
    ]
    
    all_broken = []
    
    for template_file in template_files:
        full_path = BASE_DIR + template_file
        print(f"\n📄 Checking: {template_file}")
        
        if not os.path.exists(full_path):
            print(f"  ❌ Template file not found: {full_path}")
            continue
        
        try:
            with open(full_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extract href links from JavaScript template strings
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
                    match == '' or
                    match.startswith('${') or  # Template variables
                    match.startswith('${')):
                    continue
                
                # Check if file exists
                if match.startswith('/'):
                    # Absolute path
                    check_path = BASE_DIR + match
                else:
                    # Relative path - assume from root for templates
                    check_path = os.path.join(BASE_DIR, match)
                
                # Normalize path
                check_path = os.path.normpath(check_path)
                
                # Check existence
                exists = os.path.exists(check_path)
                if not exists and not check_path.endswith('.html'):
                    # Try with .html extension
                    exists = os.path.exists(check_path + '.html')
                
                if exists:
                    print(f"  ✅ OK: {match}")
                else:
                    print(f"  ❌ BROKEN: {match} → {check_path}")
                    all_broken.append({
                        'template': template_file,
                        'link': match,
                        'resolved': check_path
                    })
                    
            # Also check for template variable references that might be broken
            # Look for patterns like ${basePath}about.html
            template_pattern = r'\$\{basePath\}([^"\']+)'
            template_matches = re.findall(template_pattern, content)
            
            for match in template_matches:
                if match.endswith('.html'):
                    check_path = os.path.join(BASE_DIR, match)
                    check_path = os.path.normpath(check_path)
                    
                    if os.path.exists(check_path):
                        print(f"  ✅ OK (template): {match}")
                    else:
                        print(f"  ❌ BROKEN (template): {match} → {check_path}")
                        all_broken.append({
                            'template': template_file,
                            'link': f"${{basePath}}{match}",
                            'resolved': check_path
                        })
            
        except Exception as e:
            print(f"  ❌ Error reading template: {e}")
    
    return all_broken

if __name__ == "__main__":
    broken = check_template_links()
    if broken:
        print(f"\n❌ Found {len(broken)} broken template links")
        for item in broken:
            print(f"  {item['template']}: {item['link']}")
    else:
        print("\n✅ All template links are working")