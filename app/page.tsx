'use client';

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * AURA DIGITAL AGENCY - SERVER CERTIFIED EDITION (v15.0 - STABLE)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * * [FIX LOG]
 * * 1. FIXED MISSING IMPORTS: Added 'TrendingUp', 'Layers', 'Zap', etc.
 * * 2. STABILITY: Added strict Type Guards for window and DOM elements.
 * * 3. STYLE ENGINE: Integrated internal CSS to guarantee UI consistency.
 * * 4. PERFORMANCE: Optimized 3D loop for server environments.
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { useState, useEffect, useRef, useLayoutEffect, FormEvent } from 'react';
import { 
  motion, AnimatePresence, useScroll, useTransform 
} from 'framer-motion';
// --- FIXED: ALL ICONS IMPORTED CORRECTLY ---
import { 
  ArrowUpRight, Palette, Search, ShoppingBag, Menu, X,
  Megaphone, CheckCircle, Shield, Star, Code, Smartphone,
  Phone, Mail, MapPin, Zap, Send, Layout, BarChart, Users,
  Globe, Lightbulb, TrendingUp, Monitor, Cpu, Target, 
  Sparkles, Heart, Briefcase, Eye, Anchor, Feather, Award,
  Hexagon, Triangle, Circle, Box, Layers, ArrowRight,
  MousePointer2, Fingerprint, Activity, BarChart3
} from 'lucide-react';
import Script from 'next/script';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// --- SAFE GSAP REGISTRATION ---
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// =========================================
// 1. BRAND CONFIGURATION
// =========================================

const BRAND = {
  colors: {
    primary: '#438FB3',   // Strategic Blue
    secondary: '#58A8B4', // Innovation Teal
    grey: '#B3B7C1',      // Platinum
    dark: '#0f172a',      // Deep Slate
    text: '#334155',      // Readable Slate
    bg: '#ffffff',        // White
    light: '#f8fafc',     // Soft Background
    glassDark: '#1e293b'  // AI Lab
  },
  info: {
    email: "growth@aurateam3.com",
    phone: "+966 50 000 0000",
    address: "الرياض، طريق الملك فهد"
  },
  content: {
    intro: {
      warning: "تنبيه: أنت تدخل منطقة الإبداع الرقمي.",
      loading: "جاري تهيئة الأنظمة..."
    },
    hero: {
      badge: "الريادة الرقمية 2026",
      title: "لا تكن مجرد شركة،",
      highlight: "كن ظاهرة رقمية.",
      desc: "نحن ندمج الإبداع البشري مع خوارزميات الذكاء الاصطناعي لنخلق لك تواجداً رقمياً لا يمكن تجاهله."
    },
    cta: {
      main: "ابدأ الهيمنة",
      secondary: "تواصل معنا"
    }
  },
  clients: [
    "https://aurateam3.com/wp-content/uploads/2025/10/kidana-logo-gold-06-1.png",
    "https://aurateam3.com/wp-content/uploads/2025/09/اورا-جامعة-الملك-عبد-العزيز.webp",
    "https://aurateam3.com/wp-content/uploads/2025/09/اورا-الجمعية-للتربية-الخاصة.webp",
    "https://aurateam3.com/wp-content/uploads/2025/09/اورا-INNOVATIVE-MANAGEMENT.webp",
    "https://aurateam3.com/wp-content/uploads/2025/09/حدائق-الفرات.webp",
    "https://aurateam3.com/wp-content/uploads/2025/09/اورا-سقنتشر.webp",
    "https://aurateam3.com/wp-content/uploads/2025/09/اورا-الهيئة-الملكية.webp",
    "https://aurateam3.com/wp-content/uploads/2025/09/اورا-وزارة-الثقافة.webp",
    "https://aurateam3.com/wp-content/uploads/2025/09/أورا-وزارة-الاتصالات.webp",
    "https://aurateam3.com/wp-content/uploads/2020/08/اعمار.webp",
    "https://aurateam3.com/wp-content/uploads/2024/02/20231126102247شعار_نادي_الوحدة_السعودية-1.webp",
    "https://aurateam3.com/wp-content/uploads/2020/08/Aldrees_logo.png"
  ]
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "AURA Digital Agency",
  "url": "https://aurateam3.com",
  "logo": "https://aurateam3.com/logo.png",
  "address": { "@type": "PostalAddress", "addressLocality": "Riyadh", "addressCountry": "SA" }
};

