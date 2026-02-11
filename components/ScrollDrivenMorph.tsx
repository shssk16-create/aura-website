"use client";
import React, { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const vertexShader = `
  uniform float uProgress1; uniform float uProgress2; 
  attribute vec3 aTarget1; attribute vec3 aTarget2; attribute float aRandomness;
  void main() {
    vec3 pos1 = mix(position, aTarget1, uProgress1);
    float arc = sin(uProgress2 * 3.14159); 
    vec3 pos2 = mix(pos1, aTarget2, uProgress2);
    pos2.x += cos(aRandomness * 20.0) * arc * 4.0;
    pos2.y += sin(aRandomness * 20.0) * arc * 4.0;
    pos2.z += (aRandomness - 0.5) * arc * 8.0;
    vec4 mvPosition = modelViewMatrix * vec4(pos2, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    // تكبير حجم الذرات بشكل كبير جداً (أكثر من الضعف)
    gl_PointSize = (70.0 + aRandomness * 50.0) * (1.0 / -mvPosition.z);
  }
`;

const fragmentShader = `
  uniform vec3 uColor1; uniform vec3 uColor2; uniform float uProgress2;
  void main() {
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) discard;
    float alpha = smoothstep(0.5, 0.1, dist);
    vec3 finalColor = mix(uColor1, uColor2, uProgress2);
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

const MAX_PARTICLES = 5000;

const getPointsFromText = async (text: string, fontSize: number, width: number, height: number, scale: number) => {
  if (typeof document === "undefined") return [];
  const fontName = "DINNextArabicBold";
  try {
    const font = new FontFace(fontName, `url(/fonts/DINNextLTArabic-Bold.woff2)`);
    await font.load(); 
    document.fonts.add(font);
  } catch (e) {
    console.warn("استخدام الخط البديل");
  }
  
  const canvas = document.createElement("canvas");
  canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return [];
  
  ctx.fillStyle = "white";
  ctx.font = `900 ${fontSize}px '${fontName}', 'Cairo', 'Arial', sans-serif`;
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(text, width / 2, height / 2);
  
  const data = ctx.getImageData(0, 0, width, height).data;
  const points = [];
  for (let y = 0; y < height; y += 4) {
    for (let x = 0; x < width; x += 4) {
      if (data[(y * width + x) * 4 + 3] > 128) {
        points.push(new THREE.Vector3((x - width / 2) * scale, -(y - height / 2) * scale, 0));
      }
    }
  }
  return points;
};

function MorphParticles({ uniformsRef }: { uniformsRef: any }) {
  const [geometryData, setGeometryData] = useState<any>(null);
  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      const isMob = window.innerWidth < 768;
      const scale = isMob ? 0.05 : 0.08; 
      const auraPts = await getPointsFromText("أورا", 350, 1000, 500, scale);
      const questionPts = await getPointsFromText("؟", 400, 1000, 500, scale);
      
      if (!isMounted) return;
      
      const pos = new Float32Array(MAX_PARTICLES * 3);
      const t1 = new Float32Array(MAX_PARTICLES * 3);
      const t2 = new Float32Array(MAX_PARTICLES * 3);
      const rand = new Float32Array(MAX_PARTICLES);
      
      for (let i = 0; i < MAX_PARTICLES; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 40; 
        pos[i * 3 + 1] = (Math.random() - 0.5) * 40; 
        pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
        
        const p1 = auraPts.length > 0 ? auraPts[i % auraPts.length] : new THREE.Vector3();
        t1[i * 3] = p1.x; t1[i * 3 + 1] = p1.y; t1[i * 3 + 2] = p1.z;
        
        const p2 = questionPts.length > 0 ? questionPts[i % questionPts.length] : new THREE.Vector3();
        t2[i * 3] = p2.x; t2[i * 3 + 1] = p2.y; t2[i * 3 + 2] = p2.z;
        
        rand[i] = Math.random();
      }
      setGeometryData({ pos, t1, t2, rand });
    };
    init(); return () => { isMounted = false; };
  }, []);
  
  if (!geometryData) return null;
  
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[geometryData.pos, 3]} />
        <bufferAttribute attach="attributes-aTarget1" args={[geometryData.t1, 3]} />
        <bufferAttribute attach="attributes-aTarget2" args={[geometryData.t2, 3]} />
        <bufferAttribute attach="attributes-aRandomness" args={[geometryData.rand, 1]} />
      </bufferGeometry>
      <shaderMaterial 
        transparent 
        depthWrite={false} 
        blending={THREE.NormalBlending} 
        vertexShader={vertexShader} 
        fragmentShader={fragmentShader} 
        uniforms={uniformsRef.current} 
      />
    </points>
  );
}

export default function ScrollDrivenMorph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const heroHtmlRef = useRef<HTMLDivElement>(null);
  const whyAuraHtmlRef = useRef<HTMLDivElement>(null);
  
  const shaderUniforms = useRef({
    uProgress1: { value: 0 }, uProgress2: { value: 0 },
    uColor1: { value: new THREE.Color("#0F172A") }, 
    uColor2: { value: new THREE.Color("#438FB3") }  
  });

  useEffect(() => {
    if (!containerRef.current) return;
    
    gsap.fromTo(canvasWrapperRef.current, { opacity: 0 }, { opacity: 1, duration: 2, ease: "power2.out" });
    gsap.fromTo(heroHtmlRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.5, delay: 0.5, ease: "expo.out" });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: containerRef.current, start: "top top", end: "+=4000", scrub: 1, pin: true } });
      tl.to(shaderUniforms.current.uProgress1, { value: 1, duration: 30 }, 0)
        .to(heroHtmlRef.current, { opacity: 0, y: -50, filter: "blur(10px)", duration: 15 }, 30)
        .to(shaderUniforms.current.uProgress2, { value: 1, duration: 30 }, 45)
        .to(canvasWrapperRef.current, { opacity: 0.25, scale: 1.05, duration: 30 }, 45)
        .fromTo(whyAuraHtmlRef.current, { opacity: 0, y: 60, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 25 }, 75);
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative h-screen w-full overflow-hidden bg-[#F8FAFC]">
      <div ref={heroHtmlRef} className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 pointer-events-none opacity-0">
        <h1 className="text-6xl md:text-8xl font-black text-[#0F172A] text-center leading-tight">نصنع لك <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#58A8B4] to-[#438FB3]">هالتك الفارقة</span></h1>
      </div>
      <div ref={canvasWrapperRef} className="absolute inset-0 z-10 opacity-0" style={{ willChange: "opacity, transform" }}>
        <Canvas camera={{ position: [0, 0, 16], fov: 45 }} dpr={[1, 2]}><MorphParticles uniformsRef={shaderUniforms} /></Canvas>
      </div>
      <div ref={whyAuraHtmlRef} className="absolute inset-0 z-30 flex flex-col items-center justify-center opacity-0 pointer-events-none px-6">
        <h2 className="text-5xl md:text-8xl font-black text-[#0F172A] mb-6 text-center leading-tight">لماذا <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#58A8B4] to-[#438FB3]">أورا؟</span></h2>
      </div>
    </div>
  );
}
