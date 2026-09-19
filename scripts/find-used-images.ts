import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'apps/web/.env') }); // assuming .env is in apps/web or root. Let's check both or just rely on dotenv/config

const prisma = new PrismaClient();

async function main() {
  const images = new Set<string>();

  // Collect from Projects
  const projects = await prisma.project.findMany({ include: { images: true }});
  projects.forEach(p => {
    if (p.coverImage) images.add(p.coverImage);
    p.images.forEach(img => {
      if (img.imageUrl) images.add(img.imageUrl);
    });
  });

  // Collect from Certifications
  const certs = await prisma.certification.findMany();
  certs.forEach(c => {
    if (c.logo) images.add(c.logo);
    if (c.images && Array.isArray(c.images)) {
      c.images.forEach((img: string) => images.add(img));
    }
  });

  // Collect from Educations
  const edus = await prisma.education.findMany();
  edus.forEach(e => {
    if (e.logo) images.add(e.logo);
    if (e.images && Array.isArray(e.images)) {
      e.images.forEach((img: string) => images.add(img));
    }
  });

  // Collect from SiteProfile
  const profile = await prisma.siteProfile.findFirst();
  if (profile) {
    if (profile.avatarUrl) images.add(profile.avatarUrl);
    if (profile.resumeUrl) images.add(profile.resumeUrl);
  }

  // Collect from TimelineNode
  const nodes = await prisma.timelineNode.findMany();
  nodes.forEach(n => {
    if (n.icon) images.add(n.icon);
  });
  
  const techStacks = await prisma.techStack.findMany();
  techStacks.forEach(t => {
      if (t.iconUrl) images.add(t.iconUrl);
  });
  
  const skills = await prisma.skill.findMany();
  skills.forEach(s => {
      if (s.iconUrl) images.add(s.iconUrl);
  });
  
  const socialLinks = await prisma.socialLink.findMany();
  socialLinks.forEach(s => {
      if (s.iconUrl) images.add(s.iconUrl);
  });
  
  const posts = await prisma.post.findMany();
  posts.forEach(p => {
      if (p.coverImage) images.add(p.coverImage);
  });

  console.log("=== IMAGES IN DATABASE ===");
  Array.from(images).forEach(img => {
      // Decode URI component in case it's url encoded
      try {
          console.log(decodeURIComponent(img));
      } catch (e) {
          console.log(img);
      }
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
