import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono'; // Import Geist Mono
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';


export const metadata: Metadata = {
  title: 'Krish Ujeniya | Data Scientist', // Updated Title
  description: 'Krish Ujeniya - Freelance Data Scientist & ML Engineer specializing in building intelligent systems with AI Agents, LLMs, RAG, and MLOps pipelines that transform businesses.', // Keep description relevant
  keywords: [ // Keep keywords relevant
    'Freelance Data Scientist', 'Machine Learning Engineer', 'MLOps Expert', 'LLM Consultant',
    'AI Agent Developer', 'Large Language Models', 'RAG Systems', 'Retrieval Augmented Generation',
    'Python Developer', 'Generative AI', 'Vector Databases', 'ML Pipelines', 'ZenML', 'MLflow',
    'Data Science Consultant', 'AI Development', 'Krish Ujeniya', 'Portfolio', 'Freelancer'
  ],
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    title: 'Krish Ujeniya | Data Scientist', // Keep OG Title relevant
    description: 'Expert Freelance Data Scientist & ML Engineer specializing in AI Agents, LLMs, RAG, and MLOps pipelines.', // Keep OG Description relevant
    url: 'https://krishujeniya.github.io/krishhujeniya/', // Keep updated URL
    siteName: 'Krish Ujeniya | AI Freelancer Portfolio', // Keep OG Site Name relevant
    images: [
      {
        url: 'https://krishujeniya.github.io/krishujeniya/og.png', // Keep placeholder OG image URL
        width: 1200,
        height: 630,
        alt: 'Krish Ujeniya Portfolio - Data Scientist, ML Engineer, LLM, MLOps', // Keep alt text relevant
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Krish Ujeniya | Data Scientist & ML Engineer', // Keep Twitter Title relevant
    description: 'Expert Freelance Data Scientist & ML Engineer specializing in AI Agents, LLMs, RAG, and MLOps pipelines.', // Keep Twitter Description relevant
    images: ['https://krishujeniya.github.io/krishujeniya/twitter.png'], // Keep placeholder Twitter image URL
    creator: '@krishujeniya',
  },
  metadataBase: new URL('https://krishujeniya.github.io/krishujeniya/'), // Keep metadataBase
  icons: { // Keep favicon link
    icon: '../../images/img1120.png?v=2',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Removed whitespace before <html> tag
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased dark', // Apply dark theme by default, font-sans uses the variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}> {/* Force dark theme */}
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
