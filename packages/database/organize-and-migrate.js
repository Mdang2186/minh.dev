require('dotenv').config({ path: __dirname + '/../../.env' });
const { PrismaClient } = require('@prisma/client');
const { put } = require('@vercel/blob');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

async function main() {
  const projects = await prisma.project.findMany({ include: { images: true } });
  
  let totalMoved = 0;
  let totalMissing = 0;
  
  const baseUploadsDir = path.join(__dirname, '../../apps/web/public/uploads/projects');

  for (const project of projects) {
    console.log(`\n=== Đang xử lý dự án: ${project.slug} ===`);
    const projectFolder = path.join(baseUploadsDir, project.slug);
    
    // Create local project folder if it doesn't exist
    if (!fs.existsSync(projectFolder)) {
      fs.mkdirSync(projectFolder, { recursive: true });
    }

    // Helper function to process a single image URL
    // Returns the new URL (Blob URL) or the original URL if failed/missing
    const processImage = async (imageUrl) => {
      if (!imageUrl || !imageUrl.startsWith('/uploads/projects/')) return imageUrl;
      
      const filename = path.basename(imageUrl);
      const currentLocalPath = path.join(baseUploadsDir, filename);
      const newLocalPath = path.join(projectFolder, filename);
      const blobPath = `projects/${project.slug}/${filename}`;
      
      // Check if it already exists in the project folder
      let fileToUpload = null;
      if (fs.existsSync(newLocalPath)) {
        fileToUpload = newLocalPath;
      } else if (fs.existsSync(currentLocalPath)) {
        // Move it to the project folder
        fs.renameSync(currentLocalPath, newLocalPath);
        fileToUpload = newLocalPath;
        console.log(`  [Di chuyển] -> folder ${project.slug}: ${filename}`);
      }
      
      if (fileToUpload) {
        try {
          const fileBuffer = fs.readFileSync(fileToUpload);
          const blob = await put(blobPath, fileBuffer, {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN,
            addRandomSuffix: false
          });
          console.log(`  [Upload thành công] -> ${blob.url}`);
          totalMoved++;
          return blob.url;
        } catch (err) {
          console.error(`  [Lỗi upload] ${filename}:`, err.message);
          return imageUrl;
        }
      } else {
        console.log(`  [CẢNH BÁO] Không tìm thấy file gốc trên máy: ${filename}`);
        totalMissing++;
        return imageUrl;
      }
    };

    let changed = false;

    // 1. Cover Image
    if (project.coverImage && project.coverImage.startsWith('/uploads/projects/')) {
      const newUrl = await processImage(project.coverImage);
      if (newUrl !== project.coverImage) {
        await prisma.project.update({ where: { id: project.id }, data: { coverImage: newUrl } });
        changed = true;
      }
    }

    // 2. Project Images
    for (const img of project.images) {
      if (img.imageUrl && img.imageUrl.startsWith('/uploads/projects/')) {
        const newUrl = await processImage(img.imageUrl);
        if (newUrl !== img.imageUrl) {
          await prisma.projectImage.update({ where: { id: img.id }, data: { imageUrl: newUrl } });
          changed = true;
        }
      }
    }

    // 3. Content
    const replaceImagesInContent = async (content) => {
      if (!content) return content;
      const regex = /<img[^>]+src=["'](\/uploads\/projects\/)([^"']+)["']/g;
      const matches = [...content.matchAll(regex)];
      
      let updatedContent = content;
      for (const m of matches) {
        const fullMatchString = m[0];
        const filename = path.basename(m[2]);
        const originalUrl = `/uploads/projects/${filename}`;
        
        const newUrl = await processImage(originalUrl);
        if (newUrl !== originalUrl) {
          const newImgTag = fullMatchString.replace(`${m[1]}${m[2]}`, newUrl);
          updatedContent = updatedContent.replace(fullMatchString, newImgTag);
        }
      }
      return updatedContent;
    };

    let newContent = await replaceImagesInContent(project.content);
    let newContentVi = await replaceImagesInContent(project.content_vi);

    if (newContent !== project.content || newContentVi !== project.content_vi) {
      await prisma.project.update({
        where: { id: project.id },
        data: { content: newContent, content_vi: newContentVi }
      });
      changed = true;
    }

    if (changed) {
      console.log(`  ✅ Đã cập nhật Database cho dự án: ${project.slug}`);
    }
  }

  console.log(`\n🎉 HOÀN TẤT! Đã xử lý và phân loại ${totalMoved} ảnh.`);
  if (totalMissing > 0) {
    console.log(`⚠️ CÓ ${totalMissing} ẢNH KHÔNG TÌM THẤY TRÊN MÁY BẠN. Bạn cần xoá và re-upload chúng bằng tay trong Admin.`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
