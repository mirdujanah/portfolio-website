# Deployment Guide - Portfolio Website

This guide will help you deploy your portfolio website to GitHub Pages for free hosting.

## 🚀 Deploy to GitHub Pages

### Step 1: Create a GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in to your account
2. Click the "+" icon in the top right corner and select "New repository"
3. Name your repository: `portfolio-website` (or any name you prefer)
4. Make it **Public** (required for free GitHub Pages)
5. **Don't** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

### Step 2: Connect Your Local Repository

Run these commands in your terminal (replace `YOUR_USERNAME` with your GitHub username):

```bash
# Add the remote repository
git remote add origin https://github.com/YOUR_USERNAME/portfolio-website.git

# Push your code to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Scroll down to "Pages" section (in the left sidebar)
4. Under "Source", select "Deploy from a branch"
5. Choose "main" branch and "/ (root)" folder
6. Click "Save"

### Step 4: Access Your Website

Your portfolio will be available at:
```
https://YOUR_USERNAME.github.io/portfolio-website
```

## 🌐 Alternative Deployment Options

### Netlify (Recommended)

1. Go to [Netlify.com](https://netlify.com) and sign up/login
2. Drag and drop your `portfolio-website` folder to the deploy area
3. Your site will be deployed instantly with a random URL
4. You can customize the URL in settings

### Vercel

1. Go to [Vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Deploy automatically

### Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Deploy: `firebase deploy`

## 📝 Custom Domain (Optional)

### GitHub Pages with Custom Domain

1. In your repository settings > Pages
2. Add your custom domain in the "Custom domain" field
3. Create a `CNAME` file in your repository root with your domain
4. Update your DNS settings with your domain provider

### Netlify with Custom Domain

1. Go to Site settings > Domain management
2. Add custom domain
3. Follow the DNS configuration instructions

## 🔧 Post-Deployment Checklist

- [ ] Test all links and navigation
- [ ] Verify contact form works
- [ ] Check responsive design on mobile
- [ ] Test loading speed
- [ ] Update social media links
- [ ] Add Google Analytics (optional)
- [ ] Set up custom domain (optional)

## 📊 Performance Optimization

### Before Deployment

1. **Optimize Images**: Compress images using tools like TinyPNG
2. **Minify CSS/JS**: Use online minifiers or build tools
3. **Enable Gzip**: Most hosting providers do this automatically
4. **Use CDN**: Font Awesome and Google Fonts are already CDN-hosted

### After Deployment

1. **Test Page Speed**: Use Google PageSpeed Insights
2. **Check Mobile Performance**: Test on various devices
3. **Monitor Analytics**: Set up Google Analytics if needed

## 🐛 Troubleshooting

### Common Issues

1. **Site not loading**: Check if repository is public
2. **Styles not loading**: Verify file paths are correct
3. **Images not showing**: Check image file names and paths
4. **Contact form not working**: Ensure JavaScript is enabled

### GitHub Pages Issues

- **Build errors**: Check for any syntax errors in HTML/CSS/JS
- **404 errors**: Ensure `index.html` is in the root directory
- **Slow loading**: Optimize images and external resources

## 📞 Support

If you encounter any issues:

1. Check the browser console for errors
2. Verify all file paths are correct
3. Ensure all files are committed and pushed
4. Check GitHub Pages settings

## 🎉 Success!

Once deployed, your portfolio will be accessible to potential employers and collaborators worldwide. Remember to:

- Keep your projects updated
- Add new skills as you learn them
- Update contact information when needed
- Share your portfolio URL on LinkedIn and other professional networks

---

**Your portfolio is now live and ready to showcase your talents! 🚀** 