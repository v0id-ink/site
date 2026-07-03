import sharp from 'sharp';
import { readdir, mkdir, stat } from 'fs/promises';
import { join, extname, basename } from 'path';

const SRC_DIR = 'public/images';
const THUMB_DIR = 'public/images/thumb';
const FULL_DIR = 'public/images/full';

const THUMB_WIDTH = 800;
const FULL_MAX = 3840;
const THUMB_QUALITY = 75;
const FULL_QUALITY = 85;

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

async function processImage(file) {
  const srcPath = join(SRC_DIR, file);
  const name = basename(file, extname(file));

  await sharp(srcPath)
    .rotate()
    .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
    .webp({ quality: THUMB_QUALITY })
    .toFile(join(THUMB_DIR, `${name}.webp`));

  await sharp(srcPath)
    .rotate()
    .resize({ width: FULL_MAX, height: FULL_MAX, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: FULL_QUALITY })
    .toFile(join(FULL_DIR, `${name}.webp`));

  console.log(`  \u2713 ${file}`);
}

async function main() {
  await mkdir(THUMB_DIR, { recursive: true });
  await mkdir(FULL_DIR, { recursive: true });

  const entries = await readdir(SRC_DIR);
  const images = [];
  for (const entry of entries) {
    const s = await stat(join(SRC_DIR, entry));
    if (s.isFile() && IMAGE_EXTS.has(extname(entry).toLowerCase())) {
      images.push(entry);
    }
  }

  console.log(`Processing ${images.length} images...`);
  for (const file of images) {
    await processImage(file);
  }
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
