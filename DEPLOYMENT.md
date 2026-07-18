# Deployment Notes

Pixel Capsule is structured so the same repository can be stored on GitHub and deployed on Cloudflare.

## GitHub

1. Create a GitHub repository.
2. Add it as `origin`.
3. Commit and push the project files.

```bash
git remote add origin https://github.com/YOUR_NAME/pixel-capsule.git
git add .
git commit -m "Build Pixel Capsule MVP"
git push -u origin main
```

## Cloudflare Pages

Recommended setup:

- Connect the GitHub repository to Cloudflare Pages.
- Build command: `pnpm run build`
- Node.js compatibility: Node 22 or newer.
- Keep image processing client-side unless the privacy policy is updated.

## Optional GitHub Actions Deployment

The workflow in `.github/workflows/cloudflare-pages.yml` is a template. Configure these repository secrets before enabling it:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_PROJECT_NAME`
