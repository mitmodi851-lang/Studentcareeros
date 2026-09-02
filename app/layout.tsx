import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider } from '@/components/SessionProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Student Career OS — Discover Events & Career Certifications',
  description:
    'Student Career OS helps college students discover hackathons, AI summits, workshops, and competitions, and find personalized certification recommendations.',
  keywords: ['student career', 'hackathons', 'certifications', 'aptitude test', 'career events'],
  openGraph: {
    title: 'Student Career OS',
    description: 'Your all-in-one career dashboard for college students.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-background dark:bg-navy-900 text-gray-900 dark:text-gray-100 font-sans antialiased min-h-screen flex flex-col transition-colors duration-200">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
