"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

// 1. نظام القراءة الديناميكي (يتغير حسب الشاشة)
const getTextPoints = (screenWidth: number) => {
  if (typeof document === "undefined") return [];
  
  let fontSize = 220;
  let step = 8; // المسافة بين كل ذرة والأخرى
  let scale = 0.04;
  let canvasW = 1200;

  // إعدادات الموبايل (شاشات صغيرة)
  if (screenWidth < 768) { 
    fontSize = 110;     // خط أصغر
    step = 4;           // كثافة ذرات أعلى لتعويض صغر الخط
    scale = 0.035;      // تصغير مجسم 3D
    canvasW = 600;
  } 
  // إعدادات التابلت
  else if (screenWidth < 1024) { 
    fontSize = 160;
    step = 6;
    scale = 0.038;
    canvasW = 900;
  }

  const canvas = document.createElement("canvas");
  canvas.width = canvasW; 
  canvas.height = 400;
  const ctx = canvas.getContext("2d");
  if (!ctx) return [];
  
  ctx.fillStyle = "white";
  ctx.font = `900 ${fontSize}px 'Cairo', sans-serif`;
  ctx.textAlign = "center"; 
  ctx.textBaseline = "middle";
  ctx.fillText("AURA", canvas.width / 2, canvas.height / 2);
  
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const points = [];
  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      if (data[(y * canvas.width + x) * 4 + 3] > 128) {
        points.push(new THREE.Vector3((x - canvas.width / 2) * scale, -(y - canvas.height / 2) * scale, 0));
      }
    }
  }
  return points;
};

const AuraParticles = ({ progressProxy }: { progressProxy: any }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const [targetPoints, setTargetPoints] = useState<THREE.Vector3[]>([]);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tempMouse = useMemo(() => new THREE.Vector3(), []);
  const tempDir = useMemo(() => new THREE.Vector3(), []);

  // 2. تحديث النقاط عند تغيير حجم الشاشة (Responsive Listener)
  useEffect(() => {
    const handleResize = () => setTargetPoints(getTextPoints(window.innerWidth));
    handleResize(); // التشغيل الأول
    
    // استخدام Debounce لتخفيف الضغط على المعالج عند تصغير/تكبير النافذة
    let timeout: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(handleResize, 300);
    };
    
    window.addEventListener("resize", debouncedResize);
    return () => window.removeEventListener("resize", debouncedResize);
  }, []);

  const startPoints = useMemo(() => targetPoints.map(() => 
    new THREE.Vector3((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 20)
  ), [targetPoints]);

  useFrame((state) => {
    if (!meshRef.current || targetPoints.length === 0) return;
    const p = progressProxy.current.value;
    tempMouse.set((state.pointer.x * state.viewport.width) / 2, (state.pointer.y * state.viewport.height) / 2, 0);

    const ease = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
    
    for (let i = 0; i < targetPoints.length; i++) {
      dummy.position.lerpVectors(startPoints[i], targetPoints[i], ease);
      
      const dist = dummy.position.distanceTo(tempMouse);
      // تقليل مساحة تأثير الماوس في الجوال حتى لا تتطاير الذرات بخطأ اللمس
      const repelRadius = state.viewport.width < 10 ? 1.5 : 3.5; 
      
      if (dist < repelRadius && p > 0.5) { 
        tempDir.subVectors(dummy.position, tempMouse).normalize();
        const force = (repelRadius - dist) * 0.8; 
        tempDir.z += (Math.random() - 0.5) * 2; 
        dummy.position.add(tempDir.multiplyScalar(force));
      }

      dummy.position.y += Math.sin(state.clock.elapsedTime * 2 + i) * 0.05;
      dummy.position.x += Math.cos(state.clock.elapsedTime * 1.5 + i) * 0.02;

      dummy.rotation.set(ease * Math.PI, ease * Math.PI, 0);
      const scale = (1 + ease * 0.5) * (dist < repelRadius ? 1.5 : 1); 
      dummy.scale.set(scale, scale, scale);
      
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (targetPoints.length === 0) return null;
  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, targetPoints.length]}>
      <dodecahedronGeometry args={[0.04, 0]} />
      <meshStandardMaterial color="#438FB3" emissive="#58A8B4" emissiveIntensity={1.2} roughness={0.1} />
    </instancedMesh>
  );
};

export default function ScrollDrivenHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const layer1 = useRef<HTMLDivElement>(null), layer2 = useRef<HTMLDivElement>(null), layer3 = useRef<HTMLDivElement>(null);
  const progressProxy = useRef({ value: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: containerRef.current, start: "top top", end: "+=2500", scrub: 1, pin: true, anticipatePin: 1 } });
      tl.to(progressProxy.current, { value: 1, duration: 4, ease: "power2.inOut" })
        .to([layer1.current, layer2.current], { opacity: 0, filter: "blur(20px)", scale: 1.1, duration: 2 }, ">")
        .fromTo(layer3.current, { opacity: 0, y: 80, filter: "blur(15px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 4, ease: "expo.out" }, ">");
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative h-screen w-full overflow-hidden bg-[#F8FAFC]">
      <div ref={layer1} className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none px-4" style={{ willChange: "transform, opacity, filter" }}>
        {/* إضافة leading-tight لضمان عدم تداخل النص في الجوال */}
        <h1 className="text-5xl md:text-8xl font-black text-[#0F172A] text-center drop-shadow-sm leading-tight">
          نصنع لك <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#58A8B4] to-[#438FB3]">هالتك الفارقة</span>
        </h1>
      </div>
      <div ref={layer2} className="absolute inset-0 z-10 mix-blend-multiply opacity-80 pointer-events-auto cursor-none" style={{ willChange: "transform, opacity, filter" }}>
        <Canvas camera={{ position: [0, 0, 15], fov: 45 }} dpr={[1, 2]}>
          <ambientLight intensity={2} color="#ffffff" />
          <directionalLight position={[10, 10, 5]} intensity={4} color="#58A8B4" />
          <AuraParticles progressProxy={progressProxy} />
        </Canvas>
      </div>
      <div ref={layer3} className="absolute inset-0 z-30 flex flex-col items-center justify-center opacity-0 pointer-events-none px-6" style={{ willChange: "transform, opacity, filter" }}>
        <h2 className="text-4xl md:text-7xl font-bold text-[#0F172A] mb-6 drop-shadow-sm text-center">لماذا أورا؟</h2>
        <p className="text-lg md:text-2xl text-[#0F172A]/70 max-w-3xl text-center leading-relaxed">نبني أنظمة رقمية تتنفس هوية علامتك التجارية وتدفعها للنمو المتسارع في عالم يزدحم بالضجيج.</p>
      </div>
    </div>
  );
}
