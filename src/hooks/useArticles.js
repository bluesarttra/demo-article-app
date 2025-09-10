'use client';

import { useState, useEffect } from 'react';
import { getArticles, getFeaturedArticles, searchArticles } from '../lib/api';

// Custom hook for fetching articles
export function useArticles(params = {}) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getArticles(params);
        setArticles(response.data || []);
        setPagination(response.meta?.pagination || null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [JSON.stringify(params)]);

  return { articles, loading, error, pagination };
}

// Custom hook for fetching articles with sorting
export function useArticlesWithSort(sortValue = '', searchQuery = '') {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Convert sort value to Strapi sort format
        let strapiSort = 'publishedAt:desc'; // default
        switch (sortValue) {
          case 'newest':
            strapiSort = 'publishedAt:desc';
            break;
          case 'oldest':
            strapiSort = 'publishedAt:asc';
            break;
          case 'title-asc':
            strapiSort = 'title:asc';
            break;
          case 'title-desc':
            strapiSort = 'title:desc';
            break;
          case 'popular':
            strapiSort = 'publishedAt:desc'; // You can change this to a popularity field if you have one
            break;
          default:
            strapiSort = 'publishedAt:desc';
        }

        const response = await getArticles({
          sort: strapiSort,
          pagination: { page: 1, pageSize: 10 }
        });
        
        setArticles(response.data || []);
        setPagination(response.meta?.pagination || null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [sortValue]); // Removed searchQuery from dependencies to prevent unnecessary re-renders

  return { articles, loading, error, pagination };
}

// Custom hook for featured articles
export function useFeaturedArticles(limit = 3) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getFeaturedArticles(limit);
        setArticles(response.data || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching featured articles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, [limit]);

  return { articles, loading, error };
}

// Custom hook for search
export function useSearch(query) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query || query.length < 2) {
      setArticles([]);
      setLoading(false);
      return;
    }

    const performSearch = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await searchArticles(query);
        setArticles(response.data || []);
      } catch (err) {
        setError(err.message);
        console.error('Error searching articles:', err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(performSearch, 300); // Debounce search
    return () => clearTimeout(timeoutId);
  }, [query]); // Only depend on query

  return { articles, loading, error };
}
