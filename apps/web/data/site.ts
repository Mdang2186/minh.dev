export type Project = {
    slug: string;
    name: string;
    summary: string;
    description?: string;
    image?: string;
    screenshots?: string[];
    directoryTree?: string;
    stack: string[];
    languages?: string[];
    tools?: string[];
    role?: string;
    duration?: string;
    teamSize?: string;
    links?: {
        github?: string;
        demo?: string;
    };
    highlights?: string[];
};

export type SkillGroup = {
    title: string;
    items: Array<{
        name: string;
        level: "Frequently Used" | "Occasionally" | "Learning";
    }>;
};

export type ExperienceItem = {
    title: string;
    org?: string;
    time: string;
    details: string[];
};

export const site = {
    name: "Đỗ Công Minh",
    role: "Frontend Developer Intern",
    location: "Hai Bà Trưng, Hà Nội, Việt Nam",
    timezone: "GMT+7",
    email: "mdang2186@gmail.com",
    phone: "0372986808",
    links: {
        github: "https://github.com/Mdang2186",
        linkedin: "https://linkedin.com/in/mdang2186",
        facebook: "https://www.facebook.com/mdang2186",
        instagram: "https://www.instagram.com/mdang2186?utm_source=qr&igsh=cXp4NXY3NXJ0czdj",
        resume: "/resume.pdf",
    },
    headline:
        "a frontend developer intern focused on clean UI, solid UX, and practical products.",
    intro:
        "I’m Minh — a Software Engineering student aiming to become a professional Frontend Developer. I enjoy building modern, intuitive interfaces with strong fundamentals and a product mindset.",
    favoriteStack: ["TypeScript", "Next.js", "React", "Tailwind CSS"],
};

