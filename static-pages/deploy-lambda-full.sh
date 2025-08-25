#!/bin/bash

echo "Creating Lambda deployment package with dependencies..."

# Create a temporary directory
TEMP_DIR="/tmp/lambda-deploy-$$"
mkdir -p "$TEMP_DIR"

# Copy Lambda files
cp /mnt/c/shock/static-pages/lambda/index.js "$TEMP_DIR/"
cp /mnt/c/shock/static-pages/lambda/package.json "$TEMP_DIR/"

# Install production dependencies in temp directory
cd "$TEMP_DIR"
echo "Installing production dependencies..."
npm install --production --no-package-lock

# Check size before zipping
TOTAL_SIZE=$(du -sb . | cut -f1)
echo "Total size before compression: $((TOTAL_SIZE / 1024 / 1024)) MB"

# Create the zip file
echo "Creating zip file..."
cd "$TEMP_DIR"

# Use Python to create a proper zip file
python3 << 'EOF'
import zipfile
import os
from pathlib import Path

def add_to_zip(zip_file, path, arcname=None):
    if arcname is None:
        arcname = path
    
    if os.path.isfile(path):
        zip_file.write(path, arcname)
    elif os.path.isdir(path):
        for root, dirs, files in os.walk(path):
            for file in files:
                file_path = os.path.join(root, file)
                arc_path = os.path.relpath(file_path, '.')
                zip_file.write(file_path, arc_path)

with zipfile.ZipFile('/mnt/c/shock/static-pages/function.zip', 'w', zipfile.ZIP_DEFLATED) as zipf:
    # Add main files
    zipf.write('index.js', 'index.js')
    zipf.write('package.json', 'package.json')
    
    # Add node_modules
    if os.path.exists('node_modules'):
        add_to_zip(zipf, 'node_modules')

print("Zip file created successfully")
EOF

# Check final zip size
ZIP_SIZE=$(stat -c%s /mnt/c/shock/static-pages/function.zip)
echo "Final zip size: $((ZIP_SIZE / 1024 / 1024)) MB"

if [ $ZIP_SIZE -gt 52428800 ]; then
    echo "WARNING: Zip file exceeds 50MB limit for direct upload!"
    echo "You'll need to upload to S3 first"
    
    # Upload to S3 first
    S3_BUCKET="donation-transparency-lambda-deployments"
    S3_KEY="booking-system/function.zip"
    
    echo "Uploading to S3..."
    /home/admin2/.aws-venv/bin/aws s3 cp /mnt/c/shock/static-pages/function.zip "s3://$S3_BUCKET/$S3_KEY" --region us-east-1
    
    echo "Updating Lambda function from S3..."
    /home/admin2/.aws-venv/bin/aws lambda update-function-code \
        --function-name booking-system \
        --s3-bucket "$S3_BUCKET" \
        --s3-key "$S3_KEY" \
        --region us-east-1
else
    echo "Updating Lambda function directly..."
    /home/admin2/.aws-venv/bin/aws lambda update-function-code \
        --function-name booking-system \
        --zip-file fileb:///mnt/c/shock/static-pages/function.zip \
        --region us-east-1
fi

# Cleanup
rm -rf "$TEMP_DIR"
rm -f /mnt/c/shock/static-pages/function.zip

echo "Lambda deployment complete!"