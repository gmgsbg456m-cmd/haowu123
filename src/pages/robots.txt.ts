import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  const sitemapURL = new URL('sitemap-index.xml', 'https://haowu123.com');
  return new Response(
    `User-agent: *
Allow: /
Disallow: /search
Disallow: /draft/

Sitemap: ${sitemapURL.href}

# 百度爬虫
User-agent: Baiduspider
Allow: /
Disallow: /search
`,
    { headers: { 'Content-Type': 'text/plain' } }
  );
};
