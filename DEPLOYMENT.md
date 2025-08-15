# 🚀 Deployment Guide - Time Chef Challenge

This guide will help you deploy your Time Chef Challenge game to GitHub Pages with your custom domain `hemalsingh.tech`.

## 📋 Prerequisites

- GitHub account
- Custom domain `hemalsingh.tech` (already purchased)
- Git installed on your computer

## 🔧 Step-by-Step Deployment

### 1. Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right and select "New repository"
3. Name your repository (e.g., `time-chef-challenge`)
4. Make it **Public** (required for free GitHub Pages)
5. Don't initialize with README (we already have one)
6. Click "Create repository"

### 2. Upload Your Code

```bash
# Navigate to your project directory
cd /path/to/your/game

# Initialize git repository
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial commit: Time Chef Challenge game"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/time-chef-challenge.git

# Push to GitHub
git push -u origin main
```

### 3. Configure GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section (in the left sidebar)
4. Under **Source**, select **Deploy from a branch**
5. Choose **main** branch and **/(root)** folder
6. Click **Save**

### 4. Set Up Custom Domain

1. In the same **Pages** settings section
2. Under **Custom domain**, enter: `hemalsingh.tech`
3. Check **Enforce HTTPS** (recommended)
4. Click **Save**

### 5. Configure DNS Settings

You need to configure your domain's DNS settings at your domain registrar (.tech domains):

#### Option A: A Records (Recommended)
Add these A records to your domain's DNS:
```
Type: A
Name: @
Value: 185.199.108.153

Type: A
Name: @
Value: 185.199.109.153

Type: A
Name: @
Value: 185.199.110.153

Type: A
Name: @
Value: 185.199.111.153
```

#### Option B: CNAME Record
Add this CNAME record:
```
Type: CNAME
Name: @
Value: YOUR_USERNAME.github.io
```

### 6. Verify Deployment

1. Wait 5-10 minutes for DNS propagation
2. Visit `https://hemalsingh.tech` to verify your site is live
3. Check that the CNAME file is automatically created in your repository

## 🔄 Automatic Deployment

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that will automatically deploy your site when you push changes to the main branch.

## 📱 PWA Features

Your game is configured as a Progressive Web App (PWA) with:
- ✅ Service Worker for offline functionality
- ✅ Web App Manifest for installability
- ✅ Custom icons and theme colors
- ✅ Responsive design for all devices

## 🔍 SEO Optimization

The site includes:
- ✅ Meta tags for social sharing
- ✅ Sitemap.xml for search engines
- ✅ Robots.txt for crawler guidance
- ✅ Open Graph tags for Facebook/Twitter
- ✅ Structured data for better search results

## 🛠️ Troubleshooting

### Common Issues:

1. **Domain not working**: Wait 24-48 hours for DNS propagation
2. **HTTPS not working**: Make sure "Enforce HTTPS" is checked in GitHub Pages settings
3. **404 errors**: Ensure all files are in the root directory of your repository
4. **CNAME not created**: GitHub will create it automatically when you set the custom domain

### Check DNS Propagation:
- Use [whatsmydns.net](https://whatsmydns.net) to check if your DNS changes have propagated
- Use [dnschecker.org](https://dnschecker.org) to verify DNS records

## 📊 Analytics (Optional)

To add Google Analytics:

1. Create a Google Analytics account
2. Add your tracking code to the `<head>` section of `index.html`
3. Replace `GA_TRACKING_ID` with your actual tracking ID

## 🔒 Security

- ✅ HTTPS is enforced
- ✅ Content Security Policy headers are included
- ✅ No sensitive data is exposed in client-side code

## 📈 Performance

Your game is optimized for:
- ✅ Fast loading with CDN resources
- ✅ Offline functionality via Service Worker
- ✅ Responsive design for all screen sizes
- ✅ Minimal bundle size

## 🎉 Success!

Once deployed, your game will be available at:
- **Primary URL**: https://hemalsingh.tech
- **GitHub Pages URL**: https://YOUR_USERNAME.github.io/time-chef-challenge

Your Time Chef Challenge game is now live and ready to be played by the world! 🍳✨
