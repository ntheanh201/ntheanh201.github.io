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
    // Shown under the title. Separate from description, which older posts
    // filled with their first paragraph during the Notion migration.
    subtitle: z.string().optional(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
    // Id of the post this one translates. It gets its own page but is listed
    // as a link under the original instead of as a second entry.
    translationOf: z.string().optional(),
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

// Short posts, mostly carried over from LinkedIn and Facebook, kept here so they
// stay findable after the feeds bury them.
const notes = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/notes", generateId }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    // Left out for a note written here first rather than carried over.
    source: z.enum(["LinkedIn", "Facebook"]).optional(),
    sourceUrl: z.string().url().optional(),
    lang: z.string().default("en"),
  }),
});

export const collections = { posts, pages, notes };
