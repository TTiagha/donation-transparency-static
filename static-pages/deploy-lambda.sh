#!/bin/bash

# Deploy Lambda function for booking system
echo "Deploying Lambda function..."

cd /mnt/c/shock/static-pages/lambda

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Create deployment package using tar and gzip (more reliable than python zipfile)
echo "Creating deployment package..."
tar czf ../function.tar.gz index.js package.json node_modules

# Convert to zip (Lambda requires zip format)
cd ..
python3 -c "
import tarfile
import zipfile
import os

# Extract tar.gz
with tarfile.open('function.tar.gz', 'r:gz') as tar:
    tar.extractall('temp_extract')

# Create zip
with zipfile.ZipFile('function.zip', 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk('temp_extract'):
        for file in files:
            file_path = os.path.join(root, file)
            arcname = os.path.relpath(file_path, 'temp_extract')
            zipf.write(file_path, arcname)

# Clean up temp directory
import shutil
shutil.rmtree('temp_extract')
os.remove('function.tar.gz')
"

# Update Lambda function code
echo "Updating Lambda function code..."
/home/admin2/.aws-venv/bin/aws lambda update-function-code \
    --function-name booking-system \
    --zip-file fileb://function.zip \
    --region us-east-1

echo "Lambda function deployed successfully!"

# Clean up
rm -f function.zip