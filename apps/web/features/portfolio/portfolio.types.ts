export type PublicSiteProfile = {
  name: string;
  role: string;
  headline: string;
  intro: string;
  location: string;
  email: string;
  phone: string;
  avatarUrl: string;
  resumeUrl: string;
};

export type PublicSocialLink = {
  id: string;
  name: string;
  url: string;
  iconUrl?: string | null;
};

export type PublicProject = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description?: string;
  content: string[];
  image?: string;
  screenshots: string[];
  directoryTree?: string;
  stack: string[];
  languages: string[];
  tools: string[];
  role?: string;
  duration?: string;
  teamSize?: string;
  featured: boolean;
  updatedAt?: Date;
  links: {
    github?: string;
    repo?: string;
    demo?: string;
  };
  highlights: string[];
};

export type PublicSkillGroup = {
  id: string;
  title: string;
  skills: Array<{
    id: string;
    name: string;
    level?: string | null;
    iconUrl?: string | null;
  }>;
};

export type PublicExperience = {
  id: string;
  title: string;
  org: string;
  period: string;
  highlights: string[];
};
