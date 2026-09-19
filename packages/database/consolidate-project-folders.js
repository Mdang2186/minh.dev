require('dotenv').config({ path: __dirname + '/../../.env' });
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

function findFileRecursively(dir, filename) {
  if (!fs.existsSync(dir)) return null;
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

  let movedCount = 0;

  for (const project of projects) {
    const projectFolder = path.join(baseUploadsDir, project.slug);
    if (!fs.existsSync(projectFolder)) fs.mkdirSync(projectFolder, { recursive: true });

    const processUrl = async (url) => {
      if (!url) return url;
      const filename = url.split('/').pop();
      const expectedUrl = `/uploads/projects/${project.slug}/${filename}`;
      
      if (url === expectedUrl) return url; // Already correct
      
      const physicalPath = findFileRecursively(baseUploadsDir, filename);
      if (physicalPath) {
        const targetPath = path.join(projectFolder, filename);
        if (physicalPath !== targetPath) {
          // Copy it instead of move, to avoid breaking other projects if it's shared
          fs.copyFileSync(physicalPath, targetPath);
          console.log(`[Copied] ${filename} -> ${project.slug}/`);
          movedCount++;
        }
        return expectedUrl;
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
    const processContent = (content) => {
      if (!content) return content;
      let newContent = content;
      const regex = /<img[^>]+src=["']([^"']+)["']/g;
      const matches = [...content.matchAll(regex)];
      for (const m of matches) {
        const url = m[1];
        const filename = url.split('/').pop();
        const physicalPath = findFileRecursively(baseUploadsDir, filename);
        if (physicalPath) {
          const targetPath = path.join(projectFolder, filename);
          if (physicalPath !== targetPath) {
            if (!fs.existsSync(targetPath)) {
               fs.copyFileSync(physicalPath, targetPath);
               console.log(`[Copied Content Image] ${filename} -> ${project.slug}/`);
               movedCount++;
            }
          }
          const expectedUrl = `/uploads/projects/${project.slug}/${filename}`;
          if (url !== expectedUrl) {
            newContent = newContent.replace(url, expectedUrl);
          }
        }
      }
      return newContent;
    };

    const newContent = processContent(project.content);
    const newContentVi = processContent(project.content_vi);
    
    if (newContent !== project.content || newContentVi !== project.content_vi) {
      await prisma.project.update({ where: { id: project.id }, data: { content: newContent, content_vi: newContentVi } });
    }
  }

  console.log(`\n🎉 Xong! Đã copy/di chuyển thành công ${movedCount} bức ảnh về đúng thư mục của nó.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
