import type { NextConfig } from 'next';

const basePath = process.env.BASE_PATH !== undefined ? process.env.BASE_PATH : '/krishujeniya';

const nextConfig: NextConfig = {
  output: 'export',
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  ...(basePath ? { basePath, assetPrefix: `${basePath}/` } : {}),
  trailingSlash: true,
  images: {
    loader: 'custom',
    loaderFile: './src/lib/responsiveImageLoader.ts',
    deviceSizes: [320, 480, 640, 800, 1024, 1200],
    imageSizes: [64, 128, 256],
    remotePatterns: [
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      { protocol: 'https', hostname: 'github.com' },
      { protocol: 'https', hostname: 'storage.googleapis.com' },
      { protocol: 'https', hostname: 'huggingface.co' },
    ],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
