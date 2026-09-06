import { prisma } from "@minh-dev/database";
import type {
  PublicExperience,
  PublicProject,
  PublicSiteProfile,
  PublicSkillGroup,
  PublicSocialLink,
  PublicEducation,
  PublicCertification,
  PublicTimelineNode,
} from "./portfolio.types";
import { getLocale } from "next-intl/server";
import { projects as siteProjects } from "@/data/site";
import { unstable_cache } from "next/cache";

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
    console.warn("⚠️ Portfolio database read failed. Using fallback data.", error);
    if (fallback === defaultProfile) {
      return { ...fallback, intro: `DATABASE ERROR: ${error instanceof Error ? error.message : String(error)}` } as any;
    }
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
    try {
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
    } catch (err: any) {
      throw new Error(`DB QUERY ERROR. process.env.DATABASE_URL is: '${process.env.DATABASE_URL}'. Original error: ${err.message}`);
    }
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
      omit: {
        content: true,
        content_vi: true,
        content_es: true,
        content_fr: true,
        content_ja: true,
        content_ko: true,
        content_zh: true,
      },
      include: {
        images: { orderBy: { sortOrder: "asc" }, select: { imageUrl: true, altText: true, folder: true, sortOrder: true } },
        techStacks: { include: { techStack: true } },
      },
    });

    return projects.map((p) => mapProject(p, locale));
  }, [] as PublicProject[]);
}

export async function getPublicProjectBySlug(slug: string): Promise<PublicProject | null> {
  const dbProject = await safeRead(async () => {
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

  if (dbProject) return dbProject;

  const fallback = siteProjects.find((p) => p.slug === slug);
  if (fallback) {
    return {
      id: fallback.slug,
      slug: fallback.slug,
      name: fallback.name,
      summary: fallback.summary,
      description: fallback.description,
      content: fallback.content,
      image: fallback.image,
      screenshots: fallback.screenshots || [],
      detailedImages: (fallback.detailedImages || []).map((img) => ({
        url: img.url,
        altText: img.altText || "",
        folder: img.folder || "",
      })),
      directoryTree: fallback.directoryTree,
      stack: fallback.stack || [],
      languages: fallback.languages || [],
      tools: fallback.tools || [],
      role: fallback.role,
      duration: fallback.duration,
      teamSize: fallback.teamSize,
      featured: false,
      links: fallback.links || {},
      highlights: fallback.highlights || [],
    };
  }

  return null;
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

export async function getPublicEducations(): Promise<PublicEducation[]> {
  return safeRead(async () => {
    const locale = await getSafeLocale();
    const educations = await prisma.education.findMany({
      where: { visible: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    return educations.map((edu) => ({
      id: edu.id,
      title: getLoc(edu, "title", locale) || "",
      org: getLoc(edu, "org", locale) || "",
      period: getLoc(edu, "period", locale) || "",
      degree: getLoc(edu, "degree", locale) || "",
      major: getLoc(edu, "major", locale) || "",
      gpa: edu.gpa || undefined,
      description: getLoc(edu, "description", locale) || undefined,
      logo: edu.logo || undefined,
      images: (edu as any).images || [],
      tags: (edu as any).tags || [],
    }));
  }, []);
}

export async function getPublicCertifications(): Promise<PublicCertification[]> {
  return safeRead(async () => {
    const locale = await getSafeLocale();
    const certs = await (prisma as any).certification.findMany({
      where: { visible: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    return certs.map((cert: any) => ({
      id: cert.id,
      title: getLoc(cert, "title", locale) || "",
      issuer: getLoc(cert, "issuer", locale) || "",
      date: getLoc(cert, "date", locale) || "",
      score: cert.score || undefined,
      url: cert.url || undefined,
      logo: cert.logo || undefined,
      color: cert.color || undefined,
      images: cert.images || [],
      tags: cert.tags || [],
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

  const detailedImages = project.images.map((img: any) => ({
    url: img.imageUrl,
    altText: img.altText || "",
    folder: img.folder || "",
  }));

  return {
    id: project.id,
    slug: project.slug,
    name: getLoc(project, "title", locale) || "",
    summary: getLoc(project, "summary", locale) || "",
    description: getLoc(project, "description", locale) || undefined,
    content: getLoc(project, "content", locale) || undefined,
    image,
    coverImage: project.coverImage ?? undefined,
    showcaseImages: project.showcaseImages || [],
    screenshots,
    detailedImages,
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

export async function getPublicTimelineNodes(): Promise<PublicTimelineNode[]> {
  return safeRead(async () => {
    const locale = await getSafeLocale();
    const nodes = await (prisma as any).timelineNode.findMany({
      where: { visible: true },
      orderBy: [{ date: "desc" }, { sortOrder: "asc" }],
      include: {
        sprints: { orderBy: { startDate: "asc" } },
        project: {
          include: {
            images: { orderBy: { sortOrder: "asc" } },
            techStacks: { include: { techStack: true } },
          },
        },
      },
    });

    return nodes.map((node: any) => ({
      id: node.id,
      title: getLoc(node, "title", locale) || "",
      date: node.date || "",
      type: node.type || "MILESTONE",
      color: node.color || undefined,
      description: getLoc(node, "description", locale) || undefined,
      link: node.link || undefined,
      projectId: node.projectId || undefined,
      project: node.project ? mapProject(node.project, locale) : null,
      sprints: node.sprints.map((sprint: any) => ({
        id: sprint.id,
        title: getLoc(sprint, "title", locale) || "",
        startDate: sprint.startDate || "",
        endDate: sprint.endDate || "",
        description: getLoc(sprint, "description", locale) || undefined,
      })),
    }));
  }, []);
}
