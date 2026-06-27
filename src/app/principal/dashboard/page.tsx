'use client';

import { useContent } from '@/hooks/useContent';
import PrincipalStatsCard from '@/components/principal/PrincipalStatsCard';
import ContentCard from '@/components/principal/ContentCard';
import RejectModal from '@/components/principal/RejectModal';
import approvalService from '@/services/approvalService';
import { useState, useCallback } from 'react';
import { Content } from '@/types';
import { LayoutDashboard, FileStack, Clock, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function PrincipalDashboard() {
  const { contents, stats, isLoading, error, refetch } = useContent();

  const [rejectTarget, setRejectTarget] = useState<Content | null>(null);
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [isRejecting, setIsRejecting] = useState(false);

  const pendingContents = contents.filter((c) => c.status === 'pending').slice(0, 4);

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
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LayoutDashboard size={20} className="text-gray-400" />
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-400">Overview of all content</p>
          </div>
        </div>
        <Link
          href="/principal/approvals"
          className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          View Pending
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <PrincipalStatsCard label="Total Content" value={stats.total}    icon={FileStack}   color="gray"   />
        <PrincipalStatsCard label="Pending"        value={stats.pending}  icon={Clock}       color="yellow" />
        <PrincipalStatsCard label="Approved"       value={stats.approved} icon={CheckCircle} color="green"  />
        <PrincipalStatsCard label="Rejected"       value={stats.rejected} icon={XCircle}     color="red"    />
      </div>

      {/* Pending Content Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-700">Pending Approvals</h2>
          <Link href="/principal/approvals" className="text-xs text-gray-400 hover:text-gray-600">
            View all →
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="h-44 bg-gray-100 animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : pendingContents.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 py-16 text-center">
            <CheckCircle size={32} className="mx-auto mb-2 text-green-400 opacity-50" />
            <p className="text-gray-400 text-sm">All caught up! No pending content.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pendingContents.map((content) => (
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
      </div>

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