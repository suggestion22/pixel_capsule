# Deployment Notes

Pixel Capsule is now a pure static site. No Node, package manager, or build step is required for deployment.

## GitHub

```bash
git add .
git commit -m "Convert to static site structure"
git push origin main
```

## Cloudflare Pages

Recommended setup:

- Connect `suggestion22/pixel_capsule` to Cloudflare Pages.
- Framework preset: None
- Build command: leave empty
- Build output directory: `/`

## GitHub Pages

The site can also be served from GitHub Pages. The JavaScript navigation detects the `/pixel_capsule/` project path, and HTML asset references use relative paths.

## Privacy Note

Image processing is client-side. If server-side upload or storage is added later, update `privacy-policy/index.html` before deployment.
