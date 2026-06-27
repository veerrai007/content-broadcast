'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import liveService from '@/services/liveService';
import ContentSlideshow from '@/components/live/ContentSlideshow';
import { Content } from '@/types';
import { Radio, RefreshCw } from 'lucide-react';

const POLL_INTERVAL = 30 * 1000; // 30 seconds

export default function LivePage() {
  const { teacherId } = useParams<{ teacherId: string }>();

  const [contents, setContents]   = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchContent = useCallback(async () => {
    setError(null);
    try {
      const { contents } = await liveService.getActiveContent(teacherId);
      setContents(contents);
      setLastUpdated(new Date());
    } catch {
      setError('Failed to load content. Please refresh.');
    } finally {
      setIsLoading(false);
    }
  }, [teacherId]);

  // Initial fetch
  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  // Polling — auto refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchContent, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchContent]);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Radio size={18} className="text-gray-700" />
            {/* Live pulse dot */}
            {!isLoading && contents.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full">
                <span className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
              </span>
            )}
          </div>
          <span className="text-sm font-semibold text-gray-900 tracking-tight">
            EduBroadcast
          </span>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            Live
          </span>
        </div>

        {/* Last updated + manual refresh */}
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-gray-400 hidden sm:block">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={fetchContent}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {/* Skeleton */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="h-80 bg-gray-100 animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-gray-100 rounded animate-pulse w-2/3" />
                <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2" />
                <div className="h-3 bg-gray-100 rounded animate-pulse w-1/3 mt-4" />
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="text-center py-20">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 inline-block">
              <p className="text-red-500 font-medium text-sm">{error}</p>
              <button
                onClick={fetchContent}
                className="mt-4 text-xs bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && contents.length === 0 && (
          <div className="text-center py-24">
            <div className="inline-flex flex-col items-center gap-3">
              <div className="bg-gray-100 p-5 rounded-full">
                <Radio size={28} className="text-gray-400" />
              </div>
              <div>
                <p className="text-gray-600 font-medium">No content available</p>
                <p className="text-gray-400 text-sm mt-1">
                  Check back later — content will appear here when it goes live
                </p>
              </div>
              <p className="text-xs text-gray-300 mt-2">
                Auto-refreshes every 30 seconds
              </p>
            </div>
          </div>
        )}

        {/* Content Slideshow */}
        {!isLoading && !error && contents.length > 0 && (
          <ContentSlideshow contents={contents} />
        )}
      </main>
    </div>
  );
}