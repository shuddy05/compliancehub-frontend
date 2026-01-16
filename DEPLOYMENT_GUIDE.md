# Hostinger Deployment Guide

## Files Ready for Deployment

The `dist/` folder contains all the files needed for production deployment:
- `index.html` - Main entry point
- `assets/` - JavaScript and CSS bundles
- `.htaccess` - Apache configuration for SPA routing (included)
- `robots.txt` - SEO robots configuration

## Hostinger Deployment Steps

### Step 1: Connect via FTP/SFTP
1. Log in to your Hostinger control panel
2. Navigate to **Files** > **FTP Accounts**
3. Use your FTP credentials to connect via FileZilla or similar FTP client

### Step 2: Upload Files
1. Connect to your FTP server
2. Navigate to the `public_html` directory (your site root)
3. Delete existing files in `public_html` (backup first if needed)
4. Upload all files from the `dist/` folder to `public_html`

**Important:** Make sure `.htaccess` is uploaded (it's a hidden file, so enable "Show hidden files" in your FTP client)

### Step 3: Verify .htaccess is Present
- The `.htaccess` file in the root handles:
  - SPA routing (all routes point to index.html)
  - Browser caching for assets
  - Gzip compression
  - Security headers

### Step 4: Test Your Site
1. Visit your domain in a browser
2. Test navigation between pages
3. Refresh a page to ensure routing works
4. Check browser console for any errors

## Deployment Checklist

- [ ] Files uploaded to `public_html`
- [ ] `.htaccess` file present in root
- [ ] Site loads without 404 errors
- [ ] Page navigation works
- [ ] Refresh doesn't break routing
- [ ] Assets load (CSS/JS bundles)

## Troubleshooting

### Routes return 404
- Verify `.htaccess` is in `public_html`
- Enable mod_rewrite on your server (Hostinger usually has this enabled)
- Contact Hostinger support if mod_rewrite is disabled

### Assets don't load
- Check browser console for 404 errors
- Verify files are uploaded correctly
- Clear browser cache

### Site is slow
- The `.htaccess` includes gzip compression which should help
- Assets are cached in browsers for 1 year
- Consider optimizing images if loading is still slow

## Key Files in dist/

```
dist/
├── index.html              (Entry point - 1.46 kB)
├── .htaccess              (Apache config)
├── robots.txt             (SEO)
└── assets/
    ├── index-*.css        (Tailwind CSS - 14.14 kB gzipped)
    └── index-*.js         (React app - 263.44 kB gzipped)
```

## Environment Variables

If your app requires environment variables, create a `.env.production` file in the root (not needed for this static app unless you add API calls later).

## Updates & Future Deployments

For future updates:
1. Make changes locally
2. Run `npm run build`
3. Upload new files from `dist/` folder to `public_html`
4. No need to re-upload `.htaccess` unless you modify it

---

**Last Updated:** December 23, 2025
**Build Size:** 988.41 kB (263.44 kB gzipped)
**Recommended:** Monitor your Hostinger account for storage usage
