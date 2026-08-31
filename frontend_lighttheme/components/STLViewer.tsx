'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface STLViewerProps {
  file: File | null;
  onVolumeCalculated?: (volumeMm3: number) => void;
}

const COLOR_OPTIONS = [
  { label: 'White', value: '#efefef' },
  { label: 'Silver', value: '#9ca3af' },
  { label: 'Black', value: '#222222' },
  { label: 'Purple', value: '#a855f7' },
  { label: 'Gold', value: '#f59e0b' },
  { label: 'Blue', value: '#60a5fa' },
  { label: 'Red', value: '#ef4444' },
  { label: 'Green', value: '#22c55e' },
];

export default function STLViewer({ file, onVolumeCalculated }: STLViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const colorRef = useRef(COLOR_OPTIONS[0].value); // tracks current color without triggering STL reload

  const [error, setError] = useState<string | null>(null);
  const [modelColor, setModelColor] = useState(COLOR_OPTIONS[0].value);
  const [isLoading, setIsLoading] = useState(false);

  // ── Update material color without reloading the STL ──────────────────────
  useEffect(() => {
    colorRef.current = modelColor;
    if (materialRef.current) {
      materialRef.current.color.set(modelColor);
      // Bump emissive slightly for darker colors so model stays visible
      const isDark = modelColor === '#222222';
      materialRef.current.emissive.set(isDark ? '#111111' : '#000000');
      materialRef.current.emissiveIntensity = isDark ? 0.3 : 0;
    }
  }, [modelColor]);

  // ── Three.js scene — only re-runs when file changes ──────────────────────
  useEffect(() => {
    if (!mountRef.current || !file) return;

    setError(null);
    setIsLoading(true);

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x85847F); // warm light background matches site theme

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, -100, 100);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Lighting — neutral daylight setup
    scene.add(new THREE.AmbientLight(0xffffff, 1.5));
    const hemi = new THREE.HemisphereLight(0xffffff, 0xd4d0ca, 1.2);
    hemi.position.set(0, 200, 0);
    scene.add(hemi);
    const dir1 = new THREE.DirectionalLight(0xffffff, 2.0);
    dir1.position.set(100, 200, 100);
    scene.add(dir1);
    const dir2 = new THREE.DirectionalLight(0xe8e4df, 0.5); // warm fill light
    dir2.position.set(-100, -100, -100);
    scene.add(dir2);

    let mesh: THREE.Mesh | null = null;
    let animationFrameId: number;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target?.result) return;
      const loader = new STLLoader();
      try {
        const geometry = loader.parse(e.target.result as ArrayBuffer);

        const material = new THREE.MeshStandardMaterial({
          color: colorRef.current, // use current color (not initial state)
          roughness: 0.65,
          metalness: 0.15,
        });
        materialRef.current = material;

        mesh = new THREE.Mesh(geometry, material);

        geometry.computeBoundingBox();
        const bbox = geometry.boundingBox!;
        const center = new THREE.Vector3();
        bbox.getCenter(center);
        mesh.position.sub(center);

        const size = new THREE.Vector3();
        bbox.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        const cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 1.5;
        camera.position.set(0, -cameraZ, cameraZ);
        camera.lookAt(0, 0, 0);

        scene.add(mesh);
        setIsLoading(false);

        // Volume calculation
        let volume = 0;
        const pos = geometry.getAttribute('position');
        const p1 = new THREE.Vector3(), p2 = new THREE.Vector3(), p3 = new THREE.Vector3();
        for (let i = 0; i < pos.count; i += 3) {
          p1.fromBufferAttribute(pos, i);
          p2.fromBufferAttribute(pos, i + 1);
          p3.fromBufferAttribute(pos, i + 2);
          volume += p1.dot(p2.cross(p3)) / 6.0;
        }
        if (onVolumeCalculated) onVolumeCalculated(Math.abs(volume));

      } catch (err) {
        console.error('STL parse error:', err);
        setError('Failed to parse STL file. Please ensure it is a valid binary or ASCII STL.');
        setIsLoading(false);
      }
    };
    reader.onerror = () => { setError('Failed to read the file.'); setIsLoading(false); };
    reader.readAsArrayBuffer(file);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      mesh?.geometry.dispose();
      (mesh?.material as THREE.Material)?.dispose();
      materialRef.current = null;
      renderer.dispose();
    };
  }, [file, onVolumeCalculated]);

  return (
    <div className="w-full h-full relative border border-stone-200 rounded-xl overflow-hidden bg-stone-50">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-stone-50/90 backdrop-blur-sm">
          <svg className="animate-spin h-7 w-7 text-stone-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-sm text-stone-400">Rendering model…</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center p-4 text-center text-red-500 z-10">
          <p>{error}</p>
        </div>
      )}

      {/* Empty state */}
      {!file && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-stone-300 z-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V11" />
          </svg>
          <p className="text-sm text-stone-400">Upload an STL to preview your model</p>
        </div>
      )}

      {/* Canvas mount */}
      <div ref={mountRef} className="w-full h-full min-h-[380px]" />

      {/* Color picker */}
      {file && !error && !isLoading && (
        <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-white/95 backdrop-blur px-3 py-2 rounded-full shadow-sm border border-stone-200">
          <span className="text-xs text-stone-400 font-medium pr-1.5 border-r border-stone-200">Color</span>
          {COLOR_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              title={opt.label}
              onClick={() => setModelColor(opt.value)}
              className="transition-transform hover:scale-110 relative"
              style={{
                width: 16, height: 16, borderRadius: '50%', background: opt.value,
                outline: modelColor === opt.value ? `2px solid #1c1917` : '2px solid transparent',
                outlineOffset: 2,
              }}
            />
          ))}
          <span className="text-xs text-stone-400 pl-1.5 border-l border-stone-200 min-w-[42px]">
            {COLOR_OPTIONS.find(o => o.value === modelColor)?.label}
          </span>
        </div>
      )}

      {/* Controls hint */}
      {file && !error && (
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur pb-1.5 pt-1 px-3 rounded-full text-xs text-stone-400 shadow-sm border border-stone-200">
          Drag to rotate · Scroll to zoom
        </div>
      )}
    </div>
  );
}
