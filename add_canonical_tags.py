#!/usr/bin/env python3
"""Add canonical tags to all HTML files to fix duplicate content issues."""

import os
import re

def add_canonical_tag(file_path, canonical_url):
    """Add canonical tag to HTML file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if canonical tag already exists
        if 'rel="canonical"' in content or "rel='canonical'" in content:
            print(f"  ⚠️  Canonical tag already exists in {file_path}")
            return False
        
        # Find the head section and add canonical tag
        head_pattern = r'(<head[^>]*>.*?)(</head>)'
        
        def replace_head(match):
            head_start = match.group(1)
            head_end = match.group(2)
            
            # Add canonical tag before closing head tag
            canonical_tag = f'    <link rel="canonical" href="{canonical_url}">\n    '
            return head_start + '\n' + canonical_tag + head_end
        
        new_content = re.sub(head_pattern, replace_head, content, flags=re.DOTALL | re.IGNORECASE)
        
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"  ✅ Added canonical tag to {file_path}")
            print(f"     Canonical URL: {canonical_url}")
            return True
        else:
            print(f"  ❌ Could not find head section in {file_path}")
            return False
            
    except Exception as e:
        print(f"  ❌ Error processing {file_path}: {e}")
        return False

def process_all_html_files():
    """Process all HTML files in static-pages directory."""
    static_dir = '/mnt/c/shock/static-pages'
    base_url = 'https://donationtransparency.org'
    
    files_processed = 0
    files_updated = 0
    
    print("🔧 Adding canonical tags to fix duplicate content issues...\n")
    
    for root, dirs, files in os.walk(static_dir):
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, static_dir)
                
                # Skip certain files
                if any(skip in rel_path.lower() for skip in ['index2', 'favicon', 'templates/', 'test']):
                    print(f"  ⏭️  Skipping {rel_path} (test/template file)")
                    continue
                
                files_processed += 1
                
                # Determine canonical URL
                if rel_path == 'index.html':
                    canonical_url = base_url + '/'
                elif rel_path.endswith('/index.html'):
                    # Directory index: /features/index.html -> /features/
                    dir_path = rel_path.replace('/index.html', '/')
                    canonical_url = base_url + '/' + dir_path
                else:
                    # Regular file: about.html -> /about.html
                    canonical_url = base_url + '/' + rel_path
                
                print(f"\nProcessing: {rel_path}")
                
                if add_canonical_tag(file_path, canonical_url):
                    files_updated += 1
    
    print(f"\n📊 SUMMARY:")
    print(f"Files processed: {files_processed}")
    print(f"Files updated: {files_updated}")
    print(f"Files skipped: {files_processed - files_updated}")
    
    print(f"\n✅ Canonical tags added! This should resolve the 30 duplicate content issues.")
    print(f"💡 Google will process these changes within 24-48 hours.")

if __name__ == "__main__":
    process_all_html_files()