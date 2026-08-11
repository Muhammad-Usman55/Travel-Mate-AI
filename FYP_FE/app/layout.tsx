import { Toaster } from 'sonner';
import type { Metadata } from 'next';
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { ReduxProvider } from '@/components/redux-provider';
import { NavbarWrapper } from '@/components/navbar-wrapper';
import Script from 'next/script';

import './globals.css';
import { I18nProvider } from '@/lib/i18n/I18nProvider';
import { translations } from '@/lib/i18n/translations';

export const metadata: Metadata = {
  title: 'TravelMate AI — Smart Travel Planning',
  description:
    'AI-powered travel planning assistant. Search flights, find hotels, and create personalized itineraries with intelligent MCP-based agents.',
  icons: {
    icon: '/favicon_circle.png',
    shortcut: '/favicon_circle.png',
    apple: '/favicon_circle.png',
  },
};

export const viewport = {
  maximumScale: 1, // Disable auto-zoom on mobile Safari
};

const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

// Editorial display face — serif contrast for large headlines only.
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-display',
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
    >
      <body className="antialiased">
        <Script
          src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
          strategy="beforeInteractive"
        />
        <ReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster position="top-center" />
            <I18nProvider translations={translations}>
              <NavbarWrapper />
              {children}
            </I18nProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
