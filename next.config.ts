import type {NextConfig} from 'next';

// Assuming the repository name is 'Krish-Ujeniya-Portfolio' for GitHub Pages deployment
const repoName = 'krishujeniya';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export', // Export as static site
  basePath: process.env.NODE_ENV === 'production' ? `/${repoName}` : '', // Set base path for GitHub Pages
  assetPrefix: process.env.NODE_ENV === 'production' ? `/${repoName}/` : '', // Set asset prefix for GitHub Pages
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
   images: {
     unoptimized: true, // Disable Next.js Image Optimization for static export compatibility
     remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
