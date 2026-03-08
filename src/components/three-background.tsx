
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const STAR_COUNT = 2000;
const STAR_SPREAD = 600;
const STAR_DEPTH = 1200;

export const ThreeBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);

  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;
    scrollRef.current = window.scrollY;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      2000
    );
    camera.position.z = 400;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    currentMount.appendChild(renderer.domElement);

    // Create starfield geometry
    const starsGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(STAR_COUNT * 3);
    const sizes = new Float32Array(STAR_COUNT);
    const opacities = new Float32Array(STAR_COUNT);

    for (let i = 0; i < STAR_COUNT; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * STAR_SPREAD * 2;
      positions[i3 + 1] = (Math.random() - 0.5) * STAR_SPREAD * 2;
      positions[i3 + 2] = (Math.random() - 0.5) * STAR_DEPTH * 2;
      sizes[i] = Math.random() * 2.5 + 0.5;
      opacities[i] = Math.random() * 0.6 + 0.4;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starsGeometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    starsGeometry.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1));

    // Custom shader material for performant, beautiful stars
    const starsMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: `
        attribute float aSize;
        attribute float aOpacity;
        varying float vOpacity;
        varying float vSize;
        uniform float uTime;
        uniform float uPixelRatio;

        void main() {
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectedPosition = projectionMatrix * viewPosition;
          gl_Position = projectedPosition;

          // Twinkle effect
          float twinkle = sin(uTime * 2.0 + position.x * 0.01 + position.y * 0.013) * 0.3 + 0.7;
          vOpacity = aOpacity * twinkle;
          vSize = aSize;

          // Size attenuation
          gl_PointSize = aSize * uPixelRatio * (200.0 / -viewPosition.z);
          gl_PointSize = max(gl_PointSize, 0.5);
        }
      `,
      fragmentShader: `
        varying float vOpacity;
        varying float vSize;

        void main() {
          // Circular point with soft glow
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;

          float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
          alpha *= vOpacity;

          // Slight warm white color variation
          vec3 color = vec3(0.95, 0.95, 1.0);
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Second layer - distant dim stars for depth
    const farStarsGeo = new THREE.BufferGeometry();
    const farPositions = new Float32Array(800 * 3);
    const farSizes = new Float32Array(800);
    const farOpacities = new Float32Array(800);

    for (let i = 0; i < 800; i++) {
      const i3 = i * 3;
      farPositions[i3] = (Math.random() - 0.5) * STAR_SPREAD * 3;
      farPositions[i3 + 1] = (Math.random() - 0.5) * STAR_SPREAD * 3;
      farPositions[i3 + 2] = (Math.random() - 0.5) * STAR_DEPTH * 3;
      farSizes[i] = Math.random() * 1.2 + 0.3;
      farOpacities[i] = Math.random() * 0.3 + 0.1;
    }

    farStarsGeo.setAttribute('position', new THREE.BufferAttribute(farPositions, 3));
    farStarsGeo.setAttribute('aSize', new THREE.BufferAttribute(farSizes, 1));
    farStarsGeo.setAttribute('aOpacity', new THREE.BufferAttribute(farOpacities, 1));

    const farStars = new THREE.Points(farStarsGeo, starsMaterial);
    scene.add(farStars);

    // Mouse parallax
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const onScroll = () => {
      scrollRef.current = window.scrollY;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      starsMaterial.uniforms.uTime.value = elapsed;

      // Smooth mouse-based camera movement
      camera.position.x += (mouseRef.current.x * 30 - camera.position.x) * 0.02;
      camera.position.y += (-mouseRef.current.y * 30 - camera.position.y) * 0.02;

      // Scroll parallax
      const scrollOffset = scrollRef.current * 0.15;
      stars.position.y = scrollOffset * 0.3;
      farStars.position.y = scrollOffset * 0.1;

      // Slow continuous rotation for depth feel
      stars.rotation.y = elapsed * 0.02;
      stars.rotation.x = elapsed * 0.01;
      farStars.rotation.y = elapsed * 0.008;
      farStars.rotation.x = elapsed * 0.005;

      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      starsMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      if (currentMount && renderer.domElement.parentNode === currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      starsGeometry.dispose();
      farStarsGeo.dispose();
      starsMaterial.dispose();
    };
  }, []);

  return <div ref={mountRef} aria-hidden="true" />;
};
