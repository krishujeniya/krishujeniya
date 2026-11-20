import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const isCloudflare = process.env.BASE_PATH === '';
  const sitemapUrl = isCloudflare
    ? 'https://krishujeniya.pages.dev/sitemap.xml'
    : 'https://krishujeniya.github.io/krishujeniya/sitemap.xml';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: sitemapUrl,
  };
}
