import { AntigravityConfig, defaultAntigravityConfig } from './motion-config';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseAngle: number;
  baseRadius: number;
  eccentricity: number;
  orbitalSpeed: number;
  radius: number;
  dashLength: number;
  color: string;
  baseAlpha: number;
  currentAlpha: number;
  depthLayer: number;
  layerSpeed: number;
  noisePhase: number;
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

  // Dynamic focal center for the particle halo
  private focalPoint = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  };

  private hasUserInteracted = false;
  private canvasRect: { left: number; top: number; width: number; height: number } | null = null;

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
    this.refreshBounds();

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

    if (this.focalPoint.x === 0 || this.focalPoint.y === 0) {
      this.focalPoint.x = w * 0.5;
      this.focalPoint.y = h * 0.5;
      this.focalPoint.targetX = this.focalPoint.x;
      this.focalPoint.targetY = this.focalPoint.y;
    }

    this.refreshBounds();
    this.spawnParticles();
  }

  public refreshBounds(): void {
    if (!this.canvas) return;
    const r = this.canvas.getBoundingClientRect();
    this.canvasRect = { left: r.left, top: r.top, width: r.width, height: r.height };
  }

  public updatePointer(clientX: number, clientY: number, active: boolean): void {
    if (!this.canvas) return;

    if (!active) {
      this.pointer.active = false;
      this.pointer.targetX = -9999;
      this.pointer.targetY = -9999;
      this.pointer.vx = 0;
      this.pointer.vy = 0;
      this.pointer.speed = 0;
      this.focalPoint.targetX = this.width * 0.5;
      this.focalPoint.targetY = this.height * 0.5;
      return;
    }

    if (!this.canvasRect) {
      this.refreshBounds();
    }
    const rect = this.canvasRect || this.canvas.getBoundingClientRect();
    const canvasX = clientX - rect.left;
    const canvasY = clientY - rect.top;

    const wasInactive = !this.pointer.active || this.pointer.x < -1000;
    this.pointer.active = true;
    this.pointer.targetX = canvasX;
    this.pointer.targetY = canvasY;

    if (wasInactive) {
      this.pointer.x = canvasX;
      this.pointer.y = canvasY;
      this.pointer.prevX = canvasX;
      this.pointer.prevY = canvasY;
      this.pointer.vx = 0;
      this.pointer.vy = 0;
      this.pointer.speed = 0;

      if (!this.hasUserInteracted) {
        this.focalPoint.x = canvasX;
        this.focalPoint.y = canvasY;
        this.hasUserInteracted = true;
      }
    }

    this.focalPoint.targetX = canvasX;
    this.focalPoint.targetY = canvasY;
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

    if (this.focalPoint.x === 0 || this.focalPoint.y === 0) {
      this.focalPoint.x = this.width * 0.5;
      this.focalPoint.y = this.height * 0.5;
      this.focalPoint.targetX = this.focalPoint.x;
      this.focalPoint.targetY = this.focalPoint.y;
    }

    const minR = isMobile ? this.config.haloMinRadius * 0.7 : this.config.haloMinRadius;
    const maxR = isMobile ? this.config.haloMaxRadius * 0.65 : this.config.haloMaxRadius;
    const ecc = this.config.haloEccentricity;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < targetCount; i++) {
      const depthLayer = i % this.config.depthLayers;
      let radius: number;
      let layerSpeed: number;
      let baseAlpha: number;
      let dashLength: number;

      if (depthLayer === 0) {
        radius = 0.8 + Math.random() * 0.4;
        dashLength = 2.5 + Math.random() * 3.5;
        layerSpeed = 0.6;
        baseAlpha = 0.35 + Math.random() * 0.2;
      } else if (depthLayer === 1) {
        radius = 1.3 + Math.random() * 0.5;
        dashLength = 4.0 + Math.random() * 5.0;
        layerSpeed = 1.0;
        baseAlpha = 0.55 + Math.random() * 0.25;
      } else {
        radius = 1.8 + Math.random() * 0.6;
        dashLength = 6.0 + Math.random() * 6.5;
        layerSpeed = 1.35;
        baseAlpha = 0.75 + Math.random() * 0.25;
      }

      const t = Math.sqrt((i + 0.5) / targetCount);
      const baseRadius = minR + t * (maxR - minR);
      const baseAngle = i * goldenAngle;
      const orbitalSpeed = ((i % 2 === 0 ? 1 : -1) * (0.012 + Math.random() * 0.022)) / layerSpeed;

      const initX = this.focalPoint.x + Math.cos(baseAngle) * baseRadius * ecc;
      const initY = this.focalPoint.y + Math.sin(baseAngle) * baseRadius;

      particles.push({
        x: initX,
        y: initY,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        baseAngle,
        baseRadius,
        eccentricity: ecc + (Math.random() - 0.5) * 0.15,
        orbitalSpeed,
        radius,
        dashLength,
        color: colors[i % numColors],
        baseAlpha,
        currentAlpha: baseAlpha,
        depthLayer,
        layerSpeed,
        noisePhase: Math.random() * Math.PI * 2,
      });
    }

    this.particles = particles;
  }

  private tick = (currentTime: number): void => {
    if (!this.isRunning || this.isPaused) return;

    const rawDt = (currentTime - this.lastTime) / 1000;
    const dt = Math.min(Math.max(rawDt, 0.001), 0.045);
    this.lastTime = currentTime;

    this.updatePhysics(dt, currentTime * 0.001);
    this.draw();

    this.animationFrameId = requestAnimationFrame(this.tick);
  };

  private updatePhysics(dt: number, timeSec: number): void {
    if (this.pointer.active && this.pointer.targetX > -1000) {
      if (this.pointer.x < -1000) {
        this.pointer.x = this.pointer.targetX;
        this.pointer.y = this.pointer.targetY;
        this.pointer.prevX = this.pointer.targetX;
        this.pointer.prevY = this.pointer.targetY;
        this.pointer.vx = 0;
        this.pointer.vy = 0;
        this.pointer.speed = 0;
      } else {
        const pSmooth = this.config.pointerSmoothing;
        const dx = this.pointer.targetX - this.pointer.x;
        const dy = this.pointer.targetY - this.pointer.y;

        const effectiveDt = Math.max(dt, 0.016);
        this.pointer.vx = (dx * pSmooth) / effectiveDt;
        this.pointer.vy = (dy * pSmooth) / effectiveDt;

        const rawSpeed = Math.sqrt(this.pointer.vx * this.pointer.vx + this.pointer.vy * this.pointer.vy);
        const maxPointerSpeed = 1200;
        if (rawSpeed > maxPointerSpeed) {
          const ratio = maxPointerSpeed / rawSpeed;
          this.pointer.vx *= ratio;
          this.pointer.vy *= ratio;
          this.pointer.speed = maxPointerSpeed;
        } else {
          this.pointer.speed = rawSpeed;
        }

        this.pointer.x += dx * pSmooth;
        this.pointer.y += dy * pSmooth;
      }

      this.focalPoint.targetX = this.pointer.x;
      this.focalPoint.targetY = this.pointer.y;
    } else {
      this.pointer.vx *= 0.85;
      this.pointer.vy *= 0.85;
      this.pointer.speed *= 0.85;

      this.focalPoint.targetX = this.width * 0.5;
      this.focalPoint.targetY = this.height * 0.5;
    }

    const distToTarget = Math.hypot(this.focalPoint.targetX - this.focalPoint.x, this.focalPoint.targetY - this.focalPoint.y);
    const followRate = distToTarget > 250 ? 12.0 : 8.0;
    const focalFollow = Math.min(1.0, followRate * dt);
    this.focalPoint.x += (this.focalPoint.targetX - this.focalPoint.x) * focalFollow;
    this.focalPoint.y += (this.focalPoint.targetY - this.focalPoint.y) * focalFollow;

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

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      const curAngle = p.baseAngle + timeSec * p.orbitalSpeed;
      const breath = Math.sin((timeSec * 2 * Math.PI) / breathingPeriod + p.noisePhase) * (breathingAmplitude * p.layerSpeed);
      const curRadius = Math.max(20, p.baseRadius + breath);

      const ox = this.focalPoint.x + Math.cos(curAngle) * curRadius * p.eccentricity;
      const oy = this.focalPoint.y + Math.sin(curAngle) * curRadius;

      const driftAngle = p.noisePhase + timeSec * 0.5 * p.layerSpeed;
      const driftX = Math.cos(driftAngle) * ambientDriftSpeed * p.layerSpeed;
      const driftY = Math.sin(driftAngle) * ambientDriftSpeed * p.layerSpeed;

      const springX = (ox - p.x) * springStiffness;
      const springY = (oy - p.y) * springStiffness;

      let forceX = springX + driftX;
      let forceY = springY + driftY;

      if (this.pointer.active && this.pointer.x > -1000) {
        const dx = p.x - this.pointer.x;
        const dy = p.y - this.pointer.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < influenceRadiusSq && distSq > 0.01) {
          const dist = Math.sqrt(distSq);
          const normX = dx / dist;
          const normY = dy / dist;

          const proximity = 1 - dist / cursorInfluenceRadius;
          const smoothFalloff = proximity * proximity * (3 - 2 * proximity);

          const repulse = repulsionStrength * smoothFalloff * p.layerSpeed;
          forceX += normX * repulse;
          forceY += normY * repulse;

          const velocityTransfer = velocityTransferStrength * smoothFalloff * p.layerSpeed;
          forceX += this.pointer.vx * velocityTransfer;
          forceY += this.pointer.vy * velocityTransfer;

          const tangentialSpeed = (this.pointer.speed * 0.04 + 2.5) * orbitalStrength * smoothFalloff * p.layerSpeed;
          forceX += -normY * tangentialSpeed;
          forceY += normX * tangentialSpeed;

          p.currentAlpha = Math.min(1.0, p.baseAlpha + smoothFalloff * 0.35);
        } else {
          p.currentAlpha += (p.baseAlpha - p.currentAlpha) * 0.06;
        }
      } else {
        p.currentAlpha += (p.baseAlpha - p.currentAlpha) * 0.06;
      }

      p.vx += forceX * dt;
      p.vy += forceY * dt;

      p.vx *= timeBasedDamping;
      p.vy *= timeBasedDamping;

      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > maxParticleVelocity) {
        const scale = maxParticleVelocity / speed;
        p.vx *= scale;
        p.vy *= scale;
      }

      p.x += p.vx * dt * 60;
      p.y += p.vy * dt * 60;
    }
  }

  private draw(): void {
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    const particles = this.particles;
    const len = particles.length;
    const fx = this.focalPoint.x;
    const fy = this.focalPoint.y;

    for (let i = 0; i < len; i++) {
      const p = particles[i];

      const dx = p.x - fx;
      const dy = p.y - fy;
      const angle = Math.atan2(dy, dx);

      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const halfLen = p.dashLength * 0.5;

      this.ctx.beginPath();
      this.ctx.strokeStyle = p.color;
      this.ctx.lineWidth = p.radius * 2;
      this.ctx.lineCap = 'round';
      this.ctx.globalAlpha = p.currentAlpha;
      this.ctx.moveTo(p.x - cosA * halfLen, p.y - sinA * halfLen);
      this.ctx.lineTo(p.x + cosA * halfLen, p.y + sinA * halfLen);
      this.ctx.stroke();
    }

    this.ctx.globalAlpha = 1.0;
  }
}
