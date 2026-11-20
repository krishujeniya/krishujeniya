'use client';

import React, { useEffect, useState } from 'react';

export default function NotFound() {
  const [countdown, setCountdown] = useState(2);

  useEffect(() => {
    const isGitHub = typeof window !== 'undefined' && window.location.pathname.startsWith('/krishujeniya');
    const target = isGitHub ? '/krishujeniya/' : '/';

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.replace(target);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleReturn = () => {
    const isGitHub = typeof window !== 'undefined' && window.location.pathname.startsWith('/krishujeniya');
    const target = isGitHub ? '/krishujeniya/' : '/';
    window.location.replace(target);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#ECECEC] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-[#0D0D0D] border border-[#222222] rounded-2xl p-8 sm:p-10 shadow-2xl text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#181818] border border-[#2E2E2E] mb-6">
          <span className="text-2xl font-black text-white">404</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-3">
          Page Not Found
        </h1>
        <p className="text-sm text-[#999999] leading-relaxed mb-6">
          The requested page could not be located. Redirecting you to the portfolio home in{' '}
          <span className="font-semibold text-white">{countdown}s</span>...
        </p>
        <button
          onClick={handleReturn}
          className="w-full inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-[#E5E5E5] transition-all shadow-md active:scale-95 cursor-pointer"
        >
          Return to Portfolio Now
        </button>
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html:
            "setTimeout(function(){var p=window.location.pathname;var t=p.startsWith('/krishujeniya')?'/krishujeniya/':'/';window.location.replace(t);},2000);",
        }}
      />
    </div>
  );
}
