type ProjectWithRelations = {
  id: string;
  title: string;
  slug: string;
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
  published: boolean;
  sortOrder: number;
  directoryTree: string | null;
  highlights: string[];
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
