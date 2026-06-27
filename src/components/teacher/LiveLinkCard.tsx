'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Copy, Check, Radio, ExternalLink } from 'lucide-react';

export default function LiveLinkCard() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const liveUrl = `${origin}/live/${user?.id}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(liveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="relative">
          <Radio size={16} className="text-gray-700" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full">
            <span className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
          </span>
        </div>
        <p className="text-sm font-medium text-gray-900">Your Live Page</p>
      </div>

      <p className="text-xs text-gray-400 mb-3">
        Share this link with students to show your active broadcast content
      </p>

      {/* URL Box */}
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-600 truncate font-mono">
          {liveUrl}
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors
            ${copied
              ? 'bg-green-50 text-green-600 border border-green-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
            }`}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>

        {/* Open Button */}
        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-gray-900 text-white hover:bg-gray-700 transition-colors"
        >
          <ExternalLink size={13} />
          Open
        </a>
      </div>
    </div>
  );
}