"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/* -------------------------------------------------------------------------- */
/* 1. SHADERS (GPU Magic)                                                     */
/* -------------------------------------------------------------------------- */

const vertexShader = `
  uniform float uProgress1; 
  uniform float uProgress2; 
  
  attribute vec3 aTarget1; 
  attribute vec3 aTarget2; 
  attribute float aRandomness;
  
  void main() {
    // التجميع إلى AURA
    vec3 pos1 = mix(position, aTarget1, uProgress1);
    
    // التحول إلى ? مع تأثير تناثر عضوي
    float arc = sin(uProgress2 * 3.14159); 
    vec3 pos2 = mix(pos1, aTarget2, uProgress2);
    
    pos2.x += cos(aRandomness * 20.0) * arc * 4.0;
    pos2.y += sin(aRandomness * 20.0) * arc * 4.0;
    pos2.z += (aRandomness - 0.5) * arc * 10.0;

    vec4 mvPosition = modelViewMatrix * vec4(pos2, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = (20.0 + aRandomness * 20.0) * (1.0 / -mvPosition.z);
  }
`;

const fragmentShader = `
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uProgress2;

  void main() {
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) discard;
    float alpha = smoothstep(0.5, 0.1, dist);
    vec3 finalColor = mix(uColor1, uColor2, uProgress2);
    gl_FragColor = vec4(finalColor, alpha * 0.9);
  }
`;

const MAX_PARTICLES = 4000;

const getPointsFromText = (text: string, fontSize: number, width: number, height: number, scale: number) => {
  const canvas = document.createElement("canvas");
  canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return [];

  ctx.fillStyle = "white";
  ctx.font = `900 ${fontSize}px 'Cairo', sans-serif`;
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

const MorphParticles = ({ uniformsRef }: { uniformsRef: any }) => {
  const [geometryData, setGeometryData] = useState<any>(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const canvasW = isMobile ? 600 : 1200;
    const canvasH = 500;
    const scale = isMobile ? 0.03 : 0.04;

    const auraPts = getPointsFromText("AURA", isMobile ? 120 : 250, canvasW, canvasH, scale);
    const questionPts = getPointsFromText("?", isMobile ? 250 : 400, canvasW, canvasH, scale);

    const positions = new Float32Array(MAX_PARTICLES * 3);
    const target1 = new Float32Array(MAX_PARTICLES * 3);
    const target2 = new Float32Array(MAX_PARTICLES * 3);
    const randomness = new Float32Array(MAX_PARTICLES);

    for (let i = 0; i < MAX_PARTICLES; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      const p1 = auraPts[i % auraPts.length] || new THREE.Vector3();
      target1[i * 3] = p1.x; target1[i * 3 + 1] = p1.y; target1[i * 3 + 2] = p1.z;

      const p2 = questionPts[i % questionPts.length] || new THREE.Vector3();
      target2[i * 3] = p2.x; target2[i * 3 + 1] = p2.y; target2[i * 3 + 2] = p2.z;

      randomness[i] = Math.random();
    }

    setGeometryData({ positions, target1, target2, randomness });
  }, []);

  if (!geometryData) return null;

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[geometryData.positions, 3]} />
        <bufferAttribute attach="attributes-aTarget1" args={[geometryData.target1, 3]} />
        <bufferAttribute attach="attributes-aTarget2" args={[geometryData.target2, 3]} />
        <bufferAttribute attach="attributes-aRandomness" args={[geometryData.randomness, 1]} />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniformsRef.current}
      />
    </points>
  );
};

/* -------------------------------------------------------------------------- */
/* 4. MAIN SCROLL COMPONENT & CHOREOGRAPHY                                    */
/* -------------------------------------------------------------------------- */

