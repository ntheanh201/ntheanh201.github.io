// One-off migration from the old Notion-generated site (notion-blog) to
// Markdown content collections.
//
// Inputs (copied by hand into .migrate-input/, gitignored):
//   articles/*.html  rendered pages from ntheanh201.github.io
//   archives.html    to tell blog posts apart from standalone pages
//   img/             images referenced as /img/<sha1>.<ext>
//   notion_cache/    raw Notion API responses, used only to recover the
//                    language of each code block (the rendered HTML lost it)
//
// Output: src/content/{posts,pages}/<slug>.md and public/img/.
import fs from "node:fs";
import path from "node:path";
import { parse } from "node-html-parser";
import TurndownService from "turndown";

const IN = ".migrate-input";
const OUT_POSTS = "src/content/posts";
const OUT_PAGES = "src/content/pages";

// Notion's code language names -> Shiki language ids.
const LANG = {
  "plain text": "text",
  shell: "bash",
  bash: "bash",
  javascript: "js",
  typescript: "ts",
  yaml: "yaml",
  json: "json",
  go: "go",
  python: "python",
  dockerfile: "dockerfile",
  docker: "dockerfile",
  sql: "sql",
  html: "html",
  css: "css",
  groovy: "groovy",
  markdown: "md",
  nginx: "nginx",
  ini: "ini",
  toml: "toml",
};

// The cache stores entries as "Response:+<byte length>\n<json>".
function loadNotionBlocks(dir) {
  const blocks = {};
  for (const name of fs.readdirSync(dir)) {
    const buf = fs.readFileSync(path.join(dir, name));
    const marker = Buffer.from("Response:+");
    let at = 0;
    while ((at = buf.indexOf(marker, at)) !== -1) {
      const nl = buf.indexOf(0x0a, at);
      const len = Number(buf.subarray(at + marker.length, nl).toString());
      const json = buf.subarray(nl + 1, nl + 1 + len).toString("utf8");
      at = nl + 1 + len;
      let rec;
      try {
        rec = JSON.parse(json);
      } catch {
        continue;
      }
      for (const [id, b] of Object.entries(rec?.recordMap?.block ?? {})) {
        const v = b.value?.value ?? b.value;
        if (v) blocks[id] = v;
      }
    }
  }
  return blocks;
}

function codeLanguages(blocks, pageId) {
  const langs = [];
  const seen = new Set();
  const walk = (id) => {
    if (seen.has(id)) return;
    seen.add(id);
    const b = blocks[id];
    if (!b) return;
    if (b.type === "code") {
      const raw = (b.properties?.language?.[0]?.[0] ?? "plain text").toLowerCase();
      langs.push(LANG[raw] ?? raw.replace(/\s+/g, ""));
    }
    // Don't descend into child pages: they are rendered as separate articles.
    if (b.type === "page" && id !== pageId) return;
    for (const c of b.content ?? []) walk(c);
  };
  walk(pageId);
  return langs;
}

function toISODate(s) {
  const d = new Date(`${s.trim()} UTC`);
  if (Number.isNaN(d.getTime())) throw new Error(`bad date: ${s}`);
  return d.toISOString().slice(0, 10);
}

function yamlString(s) {
  return JSON.stringify(s);
}

function makeTurndown(langs) {
  const td = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
    emDelimiter: "*",
  });
  let codeIndex = 0;
  td.addRule("chroma", {
    filter: (node) => node.nodeName === "PRE",
    replacement: (_content, node) => {
      const lang = langs[codeIndex++] ?? "";
      let text = node.textContent.replace(/\n+$/, "");
      // The old renderer doubled shell line continuations.
      if (lang === "bash") text = text.replace(/ \\\\$/gm, " \\");
      const fence = text.includes("```") ? "~~~~" : "```";
      return `\n\n${fence}${lang === "text" ? "" : lang}\n${text}\n${fence}\n\n`;
    },
  });
  td.addRule("bookmark", {
    filter: (node) => node.nodeName === "FIGURE" && node.querySelector?.(".bookmark"),
    replacement: (_content, node) => {
      const a = node.querySelector(".bookmark a");
      return `\n\n[${a.textContent.trim()}](${a.getAttribute("href")})\n\n`;
    },
  });
  td.addRule("img", {
    filter: "img",
    replacement: (_content, node) => {
      const alt = (node.getAttribute("alt") ?? "").trim();
      return `\n\n![${alt}](${node.getAttribute("src")})\n\n`;
    },
  });
  td.remove((node) => node.classList?.contains("table-of-contents") || node.classList?.contains("toc-container"));
  td.checkCodeCount = () => codeIndex;
  return td;
}

