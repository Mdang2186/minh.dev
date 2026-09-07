const { PrismaClient } = require('@prisma/client');

async function run() {
  try {
    delete process.env.DATABASE_URL;
    const prisma = new PrismaClient();
    await prisma.$connect();
    console.log("Connected");
  } catch (e) {
    console.log("Error:", e.message);
  }
}
run();
