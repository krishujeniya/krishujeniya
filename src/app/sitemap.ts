import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      // Krish Ujeniya – AI Researcher, Data Scientist & AI Freelancer
      url: 'https://krishujeniya.github.io/krishujeniya/',
      lastModified: new Date('2026-05-03'),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
