# Marvel Digest - Netlify Deployment Guide

## Quick Deploy (Recommended)

### Option 1: Drag & Drop
1. Go to [netlify.com](https://netlify.com)
2. Sign up/Login to your account
3. Click "Add new site" → "Deploy manually"
4. Drag your entire `marveldigest` folder to the deployment area
5. Wait for deployment to complete
6. Your site will be live at a random URL (e.g., `https://amazing-site-123456.netlify.app`)

### Option 2: Git Integration
1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/marveldigest.git
   git push -u origin main
   ```

2. Connect to Netlify:
   - Go to Netlify dashboard
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub and select your repository
   - Deploy settings:
     - Build command: (leave empty)
     - Publish directory: `.` (root)

## Custom Domain Setup

1. In your Netlify dashboard, go to "Domain settings"
2. Click "Add custom domain"
3. Enter your domain (e.g., `marveldigest.com`)
4. Follow the DNS configuration instructions
5. Update your `index.html` meta tags with the correct domain

## Environment Variables (if needed)

If you have any API keys or environment variables, add them in:
- Netlify Dashboard → Site settings → Environment variables

## Post-Deployment Checklist

- [ ] Test all pages work correctly
- [ ] Verify images load properly
- [ ] Check mobile responsiveness
- [ ] Test contact forms (if any)
- [ ] Verify SEO meta tags
- [ ] Test social media sharing
- [ ] Check loading speed

## Troubleshooting

### Common Issues:
1. **404 errors**: Check that `index.html` is in the root directory
2. **Images not loading**: Verify image paths are relative
3. **CSS/JS not working**: Check file paths in your HTML
4. **Redirects not working**: Verify `netlify.toml` configuration

### Support:
- Netlify Docs: https://docs.netlify.com
- Netlify Community: https://community.netlify.com

## Performance Tips

1. Optimize images before uploading
2. Minify CSS and JavaScript files
3. Enable Netlify's asset optimization
4. Use CDN for external resources
5. Implement lazy loading for images

Your site should now be live and accessible worldwide! 🚀 