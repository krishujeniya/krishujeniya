
'use client';

import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';

// Configuration for the graph - Reduced complexity
const NUM_POINTS = 200; // Reduced from 300
const SPHERE_RADIUS = 1.5;
const CONNECTION_DISTANCE_THRESHOLD = 0.5; // Reduced from 0.6
const POINT_SIZE = 0.02; // Reduced from 0.03
const LINE_OPACITY = 0.2; // Reduced from 0.3

export const ThreeBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouse = useRef(new THREE.Vector2(0, 0)); // Use ref for mouse coordinates
  const targetRotation = useRef({ x: 0, y: 0 }); // Use ref for target rotation
  const scrollY = useRef(0); // Initialize scrollY ref to 0

  // Memoize points and lines generation to avoid recalculation on every render
  const { pointsGeometry, linesGeometry } = useMemo(() => {
    const points = [];
    for (let i = 0; i < NUM_POINTS; i++) {
      // Distribute points somewhat evenly within a sphere volume
       const phi = Math.acos(-1 + (2 * i) / NUM_POINTS);
       const theta = Math.sqrt(NUM_POINTS * Math.PI) * phi;

       let x = SPHERE_RADIUS * Math.sin(phi) * Math.cos(theta);
       let y = SPHERE_RADIUS * Math.sin(phi) * Math.sin(theta);
       let z = SPHERE_RADIUS * Math.cos(phi);

        // Add slight random perturbation for less grid-like appearance
        x += (Math.random() - 0.5) * 0.1 * SPHERE_RADIUS;
        y += (Math.random() - 0.5) * 0.1 * SPHERE_RADIUS;
        z += (Math.random() - 0.5) * 0.1 * SPHERE_RADIUS;


      points.push(new THREE.Vector3(x, y, z));
    }

    const positions = new Float32Array(NUM_POINTS * 3);
    for (let i = 0; i < NUM_POINTS; i++) {
      positions[i * 3] = points[i].x;
      positions[i * 3 + 1] = points[i].y;
      positions[i * 3 + 2] = points[i].z;
    }

    const pointsGeom = new THREE.BufferGeometry();
    pointsGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const lineSegments = [];
    for (let i = 0; i < NUM_POINTS; i++) {
      for (let j = i + 1; j < NUM_POINTS; j++) {
        const dist = points[i].distanceTo(points[j]);
        if (dist < CONNECTION_DISTANCE_THRESHOLD) {
          lineSegments.push(points[i].x, points[i].y, points[i].z);
          lineSegments.push(points[j].x, points[j].y, points[j].z);
        }
      }
    }

    const linesGeom = new THREE.BufferGeometry();
    linesGeom.setAttribute('position', new THREE.Float32BufferAttribute(lineSegments, 3));

    return { pointsGeometry: pointsGeom, linesGeometry: linesGeom };
  }, []);


  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current; // Capture mountRef.current

    // Initialize scrollY inside useEffect
    scrollY.current = window.scrollY;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // alpha: true for transparent background
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Set clear color to black with 0 alpha
    currentMount.appendChild(renderer.domElement);

    // Lighting (Adjusted slightly for points/lines)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // Reduced ambient light
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x7DF9FF, 0.8, 150); // Reduced point light intensity
    pointLight.position.set(0, 3, 4); // Adjusted position
    scene.add(pointLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3); // Reduced directional light
    directionalLight.position.set(-5, 5, 5);
    scene.add(directionalLight);
    const backLight = new THREE.PointLight(0x7DF9FF, 0.5, 100); // Reduced backlight intensity
    backLight.position.set(0, -3, -4); // Adjusted position
    scene.add(backLight);

    // Create Points Object
    const pointsMaterial = new THREE.PointsMaterial({
        color: 0x7DF9FF, // Electric Blue
        size: POINT_SIZE,
        sizeAttenuation: true, // Points scale with distance
        transparent: true,
        opacity: 0.7, // Slightly reduced opacity
        blending: THREE.NormalBlending, // Changed from AdditiveBlending
    });
    const pointCloud = new THREE.Points(pointsGeometry, pointsMaterial);

    // Create Lines Object
    const linesMaterial = new THREE.LineBasicMaterial({
        color: 0x7DF9FF, // Electric Blue
        transparent: true,
        opacity: LINE_OPACITY,
        blending: THREE.NormalBlending, // Changed from AdditiveBlending
        depthWrite: false, // Prevents lines from obscuring points behind them too much
    });
    const lineSegmentsMesh = new THREE.LineSegments(linesGeometry, linesMaterial);

    // Group points and lines for easier rotation
    const group = new THREE.Group();
    group.add(pointCloud);
    group.add(lineSegmentsMesh);
    scene.add(group);

    camera.position.z = 3.5; // Increased camera distance slightly

    // Mouse move listener
    const onMouseMove = (event: MouseEvent) => {
      // Normalize mouse coordinates (-1 to +1)
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Update target rotation based on mouse position, slightly reduced sensitivity
      targetRotation.current.x = mouse.current.y * 0.3;
      targetRotation.current.y = mouse.current.x * 0.3;
    };

    // Scroll listener
    const onScroll = () => {
        scrollY.current = window.scrollY;
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('scroll', onScroll);


    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Basic rotation remains subtle
      group.rotation.x += 0.0004; // Slightly slower base rotation
      group.rotation.y += 0.0006;

      // Smooth rotation towards target based on mouse position (slower interpolation)
      group.rotation.x += (targetRotation.current.x - group.rotation.x) * 0.03;
      group.rotation.y += (targetRotation.current.y - group.rotation.y) * 0.03;

      // Rotation based on scroll position + subtle oscillation
      group.rotation.z = scrollY.current * 0.0006 + Math.sin(elapsedTime * 0.4) * 0.04;

      // Subtle pulsing effect using scale (Applied to the group) - Removed for less distraction
      // const scalePulse = 1.0 + Math.sin(elapsedTime * 0.6) * 0.015;
      // group.scale.set(scalePulse, scalePulse, scalePulse);

      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);

      // Safely remove the canvas
       if (currentMount && renderer.domElement.parentNode === currentMount) {
         currentMount.removeChild(renderer.domElement);
       }

      // Dispose Three.js objects
      renderer.dispose();
      pointsGeometry.dispose();
      linesGeometry.dispose();
      pointsMaterial.dispose();
      linesMaterial.dispose();
      // Dispose lights if necessary (usually managed by scene disposal)
      scene.remove(ambientLight);
      scene.remove(pointLight);
      scene.remove(directionalLight);
      scene.remove(backLight);
      scene.remove(group); // Remove the group
    };
  }, [pointsGeometry, linesGeometry]); // Add geometries to dependencies

  // The div will contain the canvas, positioned behind other content via CSS
  // Using `fixed` positioning and `z-index: -1` via CSS in globals.css
  return <div ref={mountRef} />;
};

