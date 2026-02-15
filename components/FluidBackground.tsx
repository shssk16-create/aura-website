"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// كود الشيدر (GLSL) لخلق السائل المتوهج
const vertexShader = `
varying vec2 vUv;
varying float vDisplacement;
uniform float uTime;

// دالة ضوضاء (Perlin Noise approximation)
float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}
float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);
    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);
    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);
    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));
    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);
    return o4.y * d.y + o4.x * (1.0 - d.y);
}

void main() {
  vUv = uv;
  // تحريك النقاط بناءً على الضوضاء والوقت
  float displacement = noise(vec3(position.xy * 2.0, uTime * 0.5));
  vDisplacement = displacement;
  
  vec3 newPos = position + normal * displacement * 0.2;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
}
`;

const fragmentShader = `
uniform float uTime;
varying vec2 vUv;
varying float vDisplacement;

void main() {
  // الألوان الأساسية: الأزرق والتركواز
  vec3 color1 = vec3(0.345, 0.659, 0.706); // #58A8B4
  vec3 color2 = vec3(0.263, 0.561, 0.702); // #438FB3
  
  // مزج الألوان بناءً على التموج
  vec3 color = mix(color1, color2, vDisplacement * 2.0 + 0.5);
  
  // إضافة شفافية للأطراف
  float alpha = smoothstep(0.0, 0.8, 1.0 - distance(vUv, vec2(0.5)));
  
  gl_FragColor = vec4(color, alpha * 0.4); // شفافية خفيفة
}
`;

const Blob = () => {
  const mesh = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  );

  useFrame((state) => {
    const { clock } = state;
    if (mesh.current) {
      (mesh.current.material as THREE.ShaderMaterial).uniforms.uTime.value = clock.getElapsedTime();
      // حركة دوران بطيئة
      mesh.current.rotation.y = clock.getElapsedTime() * 0.1;
      mesh.current.rotation.z = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <mesh ref={mesh} scale={2.5} position={[2, 0, 0]}>
      <sphereGeometry args={[1, 128, 128]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

export default function FluidBackground() {
  return (
    <div className="absolute inset-0 z-0 w-full h-full pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <Blob />
      </Canvas>
    </div>
  );
}
