'use client';

import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface RejectModalProps {
  isOpen: boolean;
  contentTitle: string;
  onConfirm: (reason: string) => void;
  onClose: () => void;
  isLoading: boolean;
}

export default function RejectModal({
  isOpen,
  contentTitle,
  onConfirm,
  onClose,
  isLoading,
}: RejectModalProps) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError('Rejection reason is required');
      return;
    }
    onConfirm(reason.trim());
  };

  const handleClose = () => {
    setReason('');
    setError(null);
    onClose();
  };

  return (
    // Backdrop
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-md space-y-5 p-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red-50 p-2 rounded-lg">
              <AlertTriangle size={18} className="text-red-500" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Reject Content</h2>
              <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">"{contentTitle}"</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Reason Input */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Reason for rejection <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => { setReason(e.target.value); setError(null); }}
            placeholder="Explain why this content is being rejected..."
            rows={4}
            className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors resize-none
              ${error
                ? 'border-red-300 focus:border-red-400'
                : 'border-gray-200 focus:border-gray-400'
              }`}
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : null}
            {isLoading ? 'Rejecting...' : 'Reject Content'}
          </button>
        </div>
      </div>
    </div>
  );
}