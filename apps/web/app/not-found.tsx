import Link from "next/link";
import { Container } from "@/components/common/container";

export default function NotFound() {
  return (
    <Container className="py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Không tìm thấy trang</h1>
      <p className="mt-3 text-muted-foreground">
        Liên kết bạn mở không tồn tại hoặc đã được thay đổi.
      </p>
      <div className="mt-6">
        <Link className="text-sm font-medium underline underline-offset-4" href="/">
          Về trang chủ
        </Link>
      </div>
    </Container>
  );
}
