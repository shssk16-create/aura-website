"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Environment } from "@react-three/drei";

function Particles({ count = 2500 }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = (Math.random() - 0.5) * 12; // انتشار أوسع
      const speed = 0.005 + Math.random() / 200; // حركة أبطأ وأرقى
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 10;
      temp.push({ t, factor, speed, x, y, z });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    if (!mesh.current) return;
    const currentMesh = mesh.current;

    particles.forEach((particle, i) => {
      let { t, factor, speed, x, y, z } = particle;
      t = particle.t += speed / 2;
      const s = Math.cos(t) * 0.5 + 0.5; // نبض ناعم للجسيمات
      
      dummy.position.set(
        x + Math.cos(t / 10) * factor + (Math.sin(t * 1) * factor) / 10,
        y + Math.sin(t / 10) * factor + (Math.cos(t * 2) * factor) / 10,
        z + Math.cos(t / 10) * factor + (Math.sin(t * 3) * factor) / 10
      );
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      
      currentMesh.setMatrixAt(i, dummy.matrix);
    });
    currentMesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[0.04, 0]} />
      {/* تم تعديل الألوان لتناسب الخلفية الفاتحة (تباين أعلى) */}
      <meshStandardMaterial 
        color="#438FB3" 
        emissive="#58A8B4" 
        emissiveIntensity={0.6} 
        roughness={0.2} 
        metalness={0.8}
      />
    </instancedMesh>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 z-0 opacity-40 mix-blend-multiply">
      {/* استخدمنا mix-blend-multiply لدمج الـ 3D مع الخلفية الفاتحة بشكل رائع */}
      <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
        <ambientLight intensity={2} color="#ffffff" />
        <directionalLight position={[10, 10, 5]} intensity={3} color="#58A8B4" />
        <Particles />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
