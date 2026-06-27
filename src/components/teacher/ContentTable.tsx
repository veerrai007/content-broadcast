'use client';

import { Content } from '@/types';
import { format } from 'date-fns';
import { ImageIcon, Trash2 } from 'lucide-react';
import { useState } from 'react';
import contentService from '@/services/contentService';

interface ContentTableProps {
  contents: Content[];
  isLoading: boolean;
  onDeleted?: () => void; // callback to refetch after delete
}

const statusStyles: Record<string, string> = {
  pending:  'bg-yellow-50 text-yellow-700 border border-yellow-200',
  approved: 'bg-green-50 text-green-700 border border-green-200',
  rejected: 'bg-red-50 text-red-700 border border-red-200',
};

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-100">
      {[...Array(6)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
        </td>
      ))}
    </tr>
  );
}

export default function ContentTable({ contents, isLoading, onDeleted }: ContentTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId]   = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await contentService.delete(id);
      onDeleted?.();
    } catch {
      alert('Failed to delete. Please try again.');
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Preview</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Title</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Subject</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Uploaded</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(4)].map((_, i) => <SkeletonRow key={i} />)
            ) : contents.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-16 text-gray-400">
                  <ImageIcon size={32} className="mx-auto mb-2 opacity-30" />
                  <p>No content uploaded yet</p>
                </td>
              </tr>
            ) : (
              contents.map((content) => (
                <tr key={content._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">

                  {/* Preview */}
                  <td className="px-4 py-3">
                    <img
                      src={content.fileUrl}
                      alt={content.title}
                      className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                    />
                  </td>

                  {/* Title */}
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{content.title}</p>
                    {content.description && (
                      <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{content.description}</p>
                    )}
                  </td>

                  {/* Subject */}
                  <td className="px-4 py-3 text-gray-600">{content.subject}</td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${statusStyles[content.status]}`}>
                      {content.status}
                    </span>
                    {content.status === 'rejected' && content.rejectionReason && (
                      <p className="text-xs text-red-400 mt-1 max-w-[160px] line-clamp-1">
                        {content.rejectionReason}
                      </p>
                    )}
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {format(new Date(content.createdAt), 'dd MMM yyyy')}
                  </td>

                  {/* Delete Action */}
                  <td className="px-4 py-3">
                    {confirmId === content._id ? (
                      // Confirm state
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDelete(content._id)}
                          disabled={deletingId === content._id}
                          className="text-xs bg-red-500 text-white px-2.5 py-1.5 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-1"
                        >
                          {deletingId === content._id ? (
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : null}
                          {deletingId === content._id ? 'Deleting...' : 'Confirm'}
                        </button>
                        <button
                          onClick={() => setConfirmId(null)}
                          disabled={deletingId === content._id}
                          className="text-xs text-gray-500 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      // Delete button
                      <button
                        onClick={() => setConfirmId(content._id)}
                        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    )}
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}