export type Project = {
    slug: string;
    name: string;
    summary: string;
    description?: string;
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
            "E-commerce website for motorbikes with pagination, search/filter, cart, and ordering flow.",
        description: "MotorShop là một ứng dụng web thương mại điện tử chuyên cung cấp và kinh doanh xe máy trực tuyến. Dự án được xây dựng nhằm mang lại trải nghiệm mua sắm tiện lợi, nhanh chóng với đầy đủ các tính năng của một trang bán hàng chuyên nghiệp. Giao diện được thiết kế trực quan, dễ sử dụng, giúp khách hàng dễ dàng tìm kiếm, lọc sản phẩm theo nhu cầu và thực hiện quy trình thanh toán một cách mượt mà.",
        stack: ["React", "Tailwind CSS", "ASP.NET MVC", "SQL Server"],
        languages: ["C#", "JavaScript", "HTML", "CSS"],
        tools: ["Visual Studio", "VS Code", "SQL Server Management Studio", "Git"],
        role: "Fullstack Developer",
        duration: "2 Months",
        teamSize: "3 Members",
        links: {
            github: "https://github.com/Mdang2186/MotorShop",
        },
        highlights: [
            "Product listing with pagination, search & basic filters",
            "Product detail page with gallery, price, add-to-cart",
            "Cart: update quantity, remove items, compute totals",
            "User authentication and authorization",
            "Admin panel for product and order management"
        ],
    },
    {
        slug: "luxe-interiors",
        name: "LUXE INTERIORS — Website Bán Nội Thất",
        summary:
            "Furniture e-commerce website with user ordering flow and admin management area.",
        description: "LUXE INTERIORS là một giải pháp thương mại điện tử toàn diện dành cho cửa hàng bán đồ nội thất. Hệ thống bao gồm trang khách hàng với các chức năng xem sản phẩm, thêm vào giỏ hàng, đặt hàng, và một trang quản trị (Admin) để quản lý danh mục sản phẩm, theo dõi đơn hàng và người dùng. Dự án tập trung vào việc tối ưu hóa giao diện người dùng và quản lý dữ liệu hiệu quả.",
        stack: ["Java", "JSP/Servlet", "Bootstrap", "MySQL"],
        languages: ["Java", "HTML", "CSS", "JavaScript"],
        tools: ["NetBeans", "MySQL", "Git"],
        role: "Backend Team Lead",
        duration: "1.5 Months",
        teamSize: "4 Members",
        links: {
            github: "https://github.com/Mdang2186/LUXE_INTERIORS",
        },
        highlights: [
            "Category browsing (sofa/table/etc.)",
            "Cart and checkout experience",
            "Admin management for products & orders",
            "Responsive design for mobile and desktop",
            "Integration with secure authentication mechanisms"
        ],
    },
    {
        slug: "quanly-hstd",
        name: "Quản Lý Hồ Sơ Tuyển Dụng",
        summary:
            "Internal web system for managing candidates, scheduling interviews, and tracking results.",
        description: "Hệ thống Quản Lý Hồ Sơ Tuyển Dụng là một ứng dụng nội bộ được thiết kế để số hóa và tối ưu hóa quy trình tuyển dụng của doanh nghiệp. Nền tảng này giúp đội ngũ nhân sự (HR) dễ dàng thu thập, phân loại hồ sơ ứng viên, lên lịch phỏng vấn và ghi nhận đánh giá từ người phỏng vấn. Qua đó, rút ngắn thời gian xử lý và nâng cao hiệu quả tuyển dụng.",
        stack: ["ASP.NET MVC", "Razor", "C#", "SQL Server"],
        languages: ["C#", "HTML", "CSS", "JavaScript"],
        tools: ["Visual Studio", "SQL Server Management Studio", "Figma", "Git"],
        role: "Fullstack Developer",
        duration: "3 Months",
        teamSize: "2 Members",
        links: {
            github: "https://github.com/Mdang2186/QuanLyHSTD",
        },
        highlights: [
            "Role-based flows: HR / Interviewer",
            "Candidate profile management and assignment",
            "Interview scheduling and feedback input",
            "Dashboard statistics and reporting",
            "Automated email notifications for candidates"
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
