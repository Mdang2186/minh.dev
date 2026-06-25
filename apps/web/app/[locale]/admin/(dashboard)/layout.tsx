import { AdminShell } from "@/components/admin/admin-shell";
import { AdminLanguageProvider } from "@/components/admin/admin-language-provider";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminLanguageProvider>
      <AdminShell>{children}</AdminShell>
    </AdminLanguageProvider>
  );
}
