# AWS Lambda Deployment for Waitlist System

## Quick Deploy (Recommended)

### Option 1: AWS CLI (Fastest)
```bash
# 1. Set your AWS credentials as environment variables
export ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY_ID
export SECRET_ACCESS_KEY=YOUR_AWS_SECRET_ACCESS_KEY

# 2. Run the deployment script
cd /mnt/c/shock/static-pages/lambda
./deploy.sh
```

### Option 2: AWS Console (Manual)

**Step 1: Create Lambda Function**
1. Go to [AWS Lambda Console](https://console.aws.amazon.com/lambda/)
2. Click "Create function" 
3. Choose "Author from scratch"
4. Function name: `waitlist-handler`
5. Runtime: Node.js 18.x
6. Click "Create function"

**Step 2: Upload Code**
1. In the Lambda function console, scroll to "Code source"
2. Delete the default code and paste the entire contents of `waitlist-handler.js`
3. Click "Deploy"

**Step 3: Set Environment Variables**
1. Go to "Configuration" tab → "Environment variables"
2. Add these variables:
   - `ACCESS_KEY_ID` = `[Your AWS Access Key ID]`
   - `SECRET_ACCESS_KEY` = `[Your AWS Secret Access Key]`
   - `REGION` = `us-east-1`
   - `ADMIN_EMAIL` = `support@donationtransparency.org`

**Step 4: Create API Gateway**
1. Go to [API Gateway Console](https://console.aws.amazon.com/apigateway/)
2. Click "Create API" → Choose "REST API" → "Build"
3. API name: `waitlist-api`
4. Click "Create API"

**Step 5: Configure API Gateway**
1. Click "Actions" → "Create Resource"
2. Resource name: `waitlist`
3. Click "Create Resource"
4. Select the `/waitlist` resource
5. Click "Actions" → "Create Method" → Select "POST"
6. Integration type: "Lambda Function"
7. Lambda Function: `waitlist-handler`
8. Click "Save" → "OK"

**Step 6: Enable CORS**
1. Select the `/waitlist` resource
2. Click "Actions" → "Enable CORS"
3. Access-Control-Allow-Origin: `*`
4. Access-Control-Allow-Headers: `Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token`
5. Click "Enable CORS and replace existing CORS headers"

**Step 7: Deploy API**
1. Click "Actions" → "Deploy API"
2. Deployment stage: `prod` (create new stage)
3. Click "Deploy"
4. **COPY THE INVOKE URL** - you'll need this!

**Step 8: Update Frontend**
1. Edit `/static-pages/assets/js/main.js`
2. Replace this line:
   ```javascript
   const LAMBDA_ENDPOINT = 'https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/waitlist';
   ```
   With your actual API Gateway URL:
   ```javascript
   const LAMBDA_ENDPOINT = 'https://YOUR-ACTUAL-API-ID.execute-api.us-east-1.amazonaws.com/prod/waitlist';
   ```

## Testing Your Setup

Test with curl:
```bash
curl -X POST https://YOUR-API-ID.execute-api.us-east-1.amazonaws.com/prod/waitlist \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","organizationType":"individual-fundraiser"}'
```

Expected response:
```json
{"success":true,"message":"Successfully joined waitlist"}
```

## Troubleshooting

**Lambda Execution Role Error:**
If you get permission errors, create an execution role:
1. Go to IAM Console
2. Create role → AWS Service → Lambda
3. Attach policies: `AWSLambdaBasicExecutionRole` and `AmazonSESFullAccess`
4. Role name: `lambda-execution-role`
5. Update Lambda function to use this role

**CORS Errors:**
Make sure CORS is enabled in API Gateway and includes `Content-Type` in allowed headers.

**SES Errors:**
Verify your email addresses are verified in SES console, or move SES out of sandbox mode.