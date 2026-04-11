import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { DynamicCustomCursor as CustomCursor, DynamicChatBot as ChatBot } from '@/components/client-dynamic';

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
  title: 'Krish Ujeniya | Data Scientist & ML Engineer',
  description:
    'Krish Ujeniya - Freelance Data Scientist & ML Engineer specializing in building intelligent systems with AI Agents, LLMs, RAG, and MLOps pipelines that transform businesses.',
  keywords: [
    'Freelance Data Scientist', 'Machine Learning Engineer', 'MLOps Expert', 'LLM Consultant',
    'AI Agent Developer', 'Large Language Models', 'RAG Systems', 'Retrieval Augmented Generation',
    'Python Developer', 'Generative AI', 'Vector Databases', 'ML Pipelines', 'ZenML', 'MLflow',
    'Data Science Consultant', 'AI Development', 'Krish Ujeniya', 'Portfolio', 'Freelancer',
  ],
  openGraph: {
    title: 'Krish Ujeniya | Data Scientist',
    description:
      'Expert Freelance Data Scientist & ML Engineer specializing in AI Agents, LLMs, RAG, and MLOps pipelines.',
    url: 'https://krishujeniya.github.io/krishujeniya/',
    siteName: 'Krish Ujeniya | AI Freelancer Portfolio',
    images: [
      {
        url: 'https://github.com/krishujeniya/krishujeniya/blob/main/images/img1120.png?raw=true',
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
      'Expert Freelance Data Scientist & ML Engineer specializing in AI Agents, LLMs, RAG, and MLOps pipelines.',
    images: ['/images/1765004211200.jpg'],
    creator: '@krishujeniya',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://krishujeniya.github.io/krishujeniya/'),
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
        {/* Preconnect to external image hosts for faster loading */}
        <link rel="preconnect" href="https://github.com" />
        <link rel="preconnect" href="https://raw.githubusercontent.com" />
        <link rel="dns-prefetch" href="https://github.com" />
        <link rel="dns-prefetch" href="https://raw.githubusercontent.com" />
        <link rel="dns-prefetch" href="https://storage.googleapis.com" />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased dark'
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <CustomCursor />
          {children}
          <ChatBot />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
