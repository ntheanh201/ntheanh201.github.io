import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// IDs are the file name verbatim; the default slugger would turn
// "package.json" into "packagejson" and break an existing URL.
const generateId = ({ entry }: { entry: string }) => entry.replace(/\.md$/, "");

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts", generateId }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

// Standalone pages (About, Colophon) served under /articles/ like posts,
// but kept out of listings and feeds.
const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages", generateId }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = { posts, pages };
