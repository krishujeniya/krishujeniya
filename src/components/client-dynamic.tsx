'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const LoadingSkeleton = () => (
  <div className="h-96 animate-pulse bg-white/5 rounded-3xl m-8" />
);

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

export const DynamicExperienceSection = dynamic(
  () => import('@/components/sections/experience-section').then(mod => mod.ExperienceSection),
  { 
    ssr: false,
    loading: () => <LoadingSkeleton />
  }
);

export const DynamicDocumentsSection = dynamic(
  () => import('@/components/sections/documents-section').then(mod => mod.DocumentsSection),
  { 
    ssr: false,
    loading: () => <LoadingSkeleton />
  }
);

export const DynamicContactSection = dynamic(
  () => import('@/components/sections/contact-section').then(mod => mod.ContactSection),
  { 
    ssr: false,
    loading: () => <LoadingSkeleton />
  }
);
