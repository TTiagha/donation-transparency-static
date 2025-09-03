# Conversion Funnel Analysis Guide - September 2025

## New Tracking Implementation

### What We Just Added
**Waitlist Button Click Tracking** - Now tracking when users click "Start Your Transparent Fundraiser" buttons

**Event Details:**
- **Event Name**: `waitlist_modal_open`
- **Category**: `engagement`  
- **Label**: `button_click`
- **Value**: `1`

**Locations Tracked:**
- Homepage main CTA button
- Header CTA button (desktop)
- Mobile menu CTA button

## Complete Conversion Funnel (Now Measurable)

### Stage 1: Search Visibility ✅
- **Source**: Google Search Console
- **Current**: 2,442 monthly impressions
- **Key Pages**: Homepage (317 imp), Best Guide (373 imp)

### Stage 2: Site Clicks ✅  
- **Source**: Google Search Console
- **Current**: 5 monthly clicks (0.20% CTR)
- **Recently Optimized**: Homepage + guide titles (Sept 3)

### Stage 3: Button Clicks ✅ NEW!
- **Source**: GA4 `waitlist_modal_open` events
- **Measure**: How many site visitors click waitlist buttons
- **Key Metric**: Site Click → Button Click conversion rate

### Stage 4: Modal Engagement ⚠️ Partially Tracked
- **Current**: Modal opens tracked, modal abandonment not tracked
- **Opportunity**: Add modal close tracking for full funnel

### Stage 5: Waitlist Signups ✅
- **Source**: GA4 `waitlist_signup` events  
- **Current**: Unknown quantity (need GA4 MCP analysis)
- **Key Metric**: Button Click → Signup conversion rate

## GA4 Analysis Plan (Manual Until MCP Bug Resolved)

### Immediate Questions to Answer:
1. **How many waitlist signups per month?** (Check `waitlist_signup` events)
2. **Which pages drive signups?** (Event parameter analysis)
3. **What's the signup source breakdown?** (Organic vs other traffic)
4. **When do people sign up?** (Time patterns, session duration)

### Manual GA4 Dashboard Setup:
1. **Go to**: [Google Analytics → donationtransparency.org property](https://analytics.google.com/)
2. **Create Custom Report**:
   - Primary metric: `waitlist_signup` events
   - Secondary metric: `waitlist_modal_open` events (starting Sept 3)
   - Dimensions: Page, Source/Medium, Device
   - Date range: Last 30 days

3. **Key Comparisons**:
   - Before/after Sept 3 (title optimizations)  
   - Organic search vs other sources
   - Homepage vs guide page performance

## Expected Insights (Within 1-2 Weeks)

### Scenario A: Good Button Clicks, Low Signups
- **Problem**: Modal or signup form
- **Solution**: Optimize modal copy, reduce form friction
- **Focus**: Conversion rate optimization

### Scenario B: Low Button Clicks, Good Conversion  
- **Problem**: Value proposition or CTA messaging
- **Solution**: A/B test button copy, improve value props
- **Focus**: Traffic and messaging optimization

### Scenario C: Good Funnel, Need More Traffic
- **Problem**: Scale, not conversion
- **Solution**: Content expansion, more SEO opportunities
- **Focus**: Traffic acquisition

## Success Metrics to Track

### Short-term (2 weeks):
- `waitlist_modal_open` events per week
- Button click → signup conversion rate
- Impact of title optimizations on click-through

### Medium-term (1 month):
- Total conversion funnel improvement
- Source attribution for highest-quality signups  
- Mobile vs desktop performance differences

### Long-term (3 months):
- Monthly signup growth rate
- Cost per signup (if adding paid channels)
- Signup → actual trial/customer conversion

## Action Items

### Week 1: Data Collection
- [ ] Monitor new `waitlist_modal_open` events in GA4
- [ ] Document baseline metrics from existing `waitlist_signup` events
- [ ] Set up custom GA4 dashboard for conversion funnel

### Week 2: Analysis & Optimization  
- [ ] Analyze button click vs signup conversion rate
- [ ] Identify biggest drop-off point in funnel
- [ ] Plan optimization based on data (modal, CTA, or traffic focus)

### Ongoing: Performance Monitoring
- [ ] Weekly conversion funnel reviews
- [ ] A/B tests based on data insights
- [ ] Scale successful patterns across site

This tracking implementation gives us the missing piece to understand exactly where people drop off in our conversion funnel and optimize accordingly.