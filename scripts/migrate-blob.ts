import { PrismaClient } from '@prisma/client';
import { put } from '@vercel/blob';
import fs from 'fs/promises';
import path from 'path';
import mime from 'mime-types'; // Note: might need to install or just infer from extension
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const prisma = new PrismaClient();

async function uploadFile(localPath: string, destPath: string) {
  try {
    const fileBuffer = await fs.readFile(localPath);
    const contentType = localPath.endsWith('.pdf') ? 'application/pdf' : 
                       localPath.endsWith('.png') ? 'image/png' :
                       localPath.endsWith('.jpg') || localPath.endsWith('.jpeg') ? 'image/jpeg' :
                       localPath.endsWith('.gif') ? 'image/gif' :
                       localPath.endsWith('.webp') ? 'image/webp' :
                       'application/octet-stream';

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      throw new Error("Missing BLOB_READ_WRITE_TOKEN in .env or .env.local");
    }

    const blob = await put(destPath, fileBuffer, {
      access: 'public',
      addRandomSuffix: false,
      token,
      contentType
    });

    console.log(`✅ Uploaded: ${destPath} -> ${blob.url}`);
    return blob.url;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      console.log(`⚠️ File not found locally, skipping: ${localPath}`);
      return null;
    }
    console.error(`❌ Failed to upload ${localPath}:`, error.message);
    throw error;
  }
}

async function migrate() {
  console.log("🚀 Bắt đầu chuyển đổi ảnh sang Vercel Blob...");
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("❌ Lỗi: Bạn chưa cấu hình BLOB_READ_WRITE_TOKEN trong file .env");
    process.exit(1);
  }

  // 1. Migrate Project Images
  console.log("\n--- Đang xử lý ProjectImages ---");
  const projectImages = await prisma.projectImage.findMany();
  for (const img of projectImages) {
    if (img.imageUrl.startsWith('/uploads/')) {
      const localPath = path.join(process.cwd(), 'apps/web/public', img.imageUrl);
      // Remove '/uploads/' from start to make it look like 'projects/xyz.png'
      const destPath = img.imageUrl.replace('/uploads/', ''); 
      const newUrl = await uploadFile(localPath, destPath);
      
      if (newUrl) {
        await prisma.projectImage.update({
          where: { id: img.id },
          data: { imageUrl: newUrl }
        });
      }
    }
  }

  // 2. Migrate Project Cover Images
  console.log("\n--- Đang xử lý Project CoverImages ---");
  const projects = await prisma.project.findMany();
  for (const proj of projects) {
    if (proj.coverImage && proj.coverImage.startsWith('/uploads/')) {
      const localPath = path.join(process.cwd(), 'apps/web/public', proj.coverImage);
      const destPath = proj.coverImage.replace('/uploads/', ''); 
      const newUrl = await uploadFile(localPath, destPath);
      
      if (newUrl) {
        await prisma.project.update({
          where: { id: proj.id },
          data: { coverImage: newUrl }
        });
      }
    }
  }

  // 3. Migrate SiteProfile Avatar & Resume
  console.log("\n--- Đang xử lý SiteProfile ---");
  const profiles = await prisma.siteProfile.findMany();
  for (const profile of profiles) {
    let updated = false;
    let newAvatarUrl = profile.avatarUrl;
    let newResumeUrl = profile.resumeUrl;

    if (profile.avatarUrl && profile.avatarUrl.startsWith('/uploads/')) {
      const localPath = path.join(process.cwd(), 'apps/web/public', profile.avatarUrl);
      const destPath = profile.avatarUrl.replace('/uploads/', ''); 
      const uploadedUrl = await uploadFile(localPath, destPath);
      if (uploadedUrl) {
        newAvatarUrl = uploadedUrl;
        updated = true;
      }
    }

    if (profile.resumeUrl && profile.resumeUrl.startsWith('/uploads/')) {
      const localPath = path.join(process.cwd(), 'apps/web/public', profile.resumeUrl);
      const destPath = profile.resumeUrl.replace('/uploads/', ''); 
      const uploadedUrl = await uploadFile(localPath, destPath);
      if (uploadedUrl) {
        newResumeUrl = uploadedUrl;
        updated = true;
      }
    }

    if (updated) {
      await prisma.siteProfile.update({
        where: { id: profile.id },
        data: { avatarUrl: newAvatarUrl, resumeUrl: newResumeUrl }
      });
    }
  }

  console.log("\n🎉 Hoàn thành chuyển đổi! Tất cả dữ liệu đã được đưa lên Vercel Blob.");
  console.log("Bạn có thể xóa an toàn thư mục apps/web/public/uploads sau khi kiểm tra.");
}

migrate()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
