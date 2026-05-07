/**
 * Reads scripts/aspect-ratio-map.json and inserts `aspectRatio: X.XXX` into
 * every matching portfolioImages entry in PhotographyPortfolio.tsx.
 *
 * Usage: node scripts/patch-aspect-ratios.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";

const dir = fileURLToPath(new URL(".", import.meta.url));

const mapPath      = resolve(dir, "aspect-ratio-map.json");
const portfolioPath = resolve(dir, "..", "src", "pages", "PhotographyPortfolio.tsx");

const ratioMap = JSON.parse(readFileSync(mapPath, "utf8"));
const lines    = readFileSync(portfolioPath, "utf8").split("\n");

let patched = 0;
let skipped = 0;
const out = [];

for (let i = 0; i < lines.length; i++) {
  out.push(lines[i]);

  // Match an active (uncommented) src: "https://res.cloudinary.com/..." line
  const srcMatch = lines[i].match(/^(\s*)src:\s*"(https:\/\/res\.cloudinary\.com\/[^"]+)"/);
  if (!srcMatch) continue;

  const indent  = srcMatch[1];
  const url     = srcMatch[2];
  const ratio   = ratioMap[url];

  if (ratio === undefined) {
    // Not in map — leave as-is
    continue;
  }

  // Check if the very next non-blank line already has aspectRatio
  let nextIdx = i + 1;
  while (nextIdx < lines.length && lines[nextIdx].trim() === "") nextIdx++;
  if (lines[nextIdx]?.includes("aspectRatio:")) {
    skipped++;
    continue;
  }

  // Insert the aspectRatio line immediately after the src line
  out.push(`${indent}aspectRatio: ${ratio},`);
  patched++;
}

writeFileSync(portfolioPath, out.join("\n"), "utf8");
console.log(`Done — inserted aspectRatio for ${patched} entries, ${skipped} already had it.`);
