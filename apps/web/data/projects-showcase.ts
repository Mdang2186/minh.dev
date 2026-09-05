/**
 * CẤU HÌNH THỦ CÔNG ẢNH HIỂN THỊ DỰ ÁN (PROJECT SHOWCASE IMAGES)
 * -----------------------------------------------------------
 * Dùng để tuỳ chỉnh thủ công các ảnh hiển thị cho từng dự án ở trang /projects.
 * 
 * Cấu trúc:
 * - cover: Ảnh lớn hiển thị ở khung banner chính (tỉ lệ 21:9 - Cố định).
 * - thumbnails: Mảng chứa tối đa 4 ảnh nhỏ hiển thị ở 4 ô bên dưới (tỉ lệ 16:10).
 * 
 * Hành vi tương tác:
 * - Khung ảnh bìa chính (Hero banner) được giữ cố định, KHÔNG bị thay thế khi nhấp ảnh nhỏ.
 * - Khi người dùng nhấp vào ảnh bìa hoặc bất kỳ ô ảnh nhỏ nào, hệ thống sẽ mở lightbox phóng to xem ảnh đó.
 * 
 * Ưu tiên:
 * - Nếu dự án đã được cài đặt trong trang Admin, dữ liệu từ Database (coverImage & showcaseImages) sẽ được ưu tiên.
 */

export interface ProjectShowcaseItem {
  cover: string;
  thumbnails: string[];
}

export const MANUAL_PROJECT_SHOWCASE: Record<string, ProjectShowcaseItem> = {
  // DỰ ÁN: MOTOR SHOP (slug: 'motorshop')
  motorshop: {
    // 1. Ảnh bìa lớn chính (Hero banner)
    cover: "/projects/MotorShop/Ảnh chụp màn hình 2026-09-04 223930.png",

    // 2. 4 ảnh thumbnail nhỏ bên dưới
    thumbnails: [
      "/projects/MotorShop/Ảnh chụp màn hình 2026-09-04 223950.png", // Top bán chạy & AI Chat
      "/projects/MotorShop/Ảnh chụp màn hình 2026-09-04 224108.png", // Gợi ý AI thông minh
      "/projects/MotorShop/Ảnh chụp màn hình 2026-09-04 224253.png", // Danh mục xe & bộ lọc tìm kiếm
      "/projects/MotorShop/Ảnh chụp màn hình 2026-09-04 224351.png", // Thanh toán & đặt cọc
    ],
  },

  // DỰ ÁN: LUXE INTERIORS (slug: 'luxe-interiors')
  "luxe-interiors": {
    cover: "/uploads/projects/home-1788531093580.png",
    thumbnails: [
      "/uploads/projects/Picture14-1788531093474.png",
      "/uploads/projects/Picture13-1788531093336.png",
      "/uploads/projects/Picture16-1788531093475.png",
      "/uploads/projects/Picture15-1788531093473.png",
    ],
  },

  // DỰ ÁN: QUẢN LÝ HỒ SƠ TUYỂN DỤNG (slug: 'quanly-hstd')
  "quanly-hstd": {
    cover: "/uploads/projects/Picture4-1788531992480.png",
    thumbnails: [
      "/uploads/projects/Picture5-1788531992479.png",
      "/uploads/projects/Picture1-1788531999908.png",
      "/uploads/projects/Picture8-1788531992495.png",
      "/uploads/projects/Picture15-1788531992661.png",
    ],
  },
};

/**
 * DANH SÁCH TẤT CẢ ẢNH CÓ SẴN CỦA MOTORSHOP TRONG THƯ MỤC public/projects/MotorShop/
 * (Bạn có thể copy đường dẫn bất kỳ vào phần cover hoặc thumbnails ở trên)
 * ---------------------------------------------------------------------------------
 * 1.  "/projects/MotorShop/Ảnh chụp màn hình 2026-09-04 223930.png" - Banner chính Hero
 * 2.  "/projects/MotorShop/Ảnh chụp màn hình 2026-09-04 223950.png" - Top bán chạy & AI Chat
 * 3.  "/projects/MotorShop/Ảnh chụp màn hình 2026-09-04 224001.png" - Xe máy mới về
 * 4.  "/projects/MotorShop/Ảnh chụp màn hình 2026-09-04 224018.png" - Danh mục xe & chi tiết
 * 5.  "/projects/MotorShop/Ảnh chụp màn hình 2026-09-04 224108.png" - Tìm kiếm thông minh qua AI
 * 6.  "/projects/MotorShop/Ảnh chụp màn hình 2026-09-04 224132.png" - Chi tiết sản phẩm xe máy
 * 7.  "/projects/MotorShop/Ảnh chụp màn hình 2026-09-04 224150.png" - Kho phụ tùng & đồ chơi xe
 * 8.  "/projects/MotorShop/Ảnh chụp màn hình 2026-09-04 224204.png" - Đánh giá và phản hồi
 * 9.  "/projects/MotorShop/Ảnh chụp màn hình 2026-09-04 224253.png" - Danh mục và bộ lọc sản phẩm
 * 10. "/projects/MotorShop/Ảnh chụp màn hình 2026-09-04 224304.png" - Giỏ hàng
 * 11. "/projects/MotorShop/Ảnh chụp màn hình 2026-09-04 224351.png" - Đặt hàng & thanh toán
 * 12. "/projects/MotorShop/Ảnh chụp màn hình 2026-09-04 224409.png" - Lịch sử mua hàng
 * 13. "/projects/MotorShop/Ảnh chụp màn hình 2026-09-04 224646.png" - Admin: Dashboard
 * 14. "/projects/MotorShop/Ảnh chụp màn hình 2026-09-04 224731.png" - Admin: Quản lý sản phẩm
 * 15. "/projects/MotorShop/Ảnh chụp màn hình 2026-09-04 224738.png" - Admin: Thêm/Sửa sản phẩm
 * 16. "/projects/MotorShop/Ảnh chụp màn hình 2026-09-04 224750.png" - Admin: Quản lý đơn hàng
 * 17. "/projects/MotorShop/Ảnh chụp màn hình 2026-09-04 224811.png" - Admin: Quản lý người dùng
 * 18. "/projects/MotorShop/Ảnh chụp màn hình 2026-09-04 224819.png" - Admin: Thống kê & báo cáo
 * 19. "/projects/MotorShop/Ảnh chụp màn hình 2026-09-04 224839.png" - Admin: Cài đặt hệ thống
 * 20. "/projects/MotorShop/Ảnh chụp màn hình 2026-09-04 224854.png" - Admin: Nhật ký hoạt động
 */
