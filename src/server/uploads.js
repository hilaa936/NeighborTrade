import { randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { badRequest } from "./errors";

// Local disk storage for development. For production, replace saveFile/readStoredFile
// with object storage (e.g. Vercel Blob); the rest of the app only sees the URL.
const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
const NAME_PATTERN = /^[a-z0-9]+\.webp$/;

// Re-encodes the image: resizes it, fixes rotation and strips metadata
// (phone photos carry GPS coordinates, which must never be published)
export async function saveImage(file) {
  if (!file || typeof file.arrayBuffer !== "function") throw badRequest("no_file");
  if (!ALLOWED_TYPES.includes(file.type)) throw badRequest("unsupported_image");
  if (file.size > MAX_BYTES) throw badRequest("image_too_large");

  let output;
  try {
    output = await sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: 50_000_000 })
      .rotate()
      .resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
  } catch {
    throw badRequest("unsupported_image");
  }

  const name = `${randomBytes(12).toString("hex")}.webp`;
  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, name), output);
  return `/api/uploads/${name}`;
}

export async function readStoredFile(name) {
  if (!NAME_PATTERN.test(name)) return null;
  try {
    return await readFile(path.join(UPLOAD_DIR, name));
  } catch {
    return null;
  }
}
