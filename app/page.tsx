'use client';

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * AURA DIGITAL AGENCY - QUANTUM EDITION (v6.2 - PRODUCTION BUILD FIXED)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * * [STRATEGY & ARCHITECTURE]
 * * 1. CORE PHILOSOPHY: "Adaptive Commerce & Digital Aura"
 * - The site acts as a living organism, reacting to user input via WebGL.
 * - Design Language: Industrial Precision x Digital Fluidity.
 * * 2. TECH STACK (Next-Gen):
 * - React 19 (Server Components Architecture Compatible)
 * - Three.js (Particle System with Canvas Sampling)
 * - GSAP (Timeline-based Animation Orchestration)
 * - Framer Motion (Interface Micro-interactions)
 * - Lucide React (Vector Iconography)
 * * 3. COLOR PALETTE (Psychology-Driven):
 * - Primary (#438FB3): Strategic Trust, Intelligence.
 * - Secondary (#58A8B4): Innovation, Growth, Vitality.
 * - Neutral (#B3B7C1): Balance, High-Tech Industrial.
 * - Dark (#0B1121): The Void, Depth, Contrast.
 * * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { useState, useEffect, useRef, useLayoutEffect, useMemo, FormEvent } from 'react';
import { 
  motion, AnimatePresence, useScroll, useTransform, 
  useSpring, useMotionValue, useMotionTemplate 
} from 'framer-motion';
import { 
  ArrowUpRight, Palette, Search, ShoppingBag, Menu, X,
  Megaphone, CheckCircle, Shield, Star, Code, Smartphone,
  Phone, Mail, MapPin, Zap, Send, Layout, BarChart, Users,
  Layers, Globe, MousePointer, Lightbulb, TrendingUp, Monitor,
  Cpu, Target, Anchor, Coffee, Award, Feather, Eye, Lock
} from 'lucide-react';
import Script from 'next/script';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// --- SAFE REGISTRATION ---
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// =========================================
// 1. BRAND CONFIGURATION & DATA LAYER
// =========================================

const BRAND = {
  colors: {
    primary: '#438FB3',
    secondary: '#58A8B4',
    grey: '#B3B7C1',
    dark: '#0f172a',
    deepBlue: '#0B1121', // Intro Background
    light: '#f8fafc',
    white: '#ffffff'
  },
  info: {
    email: "hello@aurateam3.com",
    phone: "+966 50 000 0000",
    address: "الرياض، طريق الملك فهد، المملكة العربية السعودية"
  },
  content: {
    intro: {
      warning: "تنبيه: سطوع بصري عالي الكثافة. هالة أورا تتوهج الآن.",
      loading: "جاري تهيئة الأنظمة الإبداعية..."
    },
    hero: {
      badge: "الريادة الرقمية 2026",
      title: "نحن لا نصنع حملات،",
      highlight: "نحن نصنع هالة التميز.", // FIXED: Changed from 'subtitle' to 'highlight'
      desc: "في عصر التشابه، 'أورا' هي الفارق. ندمج الذكاء الاصطناعي التوليدي مع الإبداع البشري لبناء أنظمة براند ذكية تتنبأ باحتياجات عملائك قبل أن يدركوها."
    }
  }
};

// SEO Structure
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "AURA Digital Agency",
  "alternateName": "وكالة أورا للتسويق الرقمي",
  "url": "https://aurateam3.com",
  "logo": "https://aurateam3.com/logo.png",
  "sameAs": [
    "https://twitter.com/aura",
    "https://linkedin.com/company/aura"
  ],
  "description": "وكالة أورا: تحول رقمي شامل يعتمد على البيانات والذكاء الاصطناعي.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Riyadh",
    "addressCountry": "SA"
  },
  "priceRange": "$$$"
};

// =========================================
// 2. THE CSS ENGINE (ZERO-OVERLAP SYSTEM)
// =========================================

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Readex+Pro:wght@200;300;400;500;600;700;800&display=swap');
  
  /* --- CORE RESET --- */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    background-color: ${BRAND.colors.white} !important;
    color: ${BRAND.colors.dark} !important;
    font-family: 'Readex Pro', sans-serif;
    overflow-x: hidden;
    direction: rtl;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    scroll-behavior: smooth;
  }

  ::selection {
    background: ${BRAND.colors.primary};
    color: white;
  }

  /* --- TYPOGRAPHY SCALE (CLAMP BASED) --- */
  
  h1 { 
    font-size: clamp(2.5rem, 5vw + 1rem, 5.5rem); 
    line-height: 1.15; 
    font-weight: 800; 
    letter-spacing: -0.02em;
    margin-bottom: 1.5rem;
    color: ${BRAND.colors.dark};
  }
  
  h2 { 
    font-size: clamp(2rem, 4vw + 1rem, 3.5rem); 
    line-height: 1.25; 
    font-weight: 700; 
    letter-spacing: -0.01em;
    margin-bottom: 1.5rem;
    color: ${BRAND.colors.dark};
  }
  
  h3 { 
    font-size: clamp(1.5rem, 2vw + 0.5rem, 2rem); 
    line-height: 1.4; 
    font-weight: 700;
    margin-bottom: 1rem;
  }
  
  p { 
    font-size: clamp(1rem, 1.1vw, 1.15rem); 
    line-height: 1.8; 
    color: #475569;
    margin-bottom: 1.5rem;
    max-width: 65ch;
  }

  .text-gradient {
    background: linear-gradient(135deg, ${BRAND.colors.primary} 0%, ${BRAND.colors.secondary} 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: inline-block;
  }
  
  .text-silver { color: ${BRAND.colors.grey}; }

  /* --- LAYOUT UTILITIES --- */
  .container { 
    width: 100%; 
    max-width: 1400px; 
    margin: 0 auto; 
    padding: 0 clamp(1.5rem, 5vw, 4rem); 
    position: relative; 
    z-index: 10; 
  }
  
  .section { 
    padding: clamp(6rem, 10vw, 10rem) 0; 
    position: relative; 
    overflow: hidden;
  }
  
  .full-screen {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  /* --- GRIDS (BENTO ARCHITECTURE) --- */
  .grid-2 { 
    display: grid; 
    grid-template-columns: 1fr; 
    gap: clamp(3rem, 5vw, 6rem); 
    align-items: center; 
  }
  
  .grid-3 { 
    display: grid; 
    grid-template-columns: 1fr; 
    gap: 2rem; 
  }
  
  .grid-4 { 
    display: grid; 
    grid-template-columns: repeat(2, 1fr); 
    gap: 1.5rem; 
  }

  /* Desktop overrides */
  @media (min-width: 992px) {
    .grid-2 { grid-template-columns: 1fr 1fr; }
    .grid-3 { grid-template-columns: repeat(3, 1fr); }
    .grid-4 { grid-template-columns: repeat(4, 1fr); }
    .col-span-2 { grid-column: span 2; }
  }

  /* --- UI COMPONENTS --- */
  
  /* 1. Canvas Layer */
  #aura-canvas {
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    z-index: 0; pointer-events: none; opacity: 1;
  }

  /* 2. Navbar (Floating Capsule) */
  .navbar {
    position: fixed; top: 25px; left: 50%; transform: translateX(-50%);
    width: 90%; max-width: 950px; z-index: 1000;
    padding: 0.8rem 2rem; border-radius: 100px;
    background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(20px);
    border: 1px solid rgba(179, 183, 193, 0.3);
    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05);
    display: flex; justify-content: space-between; align-items: center;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .navbar.scrolled {
    top: 15px; background: rgba(255, 255, 255, 0.98);
    box-shadow: 0 20px 40px -10px rgba(67, 143, 179, 0.1);
    border-color: ${BRAND.colors.primary};
  }
  
  .nav-link { 
    color: ${BRAND.colors.dark}; font-weight: 600; font-size: 0.95rem; cursor: pointer;
    transition: 0.3s; padding: 0.5rem 1rem; position: relative; text-decoration: none;
  }
  .nav-link::after {
    content: ''; position: absolute; bottom: 0; left: 50%; width: 0; height: 2px;
    background: var(--primary); transition: 0.3s; transform: translateX(-50%);
  }
  .nav-link:hover::after { width: 100%; }

  /* 3. Buttons (Primary & Outline) */
  .btn {
    padding: 1rem 2.5rem; border-radius: 50px; border: none; cursor: pointer;
    font-weight: 700; font-size: 1rem; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: inline-flex; align-items: center; gap: 0.8rem; justify-content: center;
    position: relative; overflow: hidden;
  }
  .btn-primary {
    background: ${BRAND.colors.primary}; color: white;
    box-shadow: 0 10px 25px -5px rgba(67, 143, 179, 0.4);
  }
  .btn-primary:hover {
    background: ${BRAND.colors.secondary}; transform: translateY(-3px);
    box-shadow: 0 20px 40px -10px rgba(88, 168, 180, 0.5);
  }
  .btn-outline {
    background: transparent; color: ${BRAND.colors.dark};
    border: 2px solid #e2e8f0;
  }
  .btn-outline:hover {
    border-color: ${BRAND.colors.primary}; color: ${BRAND.colors.primary};
  }

  /* 4. Glass Cards (The Aura Aesthetic) */
  .glass-card {
    background: #ffffff; 
    border: 1px solid rgba(179, 183, 193, 0.2);
    border-radius: 2rem; 
    padding: 2.5rem; 
    position: relative; 
    overflow: hidden;
    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.03);
    transition: 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
    height: 100%; 
    display: flex; flex-direction: column;
  }
  .glass-card:hover {
    transform: translateY(-10px); 
    border-color: ${BRAND.colors.secondary};
    box-shadow: 0 25px 60px -15px rgba(88, 168, 180, 0.15);
  }
  
  .icon-box {
    width: 64px; height: 64px; border-radius: 1.2rem;
    background: linear-gradient(135deg, rgba(67, 143, 179, 0.1), rgba(88, 168, 180, 0.1));
    color: ${BRAND.colors.primary}; 
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 2rem; transition: 0.3s;
  }
  .glass-card:hover .icon-box {
    background: ${BRAND.colors.primary}; 
    color: white; 
    transform: rotate(-10deg) scale(1.1);
  }

  /* 5. Intro Overlay (Dark Mode) */
  .intro-overlay {
    position: fixed; inset: 0; z-index: 9999;
    background: ${BRAND.colors.deepBlue}; 
    color: white;
    display: flex; flex-direction: column; 
    align-items: center; justify-content: center; 
    text-align: center;
  }
  .intro-warning {
    font-size: 1.1rem; color: ${BRAND.colors.secondary}; margin-bottom: 2rem;
    padding: 1rem 2rem; border: 1px solid rgba(255,255,255,0.1); border-radius: 50px;
    background: rgba(0,0,0,0.3); backdrop-filter: blur(10px);
    opacity: 0; transform: translateY(20px);
  }
  .intro-counter { 
    font-size: clamp(4rem, 10vw, 8rem); 
    font-weight: 900; line-height: 1; 
    color: white; font-variant-numeric: tabular-nums; 
  }
  
  /* 6. Form Elements */
  .form-group { margin-bottom: 1.5rem; }
  .form-label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: ${BRAND.colors.dark}; }
  .form-input {
    width: 100%; padding: 1.2rem; border-radius: 1rem; 
    border: 1px solid #e2e8f0;
    font-family: inherit; font-size: 1rem; 
    transition: 0.3s; background: #f8fafc;
  }
  .form-input:focus { 
    outline: none; 
    border-color: ${BRAND.colors.primary}; 
    background: white; 
    box-shadow: 0 0 0 4px rgba(67, 143, 179, 0.1); 
  }

  /* 7. Footer */
  footer { 
    background: ${BRAND.colors.dark}; 
    color: white; 
    padding: 8rem 0 3rem; 
    margin-top: 8rem; 
  }
  .footer-link { 
    color: ${BRAND.colors.grey}; 
    text-decoration: none; 
    display: block; 
    margin-bottom: 1rem; 
    transition: 0.3s; 
  }
  .footer-link:hover { 
    color: ${BRAND.colors.secondary}; 
    padding-right: 5px; 
  }

  /* 8. Misc Utilities */
  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .desktop-only { display: none; }
  
  @media (min-width: 992px) {
    .desktop-only { display: flex; }
    .mobile-only { display: none !important; }
  }
  .mobile-only { display: block; }
  
  /* Marquee Animation */
  .marquee-container { overflow: hidden; white-space: nowrap; padding: 2rem 0; background: ${BRAND.colors.light}; }
  .marquee-content { display: inline-flex; animation: scroll 30s linear infinite; }
  .marquee-item { margin: 0 3rem; font-size: 1.5rem; font-weight: 700; color: ${BRAND.colors.grey}; opacity: 0.5; }
  @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
