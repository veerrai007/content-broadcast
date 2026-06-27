'use client';

import { Content } from '@/types';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Clock, User, BookOpen, Calendar } from 'lucide-react';

interface ContentCardProps {
  content: Content;
  onApprove?: (id: string) => void;
  onReject?: (content: Content) => void;
  isApproving?: boolean;
  showActions?: boolean;
}

const statusStyles: Record<string, string> = {
  pending:  'bg-yellow-50 text-yellow-700 border border-yellow-200',
  approved: 'bg-green-50 text-green-700 border border-green-200',
  rejected: 'bg-red-50 text-red-700 border border-red-200',
};

const scheduleStatus = (startTime: string, endTime: string) => {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);
  if (now < start) return { label: 'Scheduled', style: 'text-blue-500' };
  if (now > end)   return { label: 'Expired',   style: 'text-gray-400' };
  return              { label: 'Active',     style: 'text-green-500' };
};

export default function ContentCard({
  content,
  onApprove,
  onReject,
  isApproving,
  showActions = true,
}: ContentCardProps) {
  const schedule = scheduleStatus(content.startTime, content.endTime);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-sm transition-shadow">
      {/* Image Preview */}
      <div className="relative h-44 bg-gray-100">
        <img
          src={content.fileUrl}
          alt={content.title}
          className="w-full h-full object-cover"
        />
        {/* Status Badge */}
        <span className={`absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-medium capitalize ${statusStyles[content.status]}`}>
          {content.status}
        </span>
        {/* Schedule Badge */}
        <span className={`absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium ${schedule.style} border border-gray-100`}>
          {schedule.label}
        </span>
      </div>

      {/* Content Info */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{content.title}</h3>
          {content.description && (
            <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{content.description}</p>
          )}
        </div>

        {/* Meta */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <BookOpen size={12} />
            <span>{content.subject}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <User size={12} />
            <span>{content.uploadedBy?.name ?? 'Unknown'}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar size={12} />
            <span>
              {format(new Date(content.startTime), 'dd MMM, HH:mm')} →{' '}
              {format(new Date(content.endTime), 'dd MMM, HH:mm')}
            </span>
          </div>
        </div>

        {/* Rejection Reason */}
        {content.status === 'rejected' && content.rejectionReason && (
          <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            <p className="text-xs text-red-500 font-medium">Rejection reason:</p>
            <p className="text-xs text-red-400 mt-0.5">{content.rejectionReason}</p>
          </div>
        )}

        {/* Actions — only for pending content */}
        {showActions && content.status === 'pending' && (
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => onApprove?.(content._id)}
              disabled={isApproving}
              className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isApproving ? (
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <CheckCircle size={13} />
              )}
              Approve
            </button>
            <button
              onClick={() => onReject?.(content)}
              disabled={isApproving}
              className="flex-1 flex items-center justify-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <XCircle size={13} />
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}