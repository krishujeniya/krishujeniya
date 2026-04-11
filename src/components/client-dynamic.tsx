'use client';

import dynamic from 'next/dynamic';

export const DynamicThreeBackground = dynamic(
  () => import('@/components/three-background').then(mod => ({ default: mod.ThreeBackground })),
  { ssr: false }
);

export const DynamicCustomCursor = dynamic(
  () => import('@/components/custom-cursor').then(mod => ({ default: mod.CustomCursor })),
  { ssr: false }
);

export const DynamicChatBot = dynamic(
  () => import('@/components/chat-bot').then(mod => ({ default: mod.ChatBot })),
  { ssr: false }
);
