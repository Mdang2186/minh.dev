import { NextResponse } from "next/server";
import { put, list } from "@vercel/blob";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  if (type !== "avatar" && type !== "resume" && type !== "project") {
    return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 });
  }

  try {
    // List blobs from Vercel Blob
    // Filter blobs starting with the type's directory name (e.g., "avatars/")
    const { blobs } = await list({
      prefix: `${type}s/`,
    });

    // Map to their URLs
    const fileUrls = blobs.map((blob) => blob.url);

    return NextResponse.json({ files: fileUrls });
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

    if (type !== "avatar" && type !== "resume" && type !== "project") {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    // Create safe filename
    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.'));
    const ext = file.name.substring(file.name.lastIndexOf('.'));
    const basename = nameWithoutExt ? nameWithoutExt.replace(/[^a-zA-Z0-9_-]/g, "_") : "file";
    
    // Store in folders based on type
    const filename = `${type}s/${basename}-${Date.now()}${ext}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false, // We already add a timestamp
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
