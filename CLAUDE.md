# Claude.md - Project Documentation

## Booking System with Google Calendar Integration

### System Status (January 2025)
- ✅ **ACTIVE**: Full Google Calendar sync operational
- ✅ **Lambda Endpoint**: `https://l22j3krfkgy2k35ezzezqd3nzy0gosml.lambda-url.us-east-1.on.aws/`
- ✅ **Access URL**: `https://donationtransparency.org/booking/?code=meet-tem`
- ✅ **Calendar Account**: tiagha@gmail.com (primary calendar)
- ✅ **Timezone Support**: Proper EDT/EST handling with DST detection

### Recent Fixes (January 24, 2025)
1. **Fixed 9:00 AM EST slot visibility**:
   - Corrected DST handling (EDT = UTC-4, EST = UTC-5)
   - Fixed timezone conversion in `generateDaySlots` function
   - Now properly shows morning availability

2. **Fixed Google Calendar sync**:
   - Resolved date range bug in calendar queries
   - Fixed timezone conversion for busy time detection
   - Calendar conflicts now properly detected

3. **Fixed Lambda deployment**:
   - Included all dependencies (googleapis, AWS SDK)
   - Created reliable deployment scripts
   - Fixed Lambda URL confusion (booking vs waitlist)

4. **Configuration updates**:
   - Reduced minimum notice from 24 to 6 hours
   - Fixed per-day scheduling support
   - Proper working hours (9 AM - 5 PM user timezone)

### Troubleshooting Documentation
**📚 See [`/booking-system-troubleshooting.md`](./booking-system-troubleshooting.md) for comprehensive debugging guide**

Includes:
- Lambda deployment procedures
- Google Calendar sync debugging
- Timezone/DST handling
- Common error solutions
- Testing procedures
- AWS configuration details

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

## Booking System Management

### AWS Lambda Booking System Status
- ✅ **ACTIVE**: AWS Lambda with Google Calendar & SES integration (fully deployed and operational)  
- ✅ **Endpoint**: `https://l22j3krfkgy2k35ezzezqd3nzy0gosml.lambda-url.us-east-1.on.aws/`
- ✅ **Configuration**: Per-day scheduling system with admin panel

### Current Booking System (Fully Operational)
**✅ Deployed AWS Infrastructure:**
- **Lambda Function**: Serverless booking handler with Function URL
- **Google Calendar API**: Real-time availability checking and event creation
- **AWS SES**: Professional email confirmations for both client and admin
- **AWS Parameter Store**: Secure credential storage for OAuth tokens
- **Per-Day Scheduling**: Customizable working hours for each day of week

**✅ Live URLs:**
- **Public Booking**: https://donationtransparency.org/booking/?code=abc123
- **Admin Dashboard**: https://donationtransparency.org/booking/admin.html?key=admin2025  
- **Personal URL**: https://donationtransparency.org/meet-tem
- **Test Suite**: https://donationtransparency.org/booking/test.html?code=abc123

**✅ Key Features:**
- Real-time calendar availability sync
- Automatic timezone detection and conversion
- Multiple meeting types (15/30/60 minutes)
- Professional email confirmations with calendar attachments
- Google Meet integration with auto-generated links
- Anti-spam protection (honeypot, rate limiting, timing validation)
- Mobile-responsive React-based interface
- Access control with invite codes

**✅ Admin Panel Capabilities:**
- Profile management (name, email, bio, avatar)
- Per-day availability settings (Monday-Sunday)
- Working hours customization
- Meeting type configuration
- Calendar integration status monitoring
- Invite code management
- System health diagnostics

**✅ Security Features:**
- Invite-only booking access (`?code=abc123`)
- Admin access control (`?key=admin2025`)
- Rate limiting (10 requests/hour general, 5 bookings/hour)
- Input sanitization and validation
- CORS protection for donationtransparency.org
- Secure OAuth token storage in AWS Parameter Store

### Technical Architecture
**Frontend Stack:**
- React components via CDN
- Vanilla JavaScript for calendar logic
- Modern CSS with responsive design
- Google Fonts (Inter typography)

**Backend Infrastructure:**
- AWS Lambda serverless function
- Google Calendar API v3 with OAuth 2.0
- AWS SES for email delivery
- AWS Parameter Store for credentials
- Node.js with ES modules

**File Structure:**
```
/booking/
├── index.html          # Main booking page
├── admin.html          # Admin dashboard  
├── test.html           # Test suite
├── meet-tem.html       # Personal redirect
├── debug-test.html     # Debug utilities
└── assets/
    ├── booking.js      # Frontend logic
    ├── booking.css     # Styling
    └── admin.js        # Admin functionality
```

