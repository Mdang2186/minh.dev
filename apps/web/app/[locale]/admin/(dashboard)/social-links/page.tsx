import { SocialLinksManager } from "@/components/admin/social-links-manager";

export default function AdminSocialLinksPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-600">Social</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Mạng xã hội</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Quản lý link social hiển thị ở hero, footer và trang liên hệ.
        </p>
      </div>
      <SocialLinksManager />
    </div>
  );
}
