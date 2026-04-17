import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
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
    default: 'Krish Ujeniya | Freelance ML Engineer & Data Scientist',
    template: '%s | Krish Ujeniya'
  },
  description: 'Freelance ML Engineer & Data Scientist specializing in AI Agents, LLMs, RAG systems, and MLOps. Available for hire globally. Based in India.',
  keywords: ['ML Engineer','Data Scientist','AI Agent','LLM','RAG','MLOps','ZenML','MLflow','Flutter','Freelance AI','Machine Learning Consultant','India'],
  authors: [{ name: 'Krish Ujeniya', url: 'https://krishujeniya.github.io/krishujeniya' }],
  creator: 'Krish Ujeniya',
  applicationName: 'Krish Portfolio',
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
    siteName: 'Krish Ujeniya Portfolio',
    title: 'Krish Ujeniya | Freelance ML Engineer & Data Scientist',
    description: 'Specializing in AI Agents, LLMs, and MLOps. Building production-ready intelligent systems for global clients.',
    images: [{
      url: '/krishujeniya/images/1765004211200.jpg',
      width: 1200, height: 630,
      alt: 'Krish Ujeniya - ML Engineer & Data Scientist'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Krish Ujeniya | Freelance ML Engineer & Data Scientist',
    description: 'Building production-ready AI Agents, LLMs, and MLOps pipelines. Available for freelance projects.',
    images: ['/krishujeniya/images/1765004211200.jpg'],
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
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
             __html: JSON.stringify({
               "@context": "https://schema.org",
               "@type": "Person",
               "name": "Krish Ujeniya",
               "jobTitle": "Data Scientist & ML Engineer",
               "url": "https://krishujeniya.github.io/krishujeniya/",
               "email": "ukideashare0021@gmail.com",
               "description": "Freelance Data Scientist and ML Engineer",
               "knowsAbout": ["Machine Learning","AI Agents","LLMs","MLOps","ZenML","MLflow","Python","Flutter"],
               "availableFor": "Freelance work globally",
               "sameAs": ["https://github.com/krishujeniya","https://linkedin.com/in/krishujeniya"]
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
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
