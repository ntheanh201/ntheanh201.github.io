import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"posts">;

export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection("posts", ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

// Posts shown in lists: translations are left out and linked from their original.
export async function getListedPosts(): Promise<Post[]> {
  return (await getPosts()).filter((p) => !p.data.translationOf);
}

export async function getTranslations(): Promise<Map<string, Post>> {
  const byOriginal = new Map<string, Post>();
  for (const p of await getPosts()) if (p.data.translationOf) byOriginal.set(p.data.translationOf, p);
  return byOriginal;
}

export type Note = CollectionEntry<"notes">;

export async function getNotes(): Promise<Note[]> {
  const notes = await getCollection("notes");
  return notes.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function noteURL(id: string): string {
  return `/notes/${id}.html`;
}

// Same mapping as notion-blog's SafeTagForURL, so /tag/ci-cd.html still resolves.
export function tagSlug(tag: string): string {
  return tag.replace(/[/?&=#+ :;]/g, "-");
}

export function postURL(id: string): string {
  return `/articles/${id}.html`;
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}

export function readingMinutes(body = ""): number {
  const words = body.replace(/```[\s\S]*?```/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
