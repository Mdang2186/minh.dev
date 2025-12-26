import type { MetadataRoute } from "next";
import { siteConfig } from "@/features/site/site.config";
import { getAllPosts } from "@/features/blog/blog.service";
import { getAllProjects } from "@/features/projects/projects.service";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteConfig.url}/`, lastModified: now },
    { url: `${siteConfig.url}/projects`, lastModified: now },
    { url: `${siteConfig.url}/blog`, lastModified: now },
    { url: `${siteConfig.url}/work/experience`, lastModified: now },
    { url: `${siteConfig.url}/work/skills-and-tools`, lastModified: now },
    { url: `${siteConfig.url}/about`, lastModified: now },
    { url: `${siteConfig.url}/contact`, lastModified: now },
    { url: `${siteConfig.url}/tools`, lastModified: now },
    { url: `${siteConfig.url}/tools/ipa`, lastModified: now },
    { url: `${siteConfig.url}/tools/clock`, lastModified: now },
    { url: `${siteConfig.url}/search`, lastModified: now },
  ];

  const posts = getAllPosts().map((p) => ({
    url: `${siteConfig.url}/blog/${p.slug}`,
    lastModified: p.updatedAt ?? p.publishedAt ?? now,
  }));

  const projects = getAllProjects().map((p) => ({
    url: `${siteConfig.url}/projects/${p.slug}`,
    lastModified: p.updatedAt ?? now,
  }));

  return [...staticRoutes, ...posts, ...projects];
}