**Lambda Configuration:**
- Handler: `/lambda/index.js`
- Environment: `REGION=us-east-1`, `ADMIN_EMAIL=support@donationtransparency.org`
- Dependencies: googleapis, uuid, ical-generator, AWS SDK v3
- Timeout: 30 seconds, Memory: 512MB

### Maintenance Tasks
**Regular Monitoring:**
- Check CloudWatch logs for errors
- Verify Google Calendar sync status
- Monitor SES sending statistics
- Test booking flows monthly

**OAuth Token Management:**
- Refresh tokens stored in Parameter Store at `/booking/google/refresh_token`
- Tokens typically valid for 6 months
- Use admin panel to test calendar connectivity

### How to Disable/Modify Booking System
**Quick Disable:**
- Remove `?code=abc123` parameter requirement in Lambda handler
- Set Lambda environment variable `BOOKING_DISABLED=true`
- Update booking page to show maintenance message

**Configuration Updates:**
- Use admin panel at `/booking/admin.html?key=admin2025`
- Modify settings in AWS Parameter Store via admin interface
- Update working hours, meeting types, profile information

**Files Added by Booking System:**
- `/static-pages/booking/` (all booking interface files)
- `/static-pages/lambda/` (AWS Lambda function)
- `/static-pages/config/booking-config.json` (frontend configuration)
- `/static-pages/_redirects` (meet-tem redirect rule)

## Git Sync Configuration

### Repository Information
- **Repository Name**: donation-transparency-static
- **GitHub URL**: https://github.com/TTiagha/donation-transparency-static
- **Working Directory**: `/mnt/c/shock/` (contains both project files and git repo)
- **Website Files Location**: `/mnt/c/shock/static-pages/` (all website content goes here)
- **Personal Access Token**: [STORED_SECURELY_NOT_IN_CODE]
- **Repository URL with Token**: https://[YOUR_TOKEN]@github.com/TTiagha/donation-transparency-static.git

### Directory Structure
```
/mnt/c/shock/                     <- Git repository root
├── .git/                         <- Git configuration
├── static-pages/                 <- ALL WEBSITE FILES GO HERE
│   ├── index.html               <- Homepage
│   ├── guides/                  <- All guide articles
│   ├── features/                <- Feature pages
│   ├── assets/                  <- CSS, JS, images
│   └── ...                      <- Other website content
├── CLAUDE.md                    <- This documentation
└── ...                          <- Other project files
```

### IMPORTANT: File Placement Rules
- **✅ Website content**: Always create/edit files in `/mnt/c/shock/static-pages/`
- **✅ New articles**: Place in `/mnt/c/shock/static-pages/guides/`
- **✅ Assets**: Place in `/mnt/c/shock/static-pages/assets/css|js|images/`
- **❌ Never**: Create website files directly in `/mnt/c/shock/` root

### Git Sync Process

#### Initial Setup (if repository not initialized)
```bash
git init
git config user.email "support@donationtransparency.org"
git config user.name "Donation Transparency"
git remote add origin https://[YOUR_TOKEN]@github.com/TTiagha/donation-transparency-static.git
```

#### Standard Sync Workflow
**⚠️ ALWAYS run these commands from `/mnt/c/shock/` directory:**

```bash
# Ensure you're in the correct directory
cd /mnt/c/shock

# Check status (should show static-pages/ files)
git status

# Add website changes (files in static-pages/)
git add static-pages/

# OR add specific files
git add static-pages/guides/new-article.html static-pages/assets/

# Commit with descriptive message
git commit -m "Your commit message here

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to GitHub
git push origin master:main
```

