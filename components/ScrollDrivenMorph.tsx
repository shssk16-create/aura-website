
"use client";
import React, { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Center } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "framer-motion";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

// 1. DATA
const leftLogos = [
  "https://aurateam3.com/wp-content/uploads/2025/10/kidana-logo-gold-06-1.png",
  "https://aurateam3.com/wp-content/uploads/2025/09/اورا-الجمعية-للتربية-الخاصة.webp",
  "https://aurateam3.com/wp-content/uploads/2025/09/حدائق-الفرات.webp",
  "https://aurateam3.com/wp-content/uploads/2025/09/اورا-البدر-للحجامة.webp",
  "https://aurateam3.com/wp-content/uploads/2025/09/اورا-نادي-مكة-الثقاقي.webp",
  "https://aurateam3.com/wp-content/uploads/2020/08/اعمار.webp",
  "https://aurateam3.com/wp-content/uploads/2024/02/20231126102247شعار_نادي_الوحدة_السعودية-1.webp",
  "https://aurateam3.com/wp-content/uploads/2025/09/أورا-وزارة-الاتصالات.webp",
  "https://aurateam3.com/wp-content/uploads/2025/09/اورا-جامعة-ام-القرى.webp",
  "https://aurateam3.com/wp-content/uploads/2024/01/الهلال-الاحمر.webp",
  "https://aurateam3.com/wp-content/uploads/2025/09/اورا-درب.webp",
  "https://aurateam3.com/wp-content/uploads/2020/08/Aldrees_logo.png",
  "https://aurateam3.com/wp-content/uploads/2024/01/LPTC-LOGO.png",
  "https://aurateam3.com/wp-content/uploads/2025/09/spactive-اورا.webp",
];

const rightLogos = [
  "https://aurateam3.com/wp-content/uploads/2025/09/اورا-جامعة-الملك-عبد-العزيز.webp",
  "https://aurateam3.com/wp-content/uploads/2025/09/اورا-INNOVATIVE-MANAGEMENT.webp",
  "https://aurateam3.com/wp-content/uploads/2025/09/اورا-سقنتشر.webp",
  "https://aurateam3.com/wp-content/uploads/2025/09/اورا-رواء-الذهبية-scaled.webp",
  "https://aurateam3.com/wp-content/uploads/2025/09/اورا-phtobrick.webp",
  "https://aurateam3.com/wp-content/uploads/2024/02/جولفن.webp",
  "https://aurateam3.com/wp-content/uploads/2025/09/اورا-وزارة-الثقافة.webp",
  "https://aurateam3.com/wp-content/uploads/2025/09/اورا-الهيئة-الملكية.webp",
  "https://aurateam3.com/wp-content/uploads/2024/01/1022px-General_Department_of_Traffic_of_Saudi_Arabia.svg-1.webp",
  "https://aurateam3.com/wp-content/uploads/2025/09/اورا-عمران.webp",
  "https://aurateam3.com/wp-content/uploads/2025/09/اورا-محمد-طه-السقاف.webp",
  "https://aurateam3.com/wp-content/uploads/2024/02/وارقة.webp",
  "https://aurateam3.com/wp-content/uploads/2024/01/UnUYOi-3.png",
];

const projects = [
  {
    id: 1,
    title: "كدانة - اليوم الوطني",
    category: "Motion Graphics",
    video: "https://aurateam3.com/wp-content/uploads/2025/09/كدانة-اليوم-الوطني.mp4"
  },
  {
    id: 2,
    title: "يوم التأسيس السعودي 1727",
    category: "Video Production",
    video: "https://aurateam3.com/wp-content/uploads/2024/02/saudi-founding-day-1727-fainal-project2-1-1.mp4"
  },
  {
    id: 3,
    title: "حملة إعلانية (X)",
    category: "Social Media",
    video: "https://aurateam3.com/wp-content/uploads/2025/09/ssstwitter.com_1735982275927.mp4"
  }
];

