/**
 * Post-build step: resize any JPEG in dist/images/ that is wider than MAX_WIDTH.
 * Run after `vite build` so the image optimizer has already finished.
 *
 * Usage: node scripts/resize-images.mjs
 */
import sharp from "sharp";
import { readdir, unlink, rename } from "fs/promises";
import { existsSync } from "fs";
import { join, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const MAX_WIDTH = 2000;
const QUALITY = 75;
const imagesDir = resolve(__dirname, "..", "dist", "images");

if (!existsSync(imagesDir)) {
  console.log("[resize-images] dist/images not found — skipping.");
  process.exit(0);
}

const files = await readdir(imagesDir);
const jpegs = files.filter((f) => /\.(jpe?g)$/i.test(f));

let resized = 0;
let skipped = 0;
let errors = 0;

for (const file of jpegs) {
  const filePath = join(imagesDir, file);
  try {
    const img = sharp(filePath);
    const meta = await img.metadata();

    if ((meta.width ?? 0) > MAX_WIDTH) {
      const tmp = filePath + ".resize_tmp";
      await img
        .resize(MAX_WIDTH, undefined, { withoutEnlargement: true })
        .jpeg({ quality: QUALITY })
        .toFile(tmp);
      // On Windows, must delete target before rename
      await unlink(filePath);
      await rename(tmp, filePath);
      resized++;
    } else {
      skipped++;
    }
  } catch (err) {
    console.error(`[resize-images] Error processing ${file}:`, err.message);
    errors++;
  }
}

console.log(
  `[resize-images] Done — resized: ${resized}, already small: ${skipped}, errors: ${errors}`
);
