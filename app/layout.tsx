import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { ThemeProvider } from 'jamstacks';
import { ThemeScript } from 'jamstacks/server';
// Self-hosted fonts generated from the Fontsource packages by scripts/fonts.mjs (SIL Open Font License).
import './fonts.css';
import { InkDefs } from '../components/art/ink';
import { SiteFooter } from '../components/site-footer';
import { SiteHeader } from '../components/site-header';
import { business } from '../content/business';
import { dojo } from '../content/index';
import { site } from '../lib/site';
import { validateContent } from '../lib/validate';
import './tailwind.input.css';

// Fail the build with an item-specific message if content/ has a mistake (unknown ID, overlap, bad price…).
validateContent(dojo);

const description = site.description || business.introduction;
// Absolute URLs only when the deployed URL is known at build time. Never fall back to localhost.
const socialImage = site.url ? [{ url: `${site.url}/og.png`, width: 1200, height: 630, alt: `${business.name}: ${business.tagline}` }] : undefined;

export const metadata: Metadata = {
  title: { default: `${business.name}: traditional karate in Boulder`, template: `%s | ${business.name}` },
  description,
  applicationName: site.name,
  ...(site.url ? { metadataBase: new URL(`${site.url}/`) } : {}),
  openGraph: {
    type: 'website',
    siteName: business.name,
    title: business.name,
    description,
    ...(site.url ? { url: `${site.url}/` } : {}),
    images: socialImage,
  },
  twitter: { card: socialImage ? 'summary_large_image' : 'summary' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f1ede4' },
    { media: '(prefers-color-scheme: dark)', color: '#111412' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><ThemeScript /></head>
      <body>
        <ThemeProvider>
          <InkDefs />
          <a className="skip-link" href="#main">Skip to content</a>
          <SiteHeader />
          <main id="main" tabIndex={-1} className="outline-none">{children}</main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
