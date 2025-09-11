import { generateArticleSEO, generateArticleStructuredData } from '../../../lib/seo';
import NewsDescClient from './NewsDescClient';

// Generate metadata for the article page
export async function generateMetadata({ params }) {
  try {
    // Await params before using its properties
    const { slug } = await params;
    
    // Fetch article data for metadata
    const response = await fetch(`http://localhost:1337/api/articles?filters[slug][$eq]=${slug}&populate=*&locale=en`, {
      next: { revalidate: 60 } // Revalidate every minute
    });
    
    if (!response.ok) {
      return {
        title: 'Article Not Found | News Portal',
        description: 'The requested article could not be found.',
      };
    }
    
    const data = await response.json();
    const article = data.data?.[0];
    
    if (!article) {
      return {
        title: 'Article Not Found | News Portal',
        description: 'The requested article could not be found.',
      };
    }
    
    return generateArticleSEO(article);
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Article | News Portal',
      description: 'Read our latest article.',
    };
  }
}

export default async function NewsDesc({ params }) {
  const { slug } = await params;
  return <NewsDescClient slug={slug} />;
}