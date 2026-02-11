"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Environment } from "@react-three/drei";

function Particles({ count = 2000 }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = (Math.random() - 0.5) * 10;
      const speed = 0.01 + Math.random() / 200;
      const x = (Math.random() - 0.5) * 15;
      const y = (Math.random() - 0.5) * 5;
      const z = (Math.random() - 0.5) * 5;
      temp.push({ t, factor, speed, x, y, z });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    if (!mesh.current) return;
    
    // إصلاح الخطأ: نحفظ الميش في متغير ثابت قبل الدخول في اللوب
    const currentMesh = mesh.current;

    particles.forEach((particle, i) => {
      let { t, factor, speed, x, y, z } = particle;
      t = particle.t += speed / 2;
      const s = Math.cos(t);
      
      dummy.position.set(
        x + Math.cos(t / 10) * factor + (Math.sin(t * 1) * factor) / 10,
        y + Math.sin(t / 10) * factor + (Math.cos(t * 2) * factor) / 10,
        z + Math.cos(t / 10) * factor + (Math.sin(t * 3) * factor) / 10
      );
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      
      // نستخدم المتغير الثابت هنا
      currentMesh.setMatrixAt(i, dummy.matrix);
    });
    currentMesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[0.05, 0]} />
      <meshStandardMaterial color="#58A8B4" emissive="#438FB3" emissiveIntensity={0.5} roughness={0.5} />
    </instancedMesh>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 -z-10 opacity-60">
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#58A8B4" />
        <Particles />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
