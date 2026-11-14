import type { ImageLoaderProps } from 'next/image';

const IMAGE_ROOT = '/krishujeniya/images/';

export default function responsiveImageLoader({ src, width }: ImageLoaderProps): string {
  if (!src.startsWith(IMAGE_ROOT) || !src.endsWith('.webp')) {
    throw new Error('Responsive image loader received an unsupported source.');
  }

  const relativePath = src.slice(IMAGE_ROOT.length);
  if (relativePath.split('/').includes('..')) {
    throw new Error('Responsive image loader received an unsafe source path.');
  }

  const variantPath = relativePath.replace(/\.webp$/, `-${width}.webp`);
  return `${IMAGE_ROOT}responsive/${variantPath}`;
}
