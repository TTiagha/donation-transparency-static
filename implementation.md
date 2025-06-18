# Complete Local Development Setup Guide
## Static Pages + Blog with Live Preview

This guide will walk you through setting up a complete local development environment for your static pages and blog, with instant visual preview capabilities.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [VS Code Setup](#vs-code-setup)
3. [Project Structure](#project-structure)
4. [Simple HTML/CSS Setup](#simple-htmlcss-setup)
5. [Next.js Setup (For Blog)](#nextjs-setup-for-blog)
6. [Content Management](#content-management)
7. [Development Workflow](#development-workflow)
8. [Pre-Amplify Checklist](#pre-amplify-checklist)

## Prerequisites

### Required Software
1. **VS Code** - Download from [code.visualstudio.com](https://code.visualstudio.com)
2. **Node.js** (for Next.js) - Download from [nodejs.org](https://nodejs.org) (LTS version)
3. **Git** - Download from [git-scm.com](https://git-scm.com)

### Verify Installation
```bash
# Check Node.js
node --version  # Should show v18.x.x or higher

# Check npm
npm --version   # Should show 9.x.x or higher

# Check Git
git --version   # Should show 2.x.x or higher
```

## VS Code Setup

### Essential Extensions

Install these VS Code extensions for the best development experience:

#### 1. **Live Server** (MUST HAVE)
- **Name**: Live Server by Ritwick Dey
- **Purpose**: Instant preview of HTML changes
- **Install**: Search "Live Server" in Extensions (Ctrl+Shift+X)

#### 2. **Prettier** (Code Formatting)
- **Name**: Prettier - Code formatter
- **Purpose**: Auto-format your code
- **Install**: Search "Prettier" in Extensions

#### 3. **HTML CSS Support**
- **Name**: HTML CSS Support
- **Purpose**: CSS class suggestions in HTML
- **Install**: Search "HTML CSS Support"

#### 4. **Color Highlight**
- **Name**: Color Highlight
- **Purpose**: See colors in your code
- **Install**: Search "Color Highlight"

#### 5. **Image Preview**
- **Name**: Image preview
- **Purpose**: See images on hover
- **Install**: Search "Image preview"

### Next.js Specific Extensions (For Blog)

#### 6. **ES7+ React/Redux/React-Native**
- **Name**: ES7+ React/Redux/React-Native snippets
- **Purpose**: React code snippets
- **Install**: Search "ES7+ React"

#### 7. **Tailwind CSS IntelliSense**
- **Name**: Tailwind CSS IntelliSense
- **Purpose**: Tailwind class suggestions
- **Install**: Search "Tailwind CSS IntelliSense"

#### 8. **Next.js snippets**
- **Name**: Next.js snippets
- **Purpose**: Next.js code templates
- **Install**: Search "Next.js snippets"

#### 9. **GitLens**
- **Name**: GitLens
- **Purpose**: Better Git integration
- **Install**: Search "GitLens"

#### 10. **Path Intellisense**
- **Name**: Path Intellisense
- **Purpose**: Auto-complete file paths
- **Install**: Search "Path Intellisense"

### VS Code Settings

Create a `.vscode/settings.json` in your project:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "liveServer.settings.port": 5500,
  "liveServer.settings.CustomBrowser": "chrome",
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 1000,
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "tailwindCSS.includeLanguages": {
    "html": "html",
    "javascript": "javascript",
    "css": "css"
  }
}
```

## Project Structure

Create this folder structure on your laptop:

```
donation-transparency-static/
├── static-pages/           # Simple HTML pages
│   ├── index.html         # Homepage (you already have this)
│   ├── about.html         # About page
│   ├── contact.html       # Contact page
│   ├── assets/
│   │   ├── css/
│   │   │   └── styles.css
│   │   ├── js/
│   │   │   └── main.js
│   │   └── images/
│   └── .vscode/
│       └── settings.json
│
└── blog-nextjs/           # Next.js blog (separate)
    ├── pages/
    ├── components/
    ├── public/
    └── package.json
```

## Simple HTML/CSS Setup

### Step 1: Create Project Folder
```bash
# Create main folder
mkdir donation-transparency-static
cd donation-transparency-static

# Create static pages folder
mkdir static-pages
cd static-pages

# Create subfolders
mkdir -p assets/css assets/js assets/images
mkdir .vscode
```

### Step 2: Save Your Homepage
1. Save your HTML file as `static-pages/index.html`
2. Extract inline CSS to `assets/css/styles.css`
3. Extract inline JS to `assets/js/main.js`

### Step 3: Update HTML to Link External Files

In your `index.html`, replace the `<style>` tag with:
```html
<link rel="stylesheet" href="assets/css/styles.css">
```

And move JavaScript to external file:
```html
<script src="assets/js/main.js"></script>
```

### Step 4: Create About Page Template

Create `about.html`:
```html
<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About - Donation Transparency</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body class="bg-dt-navy">
    <!-- Copy header from homepage -->
    
    <main class="pt-24">
        <section class="py-20">
            <div class="container mx-auto px-6">
                <h1 class="text-4xl font-bold text-dt-silver">About Us</h1>
                <!-- Add your content here -->
            </div>
        </section>
    </main>
    
    <!-- Copy footer from homepage -->
    <script src="assets/js/main.js"></script>
</body>
</html>
```

### Step 5: Test with Live Server

1. Open VS Code in your `static-pages` folder
2. Right-click `index.html`
3. Select "Open with Live Server"
4. Browser opens at `http://localhost:5500`
5. Make changes and watch them update instantly!

## Next.js Setup (For Blog)

### Step 1: Create Next.js Blog

Open a new terminal in your main folder:

```bash
# Go back to main folder
cd donation-transparency-static

# Create Next.js app
npx create-next-app@latest blog-nextjs --typescript --tailwind --app

# Answer the prompts:
# ✔ Would you like to use ESLint? → Yes
# ✔ Would you like to use src/ directory? → No
# ✔ Would you like to customize the default import alias? → No

cd blog-nextjs
```

### Step 2: Install Additional Dependencies

```bash
# Markdown processing for blog
npm install gray-matter remark remark-html

# SEO
npm install next-seo

# Sitemap
npm install next-sitemap
```

### Step 3: Create Blog Structure

Create these folders:
```bash
mkdir -p content/blog
mkdir -p app/blog/[slug]
mkdir components
```

### Step 4: Create Blog List Page

Create `app/blog/page.tsx`:
```typescript
import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold mb-10">Blog</h1>
        <div className="grid gap-8">
          {posts.map((post) => (
            <article key={post.slug} className="bg-gray-800 p-6 rounded-lg">
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-2xl font-bold hover:text-teal-400">
                  {post.title}
                </h2>
              </Link>
              <p className="mt-2 text-gray-400">{post.excerpt}</p>
              <time className="text-sm text-gray-500">{post.date}</time>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
```

### Step 5: Create Blog Post Template

Create `app/blog/[slug]/page.tsx`:
```typescript
import { getPostBySlug, getAllPosts } from '@/lib/blog'

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)

  return (
    <article className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-20 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <time className="text-gray-400">{post.date}</time>
        <div 
          className="mt-10 prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </article>
  )
}
```

### Step 6: Create Blog Helper Functions

Create `lib/blog.ts`:
```typescript
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'content/blog')

export async function getAllPosts() {
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = await Promise.all(
    fileNames.map(async (fileName) => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)

      return {
        slug,
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
      }
    })
  )

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getPostBySlug(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  
  const processedContent = await remark()
    .use(html)
    .process(content)
  
  return {
    slug,
    content: processedContent.toString(),
    title: data.title,
    date: data.date,
    excerpt: data.excerpt,
  }
}
```

### Step 7: Create Sample Blog Post

Create `content/blog/welcome-to-our-blog.md`:
```markdown
---
title: "Welcome to Donation Transparency Blog"
date: "2025-01-12"
excerpt: "Learn how we're revolutionizing charitable giving with real-time transparency."
---

# Welcome to Our Blog

This is where we'll share stories of impact, tips for fundraisers, and updates about our platform.

## Why Transparency Matters

In a world where donor trust is at an all-time low, we believe transparency is the key to rebuilding confidence in charitable giving.

Stay tuned for more posts!
```

### Step 8: Run Next.js Development Server

```bash
npm run dev
```

Visit `http://localhost:3000/blog` to see your blog!

## Content Management

### Option 1: Markdown Files (Simple)
- Write posts in markdown files
- Save in `content/blog/`
- Commit to Git when ready

### Option 2: Headless CMS Setup (Advanced)

If you want a visual editor, install **Sanity**:

```bash
# In your blog-nextjs folder
npm create sanity@latest -- --project <your-project-id> --dataset production

# Follow the prompts to set up Sanity Studio
```

## Development Workflow

### Daily Workflow

1. **Start your day:**
   ```bash
   # For static pages
   cd static-pages
   code .  # Opens VS Code
   # Right-click index.html → Open with Live Server

   # For blog (in new terminal)
   cd blog-nextjs
   npm run dev
   ```

2. **Make changes:**
   - Edit HTML/CSS → See instant updates
   - Edit blog → See at localhost:3000

3. **Save your work:**
   ```bash
   git add .
   git commit -m "Update homepage colors"
   ```

### Testing Checklist

Before moving to Amplify, test:

- [ ] All pages load correctly
- [ ] Links between pages work
- [ ] Images display properly
- [ ] Responsive design on mobile
- [ ] Blog posts render correctly
- [ ] Navigation works
- [ ] Forms (if any) are set up

## Pre-Amplify Checklist

### Static Pages Ready
- [ ] Homepage complete
- [ ] About page complete
- [ ] Contact page complete
- [ ] All assets organized
- [ ] Responsive design tested

### Blog Ready
- [ ] Blog homepage works
- [ ] Individual posts render
- [ ] Navigation between posts
- [ ] SEO meta tags added
- [ ] Sample content created

### Technical Setup
- [ ] Git repository initialized
- [ ] All files committed
- [ ] GitHub repository created
- [ ] README.md with instructions

### Performance
- [ ] Images optimized
- [ ] CSS/JS minified
- [ ] Lighthouse score > 90

## Quick Reference Commands

```bash
# Static Pages
Right-click HTML → Open with Live Server

# Next.js Blog
npm run dev          # Development
npm run build        # Production build
npm run start        # Test production build

# Git
git add .
git commit -m "message"
git push origin main

# Check for issues
npm run lint         # Check code quality
npm run build        # Test production build
```

## Troubleshooting

### Live Server Not Working?
1. Make sure extension is installed
2. Check VS Code bottom bar for port number
3. Try different browser
4. Restart VS Code

### Next.js Issues?
1. Delete `node_modules` and `.next`
2. Run `npm install`
3. Run `npm run dev`

### Port Already in Use?
```bash
# Kill process on port 3000
npx kill-port 3000

# Kill process on port 5500
npx kill-port 5500
```

## Next Steps

Once you have:
1. ✅ Static pages working locally with Live Server
2. ✅ Blog skeleton running with Next.js
3. ✅ Made your desired changes
4. ✅ Everything committed to Git

Come back for:
1. Setting up GitHub repository
2. Connecting to AWS Amplify
3. Configuring custom domain
4. Setting up continuous deployment

---

## Resources

- [Live Server Tutorial](https://www.youtube.com/watch?v=WzE0yqwbdgU)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Markdown Guide](https://www.markdownguide.org/)

Remember: Start simple with the static pages, get comfortable with the workflow, then tackle the blog setup!