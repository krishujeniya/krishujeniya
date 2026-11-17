import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      // Krish Ujeniya – AI Researcher, Data Scientist & AI Freelancer
      url: 'https://krishujeniya.github.io/krishujeniya/',
      // Stable content revision date to prevent spurious lastmod churn on test/build runs
      lastModified: new Date('2026-11-17T00:00:00.000Z'),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
