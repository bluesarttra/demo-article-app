import { getArticles } from '../lib/api';

export default async function sitemap() {
  const baseUrl = 'http://localhost:3000';
  
  try {
    // Fetch all articles
    const articlesResponse = await getArticles({
      pagination: { page: 1, pageSize: 1000 }, // Get all articles
      populate: '*'
    });
    
    const articles = articlesResponse.data || [];
    
    // Generate sitemap entries
    const articleUrls = articles.map((article) => ({
      url: `${baseUrl}/newsdesc/${article.slug}`,
      lastModified: article.updatedAt || article.publishedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
    
    // Static pages
    const staticPages = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/newslist`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
    ];
    
    return [...staticPages, ...articleUrls];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return basic sitemap if there's an error
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/newslist`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
    ];
  }
}
