'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Globe from 'three-globe';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


export type GlobeAttack = {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  severity: 'low' | 'medium' | 'high' | 'critical' | 'informational' | 'notice';
  source: string;
};

interface AttackGlobeProps {
  data: GlobeAttack[];
}

export default function AttackGlobe({ data }: AttackGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    /* ---------------- Scene ---------------- */
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 280;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );

    containerRef.current.appendChild(renderer.domElement);

    /* ================= Controls (INI KUNCI) ================= */
    const controls = new OrbitControls(
      camera,
      renderer.domElement
    );

    controls.enableDamping = true;
    controls.dampingFactor = 0.06;

    controls.enableRotate = true; // drag
    controls.enableZoom = true;   // zoom
    controls.enablePan = false;

    // batas zoom
    controls.minDistance = 180;
    controls.maxDistance = 420;

    // batas atas-bawah biar tidak kebalik
    controls.minPolarAngle = Math.PI / 6;
    controls.maxPolarAngle = Math.PI - Math.PI / 6;

    controls.rotateSpeed = 0.45;
    controls.zoomSpeed = 0.7;

    /* ---------------- Globe ---------------- */
    const globe = new Globe()
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .showAtmosphere(true)
      .atmosphereColor('#60a5fa')
      .atmosphereAltitude(0.35);

    scene.add(globe);

    /* ---------------- Severity Colors ---------------- */
    const severityColor: Record<string, [string, string]> = {
      low: ['#22c55e', '#16a34a'],
      medium: ['#eab308', '#ca8a04'],
      high: ['#f97316', '#ea580c'],
      critical: ['#ef4444', '#b91c1c'],
      informational: ['#38bdf8', '#0284c7'],
      notice: ['#a855f7', '#7e22ce'],
    };

    /* ---------------- Arcs ---------------- */
    globe
      .arcsData(data)
      .arcStartLat((d: GlobeAttack) => d.startLat)
      .arcStartLng((d: GlobeAttack) => d.startLng)
      .arcEndLat((d: GlobeAttack) => d.endLat)
      .arcEndLng((d: GlobeAttack) => d.endLng)
      .arcColor((d: GlobeAttack) => severityColor[d.severity] ?? ['#94a3b8'])
      .arcAltitude(0.25)
      .arcStroke(0.7)
      .arcDashLength(0.4)
      .arcDashGap(4)
      .arcDashAnimateTime(1200);

    /* ---------------- Points ---------------- */
    globe
      .pointsData(
        data.flatMap(d => ([
          { lat: d.startLat, lng: d.startLng },
          { lat: d.endLat, lng: d.endLng },
        ]))
      )
      .pointColor(() => '#ffffff')
      .pointRadius(0.4)
      .pointAltitude(0.02);

    /* ---------------- Lights ---------------- */
    scene.add(new THREE.AmbientLight(0xffffff, 1.2));

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 3, 5);
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.8);
    rimLight.position.set(-5, 0, -5);
    scene.add(rimLight);

    /* ---------------- Animation ---------------- */
    const globeObj = globe as unknown as THREE.Object3D;

    const animate = () => {
      requestAnimationFrame(animate);

      // auto rotate pelan
      globeObj.rotation.y += 0.0008;

      controls.update(); // WAJIB untuk drag & zoom
      renderer.render(scene, camera);
    };
    animate();

    /* ---------------- Resize ---------------- */
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect =
        containerRef.current.clientWidth /
        containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
    };

    window.addEventListener('resize', handleResize);

    /* ---------------- Cleanup ---------------- */
    return () => {
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [data]);

  return <div ref={containerRef} className="w-full h-full" />;
}
