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

  return null;
}