// 2. SHADERS
const vertexShader = `
  uniform float uProgress1; uniform float uProgress2; uniform float uProgress3; uniform float uTime; 
  attribute vec3 aTarget1; attribute vec3 aTarget2; attribute float aRandomness;
  varying float vAlphaModifier; varying vec2 vVelocity;
  
  void main() {
    vec3 pos1 = mix(position, aTarget1, uProgress1);
    float arc = sin(uProgress2 * 3.14159); 
    vec3 pos2 = mix(pos1, aTarget2, uProgress2);
    
    vec2 vel = (aTarget2.xy - aTarget1.xy) * arc * 0.05; 
    vVelocity = vel;
    
    pos2.x += sin(uTime * 0.2 + aRandomness * 10.0) * 0.5;
    pos2.y += cos(uTime * 0.2 + aRandomness * 10.0) * 0.5;
    pos2.z += sin(uTime * 0.3 + aRandomness * 10.0) * 1.0;

    pos2.x += cos(aRandomness * 8.0) * arc * 2.0;
    pos2.y += sin(aRandomness * 8.0) * arc * 2.0;
    pos2.z += (aRandomness - 0.5) * arc * 4.0;

    pos2.x += (aRandomness - 0.5) * uProgress3 * 30.0;
    pos2.y += uProgress3 * (80.0 + aRandomness * 60.0);
    pos2.z += (aRandomness - 0.5) * uProgress3 * 20.0;

    vec4 mvPosition = modelViewMatrix * vec4(pos2, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    float baseSize = 3.0 + aRandomness * 2.5;
    float trailStretch = length(vel) * 20.0; 
    gl_PointSize = (baseSize + trailStretch) * (15.0 / -mvPosition.z);
    
    vAlphaModifier = 1.0 - (uProgress3 * (0.8 + aRandomness * 0.2)); 
  }
`;

const fragmentShader = `
  uniform vec3 uColorCore; uniform vec3 uColorEdge; 
  varying float vAlphaModifier; varying vec2 vVelocity;
  
  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float speed = length(vVelocity);
    if (speed > 0.0) {
        vec2 dir = normalize(vVelocity);
        float u = dot(uv, dir);
        float v = dot(uv, vec2(-dir.y, dir.x));
        u /= (1.0 + speed * 12.0); 
        uv = dir * u + vec2(-dir.y, dir.x) * v;
    }
    float dist = length(uv);
    float alpha = smoothstep(0.5, 0.1, dist); 
    if (alpha < 0.02) discard;
    
    vec3 finalColor = mix(uColorEdge, uColorCore, smoothstep(0.5, 0.0, dist));
    gl_FragColor = vec4(finalColor, alpha * 0.6 * vAlphaModifier);
  }
`;

const MAX_PARTICLES = 12000; 

