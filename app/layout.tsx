import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
// Import global css
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
});

export const metadata = {
  title: "minh.dev - Fullstack Developer",
  description: "Portfolio của Do Cong Minh - Fullstack Developer. Chia sẻ các dự án, blog về phát triển web và công nghệ.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body className={cn("bg-background font-sans text-foreground antialiased selection:bg-primary/20", inter.variable)} suppressHydrationWarning>
        <div className="fixed inset-0 -z-10 bg-grid-pattern" />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
