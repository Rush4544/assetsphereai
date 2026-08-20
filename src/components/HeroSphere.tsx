import { useEffect, useRef } from "react";
import * as THREE from "three";

// Resolves a CSS custom property (including oklch/hsl-space syntax) to a
// browser-computed rgb() string, so Three.js can parse it reliably.
function resolveCssColor(varName: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const probe = document.createElement("div");
  probe.style.color = `var(${varName})`;
  document.body.appendChild(probe);
  const computed = getComputedStyle(probe).color;
  document.body.removeChild(probe);
  return computed || fallback;
}

export default function HeroSphere({
  className = "relative mx-auto aspect-square w-full max-w-md",
}: {
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const primary = new THREE.Color(resolveCssColor("--color-primary", "#3b82f6"));
    const accent = new THREE.Color(resolveCssColor("--color-chart-3", "#8b5cf6"));
    const foreground = new THREE.Color(resolveCssColor("--color-foreground", "#f5f7fa"));

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 8);

    const group = new THREE.Group();
    scene.add(group);

    // outer wireframe shell
    const shellGeo = new THREE.IcosahedronGeometry(3, 2);
    const shellMat = new THREE.MeshBasicMaterial({ color: primary, wireframe: true, transparent: true, opacity: 0.18 });
    group.add(new THREE.Mesh(shellGeo, shellMat));

    // inner wireframe shell (accent color, slightly larger)
    const shell2Geo = new THREE.IcosahedronGeometry(3, 1);
    const shell2Mat = new THREE.MeshBasicMaterial({ color: accent, wireframe: true, transparent: true, opacity: 0.22 });
    const shell2 = new THREE.Mesh(shell2Geo, shell2Mat);
    shell2.scale.setScalar(1.28);
    group.add(shell2);

    // orbiting "asset" nodes
    const nodeCount = 90;
    const positions = new Float32Array(nodeCount * 3);
    for (let i = 0; i < nodeCount; i++) {
      const r = 3 + Math.random() * 0.6;
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const nodesGeo = new THREE.BufferGeometry();
    nodesGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const nodesMat = new THREE.PointsMaterial({ color: foreground, size: 0.06, transparent: true, opacity: 0.85 });
    const nodes = new THREE.Points(nodesGeo, nodesMat);
    group.add(nodes);

    // glowing core
    const coreGeo = new THREE.SphereGeometry(1.15, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({ color: primary, transparent: true, opacity: 0.09 });
    group.add(new THREE.Mesh(coreGeo, coreMat));

    let mouseX = 0;
    let mouseY = 0;
    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX / window.innerWidth - 0.5;
      mouseY = e.clientY / window.innerHeight - 0.5;
    }
    window.addEventListener("mousemove", onMouseMove);

    function resize() {
      const parent = canvas!.parentElement;
      const w = parent ? parent.clientWidth : canvas!.clientWidth;
      const h = parent ? parent.clientHeight : canvas!.clientHeight;
      renderer.setSize(w, h, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      camera.aspect = w / h || 1;
      camera.updateProjectionMatrix();
    }
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    resize();

    const clock = new THREE.Clock();
    let frameId: number;
    function animate() {
      const t = clock.getElapsedTime();
      group.rotation.y = t * 0.13 + mouseX * 0.4;
      group.rotation.x = Math.sin(t * 0.2) * 0.1 + mouseY * 0.3;
      nodes.rotation.y = -t * 0.06;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    }
    animate();

    // Critical cleanup — this component mounts/unmounts on route navigation,
    // unlike a static marketing page, so leaking GPU resources adds up fast.
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMouseMove);
      ro.disconnect();
      shellGeo.dispose();
      shellMat.dispose();
      shell2Geo.dispose();
      shell2Mat.dispose();
      nodesGeo.dispose();
      nodesMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className={className}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
