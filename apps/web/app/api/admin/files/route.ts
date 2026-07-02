import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  if (type !== "avatar" && type !== "resume" && type !== "project") {
    return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), "public", `${type}s`);
  const publicDir = path.join(process.cwd(), "public");
  const fileUrls: string[] = [];

  try {
    // 1. Scan the specific directory
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      const dirFiles = await fs.readdir(uploadDir);
      for (const file of dirFiles) {
        fileUrls.push(`/${type}s/${file}`);
      }
    } catch (e) {
      console.error(`Could not read ${uploadDir}`, e);
    }

    // 2. Scan the root public directory for backward compatibility
    try {
      const rootFiles = await fs.readdir(publicDir);
      for (const file of rootFiles) {
        const stats = await fs.stat(path.join(publicDir, file));
        if (stats.isFile() && file.toLowerCase().includes(type)) {
          // Exclude if it's already in our list
          if (!fileUrls.includes(`/${file}`)) {
            fileUrls.push(`/${file}`);
          }
        }
      }
    } catch (e) {
      console.error(`Could not read ${publicDir}`, e);
    }

    return NextResponse.json({ files: fileUrls });
  } catch (error) {
    console.error("Failed to list files:", error);
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

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Create safe filename
    const ext = path.extname(file.name);
    const basename = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const filename = `${basename}-${Date.now()}${ext}`;

    const uploadDir = path.join(process.cwd(), "public", `${type}s`);
    await fs.mkdir(uploadDir, { recursive: true });
    
    await fs.writeFile(path.join(uploadDir, filename), buffer);

    return NextResponse.json({ url: `/${type}s/${filename}` });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
