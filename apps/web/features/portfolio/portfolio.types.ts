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
  content?: string;
  image?: string;
  coverImage?: string;
  showcaseImages?: string[];
  screenshots: string[];
  detailedImages?: { url: string; altText: string; folder: string }[];
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

export type PublicEducation = {
  id: string;
  title: string;
  org: string;
  period: string;
  degree: string;
  major: string;
  gpa?: string;
  description?: string;
  logo?: string;
  images: string[];
  tags?: string[];
};

export type PublicCertification = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  score?: string;
  url?: string;
  logo?: string;
  images: string[];
  tags?: string[];
  color?: string;
};

export type PublicSprint = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  description?: string;
};

export type PublicTimelineNode = {
  id: string;
  title: string;
  date: string;
  type: string;
  color?: string;
  shortLabel?: string;
  icon?: string;
  description?: string;
  projectId?: string;
  project?: PublicProject | null;
  sortOrder: number;
  sprints: PublicSprint[];
};
