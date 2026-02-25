// 'use client';

// import { useEffect, useRef } from 'react';
// import * as THREE from 'three';
// import Globe from 'three-globe';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


// export type GlobeAttack = {
//   startLat: number;
//   startLng: number;
//   endLat: number;
//   endLng: number;
//   severity: 'low' | 'medium' | 'high' | 'critical' | 'Information' | 'Notice';
//   source: string;
// };

// interface AttackGlobeProps {
//   data: GlobeAttack[];
// }

// export default function AttackGlobe({ data }: AttackGlobeProps) {
//   const containerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (!containerRef.current) return;

//     /* ---------------- Scene ---------------- */
//     const scene = new THREE.Scene();

//     const camera = new THREE.PerspectiveCamera(
//       60,
//       containerRef.current.clientWidth / containerRef.current.clientHeight,
//       0.1,
//       1000
//     );
//     camera.position.z = 280;

//     const renderer = new THREE.WebGLRenderer({
//       antialias: true,
//       alpha: true,
//     });

//     renderer.setSize(
//       containerRef.current.clientWidth,
//       containerRef.current.clientHeight
//     );

//     containerRef.current.appendChild(renderer.domElement);

//     /* ================= Controls (INI KUNCI) ================= */
//     const controls = new OrbitControls(
//       camera,
//       renderer.domElement
//     );

//     controls.enableDamping = true;
//     controls.dampingFactor = 0.06;

//     controls.enableRotate = true; // drag
//     controls.enableZoom = true;   // zoom
//     controls.enablePan = false;

//     // batas zoom
//     controls.minDistance = 180;
//     controls.maxDistance = 420;

//     // batas atas-bawah biar tidak kebalik
//     controls.minPolarAngle = Math.PI / 6;
//     controls.maxPolarAngle = Math.PI - Math.PI / 6;

//     controls.rotateSpeed = 0.45;
//     controls.zoomSpeed = 0.7;

//     /* ---------------- Globe ---------------- */
//     const globe = new Globe()
//       .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
//       .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
//       .showAtmosphere(true)
//       .atmosphereColor('#1e40af')
//       .atmosphereAltitude(0.35);

//     scene.add(globe);

//     /* ---------------- Severity Colors ---------------- */
//     const severityColor: Record<string, [string, string]> = {
//       low: ['#22c55e', '#16a34a'],
//       medium: ['#eab308', '#ca8a04'],
//       high: ['#f97316', '#ea580c'],
//       critical: ['#ef4444', '#b91c1c'],
//       information: ['#eab308', '#ca8a04'],
//       notice: ['#a855f7', '#7e22ce'],
//     };

//     /* ---------------- Arcs ---------------- */
//     globe
//       .arcsData(data)
//       .arcStartLat((d: GlobeAttack) => d.startLat)
//       .arcStartLng((d: GlobeAttack) => d.startLng)
//       .arcEndLat((d: GlobeAttack) => d.endLat)
//       .arcEndLng((d: GlobeAttack) => d.endLng)
//       .arcColor((d: GlobeAttack) => severityColor[d.severity] ?? ['#94a3b8'])
//       .arcAltitude(0.25)
//       .arcStroke(0.7)
//       .arcDashLength(0.4)
//       .arcDashGap(4)
//       .arcDashAnimateTime(1200);

//     /* ---------------- Points ---------------- */
//     globe
//       .pointsData(
//         data.flatMap(d => ([
//           { lat: d.startLat, lng: d.startLng },
//           { lat: d.endLat, lng: d.endLng },
//         ]))
//       )
//       .pointColor(() => '#ffffff')
//       .pointRadius(0.4)
//       .pointAltitude(0.02);

//     /* ---------------- Lights ---------------- */
//     scene.add(new THREE.AmbientLight(0xffffff, 1.2));

//     const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
//     dirLight.position.set(5, 3, 5);
//     scene.add(dirLight);

//     const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.8);
//     rimLight.position.set(-5, 0, -5);
//     scene.add(rimLight);

