require("dotenv").config({ path: require("path").resolve(__dirname, "../../../.env") });
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const demoAdmin = {
  email: "admin@example.com",
  password: "ChangeMe123!",
  name: "Portfolio Admin",
};

const siteProfile = {
  id: "site-profile",
  name: "Đỗ Công Minh",
  role: "Frontend Developer Intern",
  headline: "a frontend developer intern focused on clean UI, solid UX, and practical products.",
  intro:
    "I’m Minh — a Software Engineering student aiming to become a professional Frontend Developer. I enjoy building modern, intuitive interfaces with strong fundamentals and a product mindset.",
  location: "Hai Bà Trưng, Hà Nội, Việt Nam",
  email: "mdang2186@gmail.com",
  phone: "0372986808",
  avatarUrl: "/avatar1.png",
  resumeUrl: "/resume.pdf",
};

const projects = [
  {
    slug: "motorshop",
    title: "MotorShop — Website Bán Xe Máy",
    summary: "Trang web thương mại điện tử chuyên cung cấp và kinh doanh xe máy trực tuyến.",
    description:
      "MotorShop là dự án website bán hàng trực tuyến toàn diện, cung cấp trải nghiệm mua sắm tiện lợi với các tính năng phân trang, tìm kiếm và lọc sản phẩm. Hệ thống bao gồm giỏ hàng thông minh và quy trình đặt hàng tích hợp.",
    content:
      "Dự án tập trung vào việc quản lý danh mục xe máy, cung cấp chi tiết toàn diện từ bộ sưu tập hình ảnh, giá cả đến hệ thống quản trị mạnh mẽ.",
    coverImage: "/projects/MotorShop/01-home.png",
    githubUrl: "https://github.com/Mdang2186/MotorShop",
    demoUrl: null,
    role: "TEAM LEAD & FRONTEND/UI-UX",
    duration: "10/2025 - 12/2025",
    teamSize: "Academic Project",
    featured: true,
    published: true,
    sortOrder: 1,
    directoryTree: `MotorShop/
├── Controllers/
│   ├── AdminController.cs
│   ├── CartController.cs
│   └── HomeController.cs
├── Models/
│   ├── Motorbike.cs
│   ├── User.cs
│   └── Order.cs
├── Views/
│   ├── Home/
│   │   └── Index.cshtml
│   └── Shared/
│       └── _Layout.cshtml
└── wwwroot/
    ├── css/
    ├── js/
    └── images/`,
    highlights: [
      "Danh sách sản phẩm: Hỗ trợ phân trang, công cụ tìm kiếm và lọc nâng cao.",
      "Chi tiết sản phẩm: Cung cấp thư viện hình ảnh, hiển thị giá và chức năng thêm vào giỏ hàng mượt mà.",
      "Quản lý Giỏ hàng: Cập nhật số lượng, xóa sản phẩm và tự động tính tổng tiền thanh toán.",
      "Xác thực người dùng: Hệ thống đăng nhập và phân quyền bảo mật.",
      "Bảng điều khiển Admin: Trình quản lý toàn diện cho danh mục sản phẩm và đơn đặt hàng.",
    ],
    languages: ["C#", "JavaScript", "HTML", "CSS"],
    tools: ["Visual Studio", "VS Code", "SSMS", "Git"],
    techStacks: ["React", "Tailwind CSS", "ASP.NET MVC", "SQL Server"],
    images: [
      { imageUrl: "/projects/MotorShop/01-home.png", altText: "MotorShop home", sortOrder: 1 },
      { imageUrl: "/projects/MotorShop/02-product-detail.png", altText: "MotorShop product detail", sortOrder: 2 },
      { imageUrl: "/projects/MotorShop/05-admin-dashboard.png", altText: "MotorShop admin dashboard", sortOrder: 3 },
    ],
  },
  {
    slug: "luxe-interiors",
    title: "LUXE INTERIORS — Website Bán Nội Thất",
    summary: "Website thương mại điện tử dành cho cửa hàng bán đồ nội thất cao cấp.",
    description:
      "LUXE INTERIORS là một giải pháp thương mại điện tử toàn diện dành cho cửa hàng bán đồ nội thất. Hệ thống bao gồm trang khách hàng với các chức năng xem sản phẩm, thêm vào giỏ hàng, đặt hàng, và một trang quản trị để quản lý danh mục sản phẩm, theo dõi đơn hàng và người dùng.",
    content:
      "Dự án tập trung vào việc tối ưu hóa giao diện người dùng và quản lý dữ liệu hiệu quả.",
    coverImage: null,
    githubUrl: "https://github.com/Mdang2186/LUXE_INTERIORS",
    demoUrl: null,
    role: "BACKEND TEAM LEAD",
    duration: "1.5 MONTHS",
    teamSize: "4 MEMBERS",
    featured: true,
    published: true,
    sortOrder: 2,
    directoryTree: `FurniShop/
├── src/
│   ├── main/
│   │   ├── java/com/furniture/
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   └── util/DBContext.java
│   │   └── webapp/
│   │       ├── WEB-INF/
│   │       │   └── views/
│   │       │       ├── admin/
│   │       │       └── user/
│   │       ├── css/
│   │       └── js/
└── database_schema.sql`,
    highlights: [
      "Khám phá danh mục: Hệ thống phân loại thông minh (sofa, bàn, ghế, v.v).",
      "Trải nghiệm thanh toán: Quy trình giỏ hàng và thanh toán được tối ưu hóa.",
      "Quản lý Admin: Hệ thống kiểm soát sản phẩm và theo dõi đơn hàng thời gian thực.",
      "Thiết kế Responsive: Tương thích hoàn hảo trên cả thiết bị di động và máy tính bàn.",
      "Tích hợp bảo mật: Áp dụng các cơ chế xác thực an toàn cho người dùng.",
    ],
    languages: ["Java", "HTML", "CSS", "JavaScript"],
    tools: ["NetBeans", "MySQL", "Git"],
    techStacks: ["Java", "JSP/Servlet", "Bootstrap", "MySQL"],
    images: [],
  },
  {
    slug: "quanly-hstd",
    title: "Quản Lý Hồ Sơ Tuyển Dụng",
    summary: "Hệ thống web nội bộ quản lý ứng viên, lên lịch phỏng vấn và theo dõi kết quả.",
    description:
      "Hệ thống Quản Lý Hồ Sơ Tuyển Dụng là một ứng dụng nội bộ được thiết kế để số hóa và tối ưu hóa quy trình tuyển dụng của doanh nghiệp.",
    content:
      "Nền tảng này giúp đội ngũ nhân sự dễ dàng thu thập, phân loại hồ sơ ứng viên, lên lịch phỏng vấn và ghi nhận đánh giá từ người phỏng vấn.",
    coverImage: null,
    githubUrl: "https://github.com/Mdang2186/QuanLyHSTD",
    demoUrl: null,
    role: "FULLSTACK DEVELOPER",
    duration: "3 MONTHS",
    teamSize: "2 MEMBERS",
    featured: true,
    published: true,
    sortOrder: 3,
    directoryTree: `QuanLyHSTD/
├── Controllers/
│   ├── CandidateController.cs
│   └── InterviewController.cs
├── Models/
│   ├── CandidateProfile.cs
│   ├── Department.cs
│   └── InterviewSchedule.cs
├── Views/
│   ├── Candidate/
│   │   ├── Create.cshtml
│   │   └── Index.cshtml
│   └── Dashboard/
│       └── Index.cshtml
└── App_Data/
    └── HRDatabase.mdf`,
    highlights: [
      "Luồng người dùng đa cấp: Thiết lập luồng thao tác riêng biệt cho HR và Người phỏng vấn.",
      "Quản lý hồ sơ: Lưu trữ chi tiết thông tin ứng viên và phân công vị trí phù hợp.",
      "Lên lịch tự động: Hỗ trợ tạo lịch phỏng vấn và nhập thông tin phản hồi sau phỏng vấn.",
      "Báo cáo thống kê: Bảng điều khiển phân tích số liệu và tình trạng tuyển dụng.",
      "Thông báo Email: Hệ thống tự động đẩy email xác nhận lịch cho ứng viên.",
    ],
    languages: ["C#", "HTML", "CSS", "JavaScript"],
    tools: ["Visual Studio", "SSMS", "Figma", "Git"],
    techStacks: ["ASP.NET MVC", "Razor", "C#", "SQL Server"],
    images: [],
  },
];

