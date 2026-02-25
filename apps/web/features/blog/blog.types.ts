export type Post = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  content: string[];
  publishedAt: Date;
  updatedAt?: Date;
  featured?: boolean;
  readingTimeMinutes: number;
};
