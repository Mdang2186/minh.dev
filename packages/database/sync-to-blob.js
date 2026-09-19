require('dotenv').config({ path: __dirname + '/../../.env' });
const { PrismaClient } = require('@prisma/client');
const { put } = require('@vercel/blob');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

function getLocalPath(url) {
  if (url && url.startsWith('/uploads/')) {
    const relative = url.replace('/uploads/', '');
    return path.join(__dirname, '../../apps/web/public/uploads', relative);
  }
  return null;
}

async function uploadToBlob(localFilePath, folderName) {
  if (!fs.existsSync(localFilePath)) return null;
  
  const filename = path.basename(localFilePath);
  const blobPath = `projects/${folderName}/${filename}`;
  
  const fileBuffer = fs.readFileSync(localFilePath);
  
  try {
    const blob = await put(blobPath, fileBuffer, {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true, // Overwrite if exists, so it never fails!
      token: process.env.BLOB_READ_WRITE_TOKEN
    });
    console.log(`[Upload] OK: ${blobPath}`);
    return blob.url;
  } catch (err) {
    console.error(`Lỗi upload ${filename}:`, err.message);
    return null;
  }
}

async function main() {
  console.log("🚀 ĐANG ĐỒNG BỘ ẢNH TỪ LOCAL LÊN VERCEL BLOB...\n");

  const projects = await prisma.project.findMany({ include: { images: true } });
  let uploadedCount = 0;

  for (const project of projects) {
    console.log(`Đang xử lý dự án: [${project.slug}]`);

    const processUrl = async (url) => {
      const localPath = getLocalPath(url);
      if (localPath) {
        const blobUrl = await uploadToBlob(localPath, project.slug);
        if (blobUrl) {
          uploadedCount++;
          return blobUrl;
        }
      }
      return url; 
    };

    // 1. Cover
    const newCover = await processUrl(project.coverImage);
    if (newCover !== project.coverImage) {
      await prisma.project.update({ where: { id: project.id }, data: { coverImage: newCover } });
    }

    // 2. Showcase Images
    for (const img of project.images) {
      const newImgUrl = await processUrl(img.imageUrl);
      if (newImgUrl !== img.imageUrl) {
        await prisma.projectImage.update({ where: { id: img.id }, data: { imageUrl: newImgUrl } });
      }
    }

    // 3. Content
    const processContent = async (content) => {
      if (!content) return content;
      let newContent = content;
      const regex = /<img[^>]+src=["'](\/uploads\/projects\/[^"']+)["']/g;
      const matches = [...content.matchAll(regex)];
      
      for (const m of matches) {
        const url = m[1];
        const localPath = getLocalPath(url);
        if (localPath) {
          const blobUrl = await uploadToBlob(localPath, project.slug);
          if (blobUrl) {
            newContent = newContent.replace(url, blobUrl);
            uploadedCount++;
          }
        }
      }
      return newContent;
    };

    const newContent = await processContent(project.content);
    const newContentVi = await processContent(project.content_vi);
    
    if (newContent !== project.content || newContentVi !== project.content_vi) {
      await prisma.project.update({ where: { id: project.id }, data: { content: newContent, content_vi: newContentVi } });
    }
  }

  console.log(`\n🎉 HOÀN TẤT! Đã upload/cập nhật thành công ${uploadedCount} ảnh lên Vercel Blob!`);
  console.log(`Tất cả URL trong Database đã được chuyển về Vercel Blob.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