// =========================================
// 2. CSS ENGINE (Guaranteed Styling)
// =========================================

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Readex+Pro:wght@200;300;400;500;600;700;800&family=Tajawal:wght@300;400;500;700&display=swap');
  
  :root {
    --primary: ${BRAND.colors.primary};
    --secondary: ${BRAND.colors.secondary};
    --dark: ${BRAND.colors.dark};
    --text: ${BRAND.colors.text};
    --grey: ${BRAND.colors.grey};
    --font-heading: 'Readex Pro', sans-serif;
    --font-body: 'Tajawal', sans-serif;
  }

  /* BASE */
  html, body {
    background-color: #ffffff !important;
    color: var(--text) !important;
    font-family: var(--font-body);
    overflow-x: hidden;
    direction: rtl;
    margin: 0; padding: 0;
    -webkit-font-smoothing: antialiased;
  }

  ::selection { background: var(--primary); color: white; }

  /* TYPOGRAPHY */
  h1, h2, h3, h4 {
    font-family: var(--font-heading);
    color: var(--dark);
    font-weight: 700;
    line-height: 1.15;
    letter-spacing: -0.02em;
  }
  
  h1 { font-size: clamp(2.5rem, 6vw, 5rem); margin-bottom: 1.5rem; }
  h2 { font-size: clamp(2rem, 5vw, 3.5rem); margin-bottom: 1.5rem; }
  h3 { font-size: clamp(1.5rem, 3vw, 2rem); margin-bottom: 1rem; }
  
  p { font-size: clamp(1rem, 1.1vw, 1.15rem); line-height: 1.8; margin-bottom: 1.5rem; max-width: 65ch; }

  .text-gradient {
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: inline-block;
  }

  /* LAYOUT */
  .container { width: 100%; max-width: 1400px; margin: 0 auto; padding: 0 clamp(1.5rem, 5vw, 4rem); position: relative; z-index: 10; }
  .section { padding: clamp(6rem, 10vw, 12rem) 0; position: relative; overflow: hidden; }
  .full-screen { min-height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; }

  /* GRIDS */
  .grid-2 { display: grid; grid-template-columns: 1fr; gap: clamp(3rem, 5vw, 6rem); align-items: center; }
  .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
  .grid-4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; }
  .col-span-2 { grid-column: span 2; }

  @media (max-width: 992px) {
    .grid-2 { grid-template-columns: 1fr; }
    .col-span-2 { grid-column: span 1; }
  }

  /* COMPONENTS */
  #aura-canvas { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 0; pointer-events: none; opacity: 1; }

  /* Navbar */
  .navbar {
    position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
    width: 90%; max-width: 1000px; z-index: 1000;
    padding: 0.8rem 1.5rem; border-radius: 100px;
    background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(20px);
    border: 1px solid rgba(179, 183, 193, 0.3);
    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05);
    display: flex; justify-content: space-between; align-items: center;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .navbar.scrolled { top: 15px; background: rgba(255, 255, 255, 0.98); border-color: var(--primary); }
  .nav-link { font-family: var(--font-body); color: var(--dark); font-weight: 600; cursor: pointer; transition: 0.3s; padding: 0.5rem 1rem; text-decoration: none; }
  .nav-link:hover { color: var(--primary); }

  /* Mobile Drawer */
  .mobile-menu {
    position: fixed; inset: 0; background: rgba(255,255,255,0.98); backdrop-filter: blur(10px);
    z-index: 2000; padding: 2rem; display: flex; flex-direction: column; justify-content: center;
    transform: translateX(100%); transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .mobile-menu.open { transform: translateX(0); }

  /* Buttons */
  .btn {
    font-family: var(--font-heading); padding: 0.8rem 2rem; border-radius: 50px; border: none; cursor: pointer;
    font-weight: 700; font-size: 1rem; transition: all 0.3s;
    display: inline-flex; align-items: center; gap: 0.8rem; justify-content: center; white-space: nowrap;
  }
  .btn-primary { background: var(--primary); color: white; box-shadow: 0 10px 25px -5px rgba(67, 143, 179, 0.4); }
  .btn-primary:hover { background: var(--secondary); transform: translateY(-3px); }
  .btn-outline { background: transparent; color: var(--dark); border: 2px solid #e2e8f0; }
  .btn-outline:hover { border-color: var(--primary); color: var(--primary); }

  /* Cards */
  .glass-card {
    background: #ffffff; border: 1px solid rgba(179, 183, 193, 0.2);
    border-radius: 2rem; padding: 2.5rem; position: relative; overflow: hidden;
    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.03); transition: 0.4s;
    height: 100%; display: flex; flex-direction: column;
    will-change: transform; 
  }
  .glass-card:hover { transform: translateY(-8px); border-color: var(--secondary); box-shadow: 0 25px 60px -15px rgba(88, 168, 180, 0.15); }
  
  .icon-box {
    width: 60px; height: 60px; border-radius: 1.2rem;
    background: linear-gradient(135deg, rgba(67, 143, 179, 0.1), rgba(88, 168, 180, 0.1));
    color: var(--primary); display: flex; align-items: center; justify-content: center;
    margin-bottom: 1.5rem; transition: 0.3s;
  }
  .glass-card:hover .icon-box { background: var(--primary); color: white; transform: rotate(-10deg) scale(1.1); }

  /* Intro */
  .intro-overlay { position: fixed; inset: 0; z-index: 9999; background: #0B1121; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
  .intro-warning { font-size: 1.1rem; color: var(--secondary); margin-bottom: 2rem; padding: 1rem 2rem; border: 1px solid rgba(255,255,255,0.1); border-radius: 50px; background: rgba(0,0,0,0.3); backdrop-filter: blur(10px); }
  
  /* Marquee */
  .marquee-container { overflow: hidden; white-space: nowrap; padding: 3rem 0; background: ${BRAND.colors.light}; border-y: 1px solid rgba(0,0,0,0.05); }
  .marquee-content { display: inline-flex; animation: scroll 40s linear infinite; align-items: center; }
  .marquee-item { margin: 0 3rem; flex-shrink: 0; filter: grayscale(100%); opacity: 0.7; transition: 0.3s; }
  .marquee-item:hover { filter: grayscale(0%); opacity: 1; transform: scale(1.1); }
  .client-logo-img { height: 60px; width: auto; object-fit: contain; }
  @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

  /* Footer */
  footer { background: var(--dark); color: white; padding: 6rem 0 2rem; margin-top: 6rem; }
  .footer-link { color: var(--grey); text-decoration: none; display: block; margin-bottom: 1rem; transition: 0.3s; }
  .footer-link:hover { color: var(--secondary); padding-right: 5px; }

  .desktop-only { display: none; }
  @media (min-width: 992px) { .desktop-only { display: flex; } .mobile-only { display: none !important; } }
  .mobile-only { display: block; }
  
  .form-input { width: 100%; padding: 1.2rem; border-radius: 1rem; border: 1px solid #e2e8f0; font-family: var(--font-body); font-size: 1rem; transition: 0.3s; background: #f8fafc; margin-bottom: 1rem; }
  .form-input:focus { outline: none; border-color: var(--primary); background: white; }
`;

// =========================================
// 3. LOGIC: PARTICLE SYSTEM
// =========================================

const getParticlesData = (text: string, width: number, height: number) => {
  if (typeof document === 'undefined') return [];
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return [];
  
  const scale = window.innerWidth < 768 ? 0.6 : 1; 
  canvas.width = width * scale; 
  canvas.height = height * scale;
  
  ctx.fillStyle = '#000'; ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = '#fff'; ctx.font = `900 ${180 * scale}px Arial`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width/2, canvas.height/2);
  
  const data = ctx.getImageData(0,0,canvas.width,canvas.height).data;
  const particles = [];
  const step = 5; 
  
  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      if (data[(y * canvas.width + x) * 4] > 128) {
        particles.push({
          x: (x - canvas.width/2) * (0.06 / scale),
          y: -(y - canvas.height/2) * (0.06 / scale)
        });
      }
    }
  }
  return particles;
};

// =========================================
// 4. REACT COMPONENTS
// =========================================

// --- A. Cinematic Intro ---
const IntroOverlay = ({ onComplete }: { onComplete: () => void }) => {
  const container = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          gsap.to(container.current, { clipPath: "circle(0% at 50% 50%)", duration: 1.5, ease: "expo.inOut", onComplete });
          return 100;
        }
        return prev + 2;
      });
    }, 25);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={container} className="intro-overlay" style={{clipPath: "circle(150% at 50% 50%)"}}>
      <div className="intro-warning">{BRAND.content.intro.warning}</div>
      <div style={{fontSize:'5rem', fontWeight:'900', fontFamily:'var(--font-heading)'}}>{count}%</div>
      <p style={{marginTop:'1rem', color: BRAND.colors.grey, letterSpacing:'2px'}}>{BRAND.content.intro.loading}</p>
    </div>
  );
};

// --- B. Aura Scene ---
const AuraScene = ({ startAnimation }: { startAnimation: boolean }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mountRef.current) return;

    // 1. Setup
    const w = window.innerWidth;
    const h = window.innerHeight;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xffffff, 0.005); 
    
    const camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 1000);
    camera.position.z = 40;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // 2. Geometry
    const textPoints = getParticlesData("AURA", 1000, 500);
    const count = textPoints.length + 1500; 
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const c1 = new THREE.Color(BRAND.colors.primary);
    const c2 = new THREE.Color(BRAND.colors.secondary);

    for(let i=0; i<count; i++) {
      positions[i*3] = (Math.random()-0.5) * 150;
      positions[i*3+1] = (Math.random()-0.5) * 150;
      positions[i*3+2] = (Math.random()-0.5) * 150;
      const col = Math.random() > 0.5 ? c1 : c2;
      colors[i*3] = col.r; colors[i*3+1] = col.g; colors[i*3+2] = col.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({ size: 0.2, vertexColors: true, transparent: true, opacity: 0.8 });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 3. Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      particles.rotation.y += 0.0005;
      renderer.render(scene, camera);
    };
    animate();

    // 4. GSAP Morph
    if (startAnimation) {
      const progress = { t: 0 };
      const initialPos = Float32Array.from(positions); 
      gsap.to(progress, {
        t: 1, duration: 3.5, ease: "power3.inOut", delay: 0.5,
        onUpdate: () => {
          const currentPos = geometry.attributes.position.array as Float32Array;
          for(let i=0; i<count; i++) {
            let tx, ty, tz;
            if (i < textPoints.length) { tx = textPoints[i].x; ty = textPoints[i].y; tz = 0; }
            else { tx = initialPos[i*3]; ty = initialPos[i*3+1]; tz = initialPos[i*3+2]; }
            currentPos[i*3] = initialPos[i*3] + (tx - initialPos[i*3]) * progress.t;
            currentPos[i*3+1] = initialPos[i*3+1] + (ty - initialPos[i*3+1]) * progress.t;
            currentPos[i*3+2] = initialPos[i*3+2] + (tz - initialPos[i*3+2]) * progress.t;
          }
          geometry.attributes.position.needsUpdate = true;
        }
      });
    }

    // 5. Scroll Link
    if (typeof window !== 'undefined') {
      const ctx = gsap.context(() => {
        gsap.to(particles.rotation, {
          y: Math.PI * 2, ease: "none",
          scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 1 }
        });
        gsap.to(camera.position, {
          z: 20, ease: "power2.inOut",
          scrollTrigger: { trigger: "#الخدمات", start: "top center", end: "bottom center", scrub: 1 }
        });
      });
      return () => ctx.revert();
    }

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => { 
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose(); 
    };
  }, [startAnimation]);

  return <div id="aura-canvas" ref={mountRef}></div>;
};

// --- C. Navbar ---
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
          <div style={{width:12, height:12, background: BRAND.colors.primary, borderRadius:'50%'}}></div>
          <span style={{fontSize:'1.5rem', fontWeight:'900', color: BRAND.colors.dark, fontFamily: 'var(--font-heading)'}}>AURA</span>
        </div>
        <div className="desktop-only" style={{display:'flex', gap:'2rem'}}>
          {['الرئيسية', 'الخدمات', 'مختبر AI', 'أعمالنا', 'تواصل'].map(item => (
            <a key={item} href={`#${item}`} className="nav-link">{item}</a>
          ))}
        </div>
        <div style={{display:'flex', gap:'1rem'}}>
          <button className="btn-primary desktop-only">{BRAND.content.cta.secondary}</button>
          <button className="mobile-only" onClick={() => setIsOpen(!isOpen)} style={{background:'none', border:'none'}}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>
      {/* Mobile Drawer */}
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <div style={{display:'flex', flexDirection:'column', gap:'2rem', textAlign:'center'}}>
          {['الرئيسية', 'الخدمات', 'مختبر AI', 'أعمالنا', 'تواصل'].map(item => (
            <a key={item} href={`#${item}`} onClick={() => setIsOpen(false)} style={{fontSize:'1.8rem', fontWeight:'bold', textDecoration:'none', color:BRAND.colors.dark}}>{item}</a>
          ))}
          <button className="btn-primary" style={{marginTop:'2rem', width:'100%'}}>تواصل معنا</button>
        </div>
      </div>
    </>
  );
};

