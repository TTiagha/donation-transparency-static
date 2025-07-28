# 404 URL Analysis - Main Domain

## Total URLs: 91

### Category 1: Blog/WordPress Content (Redirect to App) - 35 URLs
**Pattern:** Should redirect to app.donationtransparency.org
- `/blog/` → `https://app.donationtransparency.org/blog/`
- `/blog/page/2/` → `https://app.donationtransparency.org/blog/page/2/`
- `/blog/page/3/` → `https://app.donationtransparency.org/blog/page/3/`
- `/category/*` → `https://app.donationtransparency.org/category/*`
- `/tag/*` → `https://app.donationtransparency.org/tag/*`
- All individual blog post URLs

### Category 2: WordPress Functionality (Redirect to App) - 8 URLs
- `/my-account/` → `https://app.donationtransparency.org/my-account/`
- `/registration/` → `https://app.donationtransparency.org/registration/`
- `/registration-2/` → `https://app.donationtransparency.org/registration/`
- `/select-role/` → `https://app.donationtransparency.org/select-role/`
- `/contact-us/` → `https://app.donationtransparency.org/contact-us/`
- `/about-us/` → `https://app.donationtransparency.org/about-us/`
- `/donor-dash/` → `https://app.donationtransparency.org/donor-dashboard/`
- `/donor-sim-dashboard/` → `https://app.donationtransparency.org/donor-sim/`

### Category 3: Incorrect Static Paths (Fix Path) - 6 URLs
**Pattern:** Wrong directory structure, should be in /features/
- `/guides/trust-dashboard.html` → `/features/transparency-management-dashboard.html`
- `/guides/automated-reporting.html` → `/features/fundraising-performance-analytics.html`
- `/guides/real-time-tracking.html` → `/features/real-time-tracking.html`

### Category 4: Content Reorganization (Redirect to New Location) - 25 URLs
**Individual blog posts that moved or were reorganized**
- Various specific blog post URLs → Redirect to most relevant existing page

### Category 5: Invalid/Return 404 - 8 URLs
**Should remain as 404 errors**
- `search?q=%7Bsearch_term_string%7D` (invalid search)
- `/2470-2/` (unclear reference)
- `locations.kml` (file not found)
- Other invalid references

### Category 6: Subdomain Confusion - 9 URLs
**App URLs hitting main domain**
- `app.donationtransparency.org/*` URLs → Already on correct domain, investigate

## Recommended Action Plan:
1. **Bulk WordPress redirects** (43 URLs) → app subdomain
2. **Path corrections** (6 URLs) → correct static paths  
3. **Content redirects** (25 URLs) → most relevant existing pages
4. **Leave as 404** (8 URLs) → invalid requests
5. **Investigate** (9 URLs) → subdomain routing issues

## Priority Order:
1. WordPress functionality redirects (immediate user impact)
2. Static path corrections (SEO value)
3. Content redirects (traffic recovery)
4. Clean up invalid URLs