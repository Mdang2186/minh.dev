require('dotenv').config({ path: __dirname + '/../../.env' });
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

function findFileRecursively(dir, filename) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const found = findFileRecursively(fullPath, filename);
      if (found) return found;
    } else if (entry.name === filename) {
      return fullPath;
    }
  }
  return null;
}

async function main() {
  const baseUploadsDir = path.join(__dirname, '../../apps/web/public/uploads/projects');
  const projects = await prisma.project.findMany({ include: { images: true } });

  let recoveredCount = 0;
  let stillMissing = 0;

  for (const project of projects) {
    
    const resolveUrl = async (url) => {
      if (!url) return url;
      const filename = url.split('/').pop();
      const physicalPath = findFileRecursively(baseUploadsDir, filename);
      
      if (physicalPath) {
        // Build the correct URL based on its physical location
        const relativePath = path.relative(path.join(__dirname, '../../apps/web/public'), physicalPath);
        const correctUrl = '/' + relativePath.split(path.sep).join('/'); // normalize slashes
        
        if (url !== correctUrl) {
          recoveredCount++;
          return correctUrl;
        }
        return url;
      } else {
        stillMissing++;
        return url;
      }
    };

    // Fix cover
    const newCover = await resolveUrl(project.coverImage);
    if (newCover !== project.coverImage) {
      await prisma.project.update({ where: { id: project.id }, data: { coverImage: newCover } });
    }

    // Fix showcase
    for (const img of project.images) {
      const newImgUrl = await resolveUrl(img.imageUrl);
      if (newImgUrl !== img.imageUrl) {
        await prisma.projectImage.update({ where: { id: img.id }, data: { imageUrl: newImgUrl } });
      }
    }

    // Fix content
    const fixContent = (content) => {
      if (!content) return content;
      let newContent = content;
      const regex = /<img[^>]+src=["']([^"']+)["']/g;
      const matches = [...content.matchAll(regex)];
      
      for (const m of matches) {
        const url = m[1];
        const filename = url.split('/').pop();
        const physicalPath = findFileRecursively(baseUploadsDir, filename);
        if (physicalPath) {
          const relativePath = path.relative(path.join(__dirname, '../../apps/web/public'), physicalPath);
          const correctUrl = '/' + relativePath.split(path.sep).join('/');
          if (url !== correctUrl) {
            newContent = newContent.replace(url, correctUrl);
            recoveredCount++;
          }
        }
      }
      return newContent;
    };

    const newContent = fixContent(project.content);
    const newContentVi = fixContent(project.content_vi);
    
    if (newContent !== project.content || newContentVi !== project.content_vi) {
      await prisma.project.update({ where: { id: project.id }, data: { content: newContent, content_vi: newContentVi } });
    }
  }

  console.log(`\n🎉 Đã phục hồi/sửa lại đúng URL cho ${recoveredCount} ảnh bị sai đường dẫn!`);
  console.log(`❌ Vẫn còn ${stillMissing} ảnh thực sự bị thiếu trên ổ cứng.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