`;

// =========================================
// 3. LOGIC: PARTICLE SYSTEM (Canvas Sampling)
// =========================================

// Safely generate text particles on the CPU
const getParticlesData = (text: string, width: number, height: number) => {
  if (typeof document === 'undefined') return [];
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return [];
  
  // High res for crisp text
  const scale = 1; 
  canvas.width = width * scale; 
  canvas.height = height * scale;
  
  ctx.fillStyle = '#000'; ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = '#fff'; ctx.font = `900 ${180 * scale}px Arial`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width/2, canvas.height/2);
  
  const data = ctx.getImageData(0,0,canvas.width,canvas.height).data;
  const particles = [];
  
  // Optimized sampling rate based on screen size
  const step = 5; 
  
  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      if (data[(y * canvas.width + x) * 4] > 128) {
        particles.push({
          x: (x - canvas.width/2) * 0.06,
          y: -(y - canvas.height/2) * 0.06
        });
      }
    }
  }
  return particles;
};

// =========================================
// 4. REACT COMPONENTS
// =========================================

// --- A. Cinematic Intro (Blue Dark Mode) ---
const Intro = ({ onComplete }: { onComplete: () => void }) => {
  const container = useRef(null);
  const warning = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Sequence: Warning -> Fade Out -> Counter -> Explosion
    const tl = gsap.timeline();
    
    tl.to(warning.current, { opacity: 1, y: 0, duration: 1, delay: 0.5 })
      .to(warning.current, { opacity: 0, y: -20, duration: 0.5, delay: 2.5 })
      .call(() => {
        // Start Counter
        const interval = setInterval(() => {
          setCount(prev => {
            if (prev >= 100) {
              clearInterval(interval);
              // Explosion Reveal
              gsap.to(container.current, {
                clipPath: "circle(0% at 50% 50%)", 
                duration: 1.5, 
                ease: "expo.inOut", 
                onComplete: onComplete
              });
              return 100;
            }
            return prev + 2;
          });
        }, 20); // Fast load
      });
  }, []);

  return (
    <div ref={container} className="intro-overlay" style={{clipPath: "circle(150% at 50% 50%)"}}>
      <div ref={warning} className="intro-warning">
        <Lightbulb size={20} style={{display:'inline', marginLeft:'10px', verticalAlign:'middle'}} />
        {BRAND.content.intro.warning}
      </div>
      
      {count > 0 && (
        <div style={{position:'relative'}}>
          <div className="intro-counter">{count}%</div>
          <div style={{width:'200px', height:'4px', background:'rgba(255,255,255,0.1)', marginTop:'1rem', borderRadius:'2px', overflow:'hidden'}}>
            <div style={{width: `${count}%`, height:'100%', background: BRAND.colors.primary, transition:'width 0.1s linear'}}></div>
          </div>
          <p style={{marginTop:'1rem', color: BRAND.colors.grey, fontSize:'0.9rem', letterSpacing:'2px'}}>SYSTEM INITIALIZATION</p>
        </div>
      )}
    </div>
  );
};

// --- B. Aura Scene (Fixed Background) ---
const AuraScene = ({ startAnimation }: { startAnimation: boolean }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. Scene Setup
    const w = window.innerWidth;
    const h = window.innerHeight;
    const scene = new THREE.Scene();
    // Light fog for depth perception on white background
    scene.fog = new THREE.FogExp2(0xffffff, 0.005); 
    
    const camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 1000);
    camera.position.z = 40;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // 2. Geometry generation
    const textPoints = getParticlesData("AURA", 1000, 500);
    const count = textPoints.length + 1500; // Text + Ambient stars
    
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const c1 = new THREE.Color(BRAND.colors.primary);
    const c2 = new THREE.Color(BRAND.colors.secondary);

    for(let i=0; i<count; i++) {
      // Start in chaos (random positions)
      positions[i*3] = (Math.random()-0.5) * 150;
      positions[i*3+1] = (Math.random()-0.5) * 150;
      positions[i*3+2] = (Math.random()-0.5) * 150;
      
      const col = Math.random() > 0.5 ? c1 : c2;
      colors[i*3] = col.r; colors[i*3+1] = col.g; colors[i*3+2] = col.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.2, vertexColors: true, transparent: true, opacity: 0.8
    });
    
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 3. Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      // Continuous float
      particles.rotation.y += 0.001;
      particles.rotation.x = Math.sin(Date.now() * 0.0005) * 0.05;
      renderer.render(scene, camera);
    };
    animate();

    // 4. Trigger Morphing (GSAP)
    if (startAnimation) {
      // We animate a proxy object, and update geometry in the callback
      const progress = { t: 0 };
      
      // Store initial random positions to lerp from
      const initialPos = Float32Array.from(positions); 
      
      gsap.to(progress, {
        t: 1,
        duration: 3.5,
        ease: "power3.inOut",
        delay: 0.5,
        onUpdate: () => {
          const currentPos = geometry.attributes.position.array as Float32Array;
          const t = progress.t;
          
          for(let i=0; i<count; i++) {
            let tx, ty, tz;
            
            if (i < textPoints.length) {
              // Target is Text
              tx = textPoints[i].x;
              ty = textPoints[i].y;
              tz = 0;
            } else {
              // Target is same random pos (just floating)
              tx = initialPos[i*3];
              ty = initialPos[i*3+1];
              tz = initialPos[i*3+2];
            }
            
            // Linear Interpolation: start + (end - start) * t
            currentPos[i*3] = initialPos[i*3] + (tx - initialPos[i*3]) * t;
            currentPos[i*3+1] = initialPos[i*3+1] + (ty - initialPos[i*3+1]) * t;
            currentPos[i*3+2] = initialPos[i*3+2] + (tz - initialPos[i*3+2]) * t;
          }
          geometry.attributes.position.needsUpdate = true;
        }
      });
    }

    // Resize Handler
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
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }} animate={{ y: 0 }} transition={{ delay: 3, type: 'spring' }}
        className={`navbar ${scrolled ? 'scrolled' : ''}`}
      >
        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
          <div style={{width:12, height:12, background: BRAND.colors.primary, borderRadius:'50%'}}></div>
          <span style={{fontSize:'1.5rem', fontWeight:'900', color: BRAND.colors.dark}}>AURA</span>
        </div>

        <div className="desktop-only" style={{display:'flex', gap:'2rem'}}>
          {['الرئيسية', 'الخدمات', 'مختبر AI', 'أعمالنا', 'تواصل'].map(item => (
            <a key={item} href={`#${item}`} className="nav-link">{item}</a>
          ))}
        </div>

        <div style={{display:'flex', gap:'1rem'}}>
          <button className="btn btn-primary desktop-only">ابدأ مشروعك</button>
          <button className="mobile-only" onClick={() => setIsOpen(true)} style={{background:'none', border:'none'}}>
            <Menu color={BRAND.colors.primary} size={28} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            style={{position:'fixed', inset:0, background:'white', zIndex:2000, padding:'2rem', display:'flex', flexDirection:'column'}}
          >
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'3rem'}}>
              <span style={{fontSize:'1.5rem', fontWeight:'bold'}}>القائمة</span>
              <button onClick={() => setIsOpen(false)} style={{background:'none', border:'none'}}><X size={32} /></button>
            </div>
            {['الرئيسية', 'الخدمات', 'مختبر AI', 'أعمالنا', 'تواصل'].map(item => (
              <a key={item} href={`#${item}`} onClick={() => setIsOpen(false)} style={{fontSize:'2rem', fontWeight:'bold', marginBottom:'2rem', textDecoration:'none', color:BRAND.colors.dark}}>{item}</a>
            ))}
            <button className="btn btn-primary" style={{marginTop:'auto'}}>تواصل معنا</button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// --- D. Scroll Reveal Component ---
