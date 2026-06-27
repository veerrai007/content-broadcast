'use client';

import { useContent } from '@/hooks/useContent';
import ContentCard from '@/components/principal/ContentCard';
import RejectModal from '@/components/principal/RejectModal';
import approvalService from '@/services/approvalService';
import { useState, useCallback } from 'react';
import { Content } from '@/types';
import { ClipboardCheck } from 'lucide-react';

export default function ApprovalsPage() {
  const { contents, isLoading, error, refetch } = useContent({ status: 'pending' });

  const [rejectTarget, setRejectTarget] = useState<Content | null>(null);
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [isRejecting, setIsRejecting] = useState(false);

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
        <ClipboardCheck size={20} className="text-gray-400" />
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Pending Approvals</h1>
          <p className="text-sm text-gray-400">
            {isLoading ? '...' : `${contents.length} item${contents.length !== 1 ? 's' : ''} awaiting review`}
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="h-44 bg-gray-100 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
                <div className="h-8 bg-gray-100 rounded animate-pulse mt-3" />
              </div>
            </div>
          ))}
        </div>
      ) : contents.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-20 text-center">
          <ClipboardCheck size={36} className="mx-auto mb-3 text-green-400 opacity-40" />
          <p className="text-gray-500 font-medium">All caught up!</p>
          <p className="text-gray-400 text-sm mt-1">No content pending approval</p>
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