function main() {
  const blocks = loadNotionBlocks(path.join(IN, "notion_cache"));
  const archive = fs.readFileSync(path.join(IN, "archives.html"), "utf8");
  const postSlugs = new Set([...archive.matchAll(/href="\/articles\/([^"]+)\.html"/g)].map((m) => m[1]));

  fs.mkdirSync(OUT_POSTS, { recursive: true });
  fs.mkdirSync(OUT_PAGES, { recursive: true });

  const usedImages = new Set();
  const report = [];

  for (const file of fs.readdirSync(path.join(IN, "articles")).sort()) {
    const slug = file.replace(/\.html$/, "");
    const root = parse(fs.readFileSync(path.join(IN, "articles", file), "utf8"));

    const title = root.querySelector(".article-title").text.trim();
    let published = null;
    let tags = [];
    for (const td of root.querySelectorAll(".article-sidebar-table td")) {
      const label = td.querySelector(".article-sidebar-cell-label")?.text.trim();
      if (label === "Published") published = toISODate(td.querySelector(".article-sidebar-cell-value").text);
      if (label === "Tags") tags = td.querySelectorAll("a").map((a) => a.text.trim());
    }
    const cover = root.querySelector(".article-cover-img")?.getAttribute("src") ?? null;

    const page = root.querySelector(".notion-page");
    const langs = codeLanguages(blocks, page.id);
    const nPre = page.querySelectorAll("pre").length;

    const td = makeTurndown(langs);
    let md = td
      .turndown(page.innerHTML)
      .replace(/\*\*\*\*/g, "")
      .replace(/^(#+ \d+)\\\./gm, "$1.")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    for (const m of md.matchAll(/\/img\/([0-9a-f]+\.\w+)/g)) usedImages.add(m[1]);
    if (cover) usedImages.add(path.basename(cover));

    const firstPara = page
      .querySelectorAll("p")
      .map((p) => p.text.replace(/\s+/g, " ").trim())
      .find((t) => t.length > 40);
    const description = firstPara ? (firstPara.length > 180 ? `${firstPara.slice(0, 177).trimEnd()}…` : firstPara) : "";

    const isPost = postSlugs.has(slug);
    const fm = ["---", `title: ${yamlString(title)}`];
    if (description && isPost) fm.push(`description: ${yamlString(description)}`);
    if (published) fm.push(`date: ${published}`);
    if (tags.length) fm.push(`tags: [${tags.map(yamlString).join(", ")}]`);
    if (cover) fm.push(`cover: ${yamlString(cover)}`);
    fm.push("---", "");

    const outDir = isPost ? OUT_POSTS : OUT_PAGES;
    fs.writeFileSync(path.join(outDir, `${slug}.md`), `${fm.join("\n")}\n${md}\n`);
    report.push({ slug, kind: isPost ? "post" : "page", date: published, tags: tags.join(","), code: `${td.checkCodeCount()}/${nPre} langs=${langs.length}` });
  }

  fs.mkdirSync("public/img", { recursive: true });
  for (const img of usedImages) fs.copyFileSync(path.join(IN, "img", img), path.join("public/img", img));
  for (const f of ["favicon.ico", "thumbnail.png"]) fs.copyFileSync(path.join(IN, "static", f), path.join("public", f));

  console.table(report);
  console.log(`images copied: ${usedImages.size}`);
}

main();
