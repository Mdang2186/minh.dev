import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";


export const dynamic = "force-dynamic";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1 min-h-screen z-0">{children}</main>
      <Footer />
    </div>
  );
}
