'use client';

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { 
  ArrowUpRight, Megaphone, PenTool, Share2, Search, Palette, 
  ShoppingBag, Plus, Crosshair, Rocket, Menu, X, ChevronDown, Globe, Zap 
} from 'lucide-react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// --- تسجيل GSAP ---
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// --- CSS Styles (World-Class Design System) ---
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Readex+Pro:wght@200;300;400;500;600;700&display=swap');

  /* خطوط DIN */
  @font-face {
    font-family: 'DIN Next LT Arabic';
    src: url('https://aurateam3.com/wp-content/uploads/2025/10/DINNextLTArabic-Regular.woff2') format('woff2');
    font-weight: 400; font-display: swap;
  }
  @font-face {
    font-family: 'DIN Next LT Arabic';
    src: url('https://aurateam3.com/wp-content/uploads/2025/10/DINNextLTArabic-Bold-2.woff2') format('woff2');
    font-weight: 700; font-display: swap;
  }

  :root {
    --bg-dark: #050607;
    --primary: #4390b3;
    --primary-glow: rgba(67, 144, 179, 0.5);
    --secondary: #5fc2d0;
    --white: #ffffff;
    --border-color: rgba(255, 255, 255, 0.08);
    --glass-border: rgba(255, 255, 255, 0.1);
    --padding-section: clamp(4rem, 10vw, 8rem) 1.5rem;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  body {
    background-color: var(--bg-dark);
    color: var(--white);
    font-family: 'DIN Next LT Arabic', 'Readex Pro', sans-serif;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    direction: rtl;
    selection-background: var(--primary);
    selection-color: white;
  }

  /* Typography */
  h1, h2, h3 { font-weight: 700; line-height: 1.1; margin: 0; letter-spacing: -0.02em; }
  h1 { font-size: clamp(3rem, 10vw, 6.5rem); }
  h2 { font-size: clamp(2rem, 5vw, 4rem); }
  h3 { font-size: clamp(1.25rem, 3vw, 1.75rem); }
  p { font-size: clamp(0.95rem, 2vw, 1.15rem); line-height: 1.8; color: #94a3b8; margin: 0; max-width: 60ch; }

  /* Utilities */
  .text-gradient {
    background: linear-gradient(135deg, #fff 0%, var(--primary) 100%);
    -webkit-background-clip: text; background-clip: text; color: transparent;
  }
  .container { max-width: 1400px; margin: 0 auto; padding: 0 clamp(1rem, 5vw, 3rem); position: relative; }
  .flex-center { display: flex; align-items: center; justify-content: center; }
  .absolute-fill { position: absolute; inset: 0; }

  /* --- World-Class Navbar (Glassmorphism) --- */
  .navbar {
    position: fixed; top: 0; left: 0; width: 100%; z-index: 1000;
    padding: 1.5rem 0; transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  }
  
  .navbar.scrolled {
    padding: 1rem 0;
    background: rgba(5, 6, 7, 0.65); /* شفافية داكنة */
    backdrop-filter: blur(20px) saturate(180%); /* تأثير الزجاج */
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  }

  .nav-link { 
    position: relative; cursor: pointer; opacity: 0.7; transition: 0.3s; font-weight: 500; font-size: 1.05rem; 
  }
  .nav-link::before {
    content: ''; position: absolute; bottom: -5px; left: 50%; transform: translateX(-50%);
    width: 0; height: 2px; background: var(--primary); transition: 0.4s ease;
  }
  .nav-link:hover { opacity: 1; color: white; }
  .nav-link:hover::before { width: 100%; }

  .nav-btn {
    padding: 0.75rem 1.75rem; background: rgba(255,255,255,0.05);
    border: 1px solid var(--glass-border); border-radius: 99px;
    color: white; cursor: pointer; transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    font-family: inherit; font-size: 0.95rem; font-weight: 600;
    position: relative; overflow: hidden;
  }
  .nav-btn::after {
    content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transform: translateX(-100%); transition: 0.5s;
  }
  .nav-btn:hover { 
    background: var(--primary); border-color: var(--primary); 
    box-shadow: 0 0 20px var(--primary-glow); transform: translateY(-2px);
  }
  .nav-btn:hover::after { transform: translateX(100%); }

  /* Mobile Menu */
  .mobile-menu {
    position: fixed; inset: 0; background: var(--bg-dark); z-index: 999;
    display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 2.5rem;
  }
  .mobile-link { font-size: 2.5rem; font-weight: 700; color: white; cursor: pointer; transition: 0.3s; }
  .mobile-link:hover { color: var(--primary); letter-spacing: 2px; }

  /* Hero Section */
  .hero-scroll-indicator {
    position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
    opacity: 0.6; animation: bounce 2s infinite;
  }
  @keyframes bounce { 0%, 20%, 50%, 80%, 100% {transform: translateX(-50%) translateY(0);} 40% {transform: translateX(-50%) translateY(-10px);} 60% {transform: translateX(-50%) translateY(-5px);} }

  /* Bento Grid (Services) */
  .bento-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
  .bento-card { 
    padding: 2rem; border-radius: 1.5rem; 
    border: 1px solid var(--border-color); background: linear-gradient(145deg, #0F1115, #08090b); 
    transition: all 0.4s ease; position: relative; overflow: hidden;
    display: flex; flex-direction: column; justify-content: space-between; min-height: 240px;
  }
  .bento-card:hover { transform: translateY(-8px); border-color: var(--primary); box-shadow: 0 10px 40px -10px rgba(0,0,0,0.5); }
  .bento-bg-icon { position: absolute; bottom: -20px; left: -20px; opacity: 0.05; transform: rotate(-15deg); transition: 0.5s; }
  .bento-card:hover .bento-bg-icon { transform: rotate(0deg) scale(1.1); opacity: 0.1; }

  /* Works (Horizontal) */
  .works-section { height: 300vh; /* For ScrollTrigger pinning */ position: relative; }
  .works-sticky-wrapper { height: 100vh; overflow: hidden; position: sticky; top: 0; display: flex; align-items: center; }
  .works-track { display: flex; gap: 4vw; padding: 0 5vw; will-change: transform; flex-direction: row-reverse; }
  .work-card { 
    position: relative; border-radius: 2rem; overflow: hidden; 
    border: 1px solid var(--border-color); flex-shrink: 0; 
    width: 60vw; height: 60vh; 
    transition: 0.5s; cursor: pointer;
  }
  .work-card:hover { transform: scale(0.98); border-color: var(--primary); }
  .work-img { width: 100%; height: 100%; object-fit: cover; transition: 0.7s; }
  .work-card:hover .work-img { transform: scale(1.1); }

  /* FAQ */
  .faq-item { border-bottom: 1px solid var(--border-color); transition: 0.3s; }
  .faq-item:hover { border-color: var(--primary); background: rgba(255,255,255,0.01); }
  .faq-trigger { width: 100%; padding: 2rem 1rem; display: flex; justify-content: space-between; align-items: center; background: none; border: none; color: white; cursor: pointer; text-align: right; }

  /* Footer */
  footer { padding: 5rem 0; border-top: 1px solid var(--border-color); background: radial-gradient(circle at 50% 0%, rgba(67, 144, 179, 0.1), transparent 70%); }

  /* Custom Cursor */
  .custom-cursor { 
    position: fixed; top: 0; left: 0; width: 20px; height: 20px; 
    background: var(--primary); border-radius: 50%; 
    pointer-events: none; z-index: 9999; transform: translate(-50%, -50%); 
    mix-blend-mode: difference; transition: width 0.3s, height 0.3s; 
  }

  /* Responsive */
  @media (min-width: 768px) {
    .bento-grid { grid-template-columns: repeat(2, 1fr); }
    .col-span-2 { grid-column: span 2; }
    .work-card { width: 35vw; height: 70vh; }
  }
  @media (min-width: 1024px) {
    .bento-grid { grid-template-columns: repeat(3, 1fr); }
  }
  @media (max-width: 767px) {
    .works-section { height: auto; }
    .works-sticky-wrapper { position: relative; height: auto; display: block; overflow: visible; }
    .works-track { flex-direction: column; transform: none !important; gap: 2rem; padding: 2rem 1rem; }
    .work-card { width: 100%; height: 50vh; }
    .hero-scroll-indicator { display: none; }
  }
`;

// --- THREE.js Shaders (Aurora Effect) ---
const particleVertexShader = `
  uniform float uTime; uniform float uProgress; uniform vec2 uMouse;
  attribute vec3 aRandomPos; attribute vec3 aTargetPos; attribute float aSize;
  varying float vAlpha; varying vec3 vPos;
  // Noise functions simplified for performance
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0); const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy)); vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz); vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy); vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx; vec3 x2 = x0 - i2 + C.yyy; vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    return 42.0 * dot(max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0) * max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0), vec4(dot(vec3(a0.xy, h.x),x0), dot(vec3(a0.zw, h.y),x1), dot(vec3(a1.xy, h.z),x2), dot(vec3(a1.zw, h.w),x3)));
    vec4 h = 1.0 - abs(x) - abs(y); vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy; vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  }
  void main() {
    float t = uProgress;
    float ease = 1.0 - pow(1.0 - t, 3.0);
    vec3 p = aRandomPos;
    vec3 auroraPos = p + vec3(0.0, sin(p.x * 0.1 + uTime * 0.5) * 5.0, sin(p.z * 0.2 + uTime * 0.2) * 4.0);
    vec3 finalPos = mix(auroraPos, aTargetPos, ease);
    // Mouse Interaction
    vec3 mouseWorld = vec3(uMouse.x * 40.0, uMouse.y * 20.0, 0.0); 
    float dist = distance(finalPos, mouseWorld);
    if (dist < 8.0) { finalPos += normalize(finalPos - mouseWorld) * ((8.0 - dist) / 8.0) * 2.0 * ease; }
    
    vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = (aSize * 4.0) * (1.0 + ease * 0.5) * (20.0 / -mvPosition.z);
    vAlpha = 0.4 + ease * 0.6; vPos = finalPos;
  }
