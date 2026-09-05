import { NextResponse } from "next/server";
import { put, list } from "@vercel/blob";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  if (type !== "avatar" && type !== "resume" && type !== "project" && type !== "education" && type !== "certification") {
    return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 });
  }

  try {
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      // List blobs from Vercel Blob
      const { blobs } = await list({
        prefix: `${type}s/`,
      });

      const fileUrls = blobs.map((blob) => blob.url);
      return NextResponse.json({ files: fileUrls });
    } else {
      // Local fallback
      const fs = await import("fs/promises");
      const path = await import("path");
      const uploadDir = path.join(process.cwd(), "public", "uploads", `${type}s`);
      
      try {
        const files = await fs.readdir(uploadDir);
        const fileUrls = files.map(f => `/uploads/${type}s/${f}`);
        return NextResponse.json({ files: fileUrls });
      } catch (err) {
        return NextResponse.json({ files: [] }); // Dir might not exist yet
      }
    }
  } catch (error) {
    console.error("Failed to list files from Blob:", error);
    return NextResponse.json({ files: [] });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string;

    if (!file) {
      return NextResponse.json({ error: "No file received." }, { status: 400 });
    }

    if (type !== "avatar" && type !== "resume" && type !== "project" && type !== "education" && type !== "certification") {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    // Create safe filename
    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.'));
    const ext = file.name.substring(file.name.lastIndexOf('.'));
    const basename = nameWithoutExt ? nameWithoutExt.replace(/[^a-zA-Z0-9_-]/g, "_") : "file";
    
    // Store in folders based on type
    const filename = `${type}s/${basename}-${Date.now()}${ext}`;

    // Upload to Vercel Blob if token exists, otherwise save locally
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(filename, file, {
        access: 'public',
        addRandomSuffix: false,
      });
      return NextResponse.json({ url: blob.url });
    } else {
      // Local fallback for development
      const fs = await import("fs/promises");
      const path = await import("path");
      
      const uploadDir = path.join(process.cwd(), "public", "uploads", `${type}s`);
      await fs.mkdir(uploadDir, { recursive: true });
      
      const localFilePath = path.join(uploadDir, `${basename}-${Date.now()}${ext}`);
      
      // Convert File to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      await fs.writeFile(localFilePath, buffer);
      
      // Return public URL path
      const publicUrl = `/uploads/${type}s/${path.basename(localFilePath)}`;
      return NextResponse.json({ url: publicUrl });
    }
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed.", details: error.message || String(error) }, { status: 500 });
  }
}