const skillGroups = [
  {
    title: "Frontend Development",
    sortOrder: 1,
    skills: [
      ["JavaScript", "Frequently Used"],
      ["TypeScript", "Occasionally"],
      ["ReactJS", "Frequently Used"],
      ["HTML & CSS", "Frequently Used"],
      ["TailwindCSS", "Frequently Used"],
    ],
  },
  {
    title: "Backend & Database",
    sortOrder: 2,
    skills: [
      ["C#/.NET", "Occasionally"],
      ["Java", "Occasionally"],
      ["ASP.NET MVC", "Occasionally"],
      ["Entity Framework", "Occasionally"],
      ["SQL Server", "Occasionally"],
      ["MySQL", "Occasionally"],
    ],
  },
  {
    title: "Development Tools",
    sortOrder: 3,
    skills: [
      ["Git & GitHub", "Frequently Used"],
      ["VS Code", "Frequently Used"],
      ["Visual Studio", "Frequently Used"],
      ["Postman", "Occasionally"],
      ["DBDiagram", "Occasionally"],
    ],
  },
  {
    title: "Design & Creative",
    sortOrder: 4,
    skills: [
      ["Photoshop", "Occasionally"],
      ["Illustrator", "Occasionally"],
      ["Figma", "Learning"],
      ["Canva", "Learning"],
    ],
  },
];

