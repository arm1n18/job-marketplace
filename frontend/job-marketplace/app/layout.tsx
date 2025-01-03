import { Inter } from 'next/font/google';
import type { Metadata } from "next";
import "../styles/globals.css";
import { Header } from '@/components/layouts/Header';
import { Footer } from '@/components/layouts/Footer';
import { AuthProvider } from '@/components/hook/AuthContext';
import ToastProvider from '@/components/ui/toastProvider';
import { parse } from 'cookie';
import { headers } from 'next/headers';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: "Joobly.ua",
  description: "Generated by create next app",
};

export default async function RootLayout({ children }: { children: React.ReactNode; }) {
  const cookieHeader = headers().get('cookie') || '';
  const parsedCookies = parse(cookieHeader);
  const loggedIn = parsedCookies.refresh_token || null;

  return (
    <AuthProvider isLoggedIn={loggedIn != null ? true : false}> 
      <html lang="en" className={inter.className}>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/images/favicon/favicon.png" />
        </head>
        <body className={`scrollbar min-h-screen  flex flex-col`}>
          <Header />
            <ToastProvider>
            {children}
          </ToastProvider>
          <Footer />
        </body>
      </html>
    </AuthProvider>
  );
}

