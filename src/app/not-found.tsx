'use client';

import { useEffect } from 'react';

export default function NotFound() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isGitHub = window.location.pathname.startsWith('/krishujeniya');
      const target = isGitHub ? '/krishujeniya/' : '/';
      window.location.replace(target);
    }
  }, []);

  return (
    <script
      dangerouslySetInnerHTML={{
        __html:
          "var p=window.location.pathname;var t=p.startsWith('/krishujeniya')?'/krishujeniya/':'/';window.location.replace(t);",
      }}
    />
  );
}
