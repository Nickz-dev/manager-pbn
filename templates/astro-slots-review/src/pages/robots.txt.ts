import type { APIRoute } from 'astro';
import siteData from '../data/site-data.json';

export const GET: APIRoute = async () => {
  const { site } = siteData;
  
  const baseUrl = `https://${site.domain}`;
  
  // Создаем robots.txt
  const robotsTxt = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /private/

# Allow important files
Allow: /sitemap.xml
Allow: /rss.xml
Allow: /favicon.ico
Allow: /robots.txt

# Crawl delay (optional)
Crawl-delay: 1`;

  return new Response(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}; 