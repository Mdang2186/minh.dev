// data/index.ts

export const navItems = [
    { name: "Giới thiệu", link: "#about" },
    { name: "Dự án", link: "#projects" },
    { name: "Kinh nghiệm", link: "#experience" },
    { name: "Liên hệ", link: "#contact" },
];

export const gridItems = [
    {
        id: 1,
        title: "Tôi ưu tiên sự hợp tác với khách hàng, thúc đẩy giao tiếp cởi mở",
        description: "",
        className: "lg:col-span-3 md:col-span-6 md:row-span-4 lg:min-h-[60vh]",
        imgClassName: "w-full h-full",
        titleClassName: "justify-end",
        img: "/b1.svg", // Đảm bảo bạn có ảnh này trong folder public
        spareImg: "",
    },
    {
        id: 2,
        title: "Linh hoạt với mọi múi giờ làm việc",
        description: "",
        className: "lg:col-span-2 md:col-span-3 md:row-span-2",
        imgClassName: "",
        titleClassName: "justify-start",
        img: "",
        spareImg: "",
    },
    {
        id: 3,
        title: "Tech Stack",
        description: "Tôi không ngừng hoàn thiện",
        className: "lg:col-span-2 md:col-span-3 md:row-span-2",
        imgClassName: "",
        titleClassName: "justify-center",
        img: "",
        spareImg: "",
    },
    {
        id: 4,
        title: "Đam mê công nghệ và phát triển sản phẩm",
        description: "",
        className: "lg:col-span-2 md:col-span-3 md:row-span-1",
        imgClassName: "",
        titleClassName: "justify-start",
        img: "/grid.svg",
        spareImg: "/b4.svg",
    },
    {
        id: 5,
        title: "Hiện đang xây dựng thư viện JS Animation",
        description: "Thông tin bên lề",
        className: "md:col-span-3 md:row-span-2",
        imgClassName: "absolute right-0 bottom-0 md:w-96 w-60",
        titleClassName: "justify-center md:justify-start lg:justify-center",
        img: "/b5.svg",
        spareImg: "/grid.svg",
    },
    {
        id: 6,
        title: "Bạn muốn bắt đầu dự án cùng tôi?",
        description: "",
        className: "lg:col-span-2 md:col-span-3 md:row-span-1",
        imgClassName: "",
        titleClassName: "justify-center md:max-w-full max-w-60 text-center",
        img: "",
        spareImg: "",
    },
];

// --- PHẦN QUAN TRỌNG: ĐIỀN THÔNG TIN TỪ CV CỦA BẠN VÀO ĐÂY ---
export const projects = [
    {
        id: 1,
        title: "Project One - E-commerce", // Thay tên dự án
        des: "Xây dựng hệ thống bán hàng với Next.js 14, tích hợp thanh toán Stripe và quản lý kho hàng.", // Thay mô tả
        img: "/p1.svg", // Ảnh dự án
        iconLists: ["/re.svg", "/tail.svg", "/ts.svg", "/three.svg"], // Các icon công nghệ
        link: "https://github.com/docongminh", // Link Github/Demo
    },
    {
        id: 2,
        title: "Project Two - Dashboard",
        des: "Hệ thống quản trị dữ liệu thời gian thực cho doanh nghiệp logistic.",
        img: "/p2.svg",
        iconLists: ["/next.svg", "/tail.svg", "/ts.svg"],
        link: "https://github.com/docongminh",
    },
    // Thêm các dự án khác...
];

export const socialMedia = [
    {
        id: 1,
        img: "/git.svg",
        link: "https://github.com/docongminh",
    },
    {
        id: 2,
        img: "/link.svg",
        link: "https://linkedin.com/in/docongminh",
    },
];

export const workExperience = [
    {
        id: 1,
        title: "Frontend Developer",
        company: "Tech Company A",
        desc: "Developed and maintained web applications using React and Next.js, improving performance by 40%.",
        className: "md:col-span-2",
        thumbnail: "/exp1.svg",
    },
    {
        id: 2,
        title: "Full Stack Developer",
        company: "Startup B",
        desc: "Built scalable backend services and modern user interfaces, handling 10k+ daily active users.",
        className: "md:col-span-2",
        thumbnail: "/exp2.svg",
    },
    {
        id: 3,
        title: "Software Engineer Intern",
        company: "Company C",
        desc: "Collaborated with senior developers to implement new features and fix bugs in legacy systems.",
        className: "md:col-span-2",
        thumbnail: "/exp3.svg",
    },
    {
        id: 4,
        title: "Freelance Developer",
        company: "Self-Employed",
        desc: "Created custom websites and web applications for clients across various industries.",
        className: "md:col-span-2",
        thumbnail: "/exp4.svg",
    },
];
