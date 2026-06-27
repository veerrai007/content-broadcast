'use client';

import { useState, useCallback } from 'react';
import { useContent } from '@/hooks/useContent';
import ContentCard from '@/components/principal/ContentCard';
import RejectModal from '@/components/principal/RejectModal';
import approvalService from '@/services/approvalService';
import { Content, ContentStatus } from '@/types';
import { FileStack, Search } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';

const statusTabs: { label: string; value: ContentStatus | 'all' }[] = [
  { label: 'All',      value: 'all'      },
  { label: 'Pending',  value: 'pending'  },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
];

export default function AllContentPage() {
  const [activeTab, setActiveTab]   = useState<ContentStatus | 'all'>('all');
  const [search, setSearch]         = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const { contents, isLoading, error, refetch } = useContent({
    status: activeTab === 'all' ? undefined : activeTab,
    search: debouncedSearch || undefined,
  });

  const [rejectTarget, setRejectTarget] = useState<Content | null>(null);
  const [actioningId, setActioningId]   = useState<string | null>(null);
  const [isRejecting, setIsRejecting]   = useState(false);

  const debounced = useDebouncedCallback((val: string) => {
    setDebouncedSearch(val);
  }, 400);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debounced(e.target.value);
  };

  const handleApprove = useCallback(async (id: string) => {
    setActioningId(id);
    try {
      await approvalService.approve(id);
      await refetch();
    } catch {
      alert('Failed to approve. Please try again.');
    } finally {
      setActioningId(null);
    }
  }, [refetch]);

  const handleRejectConfirm = useCallback(async (reason: string) => {
    if (!rejectTarget) return;
    setIsRejecting(true);
    try {
      await approvalService.reject(rejectTarget._id, reason);
      await refetch();
      setRejectTarget(null);
    } catch {
      alert('Failed to reject. Please try again.');
    } finally {
      setIsRejecting(false);
    }
  }, [rejectTarget, refetch]);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <FileStack size={20} className="text-gray-400" />
        <div>
          <h1 className="text-xl font-semibold text-gray-900">All Content</h1>
          <p className="text-sm text-gray-400">Browse and manage all uploaded content</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by title..."
            className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-gray-400 transition-colors"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors
                ${activeTab === tab.value
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="h-44 bg-gray-100 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : contents.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-20 text-center">
          <FileStack size={36} className="mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 font-medium">No content found</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {contents.map((content) => (
            <ContentCard
              key={content._id}
              content={content}
              onApprove={handleApprove}
              onReject={setRejectTarget}
              isApproving={actioningId === content._id}
              showActions={content.status === 'pending'}
            />
          ))}
        </div>
      )}

      {/* Reject Modal */}
      <RejectModal
        isOpen={!!rejectTarget}
        contentTitle={rejectTarget?.title ?? ''}
        onConfirm={handleRejectConfirm}
        onClose={() => setRejectTarget(null)}
        isLoading={isRejecting}
      />
    </div>
  );
}