# Static Site Link Health Report

## Summary
- **Total Links Checked**: 269
- **Broken Links Found**: 33
- **Success Rate**: 87.7%

## Major Issues Found

### 1. Primary Issue: Missing Onboarding System
**30 broken links** point to `/onboarding/?step=1` which doesn't exist.

**Affected Files**:
- All feature pages (11 files)
- All guide pages (10 files)
- All transparency pages (9 files)

**Impact**: High - This is the primary CTA across the site

### 2. Cross-Directory Link Issues
**3 broken links** in guides referencing feature pages:
- `guides/new-charity-fundraising.html` → `real-time-tracking.html` (should be `../features/real-time-tracking.html`)
- `guides/new-charity-fundraising.html` → `automated-reporting.html` (should be `../features/automated-reporting.html`)
- `guides/new-charity-fundraising.html` → `trust-dashboard.html` (should be `../features/trust-dashboard.html`)

## Areas Analyzed

### 1. Main Navigation (Header Template)
✅ **All working** - Header template uses proper basePath variables and all referenced files exist:
- index.html
- features/index.html
- guides/index.html
- transparency/index.html
- about.html
- contact.html
- petition-for-transparency.html

### 2. Footer Template
✅ **All working** - Footer template links are functional:
- contact.html
- petition-for-transparency.html
- Privacy Policy and Terms of Service are placeholder (#) links

### 3. Homepage (index.html)
✅ **All working** - 4 links, 0 broken
- All asset references (CSS, images) are working
- No broken internal links

### 4. Transparency Pillar Page (/transparency/index.html)
⚠️ **Mostly working** - 10 links, 1 broken
- 9 working links to chapter pages
- 1 broken link to `/onboarding/?step=1`

### 5. Guides Landing Page (/guides/index.html)
⚠️ **Mostly working** - 9 links, 1 broken
- 8 working links to guide pages
- 1 broken link to `/onboarding/?step=1`

## Recommendations

### High Priority
1. **Create onboarding system** or redirect `/onboarding/?step=1` to waitlist modal
2. **Fix cross-directory links** in guides/new-charity-fundraising.html

### Medium Priority
3. **Add Privacy Policy and Terms of Service pages** (currently placeholder links)

### Low Priority
4. **Review CTA strategy** - Decide if onboarding should exist or all CTAs should use waitlist modal

## File Health by Category

### Core Pages
- ✅ index.html (Homepage)
- ✅ about.html
- ✅ contact.html
- ✅ petition-for-transparency.html

### Feature Pages (11 files)
- ✅ All feature pages exist and internal links work
- ❌ All have broken `/onboarding/?step=1` links

### Guide Pages (12 files)
- ✅ All guide pages exist
- ❌ All have broken `/onboarding/?step=1` links
- ❌ new-charity-fundraising.html has 3 additional broken feature links

### Transparency Pages (8 files)
- ✅ All transparency pages exist and internal links work
- ❌ All have broken `/onboarding/?step=1` links

## Technical Notes

### Template System
- Header and footer templates use proper basePath variables
- All navigation links work correctly across different directory levels
- Template system is robust and handles relative paths well

### Asset References
- All CSS and image references are working
- Favicon references are working
- JavaScript file references are working

### Link Patterns
- Most broken links are due to missing onboarding system
- Cross-directory references need `../` prefix in some cases
- Fragment links (#) and external links are working properly