# Claude.md - Project Documentation

## Waitlist System Management

### AWS SES Integration Status
- ✅ **ACTIVE**: AWS Lambda with AWS SES (fully deployed and operational)
- ✅ **Endpoint**: `https://xx6wbeedmowhv5jjhk6ubvx32e0rsidp.lambda-url.us-east-1.on.aws/`
- ✅ **Configuration**: `USE_AWS_LAMBDA = true` in `/static-pages/assets/js/main.js`

### Current Waitlist System (Fully Operational)
**✅ Deployed AWS Infrastructure:**
- **Lambda Function**: Deployed with Function URL
- **Email Service**: AWS SES with professional templates
- **From Address**: support@donationtransparency.org
- **Admin Notifications**: Automatic admin alerts for every signup
- **User Experience**: Branded confirmation emails with queue position

**✅ Active Features:**
- Professional HTML email templates
- CORS-enabled public access
- Client and server-side validation
- Queue position tracking
- Branded styling and animations

**✅ Alternative PHP Endpoint Available:**
- Backup PHP version at `/static-pages/api/waitlist.php`
- CSV data storage option
- Can be activated if needed
### How to Disable/Remove Waitlist (Revert to Original)

**Quick Disable (Emergency):**
```bash
# Revert the last commit to restore original "Get Started" buttons
git revert HEAD
git push origin master:main
```

**Manual Disable:**
In `/static-pages/index.html`, change all waitlist buttons back to:
```html
<!-- From: -->
<button onclick="openWaitlistModal()">Get Started</button>

<!-- To: -->
<a href="https://donationtransparency.org/onboarding/?step=1">Get Started</a>
```

**What to Preserve When Removing:**
- Export `/static-pages/waitlist_data.csv` (contains all signups)
- Save `/static-pages/templates/waitlist_confirmation.html` for future use
- Keep signup analytics and user data

**Files Added by Waitlist System:**
- `/static-pages/lambda/` (AWS Lambda function for SES)
- `/static-pages/api/` (PHP version - not used in Amplify)
- `/static-pages/templates/` (email templates)
- `/static-pages/config/` (configuration)
- Modal HTML in `index.html` (lines ~337-408)
- JavaScript functions in `main.js` (waitlist functions)

## Git Sync Configuration

### Repository Information
- **Repository Name**: donation-transparency-static
- **GitHub URL**: https://github.com/TTiagha/donation-transparency-static
- **Personal Access Token**: [STORED_SECURELY_NOT_IN_CODE]
- **Repository URL with Token**: https://[YOUR_TOKEN]@github.com/TTiagha/donation-transparency-static.git

### Git Sync Process

#### Initial Setup (if repository not initialized)
```bash
git init
git config user.email "support@donationtransparency.org"
git config user.name "Donation Transparency"
git remote add origin https://[YOUR_TOKEN]@github.com/TTiagha/donation-transparency-static.git
```

#### Standard Sync Workflow
```bash
# Check status
git status

# Add changes
git add .

# Commit with descriptive message
git commit -m "Your commit message here

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to GitHub
git push origin master:main
```

#### Handling Merge Conflicts
```bash
# If conflicts occur during pull
git config pull.rebase false  # Use merge strategy
git pull origin main --allow-unrelated-histories
git add .  # Accept all changes
git commit -m "Merge with existing repository"
git push origin master:main
```

### Notes
- Always use the repository URL with embedded token for authentication
- The local branch is `master` but pushes to `main` on GitHub
- Include the Claude Code signature in commit messages
- Use descriptive commit messages that explain the "why" not just the "what"