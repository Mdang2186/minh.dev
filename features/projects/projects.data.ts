import type { Project } from "./projects.types";

export const projects: Project[] = [
  {
    slug: "airline-ticket-booking",
    name: "Airline Ticket Booking (ASP.NET Core MVC)",
    summary: "Hệ thống đặt vé: quản lý chuyến bay, ghế ngồi, vé, thanh toán và dashboard.",
    stack: ["ASP.NET Core", "EF Core", "SQL Server", "Chart.js"],
    featured: true,
    links: { demo: "", repo: "" },
    content: [
      "Mục tiêu: mô hình hoá dữ liệu rõ, CRUD đầy đủ và dashboard thống kê.",
      "Điểm nhấn: phân trang, tìm kiếm, export Excel/PDF, biểu đồ doanh thu.",
      "Mở rộng: test xUnit, seed dữ liệu đa dạng cho thống kê.",
    ],
    img: "/p1.svg",
    iconLists: ["/next.svg", "/tail.svg", "/ts.svg", "/three.svg", "/fm.svg"],
  },
  {
    slug: "portfolio-nextjs-public",
    name: "Portfolio Next.js (Public)",
    summary: "Public site: Home, Projects, Blog, Work, Skills, Tools.",
    stack: ["Next.js", "TypeScript", "Tailwind"],
    featured: true,
    links: { demo: "", repo: "" },
    content: [
      "Tập trung cấu trúc sạch: app routes + features + components.",
      "Có tag/search giúp điều hướng nội dung nhanh.",
      "Sẵn sàng gắn admin sau này mà không phá cấu trúc.",
    ],
    img: "/p2.svg",
    iconLists: ["/next.svg", "/tail.svg", "/ts.svg", "/stream.svg", "/c.svg"],
  },
  {
    slug: "library-management-java",
    name: "Library Management (Java Swing + MySQL)",
    summary: "Ứng dụng quản lý thư viện: sách, độc giả, phiếu mượn, chi tiết phiếu mượn.",
    stack: ["Java Swing", "MySQL", "JDBC"],
    links: { demo: "", repo: "" },
    content: [
      "Thiết kế form theo module: Sách/Tác giả/NXB/Độc giả/Nhân viên.",
      "Kết nối MySQL, CRUD đầy đủ, validate dữ liệu đầu vào.",
    ],
  },
];
