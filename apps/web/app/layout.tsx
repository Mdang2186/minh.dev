import type { Metadata } from "next";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { QuickAccess } from "@/components/site/quick-access";
import "./globals.css";

export const metadata: Metadata = {
  title: "minh.dev — Portfolio",
  description: "Portfolio of Đỗ Công Minh — Frontend Developer Intern",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-900 scroll-smooth antialiased selection:bg-purple-100 selection:text-purple-900 relative">
        <div className="absolute inset-0 bg-[url('/bg-grid-small.svg')] bg-[length:24px_24px] opacity-10 pointer-events-none -z-10" />
        <Navbar />
        <QuickAccess />
        <main className="min-h-screen z-0">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