export const projects: Project[] = [
    {
        slug: "motorshop",
        name: "MotorShop — Website Bán Xe Máy",
        summary:
            "Trang web thương mại điện tử chuyên cung cấp và kinh doanh xe máy trực tuyến.",
        description: "MotorShop là dự án website bán hàng trực tuyến toàn diện, cung cấp trải nghiệm mua sắm tiện lợi với các tính năng phân trang, tìm kiếm và lọc sản phẩm. Hệ thống bao gồm giỏ hàng thông minh và quy trình đặt hàng tích hợp. Dự án tập trung vào việc quản lý danh mục xe máy, cung cấp chi tiết toàn diện từ bộ sưu tập hình ảnh, giá cả đến hệ thống quản trị mạnh mẽ.",
        image: "/projects/motorshop_hero.png",
        screenshots: ["/projects/motorshop_hero.png"],
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
        stack: ["React", "Tailwind CSS", "ASP.NET MVC", "SQL Server"],
        languages: ["C#", "JavaScript", "HTML", "CSS"],
        tools: ["Visual Studio", "VS Code", "SSMS", "Git"],
        role: "TEAM LEAD & FRONTEND/UI-UX",
        duration: "10/2025 - 12/2025",
        teamSize: "Academic Project",
        links: {
            github: "https://github.com/Mdang2186/MotorShop",
        },
        highlights: [
            "Danh sách sản phẩm: Hỗ trợ phân trang, công cụ tìm kiếm và lọc nâng cao.",
            "Chi tiết sản phẩm: Cung cấp thư viện hình ảnh, hiển thị giá và chức năng thêm vào giỏ hàng mượt mà.",
            "Quản lý Giỏ hàng: Cập nhật số lượng, xóa sản phẩm và tự động tính tổng tiền thanh toán.",
            "Xác thực người dùng: Hệ thống đăng nhập và phân quyền bảo mật.",
            "Bảng điều khiển Admin: Trình quản lý toàn diện cho danh mục sản phẩm và đơn đặt hàng."
        ],
    },
    {
        slug: "luxe-interiors",
        name: "LUXE INTERIORS — Website Bán Nội Thất",
        summary:
            "Website thương mại điện tử dành cho cửa hàng bán đồ nội thất cao cấp.",
        description: "LUXE INTERIORS là một giải pháp thương mại điện tử toàn diện dành cho cửa hàng bán đồ nội thất. Hệ thống bao gồm trang khách hàng với các chức năng xem sản phẩm, thêm vào giỏ hàng, đặt hàng, và một trang quản trị (Admin) để quản lý danh mục sản phẩm, theo dõi đơn hàng và người dùng. Dự án tập trung vào việc tối ưu hóa giao diện người dùng và quản lý dữ liệu hiệu quả.",
        image: "/projects/luxe_hero.png",
        screenshots: ["/projects/luxe_hero.png"],
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
        stack: ["Java", "JSP/Servlet", "Bootstrap", "MySQL"],
        languages: ["Java", "HTML", "CSS", "JavaScript"],
        tools: ["NetBeans", "MySQL", "Git"],
        role: "BACKEND TEAM LEAD",
        duration: "1.5 MONTHS",
        teamSize: "4 MEMBERS",
        links: {
            github: "https://github.com/Mdang2186/LUXE_INTERIORS",
        },
        highlights: [
            "Khám phá danh mục: Hệ thống phân loại thông minh (sofa, bàn, ghế, v.v).",
            "Trải nghiệm thanh toán: Quy trình giỏ hàng và thanh toán được tối ưu hóa.",
            "Quản lý Admin: Hệ thống kiểm soát sản phẩm và theo dõi đơn hàng thời gian thực.",
            "Thiết kế Responsive: Tương thích hoàn hảo trên cả thiết bị di động và máy tính bàn.",
            "Tích hợp bảo mật: Áp dụng các cơ chế xác thực an toàn cho người dùng."
        ],
    },
    {
        slug: "quanly-hstd",
        name: "Quản Lý Hồ Sơ Tuyển Dụng",
        summary:
            "Hệ thống web nội bộ quản lý ứng viên, lên lịch phỏng vấn và theo dõi kết quả.",
        description: "Hệ thống Quản Lý Hồ Sơ Tuyển Dụng là một ứng dụng nội bộ được thiết kế để số hóa và tối ưu hóa quy trình tuyển dụng của doanh nghiệp. Nền tảng này giúp đội ngũ nhân sự (HR) dễ dàng thu thập, phân loại hồ sơ ứng viên, lên lịch phỏng vấn và ghi nhận đánh giá từ người phỏng vấn. Qua đó, rút ngắn thời gian xử lý và nâng cao hiệu quả tuyển dụng.",
        image: "/projects/quanly_hero.png",
        screenshots: ["/projects/quanly_hero.png"],
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
        stack: ["ASP.NET MVC", "Razor", "C#", "SQL Server"],
        languages: ["C#", "HTML", "CSS", "JavaScript"],
        tools: ["Visual Studio", "SSMS", "Figma", "Git"],
        role: "FULLSTACK DEVELOPER",
        duration: "3 MONTHS",
        teamSize: "2 MEMBERS",
        links: {
            github: "https://github.com/Mdang2186/QuanLyHSTD",
        },
        highlights: [
            "Luồng người dùng đa cấp: Thiết lập luồng thao tác riêng biệt cho HR và Người phỏng vấn.",
            "Quản lý hồ sơ: Lưu trữ chi tiết thông tin ứng viên và phân công vị trí phù hợp.",
            "Lên lịch tự động: Hỗ trợ tạo lịch phỏng vấn và nhập thông tin phản hồi sau phỏng vấn.",
            "Báo cáo thống kê: Bảng điều khiển phân tích số liệu và tình trạng tuyển dụng.",
            "Thông báo Email: Hệ thống tự động đẩy email xác nhận lịch cho ứng viên."
        ],
    },
];

export const skillGroups: SkillGroup[] = [
    {
        title: "Front-end",
        items: [
            { name: "HTML/CSS", level: "Frequently Used" },
            { name: "React", level: "Frequently Used" },
            { name: "Tailwind CSS", level: "Frequently Used" },
            { name: "TypeScript", level: "Occasionally" },
            { name: "Next.js", level: "Learning" },
        ],
    },
    {
        title: "Back-end / Database (foundation)",
        items: [
            { name: "ASP.NET MVC / Core", level: "Occasionally" },
            { name: "Entity Framework", level: "Occasionally" },
            { name: "Java Servlet/JDBC", level: "Occasionally" },
            { name: "SQL Server / MySQL", level: "Occasionally" },
        ],
    },
    {
        title: "Tools",
        items: [
            { name: "Git / GitHub", level: "Frequently Used" },
            { name: "Postman", level: "Occasionally" },
            { name: "VS / VS Code", level: "Frequently Used" },
            { name: "Figma (basic)", level: "Learning" },
        ],
    },
];

export const experience: ExperienceItem[] = [
    {
        title: "Software Engineering — Student",
        org: "Trường Đại học Kinh tế - Kỹ thuật Công nghiệp (UNETI)",
        time: "2022 — 2026",
        details: [
            "GPA: 3.31/4.0",
            "Major: Software Engineering",
            "Focus: Frontend fundamentals, UI implementation, and team-based projects",
        ],
    },
];

export const softSkills = [
    "Teamwork",
    "Clear communication",
    "Time management",
    "Team leading & problem solving",
    "Resource optimization mindset",
];

export const interests = ["UI trend learning", "Market research", "Tech news"];

