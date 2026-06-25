type ProjectWithRelations = {
  id: string;
  title: string;
  title_vi: string | null;
  title_ja: string | null;
  title_fr: string | null;
  title_es: string | null;
  title_zh: string | null;
  title_ko: string | null;
  slug: string;
  summary: string;
  summary_vi: string | null;
  summary_ja: string | null;
  summary_fr: string | null;
  summary_es: string | null;
  summary_zh: string | null;
  summary_ko: string | null;
  description: string | null;
  description_vi: string | null;
  description_ja: string | null;
  description_fr: string | null;
  description_es: string | null;
  description_zh: string | null;
  description_ko: string | null;
  content: string | null;
  content_vi: string | null;
  content_ja: string | null;
  content_fr: string | null;
  content_es: string | null;
  content_zh: string | null;
  content_ko: string | null;
  coverImage: string | null;
  githubUrl: string | null;
  demoUrl: string | null;
  role: string | null;
  role_vi: string | null;
  role_ja: string | null;
  role_fr: string | null;
  role_es: string | null;
  role_zh: string | null;
  role_ko: string | null;
  duration: string | null;
  teamSize: string | null;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  directoryTree: string | null;
  highlights: string[];
  highlights_vi: string[];
  highlights_ja: string[];
  highlights_fr: string[];
  highlights_es: string[];
  highlights_zh: string[];
  highlights_ko: string[];
  languages: string[];
  tools: string[];
  createdAt: Date;
  updatedAt: Date;
  images: Array<{
    id: string;
    imageUrl: string;
    altText: string | null;
    sortOrder: number;
  }>;
  techStacks: Array<{
    techStack: {
      id: string;
      name: string;
      iconUrl: string | null;
      category: string | null;
    };
  }>;
};

export function serializeAdminProject(project: ProjectWithRelations) {
  return {
    ...project,
    techStacks: project.techStacks.map((item) => item.techStack.name),
    projectImages: project.images
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((image) => ({
        id: image.id,
        imageUrl: image.imageUrl,
        altText: image.altText ?? "",
        sortOrder: image.sortOrder,
      })),
  };
}
