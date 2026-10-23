import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://ntheanh201.id.vn",
  // Keep the old notion-blog URLs (/articles/<slug>.html, /tag/<tag>.html,
  // /archives.html) so existing links and search results keep working.
  build: { format: "file" },
  trailingSlash: "never",
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
      wrap: false,
    },
  },
});
