'use client';

import { useState, useEffect, useCallback } from 'react';
import { Content } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ContentSlideshowProps {
  contents: Content[];
}

export default function ContentSlideshow({ contents }: ContentSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const current = contents[currentIndex];
  const duration = (current?.rotationDuration ?? 10) * 1000; // ms

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % contents.length);
    setProgress(0);
  }, [contents.length]);

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + contents.length) % contents.length);
    setProgress(0);
  };

  // Auto advance progress bar
  useEffect(() => {
    if (contents.length <= 1) return;

    const interval = setInterval(() => {
      setProgress((prev) => prev + (100 / (duration / 100)));
    }, 100);

    return () => clearInterval(interval);
  }, [currentIndex, duration, contents.length]);

  // Handle slide transition when progress reaches/exceeds 100%
  useEffect(() => {
    if (progress >= 100) {
      goNext();
    }
  }, [progress, goNext]);

  if (!current) return null;

  return (
    <div className="space-y-4">
      {/* Slide */}
      <div className="relative bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">

        {/* Image */}
        <div className="relative">
          <img
            key={current._id}
            src={current.fileUrl}
            alt={current.title}
            className="w-full max-h-[500px] object-contain bg-gray-50"
          />

          {/* Navigation Arrows — only if multiple */}
          {contents.length > 1 && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full p-2 hover:bg-white transition-colors shadow-sm"
              >
                <ChevronLeft size={18} className="text-gray-700" />
              </button>
              <button
                onClick={goNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full p-2 hover:bg-white transition-colors shadow-sm"
              >
                <ChevronRight size={18} className="text-gray-700" />
              </button>
            </>
          )}
        </div>

        {/* Progress Bar */}
        {contents.length > 1 && (
          <div className="h-1 bg-gray-100">
            <div
              className="h-full bg-gray-900 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Content Info */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{current.title}</h2>
              {current.description && (
                <p className="text-sm text-gray-400 mt-1">{current.description}</p>
              )}
            </div>
            <span className="shrink-0 bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
              {current.subject}
            </span>
          </div>

          {/* Teacher + Slide Counter */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              By <span className="text-gray-600 font-medium">{current.uploadedBy?.name}</span>
            </p>
            {contents.length > 1 && (
              <p className="text-xs text-gray-400">
                {currentIndex + 1} / {contents.length}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Dot Indicators */}
      {contents.length > 1 && (
        <div className="flex justify-center gap-1.5">
          {contents.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrentIndex(i); setProgress(0); }}
              className={`rounded-full transition-all duration-200
                ${i === currentIndex
                  ? 'w-5 h-2 bg-gray-900'
                  : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}