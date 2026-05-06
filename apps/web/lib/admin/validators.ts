import { z } from "zod";

const emptyToNull = (value: unknown) => {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

const nullableString = z.preprocess(emptyToNull, z.string().nullable()).optional();
const urlLikeSchema = z
  .string()
  .refine((value) => value.startsWith("/") || z.string().url().safeParse(value).success, {
    message: "URL không hợp lệ",
  });
const nullableUrl = z.preprocess(emptyToNull, urlLikeSchema.nullable()).optional();

export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ").toLowerCase(),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

export const profileSchema = z.object({
  name: z.string().trim().min(1, "Tên không được trống"),
  role: z.string().trim().min(1, "Vai trò không được trống"),
  headline: z.string().trim().min(1, "Headline không được trống"),
  intro: z.string().trim().min(1, "Intro không được trống"),
  location: nullableString,
  email: z.preprocess(emptyToNull, z.string().email("Email không hợp lệ").nullable()).optional(),
  phone: nullableString,
  avatarUrl: nullableUrl,
  resumeUrl: nullableUrl,
});

export const projectImageSchema = z.object({
  imageUrl: z.string().trim().min(1, "URL ảnh không được trống"),
  altText: z.string().trim().optional().nullable(),
  sortOrder: z.coerce.number().int().default(0),
});

export const projectSchema = z.object({
  title: z.string().trim().min(1, "Tên dự án không được trống"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug không được trống")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug chỉ gồm chữ thường, số và dấu gạch ngang"),
  summary: z.string().trim().min(1, "Tóm tắt không được trống"),
  description: nullableString,
  content: nullableString,
  coverImage: nullableUrl,
  githubUrl: nullableUrl,
  demoUrl: nullableUrl,
  role: nullableString,
  duration: nullableString,
  teamSize: nullableString,
  featured: z.coerce.boolean().default(false),
  published: z.coerce.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
  directoryTree: nullableString,
  highlights: z.array(z.string().trim().min(1)).default([]),
  languages: z.array(z.string().trim().min(1)).default([]),
  tools: z.array(z.string().trim().min(1)).default([]),
  techStacks: z.array(z.string().trim().min(1)).default([]),
  projectImages: z.array(projectImageSchema).default([]),
});

export const skillGroupSchema = z.object({
  title: z.string().trim().min(1, "Tên nhóm kỹ năng không được trống"),
  sortOrder: z.coerce.number().int().default(0),
});

export const skillSchema = z.object({
  groupId: z.string().min(1, "Thiếu nhóm kỹ năng"),
  name: z.string().trim().min(1, "Tên kỹ năng không được trống"),
  level: nullableString,
  iconUrl: nullableUrl,
  sortOrder: z.coerce.number().int().default(0),
});

export const experienceSchema = z.object({
  title: z.string().trim().min(1, "Tiêu đề không được trống"),
  org: z.string().trim().min(1, "Tổ chức/dự án không được trống"),
  time: z.string().trim().min(1, "Thời gian không được trống"),
  details: z.array(z.string().trim().min(1)).default([]),
  sortOrder: z.coerce.number().int().default(0),
  visible: z.coerce.boolean().default(true),
});

export const socialLinkSchema = z.object({
  name: z.string().trim().min(1, "Tên mạng xã hội không được trống"),
  url: z.string().trim().url("URL không hợp lệ"),
  iconUrl: nullableUrl,
  sortOrder: z.coerce.number().int().default(0),
  visible: z.coerce.boolean().default(true),
});

export function zodErrorMessage(error: z.ZodError) {
  return error.issues.map((issue) => issue.message).join(". ");
}
