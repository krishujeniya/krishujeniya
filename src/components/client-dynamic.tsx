'use client';

import dynamic from 'next/dynamic';

export const DynamicCustomCursor = dynamic(() => import('./shared/custom-cursor').then(mod => mod.CustomCursor), { ssr: false });
export const DynamicChatBot = dynamic(() => import('./shared/chatbot').then(mod => mod.ChatBot), { ssr: false });
