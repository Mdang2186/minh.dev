import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  console.log("Clearing old timeline nodes...");
  await prisma.timelineNode.deleteMany({});

  const nodes = [
    {
      title: "Software Engineering Degree",
      date: "2022 - 2026",
      type: "MILESTONE",
      description: "University of Economics - Technology for Industries (UNETI).",
      color: "#06b6d4",
      sortOrder: 1,
    },
    {
      title: "Quản Lý Hồ Sơ Tuyển Dụng",
      date: "06/2025 – 07/2025",
      type: "PROJECT",
      description: "Team Lead & Frontend/UI-UX. Phát triển trang web quản lý hồ sơ tuyển dụng.",
      color: "#f59e0b",
      sortOrder: 2,
    },
    {
      title: "LUXE INTERIORS",
      date: "2025",
      type: "PROJECT",
      description: "Team Lead & Frontend/UI-UX. Phát triển website bán nội thất cao cấp.",
      color: "#8b5cf6",
      sortOrder: 3,
    },
    {
      title: "MotorShop",
      date: "10/2025 - 12/2025",
      type: "PROJECT",
      description: "Team Lead & Frontend/UI-UX. Xây dựng website thương mại điện tử bán xe máy.",
      color: "#10b981",
      sortOrder: 4,
    },
    {
      title: "UNETI Student Management",
      date: "2025 - 2026",
      type: "PROJECT",
      description: "Graduation Project — Xây dựng hệ thống quản lý sinh viên sử dụng kiến trúc Microservices.",
      color: "#3b82f6",
      sortOrder: 5,
    }
  ];

  console.log("Seeding timeline nodes...");
  for (const node of nodes) {
    await prisma.timelineNode.create({
      data: node,
    });
  }

  console.log("Timeline Nodes seeded successfully!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
