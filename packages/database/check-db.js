require('dotenv').config({ path: __dirname + '/../../.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const images = await prisma.projectImage.findMany({ orderBy: { id: 'desc' }, take: 10 });
  console.log("Recent ProjectImages:", images.map(img => img.imageUrl));
  
  const projects = await prisma.project.findMany({ orderBy: { updatedAt: 'desc' }, take: 3 });
  console.log("Recent Projects coverImages:", projects.map(p => p.coverImage));
}
main().catch(console.error).finally(() => prisma.$disconnect());
