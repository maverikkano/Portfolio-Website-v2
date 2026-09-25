import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadEnv } from 'vite';

/**
 * Site configuration, resolved from environment variables at build time.
 *
 * Edit `.env` (copy `.env.example` to get started) to change any of these.
 * Every value has a sensible default, so the site builds with no `.env` at all.
 */

// Environment variables are read via `loadEnv`, which reads `.env` files
// directly — including variables without the `VITE_` prefix. `process.env`
// wins so CI can override without touching a file.
const env = {
  ...loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), ''),
  ...process.env,
};

/** Reads a variable, treating blank strings as "not set". */
const read = (key: string, fallback = ''): string => env[key]?.trim() || fallback;

const name = read('SITE_NAME', 'Your Name');

export const SITE = {
  /** Production origin, used for canonical and Open Graph URLs. */
  url: read('SITE_URL', 'http://localhost:4321').replace(/\/$/, ''),
  name,
  /** Tab title. Falls back to the site name. */
  title: read('SITE_TITLE', name),
  /** Text rendered before the name in the header, e.g. `$`, `~/`, `>`. */
  logo: read('SITE_LOGO', '$'),
  role: read('SITE_ROLE', 'AI Engineer'),
  location: read('SITE_LOCATION'),
  description: read('SITE_DESCRIPTION', 'Personal portfolio.'),
  email: read('SITE_EMAIL'),
  phone: read('SITE_PHONE'),
  /**
   * Path to an image in `public/`. Resolved to `undefined` when the file is
   * absent so the landing page can fall back to a placeholder.
   */
  avatar: publicFile(read('SITE_AVATAR')),
} as const;

export const SOCIAL_LINKS = [
  { label: 'GitHub', href: read('SITE_GITHUB') },
  { label: 'LinkedIn', href: read('SITE_LINKEDIN') },
  { label: 'X', href: read('SITE_X') },
].filter((link) => link.href !== '');

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/projects', label: 'Projects' },
] as const;

/**
 * Returns the path only if the referenced file exists under `public/`.
 * Resolved against the project root — these modules are bundled into `dist/`,
 * so `import.meta.url` would point at the build output rather than the source.
 */
function publicFile(path: string): string | undefined {
  if (!path.startsWith('/')) return undefined;
  return existsSync(resolve(process.cwd(), 'public', path.slice(1))) ? path : undefined;
}
