'use client';

import dynamic from 'next/dynamic';

export const DynamicCustomCursor = dynamic(() => import('./custom-cursor').then(mod => mod.CustomCursor), { ssr: false });
export const DynamicChatBot = dynamic(() => import('./chat-bot').then(mod => mod.ChatBot), { ssr: false });
