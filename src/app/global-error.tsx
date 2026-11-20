'use client';

import React from 'react';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const handleReturnHome = () => {
    const isGitHub = typeof window !== 'undefined' && window.location.pathname.startsWith('/krishujeniya');
    const target = isGitHub ? '/krishujeniya/' : '/';
    window.location.replace(target);
  };

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#050505] text-[#ECECEC] flex items-center justify-center p-6 font-sans m-0">
        <div className="max-w-md w-full bg-[#0D0D0D] border border-[#222222] rounded-2xl p-8 sm:p-10 shadow-2xl text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#181818] border border-[#2E2E2E] mb-6">
            <span className="text-2xl font-black text-white">500</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-3">
            System Recovery
          </h1>
          <p className="text-sm text-[#999999] leading-relaxed mb-6">
            The application experienced an unhandled root exception. Click below to recover your session.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => reset()}
              className="flex-1 px-5 py-3 rounded-xl bg-[#1C1C1C] text-white border border-[#333333] font-medium text-sm hover:bg-[#2A2A2A] transition-all active:scale-95 cursor-pointer"
            >
              Reset Session
            </button>
            <button
              onClick={handleReturnHome}
              className="flex-1 px-5 py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-[#E5E5E5] transition-all active:scale-95 cursor-pointer"
            >
              Return Home
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