#### Quick Reference Commands
```bash
# Check current directory
pwd
# Should show: /mnt/c/shock

# List website files
ls static-pages/

# Add new article
# ✅ CORRECT: static-pages/guides/article.html
# ❌ WRONG: guides/article.html
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

## SEO Optimization Status

### Completed SEO Work (January 2025)

**✅ Features Section Optimization:**
- Eliminated keyword cannibalization by consolidating duplicate pages
- Deleted: `fundraising-performance-analytics-new.html`, `fundraising-performance-analytics-backup.html`, `trust-dashboard.html`, `donation-visibility.html`
- Implemented 301 redirects in `_redirects` file
- Optimized titles/meta for commercial intent keywords

**✅ Transparency Section Optimization:**
- Resolved cannibalization between "accountability" and "financial transparency" guides
- Differentiated content focus: accountability (governance) vs transparency (implementation)
- Updated Chapter 3 title to "The Psychology of Transparency and Trust"
- Removed redundant Chapter 4, creating clean 3-chapter structure
- Fixed all broken internal links

**✅ Guides Section Optimization:**
- Deleted 7 thin content stub pages that were never written
- Merged `donor-confidence.html` content into `building-donor-trust.html`
- Implemented strategic internal linking between guides
- Clear differentiation between informational and commercial content

### Current Site Structure

**Content Pillars:**
1. **Features** (`/features/`) - Commercial intent, product/tool focused
2. **Transparency** (`/transparency/`) - Educational content on transparency concepts  
3. **Guides** (`/guides/`) - Practical how-to content for implementation

**SEO Health:**
- Zero keyword cannibalization across all sections
- Clear content differentiation and search intent targeting
- Proper 301 redirects for all deleted pages
- Strategic internal linking throughout
- Optimized meta data (titles, descriptions, schema)

### Future Content Strategy

See `/temp-markdown/content-expansion-strategy.md` for detailed plan on:
- Missing audience segments to target
- Tactical how-to content opportunities
- Case study and success story templates
- Comparison/alternative content strategy
- Problem-solving content ideas
- Seasonal content calendar

This document provides the writing team with a comprehensive roadmap for building topical authority while maintaining the optimized site structure.

## Recent Major Updates (August 2025)

### URL Redirect & SEO Optimization (August 30, 2025)
1. **Universal Trailing Slash Redirects**
   - ✅ Fixed critical 404 errors for trailing slash URLs (e.g., `/about/`, `/guides/best-fundraising-platforms-2025/`)
   - ✅ Resolved conflicting rules in `_redirects` file that were overriding Amplify's universal redirect pattern
   - ✅ All URL variations now properly redirect with 301 status codes
   - ✅ CloudFront cache invalidation resolved legacy 404 responses

2. **Canonical URL Implementation**
   - ✅ Added canonical URL tags to all major pages (`index.html`, `about.html`, fundraising guide)
   - ✅ Updated `sitemap.xml` to use canonical extensionless URLs (removed all `.html` extensions)
   - ✅ Established consistent URL structure for SEO optimization
   - ✅ Updated sitemap lastmod date for fundraising platforms guide (2025-08-30)

3. **Google Search Console Integration**
   - ✅ Created automated GSC status checking script (`check_search_console.py`)
   - ✅ Verified sitemap submission status (24 pages submitted to Google)
   - ✅ Monitored search performance data (homepage: 60 impressions, analytics page: 1 click)
   - ✅ Identified indexing opportunities for new canonical URLs

### Technical Fixes Implemented
- **_redirects File Cleanup**: Removed problematic `200!` rules that conflicted with universal redirects
- **URL Pattern Testing**: Comprehensive testing with Playwright and curl commands confirmed all redirects working
- **SEO Structure**: Canonical URLs now match sitemap entries for consistent indexing
- **Future-Proof Solution**: Universal redirect pattern `/<**>/` handles all URL variations automatically

### Current SEO Status
- **Redirect Infrastructure**: 100% operational with universal pattern
- **Canonical URL Structure**: Implemented across all major pages  
- **Google Indexing**: Awaiting 24-48 hour processing period for new canonical URLs
- **Search Performance**: Baseline established, monitoring for improvements
- **Technical SEO Health**: All critical redirect and canonical URL issues resolved

### Content Improvements (Previous Updates)
1. **Psychology Article Integration**
   - Replaced thin `trust-building.html` snippet with comprehensive 3,500+ word article
   - Converted from `psychology.md` with proper HTML formatting
   - Fixed all white text visibility issues for light mode theme
   - Added strategic internal links throughout

2. **Orphaned Content Cleanup**
   - Deleted thin feature pages: `automated-reporting.html`, `donor-notifications.html`, `receipt-management.html`
   - Removed orphaned transparency snippets: `ethical-fundraising.html`, `transparency-vs-competitors.html`
   - All orphaned pages properly removed from site structure

3. **Navigation & UX Improvements**
   - Updated all "Schedule a demo" CTAs to route to contact form (`contact.html`)
   - Fixed cross-directory linking issues in guides section
   - Ensured all internal links use relative paths correctly

### SEO Progress
- **Overall Completion**: 95% (increased from 92% after redirect fixes)
- **Keyword Cannibalization**: 100% resolved
- **Content Differentiation**: Clear separation between pillars
- **Technical SEO**: 
  - ✅ All 301 redirects implemented with universal pattern
  - ✅ Canonical URLs on all major pages
  - ✅ Meta descriptions on all pages
  - ✅ XML sitemap updated with canonical URLs (21 pages)
  - ✅ Robots.txt optimized for crawling
  - ✅ Schema markup expanded (19 pages with rich snippets)
  - ✅ All images have alt tags
  - ✅ App subdomain SEO strategy completed
- **Internal Linking**: Strategic cross-linking throughout site

### Files Modified in August 2025 Updates
- Modified: `/static-pages/_redirects` (removed conflicting rules, fixed universal redirects)
- Modified: `/static-pages/sitemap.xml` (updated all URLs to canonical format)
- Modified: `/static-pages/guides/best-fundraising-platforms-2025.html` (added canonical URL tag)
- Modified: `/static-pages/about.html` (added canonical URL tag)
- Modified: `/static-pages/index.html` (added canonical URL tag)
- Created: `/check_search_console.py` (Google Search Console automation script)

### App Subdomain SEO Strategy
**✅ Completed:**
- Created robots.txt template for app.donationtransparency.org
- WordPress-specific SEO blocking (wp-admin, plugins, system files)
- Donation page SEO optimization guide
- Schema markup templates (DonateAction, FundraisingEvent)
- Open Graph and social sharing optimization

**Key Benefits:**
- Public donation pages (/donate/) indexed for organic discovery
- User privacy protected (dashboards, admin areas blocked)
- Social sharing optimized for viral growth
- Structured data for rich snippets

### Remaining SEO Tasks (4%)
1. ✅ **Analytics & Tracking Setup** (COMPLETED - September 2, 2025)
   - ✅ Google Analytics 4 implementation with measurement ID G-C83EV6K1D3
   - ✅ GA4 Setup Assistant: 5/8 tasks complete (core tracking 100% operational)
   - ✅ Key events configured: waitlist_signup, contact_form_submit, booking_request, cta_click, qualified_page_view
   - ✅ 4 audience segments defined for remarketing: High Intent, Qualified Leads, Decision Makers, Ready to Convert  
   - ✅ Google Signals enabled for enhanced demographic data
   - ✅ GDPR consent mode implemented for EEA compliance
   - ✅ Google Search Console verification and monitoring
   - ✅ Advanced conversion tracking with traffic source attribution
   - 📋 Setup guide created: `/GA4-setup-assistant-guide.md`
   - 🤖 **Google Analytics MCP Server Configured** (September 2, 2025)
     - Service account: serviceaccountdt@makedotcom-422712.iam.gserviceaccount.com
     - GA4 Property ID: 456568937
     - Claude Code integration: ✅ Connected
     - Available functions: runReport, getPageViews, getActiveUsers, getEvents, getUserBehavior
     - Ready for automated GA4 setup assistant completion and ongoing analytics

2. **Content Expansion** (3%)
   - 3-4 new audience-specific guides
   - 2-3 case studies
   - Comparison content

3. **Performance Optimization** (1%)
   - Core Web Vitals improvements
   - Page speed optimization

## Analytics & Performance Monitoring

### Google Analytics 4 Tracking (August 31, 2025)
- **Status**: ✅ Fully deployed with measurement ID `G-C83EV6K1D3`
- **Implementation**: Advanced tracking with conversion goals and SEO attribution
- **Key Pages**: Homepage, about page, fundraising platforms guide
- **Access**: [Google Analytics Dashboard](https://analytics.google.com/) → Donation Transparency property

**Conversion Tracking Active:**
- Waitlist signups (primary conversion)
- Contact form submissions (lead generation)
- Booking requests (high-value conversions)
- CTA clicks and qualified page views
- Traffic source attribution (organic, social, direct, referral)

**SEO Monitoring:**
- Track "fundraising platform" keyword conversions
- Measure ROI of content optimization efforts
- Monitor user journey from organic search to conversion
- Content group performance (Guides, Features, Transparency)

### Google Search Console Monitoring

#### Quick Start - Check Indexing Status
```bash
python3 check_search_console.py
```

### Service Account Configuration
- **Credentials File**: `/mnt/c/shock/makedotcom-422712-49bd5846f0b5.json`
- **Service Account Email**: `search-console-mcp@makedotcom-422712.iam.gserviceaccount.com`
- **Properties Verified**: 
  - `sc-domain:donationtransparency.org` (main site)
  - `sc-domain:app.donationtransparency.org` (WordPress blog)

### MCP Server Integration (September 2, 2025)

#### Google Analytics MCP Server - ACTIVE ✅
**Status**: Fully operational and connected to Claude Code
- **Installation**: `npm install -g mcp-server-google-analytics`
- **Configuration**: JSON-based with embedded credentials
- **Service Account**: serviceaccountdt@makedotcom-422712.iam.gserviceaccount.com
- **GA4 Property ID**: 456568937
- **Connection Status**: ✅ Connected (verified in `claude mcp list`)

**Available Functions:**
- `runReport` - Custom GA4 reports with dimensions/metrics
- `getPageViews` - Page view analytics and trends
- `getActiveUsers` - User behavior and engagement metrics  
- `getEvents` - Event tracking and conversion data
- `getUserBehavior` - User journey and attribution analysis

**Automation Capabilities:**
- ✅ GA4 Setup Assistant completion (audiences, key events, Google Signals)
- ✅ Real-time data analysis and reporting
- ✅ Conversion optimization insights
- ✅ SEO performance monitoring
- ✅ Traffic source attribution and ROI analysis

**Setup Process Completed:**
1. ✅ Installed MCP server via npm
2. ✅ Created Google Cloud service account with Analytics Data API access
3. ✅ Added service account to GA4 property with Viewer permissions
4. ✅ Configured Claude Code with JSON environment variables
5. ✅ Verified connection and functionality

**Command to Check Status:**
```bash
claude mcp list  # Should show google-analytics: ✓ Connected
```

**Future Google Analytics Automation:**
This MCP server investment enables ongoing automation for:
- Monthly SEO performance reports
- Automated audience creation and management
- Conversion tracking optimization
- A/B testing analysis and recommendations
- Content performance insights and optimization suggestions
- Real-time SEO ROI measurement

#### Google Search Console Integration
**Status**: Manual Python script (MCP integration planned)
- **Script**: `python3 check_search_console.py` for indexing status
- **Service Account**: search-console-mcp@makedotcom-422712.iam.gserviceaccount.com

### What the Script Shows
1. **Verified Sites** - Lists all properties the service account can access
2. **Indexed Pages** - Shows pages with search impressions in the last 7 days including:
   - Page URL
   - Clicks
   - Impressions
   - CTR (Click-through rate)
   - Average position
3. **URL Inspection** - For key pages, shows:
   - Coverage state (indexed, not indexed, etc.)
   - Verdict (PASS, NEUTRAL, FAIL)
   - Last crawl date

### Current Indexing Status (as of January 2025)
- **Total Indexed Pages**: 27 pages showing impressions
- **Homepage**: Indexed ✅ (Position 31)
- **Features**: Indexed ✅ 
- **Transparency**: Crawled but NOT indexed ❌ (needs fixing)
- **Guides**: Indexed ✅
- **About**: Indexed ✅

### Known Issues
1. `/transparency/` main page not indexed despite being crawled
2. Low average positions (need better on-page SEO)
3. Zero clicks despite impressions (need better meta descriptions)

## Gemini CLI Installation

### Installation Instructions

The Gemini CLI provides direct access to Google's Gemini AI models from the command line.

**✅ Installation Process:**
```bash
# Clone the repository
git clone https://github.com/google-gemini/gemini-cli.git

