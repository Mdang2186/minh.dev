import { NextResponse } from "next/server";
import { put, list, del } from "@vercel/blob";

// Max file sizes
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;  // 10MB (increased from 5MB)
const MAX_RESUME_SIZE = 15 * 1024 * 1024; // 15MB

const VALID_TYPES = ["avatar", "resume", "project", "education", "certification"] as const;
type UploadType = (typeof VALID_TYPES)[number];

function validateType(type: string | null): type is UploadType {
  return VALID_TYPES.includes(type as UploadType);
}

function getBlobToken(): string | null {
  return process.env.BLOB_READ_WRITE_TOKEN ?? null;
}

// ──────────────────────────────────────────────
// GET  /api/admin/files?type=... OR ?health=1
// ──────────────────────────────────────────────
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // Health check endpoint to debug token issues
  if (searchParams.get("health") === "1") {
    const token = getBlobToken();
    return NextResponse.json({
      hasToken: !!token,
      tokenPrefix: token ? token.substring(0, 20) + "..." : null,
      env: process.env.NODE_ENV,
    });
  }

  const type = searchParams.get("type");

  if (!validateType(type)) {
    return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 });
  }

  const token = getBlobToken();

  if (token) {
    try {
      const { blobs } = await list({ prefix: `${type}s/`, token });
      return NextResponse.json({ files: blobs.map((b) => b.url) });
    } catch (error: any) {
      console.error("Vercel Blob list error:", error);
      return NextResponse.json(
        { error: "Failed to list files.", details: error?.message },
        { status: 500 }
      );
    }
  }

  // ── Local dev fallback ──
  try {
    const fs = await import("fs/promises");
    const path = await import("path");
    const uploadDir = path.join(process.cwd(), "public", "uploads", `${type}s`);
    try {
      const files = await fs.readdir(uploadDir);
      return NextResponse.json({ files: files.map((f) => `/uploads/${type}s/${f}`) });
    } catch {
      return NextResponse.json({ files: [] });
    }
  } catch {
    return NextResponse.json({ files: [] });
  }
}

// ──────────────────────────────────────────────
// POST /api/admin/files   (multipart/form-data: file, type)
// ──────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file received." }, { status: 400 });
    }
    if (!validateType(type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    // ── File size validation ──
    const maxSize = type === "resume" ? MAX_RESUME_SIZE : MAX_IMAGE_SIZE;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File quá lớn. Tối đa ${maxSize / 1024 / 1024}MB cho loại "${type}".` },
        { status: 413 }
      );
    }

    // ── File type validation ──
    if (type === "resume" && !file.type.includes("pdf")) {
      return NextResponse.json(
        { error: "Resume chỉ hỗ trợ định dạng PDF." },
        { status: 400 }
      );
    }
    if (type !== "resume" && !file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Chỉ hỗ trợ file ảnh (image/*)." },
        { status: 400 }
      );
    }

    // ── Build safe filename ──
    const ext = file.name.includes(".") ? file.name.substring(file.name.lastIndexOf(".")) : "";
    const nameWithoutExt = file.name.replace(/\.[^.]+$/, "");
    const basename = nameWithoutExt.replace(/[^a-zA-Z0-9_-]/g, "_") || "file";
    const storagePath = `${type}s/${basename}-${Date.now()}${ext}`;

    const token = getBlobToken();

    if (token) {
      // ── Vercel Blob upload ──
      try {
        const blob = await put(storagePath, file, {
          access: "public",
          addRandomSuffix: false,
          token,
        });
        return NextResponse.json({ url: blob.url });
      } catch (blobError: any) {
        console.error("Vercel Blob PUT error:", blobError);
        return NextResponse.json(
          {
            error: "Upload lên Vercel Blob thất bại.",
            details: blobError?.message || String(blobError),
          },
          { status: 500 }
        );
      }
    }

    // ── Production without token — return clear error ──
    if (process.env.NODE_ENV === "production") {
      console.error("BLOB_READ_WRITE_TOKEN is not set in production environment!");
      return NextResponse.json(
        {
          error: "Storage chưa được cấu hình. BLOB_READ_WRITE_TOKEN không được tìm thấy.",
          hint: "Vào Vercel Dashboard → Storage → Connect Blob Store với project này.",
        },
        { status: 503 }
      );
    }

    // ── Local dev fallback ──
    const fs = await import("fs/promises");
    const path = await import("path");
    const uploadDir = path.join(process.cwd(), "public", "uploads", `${type}s`);
    await fs.mkdir(uploadDir, { recursive: true });
    const localPath = path.join(uploadDir, `${basename}-${Date.now()}${ext}`);
    await fs.writeFile(localPath, Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ url: `/uploads/${type}s/${path.basename(localPath)}` });

  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed.", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}

// ──────────────────────────────────────────────
// DELETE /api/admin/files?url=<public-url>
// ──────────────────────────────────────────────
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
    }

    const token = getBlobToken();

    if (token) {
      // Only attempt blob deletion if URL is a blob URL
      if (url.includes("blob.vercel-storage.com") || url.includes("public.blob.vercel-storage.com")) {
        await del(url, { token });
      }
      return NextResponse.json({ success: true });
    }

    // ── Local dev fallback ──
    if (url.startsWith("/uploads/")) {
      const fs = await import("fs/promises");
      const path = await import("path");
      const localPath = path.join(process.cwd(), "public", url.split("?")[0]);
      await fs.unlink(localPath).catch(() => {});
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });

  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Delete failed.", details: error?.message },
      { status: 500 }
    );
  }
}
