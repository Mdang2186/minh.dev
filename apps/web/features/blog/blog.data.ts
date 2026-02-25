import type { Post } from "./blog.types";

export const posts: Post[] = [
  {
    slug: "nextjs-public-structure",
    title: "Cấu trúc Public Next.js (App Router) chuẩn để mở rộng",
    description:
      "Route groups, features/service/repo pattern và các trang cần có cho portfolio/blog.",
    tags: ["Next.js", "App Router", "Architecture"],
    publishedAt: new Date("2025-12-01"),
    readingTimeMinutes: 6,
    featured: true,
    content: [
      "Bài viết này tóm tắt cách tổ chức thư mục Public để dự án dễ mở rộng và bảo trì.",
      "Điểm mấu chốt: tách app routes và business logic theo module (features).",
      "Bạn có thể thay data file-based bằng DB và gắn admin sau này mà không phá cấu trúc.",
    ],
  },
  {
    slug: "clean-ui-ux-for-portfolio",
    title: "UI/UX gọn cho portfolio: ưu tiên nội dung",
    description: "Một bộ nguyên tắc đơn giản để trang nhìn chuyên nghiệp nhưng không rối.",
    tags: ["UI/UX", "Tailwind", "Portfolio"],
    publishedAt: new Date("2025-12-05"),
    readingTimeMinutes: 5,
    featured: true,
    content: [
      "Giảm nhiễu: ít màu, ít animation, typography rõ.",
      "Một layout nhất quán: Container + spacing theo nhịp.",
      "Card list rõ thông tin: title, 1–2 dòng mô tả, tags.",
    ],
  },
  {
    slug: "tag-search-pattern",
    title: "Tag + Search: pattern đơn giản nhưng hiệu quả",
    description: "Tạo tag page và search page để điều hướng nội dung nhanh.",
    tags: ["Search", "Tag", "Patterns"],
    publishedAt: new Date("2025-12-08"),
    readingTimeMinutes: 4,
    content: [
      "Tag giúp điều hướng theo chủ đề; Search giúp tìm theo từ khoá.",
      "Làm nhanh bằng filter trong service trước khi tối ưu bằng DB hoặc search engine.",
    ],
  },
];
