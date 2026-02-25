import type { Project } from "./projects.types";

export const projects: Project[] = [
  {
    slug: "motorshop",
    name: "MotorShop – Website Bán Xe Máy",
    summary: "Website bán xe máy với khu vực khách hàng và trang quản trị.",
    stack: ["ASP.NET Core MVC", "HTML/CSS", "Bootstrap/Tailwind", "C#", "SQL Server"],
    featured: true,
    links: {
      repo: "https://github.com/Mdang2186/MotorShop"
    },
    content: [
      "Danh sách sản phẩm có phân trang, tìm kiếm và lọc cơ bản theo hãng/loại xe.",
      "Trang chi tiết xe hiển thị hình ảnh, mô tả, giá, nút thêm vào giỏ hàng.",
      "Giỏ hàng: cập nhật số lượng, xóa sản phẩm, tính tổng tiền và đặt hàng.",
      "Tài khoản khách hàng: đăng ký/đăng nhập, cập nhật thông tin, xem lịch sử đơn hàng.",
      "quản lý sản phẩm, danh mục, đơn hàng; xem thống kê đơn giản về số đơn và doanh thu."
    ],
    img: "", // Placeholder or needs to be added
    iconLists: [],
  },
  {
    slug: "luxe-interiors",
    name: "LUXE INTERIORS – Website Bán Nội Thất",
    summary: "Website thương mại điện tử bán đồ nội thất với đầy đủ luồng mua sắm.",
    stack: ["JSP/JSTL", "HTML/CSS", "JavaScript", "Bootstrap", "Java Servlet", "MySQL"],
    featured: true,
    links: {
      repo: "https://github.com/Mdang2186/LUXE_INTERIORS"
    },
    content: [
      "Danh sách sản phẩm theo danh mục (sofa, bàn ghế, tủ, trang trí...), có phân trang cơ bản.",
      "Trang chi tiết sản phẩm: hình ảnh, mô tả ngắn, thông số chính, giá, nút thêm vào giỏ hàng.",
      "Giỏ hàng: thêm/xóa, cập nhật số lượng, tự động tính tổng tiền và tạo đơn hàng.",
      "Form đặt hàng: nhập thông tin khách hàng, địa chỉ, ghi chú.",
      "quản lý sản phẩm (CRUD), danh mục và xem danh sách đơn hàng."
    ],
    img: "",
    iconLists: [],
  },
  {
    slug: "quanly-hstd",
    name: "Trang web Quản lý Hồ sơ tuyển dụng",
    summary: "Hệ thống web nội bộ quản lý hồ sơ tuyển dụng cho doanh nghiệp.",
    stack: ["ASP.NET MVC (Razor View)", "HTML/CSS", "Bootstrap", "C#", "SQL Server"],
    featured: true,
    links: {
      repo: "https://github.com/Mdang2186/QuanLyHSTD"
    },
    content: [
      "Quản lý tài khoản người dùng, gán vai trò (HR/Interviewer), cấu hình các danh mục dùng chung.",
      "HR: Quản lý vị trí tuyển dụng (tạo/sửa/đóng tuyển), quản lý hồ sơ ứng viên, gán ứng viên vào vị trí, lập lịch phỏng vấn và cập nhật trạng thái ứng viên trong từng bước.",
      "Interviewer: Xem lịch phỏng vấn được phân công, truy cập hồ sơ ứng viên liên quan và nhập kết quả/nhận xét sau phỏng vấn."
    ],
    img: "",
    iconLists: [],
  },
];
