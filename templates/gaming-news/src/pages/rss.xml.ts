import type { APIRoute } from 'astro';
import siteData from '../data/site-data.json';

export const GET: APIRoute = async () => {
  const { site, articles } = siteData;
  
  const baseUrl = `https://${site.domain}`;
  
  // Фильтруем опубликованные статьи и сортируем по дате
  const publishedArticles = articles
    .filter(article => article.publishedAt)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 20); // Последние 20 статей
  
  // Создаем RSS feed
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${site.name}</title>
    <description>${site.description}</description>
    <link>${baseUrl}</link>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <language>${site.config?.language || 'en'}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${publishedArticles.map(article => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <description><![CDATA[${article.excerpt || ''}]]></description>
      <link>${baseUrl}/articles/${article.slug}</link>
      <guid>${baseUrl}/articles/${article.slug}</guid>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
      <author>${article.author?.name || 'Anonymous'}</author>
      ${article.featured_image ? `<enclosure url="${article.featured_image}" type="image/jpeg" />` : ''}
    </item>`).join('')}
  </channel>
</rss>`;

  return new Response(rss, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}; 