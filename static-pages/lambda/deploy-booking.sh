#!/bin/bash

# Booking System Lambda Deployment Script
# Usage: ./deploy-booking.sh

set -e  # Exit on any error

echo "🚀 Starting Booking System Lambda Deployment..."

# Configuration
FUNCTION_NAME="booking-system"
REGION="us-east-1"
RUNTIME="nodejs18.x"
TIMEOUT=30
MEMORY_SIZE=512

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}✓ $1${NC}"
}

log_warn() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

log_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check if AWS CLI is installed and configured
if ! command -v aws &> /dev/null; then
    log_error "AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    log_error "AWS credentials not configured. Run 'aws configure' first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    log_error "Node.js is not installed. Please install it first."
    exit 1
fi

log_info "Prerequisites check passed"

# Get account ID for IAM role
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ROLE_ARN="arn:aws:iam::${ACCOUNT_ID}:role/lambda-booking-execution-role"

echo "📦 Installing dependencies..."
npm install
log_info "Dependencies installed"

echo "🔨 Creating deployment package..."

# Clean previous builds
rm -f booking-system.zip

# Create zip file excluding unnecessary files
zip -r booking-system.zip . \
  -x "*.md" \
  -x "deploy*.sh" \
  -x "node_modules/.cache/*" \
  -x "*.git*" \
  -x "test/*" \
  -x "*.test.js"

log_info "Deployment package created: booking-system.zip"

# Check if function exists
echo "🔍 Checking if Lambda function exists..."
if aws lambda get-function --function-name $FUNCTION_NAME --region $REGION &> /dev/null; then
    log_info "Function exists, updating code..."
    
    # Update function code
    aws lambda update-function-code \
        --function-name $FUNCTION_NAME \
        --zip-file fileb://booking-system.zip \
        --region $REGION
    
    log_info "Function code updated"
    
    # Update configuration
    aws lambda update-function-configuration \
        --function-name $FUNCTION_NAME \
        --environment Variables="{
            \"REGION\": \"$REGION\",
            \"ADMIN_EMAIL\": \"support@donationtransparency.org\"
        }" \
        --timeout $TIMEOUT \
        --memory-size $MEMORY_SIZE \
        --region $REGION
    
    log_info "Function configuration updated"
    
else
    log_warn "Function doesn't exist, creating new function..."
    
    # Check if IAM role exists
    if ! aws iam get-role --role-name lambda-booking-execution-role &> /dev/null; then
        log_warn "Creating IAM role..."
        
        # Create trust policy
        cat > trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
        
        # Create role
        aws iam create-role \
            --role-name lambda-booking-execution-role \
            --assume-role-policy-document file://trust-policy.json
        
        # Attach basic execution policy
        aws iam attach-role-policy \
            --role-name lambda-booking-execution-role \
            --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
        
        # Create and attach custom policy
        cat > booking-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail",
        "ses:SendRawEmail"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ssm:GetParameter"
      ],
      "Resource": [
        "arn:aws:ssm:$REGION:$ACCOUNT_ID:parameter/booking/google/*",
        "arn:aws:ssm:$REGION:$ACCOUNT_ID:parameter/booking/settings/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "ssm:PutParameter"
      ],
      "Resource": [
        "arn:aws:ssm:$REGION:$ACCOUNT_ID:parameter/booking/settings/*"
      ]
    }
  ]
}
EOF
        
        aws iam put-role-policy \
            --role-name lambda-booking-execution-role \
            --policy-name BookingSystemPolicy \
            --policy-document file://booking-policy.json
        
        # Clean up policy files
        rm trust-policy.json booking-policy.json
        
        log_info "IAM role created"
        
        # Wait for role to be available
        echo "⏳ Waiting for IAM role to be available..."
        sleep 10
    fi
    
    # Create function
    aws lambda create-function \
        --function-name $FUNCTION_NAME \
        --runtime $RUNTIME \
        --role $ROLE_ARN \
        --handler booking-handler.handler \
        --zip-file fileb://booking-system.zip \
        --timeout $TIMEOUT \
        --memory-size $MEMORY_SIZE \
        --environment Variables="{
            \"REGION\": \"$REGION\",
            \"ADMIN_EMAIL\": \"support@donationtransparency.org\"
        }" \
        --region $REGION
    
    log_info "Function created"
fi

# Check if Function URL exists
echo "🔗 Checking Function URL configuration..."
if aws lambda get-function-url-config --function-name $FUNCTION_NAME --region $REGION &> /dev/null; then
    log_info "Function URL already exists"
    FUNCTION_URL=$(aws lambda get-function-url-config \
        --function-name $FUNCTION_NAME \
        --region $REGION \
        --query FunctionUrl \
        --output text)
else
    log_warn "Creating Function URL..."
    
    FUNCTION_URL=$(aws lambda create-function-url-config \
        --function-name $FUNCTION_NAME \
        --config '{
            "AuthType": "NONE",
            "Cors": {
                "AllowCredentials": false,
                "AllowHeaders": ["Content-Type"],
                "AllowMethods": ["GET", "POST", "OPTIONS"],
                "AllowOrigins": ["https://donationtransparency.org", "http://localhost:3000"],
                "ExposeHeaders": [],
                "MaxAge": 86400
            }
        }' \
        --region $REGION \
        --query FunctionUrl \
        --output text)
    
    log_info "Function URL created"
fi

# Clean up
rm booking-system.zip

echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 Function Details:"
echo "   Name: $FUNCTION_NAME"
echo "   Region: $REGION"
echo "   URL: $FUNCTION_URL"
echo ""
echo "🔧 Next Steps:"
echo "   1. Update booking.js with the Function URL:"
echo "      lambdaEndpoint: '$FUNCTION_URL'"
echo ""
echo "   2. Ensure Google Calendar credentials are stored in Secrets Manager:"
echo "      aws secretsmanager get-secret-value --secret-id 'booking/google-credentials' --region $REGION"
echo ""
echo "   3. Test the endpoints:"
echo "      curl -X POST $FUNCTION_URL -H 'Content-Type: application/json' -d '{\"action\":\"getProfile\"}'"
echo ""
log_info "Deployment script completed!"

# Test basic connectivity
echo "🧪 Testing basic connectivity..."
if curl -s -X POST "$FUNCTION_URL" \
    -H "Content-Type: application/json" \
    -d '{"action":"getProfile"}' | grep -q "success"; then
    log_info "Basic connectivity test passed"
else
    log_warn "Basic connectivity test failed - this may be expected if secrets aren't configured yet"
fi