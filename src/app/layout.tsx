/* eslint-disable @next/next/no-page-custom-font -- App Router root layout loads these fonts globally. */
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import { DynamicCustomCursor as CustomCursor, DynamicChatBot as ChatBot } from '@/components/client-dynamic';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://krishujeniya.github.io'),
  title: {
    default: 'Krish Ujeniya | AI Researcher, Data Scientist & AI Freelancer',
    template: '%s | Krish Ujeniya – AI Researcher & Data Scientist'
  },
  description: 'Krish Ujeniya is an AI Researcher, Data Scientist, and AI Freelancer specializing in LLMs, RAG systems, autonomous AI agents, and deep learning. Available for AI freelance projects worldwide.',
  keywords: [
    'Krish Ujeniya',
    'AI Researcher',
    'Data Scientist',
    'AI Freelancer',
    'Krish Ujeniya AI Researcher',
    'Krish Ujeniya Data Scientist',
    'Krish Ujeniya Freelancer',
    'AI Research India',
    'Machine Learning Researcher',
    'Deep Learning Expert',
    'LLM Engineer',
    'RAG Systems',
    'Autonomous AI Agents',
    'MLOps',
    'Freelance AI Engineer',
    'Freelance Data Scientist',
    'Artificial Intelligence Research',
    'Data Science Freelancer India',
  ],
  authors: [{ name: 'Krish Ujeniya', url: 'https://krishujeniya.github.io/krishujeniya' }],
  creator: 'Krish Ujeniya',
  applicationName: 'Krish Ujeniya – AI Researcher & Data Scientist Portfolio',
  category: 'technology',
  alternates: {
    canonical: '/krishujeniya/',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  icons: {
    icon: [
      { url: '/krishujeniya/favicon.ico' },
      { url: '/krishujeniya/images/icon-32.webp', sizes: '32x32', type: 'image/webp' },
      { url: '/krishujeniya/images/icon-192.webp', sizes: '192x192', type: 'image/webp' },
    ],
    apple: [
      { url: '/krishujeniya/images/apple-icon.webp', sizes: '180x180', type: 'image/webp' },
    ],
  },
  manifest: '/krishujeniya/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://krishujeniya.github.io/krishujeniya/',
    siteName: 'Krish Ujeniya | AI Researcher & Data Scientist',
    title: 'Krish Ujeniya | AI Researcher, Data Scientist & AI Freelancer',
    description: 'Krish Ujeniya – AI Researcher, Data Scientist, and Freelance AI Engineer. Specializing in LLMs, deep learning, RAG pipelines, and autonomous AI agents for global clients.',
    images: [{
      url: '/krishujeniya/images/krish-ujeniya-ai-researcher-data-scientist.webp',
      width: 1440, height: 1440,
      alt: 'Krish Ujeniya – AI Researcher, Data Scientist & AI Freelancer'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@krishujeniya',
    creator: '@krishujeniya',
    title: 'Krish Ujeniya | AI Researcher, Data Scientist & AI Freelancer',
    description: 'Krish Ujeniya – AI Researcher & Data Scientist. Building production-ready AI systems, LLM apps, and autonomous agents. Available for AI freelance projects.',
    images: ['/krishujeniya/images/krish-ujeniya-ai-researcher-data-scientist.webp'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; connect-src 'self' https://krishujeniya-backend.vercel.app https://raw.githubusercontent.com https://github.com; form-action 'self' https://krishujeniya-backend.vercel.app; base-uri 'self'; object-src 'none';" />
        <meta http-equiv="X-Frame-Options" content="DENY" />
        <meta http-equiv="X-Content-Type-Options" content="nosniff" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <script
          dangerouslySetInnerHTML={{
            __html: "if(window.top!==window.self){try{window.top.location=window.self.location;}catch(e){}}",
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
             __html: JSON.stringify({
               "@context": "https://schema.org",
               "@graph": [
                 {
                   "@type": "Person",
                   "@id": "https://krishujeniya.github.io/krishujeniya/#person",
                   "name": "Krish Ujeniya",
                   "alternateName": "krishujeniya",
                   "jobTitle": ["AI Researcher", "Data Scientist", "AI Freelancer"],
                   "url": "https://krishujeniya.github.io/krishujeniya/",
                   "email": "ukideashare0021@gmail.com",
                   "description": "Krish Ujeniya is an AI Researcher, Data Scientist, and AI Freelancer specializing in LLMs, RAG systems, autonomous AI agents, deep learning, and MLOps pipelines.",
                   "image": "https://krishujeniya.github.io/krishujeniya/images/krish-ujeniya-ai-researcher-data-scientist.webp",
                   "knowsAbout": [
                     "Artificial Intelligence Research",
                     "Data Science",
                     "Machine Learning",
                     "Large Language Models (LLMs)",
                     "Retrieval-Augmented Generation (RAG)",
                     "Autonomous AI Agents",
                     "Deep Learning",
                     "MLOps",
                     "Python",
                     "Natural Language Processing",
                     "Computer Vision"
                   ],
                   "hasOccupation": {
                     "@type": "Occupation",
                     "name": "AI Researcher and Data Scientist",
                     "occupationLocation": {
                       "@type": "Country",
                       "name": "India"
                     },
                     "description": "Freelance AI Research and Data Science services for global clients"
                   },
                   "sameAs": [
                     "https://github.com/krishujeniya",
                     "https://linkedin.com/in/krishujeniya",
                     "https://huggingface.co/krishujeniya",
                     "https://medium.com/@krishujeniya"
                   ]
                 },
                 {
                   "@type": "WebSite",
                   "@id": "https://krishujeniya.github.io/krishujeniya/#website",
                   "url": "https://krishujeniya.github.io/krishujeniya/",
                   "name": "Krish Ujeniya | AI Researcher, Data Scientist & AI Freelancer",
                   "description": "Portfolio of Krish Ujeniya – AI Researcher, Data Scientist, and Freelance AI Engineer.",
                   "author": { "@id": "https://krishujeniya.github.io/krishujeniya/#person" }
                 }
               ]
             })
          }}
        />
      </head>
      <body
        className={cn(
          'min-h-screen font-body antialiased'
        )}
      >
        <a href="#main-content"
           className="sr-only focus:not-sr-only focus:fixed focus:top-4
           focus:left-4 focus:z-[9999] focus:px-4 focus:py-2
           focus:bg-white focus:text-black focus:rounded">
          Skip to main content
        </a>
        <ThemeProvider>
          <CustomCursor />
          <main id="main-content">
            {children}
          </main>
          <ChatBot />
        </ThemeProvider>
      </body>
    </html>
  );
}
