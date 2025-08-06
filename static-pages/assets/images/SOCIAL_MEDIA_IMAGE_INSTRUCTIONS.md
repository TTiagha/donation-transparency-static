# Social Media Feature Image Instructions

## What You Need to Do

### Step 1: Create the Images
1. Open `/static-pages/assets/images/og-image-generator.html` in your browser
2. You'll see TWO social media card designs:
   - **Facebook/LinkedIn version** (1200x630px) - the first one
   - **Twitter/X version** (1200x600px) - the second one

### Step 2: Take Screenshots
1. **For Facebook/LinkedIn:**
   - Take a screenshot of the FIRST card (1200x630)
   - Save as: `bluesky-fundraising-og.png`
   
2. **For Twitter/BlueSky:**
   - Take a screenshot of the SECOND card (1200x600)
   - Save as: `bluesky-fundraising-twitter.png`

### Step 3: Save Images
Save both PNG files to: `/static-pages/assets/images/`

## Meta Tags Already Configured ✅

The blog post already has the correct meta tags pointing to these image filenames:

```html
<!-- Open Graph (Facebook/LinkedIn) -->
<meta property="og:image" content="https://donationtransparency.org/assets/images/bluesky-fundraising-og.png">

<!-- Twitter Card -->
<meta name="twitter:image" content="https://donationtransparency.org/assets/images/bluesky-fundraising-twitter.png">
```

## How It Works

When someone shares your link on social media:
1. The platform reads the meta tags from your HTML
2. It finds the image URL in the meta tags
3. It downloads and displays that image as a preview card

## Testing Your Images

After uploading to GitHub:
- **Facebook:** Use [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- **Twitter:** Use [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- **LinkedIn:** Use [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

Enter your URL: `https://donationtransparency.org/blog/bluesky-fundraising-analysis.html`

## Image Requirements

✅ **Facebook/LinkedIn:**
- Recommended: 1200x630px
- Minimum: 600x315px
- Format: PNG or JPG
- Max file size: 8MB

✅ **Twitter/X:**
- Recommended: 1200x600px (2:1 ratio)
- Minimum: 300x157px
- Format: PNG, JPG, or WebP
- Max file size: 5MB

## Alternative: Use an Online Tool

If taking screenshots is difficult, you can use:
- [HTML to Image converter](https://htmlcsstoimage.com/)
- [Bannerbear](https://www.bannerbear.com/)
- [Placid](https://placid.app/)

Just paste the HTML from og-image-generator.html and download the resulting image.