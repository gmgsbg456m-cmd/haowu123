import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: 'https://haowu123.com',

  integrations: [
    tailwind(),
    sitemap({
      filter: (page) => !page.includes('/draft/'),
      changefreq: 'daily',
      priority: 0.7,
    }),
    mdx(),
  ],

  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },

  vite: {
    ssr: {
      noExternal: ['@astrojs/sitemap'],
    },
  },

  adapter: cloudflare()
});