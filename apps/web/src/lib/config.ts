// Site-wide settings. The repo slug comes from GITHUB_REPOSITORY in CI (see astro.config.mjs).

export const REPO = __REPO__;
export const REPO_URL = `https://github.com/${REPO}`;

/** Opens the signature issue form on GitHub. The user must be logged in to submit it. */
export const SIGN_URL = `${REPO_URL}/issues/new?template=sign.yml`;

export const DOMAIN = 'promptstyles.org';

/** The first N people to sign get a "founding signatory" badge. */
export const FOUNDING_LIMIT = 50;

export function editUrl(path: string) {
  return `${REPO_URL}/edit/main/${path}`;
}

export function blobUrl(path: string) {
  return `${REPO_URL}/blob/main/${path}`;
}
