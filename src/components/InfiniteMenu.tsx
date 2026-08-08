"use client";

import { useRef, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Billboard, OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";

export interface InfiniteMenuItem {
  image: string;
  title: string;
  description?: string;
  href?: string;
}

function fibonacciSphere(count: number, radius: number) {
  const points: [number, number, number][] = [];
  const offset = 2 / count;
  const increment = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const y = i * offset - 1 + offset / 2;
    const r = Math.sqrt(1 - y * y);
    const phi = i * increment;
    points.push([Math.cos(phi) * r * radius, y * radius, Math.sin(phi) * r * radius]);
  }
  return points;
}

function roundedPlaneGeometry(size: number, radius: number) {
  const shape = new THREE.Shape();
  const h = size / 2;
  const r = radius;

  shape.moveTo(-h + r, -h);
  shape.lineTo(h - r, -h);
  shape.quadraticCurveTo(h, -h, h, -h + r);
  shape.lineTo(h, h - r);
  shape.quadraticCurveTo(h, h, h - r, h);
  shape.lineTo(-h + r, h);
  shape.quadraticCurveTo(-h, h, -h, h - r);
  shape.lineTo(-h, -h + r);
  shape.quadraticCurveTo(-h, -h, -h + r, -h);

  const geometry = new THREE.ShapeGeometry(shape, 12);
  geometry.computeBoundingBox();
  const bb = geometry.boundingBox!;
  const uv = geometry.attributes.uv;
  for (let i = 0; i < uv.count; i++) {
    const x = geometry.attributes.position.getX(i);
    const y = geometry.attributes.position.getY(i);
    uv.setXY(
      i,
      (x - bb.min.x) / (bb.max.x - bb.min.x),
      (y - bb.min.y) / (bb.max.y - bb.min.y)
    );
  }
  return geometry;
}

function Tile({
  position,
  item,
  onFront,
}: {
  position: [number, number, number];
  item: InfiniteMenuItem;
  onFront: () => void;
}) {
  const texture = useTexture(item.image);
  const ref = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const geometry = useMemo(() => roundedPlaneGeometry(1.15, 0.14), []);

  useFrame(() => {
    if (!ref.current) return;
    const dir = new THREE.Vector3(...position).normalize();
    const camDir = camera.position.clone().normalize();
    if (dir.dot(camDir) > 0.94) onFront();
  });

  return (
    <Billboard ref={ref} position={position}>
      <mesh
        geometry={geometry}
        onClick={() => item.href && window.open(item.href, "_blank")}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      >
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </Billboard>
  );
}

function Scene({
  items,
  radius,
  setActive,
}: {
  items: InfiniteMenuItem[];
  radius: number;
  setActive: (i: InfiniteMenuItem) => void;
}) {
  const points = fibonacciSphere(items.length, radius);

  return (
    <>
      {items.map((item, i) => (
        <Tile key={item.title} position={points[i]} item={item} onFront={() => setActive(item)} />
      ))}
    </>
  );
}

export default function InfiniteMenu({ items }: { items: InfiniteMenuItem[] }) {
  const [active, setActive] = useState<InfiniteMenuItem>(items[0]);

  return (
    <div className="relative h-full w-full">
      <Canvas camera={{ position: [0, 0, 5.2], fov: 45 }}>
        <ambientLight intensity={1.2} />
        <Suspense fallback={null}>
          <Scene items={items} radius={2.6} setActive={setActive} />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.6}
          rotateSpeed={0.5}
        />
      </Canvas>

      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
        <div className="font-display text-lg uppercase tracking-[0.1em]">{active?.title}</div>
        {active?.description && (
          <div className="mt-1 text-xs text-muted">{active.description}</div>
        )}
      </div>
    </div>
  );
}