const Reveal = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

// --- E. Hero Section ---
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
          <h1>
            {BRAND.content.hero.title} <br/>
            <span className="text-gradient">{BRAND.content.hero.highlight}</span>
          </h1>
        </Reveal>
        
        <Reveal delay={0.6}>
          <p style={{margin:'0 auto 3rem'}}>
            {BRAND.content.hero.desc}
          </p>
        </Reveal>

        <Reveal delay={0.8}>
          <div className="flex-center" style={{gap:'1.5rem', flexWrap:'wrap'}}>
            <button className="btn btn-primary">
              اكتشف خدماتنا <ArrowUpRight size={20} />
            </button>
            <button className="btn btn-outline">
              شاهد معرض الأعمال <Globe size={20} />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

// --- F. Stats Section ---
const Stats = () => {
  return (
    <section className="container" style={{marginBottom:'8rem'}}>
      <div className="grid-4" style={{textAlign:'center'}}>
        {[
          { n: "+500M", l: "أصول رقمية مدارة" },
          { n: "98%", l: "معدل رضا الشركاء" },
          { n: "+120", l: "مشروع استراتيجي" },
          { n: "24/7", l: "دعم تقني متواصل" }
        ].map((s, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <div className="glass-card" style={{padding:'2rem'}}>
              <span style={{display:'block', fontSize:'3rem', fontWeight:'900', color: BRAND.colors.primary, lineHeight:1}}>{s.n}</span>
              <span style={{color: '#64748b', fontWeight:'600'}}>{s.l}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

// --- G. Client Marquee ---
const ClientMarquee = () => (
  <div className="marquee-container">
    <div className="marquee-content">
      {[...Array(10)].map((_, i) => (
        <span key={i} className="marquee-item">CLIENT PARTNER {i+1}</span>
      ))}
    </div>
  </div>
);

// --- H. AI Lab Section ---
const AILab = () => {
  return (
    <section className="section" id="مختبر AI" style={{background: BRAND.colors.dark, color: 'white', borderRadius:'3rem', margin:'0 1rem'}}>
      <div className="container">
        <div className="grid-2">
          <Reveal>
            <div style={{color: BRAND.colors.secondary, fontWeight:'bold', marginBottom:'1rem'}}>مختبر أورا للذكاء الاصطناعي</div>
            <h2 style={{color:'white'}}>نسبق المستقبل <br/> بخطوة.</h2>
            <p style={{color:'#94a3b8'}}>
              نطور أدواتنا الخاصة في تحليل المشاعر، التنبؤ بسلوك المستهلك، وتوليد المحتوى الإبداعي. في مختبر أورا، التكنولوجيا ليست مجرد أداة، بل هي شريك إبداعي.
            </p>
            <ul style={{listStyle:'none', marginTop:'2rem'}}>
              {['تحليل البيانات الضخمة', 'أتمتة الحملات الإعلانية', 'تصميمات مخصصة بالـ AI'].map((item, i) => (
                <li key={i} style={{marginBottom:'1rem', display:'flex', alignItems:'center', gap:'10px'}}>
                  <CheckCircle color={BRAND.colors.primary} size={20} /> {item}
                </li>
              ))}
            </ul>
          </Reveal>
          
          <Reveal delay={0.2}>
            <div style={{background:'rgba(255,255,255,0.05)', padding:'3rem', borderRadius:'2rem', border:'1px solid rgba(255,255,255,0.1)'}}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'2rem'}}>
                <span>نمو الأداء</span>
                <span style={{color: BRAND.colors.secondary}}>+240%</span>
              </div>
              {/* Fake Chart Bars */}
              <div style={{display:'flex', alignItems:'flex-end', gap:'10px', height:'200px'}}>
                {[40, 60, 45, 80, 70, 90, 100].map((h, i) => (
                  <div key={i} style={{flex:1, height:`${h}%`, background: i === 6 ? BRAND.colors.secondary : 'rgba(255,255,255,0.1)', borderRadius:'4px'}}></div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

// --- I. Services (Bento Grid) ---
const Services = () => {
  const services = [
    { title: "الاستراتيجيات الرقمية", desc: "خارطة طريق واضحة لنقلك من المنافسة إلى الريادة.", icon: Target, col: "span 2" },
    { title: "تصميم التجربة (UX/UI)", desc: "واجهات سهلة الاستخدام تخاطب العاطفة.", icon: Layout, col: "span 1" },
    { title: "تطوير المنصات", desc: "بنية تحتية قوية باستخدام أحدث تقنيات الويب.", icon: Code, col: "span 1" },
    { title: "التسويق بالأداء", desc: "نركز على الأرقام: زيادة المبيعات وتقليل التكلفة.", icon: TrendingUp, col: "span 2" },
    { title: "الإنتاج الإبداعي", desc: "فيديو وموشن جرافيك بجودة سينمائية.", icon: Monitor, col: "span 1" },
    { title: "هندسة النمو", desc: "تحسين معدلات التحويل (CRO) باستمرار.", icon: BarChart, col: "span 1" },
  ];

  return (
    <section className="section" id="الخدمات">
      <div className="container">
        <Reveal>
          <div style={{textAlign:'center', marginBottom:'5rem'}}>
            <h2>مصفوفة الحلول <span className="text-gradient">المتكاملة</span></h2>
            <p style={{margin:'0 auto'}}>كل ما تحتاجه للنمو في مكان واحد.</p>
          </div>
        </Reveal>

        <div className="grid-3">
          {services.map((s, i) => (
            <motion.div 
              key={i}
              className={`glass-card ${s.col === 'span 2' ? 'col-span-2' : ''}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className="icon-box">
                <s.icon size={32} />
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <div style={{marginTop:'auto', paddingTop:'1rem', display:'flex', alignItems:'center', gap:'5px', color: BRAND.colors.primary, fontWeight:'bold', cursor:'pointer'}}>
                تفاصيل الخدمة <ArrowUpRight size={18} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- J. Contact Form ---
const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("تم استلام طلبك بنجاح! فريق أورا سيتواصل معك.");
  };

  return (
    <section className="section container" id="تواصل">
      <div className="grid-2">
        <Reveal>
          <div>
            <h2>هل أنت مستعد لتفعيل <span className="text-gradient">هالتك؟</span></h2>
            <p>
              دعنا نتحدث عن طموحاتك. فريقنا جاهز لتحويل التحديات إلى فرص نمو حقيقية.
            </p>
            
            <div style={{marginTop:'3rem', display:'flex', flexDirection:'column', gap:'2rem'}}>
              <div style={{display:'flex', gap:'1.5rem', alignItems:'center'}}>
                <div className="icon-box" style={{marginBottom:0, width:60, height:60}}><Phone /></div>
                <div>
                  <div style={{fontSize:'0.9rem', color: BRAND.colors.grey}}>اتصل بنا مباشرة</div>
                  <div style={{fontWeight:'700', fontSize:'1.2rem'}}>{BRAND.info.phone}</div>
                </div>
              </div>
              <div style={{display:'flex', gap:'1.5rem', alignItems:'center'}}>
                <div className="icon-box" style={{marginBottom:0, width:60, height:60}}><Mail /></div>
                <div>
                  <div style={{fontSize:'0.9rem', color: BRAND.colors.grey}}>البريد الإلكتروني</div>
                  <div style={{fontWeight:'700', fontSize:'1.2rem'}}>{BRAND.info.email}</div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="glass-card">
            <h3 style={{marginBottom:'2rem'}}>ابدأ المشروع</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">الاسم الكامل</label>
                <input type="text" className="form-input" placeholder="محمد أحمد" required />
              </div>
              <div className="form-group">
                <label className="form-label">البريد الإلكتروني</label>
                <input type="email" className="form-input" placeholder="name@company.com" required />
              </div>
              <div className="form-group">
                <label className="form-label">تفاصيل المشروع</label>
                <textarea className="form-input" style={{minHeight:'150px'}} placeholder="أخبرنا عن أهدافك..."></textarea>
              </div>
              <button className="btn btn-primary" style={{width:'100%'}}>
                إرسال الطلب <Send size={18} />
              </button>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

// --- K. Footer ---
const Footer = () => (
  <footer>
    <div className="container">
      <div className="grid-2" style={{alignItems:'start', marginBottom:'4rem', gap:'4rem'}}>
        <div>
          <div style={{fontSize:'2.5rem', fontWeight:'900', color:'white', marginBottom:'1.5rem'}}>AURA.</div>
          <p style={{color: BRAND.colors.grey, maxWidth:'400px'}}>
            الوكالة الرقمية التي تعيد تعريف معايير الجودة في المملكة. ندمج الفن، العلم، والتكنولوجيا لنصنع مستقبلاً أفضل لعلامتك التجارية.
          </p>
        </div>
        
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(150px, 1fr))', gap:'2rem'}}>
          <div>
            <h4 style={{color:'white', marginBottom:'1.5rem'}}>الروابط</h4>
            <a href="#" className="footer-link">عن أورا</a>
            <a href="#" className="footer-link">أعمالنا</a>
            <a href="#" className="footer-link">الوظائف</a>
            <a href="#" className="footer-link">المدونة</a>
          </div>
          <div>
            <h4 style={{color:'white', marginBottom:'1.5rem'}}>الخدمات</h4>
            <a href="#" className="footer-link">تطوير الويب</a>
            <a href="#" className="footer-link">التسويق الرقمي</a>
            <a href="#" className="footer-link">الهوية البصرية</a>
          </div>
        </div>
      </div>
      
      <div style={{borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:'2rem', textAlign:'center', color: BRAND.colors.grey, fontSize:'0.9rem', display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem'}}>
        <span>© 2026 Aura Digital Agency. جميع الحقوق محفوظة.</span>
        <div style={{display:'flex', gap:'1.5rem'}}>
          <span>Twitter</span>
          <span>LinkedIn</span>
          <span>Instagram</span>
        </div>
      </div>
    </div>
  </footer>
);

// =========================================
// 5. MAIN ENTRY POINT (The App)
// =========================================

export default function AuraWebsite() {
  const [introFinished, setIntroFinished] = useState(false);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <Script id="json-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      
      {/* 1. Cinematic Intro */}
      <AnimatePresence>
        {!introFinished && <IntroOverlay onComplete={() => setIntroFinished(true)} />}
      </AnimatePresence>

      {/* 2. Main Site */}
      {introFinished && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <AuraScene startAnimation={introFinished} />
          <Navbar />
          <main>
            <Hero />
            <ClientMarquee />
            <Stats />
            <Services />
            <AILab />
            <Contact />
          </main>
          <Footer />
        </motion.div>
      )}
    </>
  );
}
