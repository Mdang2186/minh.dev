require('dotenv').config({ path: __dirname + '/../../.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const profile = await prisma.siteProfile.findFirst();
  console.log("Current Profile:", profile);
  
  if (profile) {
    const newAvatar = '/avatar1.png';
    
    await prisma.siteProfile.update({
      where: { id: profile.id },
      data: { 
        avatarUrl: newAvatar
      }
    });
    console.log('Updated SiteProfile avatarUrl to', newAvatar);
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
