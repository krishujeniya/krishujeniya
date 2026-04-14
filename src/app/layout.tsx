import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { DynamicCustomCursor as CustomCursor, DynamicChatBot as ChatBot } from '@/components/client-dynamic';
import { Navbar } from '@/components/navbar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://krishujeniya.github.io'),
  title: {
    default: 'Krish Ujeniya | Freelance Data Scientist & ML Engineer',
    template: '%s | Krish Ujeniya'
  },
  description: 'Freelance Data Scientist and ML Engineer specializing in AI Agents, LLMs, RAG systems, and MLOps pipelines. Available for hire globally. Based in India.',
  keywords: ['Data Scientist','ML Engineer','AI Agent','LLM','RAG','MLOps','ZenML','MLflow','Flutter','Freelance AI','Machine Learning Consultant','India'],
  authors: [{ name: 'Krish Ujeniya', url: 'https://krishujeniya.github.io/krishujeniya' }],
  creator: 'Krish Ujeniya',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  icons: {
    icon: [
      { url: '/krishujeniya/images/img1120.png', sizes: '32x32', type: 'image/png' },
      { url: '/krishujeniya/images/img1120.png', sizes: '96x96', type: 'image/png' },
    ],
    shortcut: '/krishujeniya/images/img1120.png',
    apple: '/krishujeniya/images/img1120.png',
  },
  manifest: '/krishujeniya/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://krishujeniya.github.io/krishujeniya/',
    siteName: 'Krish Ujeniya Portfolio',
    title: 'Krish Ujeniya | Freelance Data Scientist & ML Engineer',
    description: 'Building intelligent systems with AI Agents, LLMs and MLOps. Available for freelance projects.',
    images: [{
      url: '/krishujeniya/images/1765004211200.jpg',
      width: 1200, height: 630,
      alt: 'Krish Ujeniya - Data Scientist & ML Engineer'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Krish Ujeniya | Data Scientist & ML Engineer',
    description: 'Freelance AI & ML Engineer. Building agents, LLMs, and MLOps pipelines.',
    images: ['/krishujeniya/images/1765004211200.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <meta http-equiv="X-Content-Type-Options" content="nosniff" />
        <meta http-equiv="X-Frame-Options" content="DENY" />
        <meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <meta http-equiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=()" />
        <link rel="preconnect" href="https://github.com" />
        <link rel="preconnect" href="https://raw.githubusercontent.com" />
        <link rel="preconnect" href="https://storage.googleapis.com" />
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
          'min-h-screen bg-background font-sans antialiased dark pt-0'
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
          <Navbar />
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
