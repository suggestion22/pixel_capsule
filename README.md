# Pixel Capsule

Pixel Capsule is a free browser-based image utility site for resizing, compressing, converting, and preparing common web and social image sizes.

## Features

- Browser-side image processing with File API, Canvas, Blob, and object URLs
- Image resizing with aspect-ratio lock and percentage scaling
- Image compression with quality controls and before/after size comparison
- JPG, PNG, and WebP conversion with JPG background color handling
- Social and web image size presets
- Random idea capsule tips that never block downloads
- Korean-first content, responsive layout, dark mode, policy pages, robots.txt, and sitemap.xml

## Local Development

```bash
pnpm install
pnpm run dev
```

## Production Build

```bash
pnpm run build
```

## GitHub And Cloudflare Pages

The repository is ready to push to GitHub. For Cloudflare Pages, use:

- Build command: `pnpm run build`
- Node.js version: `22.13.0` or newer
- Package manager: `pnpm`

If using GitHub Actions, add the Cloudflare secrets referenced in `.github/workflows/cloudflare-pages.yml`.
