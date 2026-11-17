import { mkdir, readFile } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve } from 'node:path';
import sharp from 'sharp';

const projectRoot = process.cwd();
const imagesRoot = resolve(projectRoot, 'public/images');
const outputRoot = resolve(imagesRoot, 'responsive');
const portfolioSource = await readFile(resolve(projectRoot, 'src/data/portfolio.ts'), 'utf8');
const sourcePaths = new Set(
  [...portfolioSource.matchAll(/['"]\/krishujeniya\/images\/([^'"]+\.webp)['"]/g)]
    .map((match) => match[1]),
);
const widths = [64, 128, 256, 320, 480, 640, 800, 1024, 1200];

if (sourcePaths.size === 0) {
  throw new Error('No portfolio WebP source images were found.');
}

for (const imagePath of sourcePaths) {
  const sourceFile = resolve(imagesRoot, imagePath);
  const outputBase = resolve(outputRoot, imagePath.replace(/\.webp$/, ''));
  const sourceRelative = relative(imagesRoot, sourceFile);
  const outputRelative = relative(outputRoot, outputBase);

  if (sourceRelative.startsWith('..') || isAbsolute(sourceRelative)
      || outputRelative.startsWith('..') || isAbsolute(outputRelative)) {
    throw new Error(`Portfolio image path escapes the image directory: ${imagePath}`);
  }

  await mkdir(dirname(outputBase), { recursive: true });
  await Promise.all(widths.map((width) => sharp(sourceFile)
    .resize({ width })
    .webp({ quality: 82, effort: 4 })
    .toFile(`${outputBase}-${width}.webp`)));
}

console.log(`Generated ${sourcePaths.size * widths.length} responsive image variants.`);