const experiences = [
  {
    title: "Team Lead & Frontend/UI-UX",
    org: "MotorShop – Website Bán Xe Máy",
    time: "10/2025 – 12/2025",
    sortOrder: 1,
    details: [
      "Website bán xe máy với khu vực khách hàng và trang quản trị, cho phép xem sản phẩm, đặt hàng và quản lý đơn.",
      "Thiết kế và xây dựng frontend bằng HTML, CSS, Bootstrap/Tailwind và ASP.NET Core MVC.",
      "Tính năng khách hàng: phân trang, tìm kiếm, lọc theo hãng/loại, chi tiết sản phẩm, giỏ hàng và tài khoản khách hàng.",
      "Tính năng Admin: quản lý sản phẩm, danh mục, đơn hàng và thống kê doanh thu.",
    ],
  },
  {
    title: "Team Lead & Frontend/UI-UX",
    org: "LUXE INTERIORS – Website Bán Nội Thất",
    time: "10/2025 – 12/2025",
    sortOrder: 2,
    details: [
      "Website thương mại điện tử bán đồ nội thất với đầy đủ luồng mua sắm và khu vực admin.",
      "Xây dựng frontend bằng HTML, CSS, JavaScript, Bootstrap và JSP/JSTL.",
      "Tính năng khách hàng: danh sách sản phẩm, chi tiết sản phẩm, giỏ hàng tự động tính tổng tiền và form đặt hàng.",
      "Tính năng Admin: quản lý sản phẩm, danh mục và đơn hàng.",
    ],
  },
  {
    title: "Team Lead & Frontend/UI-UX",
    org: "Trang web Quản lý Hồ sơ tuyển dụng",
    time: "06/2025 – 07/2025",
    sortOrder: 3,
    details: [
      "Hệ thống web nội bộ quản lý hồ sơ tuyển dụng cho doanh nghiệp.",
      "Xây dựng frontend bằng ASP.NET MVC, Razor View, HTML, CSS và Bootstrap.",
      "Phân quyền: Admin quản lý tài khoản, HR quản lý hồ sơ và trạng thái ứng viên.",
      "Interviewer truy cập hồ sơ và nhập kết quả phỏng vấn.",
    ],
  },
];

