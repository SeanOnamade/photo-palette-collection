# Sean Onamade Photography

A photography portfolio site — fast, CDN-delivered, and built to handle 180+ images without choking the browser.

<img width="1898" height="906" alt="image" src="https://github.com/user-attachments/assets/c075de22-997b-436d-a932-34ffb6c47d41" />

## Quick Start

```bash
npm install
npm run dev        # development server (localhost:8080)
npm run build      # production build (compresses images, splits bundles)
npm run preview    # preview the production build locally
```

## Adding New Photos

1. Drop the photo into `public/images/`
2. Upload to Cloudinary (skips duplicates, auto-compresses files over 9 MB):
   ```bash
   node scripts/upload-to-cloudinary.mjs
   ```
3. Fetch its aspect ratio and patch it into the portfolio data:
   ```bash
   node scripts/fetch-aspect-ratios.mjs && node scripts/patch-aspect-ratios.mjs
   ```
   This runs two scripts back-to-back. The first asks Cloudinary for the image dimensions. The second inserts `aspectRatio: X.XXX` into the matching entry automatically. The aspect ratio is what the masonry layout uses to keep column bottoms even.
4. Add an entry to the `portfolioImages` array in `src/pages/PhotographyPortfolio.tsx`:
   ```ts
   {
     src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/YOUR_FILE.jpg",
     // aspectRatio is inserted automatically by step 3 — no need to fill it in manually
     alt: "Description of the photo",
     title: "Display Title",
     category: "Portrait" // Urban | Landscape | Events | Sports | Architecture | Fun | Misc.
   }
   ```
5. Commit and push — Netlify rebuilds automatically.

> **Tip:** Steps 2 and 3 are safe to re-run at any time. They skip images that are already uploaded or already have an aspect ratio.

## Performance Architecture

### Image Delivery
All 183 portfolio images live on **Cloudinary** (cloud: `dnhzt8ver`, folder: `portfolio`).  
Cloudinary serves them from 50+ global edge nodes and applies automatic transforms at request time:

| Context | Transform applied | Typical size |
|---|---|---|
| Blur placeholder | `w_20,h_20,q_10,e_blur:1000,f_auto` | ~1 KB |
| Gallery thumbnail | `w_700,q_65,f_auto` | ~80–200 KB |
| Lightbox full | `w_1920,q_85,f_auto` | ~300–600 KB |

`f_auto` means Cloudinary serves WebP to browsers that support it (Chrome, Edge, Firefox) and JPEG as fallback — automatically, no code changes needed.

### What Was Fixed (May 2026)
The site was loading impossibly slow due to a cascade of issues:

| Problem | Before | After |
|---|---|---|
| Local image sizes | 183 raw camera JPEGs, up to 35 MB each, 1.5 GB total | All on Cloudinary CDN; thumbnails ~80–200 KB via URL transform |
| Double image load | Each local image rendered twice (blur + sharp both pointed to same 35 MB file) | Blur placeholder only for Cloudinary images; single `<img>` for local fallback |
| Broken `useMemo` | `portfolioImages` array re-created every render, invalidating all memos | Stable deps — memos compute once on mount |
| No code splitting | All 4 pages + full Radix UI loaded on every visit | `React.lazy` + `Suspense` for portfolio and about pages |
| No JS chunk splitting | Single monolithic bundle | Separate `vendor-react`, `vendor-radix`, `vendor-ui` chunks |
| O(n) per-card lookup | `findIndex` called for every visible card every render | Pre-computed `Map<src, index>` — O(1) lookup |
| Preload hints wrong | Injected `<link rel="preload">` pointing to raw 35 MB files | Preload links use optimized Cloudinary thumbnail URLs |
| Hero image blank flash | Background chosen in `useEffect` — always blank on first paint | `useState` lazy initializer — image selected before first render |
| Third-party script | `gptengineer.js` from Lovable scaffolding loaded on every page | Removed |
| Unused library | `@tanstack/react-query` imported but zero queries in codebase | Removed |
| IntersectionObserver | `rootMargin: 600px` — aggressively queued downloads for unseen images | Reduced to `200px` |

### Build Pipeline
Production builds (`npm run build`) run two post-processing steps on images:

1. **`vite-plugin-image-optimizer`** — compresses all images in `dist/images/` at quality 75 (~80% size reduction on average)
2. **`scripts/resize-images.mjs`** — caps any image wider than 2000px (handles the remaining large files)

This matters for images that somehow end up served locally (e.g. the og-image, favicons), but the gallery itself is fully on Cloudinary so it benefits on every environment including `npm run dev`.

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 5 + SWC |
| Styling | Tailwind CSS + shadcn/ui |
| Image CDN | Cloudinary |
| Routing | React Router v6 |
| Deployment | Netlify (auto-deploy from `main`) |

## Project Structure

```
src/
├── components/
│   ├── ImageCard.tsx       # Single gallery card — blur placeholder + sharp fade-in
│   ├── ImageGallery.tsx    # Masonry grid, progressive loading, lightbox
│   ├── PortfolioHero.tsx   # Full-bleed hero section
│   ├── PortfolioSidebar.tsx
│   └── ui/                 # shadcn/ui primitives
├── pages/
│   ├── Index.tsx           # Landing page
│   ├── PhotographyPortfolio.tsx  # Main gallery (lazy-loaded)
│   ├── About.tsx           # About + contact (lazy-loaded)
│   └── NotFound.tsx
└── lib/
    └── utils.ts            # Cloudinary URL helpers, image utilities

scripts/
├── upload-to-cloudinary.mjs   # Bulk upload + auto-compress for new photos
├── patch-portfolio-urls.mjs   # One-time script to swap local paths → Cloudinary URLs
├── resize-images.mjs          # Post-build resize step (capped at 2000px wide)
└── cloudinary-url-map.json    # filename → Cloudinary URL mapping
```

## Environment

Create a `.env` file at the project root (never commit this):

```
CLOUDINARY_CLOUD_NAME=dnhzt8ver
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

The `.env` file is gitignored. Credentials are only needed to run the upload script — the deployed site uses public Cloudinary URLs and requires no secrets at runtime.

## License

All photography content © Sean Onamade. All rights reserved.
