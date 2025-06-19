#!/bin/bash

# AWS Lambda Deployment Script for Waitlist Handler
# This script automates the deployment of your waitlist Lambda function

echo "🚀 Deploying Waitlist Lambda Function..."

# Variables
FUNCTION_NAME="waitlist-handler"
REGION="us-east-1"
RUNTIME="nodejs18.x"

# Create deployment package
echo "📦 Creating deployment package..."
cd "$(dirname "$0")"
zip -r waitlist-handler.zip waitlist-handler.js package.json

# Check if function exists
if aws lambda get-function --function-name $FUNCTION_NAME --region $REGION 2>/dev/null; then
    echo "🔄 Updating existing function..."
    aws lambda update-function-code \
        --function-name $FUNCTION_NAME \
        --zip-file fileb://waitlist-handler.zip \
        --region $REGION
else
    echo "🆕 Creating new function..."
    aws lambda create-function \
        --function-name $FUNCTION_NAME \
        --runtime $RUNTIME \
        --role arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):role/lambda-execution-role \
        --handler waitlist-handler.handler \
        --zip-file fileb://waitlist-handler.zip \
        --region $REGION \
        --timeout 30 \
        --memory-size 256
fi

# Set environment variables
echo "🔧 Setting environment variables..."
aws lambda update-function-configuration \
    --function-name $FUNCTION_NAME \
    --environment Variables="{ACCESS_KEY_ID=$ACCESS_KEY_ID,SECRET_ACCESS_KEY=$SECRET_ACCESS_KEY,AWS_REGION=$REGION,ADMIN_EMAIL=support@donationtransparency.org}" \
    --region $REGION

echo "✅ Lambda function deployed successfully!"
echo ""
echo "Next steps:"
echo "1. Create API Gateway and connect it to this Lambda function"
echo "2. Enable CORS on the API Gateway"
echo "3. Deploy the API and note the endpoint URL"
echo "4. Update the LAMBDA_ENDPOINT in main.js with your actual API Gateway URL"

# Clean up
rm waitlist-handler.zip