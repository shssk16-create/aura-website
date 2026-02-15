"use client";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// هذا الشيدر يخلق تموجات سائلة بالألوان المطلوبة
const fragmentShader = `
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec2 vUv;

// دالة ضوضاء بسيطة
float noise(vec2 p){
    return sin(p.x*10.0) * sin(p.y*10.0);
}

void main() {
    vec2 uv = vUv;
    // تموجات سائلة
    float wave = sin(uv.x * 10.0 + uTime) * 0.1 + sin(uv.y * 12.0 + uTime * 0.5) * 0.1;
    float strength = smoothstep(0.0, 1.0, sin(uv.x * 5.0 + uTime * 0.2) + wave);
    
    // دمج ألوان الهوية
    vec3 color = mix(uColor1, uColor2, strength + wave);
    
    // تلاشي الأطراف (Vignette)
    float dist = distance(uv, vec2(0.5));
    float alpha = smoothstep(0.5, 0.0, dist);

    gl_FragColor = vec4(color, alpha * 0.6);
}
`;

const vertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FluidPlane = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const uniforms = useRef({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color("#58A8B4") }, // Glowing Teal
    uColor2: { value: new THREE.Color("#438FB3") }, // Electric Blue
  });

  useFrame((state) => {
    if (meshRef.current) {
      uniforms.current.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -1]}>
      <planeGeometry args={[15, 15, 32, 32]} />
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms.current}
        transparent={true}
      />
    </mesh>
  );
};

export default function AuraBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <FluidPlane />
      </Canvas>
    </div>
  );
}
