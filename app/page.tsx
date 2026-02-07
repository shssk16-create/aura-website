'use client';

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, useMotionValue, AnimatePresence } from 'framer-motion';
import { 
  ArrowUpRight, Megaphone, PenTool, Share2, Search, Palette, 
  ShoppingBag, Plus, Crosshair, Rocket, Menu, X
} from 'lucide-react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// --- تسجيل GSAP ---
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// --- CSS Styles (Pure CSS - No Tailwind) ---
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
    --secondary: #5fc2d0;
    --white: #ffffff;
    --border-color: rgba(255, 255, 255, 0.08);
    --padding-section: 6rem 1.5rem;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background-color: var(--bg-dark);
    color: var(--white);
    font-family: 'DIN Next LT Arabic', 'Readex Pro', sans-serif;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    direction: rtl;
  }

  /* Typography */
  h1, h2, h3 { font-weight: 700; line-height: 1.2; margin: 0; }
  h1 { font-size: clamp(2.5rem, 8vw, 5.5rem); }
  h2 { font-size: clamp(2rem, 5vw, 4rem); }
  h3 { font-size: clamp(1.25rem, 3vw, 1.75rem); }
  p { font-size: clamp(0.9rem, 2vw, 1.1rem); line-height: 1.8; color: #94a3b8; margin: 0; }

  /* Utilities */
  .text-gradient {
    background: linear-gradient(to left, var(--secondary), var(--primary));
    -webkit-background-clip: text; background-clip: text; color: transparent;
  }

  .container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; position: relative; }
  .absolute-fill { position: absolute; inset: 0; }
  .flex-center { display: flex; align-items: center; justify-content: center; }

  /* Navbar */
  .navbar {
    position: fixed; top: 0; left: 0; width: 100%; z-index: 1000;
    padding: 1.5rem 0; transition: all 0.4s ease;
  }
  .navbar.scrolled {
    padding: 1rem 0; background: rgba(5, 6, 7, 0.85);
    backdrop-filter: blur(12px); border-bottom: 1px solid var(--border-color);
  }
  .nav-content { display: flex; justify-content: space-between; align-items: center; }
  .nav-links-desktop { display: none; gap: 2.5rem; }
  .nav-link { cursor: pointer; opacity: 0.8; transition: 0.3s; }
  .nav-link:hover { opacity: 1; color: var(--primary); }

  .nav-btn {
    padding: 0.6rem 1.2rem; background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.1); border-radius: 99px;
    color: white; cursor: pointer; transition: 0.3s; white-space: nowrap;
    font-family: inherit; font-size: 0.9rem;
  }
  .nav-btn:hover { background: var(--primary); border-color: var(--primary); }
  .mobile-toggle-btn { background: transparent; border: none; color: white; cursor: pointer; display: flex; }

  /* Mobile Menu */
  .mobile-menu-overlay {
    position: fixed; inset: 0; background: var(--bg-dark); z-index: 999;
    display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 2rem;
  }
  .mobile-link { font-size: 2rem; font-weight: bold; color: white; cursor: pointer; }

  /* Preloader */
  .preloader {
    position: fixed; inset: 0; z-index: 10000; background: var(--bg-dark);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
  }
  .preloader-text { font-size: 15vw; font-weight: 700; opacity: 0.2; font-variant-numeric: tabular-nums; }

  /* Marquee */
  .marquee-section { padding: 3rem 0; background: var(--bg-dark); overflow: hidden; border-top: 1px solid var(--border-color); }
  .marquee-content { display: flex; gap: 3rem; min-width: 100%; }
  .marquee-item { font-size: clamp(1.5rem, 4vw, 2.5rem); font-weight: 700; color: rgba(255,255,255,0.15); white-space: nowrap; }

  /* Process Section */
  .process-section { padding: var(--padding-section); overflow: hidden; }
  .process-timeline { position: relative; max-width: 800px; margin: 0 auto; }
  .process-line { position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; background: rgba(67, 144, 179, 0.3); transform: translateX(-50%); }
  .process-step { display: flex; justify-content: center; align-items: center; margin-bottom: 4rem; position: relative; }
  .process-content { width: 40%; padding: 1.5rem; background: rgba(255,255,255,0.03); border-radius: 1rem; border: 1px solid var(--border-color); transition: 0.3s; }
  .process-dot { position: absolute; left: 50%; transform: translateX(-50%); width: 1.2rem; height: 1.2rem; background: var(--bg-dark); border: 2px solid var(--primary); border-radius: 50%; z-index: 2; transition: 0.3s; }
  .process-dot.active { background: var(--primary); box-shadow: 0 0 15px var(--primary); }

  /* Services Grid */
  .services-section { padding: var(--padding-section); }
  .bento-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
  .bento-card { padding: 1.5rem; border-radius: 1.5rem; border: 1px solid var(--border-color); background: #0F1115; transition: transform 0.3s; display: flex; flex-direction: column; gap: 1rem; }
  .bento-card:hover { transform: translateY(-5px); border-color: var(--primary); }
  .icon-box { padding: 0.5rem; background: rgba(67,144,179,0.2); border-radius: 0.5rem; color: #5fc2d0; width: fit-content; }
  .card-header { display: flex; justify-content: space-between; align-items: flex-start; }

  /* Works Horizontal Scroll */
  .works-section { height: 100vh; overflow: hidden; display: flex; align-items: center; position: relative; background: #050607; }
  .works-container { display: flex; gap: 2rem; padding: 0 5vw; width: max-content; flex-direction: row-reverse; }
  .work-card { position: relative; border-radius: 1.5rem; overflow: hidden; border: 1px solid var(--border-color); flex-shrink: 0; width: 85vw; height: 50vh; }
  .work-image { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; }
  .work-overlay { position: absolute; bottom: 0; right: 0; width: 100%; padding: 1.5rem; background: linear-gradient(to top, rgba(0,0,0,0.9), transparent); text-align: right; }

  /* FAQ */
  .faq-section { padding: var(--padding-section); max-width: 800px; margin: 0 auto; }
  .faq-item { border-bottom: 1px solid var(--border-color); }
  .faq-trigger { width: 100%; padding: 1.5rem 0; display: flex; justify-content: space-between; align-items: center; background: none; border: none; color: white; cursor: pointer; text-align: right; font-family: inherit; }

  /* Footer */
  footer { padding: 4rem 1.5rem; border-top: 1px solid var(--border-color); text-align: center; }
  .footer-content { display: flex; flex-direction: column; align-items: center; gap: 2rem; }

  /* Custom Cursor */
  .custom-cursor { position: fixed; top: 0; left: 0; width: 30px; height: 30px; background: white; border-radius: 50%; mix-blend-mode: difference; pointer-events: none; z-index: 9999; transform: translate(-50%, -50%); display: none; }

  /* Glass Card */
  .glass-card { background: rgba(15, 17, 21, 0.7); padding: clamp(1.5rem, 5vw, 3rem); border-radius: 1.5rem; backdrop-filter: blur(16px); border: 1px solid rgba(67, 144, 179, 0.15); max-width: 800px; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.5); }

  /* Responsive */
  @media (min-width: 768px) {
    .nav-links-desktop { display: flex; }
    .mobile-toggle-btn { display: none; }
    .bento-grid { grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
    .col-span-2 { grid-column: span 2; }
    .work-card { width: clamp(400px, 45vw, 600px); height: 60vh; }
    .process-step:nth-child(odd) { flex-direction: row; }
    .process-step:nth-child(even) { flex-direction: row-reverse; }
    .process-step:nth-child(odd) .process-content { text-align: left; }
    .process-step:nth-child(even) .process-content { text-align: right; }
    .footer-content { flex-direction: row; justify-content: space-between; width: 100%; }
    footer { text-align: right; }
  }
  @media (min-width: 1024px) {
    .bento-grid { grid-template-columns: repeat(3, 1fr); }
    .work-card { width: 35vw; height: 70vh; }
  }
  @media (max-width: 767px) {
    .process-line { right: 20px; left: auto; transform: none; }
    .process-step { justify-content: flex-start; margin-right: 20px; padding-right: 2rem; flex-direction: column; align-items: flex-start; }
    .process-dot { right: -6px; left: auto; transform: none; }
    .process-content { width: 100%; margin-top: 1rem; }
  }
  @media (pointer: fine) { .custom-cursor { display: block; } }
`;

// --- Helpers & Shaders ---
const generateTextPoints = (text: string, particleCount: number, widthFactor: number) => {
  if (typeof document === 'undefined') return new Float32Array(particleCount * 3);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return new Float32Array(particleCount * 3);
  
  const w = 1000; const h = 500;
  canvas.width = w; canvas.height = h;
  ctx.fillStyle = 'black'; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = 'white'; 
  ctx.font = '900 150px "DIN Next LT Arabic", sans-serif'; 
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; 
  ctx.fillText(text, w / 2, h / 2);

  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;
  const validPixels = [];
  
  const step = 4;
  for (let y = 0; y < h; y += step) { 
    for (let x = 0; x < w; x += step) {
      if (data[(y * w + x) * 4] > 100) { 
        validPixels.push({ x: (x / w - 0.5) * widthFactor, y: -(y / h - 0.5) * 20 }); 
      }
    }
  }
  
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const pixel = validPixels[i % validPixels.length];
    if (pixel) { positions[i*3] = pixel.x; positions[i*3+1] = pixel.y; positions[i*3+2] = 0; }
  }
  return positions;
};

const particleVertexShader = `
  uniform float uTime; uniform float uProgress; uniform vec2 uMouse;
  attribute vec3 aRandomPos; attribute vec3 aTargetPos; attribute float aSize;
  varying float vAlpha; varying vec3 vPos;
  // Simplex Noise
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
    float n_ = 0.142857142857; vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z); vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy; vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy); vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0; vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy; vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x); vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z); vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  void main() {
    float t = uProgress;
    float ease = 1.0 - pow(1.0 - t, 3.0);
    vec3 p = aRandomPos;
    float wave = sin(p.x * 0.1 + uTime * 0.5) * 5.0;
    vec3 auroraPos = p + vec3(0.0, wave, sin(p.z * 0.2 + uTime * 0.2) * 4.0);
    auroraPos += snoise(p * 0.1 + vec3(0.0, uTime * 0.2, 0.0)) * 2.0;
    vec3 finalPos = mix(auroraPos, aTargetPos, ease);
    
    vec3 mouseWorld = vec3(uMouse.x * 40.0, uMouse.y * 20.0, 0.0); 
    float dist = distance(finalPos, mouseWorld);
    if (dist < 6.0) {
      vec3 dir = normalize(finalPos - mouseWorld);
      finalPos += dir * ((6.0 - dist) / 6.0) * 1.5 * ease; 
    }
    vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = (aSize * 3.5) * (1.0 + ease * 0.5) * (20.0 / -mvPosition.z);
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

// --- Components ---

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navLinks = ['الرئيسية', 'خدماتنا', 'أعمالنا', 'من نحن'];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav className={`navbar ${scrolled ? 'scrolled' : ''}`} initial={{ y: -100 }} animate={{ y: 0 }}>
        <div className="container nav-content">
          <div className="flex-center" style={{ gap: '0.5rem', zIndex: 1001 }}>
            <div style={{ width: '10px', height: '10px', background: '#4390b3', borderRadius: '50%', boxShadow: '0 0 10px #4390b3' }}></div>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>AURA</span>
          </div>
          
          <div className="nav-links-desktop">
             {navLinks.map((link, i) => <a key={i} className="nav-link">{link}</a>)}
          </div>
          
          <div className="flex-center" style={{ gap: '1rem', zIndex: 1001 }}>
            <button className="nav-btn" style={{ display: 'none' }}>ابدأ مشروعك</button>
            <button className="mobile-toggle-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div className="mobile-menu-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {navLinks.map((link, i) => (
              <motion.a key={i} className="mobile-link" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} 
                onClick={() => setMobileMenuOpen(false)}>
                {link}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const CustomCursor = () => {
  const mouseX = useMotionValue(-100); const mouseY = useMotionValue(-100);
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia("(pointer: coarse)").matches) return;
    const move = (e: MouseEvent) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);
  
  return (
    <motion.div className="custom-cursor" style={{ x: mouseX, y: mouseY }} />
  );
};

const Preloader = ({ onComplete }: any) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 8;
      if (current >= 100) { setCount(100); clearInterval(interval); setTimeout(onComplete, 500); } 
      else { setCount(Math.floor(current)); }
    }, 50);
    return () => clearInterval(interval);
  }, []);
  return (
    <motion.div className="preloader" exit={{ y: "-100%", transition: { duration: 0.8, ease: "easeInOut" } }}>
      <div className="preloader-text">{count}%</div>
    </motion.div>
  );
};

