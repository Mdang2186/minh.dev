require('dotenv').config({ path: __dirname + '/../../.env' });
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

async function main() {
  const baseUploadsDir = path.join(__dirname, '../../apps/web/public/uploads/projects');
  const project = await prisma.project.findUnique({ where: { slug: 'uneti-student-management-microservices' }, include: { images: true } });

  const projectFolder = path.join(baseUploadsDir, project.slug);
  let localFiles = [];
  if (fs.existsSync(projectFolder)) {
    localFiles = fs.readdirSync(projectFolder).filter(f => fs.lstatSync(path.join(projectFolder, f)).isFile());
  }

  console.log(`\nLocal files count: ${localFiles.length}`);

  let missingCover = false;
  const coverFile = project.coverImage.split('/').pop();
  if (!localFiles.includes(coverFile)) missingCover = true;
  console.log(`Cover Image: ${coverFile} - Missing? ${missingCover}`);

  let missingShowcase = [];
  for (const img of project.images) {
    const filename = img.imageUrl.split('/').pop();
    if (!localFiles.includes(filename)) {
      missingShowcase.push(filename);
    }
  }
  console.log(`Showcase Images: ${project.images.length} in DB. Missing ${missingShowcase.length} files on disk.`);
  if (missingShowcase.length > 0) console.log("Missing Showcase files:", missingShowcase);

  let contentFiles = [];
  const regex = /<img[^>]+src=["']([^"']+)["']/g;
  const matches = [...(project.content || "").matchAll(regex)];
  for (const m of matches) contentFiles.push(m[1].split('/').pop());
  
  let missingContent = [];
  for (const filename of contentFiles) {
    if (!localFiles.includes(filename)) {
      missingContent.push(filename);
    }
  }
  console.log(`Content Images: ${contentFiles.length} in DB. Missing ${missingContent.length} files on disk.`);
  if (missingContent.length > 0) console.log("Missing Content files:", missingContent);

}

main().catch(console.error).finally(() => prisma.$disconnect());
