# AWS Lambda Function URL Deployment (Simple & Cheap!)

## Step 1: Create Lambda Function

1. Go to https://console.aws.amazon.com/lambda/
2. Click **"Create function"**
3. Choose **"Author from scratch"**
4. Function name: `waitlist-handler`
5. Runtime: **Node.js 18.x**
6. Click **"Create function"**

## Step 2: Add the Code

1. In the Lambda console, scroll to **"Code source"**
2. Delete all the default code
3. Copy and paste the ENTIRE contents of `waitlist-handler.js`
4. Click **"Deploy"**

## Step 3: Set Environment Variables

1. Go to **"Configuration"** tab → **"Environment variables"**
2. Click **"Edit"** → **"Add environment variable"**
3. Add these 4 variables:

| Key | Value |
|-----|-------|
| `ACCESS_KEY_ID` | `[Your AWS Access Key ID]` |
| `SECRET_ACCESS_KEY` | `[Your AWS Secret Access Key]` |
| `REGION` | `us-east-1` |
| `ADMIN_EMAIL` | `support@donationtransparency.org` |

4. Click **"Save"**

## Step 4: Create Function URL (The Magic Step!)

1. Go to **"Configuration"** tab → **"Function URL"**
2. Click **"Create function URL"**
3. Auth type: **"NONE"** (public access)
4. Configure CORS:
   - Allow origin: `*`
   - Allow headers: `content-type`
   - Allow methods: `POST`
   - Max age: `86400`
5. Click **"Save"**

## Step 5: Copy Your Function URL

**IMPORTANT:** Copy the Function URL that appears (looks like: `https://abc123def456.lambda-url.us-east-1.on.aws/`)

## Step 6: Update Frontend

Tell me your Function URL and I'll update the frontend code!

## Test Your Function

```bash
curl -X POST https://YOUR-FUNCTION-URL.lambda-url.us-east-1.on.aws/ \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","organizationType":"individual-fundraiser"}'
```

Expected response: `{"success":true,"message":"Successfully joined waitlist"}`

## Total Time: ~5 minutes
## Total Cost: ~$0.0002 per signup (practically free!)

That's it! No API Gateway complexity needed.