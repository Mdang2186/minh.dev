require('dotenv').config({ path: __dirname + '/../../.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const profiles = await prisma.siteProfile.findMany();
  console.log("Profiles:", profiles.map(p => ({ id: p.id, avatarUrl: p.avatarUrl })));

  const projects = await prisma.project.findMany({ include: { images: true }});
  console.log("Projects cover:", projects.map(p => ({ slug: p.slug, coverImage: p.coverImage })));
  
  const education = await prisma.education.findMany();
  console.log("Education images:", education.map(e => ({ title: e.title, images: e.images, logo: e.logo })));
}

main().catch(console.error).finally(() => prisma.$disconnect());
