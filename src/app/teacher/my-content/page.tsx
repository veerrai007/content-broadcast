'use client';

import { useState } from 'react';
import { useContent } from '@/hooks/useContent';
import ContentTable from '@/components/teacher/ContentTable';
import { FileText } from 'lucide-react';
import { ContentStatus } from '@/types';

const statusTabs: { label: string; value: ContentStatus | 'all' }[] = [
  { label: 'All',      value: 'all'      },
  { label: 'Pending',  value: 'pending'  },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
];

export default function MyContentPage() {
  const [activeTab, setActiveTab] = useState<ContentStatus | 'all'>('all');
  const { contents, isLoading, error } = useContent({
    status: activeTab === 'all' ? undefined : activeTab,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <FileText size={20} className="text-gray-400" />
        <div>
          <h1 className="text-xl font-semibold text-gray-900">My Content</h1>
          <p className="text-sm text-gray-400">All your uploaded content and their statuses</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

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

      {/* Table */}
      <ContentTable contents={contents} isLoading={isLoading} />
    </div>
  );
}