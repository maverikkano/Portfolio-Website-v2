// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

import mdx from '@astrojs/mdx';

const { SITE_URL } = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');

// https://astro.build/config
export default defineConfig({
  // Drives canonical URLs and Open Graph tags. Set SITE_URL in `.env`.
  site: SITE_URL || 'http://localhost:4321',
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
