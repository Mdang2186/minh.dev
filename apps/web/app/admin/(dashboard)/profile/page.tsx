import { ProfileForm } from "@/components/admin/profile-form";

export default function AdminProfilePage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-600">Profile</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Hồ sơ cá nhân</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Nội dung này dùng cho hero, footer và trang liên hệ public.
        </p>
      </div>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <ProfileForm />
      </section>
    </div>
  );
}
