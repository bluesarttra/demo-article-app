import { notFound } from 'next/navigation';
import { getStrapiMediaURL } from '../../../lib/api';
import { generateArticleSEO, generateArticleStructuredData } from '../../../lib/seo';
import NewsDescClient from './NewsDescClient';

export async function generateMetadata({ params }) {
  try {
    const { slug } = await params;
    const response = await fetch(`http://localhost:1337/api/articles?filters[slug][$eq]=${slug}&populate=*`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return {
        title: 'Article Not Found',
        description: 'The requested article could not be found.',
      };
    }
    
    const data = await response.json();
    
    if (!data.data || data.data.length === 0) {
      return {
        title: 'Article Not Found',
        description: 'The requested article could not be found.',
      };
    }
    
    const article = data.data[0];
    return generateArticleSEO(article);
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
    };
  }
}

export default async function NewsDesc({ params }) {
  try {
    const { slug } = await params;
    const response = await fetch(`http://localhost:1337/api/articles?filters[slug][$eq]=${slug}&populate=*`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      notFound();
    }
    
    const data = await response.json();
    
    if (!data.data || data.data.length === 0) {
      notFound();
    }
    
    const article = data.data[0];
    const structuredData = generateArticleStructuredData(article);
    
    return (
      <>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <NewsDescClient article={article} />
      </>
    );
  } catch (error) {
    console.error('Error fetching article:', error);
    notFound();
  }
}
