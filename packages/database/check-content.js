require('dotenv').config({ path: __dirname + '/../../.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const p = await prisma.project.findFirst({where: {slug: 'uneti-student-management-microservices'}});
  if (!p) { console.log('not found'); return; }
  
  const content = p.content || '';
  
  const imgMatch = [...content.matchAll(/<img[^>]+src=["']([^"']+)["']/g)];
  console.log("Images found in HTML:", imgMatch.map(m => m[1]));
  
  const mdMatch = [...content.matchAll(/!\[.*?\]\(([^)]+)\)/g)];
  console.log("Images found in MD:", mdMatch.map(m => m[1]));
}

main().catch(console.error).finally(() => prisma.$disconnect());
