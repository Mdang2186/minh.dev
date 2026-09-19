import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), 'apps/web/.env') });

const prisma = new PrismaClient();

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

async function main() {
  const imagesInDb = new Set<string>();

  // Collect from Projects
  const projects = await prisma.project.findMany({ include: { images: true }});
  projects.forEach(p => {
    if (p.coverImage) imagesInDb.add(p.coverImage);
    p.images.forEach(img => {
      if (img.imageUrl) imagesInDb.add(img.imageUrl);
    });
  });

  // Collect from Certifications
  const certs = await prisma.certification.findMany();
  certs.forEach(c => {
    if (c.logo) imagesInDb.add(c.logo);
    if (c.images && Array.isArray(c.images)) {
      c.images.forEach((img: string) => imagesInDb.add(img));
    }
  });

  // Collect from Educations
  const edus = await prisma.education.findMany();
  edus.forEach(e => {
    if (e.logo) imagesInDb.add(e.logo);
    if (e.images && Array.isArray(e.images)) {
      e.images.forEach((img: string) => imagesInDb.add(img));
    }
  });

  // Collect from SiteProfile
  const profile = await prisma.siteProfile.findFirst();
  if (profile) {
    if (profile.avatarUrl) imagesInDb.add(profile.avatarUrl);
    if (profile.resumeUrl) imagesInDb.add(profile.resumeUrl);
  }

  const nodes = await prisma.timelineNode.findMany();
  nodes.forEach(n => {
    if (n.icon) imagesInDb.add(n.icon);
  });
  
  const techStacks = await prisma.techStack.findMany();
  techStacks.forEach(t => {
      if (t.iconUrl) imagesInDb.add(t.iconUrl);
  });
  
  const skills = await prisma.skill.findMany();
  skills.forEach(s => {
      if (s.iconUrl) imagesInDb.add(s.iconUrl);
  });
  
  const socialLinks = await prisma.socialLink.findMany();
  socialLinks.forEach(s => {
      if (s.iconUrl) imagesInDb.add(s.iconUrl);
  });
  
  const posts = await prisma.post.findMany();
  posts.forEach(p => {
      if (p.coverImage) imagesInDb.add(p.coverImage);
  });

  // Normalize db paths to match format /folder/file.ext
  const decodedDbImages = new Set(Array.from(imagesInDb).map(img => {
      try { return decodeURIComponent(img); } catch (e) { return img; }
  }));


  const publicDir = path.resolve(process.cwd(), 'apps/web/public');
  const allLocalFiles = getAllFiles(publicDir);

  const excludeRootFiles = ['favicon.ico', 'file.svg', 'globe.svg', 'next.svg', 'bg-grid-small.svg', 'robots.txt', 'sitemap.xml'];

  let deletedCount = 0;
  let deletedSize = 0;

  console.log("=== SCANNING FOR REDUNDANT FILES ===");

  allLocalFiles.forEach(file => {
    const relativePath = file.replace(publicDir, '').replace(/\\/g, '/'); // e.g. /uploads/image.png
    const fileName = path.basename(file);
    const folderName = path.dirname(relativePath);
    
    // Skip root files like favicon, svg
    if (folderName === '/' && excludeRootFiles.includes(fileName)) {
        return;
    }

    // Skip if it's in the DB
    if (decodedDbImages.has(relativePath)) {
        return;
    }

    // Otherwise, this file is NOT in the database.
    const stat = fs.statSync(file);
    console.log(`[DELETE] ${relativePath} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
    
    // ACTUALLY DELETE
    fs.unlinkSync(file);
    deletedCount++;
    deletedSize += stat.size;
  });

  console.log(`\nDeleted ${deletedCount} files.`);
  console.log(`Total space freed: ${(deletedSize / 1024 / 1024).toFixed(2)} MB`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
