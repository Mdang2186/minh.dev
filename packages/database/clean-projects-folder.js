require('dotenv').config({ path: __dirname + '/../../.env' });
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const { put } = require('@vercel/blob');
const prisma = new PrismaClient();

async function main() {
  const baseUploadsDir = path.join(__dirname, '../../apps/web/public/uploads/projects');
  if (!fs.existsSync(baseUploadsDir)) {
    console.log("Thư mục uploads/projects không tồn tại!");
    return;
  }

  const filesInDir = fs.readdirSync(baseUploadsDir).filter(f => fs.lstatSync(path.join(baseUploadsDir, f)).isFile());
  console.log(`Tìm thấy ${filesInDir.length} file rác/ảnh trong ${baseUploadsDir}`);

  const projects = await prisma.project.findMany({ include: { images: true } });
  
  // Create a mapping from filename prefixes to project slug
  // For example, if DB uses "Picture10-178860.png" in project "A", 
  // we associate the prefix "Picture10" with project "A".
  const prefixToProject = new Map();

  const addPrefix = (url, slug) => {
    if (!url || !url.startsWith('/uploads/projects/')) return;
    const filename = path.basename(url);
    // Extract everything before the timestamp "-17..."
    const match = filename.match(/^(.*)-\d{13}\.[a-zA-Z0-9]+$/);
    if (match) {
      prefixToProject.set(match[1], slug);
    } else {
      // Just map the exact filename without extension
      const name = path.parse(filename).name;
      prefixToProject.set(name, slug);
    }
  };

  for (const project of projects) {
    addPrefix(project.coverImage, project.slug);
    for (const img of project.images) addPrefix(img.imageUrl, project.slug);
    
    // Check content
    const extractFromContent = (content) => {
      if (!content) return;
      const regex = /<img[^>]+src=["'](\/uploads\/projects\/)([^"']+)["']/g;
      const matches = [...content.matchAll(regex)];
      for (const m of matches) addPrefix(`/uploads/projects/${m[2]}`, project.slug);
    };
    extractFromContent(project.content);
    extractFromContent(project.content_vi);
  }

  // Now, for every file in the directory, let's see if we can figure out its project!
  let movedCount = 0;
  let unknownCount = 0;

  for (const filename of filesInDir) {
    let targetProject = null;
    
    const match = filename.match(/^(.*)-\d{13}\.[a-zA-Z0-9]+$/);
    if (match && prefixToProject.has(match[1])) {
      targetProject = prefixToProject.get(match[1]);
    } else {
      const name = path.parse(filename).name;
      if (prefixToProject.has(name)) {
        targetProject = prefixToProject.get(name);
      }
    }
    
    if (targetProject) {
      const projectFolder = path.join(baseUploadsDir, targetProject);
      if (!fs.existsSync(projectFolder)) fs.mkdirSync(projectFolder, { recursive: true });
      
      const oldPath = path.join(baseUploadsDir, filename);
      const newPath = path.join(projectFolder, filename);
      fs.renameSync(oldPath, newPath);
      console.log(`[Đã phân loại] ${filename} -> ${targetProject}/`);
      movedCount++;
    } else {
      unknownCount++;
      console.log(`[KHÔNG RÕ DỰ ÁN] ${filename}`);
    }
  }

  console.log(`\n🎉 Hoàn tất! Đã phân loại ${movedCount} file vào đúng thư mục dự án.`);
  console.log(`Còn lại ${unknownCount} file rác không xác định được dự án.`);
  
  // If there are still unknown files, we can move them to a generic "_orphaned" folder to clean up the root
  if (unknownCount > 0) {
    const orphanFolder = path.join(baseUploadsDir, '_orphaned_files');
    if (!fs.existsSync(orphanFolder)) fs.mkdirSync(orphanFolder, { recursive: true });
    
    const remainingFiles = fs.readdirSync(baseUploadsDir).filter(f => fs.lstatSync(path.join(baseUploadsDir, f)).isFile());
    for (const file of remainingFiles) {
      fs.renameSync(path.join(baseUploadsDir, file), path.join(orphanFolder, file));
    }
    console.log(` Đã gom toàn bộ ${remainingFiles.length} file rác vào thư mục _orphaned_files cho gọn!`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
