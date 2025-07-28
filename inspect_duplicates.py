#!/usr/bin/env python3
"""Inspect pages for potential duplicate content issues."""

import os
import re
from collections import defaultdict

def get_title_and_description(file_path):
    """Extract title and meta description from HTML file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Extract title
        title_match = re.search(r'<title[^>]*>(.*?)</title>', content, re.IGNORECASE | re.DOTALL)
        title = title_match.group(1).strip() if title_match else "No title"
        
        # Extract meta description
        desc_match = re.search(r'<meta\s+name=["\']description["\']\s+content=["\']([^"\']*)["\']', content, re.IGNORECASE)
        description = desc_match.group(1).strip() if desc_match else "No description"
        
        # Get file size as rough content indicator
        size = len(content)
        
        return title, description, size
        
    except Exception as e:
        return f"Error: {e}", "", 0

def find_potential_duplicates():
    """Find potential duplicate content."""
    static_dir = '/mnt/c/shock/static-pages'
    
    files_info = {}
    titles = defaultdict(list)
    descriptions = defaultdict(list)
    
    # Walk through all HTML files
    for root, dirs, files in os.walk(static_dir):
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, static_dir)
                
                title, desc, size = get_title_and_description(file_path)
                
                files_info[rel_path] = {
                    'title': title,
                    'description': desc,
                    'size': size
                }
                
                # Group by title and description for duplicate detection
                titles[title].append(rel_path)
                descriptions[desc].append(rel_path)
    
    print("=== POTENTIAL DUPLICATE CONTENT ANALYSIS ===\n")
    
    print("1. DUPLICATE TITLES:")
    for title, paths in titles.items():
        if len(paths) > 1 and title != "No title":
            print(f"\nTitle: '{title}'")
            for path in paths:
                print(f"  - {path} ({files_info[path]['size']} chars)")
    
    print("\n2. DUPLICATE META DESCRIPTIONS:")
    for desc, paths in descriptions.items():
        if len(paths) > 1 and desc != "No description" and len(desc) > 20:
            print(f"\nDescription: '{desc[:100]}...'")
            for path in paths:
                print(f"  - {path}")
    
    print("\n3. SUSPICIOUS FILE PATTERNS:")
    suspicious = []
    for path in files_info.keys():
        if any(pattern in path.lower() for pattern in ['index2', 'backup', 'copy', 'old', 'test']):
            suspicious.append(path)
    
    for path in suspicious:
        print(f"  - {path} (potential test/backup file)")
    
    print(f"\n4. SUMMARY:")
    print(f"Total HTML files: {len(files_info)}")
    print(f"Suspicious files: {len(suspicious)}")
    
    return files_info

if __name__ == "__main__":
    find_potential_duplicates()