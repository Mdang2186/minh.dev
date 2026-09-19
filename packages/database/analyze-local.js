require('dotenv').config({ path: __dirname + '/../../.env' });
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

async function main() {
  console.log("=========================================");
  console.log(" BÁO CÁO PHÂN TÍCH ẢNH DỰ ÁN TRÊN LOCAL");
  console.log("=========================================\n");

  const baseUploadsDir = path.join(__dirname, '../../apps/web/public/uploads/projects');
  const projects = await prisma.project.findMany({ include: { images: true } });

  let totalImages = 0;
  let totalMissing = 0;

  for (const project of projects) {
    let projectImageCount = 0;
    let missingCount = 0;
    const projectFolder = path.join(baseUploadsDir, project.slug);
    
    // Check local folder
    let localFiles = [];
    if (fs.existsSync(projectFolder)) {
      localFiles = fs.readdirSync(projectFolder).filter(f => fs.lstatSync(path.join(projectFolder, f)).isFile());
    }

    console.log(`📁 Dự án: [${project.slug}]`);
    console.log(`   - Thư mục local: public/uploads/projects/${project.slug}/`);
    console.log(`   - Số file hiện có trên ổ cứng: ${localFiles.length} file`);

    // Helper to process URL
    const processUrl = async (url, type) => {
      if (!url) return;
      projectImageCount++;
      const filename = url.split('/').pop();
      const isVercelBlob = url.includes('vercel-storage.com');
      
      const isMissingLocally = !localFiles.includes(filename);
      if (isMissingLocally) missingCount++;

      // If it's a vercel blob URL, let's revert it to local URL for local testing
      if (isVercelBlob) {
        return `/uploads/projects/${project.slug}/${filename}`;
      }
      return url;
    };

    // Update cover image
    const newCover = await processUrl(project.coverImage, 'Cover');
    if (newCover && newCover !== project.coverImage) {
      await prisma.project.update({ where: { id: project.id }, data: { coverImage: newCover } });
    }

    // Update project images (Showcase)
    for (const img of project.images) {
      const newImgUrl = await processUrl(img.imageUrl, 'Showcase');
      if (newImgUrl && newImgUrl !== img.imageUrl) {
        await prisma.projectImage.update({ where: { id: img.id }, data: { imageUrl: newImgUrl, folder: project.slug } });
      }
    }

    // Update Content
    const processContent = (content) => {
      if (!content) return content;
      let newContent = content;
      const regex = /<img[^>]+src=["']([^"']+)["']/g;
      const matches = [...content.matchAll(regex)];
      for (const m of matches) {
        const url = m[1];
        projectImageCount++;
        const filename = url.split('/').pop();
        if (!localFiles.includes(filename)) missingCount++;
        
        if (url.includes('vercel-storage.com')) {
          newContent = newContent.replace(url, `/uploads/projects/${project.slug}/${filename}`);
        }
      }
      return newContent;
    };

    const newContent = processContent(project.content);
    const newContentVi = processContent(project.content_vi);
    
    if (newContent !== project.content || newContentVi !== project.content_vi) {
      await prisma.project.update({ where: { id: project.id }, data: { content: newContent, content_vi: newContentVi } });
    }

    console.log(`   - Tổng số ảnh Database yêu cầu: ${projectImageCount} ảnh`);
    if (missingCount > 0) {
      console.log(`   -> ⚠️ THIẾU ${missingCount} file trên ổ cứng! Cần upload lại.`);
    } else if (projectImageCount > 0) {
      console.log(`   -> ✅ Hoàn hảo! Mọi ảnh đã nằm đúng trong thư mục dự án.`);
    }
    console.log("-----------------------------------------");

    totalImages += projectImageCount;
    totalMissing += missingCount;
  }

  console.log(`\n📊 TỔNG KẾT TOÀN BỘ DỰ ÁN:`);
  console.log(`- Hệ thống cần tổng cộng: ${totalImages} ảnh.`);
  console.log(`- Đang bị thiếu mất trên ổ cứng: ${totalMissing} ảnh.`);
  if (totalMissing > 0) {
    console.log(`=> Giải pháp: Bạn hãy vào Admin, xoá các ảnh bị lỗi và TẢI LÊN LẠI. Ảnh sẽ TỰ ĐỘNG LƯU VÀO FOLDER DỰ ÁN.`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
