import type { Metadata } from "next";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

export const metadata: Metadata = {
  title: "minh.dev - Portfolio",
  description: "Portfolio of Do Cong Minh - Frontend Developer Intern",
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="bg-white text-slate-900 scroll-smooth antialiased selection:bg-purple-100 selection:text-purple-900 relative">
        <div className="absolute inset-0 bg-[url('/bg-grid-small.svg')] bg-[length:24px_24px] opacity-10 pointer-events-none -z-10" />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
