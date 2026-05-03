import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import { DynamicCustomCursor as CustomCursor, DynamicChatBot as ChatBot } from '@/components/client-dynamic';


const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

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
      width: 1200, height: 630,
      alt: 'Krish Ujeniya – AI Researcher, Data Scientist & AI Freelancer'
    }],
  },
  twitter: {
    card: 'summary_large_image',
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
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=()" />
        <link rel="preconnect" href="https://github.com" />
        <link rel="preconnect" href="https://raw.githubusercontent.com" />
        <link rel="preconnect" href="https://storage.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
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
                     "https://linkedin.com/in/krishujeniya"
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
