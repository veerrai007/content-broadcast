import { useState, useEffect, useCallback } from 'react';
import contentService from '@/services/contentService';
import { Content, ContentFilters, DashboardStats } from '@/types';

export function useContent(filters: ContentFilters = {}) {
  const [contents, setContents] = useState<Content[]>([]);
  const [stats, setStats] = useState<DashboardStats>({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { contents } = await contentService.getAll(filters);
      setContents(contents);
      setStats({
        total: contents.length,
        pending: contents.filter((c) => c.status === 'pending').length,
        approved: contents.filter((c) => c.status === 'approved').length,
        rejected: contents.filter((c) => c.status === 'rejected').length,
      });
    } catch {
      setError('Failed to load content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [filters.status, filters.search]);

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  return { contents, stats, isLoading, error, refetch: fetchContents };
}