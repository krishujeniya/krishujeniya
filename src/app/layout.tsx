import type { Metadata } from 'next';
import ReactDOM from 'react-dom';
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

export const viewport: import('next').Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'Krish Ujeniya | Freelance Data Scientist & ML Engineer',
  description:
    'Krish Ujeniya is a freelance Data Scientist and ML Engineer specializing in AI Agents, LLMs, RAG systems, and MLOps. Available for hire globally.',
  keywords: [
    'Data Scientist', 'ML Engineer', 'AI Agent', 'LLM',
    'RAG', 'MLOps', 'ZenML', 'Freelance AI', 'Machine Learning Consultant'
  ],
  authors: [{ name: 'Krish Ujeniya' }],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://krishujeniya.github.io/krishujeniya/',
  },
  openGraph: {
    title: 'Krish Ujeniya | Freelance Data Scientist & ML Engineer',
    description:
      'Building intelligent systems with AI Agents, LLMs & MLOps pipelines. Available for freelance projects.',
    url: 'https://krishujeniya.github.io/krishujeniya/',
    siteName: 'Krish Ujeniya | AI Freelancer Portfolio',
    images: [
      {
        url: 'https://krishujeniya.github.io/krishujeniya/images/1765004211200.jpg',
        width: 1200,
        height: 630,
        alt: 'Krish Ujeniya Portfolio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Krish Ujeniya | Data Scientist & ML Engineer',
    description:
      'Freelance AI & ML Engineer. Building agents, LLMs, and MLOps pipelines.',
    images: ['https://krishujeniya.github.io/krishujeniya/images/1765004211200.jpg'],
    creator: '@krishujeniya',
  },
  metadataBase: new URL('https://krishujeniya.github.io/krishujeniya/'),
  icons: {
    icon: '/favicon.ico',
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
              "knowsAbout": ["Machine Learning","AI Agents","LLMs","MLOps","ZenML","MLflow","Flutter"],
              "availableFor": "Freelance"
            })
          }}
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased dark pt-0'
        )}
      >
        <ThemeProvider>
          <CustomCursor />
          <Navbar />
          {children}
          <ChatBot />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
