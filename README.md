# Pixel Capsule

Pixel Capsule is a free static browser-based image utility site for resizing, compressing, converting, and preparing common web and social image sizes.

## Structure

```text
/
├─ index.html
├─ tools/
│  ├─ image-resizer/index.html
│  ├─ image-compressor/index.html
│  ├─ image-converter/index.html
│  └─ image-presets/index.html
├─ guides/
├─ about/
├─ contact/
├─ privacy-policy/
├─ terms/
├─ assets/
│  ├─ css/
│  ├─ js/
│  └─ data/
├─ 404.html
├─ robots.txt
└─ sitemap.xml
```

## Features

- Browser-side image processing with File API, Canvas, Blob, and object URLs
- Image resizing with aspect-ratio lock and percentage scaling
- Image compression with quality controls and before/after size comparison
- JPG, PNG, and WebP conversion with JPG background color handling
- Social and web image size presets stored as data
- Random idea capsule tips that never block downloads
- Korean-first content, responsive layout, dark mode, policy pages, robots.txt, and sitemap.xml

## Local Preview

Open `index.html` directly in a browser, or run a simple static server:

```bash
python -m http.server 8080
```

## Cloudflare Pages

Use these settings:

- Framework preset: None
- Build command: leave empty
- Build output directory: `/`

The GitHub Actions workflow deploys the repository root directly.
