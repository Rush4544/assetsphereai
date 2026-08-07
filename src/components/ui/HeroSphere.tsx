import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroSphere() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 8);

    function resize() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }

    const group = new THREE.Group();
    scene.add(group);

    const shellGeo = new THREE.IcosahedronGeometry(3, 2);
    const shellMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    group.add(shell);

    const shell2Geo = new THREE.IcosahedronGeometry(3, 1);
    const shell2Mat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const shell2 = new THREE.Mesh(shell2Geo, shell2Mat);
    shell2.scale.set(1.28, 1.28, 1.28);
    group.add(shell2);

    const nodeCount = 90;
    const nodesGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(nodeCount * 3);

    for (let i = 0; i < nodeCount; i++) {
      const r = 3 + Math.random() * 0.6;
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }

    nodesGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const nodesMat = new THREE.PointsMaterial({
      color: 0xf5f7fa,
      size: 0.06,
      transparent: true,
      opacity: 0.85,
    });
    const nodes = new THREE.Points(nodesGeo, nodesMat);
    group.add(nodes);

    const coreGeo = new THREE.SphereGeometry(1.15, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.09,
    });
    group.add(new THREE.Mesh(coreGeo, coreMat));

    group.position.set(1.2, 0.2, 0);

    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX / window.innerWidth - 0.5;
      mouseY = e.clientY / window.innerHeight - 0.5;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", resize);

    resize();

    const clock = new THREE.Clock();
    let raf = 0;

    const animate = () => {
      const t = clock.getElapsedTime();
      group.rotation.y = t * 0.13 + mouseX * 0.4;
      group.rotation.x = Math.sin(t * 0.2) * 0.1 + mouseY * 0.3;
      nodes.rotation.y = -t * 0.06;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", resize);

      shellGeo.dispose();
      shell2Geo.dispose();
      nodesGeo.dispose();
      coreGeo.dispose();
      shellMat.dispose();
      shell2Mat.dispose();
      nodesMat.dispose();
      coreMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative h-[340px] w-full rounded-xl border border-white/10 bg-black/20 shadow-2xl">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}