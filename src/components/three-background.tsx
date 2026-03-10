
'use client';

import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

// Adaptive particle counts based on device capability
const isMobileDevice = () =>
  typeof window !== 'undefined' && (window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent));

const getStarCount = () => (isMobileDevice() ? 1000 : 1800);
const getFarStarCount = () => (isMobileDevice() ? 300 : 600);
const STAR_SPREAD = 600;
const STAR_DEPTH = 1200;
const SHOOTING_STAR_COUNT = 3;

export const ThreeBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);
  const isVisibleRef = useRef(true);
  const animIdRef = useRef<number>(0);

  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;
    scrollRef.current = window.scrollY;

    const STAR_COUNT = getStarCount();
    const FAR_STAR_COUNT = getFarStarCount();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      2000
    );
    camera.position.z = 400;

    // Cap pixel ratio more aggressively on mobile
    const maxPixelRatio = isMobileDevice() ? 1.5 : 2;
    const pixelRatio = Math.min(window.devicePixelRatio, maxPixelRatio);

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    currentMount.appendChild(renderer.domElement);

    // --- Shared star shader material ---
    const starShaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: pixelRatio },
      },
      vertexShader: `
        attribute float aSize;
        attribute float aOpacity;
        varying float vOpacity;
        uniform float uTime;
        uniform float uPixelRatio;

        void main() {
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectedPosition = projectionMatrix * viewPosition;
          gl_Position = projectedPosition;

          float twinkle = sin(uTime * 2.0 + position.x * 0.01 + position.y * 0.013) * 0.3 + 0.7;
          vOpacity = aOpacity * twinkle;

          gl_PointSize = aSize * uPixelRatio * (200.0 / -viewPosition.z);
          gl_PointSize = max(gl_PointSize, 0.5);
        }
      `,
      fragmentShader: `
        varying float vOpacity;

        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;

          float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
          alpha *= vOpacity;

          vec3 color = vec3(0.95, 0.95, 1.0);
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    // --- Primary stars ---
    const starsGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(STAR_COUNT * 3);
    const sizes = new Float32Array(STAR_COUNT);
    const opacities = new Float32Array(STAR_COUNT);

    for (let i = 0; i < STAR_COUNT; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * STAR_SPREAD * 2;
      pos[i3 + 1] = (Math.random() - 0.5) * STAR_SPREAD * 2;
      pos[i3 + 2] = (Math.random() - 0.5) * STAR_DEPTH * 2;
      sizes[i] = Math.random() * 2.5 + 0.5;
      opacities[i] = Math.random() * 0.6 + 0.4;
    }

    starsGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    starsGeo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    starsGeo.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1));

    const stars = new THREE.Points(starsGeo, starShaderMaterial);
    scene.add(stars);

    // --- Far distant stars layer ---
    const farGeo = new THREE.BufferGeometry();
    const farPos = new Float32Array(FAR_STAR_COUNT * 3);
    const farSizes = new Float32Array(FAR_STAR_COUNT);
    const farOpacities = new Float32Array(FAR_STAR_COUNT);

    for (let i = 0; i < FAR_STAR_COUNT; i++) {
      const i3 = i * 3;
      farPos[i3] = (Math.random() - 0.5) * STAR_SPREAD * 3;
      farPos[i3 + 1] = (Math.random() - 0.5) * STAR_SPREAD * 3;
      farPos[i3 + 2] = (Math.random() - 0.5) * STAR_DEPTH * 3;
      farSizes[i] = Math.random() * 1.2 + 0.3;
      farOpacities[i] = Math.random() * 0.3 + 0.1;
    }

    farGeo.setAttribute('position', new THREE.BufferAttribute(farPos, 3));
    farGeo.setAttribute('aSize', new THREE.BufferAttribute(farSizes, 1));
    farGeo.setAttribute('aOpacity', new THREE.BufferAttribute(farOpacities, 1));

    const farStars = new THREE.Points(farGeo, starShaderMaterial);
    scene.add(farStars);

    // --- Shooting stars ---
    interface ShootingStar {
      mesh: THREE.Line;
      velocity: THREE.Vector3;
      life: number;
      maxLife: number;
      active: boolean;
    }

    const shootingStars: ShootingStar[] = [];
    const shootingMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    const resetShootingStar = (ss: ShootingStar) => {
      const startX = (Math.random() - 0.5) * STAR_SPREAD * 1.5;
      const startY = Math.random() * STAR_SPREAD * 0.8 + 100;
      const startZ = (Math.random() - 0.5) * 400;

      const speed = 3 + Math.random() * 4;
      const angle = -Math.PI / 4 + (Math.random() - 0.5) * 0.4;
      ss.velocity.set(Math.cos(angle) * speed, Math.sin(angle) * speed, 0);
      ss.life = 0;
      ss.maxLife = 40 + Math.random() * 40;
      ss.active = true;

      const positions = ss.mesh.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] = startX;
        positions[i + 1] = startY;
        positions[i + 2] = startZ;
      }
      ss.mesh.geometry.attributes.position.needsUpdate = true;
    };

    const shootingStarTimers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < SHOOTING_STAR_COUNT; i++) {
      const tailLength = 10;
      const geom = new THREE.BufferGeometry();
      const positions = new Float32Array(tailLength * 3);
      geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const line = new THREE.Line(geom, shootingMat);
      scene.add(line);

      const ss: ShootingStar = {
        mesh: line,
        velocity: new THREE.Vector3(),
        life: 0,
        maxLife: 60,
        active: false,
      };
      shootingStars.push(ss);

      // Stagger initial spawn
      shootingStarTimers.push(
        setTimeout(() => resetShootingStar(ss), i * 3000 + Math.random() * 5000)
      );
    }

    // --- Mouse & scroll (passive, no state updates) ---
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    // --- Visibility API: pause when tab is hidden ---
    const onVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
      if (isVisibleRef.current) {
        clock.getDelta(); // Reset delta to avoid large time jumps
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    // --- Animation loop with visibility check ---
    const clock = new THREE.Clock();

    const animate = () => {
      animIdRef.current = requestAnimationFrame(animate);

      // Skip rendering entirely when tab is hidden
      if (!isVisibleRef.current) return;

      const elapsed = clock.getElapsedTime();

      starShaderMaterial.uniforms.uTime.value = elapsed;

      // Smooth camera movement
      camera.position.x += (mouseRef.current.x * 30 - camera.position.x) * 0.02;
      camera.position.y += (-mouseRef.current.y * 30 - camera.position.y) * 0.02;

      // Scroll parallax
      const scrollOffset = scrollRef.current * 0.15;
      stars.position.y = scrollOffset * 0.3;
      farStars.position.y = scrollOffset * 0.1;

      // Slow rotation
      stars.rotation.y = elapsed * 0.02;
      stars.rotation.x = elapsed * 0.01;
      farStars.rotation.y = elapsed * 0.008;
      farStars.rotation.x = elapsed * 0.005;

      // Shooting stars update
      for (const ss of shootingStars) {
        if (!ss.active) continue;

        ss.life++;
        const positions = ss.mesh.geometry.attributes.position.array as Float32Array;
        const tailLength = positions.length / 3;

        // Shift tail
        for (let j = (tailLength - 1) * 3; j >= 3; j -= 3) {
          positions[j] = positions[j - 3];
          positions[j + 1] = positions[j - 2];
          positions[j + 2] = positions[j - 1];
        }

        // Move head
        positions[0] += ss.velocity.x;
        positions[1] += ss.velocity.y;
        positions[2] += ss.velocity.z;

        ss.mesh.geometry.attributes.position.needsUpdate = true;

        // Fade
        const progress = ss.life / ss.maxLife;
        (ss.mesh.material as THREE.LineBasicMaterial).opacity = progress < 0.1
          ? progress * 10 * 0.7
          : (1 - progress) * 0.7;

        if (ss.life >= ss.maxLife) {
          ss.active = false;
          (ss.mesh.material as THREE.LineBasicMaterial).opacity = 0;
          // Respawn after random delay
          shootingStarTimers.push(
            setTimeout(() => resetShootingStar(ss), 2000 + Math.random() * 8000)
          );
        }
      }

      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    };
    animate();

    // --- Debounced Resize ---
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        const newPixelRatio = Math.min(window.devicePixelRatio, maxPixelRatio);
        renderer.setPixelRatio(newPixelRatio);
        starShaderMaterial.uniforms.uPixelRatio.value = newPixelRatio;
      }, 150);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      cancelAnimationFrame(animIdRef.current);
      clearTimeout(resizeTimer);
      shootingStarTimers.forEach(clearTimeout);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (currentMount && renderer.domElement.parentNode === currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      starsGeo.dispose();
      farGeo.dispose();
      starShaderMaterial.dispose();
      shootingMat.dispose();
      for (const ss of shootingStars) {
        ss.mesh.geometry.dispose();
      }
    };
  }, []);

  return <div ref={mountRef} aria-hidden="true" style={{ willChange: 'transform' }} />;
};
