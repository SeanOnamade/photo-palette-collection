/**
 * Replaces every local /images/FILENAME.jpg reference in PhotographyPortfolio.tsx
 * with the corresponding Cloudinary URL from cloudinary-url-map.json.
 */
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";

const dir = fileURLToPath(new URL(".", import.meta.url));
const mapPath = resolve(dir, "cloudinary-url-map.json");
const portfolioPath = resolve(dir, "..", "src", "pages", "PhotographyPortfolio.tsx");

const urlMap = JSON.parse(readFileSync(mapPath, "utf8"));
let source = readFileSync(portfolioPath, "utf8");

let replaced = 0;

for (const [filename, rawUrl] of Object.entries(urlMap)) {
  // URL-encode the filename portion so spaces/parens are valid in a URL
  const parts = rawUrl.split("/upload/");
  const prefix = parts[0] + "/upload/";
  // Re-encode only the path after /upload/
  const pathPart = parts.slice(1).join("/upload/");
  const segments = pathPart.split("/");
  const encodedPath = segments
    .map((s) => encodeURIComponent(s).replace(/%2F/g, "/"))
    .join("/");
  const cloudinaryUrl = prefix + encodedPath;

  // Match both /images/filename and images/filename (with or without leading slash)
  const escaped = filename.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`(src:\\s*["'])/?images/${escaped}(["'])`, "g");

  const before = source;
  source = source.replace(pattern, `$1${cloudinaryUrl}$2`);
  if (source !== before) {
    replaced++;
    console.log(`  ✓ ${filename}`);
  }
}

writeFileSync(portfolioPath, source, "utf8");
console.log(`\nDone — replaced ${replaced} local paths with Cloudinary URLs.`);
