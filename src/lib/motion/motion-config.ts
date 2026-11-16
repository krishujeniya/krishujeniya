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
  haloMinRadius: number;
  haloMaxRadius: number;
  haloEccentricity: number;
}

export const defaultAntigravityConfig: AntigravityConfig = {
  targetFps: 60,
  particleCountDesktop: 480,
  particleCountMobile: 150,
  cursorInfluenceRadius: 180,
  pointerSmoothing: 0.32,
  springStiffness: 0.045,
  springDamping: 0.88,
  repulsionStrength: 260,
  velocityTransferStrength: 0.28,
  orbitalStrength: 0.09,
  ambientDriftSpeed: 0.35,
  breathingPeriod: 5.2,
  breathingAmplitude: 16,
  depthLayers: 3,
  haloMinRadius: 110,
  haloMaxRadius: 420,
  haloEccentricity: 1.25,
  particleColors: [
    'rgba(255, 255, 255, 0.90)',
    'rgba(245, 245, 245, 0.80)',
    'rgba(224, 224, 224, 0.75)',
    'rgba(190, 190, 190, 0.65)',
    'rgba(161, 161, 161, 0.60)',
    'rgba(115, 115, 115, 0.50)',
    'rgba(255, 255, 255, 0.95)',
    'rgba(212, 212, 216, 0.70)',
    'rgba(160, 160, 170, 0.60)',
  ],
  particleBaseOpacity: 0.65,
  maxParticleVelocity: 18,
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
