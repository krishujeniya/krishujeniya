import { AntigravityConfig, defaultAntigravityConfig } from './motion-config';

interface Particle {
  x: number;
  y: number;
  ox: number; // origin x
  oy: number; // origin y
  vx: number;
  vy: number;
  radius: number;
  color: string;
  baseAlpha: number;
  currentAlpha: number;
  depthLayer: number; // 0, 1, 2
  layerSpeed: number;
  noisePhase: number;
  jitterAngle: number;
}

export class AntigravityEngine {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private config: AntigravityConfig;
  private particles: Particle[] = [];
  private isRunning = false;
  private isPaused = false;
  private animationFrameId: number | null = null;
  private lastTime = 0;
  private width = 0;
  private height = 0;
  private dpr = 1;

  // Pointer tracking with velocity & smoothing
  private pointer = {
    x: -9999,
    y: -9999,
    targetX: -9999,
    targetY: -9999,
    prevX: -9999,
    prevY: -9999,
    vx: 0,
    vy: 0,
    speed: 0,
    active: false,
  };

  private visibilityHandler: (() => void) | null = null;

  constructor(customConfig?: Partial<AntigravityConfig>) {
    this.config = { ...defaultAntigravityConfig, ...customConfig };
  }

  public initialize(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true });
    this.dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    this.resize();

    // Auto pause when browser tab is inactive to preserve battery and CPU
    this.visibilityHandler = () => {
      if (typeof document !== 'undefined') {
        if (document.hidden) {
          this.pause();
        } else {
          this.resume();
        }
      }
    };
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.visibilityHandler);
    }
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.isPaused = false;
    this.lastTime = performance.now();
    this.tick(this.lastTime);
  }

  public pause(): void {
    this.isPaused = true;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  public resume(): void {
    if (!this.isRunning || !this.isPaused) return;
    this.isPaused = false;
    this.lastTime = performance.now();
    this.tick(this.lastTime);
  }

  public resize(customWidth?: number, customHeight?: number): void {
    if (!this.canvas) return;

    const rect = this.canvas.parentElement?.getBoundingClientRect();
    const w = customWidth || (rect ? rect.width : window.innerWidth);
    const h = customHeight || (rect ? rect.height : window.innerHeight);

    if (w <= 0 || h <= 0) return;

    this.width = w;
    this.height = h;
    this.dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;

    this.canvas.width = Math.floor(w * this.dpr);
    this.canvas.height = Math.floor(h * this.dpr);
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;

    if (this.ctx) {
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.scale(this.dpr, this.dpr);
    }

    this.spawnParticles();
  }

  public updatePointer(clientX: number, clientY: number, active: boolean): void {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const canvasX = clientX - rect.left;
    const canvasY = clientY - rect.top;

    this.pointer.targetX = canvasX;
    this.pointer.targetY = canvasY;
    this.pointer.active = active;

    if (!active) {
      this.pointer.targetX = -9999;
      this.pointer.targetY = -9999;
    }
  }

  public setConfiguration(newConfig: Partial<AntigravityConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.spawnParticles();
  }

  public renderStaticFrame(): void {
    if (!this.ctx || this.particles.length === 0) {
      this.spawnParticles();
    }
    this.draw();
  }

  public destroy(): void {
    this.pause();
    this.isRunning = false;
    this.particles = [];
    if (this.visibilityHandler && typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.visibilityHandler);
      this.visibilityHandler = null;
    }
    this.canvas = null;
    this.ctx = null;
  }

  private spawnParticles(): void {
    if (this.width <= 0 || this.height <= 0) return;

    const isMobile = this.width < 768;
    const targetCount = isMobile
      ? this.config.particleCountMobile
      : this.config.particleCountDesktop;

    const particles: Particle[] = [];
    const colors = this.config.particleColors;
    const numColors = colors.length;

    // Golden ratio spiral distribution blended with loose grid for natural weightless density
    for (let i = 0; i < targetCount; i++) {
      const depthLayer = i % this.config.depthLayers;
      let radius: number;
      let layerSpeed: number;
      let baseAlpha: number;

      if (depthLayer === 0) {
        // Distant background
        radius = 0.75 + Math.random() * 0.4;
        layerSpeed = 0.55;
        baseAlpha = 0.22 + Math.random() * 0.15;
      } else if (depthLayer === 1) {
        // Midground
        radius = 1.2 + Math.random() * 0.6;
        layerSpeed = 1.0;
        baseAlpha = 0.4 + Math.random() * 0.2;
      } else {
        // Foreground
        radius = 1.9 + Math.random() * 0.7;
        layerSpeed = 1.35;
        baseAlpha = 0.65 + Math.random() * 0.25;
      }

      // Natural semi-random distribution across canvas with soft margin
      const margin = 40;
      const ox = margin + Math.random() * (this.width - margin * 2);
      const oy = margin + Math.random() * (this.height - margin * 2);

      particles.push({
        x: ox,
        y: oy,
        ox,
        oy,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius,
        color: colors[i % numColors],
        baseAlpha,
        currentAlpha: baseAlpha,
        depthLayer,
        layerSpeed,
        noisePhase: Math.random() * Math.PI * 2,
        jitterAngle: Math.random() * Math.PI * 2,
      });
    }

    this.particles = particles;
  }

  private tick = (currentTime: number): void => {
    if (!this.isRunning || this.isPaused) return;

    // Delta time calculation clamped to avoid physics explosions during frame drops
    const rawDt = (currentTime - this.lastTime) / 1000;
    const dt = Math.min(Math.max(rawDt, 0.001), 0.045);
    this.lastTime = currentTime;

    this.updatePhysics(dt, currentTime * 0.001);
    this.draw();

    this.animationFrameId = requestAnimationFrame(this.tick);
  };

  private updatePhysics(dt: number, timeSec: number): void {
    // 1. Pointer smoothing and velocity calculation
    if (this.pointer.active && this.pointer.targetX > -1000) {
      const pSmooth = this.config.pointerSmoothing;
      const dx = this.pointer.targetX - this.pointer.x;
      const dy = this.pointer.targetY - this.pointer.y;

      // Filtered velocity calculation
      this.pointer.vx = (dx * pSmooth) / Math.max(dt, 0.016);
      this.pointer.vy = (dy * pSmooth) / Math.max(dt, 0.016);
      this.pointer.speed = Math.sqrt(this.pointer.vx * this.pointer.vx + this.pointer.vy * this.pointer.vy);

      this.pointer.x += dx * pSmooth;
      this.pointer.y += dy * pSmooth;
    } else {
      this.pointer.vx *= 0.85;
      this.pointer.vy *= 0.85;
      this.pointer.speed *= 0.85;
    }

    const {
      cursorInfluenceRadius,
      springStiffness,
      springDamping,
      repulsionStrength,
      velocityTransferStrength,
      orbitalStrength,
      ambientDriftSpeed,
      breathingPeriod,
      breathingAmplitude,
      maxParticleVelocity,
    } = this.config;

    const influenceRadiusSq = cursorInfluenceRadius * cursorInfluenceRadius;
    const timeBasedDamping = Math.pow(springDamping, dt * 60);

    // Global breathing scale factor
    const breathingCycle = Math.sin((timeSec * 2 * Math.PI) / breathingPeriod);
    const breathingOffset = breathingCycle * (breathingAmplitude * 0.05);

    const cx = this.width * 0.5;
    const cy = this.height * 0.5;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // A. Organic drift and low-frequency harmonic oscillation (Perlin-like continuous wave)
      const driftAngle = p.noisePhase + timeSec * 0.4 * p.layerSpeed;
      const driftX = Math.cos(driftAngle * 1.2 + p.oy * 0.003) * ambientDriftSpeed * p.layerSpeed;
      const driftY = Math.sin(driftAngle * 0.8 + p.ox * 0.003) * ambientDriftSpeed * p.layerSpeed;

      // Jellyfish-style breathing expansion from center
      const centerVecX = cx > 0 ? (p.ox - cx) / cx : 0;
      const centerVecY = cy > 0 ? (p.oy - cy) / cy : 0;
      const breathForceX = centerVecX * breathingOffset;
      const breathForceY = centerVecY * breathingOffset;

      // B. Spring restoration force toward anchor position
      const currentOriginX = p.ox + breathForceX;
      const currentOriginY = p.oy + breathForceY;
      const springX = (currentOriginX - p.x) * springStiffness;
      const springY = (currentOriginY - p.y) * springStiffness;

      let forceX = springX + driftX;
      let forceY = springY + driftY;

      // C. Cursor physics interaction
      if (this.pointer.active && this.pointer.x > -1000) {
        const dx = p.x - this.pointer.x;
        const dy = p.y - this.pointer.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < influenceRadiusSq && distSq > 0.01) {
          const dist = Math.sqrt(distSq);
          const normX = dx / dist;
          const normY = dy / dist;

          // Smooth distance-weighted falloff: smoothstep (1 - d/r)^2
          const proximity = 1 - dist / cursorInfluenceRadius;
          const smoothFalloff = proximity * proximity * (3 - 2 * proximity);

          // 1. Distance-weighted radial repulsion force
          const repulse = repulsionStrength * smoothFalloff * p.layerSpeed;
          forceX += normX * repulse;
          forceY += normY * repulse;

          // 2. Cursor velocity and momentum transfer
          const velocityTransfer = velocityTransferStrength * smoothFalloff * p.layerSpeed;
          forceX += this.pointer.vx * velocityTransfer;
          forceY += this.pointer.vy * velocityTransfer;

          // 3. Tangential flow (vortex fluid bending around the cursor)
          const tangentialSpeed = (this.pointer.speed * 0.03 + 2.0) * orbitalStrength * smoothFalloff * p.layerSpeed;
          forceX += -normY * tangentialSpeed;
          forceY += normX * tangentialSpeed;

          // Dynamic alpha brightening when near cursor
          p.currentAlpha = Math.min(1.0, p.baseAlpha + smoothFalloff * 0.35);
        } else {
          p.currentAlpha += (p.baseAlpha - p.currentAlpha) * 0.06;
        }
      } else {
        p.currentAlpha += (p.baseAlpha - p.currentAlpha) * 0.06;
      }

      // D. Velocity integration
      p.vx += forceX * dt;
      p.vy += forceY * dt;

      // E. Frame-rate-independent damping
      p.vx *= timeBasedDamping;
      p.vy *= timeBasedDamping;

      // F. Velocity clamping to avoid numerical instability
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > maxParticleVelocity) {
        const scale = maxParticleVelocity / speed;
        p.vx *= scale;
        p.vy *= scale;
      }

      // G. Position integration
      p.x += p.vx * dt * 60;
      p.y += p.vy * dt * 60;

      // H. Soft boundary wrapping with margin
      const margin = 20;
      if (p.x < -margin) p.x = this.width + margin;
      else if (p.x > this.width + margin) p.x = -margin;
      if (p.y < -margin) p.y = this.height + margin;
      else if (p.y > this.height + margin) p.y = -margin;
    }
  }

  private draw(): void {
    if (!this.ctx) return;

    // Clean canvas clear
    this.ctx.clearRect(0, 0, this.width, this.height);

    const particles = this.particles;
    const len = particles.length;

    // Draw all particles with soft depth-differentiated discs
    for (let i = 0; i < len; i++) {
      const p = particles[i];
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.currentAlpha;
      this.ctx.fill();
    }

    this.ctx.globalAlpha = 1.0;
  }
}
