/**
 * Centralized Motion & Antigravity Particle Configuration
 * Inspired by Google Antigravity fluid dynamics and zero-gravity interaction principles.
 */

export interface AntigravityConfig {
  targetFps: number;
  particleCountDesktop: number;
  particleCountMobile: number;
  cursorInfluenceRadius: number;
  pointerSmoothing: number;
  springStiffness: number;
  springDamping: number;
  repulsionStrength: number;
  velocityTransferStrength: number;
  orbitalStrength: number;
  ambientDriftSpeed: number;
  breathingPeriod: number;
  breathingAmplitude: number;
  depthLayers: number;
  particleColors: string[];
  particleBaseOpacity: number;
  maxParticleVelocity: number;
}

export const defaultAntigravityConfig: AntigravityConfig = {
  targetFps: 60,
  particleCountDesktop: 650,
  particleCountMobile: 180,
  cursorInfluenceRadius: 160,
  pointerSmoothing: 0.14,
  springStiffness: 0.035,
  springDamping: 0.88,
  repulsionStrength: 240,
  velocityTransferStrength: 0.22,
  orbitalStrength: 0.08,
  ambientDriftSpeed: 0.45,
  breathingPeriod: 4.8,
  breathingAmplitude: 14,
  depthLayers: 3,
  particleColors: [
    'rgba(255, 255, 255, 0.75)',
    'rgba(229, 229, 229, 0.55)',
    'rgba(161, 161, 161, 0.45)',
    'rgba(115, 115, 115, 0.35)',
    'rgba(82, 82, 82, 0.25)',
  ],
  particleBaseOpacity: 0.5,
  maxParticleVelocity: 16,
};

export const motionTokens = {
  duration: {
    micro: 0.18,
    buttonHover: 0.22,
    cardHover: 0.3,
    textReveal: 0.55,
    sectionReveal: 0.75,
    modalTransition: 0.32,
    pageTransition: 0.45,
  },
  easing: {
    power2Out: 'power2.out',
    power3Out: 'power3.out',
    anticipate: 'back.out(1.4)',
    fluid: 'cubic-bezier(0.16, 1, 0.3, 1)',
    gentleSpring: 'cubic-bezier(0.25, 1, 0.5, 1)',
  },
  stagger: {
    fast: 0.03,
    medium: 0.08,
    cards: 0.12,
  },
};
