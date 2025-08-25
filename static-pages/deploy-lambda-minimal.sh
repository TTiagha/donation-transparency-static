#!/bin/bash

# Minimal Lambda deployment - just the code without dependencies
# The Lambda layer or container should have the dependencies

echo "Deploying Lambda function (code only)..."

cd /mnt/c/shock/static-pages/lambda

# Create minimal deployment package
echo "Creating deployment package..."
python3 -c "
import zipfile

with zipfile.ZipFile('../function.zip', 'w', zipfile.ZIP_DEFLATED) as zipf:
    zipf.write('index.js', 'index.js')
    zipf.write('package.json', 'package.json')
print('Zip file created')
"

cd ..

# Check zip file size
ls -lh function.zip

# Update Lambda function code
echo "Updating Lambda function code..."
/home/admin2/.aws-venv/bin/aws lambda update-function-code \
    --function-name booking-system \
    --zip-file fileb://function.zip \
    --region us-east-1

echo "Lambda function deployed successfully!"

# Clean up
rm -f function.zip