# Install dependencies
cd gemini-cli
npm install

# Install globally
npm install -g .
```

### Usage

**✅ Available Commands:**
- `gemini --version` - Check installed version
- `gemini` - Launch interactive mode
- `gemini -p "your prompt"` - Non-interactive prompt
- `gemini --help` - Show all available options

**✅ Installation Status:**
- **Version**: 0.1.21
- **Installation Method**: Manual build from GitHub repository
- **Global Access**: Available system-wide via npm global install
- **Authentication**: Uses cached credentials (ready to use)

**✅ Key Features:**
- Interactive CLI mode for ongoing conversations
- Non-interactive mode for scripted usage
- Sandbox mode for code execution
- MCP server management
- Debug mode and telemetry options

### Installation Notes
- The npm package `@google/generative-ai-cli` is not available on npm registry
- Manual installation from GitHub repository required
- Built successfully despite Node.js version warnings (works on Node v20.19.2)
- Credentials are automatically managed and cached

### Updates and Maintenance

**❌ No Automatic Updates:**
- Gemini CLI does not update automatically
- Installation creates a symlink to the local cloned repository
- Updates require manual steps

**✅ Manual Update Process:**
```bash
# Navigate to the cloned repository
cd /mnt/c/shock/gemini-cli

# Pull latest changes from GitHub
git pull origin main

# Reinstall dependencies if package.json changed
npm install

# Global symlink automatically uses updated code
```

**✅ Check for Updates:**
```bash
# Check current version
gemini --version

# Check for newer releases on GitHub
# Visit: https://github.com/google-gemini/gemini-cli/releases
```