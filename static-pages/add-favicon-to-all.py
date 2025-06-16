#!/usr/bin/env python3
import os
import re

# Favicon HTML to insert
favicon_html = '''    <!-- Favicon -->
    <link rel="icon" type="image/png" href="../assets/images/logo-final.png">
    <link rel="shortcut icon" type="image/png" href="../assets/images/logo-final.png">
    <link rel="apple-touch-icon" href="../assets/images/logo-final.png">
    '''

# For root level files, use different path
favicon_html_root = '''    <!-- Favicon -->
    <link rel="icon" type="image/png" href="assets/images/logo-final.png">
    <link rel="shortcut icon" type="image/png" href="assets/images/logo-final.png">
    <link rel="apple-touch-icon" href="assets/images/logo-final.png">
    '''

# Find all HTML files
for root, dirs, files in os.walk('.'):
    for file in files:
        if file.endswith('.html') and file != 'favicon.html':
            filepath = os.path.join(root, file)
            
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Skip if favicon already exists
                if 'rel="icon"' in content:
                    print(f"Skipping {filepath} - favicon already exists")
                    continue
                
                # Determine if this is a root file or subfolder file
                is_root_file = '/' not in filepath.replace('./', '')
                favicon_to_insert = favicon_html_root if is_root_file else favicon_html
                
                # Find where to insert favicon (after stylesheet links, before schema markup)
                patterns_to_try = [
                    r'(\s*<link rel="stylesheet"[^>]*>\s*)\n',
                    r'(\s*<link[^>]*stylesheet[^>]*>\s*)\n',
                    r'(\s*</head>)',
                ]
                
                updated = False
                for pattern in patterns_to_try:
                    if re.search(pattern, content):
                        # Insert favicon after the match
                        new_content = re.sub(pattern, r'\1\n' + favicon_to_insert + '\n', content, count=1)
                        if new_content != content:
                            with open(filepath, 'w', encoding='utf-8') as f:
                                f.write(new_content)
                            print(f"Updated {filepath}")
                            updated = True
                            break
                
                if not updated:
                    print(f"Could not update {filepath} - no suitable insertion point found")
                    
            except Exception as e:
                print(f"Error processing {filepath}: {e}")

print("Favicon update complete!")