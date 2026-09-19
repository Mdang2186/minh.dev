require('dotenv').config({ path: __dirname + '/../../.env' });
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  }
  return fileList;
}

async function main() {
  const baseUploadsDir = path.join(__dirname, '../../apps/web/public/uploads/projects');
  const projects = await prisma.project.findMany({ include: { images: true } });

  // 1. Gather all required local paths exactly as they should be
  const requiredPaths = new Set();
  
  for (const project of projects) {
    const projectFolder = path.join(baseUploadsDir, project.slug);
    
    const addRequired = (url) => {
      if (!url) return;
      const filename = url.split('/').pop();
      requiredPaths.add(path.join(projectFolder, filename).toLowerCase()); // case insensitive for windows
    };

    addRequired(project.coverImage);
    for (const img of project.images) addRequired(img.imageUrl);
    
    if (project.content) {
      const regex = /<img[^>]+src=["']([^"']+)["']/g;
      const matches = [...project.content.matchAll(regex)];
      for (const m of matches) addRequired(m[1]);
    }
    if (project.content_vi) {
      const regex = /<img[^>]+src=["']([^"']+)["']/g;
      const matches = [...project.content_vi.matchAll(regex)];
      for (const m of matches) addRequired(m[1]);
    }
  }

  // 2. Scan all files in baseUploadsDir
  const allLocalFiles = getAllFiles(baseUploadsDir);
  let deletedCount = 0;

  for (const filePath of allLocalFiles) {
    if (!requiredPaths.has(filePath.toLowerCase())) {
      fs.unlinkSync(filePath);
      console.log(`[Đã xoá] File rác/thừa: ${filePath}`);
      deletedCount++;
    }
  }

  console.log(`\n🎉 Đã dọn dẹp sạch sẽ ổ cứng! Xoá tổng cộng ${deletedCount} file thừa.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