const socialLinks = [
  { name: "GitHub", url: "https://github.com/Mdang2186", sortOrder: 1 },
  { name: "LinkedIn", url: "https://linkedin.com/in/mdang2186", sortOrder: 2 },
  { name: "Facebook", url: "https://www.facebook.com/mdang2186", sortOrder: 3 },
  {
    name: "Instagram",
    url: "https://www.instagram.com/mdang2186?utm_source=qr&igsh=cXp4NXY3NXJ0czdj",
    sortOrder: 4,
  },
];

function unique(items) {
  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
}

async function upsertProject(project) {
  const techStacks = await Promise.all(
    unique(project.techStacks).map((name) =>
      prisma.techStack.upsert({
        where: { name },
        update: {},
        create: { name, category: null },
      })
    )
  );

  const existing = await prisma.project.findUnique({ where: { slug: project.slug } });
  const data = {
    title: project.title,
    summary: project.summary,
    description: project.description,
    content: project.content,
    coverImage: project.coverImage,
    githubUrl: project.githubUrl,
    demoUrl: project.demoUrl,
    role: project.role,
    duration: project.duration,
    teamSize: project.teamSize,
    featured: project.featured,
    published: project.published,
    sortOrder: project.sortOrder,
    directoryTree: project.directoryTree,
    highlights: project.highlights,
    languages: project.languages,
    tools: project.tools,
    images: {
      create: project.images.map((image) => ({
        imageUrl: image.imageUrl,
        altText: image.altText,
        sortOrder: image.sortOrder,
      })),
    },
    techStacks: {
      create: techStacks.map((techStack) => ({
        techStack: { connect: { id: techStack.id } },
      })),
    },
  };

  if (existing) {
    await prisma.projectImage.deleteMany({ where: { projectId: existing.id } });
    await prisma.projectTechStack.deleteMany({ where: { projectId: existing.id } });
    return prisma.project.update({ where: { id: existing.id }, data });
  }

  return prisma.project.create({ data: { ...data, slug: project.slug } });
}

async function main() {
  const email = process.env.ADMIN_EMAIL || demoAdmin.email;
  const password = process.env.ADMIN_PASSWORD || demoAdmin.password;
  const name = process.env.ADMIN_NAME || demoAdmin.name;

  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    console.warn(
      "ADMIN_EMAIL or ADMIN_PASSWORD is missing. Seed uses demo credentials admin@example.com / ChangeMe123!. Change them before deploying."
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, name, role: "ADMIN", isActive: true },
    create: { email, passwordHash, name, role: "ADMIN", isActive: true },
  });

  await prisma.siteProfile.upsert({
    where: { id: siteProfile.id },
    update: siteProfile,
    create: siteProfile,
  });

  for (const project of projects) {
    await upsertProject(project);
  }

  await prisma.skill.deleteMany();
  await prisma.skillGroup.deleteMany();
  for (const group of skillGroups) {
    await prisma.skillGroup.create({
      data: {
        title: group.title,
        sortOrder: group.sortOrder,
        skills: {
          create: group.skills.map(([skillName, level], index) => ({
            name: skillName,
            level,
            sortOrder: index + 1,
          })),
        },
      },
    });
  }

  await prisma.experience.deleteMany();
  await prisma.experience.createMany({
    data: experiences.map((experience) => ({ ...experience, visible: true })),
  });

  await prisma.socialLink.deleteMany();
  await prisma.socialLink.createMany({
    data: socialLinks.map((link) => ({ ...link, visible: true })),
  });

  await prisma.auditLog.create({
    data: {
      action: "SEED",
      entity: "Database",
      message: "Seeded admin user and initial portfolio content.",
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