`;
const particleFragmentShader = `
  uniform vec3 uColorPrimary; uniform vec3 uColorAurora; uniform float uProgress;
  varying float vAlpha; varying vec3 vPos;
  void main() {
    vec2 center = gl_PointCoord - 0.5;
    if (length(center) > 0.5) discard;
    float glow = exp(-length(center) * 4.0);
    float heightFactor = smoothstep(-10.0, 10.0, vPos.y);
    vec3 color = mix(mix(uColorAurora, uColorPrimary, heightFactor), vec3(1.0), uProgress);
    gl_FragColor = vec4(color, vAlpha * glow);
  }
`;

// --- Utility: Generate Text Points ---
const generateTextPoints = (text: string, particleCount: number, widthFactor: number) => {
  if (typeof document === 'undefined') return new Float32Array(particleCount * 3);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return new Float32Array(particleCount * 3);
  const w = 1000, h = 500;
  canvas.width = w; canvas.height = h;
  ctx.fillStyle = 'black'; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = 'white'; ctx.font = '900 150px "DIN Next LT Arabic", sans-serif'; 
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, w / 2, h / 2);
  const data = ctx.getImageData(0, 0, w, h).data;
  const validPixels = [];
  for (let y = 0; y < h; y += 4) { 
    for (let x = 0; x < w; x += 4) {
      if (data[(y * w + x) * 4] > 100) validPixels.push({ x: (x / w - 0.5) * widthFactor, y: -(y / h - 0.5) * 20 });
    }
  }
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const pixel = validPixels[i % validPixels.length];
    if (pixel) { positions[i*3] = pixel.x; positions[i*3+1] = pixel.y; positions[i*3+2] = 0; }
  }
  return positions;
};

// --- Components ---

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navLinks = ['الرئيسية', 'خدماتنا', 'أعمالنا', 'عن أورا'];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav className={`navbar ${scrolled ? 'scrolled' : ''}`} initial={{ y: -100 }} animate={{ y: 0 }} transition={{duration:0.8, ease:"easeOut"}}>
        <div className="container" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          {/* Logo */}
          <div className="flex-center" style={{ gap: '0.8rem', cursor:'pointer' }}>
             <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{ width: '28px', height: '28px', border: '2px solid #4390b3', borderRadius: '8px', position:'relative' }}>
                <div style={{position:'absolute', inset:'2px', background:'rgba(67, 144, 179, 0.3)'}} />
             </motion.div>
             <span style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.5px' }}>AURA</span>
          </div>
          
          {/* Desktop Menu */}
          <div className="flex-center" style={{ gap: '3rem', display: 'none', md: {display: 'flex'} }}>
             {navLinks.map((link, i) => (
                <a key={i} className="nav-link" style={{display: window.innerWidth > 768 ? 'block' : 'none'}}>{link}</a>
             ))}
          </div>
          
          {/* CTA & Toggle */}
          <div className="flex-center" style={{ gap: '1.5rem' }}>
            <button className="nav-btn" style={{display: window.innerWidth > 768 ? 'block' : 'none'}}>ابدأ مشروعك</button>
            <button style={{background:'none', border:'none', color:'white', cursor:'pointer', display: window.innerWidth <= 768 ? 'block' : 'none'}} onClick={() => setMobileMenuOpen(true)}>
                <Menu size={28} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div className="mobile-menu" initial={{ opacity: 0, clipPath: "circle(0% at 100% 0)" }} animate={{ opacity: 1, clipPath: "circle(150% at 100% 0)" }} exit={{ opacity: 0, clipPath: "circle(0% at 100% 0)" }} transition={{ duration: 0.5 }}>
            <button style={{position:'absolute', top:'2rem', left:'2rem', background:'none', border:'none', color:'white', cursor:'pointer'}} onClick={() => setMobileMenuOpen(false)}>
                <X size={32} />
            </button>
            {navLinks.map((link, i) => (
              <motion.a key={i} className="mobile-link" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 + (i * 0.1) }} onClick={() => setMobileMenuOpen(false)}>
                {link}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const HeroScene = () => {
    const canvasRef = useRef(null);
    useLayoutEffect(() => {
        if (!canvasRef.current) return;
        let w = window.innerWidth, h = window.innerHeight;
        const isMobile = w < 768;
        const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0x050607, 0.02);
        const camera = new THREE.PerspectiveCamera(45, w/h, 0.1, 1000);
        camera.position.set(0, 0, isMobile ? 50 : 35);
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: !isMobile });
        renderer.setSize(w, h); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const geometry = new THREE.BufferGeometry();
        const count = isMobile ? 5000 : 15000;
        const pos = new Float32Array(count * 3), rand = new Float32Array(count * 3), size = new Float32Array(count);
        const target = generateTextPoints("AURA", count, isMobile ? 20 : 40);
        for(let i=0; i<count; i++) {
            rand[i*3] = (Math.random()-0.5)*70; rand[i*3+1] = (Math.random()-0.5)*30; rand[i*3+2] = (Math.random()-0.5)*20;
            size[i] = Math.random()*2.0 + 0.5;
        }
        geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geometry.setAttribute('aRandomPos', new THREE.BufferAttribute(rand, 3));
        geometry.setAttribute('aTargetPos', new THREE.BufferAttribute(target, 3));
        geometry.setAttribute('aSize', new THREE.BufferAttribute(size, 1));

        const mat = new THREE.ShaderMaterial({
            vertexShader: particleVertexShader, fragmentShader: particleFragmentShader,
            uniforms: { uTime: {value:0}, uProgress: {value:0}, uMouse: {value: new THREE.Vector2(999,999)}, uColorPrimary: {value: new THREE.Color('#4390b3')}, uColorAurora: {value: new THREE.Color('#0047AB')} },
            transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
        });
        scene.add(new THREE.Points(geometry, mat));

        const tl = gsap.timeline({ scrollTrigger: { trigger: ".hero-section", start: "top top", end: "+=300%", scrub: 1, pin: true } });
        tl.to(mat.uniforms.uProgress, { value: 1, duration: 5 });
        tl.to(camera.position, { z: isMobile ? 70 : 50, duration: 5 }, 0);
        tl.to(".hero-content", { opacity: 0, scale: 0.9, duration: 1 }, 0);
        tl.fromTo(".intro-content", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 2 }, 1);

        const clock = new THREE.Clock(); const mouse = new THREE.Vector2(0,0);
        const onMove = (e: MouseEvent) => { mouse.x = (e.clientX/w)*2-1; mouse.y = -(e.clientY/h)*2+1; };
        window.addEventListener('mousemove', onMove);
        
        let req: number;
        const animate = () => {
            mat.uniforms.uTime.value = clock.getElapsedTime(); mat.uniforms.uMouse.value.lerp(mouse, 0.05);
            renderer.render(scene, camera); req = requestAnimationFrame(animate);
        };
        animate();
        return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(req); renderer.dispose(); };
    }, []);

    return (
        <div className="hero-section" style={{height:'100vh', position:'relative', overflow:'hidden'}}>
            <canvas ref={canvasRef} className="absolute-fill" style={{zIndex:1}}/>
            <div className="absolute-fill flex-center" style={{zIndex:10, pointerEvents:'none'}}>
                <div className="hero-content" style={{textAlign:'center', padding:'0 1rem'}}>
                    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:1 }}>
                        <div style={{display:'inline-block', padding:'0.5rem 1rem', background:'rgba(255,255,255,0.05)', borderRadius:'99px', border:'1px solid rgba(255,255,255,0.1)', marginBottom:'1.5rem'}}>
                            ✨ وكالة إبداعية رقمية
                        </div>
                    </motion.div>
                    <h1 style={{textShadow:'0 0 30px rgba(0,0,0,0.8)'}}>من شتات <span className="text-gradient">الفضاء</span></h1>
                    <p style={{marginTop:'1.5rem', fontSize:'1.2rem', color:'#cbd5e1'}}>نشكل هالتك الفارقة ونبني حضوراً لا ينسى</p>
                </div>
                
                <div className="intro-content" style={{position:'absolute', opacity:0, textAlign:'center', width:'100%', padding:'0 1rem'}}>
                    <Globe size={40} color="#4390b3" style={{marginBottom:'1rem'}} />
                    <h2>نصنع مستقبلك <span style={{color:'#4390b3'}}>الرقمي</span></h2>
                    <p>نحول الأفكار المعقدة إلى تجارب رقمية سلسة ومؤثرة.</p>
                </div>
            </div>
            
            <div className="hero-scroll-indicator">
                <span style={{fontSize:'0.8rem', letterSpacing:'1px'}}>اكتشف المزيد</span>
                <ChevronDown size={20} />
            </div>
        </div>
    );
};

const ServicesSection = () => {
    const services = [
        { title: "بناء العلامة", icon: Palette, desc: "هوية بصرية تخلد في الأذهان." },
        { title: "التسويق الرقمي", icon: Megaphone, desc: "نصل بصوتك للجمهور الصحيح." },
        { title: "تطوير الويب", icon: Globe, desc: "مواقع فائقة السرعة والتفاعل." },
        { title: "صناعة المحتوى", icon: PenTool, desc: "قصص تروى وتأثير يبقى." },
        { title: "تحسين المحركات", icon: Search, desc: "تصدر النتائج الأولى." },
        { title: "التجارة الإلكترونية", icon: ShoppingBag, desc: "متاجر تبيع 24/7." }
    ];
    return (
        <section className="container" style={{paddingTop:'8rem', paddingBottom:'8rem'}}>
            <div style={{textAlign:'center', marginBottom:'4rem'}}>
                <h2 style={{marginBottom:'1rem'}}>خدمات <span className="text-gradient">متكاملة</span></h2>
                <p style={{margin:'0 auto'}}>كل ما تحتاجه للنمو في العالم الرقمي تحت سقف واحد.</p>
            </div>
            <div className="bento-grid">
                {services.map((s, i) => (
                    <motion.div key={i} className={`bento-card ${i===0 || i===3 ? 'col-span-2' : ''}`} whileHover={{ y: -10 }}>
                        <s.icon size={40} strokeWidth={1.5} color={i===0 || i===3 ? "#4390b3" : "#fff"} className="bento-bg-icon" />
                        <div style={{marginBottom:'1.5rem'}}>
                            <div style={{width:'50px', height:'50px', background:'rgba(255,255,255,0.05)', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1rem'}}>
                                <s.icon size={24} color={i===0 || i===3 ? "#4390b3" : "#fff"} />
                            </div>
                            <h3>{s.title}</h3>
                        </div>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
                            <p style={{fontSize:'0.9rem', maxWidth:'80%'}}>{s.desc}</p>
                            <div style={{width:'30px', height:'30px', border:'1px solid rgba(255,255,255,0.2)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}>
                                <ArrowUpRight size={16} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

const WorksSection = () => {
    const container = useRef(null); const track = useRef(null);
    useLayoutEffect(() => {
        if(window.innerWidth < 768) return;
        const ctx = gsap.context(() => {
            const el = track.current as any;
            if(el) {
                gsap.to(el, {
                    x: () => el.scrollWidth - window.innerWidth,
                    ease: "none",
                    scrollTrigger: { trigger: container.current, pin: true, scrub: 1, end: "+=300%" }
                });
            }
        }, container);
        return () => ctx.revert();
    }, []);
    const works = [
        {title:"العلا", img:"https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?q=80&w=1000", cat:"سياحة"},
        {title:"نيوم", img:"https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=1000", cat:"تطوير عقاري"},
        {title:"مسك", img:"https://images.unsplash.com/photo-1596707328659-56540c490a6c?q=80&w=1000", cat:"مبادرة"},
        {title:"جدة", img:"https://images.unsplash.com/photo-1558231294-8777990176dc?q=80&w=1000", cat:"فعاليات"}
    ];
    return (
        <div ref={container} className="works-section">
            <div className="works-sticky-wrapper">
                <div style={{position:'absolute', top:'10%', right:'5%', zIndex:20}}>
                    <h2>أحدث <span className="text-gradient">الأعمال</span></h2>
                </div>
                <div ref={track} className="works-track">
                    {works.map((w, i) => (
                        <div key={i} className="work-card">
                            <img src={w.img} alt={w.title} className="work-img" />
                            <div style={{position:'absolute', bottom:0, right:0, width:'100%', padding:'2rem', background:'linear-gradient(to top, #050607, transparent)'}}>
                                <span style={{fontSize:'0.9rem', color:'#4390b3', fontWeight:'bold'}}>{w.cat}</span>
                                <h3>{w.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const FAQ = () => {
    const [open, setOpen] = useState<number | null>(0);
    const faqs = [
        {q:"كم يستغرق تنفيذ المشروع؟", a:"يعتمد على حجم المشروع، لكن المواقع التعريفية تستغرق عادة 2-4 أسابيع."},
        {q:"هل تقدمون دعم فني؟", a:"نعم، نقدم باقات صيانة ودعم فني لضمان استقرار موقعك 24/7."},
        {q:"كيف نبدأ؟", a:"تواصل معنا عبر الزر في الأسفل لتحديد جلسة استشارية مجانية."}
    ];
    return (
        <section className="container" style={{padding:'6rem 1.5rem', maxWidth:'800px'}}>
            <h2 style={{textAlign:'center', marginBottom:'3rem'}}>الأسئلة الشائعة</h2>
            {faqs.map((f, i) => (
                <div key={i} className="faq-item">
                    <button onClick={() => setOpen(open===i ? null : i)} className="faq-trigger">
                        <span style={{fontSize:'1.1rem', fontWeight:'600'}}>{f.q}</span>
                        <Plus style={{transform: open===i ? 'rotate(45deg)' : 'none', transition:'0.3s', color:'#4390b3'}} />
                    </button>
                    <AnimatePresence>
                        {open===i && (
                            <motion.div initial={{height:0, opacity:0}} animate={{height:'auto', opacity:1}} exit={{height:0, opacity:0}} style={{overflow:'hidden'}}>
                                <p style={{padding:'0 1rem 2rem 1rem', color:'#94a3b8'}}>{f.a}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </section>
    );
};

const Footer = () => (
    <footer>
        <div className="container" style={{textAlign:'center'}}>
            <h2 style={{fontSize:'3rem', marginBottom:'2rem'}}>جاهز لصناعة <span className="text-gradient">الفرق؟</span></h2>
            <button className="nav-btn" style={{padding:'1rem 3rem', fontSize:'1.1rem', background:'white', color:'black', borderColor:'white'}}>تواصل معنا الآن</button>
            <div style={{marginTop:'4rem', display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem', borderTop:'1px solid rgba(255,255,255,0.05)', paddingTop:'2rem'}}>
                <span style={{color:'#666'}}>© 2026 AURA. All rights reserved.</span>
                <div style={{display:'flex', gap:'1.5rem'}}>
                    {['Instagram', 'Twitter', 'LinkedIn'].map(s => <span key={s} style={{cursor:'pointer', color:'#666', transition:'0.3s'}}>{s}</span>)}
                </div>
            </div>
        </div>
    </footer>
);

const CustomCursor = () => {
    const mouseX = useMotionValue(-100); const mouseY = useMotionValue(-100);
    useEffect(() => {
        if (typeof window === 'undefined' || window.matchMedia("(pointer: coarse)").matches) return;
        const move = (e: MouseEvent) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
        window.addEventListener('mousemove', move); return () => window.removeEventListener('mousemove', move);
    }, []);
    return <motion.div className="custom-cursor" style={{ x: mouseX, y: mouseY }} />;
};

export default function AuraWebsite() {
    return (
        <div className="main-wrapper">
            <style dangerouslySetInnerHTML={{ __html: styles }} />
            <CustomCursor />
            <Navbar />
            <main>
                <HeroScene />
                <ServicesSection />
                <WorksSection />
                <FAQ />
            </main>
            <Footer />
        </div>
    );
}
