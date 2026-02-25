export function formatDate(d: Date) {
  try {
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(d);
  } catch {
    return d.toISOString().slice(0, 10);
  }
}
