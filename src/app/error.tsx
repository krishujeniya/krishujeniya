'use client';

import React, { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled portfolio runtime error:', error);
  }, [error]);

  const handleReturnHome = () => {
    const isGitHub = typeof window !== 'undefined' && window.location.pathname.startsWith('/krishujeniya');
    const target = isGitHub ? '/krishujeniya/' : '/';
    window.location.replace(target);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#ECECEC] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-[#0D0D0D] border border-[#222222] rounded-2xl p-8 sm:p-10 shadow-2xl text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#181818] border border-[#2E2E2E] mb-6">
          <span className="text-2xl font-black text-white">!</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-3">
          Temporary Interface Glitch
        </h1>
        <p className="text-sm text-[#999999] leading-relaxed mb-6">
          An unexpected interface state occurred. You can restore the current view or return to the main portfolio.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => reset()}
            className="flex-1 px-5 py-3 rounded-xl bg-[#1C1C1C] text-white border border-[#333333] font-medium text-sm hover:bg-[#2A2A2A] transition-all active:scale-95 cursor-pointer"
          >
            Try Again
          </button>
          <button
            onClick={handleReturnHome}
            className="flex-1 px-5 py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-[#E5E5E5] transition-all active:scale-95 cursor-pointer"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}
