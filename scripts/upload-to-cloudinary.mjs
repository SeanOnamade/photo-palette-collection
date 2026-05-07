/**
 * Uploads all images in public/images/ to Cloudinary under the folder "portfolio".
 * - Skips any image whose public_id already exists on Cloudinary (duplicate-safe).
 * - Automatically compresses files > 9 MB with sharp (resize to 2000px, q75) before uploading.
 *
 * Usage:
 *   node scripts/upload-to-cloudinary.mjs
 */

import { readdir } from "fs/promises";
import { existsSync, readFileSync } from "fs";
import { resolve, basename, extname } from "path";
import { fileURLToPath } from "url";
import { createHash } from "crypto";
import sharp from "sharp";

// Load .env manually
const envPath = resolve(fileURLToPath(new URL(".", import.meta.url)), "..", ".env");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const [key, ...rest] = line.split("=");
    if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
  }
}

const CLOUD  = process.env.CLOUDINARY_CLOUD_NAME;
const KEY    = process.env.CLOUDINARY_API_KEY;
const SECRET = process.env.CLOUDINARY_API_SECRET;
const FOLDER = "portfolio";
const IMAGES_DIR = resolve(fileURLToPath(new URL(".", import.meta.url)), "..", "public", "images");
const SUPPORTED  = /\.(jpe?g|png|webp|gif)$/i;
const MAX_BYTES  = 9 * 1024 * 1024; // 9 MB — stay under Cloudinary's 10 MB free limit

if (!CLOUD || !KEY || !SECRET) {
  console.error("Missing Cloudinary credentials in .env");
  process.exit(1);
}

function sign(params) {
  const str = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&") + SECRET;
  return createHash("sha1").update(str).digest("hex");
}

async function exists(publicId) {
  const url  = `https://api.cloudinary.com/v1_1/${CLOUD}/resources/image/upload/${publicId}`;
  const auth = Buffer.from(`${KEY}:${SECRET}`).toString("base64");
  const res  = await fetch(url, { headers: { Authorization: `Basic ${auth}` } });
  return res.ok;
}

async function getFileBuffer(filePath) {
  const raw = readFileSync(filePath);
  if (raw.byteLength <= MAX_BYTES) return raw;

  // Compress with sharp to get under the 10 MB free-plan limit
  const compressed = await sharp(raw)
    .resize(2000, undefined, { withoutEnlargement: true })
    .jpeg({ quality: 75 })
    .toBuffer();

  const savedMB = ((raw.byteLength - compressed.byteLength) / 1024 / 1024).toFixed(1);
  process.stdout.write(`(compressed ${savedMB} MB saved) `);
  return compressed;
}

async function upload(filePath, publicId) {
  const timestamp = Math.floor(Date.now() / 1000);
  const params    = { folder: FOLDER, public_id: publicId, timestamp };
  const signature = sign(params);
  const buffer    = await getFileBuffer(filePath);

  const form = new FormData();
  form.append("file", new Blob([buffer]));
  form.append("api_key", KEY);
  form.append("timestamp", String(timestamp));
  form.append("folder", FOLDER);
  form.append("public_id", publicId);
  form.append("signature", signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message ?? res.statusText);
  }

  return (await res.json()).secure_url;
}

// ─── Main ────────────────────────────────────────────────────────────────────

const files = (await readdir(IMAGES_DIR)).filter((f) => SUPPORTED.test(f));
console.log(`Found ${files.length} image(s) in public/images/\n`);

const results = {};
let uploaded = 0, skipped = 0, errors = 0;

for (const file of files) {
  const ext      = extname(file);
  const name     = basename(file, ext);
  const publicId = name;
  const filePath = resolve(IMAGES_DIR, file);

  process.stdout.write(`  ${file} … `);

  try {
    const alreadyExists = await exists(`${FOLDER}/${publicId}`);
    if (alreadyExists) {
      const url = `https://res.cloudinary.com/${CLOUD}/image/upload/${FOLDER}/${publicId}${ext}`;
      results[file] = url;
      process.stdout.write("already uploaded ✓\n");
      skipped++;
    } else {
      const url = await upload(filePath, publicId);
      results[file] = url;
      process.stdout.write("uploaded ✓\n");
      uploaded++;
    }
  } catch (err) {
    process.stdout.write(`ERROR: ${err.message}\n`);
    errors++;
  }
}

console.log(`\n✅ Done — uploaded: ${uploaded}, already existed: ${skipped}, errors: ${errors}\n`);

// Write JSON map for the patch script to consume
import { writeFileSync } from "fs";
const mapPath = resolve(fileURLToPath(new URL(".", import.meta.url)), "..", "scripts", "cloudinary-url-map.json");
writeFileSync(mapPath, JSON.stringify(results, null, 2));
console.log(`URL map written to scripts/cloudinary-url-map.json\n`);
