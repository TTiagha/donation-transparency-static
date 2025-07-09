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

See `/content-expansion-strategy.md` for detailed plan on:
- Missing audience segments to target
- Tactical how-to content opportunities
- Case study and success story templates
- Comparison/alternative content strategy
- Problem-solving content ideas
- Seasonal content calendar

This document provides the writing team with a comprehensive roadmap for building topical authority while maintaining the optimized site structure.

## Recent Major Updates (January 2025)

### Content Improvements
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
- **Overall Completion**: 90% (increased from 85%)
- **Keyword Cannibalization**: 100% resolved
- **Content Differentiation**: Clear separation between pillars
- **Technical SEO**: 
  - ✅ All 301 redirects implemented
  - ✅ Meta descriptions on all pages
  - ✅ XML sitemap created (21 pages)
  - ✅ Robots.txt optimized for crawling
  - ✅ Schema markup expanded (19 pages with rich snippets)
  - ✅ All images have alt tags
- **Internal Linking**: Strategic cross-linking throughout site

### Files Modified/Deleted in Latest Updates
- Modified: `/transparency/trust-building.html` (complete content replacement)
- Modified: `/transparency/index.html` (chapter restructuring)
- Modified: `/_redirects` (added all missing redirects)
- Modified: `/robots.txt` (updated to allow crawling of all content)
- Modified: `/index.html` (enhanced Organization schema)
- Modified: `/petition-for-transparency.html` (added PetitionAction schema)
- Modified: `/guides/complete-fundraising-starter.html` (added HowTo schema)
- Created: `/sitemap.xml` (comprehensive XML sitemap)
- Created: `/content-expansion-strategy.md` (future content roadmap)
- Deleted: Multiple thin/orphaned pages across all sections

### Remaining SEO Tasks (10%)
1. **Analytics & Tracking Setup** (5%)
   - Google Analytics 4 implementation
   - Google Search Console verification
   - Conversion tracking setup

2. **Content Expansion** (3%)
   - 3-4 new audience-specific guides
   - 2-3 case studies
   - Comparison content

3. **Performance Optimization** (2%)
   - Core Web Vitals improvements
   - Page speed optimization