# SEO Guide for Donation Pages (app.donationtransparency.org)

## Meta Tags Template for Donation Pages

Each donation page should include these dynamic meta tags:

```html
<head>
    <title>Donate to [Organization Name] - Transparent Fundraising | Donation Transparency</title>
    <meta name="description" content="Support [Organization Name] with transparent donation tracking. See exactly how your donation is used with real-time impact reporting.">
    <meta name="keywords" content="donate to [organization], transparent donation, [cause keywords], real-time tracking">
    
    <!-- Open Graph for Social Sharing -->
    <meta property="og:title" content="Donate to [Organization Name] - Transparent Fundraising">
    <meta property="og:description" content="Support [Organization Name] with transparent donation tracking. See exactly how your donation is used.">
    <meta property="og:image" content="[Organization Logo or Campaign Image]">
    <meta property="og:url" content="https://app.donationtransparency.org/donate/?username=[username]">
    <meta property="og:type" content="website">
    
    <!-- Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Donate to [Organization Name] - Transparent Fundraising">
    <meta name="twitter:description" content="Support [Organization Name] with transparent donation tracking.">
    <meta name="twitter:image" content="[Organization Logo or Campaign Image]">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://app.donationtransparency.org/donate/?username=[username]">
</head>
```

## Schema Markup for Donation Pages

Add structured data to help search engines understand the donation context:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "DonateAction",
  "agent": {
    "@type": "Person",
    "name": "Donor"
  },
  "recipient": {
    "@type": "Organization",
    "name": "[Organization Name]",
    "url": "https://app.donationtransparency.org/donate/?username=[username]",
    "description": "[Organization Mission/Description]"
  },
  "object": {
    "@type": "MonetaryGrant",
    "funder": {
      "@type": "Person",
      "name": "Donor"
    },
    "fundedItem": {
      "@type": "Project",
      "name": "[Campaign/Project Name]",
      "description": "[What the funds will be used for]"
    }
  },
  "instrument": {
    "@type": "Service",
    "name": "Donation Transparency Platform",
    "description": "Transparent donation tracking with real-time impact reporting"
  }
}
</script>
```

## Page Title Optimization

Dynamic title templates based on organization type:

### For Nonprofits:
`"Donate to [Nonprofit Name] - [Cause] | Donation Transparency"`

### For Individual Fundraisers:
`"Support [Person Name]'s [Cause] Fundraiser | Donation Transparency"`

### For Emergency Campaigns:
`"Emergency Fund: [Campaign Name] - Transparent Donations | Donation Transparency"`

## Content Optimization

### H1 Tag Structure:
```html
<h1>Support [Organization Name] with Transparent Donations</h1>
```

### Key Content Elements:
1. **Clear Value Proposition**: "See exactly how your donation is used"
2. **Trust Indicators**: "Real-time tracking" and "Full transparency"
3. **Impact Statement**: What the organization does/achieves
4. **Transparency Promise**: "Track your donation from gift to impact"

## URL Structure Best Practices

Current: `https://app.donationtransparency.org/donate/?username=fadoa`

### Recommendations:
1. **Keep current structure** - it's clean and functional
2. **Consider adding campaign slugs** for specific campaigns:
   - `https://app.donationtransparency.org/donate/fadoa/save-rainforest`
3. **Ensure consistent casing** in usernames for SEO
4. **Add utm parameters** for tracking traffic sources

## Image Optimization

### Required Images with Alt Text:
- Organization logo: `alt="[Organization Name] logo"`
- Campaign images: `alt="[Campaign description for screen readers]"`
- Impact photos: `alt="[Specific impact description]"`

### Image Schema:
```html
<meta property="og:image" content="[URL]">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="[Organization Name] transparent fundraising campaign">
```

## Performance Considerations

1. **Page Load Speed**: Donation pages should load quickly
2. **Mobile Optimization**: Ensure responsive design for mobile donors
3. **Core Web Vitals**: Monitor LCP, FID, and CLS metrics
4. **SSL/HTTPS**: Already handled by app subdomain

## Content Guidelines

### Unique Content for Each Page:
- Don't duplicate content across donation pages
- Each organization should have unique descriptions
- Personalize the transparency messaging

### Keywords to Include:
- "transparent donation"
- "real-time tracking"
- "donation transparency"
- "[specific cause] donation"
- "trusted fundraising"

## Monitoring & Analytics

### Track These Metrics:
1. **Organic traffic** to donation pages
2. **Conversion rate** from search traffic
3. **Social sharing** of donation pages
4. **Page load speed** and user experience
5. **Mobile vs desktop** usage patterns

## Implementation Checklist

- [ ] Deploy robots.txt to app.donationtransparency.org
- [ ] Add dynamic meta tags to donation page template
- [ ] Implement schema markup for DonateAction
- [ ] Optimize images with proper alt text
- [ ] Set up tracking for donation page performance
- [ ] Test social sharing appearance
- [ ] Verify mobile responsiveness
- [ ] Check page load speeds

## Benefits of This SEO Strategy

1. **Increased Discoverability**: Organizations get found through search
2. **Trust Building**: SEO-optimized pages appear more credible
3. **Social Virality**: Optimized sharing increases reach
4. **Competitive Advantage**: Most donation platforms ignore SEO
5. **Organic Growth**: Free traffic to donation pages