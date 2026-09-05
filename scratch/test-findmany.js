require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      techStacks: { include: { techStack: true } },
    },
  });
  console.log("projects[0].showcaseImages:", projects.map(p => ({ slug: p.slug, showcaseImages: p.showcaseImages })));
}

main().finally(() => prisma.$disconnect());
