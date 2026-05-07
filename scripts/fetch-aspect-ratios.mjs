/**
 * Fetches width/height from the Cloudinary Admin API for every image referenced
 * in PhotographyPortfolio.tsx and writes scripts/aspect-ratio-map.json.
 *
 * Usage: node scripts/fetch-aspect-ratios.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";

const dir = fileURLToPath(new URL(".", import.meta.url));

// Load .env
const envPath = resolve(dir, "..", ".env");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const [key, ...rest] = line.split("=");
    if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
  }
}

const CLOUD  = process.env.CLOUDINARY_CLOUD_NAME;
const KEY    = process.env.CLOUDINARY_API_KEY;
const SECRET = process.env.CLOUDINARY_API_SECRET;

if (!CLOUD || !KEY || !SECRET) {
  console.error("Missing Cloudinary credentials in .env");
  process.exit(1);
}

const auth = "Basic " + Buffer.from(`${KEY}:${SECRET}`).toString("base64");

// ─── 1. Extract all Cloudinary URLs from PhotographyPortfolio.tsx ─────────────

const portfolioSrc = readFileSync(
  resolve(dir, "..", "src", "pages", "PhotographyPortfolio.tsx"),
  "utf8"
);

// Match active (uncommented) src: "https://res.cloudinary.com/..." entries
const urlPattern = /^\s*src:\s*"(https:\/\/res\.cloudinary\.com\/[^"]+)"/gm;
const allUrls = new Set();
let m;
while ((m = urlPattern.exec(portfolioSrc)) !== null) {
  allUrls.add(m[1]);
}
console.log(`Found ${allUrls.size} unique Cloudinary URLs in portfolioImages\n`);

// Also grab hero pool URLs from PhotographyPortfolio.tsx (they are plain string literals)
const heroPattern = /"(https:\/\/res\.cloudinary\.com\/[^"]+)"/g;
while ((m = heroPattern.exec(portfolioSrc)) !== null) {
  allUrls.add(m[1]);
}

// ─── 2. Parse public_id from each URL ────────────────────────────────────────
// URL format: .../image/upload[/v{version}]/[{folder}/]{public_id}.{ext}
function publicIdFromUrl(url) {
  // Strip query string
  const clean = url.split("?")[0];
  // Everything after /upload/
  const afterUpload = clean.split("/upload/")[1];
  if (!afterUpload) return null;
  // Remove leading version segment if present (v1234567890/)
  const withoutVersion = afterUpload.replace(/^v\d+\//, "");
  // Remove file extension
  const withoutExt = withoutVersion.replace(/\.[^.]+$/, "");
  // URL-decode
  return decodeURIComponent(withoutExt);
}

// ─── 3. Fetch metadata from Cloudinary Admin API ──────────────────────────────

async function fetchResource(publicId) {
  const url = `https://api.cloudinary.com/v1_1/${CLOUD}/resources/image/upload/${encodeURIComponent(publicId)}`;
  const res = await fetch(url, { headers: { Authorization: auth } });
  if (!res.ok) return null;
  const json = await res.json();
  return json.width && json.height
    ? Math.round((json.width / json.height) * 1000) / 1000
    : null;
}

const aspectRatioMap = {};
let fetched = 0, failed = 0;

for (const url of allUrls) {
  const publicId = publicIdFromUrl(url);
  if (!publicId) { failed++; continue; }

  process.stdout.write(`  ${publicId} … `);
  const ratio = await fetchResource(publicId);
  if (ratio !== null) {
    aspectRatioMap[url] = ratio;
    process.stdout.write(`${ratio}\n`);
    fetched++;
  } else {
    process.stdout.write(`not found\n`);
    failed++;
  }
}

console.log(`\nFetched: ${fetched}, not found: ${failed}`);

const outPath = resolve(dir, "aspect-ratio-map.json");
writeFileSync(outPath, JSON.stringify(aspectRatioMap, null, 2));
console.log(`Written to scripts/aspect-ratio-map.json`);