const getPointsFromText = async (text: string, fontSize: number, width: number, height: number, scale: number) => {
  if (typeof document === "undefined") return [];
  const canvas = document.createElement("canvas");
  canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return [];
  ctx.fillStyle = "white";
  ctx.font = `900 ${fontSize}px 'Arial Black', sans-serif`;
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(text, width / 2, height / 2 + (fontSize * 0.05));
  const data = ctx.getImageData(0, 0, width, height).data;
  const points = [];
  for (let y = 0; y < height; y += 3) {
    for (let x = 0; x < width; x += 3) {
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
      const scale = 0.04; 
      const auraPts = await getPointsFromText("AURA", 280, 1000, 500, scale);
      const questionPts = await getPointsFromText("?", 380, 1000, 500, scale);
      if (!isMounted) return;
      
      const pos = new Float32Array(MAX_PARTICLES * 3);
      const t1 = new Float32Array(MAX_PARTICLES * 3);
      const t2 = new Float32Array(MAX_PARTICLES * 3);
      const rand = new Float32Array(MAX_PARTICLES);
      
      for (let i = 0; i < MAX_PARTICLES; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 60; pos[i * 3 + 1] = (Math.random() - 0.5) * 60; pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
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
      <shaderMaterial transparent={true} depthWrite={false} blending={THREE.AdditiveBlending} vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniformsRef.current} />
    </points>
  );
}

// ==========================================
// 3. MAIN COMPONENT (With Fixes)
// ==========================================
export default function ScrollDrivenMorph() {
  const mainRef = useRef<HTMLDivElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const heroHtmlRef = useRef<HTMLDivElement>(null);
  const whyAuraHtmlRef = useRef<HTMLDivElement>(null);
  const partnersTextRef = useRef<HTMLDivElement>(null);
  const leftWallRef = useRef<HTMLDivElement>(null);
  const rightWallRef = useRef<HTMLDivElement>(null);
  const videoCardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [isMobile, setIsMobile] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const loopLeft = [...leftLogos, ...leftLogos, ...leftLogos];
  const loopRight = [...rightLogos, ...rightLogos, ...rightLogos];
  
  const shaderUniforms = useRef({
    uProgress1: { value: 0 }, 
    uProgress2: { value: 0 },
    uProgress3: { value: 0 },
    uTime: { value: 0 },
    uColorCore: { value: new THREE.Color("#58A8B4") }, 
    uColorEdge: { value: new THREE.Color("#1E5D7B") }  
  });

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    if (!mainRef.current) return;
    
    gsap.to(shaderUniforms.current.uTime, { value: 100, duration: 150, repeat: -1, ease: "none" });

    const ctx = gsap.context(() => {
      // Increased scrub to 1.5 for a "heavier", more luxurious feel
      const tl = gsap.timeline({ scrollTrigger: { trigger: pinContainerRef.current, start: "top top", end: "+=7000", scrub: 1.5, pin: true } });
      
      // Phase 1: Hero to Aura
      tl.fromTo(shaderUniforms.current.uProgress1, { value: 0 }, { value: 1, duration: 15, ease: "power2.inOut" }, 0);
      tl.fromTo(heroHtmlRef.current, { opacity: 1, y: 0 }, { opacity: 0, y: -50, duration: 15, ease: "power2.inOut" }, 15);
      
      // Phase 2: Morph to ?
      tl.fromTo(shaderUniforms.current.uProgress2, { value: 0 }, { value: 1, duration: 15, ease: "power3.inOut" }, 15);
      
      // Phase 3: "Why Aura" appears
      tl.fromTo(canvasWrapperRef.current, { filter: "blur(0px)", opacity: 1 }, { filter: "blur(6px)", opacity: 0.8, duration: 15, ease: "power2.inOut" }, 30);
      tl.fromTo(whyAuraHtmlRef.current, { opacity: 0, y: 80 }, { opacity: 1, y: 0, duration: 15, ease: "expo.out" }, 30);
      
      // === CRITICAL FIX 1: Why Aura Fades OUT BEFORE Partners ===
      // Fade out "Why Aura" early (at duration 45-50) so it doesn't overlap
      tl.to(whyAuraHtmlRef.current, { opacity: 0, y: -50, duration: 10, ease: "power2.in" }, 45);

      // Phase 4: Particles Fly Up & Canvas Gone
      tl.fromTo(shaderUniforms.current.uProgress3, { value: 0 }, { value: 1, duration: 10, ease: "power2.in" }, 45);
      tl.to(canvasWrapperRef.current, { opacity: 0, duration: 10, ease: "power2.in" }, 45);
      
      // Phase 5: "Partners" Title Appears (After "Why Aura" is gone)
      tl.fromTo(partnersTextRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 10, ease: "power2.out" }, 55);
      
      // === CRITICAL FIX 2: Slow Down Logo Tunnel ===
      // Reduced yPercent to -30% and -40% (was -65/-80) for slower, smoother movement
      tl.fromTo(leftWallRef.current, { yPercent: 0 }, { yPercent: -30, duration: 50, ease: "none" }, 55);
      tl.fromTo(rightWallRef.current, { yPercent: 0 }, { yPercent: -40, duration: 50, ease: "none" }, 55);

      // Section Title Entrance (Static section below)
      gsap.fromTo(".work-title-text", { y: "120%" }, { y: "0%", duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".work-section", start: "top 80%" } });

      videoCardsRef.current.forEach((card, index) => {
        if (!card) return;
        gsap.fromTo(card, 
          { y: 50, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.8, 
            delay: index * 0.1, 
            ease: "power2.out", 
            scrollTrigger: { trigger: card, start: "top 90%" } 
          }
        );
      });

    }, mainRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="bg-[#F8FAFC]">
      
      {/* 1. PINNED HERO (Added margin bottom for separation) */}
      <div ref={pinContainerRef} className="relative h-screen w-full overflow-hidden mb-[10vh]">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#58A8B4]/20 blur-[120px] rounded-full z-0 pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#438FB3]/10 blur-[120px] rounded-full z-0 pointer-events-none" />
        
        <div ref={heroHtmlRef} className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 pointer-events-none">
          <h1 className="text-6xl md:text-8xl font-black text-[#0F172A] text-center leading-tight drop-shadow-sm">
            نصنع لك <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#58A8B4] to-[#438FB3]">هالتك الفارقة</span>
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-[#B3B7C1] max-w-2xl text-center leading-relaxed font-bold">
            حيث يلتقي سحر التصميم بدقة الذكاء الاصطناعي والبيانات.. لنبني لك حضوراً رقمياً لا يُنسى.
          </p>
        </div>
        
        <div ref={canvasWrapperRef} className="absolute inset-0 z-15 pointer-events-none" style={{ willChange: "opacity, transform, filter" }}>
          <Canvas camera={{ position: [0, 0, 15], fov: 45 }} dpr={[1, 2]}>
            <Center scale={isMobile ? 0.25 : 0.4}>
              <MorphParticles uniformsRef={shaderUniforms} />
            </Center>
          </Canvas>
        </div>
        
        {/* Why Aura & Partners Title Container */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none px-6">
          <div ref={whyAuraHtmlRef} className="opacity-0 absolute">
            <h2 className="text-5xl md:text-8xl font-black text-[#0F172A] text-center leading-tight drop-shadow-sm">
              لماذا <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#58A8B4] to-[#438FB3]">أورا؟</span>
            </h2>
          </div>
          
          <div ref={partnersTextRef} className="opacity-0 absolute">
               <h3 className="text-3xl md:text-5xl font-bold text-[#B3B7C1] text-center drop-shadow-sm">
                 شركاء النجاح والثقة
               </h3>
          </div>
        </div>

        <div className="absolute inset-0 z-10 pointer-events-none" style={{ maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)", WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)" }}>
          <div ref={leftWallRef} className="absolute left-0 md:left-[5%] top-0 w-[30%] md:w-[25%] flex flex-col items-center">
            <div className="h-[100vh] shrink-0" />
            {loopLeft.map((url, idx) => (
              <img key={`left-${idx}`} src={url} alt={`Client ${idx}`} className="w-12 md:w-20 lg:w-28 h-auto object-contain my-8 md:my-16 grayscale opacity-30 transition-all duration-500 hover:grayscale-0 hover:opacity-100" />
            ))}
          </div>
          <div ref={rightWallRef} className="absolute right-0 md:right-[5%] top-0 w-[30%] md:w-[25%] flex flex-col items-center">
             <div className="h-[110vh] shrink-0" />
            {loopRight.map((url, idx) => (
              <img key={`right-${idx}`} src={url} alt={`Client ${idx}`} className="w-12 md:w-20 lg:w-28 h-auto object-contain my-12 md:my-20 grayscale opacity-30 transition-all duration-500 hover:grayscale-0 hover:opacity-100" />
            ))}
          </div>
        </div>
      </div>

      {/* 2. THE COMPACT VIDEO GALLERY (Fix: Cinematic Height) */}
      <div className="work-section relative w-full min-h-screen py-32 px-6 md:px-12 z-30 bg-[#F8FAFC] overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-[10%] right-[-10%] w-[700px] h-[700px] bg-[#58A8B4]/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-[#438FB3]/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          
          <div className="mb-16 text-center">
            <div className="overflow-hidden inline-block pb-4">
              <h2 className="work-title-text text-4xl md:text-6xl lg:text-7xl font-black text-[#0F172A] leading-tight" style={{ willChange: "transform" }}>
                لم نكتفِ بالتنظير..<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#58A8B4] to-[#438FB3]">
                  بل صنعنا هالاتٍ تضيء أسواقها.
                </span>
              </h2>
            </div>
          </div>

          {/* GRID LAYOUT */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div 
                key={project.id} 
                ref={(el) => { videoCardsRef.current[index] = el; }}
                onClick={() => setSelectedVideo(project.video)}
                // === CRITICAL FIX 3: Cinematic Card Height ===
                // Changed aspect-[4/3] to aspect-video & added min-h-[500px]
                className="relative w-full aspect-video min-h-[500px] rounded-[2rem] overflow-hidden shadow-sm border border-white/50 group cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 bg-white/40 backdrop-blur-sm"
              >
                <div className="absolute inset-0 overflow-hidden">
                  <video 
                    autoPlay 
                    muted 
                    loop 
                    playsInline 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  >
                    <source src={project.video} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/20 backdrop-blur-md rounded-full p-4">
                      <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 left-4">
                  <div className="glass-capsule p-4 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 shadow-lg">
                    <p className="text-[#58A8B4] font-bold text-xs mb-1">{project.category}</p>
                    <h3 className="text-white text-lg font-black leading-tight line-clamp-1">{project.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* 3. LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 md:p-10"
            onClick={() => setSelectedVideo(null)}
          >
            <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-50">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-full max-w-6xl aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black"
              onClick={(e) => e.stopPropagation()}
            >
              <video 
                src={selectedVideo} 
                className="w-full h-full object-contain" 
                controls 
                autoPlay 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
EOF
