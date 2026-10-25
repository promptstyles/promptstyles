import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

// The monorepo root. The site reads ../../taxonomy and ../../manifesto at build time.
const repoRoot = fileURLToPath(new URL('../..', import.meta.url));

// In CI the deploy workflow sets these from actions/configure-pages, so the site works both on
// https://<owner>.github.io/<repo>/ and on a custom domain. Locally they fall back to defaults.
const site = process.env.SITE_URL || 'https://promptstyles.org';
const base = process.env.BASE_PATH || '/';

// "owner/repo" on GitHub. Actions sets GITHUB_REPOSITORY automatically.
const repo = process.env.GITHUB_REPOSITORY || 'promptstyles/promptstyles';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  vite: {
    define: {
      __REPO_ROOT__: JSON.stringify(repoRoot),
      __REPO__: JSON.stringify(repo),
    },
  },
});
