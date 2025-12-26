export type Project = {
  slug: string;
  name: string;
  summary: string;
  stack: string[];
  content: string[];
  featured?: boolean;
  updatedAt?: Date;
  links: {
    demo?: string;
    repo?: string;
  };
  img?: string;
  iconLists?: string[];
};
