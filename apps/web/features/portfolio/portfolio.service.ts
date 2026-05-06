import { prisma } from "@minh-dev/database";
import type {
  PublicExperience,
  PublicProject,
  PublicSiteProfile,
  PublicSkillGroup,
  PublicSocialLink,
} from "./portfolio.types";

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

export async function getPublicSiteProfile(): Promise<PublicSiteProfile> {
  return safeRead(async () => {
    const profile = await prisma.siteProfile.findFirst({ orderBy: { updatedAt: "desc" } });
    if (!profile) return defaultProfile;

    return {
      name: profile.name,
      role: profile.role,
      headline: profile.headline,
      intro: profile.intro,
      location: profile.location ?? "",
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

    return projects.map(mapProject);
  }, [] as PublicProject[]);
}

export async function getPublicProjectBySlug(slug: string): Promise<PublicProject | null> {
  return safeRead(async () => {
    const project = await prisma.project.findFirst({
      where: { slug, published: true },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        techStacks: { include: { techStack: true } },
      },
    });

    return project ? mapProject(project) : null;
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
    const groups = await prisma.skillGroup.findMany({
      orderBy: { sortOrder: "asc" },
      include: { skills: { orderBy: { sortOrder: "asc" } } },
    });

    return groups.map((group) => ({
      id: group.id,
      title: group.title,
      skills: group.skills.map((skill) => ({
        id: skill.id,
        name: skill.name,
        level: skill.level,
        iconUrl: skill.iconUrl,
      })),
    }));
  }, []);
}

export async function getPublicExperiences(): Promise<PublicExperience[]> {
  return safeRead(async () => {
    const experiences = await prisma.experience.findMany({
      where: { visible: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    return experiences.map((experience) => ({
      id: experience.id,
      title: experience.title,
      org: experience.org,
      period: experience.time,
      highlights: experience.details,
    }));
  }, []);
}

function splitContent(value?: string | null) {
  return (value ?? "")
    .split(/\n{2,}|\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function mapProject(project: {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string | null;
  content: string | null;
  coverImage: string | null;
  githubUrl: string | null;
  demoUrl: string | null;
  role: string | null;
  duration: string | null;
  teamSize: string | null;
  featured: boolean;
  directoryTree: string | null;
  highlights: string[];
  languages: string[];
  tools: string[];
  updatedAt: Date;
  images: Array<{ imageUrl: string }>;
  techStacks: Array<{ techStack: { name: string } }>;
}): PublicProject {
  const screenshots = project.images.map((image) => image.imageUrl);
  const image = project.coverImage || screenshots[0] || undefined;
  const stack = project.techStacks.map((item) => item.techStack.name);

  return {
    id: project.id,
    slug: project.slug,
    name: project.title,
    summary: project.summary,
    description: project.description ?? undefined,
    content: splitContent(project.content || project.description || project.summary),
    image,
    screenshots,
    directoryTree: project.directoryTree ?? undefined,
    stack,
    languages: project.languages,
    tools: project.tools,
    role: project.role ?? undefined,
    duration: project.duration ?? undefined,
    teamSize: project.teamSize ?? undefined,
    featured: project.featured,
    updatedAt: project.updatedAt,
    links: {
      github: project.githubUrl ?? undefined,
      repo: project.githubUrl ?? undefined,
      demo: project.demoUrl ?? undefined,
    },
    highlights: project.highlights,
  };
}
