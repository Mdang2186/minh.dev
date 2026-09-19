const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { PrismaClient } = require('@prisma/client');
const { put } = require('@vercel/blob');

const prisma = new PrismaClient();

async function uploadFileToBlob(localUrl) {
  if (!localUrl || !localUrl.startsWith('/uploads/')) return localUrl;
  
  try {
    const filePath = path.join(__dirname, '../../apps/web/public', localUrl);
    if (!fs.existsSync(filePath)) {
      console.log(`[Bỏ qua] Không tìm thấy file trên máy: ${filePath}`);
      return localUrl; // return original if not found
    }

    console.log(`[Đang tải lên] ${localUrl}...`);
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    
    // Determine path in blob storage based on local path
    const blobPath = localUrl.replace('/uploads/', ''); 
    
    const blob = await put(blobPath, fileBuffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      addRandomSuffix: false
    });
    
    console.log(`[Thành công] -> ${blob.url}`);
    return blob.url;
  } catch (err) {
    console.error(`[Lỗi] khi tải lên ${localUrl}:`, err.message);
    return localUrl;
  }
}

async function main() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    console.error("\n❌ LỖI: Không tìm thấy biến BLOB_READ_WRITE_TOKEN trong file .env!");
    console.error("Vui lòng lấy token từ Vercel và thêm vào file .env rồi chạy lại script.\n");
    process.exit(1);
  }

  console.log("🚀 BẮT ĐẦU QUÁ TRÌNH DI CHUYỂN ẢNH LÊN VERCEL BLOB...\n");

  // 1. Cập nhật Avatar (SiteProfile)
  const profiles = await prisma.siteProfile.findMany();
  for (const profile of profiles) {
    if (profile.avatarUrl && profile.avatarUrl.startsWith('/uploads/')) {
      const newUrl = await uploadFileToBlob(profile.avatarUrl);
      if (newUrl !== profile.avatarUrl) {
        await prisma.siteProfile.update({
          where: { id: profile.id },
          data: { avatarUrl: newUrl }
        });
      }
    }
  }

  // 2. Cập nhật Projects
  const projects = await prisma.project.findMany({ include: { images: true }});
  for (const project of projects) {
    // Cover Image
    if (project.coverImage && project.coverImage.startsWith('/uploads/')) {
      const newUrl = await uploadFileToBlob(project.coverImage);
      if (newUrl !== project.coverImage) {
        await prisma.project.update({
          where: { id: project.id },
          data: { coverImage: newUrl }
        });
      }
    }
    
    // Project Images
    for (const img of project.images) {
      if (img.imageUrl && img.imageUrl.startsWith('/uploads/')) {
        const newUrl = await uploadFileToBlob(img.imageUrl);
        if (newUrl !== img.imageUrl) {
          await prisma.projectImage.update({
            where: { id: img.id },
            data: { imageUrl: newUrl }
          });
        }
      }
    }
  }

  // 3. Cập nhật Educations
  const educations = await prisma.education.findMany();
  for (const edu of educations) {
    let changed = false;
    let newLogo = edu.logo;
    if (edu.logo && edu.logo.startsWith('/uploads/')) {
      newLogo = await uploadFileToBlob(edu.logo);
      if (newLogo !== edu.logo) changed = true;
    }

    let newImages = [...edu.images];
    for (let i = 0; i < newImages.length; i++) {
      if (newImages[i].startsWith('/uploads/')) {
        const uploadedUrl = await uploadFileToBlob(newImages[i]);
        if (uploadedUrl !== newImages[i]) {
          newImages[i] = uploadedUrl;
          changed = true;
        }
      }
    }

    if (changed) {
      await prisma.education.update({
        where: { id: edu.id },
        data: { logo: newLogo, images: newImages }
      });
    }
  }

  console.log("\n✅ HOÀN TẤT DI CHUYỂN ẢNH VÀ CẬP NHẬT DATABASE!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
