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
  name_vi: nullableString,
  name_ja: nullableString,
  name_fr: nullableString,
  name_es: nullableString,
  name_zh: nullableString,
  name_ko: nullableString,
  role: z.string().trim().min(1, "Vai trò không được trống"),
  role_vi: nullableString,
  role_ja: nullableString,
  role_fr: nullableString,
  role_es: nullableString,
  role_zh: nullableString,
  role_ko: nullableString,
  headline: z.string().trim().min(1, "Headline không được trống"),
  headline_vi: nullableString,
  headline_ja: nullableString,
  headline_fr: nullableString,
  headline_es: nullableString,
  headline_zh: nullableString,
  headline_ko: nullableString,
  intro: z.string().trim().min(1, "Intro không được trống"),
  intro_vi: nullableString,
  intro_ja: nullableString,
  intro_fr: nullableString,
  intro_es: nullableString,
  intro_zh: nullableString,
  intro_ko: nullableString,
  location: nullableString,
  location_vi: nullableString,
  location_ja: nullableString,
  location_fr: nullableString,
  location_es: nullableString,
  location_zh: nullableString,
  location_ko: nullableString,
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
  title_vi: nullableString,
  title_ja: nullableString,
  title_fr: nullableString,
  title_es: nullableString,
  title_zh: nullableString,
  title_ko: nullableString,
  slug: z
    .string()
    .trim()
    .min(1, "Slug không được trống")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug chỉ gồm chữ thường, số và dấu gạch ngang"),
  summary: z.string().trim().min(1, "Tóm tắt không được trống"),
  summary_vi: nullableString,
  summary_ja: nullableString,
  summary_fr: nullableString,
  summary_es: nullableString,
  summary_zh: nullableString,
  summary_ko: nullableString,
  description: nullableString,
  description_vi: nullableString,
  description_ja: nullableString,
  description_fr: nullableString,
  description_es: nullableString,
  description_zh: nullableString,
  description_ko: nullableString,
  content: nullableString,
  content_vi: nullableString,
  content_ja: nullableString,
  content_fr: nullableString,
  content_es: nullableString,
  content_zh: nullableString,
  content_ko: nullableString,
  coverImage: nullableUrl,
  githubUrl: nullableUrl,
  demoUrl: nullableUrl,
  role: nullableString,
  role_vi: nullableString,
  role_ja: nullableString,
  role_fr: nullableString,
  role_es: nullableString,
  role_zh: nullableString,
  role_ko: nullableString,
  duration: nullableString,
  teamSize: nullableString,
  featured: z.coerce.boolean().default(false),
  published: z.coerce.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
  directoryTree: nullableString,
  highlights: z.array(z.string().trim().min(1)).default([]),
  highlights_vi: z.array(z.string().trim().min(1)).default([]),
  highlights_ja: z.array(z.string().trim().min(1)).default([]),
  highlights_fr: z.array(z.string().trim().min(1)).default([]),
  highlights_es: z.array(z.string().trim().min(1)).default([]),
  highlights_zh: z.array(z.string().trim().min(1)).default([]),
  highlights_ko: z.array(z.string().trim().min(1)).default([]),
  languages: z.array(z.string().trim().min(1)).default([]),
  tools: z.array(z.string().trim().min(1)).default([]),
  techStacks: z.array(z.string().trim().min(1)).default([]),
  projectImages: z.array(projectImageSchema).default([]),
});

export const skillGroupSchema = z.object({
  title: z.string().trim().min(1, "Tên nhóm kỹ năng không được trống"),
  title_vi: nullableString,
  title_ja: nullableString,
  title_fr: nullableString,
  title_es: nullableString,
  title_zh: nullableString,
  title_ko: nullableString,
  sortOrder: z.coerce.number().int().default(0),
});

export const skillSchema = z.object({
  groupId: z.string().min(1, "Thiếu nhóm kỹ năng"),
  name: z.string().trim().min(1, "Tên kỹ năng không được trống"),
  name_vi: nullableString,
  name_ja: nullableString,
  name_fr: nullableString,
  name_es: nullableString,
  name_zh: nullableString,
  name_ko: nullableString,
  level: nullableString,
  iconUrl: nullableUrl,
  sortOrder: z.coerce.number().int().default(0),
});

export const experienceSchema = z.object({
  title: z.string().trim().min(1, "Tiêu đề không được trống"),
  title_vi: nullableString,
  title_ja: nullableString,
  title_fr: nullableString,
  title_es: nullableString,
  title_zh: nullableString,
  title_ko: nullableString,
  org: z.string().trim().min(1, "Tổ chức/dự án không được trống"),
  org_vi: nullableString,
  org_ja: nullableString,
  org_fr: nullableString,
  org_es: nullableString,
  org_zh: nullableString,
  org_ko: nullableString,
  time: z.string().trim().min(1, "Thời gian không được trống"),
  time_vi: nullableString,
  time_ja: nullableString,
  time_fr: nullableString,
  time_es: nullableString,
  time_zh: nullableString,
  time_ko: nullableString,
  details: z.array(z.string().trim().min(1)).default([]),
  details_vi: z.array(z.string().trim().min(1)).default([]),
  details_ja: z.array(z.string().trim().min(1)).default([]),
  details_fr: z.array(z.string().trim().min(1)).default([]),
  details_es: z.array(z.string().trim().min(1)).default([]),
  details_zh: z.array(z.string().trim().min(1)).default([]),
  details_ko: z.array(z.string().trim().min(1)).default([]),
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
