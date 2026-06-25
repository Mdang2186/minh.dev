import { prisma } from "@minh-dev/database";
import type {
  PublicExperience,
  PublicProject,
  PublicSiteProfile,
  PublicSkillGroup,
  PublicSocialLink,
} from "./portfolio.types";
import { getLocale } from "next-intl/server";

export const defaultProfile: PublicSiteProfile = {
  name: "Portfolio",
  role: "Developer",
  headline: "Building clean, practical web experiences.",
  intro: "Portfolio content is being prepared.",
  location: "",
  email: "",
  phone: "",
  avatarUrl: "/avatar1.png",
  resumeUrl: "/resume.pdf",
};

async function safeRead<T>(reader: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await reader();
  } catch (error) {
    console.error("Portfolio database read failed", error);
    return fallback;
  }
}

async function getSafeLocale(): Promise<string> {
  try {
    return await getLocale();
  } catch {
    return 'en';
  }
}

function getLoc(obj: any, base: string, locale: string) {
  if (!obj) return null;
  if (locale === 'en') return obj[base];
  
  const locVal = obj[`${base}_${locale}`];
  
  if (Array.isArray(locVal)) {
    return locVal.length > 0 ? locVal : obj[base];
  }
  
  return locVal ? locVal : obj[base];
}

export async function getPublicSiteProfile(): Promise<PublicSiteProfile> {
  return safeRead(async () => {
    const locale = await getSafeLocale();
    const profile = await prisma.siteProfile.findFirst({ orderBy: { updatedAt: "desc" } });
    if (!profile) return defaultProfile;

    return {
      name: getLoc(profile, "name", locale) || "",
      role: getLoc(profile, "role", locale) || "",
      headline: getLoc(profile, "headline", locale) || "",
      intro: getLoc(profile, "intro", locale) || "",
      location: getLoc(profile, "location", locale) || "",
      email: profile.email ?? "",
      phone: profile.phone ?? "",
      avatarUrl: profile.avatarUrl ?? defaultProfile.avatarUrl,
      resumeUrl: profile.resumeUrl ?? defaultProfile.resumeUrl,
    };
  }, defaultProfile);
}

export async function getPublicSocialLinks(): Promise<PublicSocialLink[]> {
  return safeRead(async () => {
    const links = await prisma.socialLink.findMany({
      where: { visible: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    return links.map((link) => ({
      id: link.id,
      name: link.name,
      url: link.url,
      iconUrl: link.iconUrl,
    }));
  }, []);
}

export async function getPublicProjects(
  options: { featured?: boolean; limit?: number } = {}
): Promise<PublicProject[]> {
  return safeRead(async () => {
    const locale = await getSafeLocale();
    const projects = await prisma.project.findMany({
      where: {
        published: true,
        ...(options.featured === undefined ? {} : { featured: options.featured }),
      },
      orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
      take: options.limit,
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        techStacks: { include: { techStack: true } },
      },
    });

    return projects.map((p) => mapProject(p, locale));
  }, [] as PublicProject[]);
}

export async function getPublicProjectBySlug(slug: string): Promise<PublicProject | null> {
  return safeRead(async () => {
    const locale = await getSafeLocale();
    const project = await prisma.project.findFirst({
      where: { slug, published: true },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        techStacks: { include: { techStack: true } },
      },
    });

    return project ? mapProject(project, locale) : null;
  }, null as PublicProject | null);
}

export async function getPublicProjectsByTag(tag: string) {
  const projects = await getPublicProjects();
  const normalizedTag = tag.toLowerCase();
  return projects.filter((project) =>
    project.stack.some((item) => item.toLowerCase() === normalizedTag)
  );
}

export async function getPublicSkillGroups(): Promise<PublicSkillGroup[]> {
  return safeRead(async () => {
    const locale = await getSafeLocale();
    const groups = await prisma.skillGroup.findMany({
      orderBy: { sortOrder: "asc" },
      include: { skills: { orderBy: { sortOrder: "asc" } } },
    });

    return groups.map((group) => ({
      id: group.id,
      title: getLoc(group, "title", locale) || "",
      skills: group.skills.map((skill) => ({
        id: skill.id,
        name: getLoc(skill, "name", locale) || "",
        level: skill.level,
        iconUrl: skill.iconUrl,
      })),
    }));
  }, []);
}

export async function getPublicExperiences(): Promise<PublicExperience[]> {
  return safeRead(async () => {
    const locale = await getSafeLocale();
    const experiences = await prisma.experience.findMany({
      where: { visible: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    return experiences.map((experience) => ({
      id: experience.id,
      title: getLoc(experience, "title", locale) || "",
      org: getLoc(experience, "org", locale) || "",
      period: getLoc(experience, "time", locale) || "",
      highlights: getLoc(experience, "details", locale) || [],
    }));
  }, []);
}

function splitContent(value?: string | null) {
  return (value ?? "")
    .split(/\n{2,}|\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function mapProject(project: any, locale: string): PublicProject {
  const screenshots = project.images.map((image: any) => image.imageUrl);
  const image = project.coverImage || screenshots[0] || undefined;
  const stack = project.techStacks.map((item: any) => item.techStack.name);

  return {
    id: project.id,
    slug: project.slug,
    name: getLoc(project, "title", locale) || "",
    summary: getLoc(project, "summary", locale) || "",
    description: getLoc(project, "description", locale) || undefined,
    content: splitContent(getLoc(project, "content", locale) || getLoc(project, "description", locale) || getLoc(project, "summary", locale)),
    image,
    screenshots,
    directoryTree: project.directoryTree ?? undefined,
    stack,
    languages: project.languages,
    tools: project.tools,
    role: getLoc(project, "role", locale) || undefined,
    duration: project.duration ?? undefined,
    teamSize: project.teamSize ?? undefined,
    featured: project.featured,
    updatedAt: project.updatedAt,
    links: {
      github: project.githubUrl ?? undefined,
      repo: project.githubUrl ?? undefined,
      demo: project.demoUrl ?? undefined,
    },
    highlights: getLoc(project, "highlights", locale) || [],
  };
}
