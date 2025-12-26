import { authConfig } from "@/auth/auth.config";

export default function AdminSettingsPage() {
  return (
    <div className="rounded-3xl border p-6">
      <h1 className="text-xl font-semibold">Settings</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Demo config (hard-code). Đổi sang ENV/DB khi triển khai thật.
      </p>

      <div className="mt-4 rounded-2xl border p-4 text-sm">
        <div>
          <span className="text-muted-foreground">Cookie:</span>{" "}
          <span className="font-medium">{authConfig.cookieName}</span>
        </div>
      </div>
    </div>
  );
}