//     /* ---------------- Animation ---------------- */
//     const globeObj = globe as unknown as THREE.Object3D;

//     const animate = () => {
//       requestAnimationFrame(animate);

//       // auto rotate pelan
//       globeObj.rotation.y += 0.0008;

//       controls.update(); // WAJIB untuk drag & zoom
//       renderer.render(scene, camera);
//     };
//     animate();

//     /* ---------------- Resize ---------------- */
//     const handleResize = () => {
//       if (!containerRef.current) return;
//       camera.aspect =
//         containerRef.current.clientWidth /
//         containerRef.current.clientHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(
//         containerRef.current.clientWidth,
//         containerRef.current.clientHeight
//       );
//     };

//     window.addEventListener('resize', handleResize);

//     /* ---------------- Cleanup ---------------- */
//     return () => {
//       window.removeEventListener('resize', handleResize);
//       controls.dispose();
//       renderer.dispose();
//       containerRef.current?.removeChild(renderer.domElement);
//     };
//   }, [data]);

//   return <div ref={containerRef} className="w-full h-full" />;
// }
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
  severity: 'low' | 'medium' | 'high' | 'critical' | 'Information' | 'Notice';
  source: string;
};

interface AttackGlobeProps {
  data: GlobeAttack[];
}

export default function AttackGlobe({ data }: AttackGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  /* ---------------- EFFECT 1: INITIAL SETUP (Hanya Sekali) ---------------- */
  useEffect(() => {
    if (!containerRef.current) return;

    /* 1. Scene & Camera */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 280;

    /* 2. Renderer */
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    /* 3. Controls */
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enableRotate = true;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.minDistance = 180;
    controls.maxDistance = 420;
    controls.minPolarAngle = Math.PI / 6;
    controls.maxPolarAngle = Math.PI - Math.PI / 6;
    controls.rotateSpeed = 0.45;
    controls.zoomSpeed = 0.7;
    controlsRef.current = controls;

    /* 4. Globe Object */
    const globe = new Globe()
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .showAtmosphere(true)
      .atmosphereColor('#1e40af')
      .atmosphereAltitude(0.35);

    scene.add(globe);
    globeRef.current = globe;

    /* 5. Lights */
    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 3, 5);
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.8);
    rimLight.position.set(-5, 0, -5);
    scene.add(rimLight);

    /* 6. Animation Loop */
    const animate = () => {
      requestAnimationFrame(animate);
      // Auto rotate pelan
      (globe as any).rotation.y += 0.0008;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    /* 7. Resize Handler */
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    /* 8. Cleanup */
    return () => {
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []); // Dependency kosong: Scene dibuat sekali saja

  /* ---------------- EFFECT 2: DATA UPDATE (Setiap Data Berubah) ---------------- */
  useEffect(() => {
    if (!globeRef.current || !data) return;

    const severityColor: Record<string, [string, string]> = {
      low: ['#22c55e', '#16a34a'],
      medium: ['#eab308', '#ca8a04'],
      high: ['#f97316', '#ea580c'],
      critical: ['#ef4444', '#b91c1c'],
      Information: ['#eab308', '#ca8a04'], // Tetap ada sesuai codingan awal
      information: ['#eab308', '#ca8a04'], // Case insensitive safety
      notice: ['#a855f7', '#7e22ce'],
      Notice: ['#a855f7', '#7e22ce'],
    };

    /* Update Arcs */
    globeRef.current
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

    /* Update Points */
    globeRef.current
      .pointsData(
        data.flatMap(d => ([
          { lat: d.startLat, lng: d.startLng },
          { lat: d.endLat, lng: d.endLng },
        ]))
      )
      .pointColor(() => '#ffffff')
      .pointRadius(0.4)
      .pointAltitude(0.02);

  }, [data]); // Hanya bagian ini yang jalan saat data di-refresh (15 menit sekali)

  return <div ref={containerRef} className="w-full h-full" />;
}