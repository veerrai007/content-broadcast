'use client';

import { useContent } from '@/hooks/useContent';
import StatsCard from '@/components/teacher/StatsCard';
import ContentTable from '@/components/teacher/ContentTable';
import { LayoutDashboard, FileStack, Clock, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import LiveLinkCard from '@/components/teacher/LiveLinkCard';

export default function TeacherDashboard() {
  const { contents, stats, isLoading, error , refetch } = useContent();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LayoutDashboard size={20} className="text-gray-400" />
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-400">Overview of your uploaded content</p>
          </div>
        </div>
        <Link
          href="/teacher/upload"
          className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          + Upload Content
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard label="Total Uploaded" value={stats.total}    icon={FileStack}    color="gray"   />
        <StatsCard label="Pending"         value={stats.pending}  icon={Clock}        color="yellow" />
        <StatsCard label="Approved"        value={stats.approved} icon={CheckCircle}  color="green"  />
        <StatsCard label="Rejected"        value={stats.rejected} icon={XCircle}      color="red"    />
      </div>

      <LiveLinkCard />

      {/* Recent Content */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-700">Recent Content</h2>
          <Link href="/teacher/my-content" className="text-xs text-gray-400 hover:text-gray-600">
            View all →
          </Link>
        </div>
        <ContentTable onDeleted={refetch} contents={contents.slice(0, 5)} isLoading={isLoading} />
      </div>
    </div>
  );
}