export default function ScrollDrivenMorph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const heroHtmlRef = useRef<HTMLDivElement>(null);
  const whyAuraHtmlRef = useRef<HTMLDivElement>(null);

  const shaderUniforms = useRef({
    uProgress1: { value: 0 },
    uProgress2: { value: 0 },
    uColor1: { value: new THREE.Color("#438FB3") },
    uColor2: { value: new THREE.Color("#58A8B4") }
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=4500", // إطالة مسافة التمرير للاستمتاع بالمشهد
          scrub: 1,
          pin: true,
          anticipatePin: 1
        }
      });

      // استخدام مواقع ثابتة (Absolute Timing) في الـ Timeline للتزامن المثالي
      // الإجمالي 100 وحدة زمنية (0 إلى 100)

      // المرحلة 1 (0 إلى 30): تجميع الجزيئات لتشكيل AURA خلف النص الافتتاحي
      tl.to(shaderUniforms.current.uProgress1, { value: 1, duration: 30, ease: "power2.inOut" }, 0);

      // المرحلة 2 (30 إلى 45): النص الافتتاحي يتلاشى ويصعد للأعلى
      tl.to(heroHtmlRef.current, { opacity: 0, y: -50, filter: "blur(15px)", duration: 15, ease: "power1.inOut" }, 30);

      // المرحلة 3 (45 إلى 75): الذرات تتحول إلى (؟) + الشفافية تقل لتصبح علامة مائية
      tl.to(shaderUniforms.current.uProgress2, { value: 1, duration: 30, ease: "power2.inOut" }, 45);
      tl.to(canvasWrapperRef.current, { opacity: 0.15, scale: 1.15, duration: 30, ease: "power2.inOut" }, 45);

      // المرحلة 4 (75 إلى 100): ظهور قسم "لماذا أورا" والنص يصعد من الأسفل بوضوح
      tl.fromTo(
        whyAuraHtmlRef.current,
        { opacity: 0, y: 80, filter: "blur(15px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 25, ease: "power3.out" },
        75
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative h-screen w-full overflow-hidden bg-[#F8FAFC]">
      
      {/* Layer 1: النص الافتتاحي (الهيرو) */}
      <div 
        ref={heroHtmlRef} 
        className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 pointer-events-none"
        style={{ willChange: "transform, opacity, filter", transform: "translateZ(0)" }}
      >
        <h1 className="text-6xl md:text-8xl font-black text-[#0F172A] drop-shadow-sm text-center leading-tight">
          نصنع لك <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#58A8B4] to-[#438FB3]">هالتك الفارقة</span>
        </h1>
        <p className="mt-6 text-xl md:text-2xl text-[#0F172A]/70 font-medium text-center max-w-2xl">
          تسويق يعتمد على البيانات، بروح إبداعية لا تُنسى.
        </p>
      </div>

      {/* Layer 2: العالم ثلاثي الأبعاد (الذرات) */}
      <div 
        ref={canvasWrapperRef} 
        className="absolute inset-0 z-10 mix-blend-multiply opacity-80"
        style={{ willChange: "transform, opacity, filter", transform: "translateZ(0)" }}
      >
        <Canvas camera={{ position: [0, 0, 15], fov: 45 }} dpr={[1, 2]}>
          <MorphParticles uniformsRef={shaderUniforms} />
        </Canvas>
      </div>

      {/* Layer 3: نص قسم "لماذا أورا؟" */}
      <div 
        ref={whyAuraHtmlRef} 
        className="absolute inset-0 z-30 flex flex-col items-center justify-center opacity-0 pointer-events-none px-6"
        style={{ willChange: "transform, opacity, filter", transform: "translateZ(0)" }}
      >
        <h2 className="text-5xl md:text-8xl font-black text-[#0F172A] mb-6 drop-shadow-sm text-center leading-tight">
          لماذا <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#58A8B4] to-[#438FB3]">أورا؟</span>
        </h2>
        <p className="text-xl md:text-3xl text-[#0F172A]/80 max-w-4xl text-center leading-relaxed font-semibold">
          لأننا لا نقدم تصاميم فقط، نحن نبني أنظمة رقمية تتنفس هوية علامتك التجارية، وتحول الزوار إلى عملاء ولاء بفضل التكنولوجيا المتقدمة.
        </p>
      </div>

    </div>
  );
}
