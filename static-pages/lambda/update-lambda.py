#!/usr/bin/env python3
import zipfile
import boto3
import os

# Create a simple zip with just the essential files
files_to_include = [
    'booking-handler.js',
    'package.json'
]

print("Creating deployment package...")
with zipfile.ZipFile('booking-update.zip', 'w', zipfile.ZIP_DEFLATED) as zipf:
    for file in files_to_include:
        if os.path.exists(file):
            zipf.write(file)
            print(f"  Added: {file}")
    
    # Add node_modules (essential packages only)
    node_modules_essential = [
        'googleapis',
        '@aws-sdk', 
        'uuid',
        'ical-generator'
    ]
    
    for root, dirs, files in os.walk('node_modules'):
        # Only include essential packages
        if any(pkg in root for pkg in node_modules_essential):
            for file in files:
                file_path = os.path.join(root, file)
                zipf.write(file_path)

print("Updating Lambda function...")
try:
    lambda_client = boto3.client('lambda', region_name='us-east-1')
    
    with open('booking-update.zip', 'rb') as zip_file:
        response = lambda_client.update_function_code(
            FunctionName='booking-system',
            ZipFile=zip_file.read()
        )
    
    print("✅ Lambda function updated successfully!")
    print(f"Function ARN: {response['FunctionArn']}")
    print(f"Last Modified: {response['LastModified']}")
    
except Exception as e:
    print(f"❌ Error updating Lambda: {e}")