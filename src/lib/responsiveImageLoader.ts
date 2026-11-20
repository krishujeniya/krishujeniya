import type { ImageLoaderProps } from 'next/image';

export default function responsiveImageLoader({ src, width }: ImageLoaderProps): string {
  const isPrefixed = src.startsWith('/krishujeniya/images/');
  const root = isPrefixed ? '/krishujeniya/images/' : '/images/';

  if (!src.startsWith(root) || !src.endsWith('.webp')) {
    throw new Error('Responsive image loader received an unsupported source.');
  }

  const relativePath = src.slice(root.length);
  if (relativePath.split('/').includes('..')) {
    throw new Error('Responsive image loader received an unsafe source path.');
  }

  const variantPath = relativePath.replace(/\.webp$/, `-${width}.webp`);
  return `${root}responsive/${variantPath}`;
}
