require('dotenv').config({ path: __dirname + '/../../.env' });
const { PrismaClient } = require('@prisma/client');
const { put } = require('@vercel/blob');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

async function main() {
  const projects = await prisma.project.findMany();
  
  let totalUpdated = 0;

  for (const project of projects) {
    let changed = false;
    let newContent = project.content;
    let newContentVi = project.content_vi;
    
    // Replace <img src="..."> in the given content string
    const replaceImages = async (content) => {
      if (!content) return content;
      
      // Match all img tags and extract the src
      const regex = /<img[^>]+src=["'](\/uploads\/projects\/|\/projects\/)([^"']+)["']/g;
      
      let updatedContent = content;
      let match;
      
      // We can't use async replace directly in all Node versions nicely, so we iterate manually
      // Use matchAll to get all occurrences
      const matches = [...content.matchAll(regex)];
      
      for (const m of matches) {
        const fullMatchString = m[0];
        const prefix = m[1]; 
        const filename = path.basename(m[2]); // extract just the filename in case it has subfolders
        
        // Find local file
        // The file could be in apps/web/public/uploads/projects or apps/web/public/projects
        const possiblePaths = [
          path.join(__dirname, '../../apps/web/public', m[1], m[2]),
          path.join(__dirname, '../../apps/web/public/uploads/projects', m[2]),
          path.join(__dirname, '../../apps/web/public/projects', m[2])
        ];
        
        let localFilePath = null;
        for (const p of possiblePaths) {
          if (fs.existsSync(p)) {
            localFilePath = p;
            break;
          }
        }
        
        if (localFilePath) {
          console.log(`[Upload] Đang tải lên ảnh cho dự án '${project.slug}': ${filename}`);
          
          // User requested: "các ảnh của 1 dự án phải vào chung 1 folder"
          const blobPath = `projects/${project.slug}/${filename}`;
          
          try {
            const fileBuffer = fs.readFileSync(localFilePath);
            const blob = await put(blobPath, fileBuffer, {
              access: 'public',
              token: process.env.BLOB_READ_WRITE_TOKEN,
              addRandomSuffix: false
            });
            
            console.log(`[Thành công] -> ${blob.url}`);
            
            // Replace the full original match src with the new blob url
            // e.g. <img src="/uploads/projects/xyz.png" -> <img src="blob.url"
            const newImgTag = fullMatchString.replace(`${prefix}${m[2]}`, blob.url);
            updatedContent = updatedContent.replace(fullMatchString, newImgTag);
          } catch (err) {
            console.error(`[Lỗi] khi tải lên ${filename}:`, err.message);
          }
        } else {
          console.log(`[Bỏ qua] Không tìm thấy file local cho: ${m[2]}`);
        }
      }
      
      return updatedContent;
    };

    if (newContent) {
      const replaced = await replaceImages(newContent);
      if (replaced !== newContent) {
        newContent = replaced;
        changed = true;
      }
    }
    
    if (newContentVi) {
      const replaced = await replaceImages(newContentVi);
      if (replaced !== newContentVi) {
        newContentVi = replaced;
        changed = true;
      }
    }

    if (changed) {
      await prisma.project.update({
        where: { id: project.id },
        data: {
          content: newContent,
          content_vi: newContentVi
        }
      });
      console.log(`✅ Đã cập nhật database cho dự án: ${project.slug}\n`);
      totalUpdated++;
    }
  }
  
  console.log(`\n🎉 Hoàn tất! Đã cập nhật ${totalUpdated} dự án.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
