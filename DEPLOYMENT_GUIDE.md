# Deployment Guide for Zutok Softwares Website

This guide will help you deploy your React application to your website zutok.in via GitHub Pages.

## Prerequisites

1. Make sure you have Node.js installed on your system
2. Make sure you have Git installed on your system
3. Make sure you have a GitHub account

## Setup Instructions

### 1. Configure GitHub Repository

1. Create a new repository on GitHub (or use an existing one) named `zutok.in` or any name you prefer
2. Make sure your local repository is connected to the GitHub repository:
   ```bash
   git remote set-url origin https://github.com/your-username/your-repo-name.git
   ```

### 2. Update package.json (Already Done)

The following changes have already been made to your package.json:
- Added `"homepage": "https://zutok.in"` field
- Added deployment scripts:
  ```json
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
  ```

### 3. Install Required Dependencies (Already Done)

The gh-pages package has already been installed:
```bash
npm install gh-pages --save-dev
```

## Deployment Steps

### 1. Build and Deploy

To deploy your application, simply run:
```bash
npm run deploy
```

This command will:
- Automatically build your application (via predeploy script)
- Deploy the built files to the `gh-pages` branch of your GitHub repository

### 2. Configure GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Scroll down to "Pages" section in the left sidebar
4. Under "Source", select "Deploy from a branch"
5. Select "gh-pages" branch and "/ (root)" folder
6. Click "Save"

### 3. Configure Custom Domain (zutok.in)

1. In the same "Pages" section on GitHub
2. In the "Custom domain" field, enter `zutok.in`
3. Click "Save"
4. Check the "Enforce HTTPS" box (recommended)

## DNS Configuration for zutok.in

To point your domain zutok.in to GitHub Pages, you need to configure your DNS settings:

1. Add an A record pointing to GitHub's IP addresses:
   ```
   A @ 185.199.108.153
   A @ 185.199.109.153
   A @ 185.199.110.153
   A @ 185.199.111.153
   ```

2. Add a CNAME record for www (if needed):
   ```
   CNAME www your-username.github.io
   ```

## Manual Deployment (Alternative Method)

If you prefer to deploy manually:

1. Build your application:
   ```bash
   npm run build
   ```

2. Commit and push your changes:
   ```bash
   git add .
   git commit -m "Build for deployment"
   git push origin main
   ```

3. Deploy to GitHub Pages:
   ```bash
   npx gh-pages -d build
   ```

## Troubleshooting

### Common Issues

1. **Deployment fails**: Make sure you have the correct repository URL and permissions
2. **Custom domain not working**: Ensure DNS records are correctly set up and wait for DNS propagation (can take up to 24 hours)
3. **HTTPS not working**: It may take some time for GitHub to provision an SSL certificate for your custom domain

### Clearing Cache

If you need to force a redeploy:
```bash
npm run clean-cache
npm run deploy
```

## Future Updates

To update your website:

1. Make your changes to the code
2. Test locally with `npm start`
3. Commit your changes:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```
4. Deploy the updates:
   ```bash
   npm run deploy
   ```

Your website will be available at https://zutok.in after the initial deployment is complete and DNS has propagated.