const ClientsMarquee = () => {
    const logos = ["أرامكو", "وتد", "أساس", "نيوم", "مسك", "وزارة الثقافة", "الهيئة الملكية", "البحر الأحمر"];
    return (
        <div className="marquee-section">
            <motion.div className="marquee-content" animate={{ x: ["0%", "100%"] }} transition={{ repeat: Infinity, ease: "linear", duration: 30 }} style={{ direction: 'ltr' }}>
                {[...logos, ...logos, ...logos].map((client, i) => <div key={i} className="marquee-item">{client}</div>)}
            </motion.div>
        </div>
    );
};

const ProcessSection = () => {
    const containerRef = useRef(null);
    const steps = [
        { title: "الاكتشاف", desc: "تحليل وفهم عميق للعلامة.", icon: Search },
        { title: "التخطيط", desc: "رسم خارطة طريق دقيقة.", icon: Crosshair },
        { title: "التصميم", desc: "بناء تجربة بصرية متكاملة.", icon: Palette },
        { title: "الإطلاق", desc: "تقديم هويتك للعالم.", icon: Rocket }
    ];
    const [active, setActive] = useState(0);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top center",
                end: "bottom center",
                onUpdate: (self) => setActive(Math.floor(self.progress * steps.length))
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="process-section container">
            <h2 style={{ textAlign:'center', marginBottom: '3rem' }}>رحلة الإبداع</h2>
            <div className="process-timeline">
                <div className="process-line"></div>
                {steps.map((step, i) => (
                    <div key={i} className="process-step">
                        <div className={`process-dot ${i <= active ? 'active' : ''}`}></div>
                        <div className="process-content" style={{ opacity: i <= active ? 1 : 0.3 }}>
                            <div style={{display:'flex', alignItems:'center', gap:'1rem', marginBottom:'0.5rem'}}>
                                <step.icon size={24} color="#4390b3" />
                                <h3>{step.title}</h3>
                            </div>
                            <p>{step.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ServicesSection = () => {
    const services = [
        { id: 1, title: "الإعلانات", icon: Megaphone, colSpan: "col-span-2", bg: "linear-gradient(135deg, #1A1D24, #0A0C10)" },
        { id: 2, title: "المحتوى", icon: PenTool, colSpan: "", bg: "#0F1115" },
        { id: 3, title: "التواصل", icon: Share2, colSpan: "", bg: "#0F1115" },
        { id: 4, title: "SEO", icon: Search, colSpan: "", bg: "#0F1115" },
        { id: 5, title: "الهوية", icon: Palette, colSpan: "col-span-2", bg: "linear-gradient(135deg, #1A1D24, #0A0C10)" },
        { id: 6, title: "المتاجر", icon: ShoppingBag, colSpan: "", bg: "#0F1115" }
    ];
    return (
        <div className="services-section container">
            <h2 style={{textAlign:'center', marginBottom:'3rem'}}>خدماتنا</h2>
            <div className="bento-grid">
                {services.map((s) => (
                    <div key={s.id} className={`bento-card ${s.colSpan}`} style={{background: s.bg}}>
                        <div className="card-header">
                            <div className="icon-box"><s.icon size={24}/></div>
                            <ArrowUpRight size={20} color="#666"/>
                        </div>
                        <h3>{s.title}</h3>
                    </div>
                ))}
                <div className="bento-card flex-center" style={{background:'linear-gradient(135deg, #4390b3, #2C6E8F)'}}>
                    <h3>اطلب خدمتك</h3>
                </div>
            </div>
        </div>
    );
};

const WorksSection = () => {
    const triggerRef = useRef(null); const containerRef = useRef(null);
    const projects = [
        { id: 1, title: "العلا", img: "https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?q=80&w=1000" },
        { id: 2, title: "نيوم", img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=1000" },
        { id: 3, title: "مكة", img: "https://images.unsplash.com/photo-1558231294-8777990176dc?q=80&w=1000" },
        { id: 4, title: "الرياض", img: "https://images.unsplash.com/photo-1596707328659-56540c490a6c?q=80&w=1000" },
    ];
    
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const el = containerRef.current as HTMLElement | null;
            if (el) {
                const moveDist = el.scrollWidth - window.innerWidth;
                gsap.to(el, { 
                    x: moveDist, 
                    ease: "none", 
                    scrollTrigger: { 
                        trigger: triggerRef.current, 
                        pin: true, 
                        scrub: 1, 
                        end: "+=300%" 
                    }
                });
            }
        }, triggerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={triggerRef} className="works-section">
            <div className="container" style={{position:'absolute', top:'2rem', right:'0', zIndex:40}}><h2>أعمالنا</h2></div>
            <div ref={containerRef} className="works-container">
                {projects.map((p) => (
                    <div key={p.id} className="work-card">
                        <img src={p.img} alt={p.title} className="work-image"/>
                        <div className="work-overlay">
                            <h3>{p.title}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const FAQSection = () => {
    const [open, setOpen] = useState<number | null>(null);
    const faqs = [{q:"كيف نبدأ؟", a:"تواصل معنا وسنحدد جلسة استكشافية."}, {q:"المدة؟", a:"حسب حجم المشروع، غالباً 3-5 أسابيع."}];
    return (
        <div className="faq-section">
            <h2 style={{textAlign:'center', marginBottom:'3rem'}}>الأسئلة</h2>
            {faqs.map((f, i) => (
                <div key={i} className={`faq-item`}>
                    <button onClick={()=>setOpen(open===i?null:i)} className="faq-trigger">
                        <span style={{fontWeight:'bold', fontSize:'1.2rem'}}>{f.q}</span>
                        <Plus style={{transform: open===i?'rotate(45deg)':'rotate(0)', transition:'0.3s'}}/>
                    </button>
                    <AnimatePresence>
                        {open===i && <motion.div initial={{height:0}} animate={{height:'auto'}} exit={{height:0}} style={{overflow:'hidden', color:'#94a3b8', paddingBottom:'1.5rem'}}>{f.a}</motion.div>}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );
}

const AuraScene = () => {
    const canvasRef = useRef(null); const pinRef = useRef(null); const wrapRef = useRef(null);
    
    useLayoutEffect(() => {
        if (!canvasRef.current) return;
        
        let width = window.innerWidth;
        let height = window.innerHeight;
        const isMobile = width < 768;
        const particleCount = isMobile ? 6000 : 20000;
        const widthFactor = isMobile ? 20 : 40;

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x050607, 0.02);
        const camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);
        camera.position.set(0, 0, isMobile ? 50 : 30);
        
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: !isMobile });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const geometry = new THREE.BufferGeometry();
        const pos = new Float32Array(particleCount * 3);
        const randPos = new Float32Array(particleCount * 3);
        const targetPos = generateTextPoints("AURA", particleCount, widthFactor);
        const size = new Float32Array(particleCount);
        
        for(let i=0; i<particleCount; i++){
            randPos[i*3] = (Math.random()-0.5)*70; 
            randPos[i*3+1] = (Math.random()-0.5)*30; 
            randPos[i*3+2] = (Math.random()-0.5)*20;
            size[i] = Math.random()*2.0 + 0.5;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geometry.setAttribute('aRandomPos', new THREE.BufferAttribute(randPos, 3));
        geometry.setAttribute('aTargetPos', new THREE.BufferAttribute(targetPos, 3));
        geometry.setAttribute('aSize', new THREE.BufferAttribute(size, 1));

        const mat = new THREE.ShaderMaterial({
            vertexShader: particleVertexShader,
            fragmentShader: particleFragmentShader,
            uniforms: {
                uTime: {value:0}, uProgress: {value:0}, uMouse: {value: new THREE.Vector2(999,999)},
                uColorPrimary: {value: new THREE.Color('#4390b3')}, uColorAurora: {value: new THREE.Color('#0047AB')}
            },
            transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
        });
        const particles = new THREE.Points(geometry, mat);
        scene.add(particles);

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ scrollTrigger: { trigger: pinRef.current, start: "top top", end: "+=300%", scrub: 1, pin: true } });
            
            tl.to(mat.uniforms.uProgress, { value: 1, duration: 5 }, 0);
            tl.to(camera.position, { z: isMobile ? 60 : 40, duration: 5 }, 0);
            
            tl.to(".hero-text", { opacity: 0, scale: 0.9, duration: 1 }, 0);
            
            tl.fromTo(".intro-text", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 2 }, 1);
            tl.to(".intro-text", { opacity: 0, duration: 1 }, 3);
            
            tl.fromTo(".difference-section", 
                { opacity: 0, y: 30, scale: 0.95 }, 
                { opacity: 1, y: 0, scale: 1, visibility: 'visible', duration: 2, ease: "power2.out" }, 
            4);

        }, wrapRef);

        const clock = new THREE.Clock();
        const mouse = new THREE.Vector2(0,0);
        const onMove = (e: MouseEvent) => { mouse.x = (e.clientX/width)*2-1; mouse.y = -(e.clientY/height)*2+1; };
        const onResize = () => {
            width = window.innerWidth; height = window.innerHeight;
            camera.aspect = width/height; camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };
        
        window.addEventListener('mousemove', onMove);
        window.addEventListener('resize', onResize);
        let req: number;
        const animate = () => {
            const t = clock.getElapsedTime(); 
            mat.uniforms.uTime.value = t; 
            mat.uniforms.uMouse.value.lerp(mouse, 0.1);
            renderer.render(scene, camera); 
            req = requestAnimationFrame(animate);
        };
        animate();
        
        return () => { 
            window.removeEventListener('mousemove', onMove); 
            window.removeEventListener('resize', onResize);
            cancelAnimationFrame(req); ctx.revert(); renderer.dispose(); 
        };
    }, []);

    return (
        <div ref={wrapRef}>
            <div ref={pinRef} style={{height:'100vh', background:'#050607', position:'relative', overflow:'hidden'}}>
                <canvas ref={canvasRef} className="absolute-fill" style={{position:'absolute', inset:0, zIndex:1}}/>
                
                <div className="absolute-fill flex-center" style={{zIndex:10, pointerEvents:'none'}}>
                    
                    <div className="hero-text" style={{textAlign:'center', padding:'1rem'}}>
                        <h1 style={{marginBottom:'1rem', textShadow:'0 0 20px black'}}>من شتات <span className="text-gradient">الفضاء</span></h1>
                        <p style={{color:'#cbd5e1'}}>نشكل هالتك الفارقة</p>
                    </div>

                    <div className="intro-text" style={{position:'absolute', opacity:0, textAlign:'center', width: '100%'}}>
                        <h2>هالتك <span style={{color:'#4390b3'}}>الفارقة</span></h2>
                    </div>

                    <div className="difference-section flex-center" style={{
                        position:'absolute', opacity:0, visibility:'hidden', pointerEvents:'auto', padding:'1rem', width: '100%'
                    }}>
                         <div className="glass-card">
                            <h2 style={{marginBottom:'1rem', color: '#4390b3'}}>نصنع الفارق</h2>
                            <p style={{marginBottom: '2rem', color:'#e2e8f0'}}>
                                نحن لا نقدم مجرد خدمات، بل نبني منظومة رقمية متكاملة. ندمج الفن بالبيانات لنخلق تجربة تلامس الشعور وتخاطب العقل.
                            </p>
                            
                            <div style={{width: '50px', height: '2px', background: 'rgba(255,255,255,0.1)', margin: '0 auto 2rem auto'}}></div>

                            <h3 style={{marginBottom: '0.5rem', color: 'white'}}>رسالتنا الجوهرية</h3>
                            <p style={{color: '#94a3b8'}}>
                                أن نكون الشريك الاستراتيجي الذي ينقل طموحك من حيز التفكير.
                            </p>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Page ---
export default function AuraWebsite() {
    const [loading, setLoading] = useState(true);
    return (
        <div className="main-wrapper">
            <style dangerouslySetInnerHTML={{ __html: styles }} />
            <AnimatePresence mode="wait">
                {loading && <Preloader onComplete={() => setLoading(false)} />}
            </AnimatePresence>
            {!loading && (
                <main>
                    <Navbar />
                    <CustomCursor />
                    <AuraScene />
                    <ClientsMarquee />
                    <ServicesSection />
                    <WorksSection />
                    <ProcessSection />
                    <FAQSection />
                    <footer className="container">
                        <div className="footer-content">
                            <div>
                              <h2>لنصنع شيئاً <span style={{color:'#4390b3'}}>استثنائياً</span></h2>
                              <button style={{marginTop:'1.5rem', padding:'1rem 2.5rem', background:'white', color:'black', borderRadius:'2rem', fontWeight:'bold', border:'none', cursor:'pointer'}}>تواصل معنا</button>
                            </div>
                            <div style={{color:'#666', fontSize:'0.9rem'}}>© 2025 AURA. جميع الحقوق محفوظة.</div>
                        </div>
                    </footer>
                </main>
            )}
        </div>
    );
}