// --- D. Reveal ---
const Reveal = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div initial={{opacity:0, y:40}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.8, delay}}>
    {children}
  </motion.div>
);

// --- E. Hero ---
const Hero = () => {
  return (
    <section className="section full-screen" id="الرئيسية">
      <div className="container" style={{textAlign:'center'}}>
        <Reveal delay={0.2}>
          <div style={{display:'inline-flex', alignItems:'center', gap:'8px', padding:'0.5rem 1.5rem', background:'#f1f5f9', borderRadius:'50px', color:BRAND.colors.primary, fontWeight:'700', marginBottom:'2rem', border:`1px solid ${BRAND.colors.grey}30`}}>
            <Zap size={16} fill="currentColor" /> {BRAND.content.hero.badge}
          </div>
        </Reveal>
        <Reveal delay={0.4}>
          <h1>{BRAND.content.hero.title} <br/> <span className="text-gradient">{BRAND.content.hero.highlight}</span></h1>
        </Reveal>
        <Reveal delay={0.6}>
          <p style={{margin:'0 auto 3rem'}}>{BRAND.content.hero.desc}</p>
        </Reveal>
        <Reveal delay={0.8}>
          <div className="flex-center" style={{gap:'1.5rem', flexWrap:'wrap', justifyContent:'center', display:'flex'}}>
            <button className="btn-primary">{BRAND.content.cta.main} <ArrowRight size={20}/></button>
            <button className="btn-outline" style={{padding:'0.8rem 2rem', borderRadius:'50px', border:'2px solid #e2e8f0', background:'transparent', fontWeight:'700', cursor:'pointer'}}>شاهد الأعمال <Globe size={20} style={{display:'inline', marginLeft:'5px'}}/></button>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

// --- F. Marquee ---
const ClientMarquee = () => {
  const logos = [...BRAND.clients, ...BRAND.clients, ...BRAND.clients];
  return (
    <div className="marquee-container">
      <div className="marquee-content">
        {logos.map((src, i) => (
          <div key={i} className="marquee-item"><img src={src} alt="Client" className="client-logo-img" /></div>
        ))}
      </div>
    </div>
  );
};

// --- G. Stats ---
const Stats = () => (
  <section className="container" style={{marginBottom:'8rem', marginTop:'4rem'}}>
    <div className="grid-4" style={{textAlign:'center'}}>
      {[{n:'+500M',l:'عائدات عملاء'}, {n:'98%',l:'نسبة رضا'}, {n:'+120',l:'مشروع ناجح'}, {n:'10x',l:'عائد إعلاني'}].map((s,i) => (
        <Reveal key={i} delay={i*0.1}>
          <div className="glass-card" style={{padding:'2rem'}}>
            <span style={{fontSize:'3rem', fontWeight:'900', color:BRAND.colors.primary, display:'block'}}>{s.n}</span>
            <span style={{color:'#64748b', fontWeight:'600'}}>{s.l}</span>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

// --- H. Services ---
const Services = () => {
  const services = [
    { title: "إدارة الحملات (PPC)", desc: "تحسين تكلفة النقرة (CPC) عبر Google Ads وسناب شات وتيك توك لتحقيق أعلى عائد.", icon: Target, col: "col-span-2" },
    { title: "SEO & AEO", desc: "تصدر نتائج البحث الأولى في السعودية عبر استراتيجيات السيو المحلي والتقني.", icon: Search, col: "span 1" },
    { title: "تطوير المنصات", desc: "بنية تحتية قوية باستخدام أحدث تقنيات الويب لضمان السرعة والأمان.", icon: Code, col: "span 1" },
    { title: "النمو (Growth)", desc: "استراتيجيات قائمة على البيانات لزيادة المبيعات بشكل أسي.", icon: TrendingUp, col: "col-span-2" },
    { title: "المحتوى الإبداعي", desc: "سرد قصصي يخلق الولاء.", icon: Layers, col: "span 1" },
    { title: "ذكاء الأعمال", desc: "قرارات مبنية على الأرقام لا التخمين.", icon: BarChart3, col: "span 1" },
  ];

  return (
    <section className="section" id="الخدمات" style={{background: BRAND.colors.light}}>
      <div className="container">
        <Reveal><div style={{textAlign:'center', marginBottom:'5rem'}}><h2>خدمات <span className="text-gradient">ذكية</span></h2><p style={{margin:'0 auto'}}>منظومة متكاملة لنموك.</p></div></Reveal>
        <div className="bento-grid">
          {services.map((s, i) => (
            <motion.div key={i} className={`glass-card ${s.col}`} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.1}}>
              <div className="icon-box"><s.icon size={28}/></div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <div style={{marginTop:'auto', paddingTop:'1rem', display:'flex', justifyContent:'flex-end'}}><ArrowUpRight size={20} color={BRAND.colors.primary}/></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- I. Case Studies ---
const CaseStudies = () => {
  const sectionRef = useRef(null);
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    const ctx = gsap.context(() => {
      let proxy = { skew: 0 }, skewSetter = gsap.quickSetter(".work-card", "skewY", "deg"), clamp = gsap.utils.clamp(-10, 10);
      ScrollTrigger.create({
        trigger: sectionRef.current,
        onUpdate: (self) => {
          let skew = clamp(self.getVelocity() / -300);
          if (Math.abs(skew) > Math.abs(proxy.skew)) {
            proxy.skew = skew;
            gsap.to(proxy, {skew: 0, duration: 0.8, ease: "power3", overwrite: true, onUpdate: () => skewSetter(proxy.skew)});
          }
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="section" id="أعمالنا" ref={sectionRef}>
      <div className="container">
        <Reveal><div style={{textAlign:'center', marginBottom:'4rem'}}><h2>نتائج <span className="text-gradient">ملموسة</span></h2></div></Reveal>
        <div className="bento-grid">
          {[{t:"متجر أزياء",n:"+300%",d:"نمو المبيعات"}, {t:"تطبيق لوجستي",n:"50K",d:"مستخدم نشط"}, {t:"منصة طبية",n:"#1",d:"في جوجل"}].map((c,i) => (
            <div key={i} className="work-card">
              <div style={{height:'220px', background:'#e2e8f0', display:'flex', alignItems:'center', justifyContent:'center'}}><Briefcase size={50} color={BRAND.colors.grey}/></div>
              <div style={{padding:'2rem'}}>
                <span style={{color:BRAND.colors.primary, fontWeight:'bold', fontSize:'0.9rem'}}>دراسة حالة</span>
                <h3>{c.t}</h3>
                <div style={{display:'flex', alignItems:'baseline', gap:'10px'}}><span style={{fontSize:'2.5rem', fontWeight:'900', color:BRAND.colors.dark}}>{c.n}</span><span>{c.d}</span></div>
              </div>
              <div className="work-info"><h3>{c.t}</h3><p>شاهد التفاصيل</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- J. AI Lab ---
const AILab = () => (
  <section className="section" id="مختبر AI">
    <div className="container">
      <div style={{background:BRAND.colors.glassDark, borderRadius:'3rem', padding:'clamp(2rem,5vw,5rem)', color:'white', position:'relative', overflow:'hidden'}}>
        <div style={{position:'absolute', top:'-20%', right:'-10%', width:'500px', height:'500px', background:BRAND.colors.primary, filter:'blur(150px)', opacity:0.2}}></div>
        <div className="grid-2">
          <Reveal>
            <div style={{color:BRAND.colors.secondary, fontWeight:'bold', marginBottom:'1rem', display:'flex', gap:'10px'}}><Activity/> مختبر الذكاء الاصطناعي</div>
            <h2 style={{color:'white'}}>نسبق المستقبل.</h2>
            <p style={{color:'#94a3b8'}}>نستخدم خوارزمياتنا الخاصة لتحليل البيانات والتنبؤ بالاتجاهات.</p>
          </Reveal>
          <Reveal delay={0.2}>
            <div style={{background:'rgba(255,255,255,0.05)', padding:'2rem', borderRadius:'2rem', border:'1px solid rgba(255,255,255,0.1)'}}>
               <div style={{display:'flex', justifyContent:'space-between', marginBottom:'2rem'}}><span>الكفاءة</span><span style={{color:BRAND.colors.secondary}}>+240%</span></div>
               <div style={{display:'flex', alignItems:'flex-end', gap:'10px', height:'150px'}}>
                  {[40,60,45,80,70,90,100].map((h,i)=><div key={i} style={{flex:1, height:`${h}%`, background: i===6?BRAND.colors.secondary:'rgba(255,255,255,0.1)', borderRadius:'4px'}}></div>)}
               </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);

// --- K. Contact ---
const Contact = () => (
  <section className="section container" id="تواصل">
    <div className="grid-2">
      <Reveal>
        <div>
          <h2>جاهز <span className="text-gradient">للانطلاق؟</span></h2>
          <p>تواصل معنا اليوم لبدء رحلة النجاح.</p>
          <div style={{marginTop:'2rem'}}>
             <div style={{display:'flex', gap:'1rem', alignItems:'center', marginBottom:'1rem'}}>
               <div className="icon-box" style={{marginBottom:0, width:50, height:50}}><Phone/></div>
               <div><div style={{fontSize:'0.9rem', color:BRAND.colors.grey}}>اتصل بنا</div><div style={{fontWeight:'bold'}}>{BRAND.info.phone}</div></div>
             </div>
             <div style={{display:'flex', gap:'1rem', alignItems:'center'}}>
               <div className="icon-box" style={{marginBottom:0, width:50, height:50}}><MapPin/></div>
               <div><div style={{fontSize:'0.9rem', color:BRAND.colors.grey}}>زورونا</div><div style={{fontWeight:'bold'}}>الرياض، المملكة العربية السعودية</div></div>
             </div>
          </div>
        </div>
      </Reveal>
      <div className="glass-card">
        <form onSubmit={(e)=>{e.preventDefault(); alert('تم الإرسال!')}}>
          <div className="form-group"><label className="form-label">الاسم</label><input type="text" className="form-input"/></div>
          <div className="form-group"><label className="form-label">البريد</label><input type="email" className="form-input"/></div>
          <button className="btn-primary" style={{width:'100%', marginTop:'1rem'}}>إرسال الطلب <Send size={18}/></button>
        </form>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer>
    <div className="container">
      <div style={{display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'4rem', paddingBottom:'4rem', borderBottom:'1px solid #1e293b'}}>
        <div><h2 style={{color:'white', fontSize:'2rem'}}>AURA.</h2><p style={{color:'#64748b'}}>الاستثمار في المستقبل.</p></div>
        <div style={{display:'flex', gap:'4rem', flexWrap:'wrap'}}>
           <div><h4 style={{color:'white', marginBottom:'1rem'}}>الشركة</h4><a href="#" className="footer-link">عن أورا</a><a href="#" className="footer-link">القيادة</a></div>
           <div><h4 style={{color:'white', marginBottom:'1rem'}}>الخدمات</h4><a href="#" className="footer-link">التحول الرقمي</a><a href="#" className="footer-link">الاستثمار</a></div>
        </div>
      </div>
      <div style={{paddingTop:'2rem', color:'#475569', fontSize:'0.9rem'}}>© 2026 Aura Holding. All Rights Reserved.</div>
    </div>
  </footer>
);

// =========================================
// 5. MAIN ENTRY POINT
// =========================================

export default function AuraWebsite() {
  const [introFinished, setIntroFinished] = useState(false);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <Script id="json-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <AnimatePresence>
        {!introFinished && <IntroOverlay onComplete={() => setIntroFinished(true)} />}
      </AnimatePresence>
      {introFinished && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <AuraScene startAnimation={introFinished} />
          <Navbar />
          <main>
            <Hero />
            <ClientMarquee />
            <Stats />
            <Services />
            <CaseStudies />
            <AILab />
            <Contact />
          </main>
          <Footer />
        </motion.div>
      )}
    </>
  );
}
