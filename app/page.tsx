'use client';

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * AURA DIGITAL AGENCY - CONNECTED UNIVERSE EDITION (v12.0)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * * [CORE UPGRADES]
 * * 1. DEEP LINKING (ScrollTrigger x Three.js):
 * - The 3D Camera Z-position and Scene Rotation are directly controlled
 * by the page scroll percentage using GSAP Scrub.
 * * 2. VELOCITY PHYSICS:
 * - Elements skew and distort based on how fast the user scrolls.
 * * 3. IMMERSIVE STORYTELLING:
 * - As you scroll down, you physically "enter" the Aura particle field.
 * * 4. ROBUST ARCHITECTURE:
 * - React 19 safe, Memory managed, SEO optimized.
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { useState, useEffect, useRef, useLayoutEffect, FormEvent } from 'react';
import { 
  motion, AnimatePresence, useScroll, useTransform 
} from 'framer-motion';
import { 
  ArrowUpRight, Palette, Search, ShoppingBag, Menu, X,
  Megaphone, CheckCircle, Shield, Star, Code, Smartphone,
  Phone, Mail, MapPin, Zap, Send, Layout, BarChart, Users,
  Globe, Lightbulb, TrendingUp, Monitor, Cpu, Target, 
  Sparkles, Heart, Briefcase, Eye, Anchor, Feather, Award,
  Hexagon, Triangle, Circle, Box, Layers, ArrowRight,
  MousePointer2, Fingerprint, Activity
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
// 1. BRAND CONFIGURATION & DATA LAYER
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
    address: "برج أورا، طريق الملك فهد، الرياض"
  },
  content: {
    intro: {
      warning: "النظام جاهز. استعد للدخول إلى هالة أورا.",
      loading: "جاري ربط البيانات..."
    },
    hero: {
      badge: "التحول الرقمي 2026",
      title: "لا تكن مجرد شركة،",
      highlight: "كن ظاهرة رقمية.",
      desc: "نحن ندمج الإبداع البشري مع خوارزميات الذكاء الاصطناعي لنخلق لك تواجداً رقمياً لا يمكن تجاهله. أهلاً بك في الجيل القادم من التسويق."
    },
    cta: {
      main: "ابدأ الهيمنة الآن",
      secondary: "احجز استشارة"
    }
  },
  // Real Logos
  clients: [
    "https://aurateam3.com/wp-content/uploads/2025/10/kidana-logo-gold-06-1.png",
    "https://aurateam3.com/wp-content/uploads/2025/09/اورا-جامعة-الملك-عبد-العزيز.webp",
    "https://aurateam3.com/wp-content/uploads/2025/09/اورا-الجمعية-للتربية-الخاصة.webp",
    "https://aurateam3.com/wp-content/uploads/2025/09/اورا-INNOVATIVE-MANAGEMENT.webp",
    "https://aurateam3.com/wp-content/uploads/2025/09/حدائق-الفرات.webp",
    "https://aurateam3.com/wp-content/uploads/2025/09/اورا-سقنتشر.webp",
    "https://aurateam3.com/wp-content/uploads/2025/09/اورا-البدر-للحجامة.webp",
    "https://aurateam3.com/wp-content/uploads/2025/09/اورا-الهيئة-الملكية.webp",
    "https://aurateam3.com/wp-content/uploads/2025/09/أورا-وزارة-الاتصالات.webp",
    "https://aurateam3.com/wp-content/uploads/2020/08/اعمار.webp",
    "https://aurateam3.com/wp-content/uploads/2024/02/20231126102247شعار_نادي_الوحدة_السعودية-1.webp",
    "https://aurateam3.com/wp-content/uploads/2020/08/Aldrees_logo.png"
  ]
};

// SEO Structure
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "AURA Digital Agency",
  "url": "https://aurateam3.com",
  "logo": "https://aurateam3.com/logo.png",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Riyadh",
    "addressCountry": "SA"
  },
  "priceRange": "$$$"
};

// =========================================
// 2. CSS ENGINE (Zero-Layout Shift)
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

  html, body {
    background-color: #ffffff !important;
    color: var(--text) !important;
    font-family: var(--font-body);
    overflow-x: hidden;
    direction: rtl;
    -webkit-font-smoothing: antialiased;
    scroll-behavior: smooth;
  }

  ::selection { background: var(--primary); color: white; }

  /* TYPOGRAPHY */
  h1, h2, h3, h4 {
    font-family: var(--font-heading);
    color: var(--dark);
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.02em;
  }
  
  h1 { font-size: clamp(2.5rem, 6vw, 5.5rem); line-height: 1.15; margin-bottom: 1.5rem; }
  h2 { font-size: clamp(2rem, 5vw, 3.5rem); margin-bottom: 1.5rem; }
  h3 { font-size: clamp(1.5rem, 3vw, 2rem); margin-bottom: 1rem; }
  
  p { 
    font-family: var(--font-body);
    color: var(--text); 
    font-size: clamp(1rem, 1.1vw, 1.15rem); 
    line-height: 1.8; 
    margin-bottom: 1.5rem;
    max-width: 65ch;
  }

  .text-gradient {
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: inline-block;
  }

  /* LAYOUT */
  .container { width: 100%; max-width: 1400px; margin: 0 auto; padding: 0 clamp(1.5rem, 5vw, 4rem); position: relative; z-index: 10; }
  .section { padding: clamp(6rem, 10vw, 12rem) 0; position: relative; overflow: hidden; }
  .full-screen { min-height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; }

  /* GRID SYSTEMS */
  .grid-2 { display: grid; grid-template-columns: 1fr; gap: clamp(3rem, 5vw, 6rem); align-items: center; }
  .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
  .grid-4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; }
  
  .grid-clients { 
    display: grid; 
    grid-template-columns: repeat(2, 1fr); 
    gap: 1.5rem; 
    align-items: center; 
    justify-items: center; 
  }

  @media (min-width: 768px) {
    .grid-2 { grid-template-columns: 1fr 1fr; }
    .grid-clients { grid-template-columns: repeat(4, 1fr); gap: 3rem; }
  }

  /* UI COMPONENTS */
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

  /* Glass Cards */
  .glass-card {
    background: #ffffff; border: 1px solid rgba(179, 183, 193, 0.2);
    border-radius: 2rem; padding: 2.5rem; position: relative; overflow: hidden;
    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.03); transition: 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
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
  .intro-counter { font-family: var(--font-heading); font-size: clamp(4rem, 10vw, 8rem); font-weight: 900; line-height: 1; color: white; font-variant-numeric: tabular-nums; }
  
  /* Client Logo Style */
  .client-card {
    background: #ffffff; border: 1px solid #f1f5f9;
    border-radius: 1.5rem; padding: 1.5rem;
    width: 100%; height: 120px;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.4s ease;
    opacity: 0; transform: translateY(50px); /* Hidden for GSAP */
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
  }
  .client-card:hover { border-color: var(--primary); transform: translateY(-5px) !important; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.08); }
  .client-img { max-width: 80%; max-height: 80%; object-fit: contain; filter: grayscale(100%); transition: 0.4s; opacity: 0.6; }
  .client-card:hover .client-img { filter: grayscale(0%); opacity: 1; transform: scale(1.1); }

  /* Footer */
  footer { background: var(--dark); color: white; padding: 6rem 0 2rem; margin-top: 6rem; }
  .footer-link { color: var(--grey); text-decoration: none; display: block; margin-bottom: 1rem; transition: 0.3s; }
  .footer-link:hover { color: var(--secondary); padding-right: 5px; }

  .desktop-only { display: none; }
  @media (min-width: 992px) { .desktop-only { display: flex; } .mobile-only { display: none !important; } }
  .mobile-only { display: block; }
  
  /* Form */
  .form-input { width: 100%; padding: 1.2rem; border-radius: 1rem; border: 1px solid #e2e8f0; font-family: var(--font-body); font-size: 1rem; transition: 0.3s; background: #f8fafc; margin-bottom: 1.5rem; }
  .form-input:focus { outline: none; border-color: var(--primary); background: white; box-shadow: 0 0 0 4px rgba(67, 143, 179, 0.1); }
`;

// =========================================
// 3. LOGIC: PARTICLE SYSTEM (Canvas Sampling)
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
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={container} className="intro-overlay" style={{clipPath: "circle(150% at 50% 50%)"}}>
      <div className="intro-warning">{BRAND.content.intro.warning}</div>
      <div className="intro-counter">{count}%</div>
      <p style={{marginTop:'1rem', color: BRAND.colors.grey, letterSpacing:'2px'}}>{BRAND.content.intro.loading}</p>
    </div>
  );
};

// --- B. Aura Scene (CONNECTED TO SCROLL) ---
const AuraScene = ({ startAnimation }: { startAnimation: boolean }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. Setup
    const w = window.innerWidth;
    const h = window.innerHeight;
    const scene = new THREE.Scene();
    sceneRef.current = scene;
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
    particlesRef.current = particles;
    scene.add(particles);

    // 3. Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      particles.rotation.y += 0.0005; // Base rotation
      renderer.render(scene, camera);
    };
    animate();

    // 4. GSAP Morph (Initial)
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

    // 5. CONNECT SCROLL TO THREE.JS (The Magic Link)
    if (typeof window !== 'undefined') {
      const ctx = gsap.context(() => {
        // Rotate the entire particle cloud based on scroll
        gsap.to(particles.rotation, {
          y: Math.PI * 2, // Full rotation over the page
          ease: "none",
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 1 // Smooth connection
          }
        });

        // Zoom camera in/out based on sections
        gsap.to(camera.position, {
          z: 20, // Zoom in
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: "#خدماتنا", // Target services section
            start: "top center",
            end: "bottom center",
            scrub: 1
          }
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
          <button className="btn btn-primary desktop-only">{BRAND.content.cta.secondary}</button>
          <button className="mobile-only" onClick={() => setIsOpen(!isOpen)} style={{background:'none', border:'none'}}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>
      {/* Drawer */}
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <div style={{display:'flex', flexDirection:'column', gap:'2rem', textAlign:'center'}}>
          {['الرئيسية', 'الخدمات', 'مختبر AI', 'أعمالنا', 'تواصل'].map(item => (
            <a key={item} href={`#${item}`} onClick={() => setIsOpen(false)} style={{fontSize:'1.8rem', fontWeight:'bold', textDecoration:'none', color:BRAND.colors.dark}}>{item}</a>
          ))}
          <button className="btn btn-primary" style={{marginTop:'2rem', width:'100%'}}>تواصل معنا</button>
        </div>
      </div>
    </>
  );
};

const Reveal = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div initial={{opacity:0, y:40}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.8, delay}}>
    {children}
  </motion.div>
);

// --- D. Hero ---
const Hero = () => (
  <section className="section full-screen" id="الرئيسية">
    <div className="container" style={{textAlign:'center'}}>
      <Reveal>
        <div style={{display:'inline-flex', padding:'0.5rem 1.5rem', background:'#f1f5f9', borderRadius:'50px', color:BRAND.colors.primary, fontWeight:'700', marginBottom:'2rem'}}>
          <Zap size={16} style={{marginLeft:'8px'}} /> {BRAND.content.hero.badge}
        </div>
        <h1>{BRAND.content.hero.title} <br/> <span className="text-gradient">{BRAND.content.hero.highlight}</span></h1>
        <p style={{margin:'0 auto 3rem'}}>{BRAND.content.hero.desc}</p>
        <div style={{display:'flex', justifyContent:'center', gap:'1rem'}}>
          <button className="btn btn-primary">{BRAND.content.cta.main} <ArrowUpRight size={20}/></button>
        </div>
      </Reveal>
    </div>
  </section>
);

// --- E. Staggered Client Grid ---
const ClientGrid = () => {
  const sectionRef = useRef(null);
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    const ctx = gsap.context(() => {
      gsap.to(".client-card", {
        opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="section" ref={sectionRef}>
      <div className="container">
        <div style={{textAlign:'center', marginBottom:'4rem'}}>
          <p style={{color: BRAND.colors.grey, fontWeight:'bold', letterSpacing:'2px'}}>شركاء النجاح</p>
        </div>
        <div className="grid-clients">
          {BRAND.clients.map((url, i) => (
            <div key={i} className="client-card"><img src={url} alt="Client" className="client-img" /></div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- F. Stats ---
const Stats = () => (
  <section className="container" style={{marginBottom:'8rem'}}>
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

// --- G. Services ---
const Services = () => (
  <section className="section" id="خدماتنا" style={{background: BRAND.colors.light}}>
    <div className="container">
      <Reveal><div style={{textAlign:'center', marginBottom:'5rem'}}><h2>خدمات <span className="text-gradient">للنمو الأسي</span></h2></div></Reveal>
      <div className="grid-3">
        {[
          {t:'إدارة الحملات', d:'نحول ميزانيتك لأرباح. إدارة CPC و CPA.', i:Target},
          {t:'هيمنة السيو', d:'تصدر نتائج البحث الأولى في السعودية.', i:Search},
          {t:'منصات تبيع', d:'مواقع مصممة للتحويل والسرعة.', i:Code},
          {t:'محتوى فيروسي', d:'قصص تلهم وتصاميم تخطف الأنظار.', i:Megaphone},
          {t:'إنتاج سينمائي', d:'موشن جرافيك بجودة عالمية.', i:Monitor},
          {t:'ذكاء أعمال', d:'قرارات مبنية على الأرقام لا التخمين.', i:TrendingUp}
        ].map((s,i) => (
          <motion.div key={i} className="glass-card" whileHover={{y:-10}} transition={{delay: i*0.1}}>
            <div className="icon-box"><s.i size={32}/></div>
            <h3>{s.t}</h3>
            <p>{s.d}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// --- H. Kinetic Case Studies (Velocity Skew) ---
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
        <Reveal><div style={{textAlign:'center', marginBottom:'4rem'}}><h2>نتائج تتحدث <span className="text-gradient">عن نفسها</span></h2></div></Reveal>
        <div className="grid-3">
          {[{t:"متجر أزياء",n:"+300%",d:"نمو المبيعات"}, {t:"تطبيق عقاري",n:"50K",d:"تحميل"}, {t:"شركة طبية",n:"#1",d:"في جوجل"}].map((c,i) => (
            <div key={i} className="glass-card work-card" style={{padding:0, minHeight:'400px', transformOrigin:"center center", willChange:"transform"}}>
              <div style={{height:'220px', background:'#e2e8f0', display:'flex', alignItems:'center', justifyContent:'center'}}><Briefcase size={60} color={BRAND.colors.grey}/></div>
              <div style={{padding:'2rem'}}>
                <h3 style={{marginBottom:'0.5rem'}}>{c.t}</h3>
                <div style={{display:'flex', alignItems:'baseline', gap:'10px'}}>
                  <span style={{fontSize:'3rem', fontWeight:'900', color:BRAND.colors.dark}}>{c.n}</span>
                  <span>{c.d}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- I. AI Lab ---
const AILab = () => (
  <section className="section" id="مختبر AI">
    <div className="container">
      <div style={{background: BRAND.colors.glassDark, borderRadius:'3rem', padding:'clamp(2rem, 5vw, 5rem)', color:'white', position:'relative', overflow:'hidden'}}>
        <div style={{position:'absolute', top:'-20%', right:'-10%', width:'500px', height:'500px', background: BRAND.colors.primary, filter:'blur(150px)', opacity:0.2}}></div>
        <div className="grid-2">
          <Reveal>
            <div style={{color:BRAND.colors.secondary, fontWeight:'bold', marginBottom:'1rem', display:'flex', alignItems:'center', gap:'10px'}}><Sparkles size={20}/> مختبر أورا</div>
            <h2 style={{color:'white'}}>نسبق المستقبل بخطوة.</h2>
            <p style={{color:'#94a3b8'}}>نستخدم خوارزمياتنا الخاصة لتحليل المشاعر والتنبؤ بالترندات في السوق السعودي.</p>
            <ul style={{marginTop:'2rem', listStyle:'none'}}>{['تحليل البيانات الضخمة', 'أتمتة الحملات', 'تصاميم AI'].map((t,i)=><li key={i} style={{marginBottom:'1rem', display:'flex', gap:'10px'}}><CheckCircle color={BRAND.colors.secondary}/> {t}</li>)}</ul>
          </Reveal>
          <Reveal delay={0.2}>
            <div style={{background:'rgba(255,255,255,0.05)', padding:'2rem', borderRadius:'2rem', border:'1px solid rgba(255,255,255,0.1)', position:'relative', zIndex:2}}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'2rem'}}><span>كفاءة الاستهداف</span><span style={{color:BRAND.colors.secondary}}>+240%</span></div>
              <div style={{display:'flex', alignItems:'flex-end', gap:'10px', height:'200px'}}>
                {[40,60,45,80,70,90,100].map((h,i) => <motion.div key={i} initial={{height:0}} whileInView={{height:`${h}%`}} transition={{duration:1, delay:i*0.1}} style={{flex:1, background: i===6?BRAND.colors.secondary:'rgba(255,255,255,0.1)', borderRadius:'4px'}}></motion.div>)}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);

// --- J. Contact ---
const Contact = () => (
  <section className="section container" id="تواصل">
    <div className="grid-2">
      <Reveal>
        <div>
          <h2>جاهز لتفعيل <span className="text-gradient">هالتك؟</span></h2>
          <p>تواصل معنا اليوم واحصل على تحليل رقمي شامل لوضع علامتك الحالي.</p>
          <div style={{marginTop:'2rem'}}>
            <div style={{fontWeight:'700', fontSize:'1.2rem'}}>{BRAND.info.phone}</div>
            <div style={{color:'#64748b'}}>{BRAND.info.email}</div>
          </div>
        </div>
      </Reveal>
      <div className="glass-card">
        <form onSubmit={(e)=>{e.preventDefault(); alert('تم الإرسال!')}}>
          <div className="form-group"><label className="form-label">الاسم</label><input className="form-input"/></div>
          <div className="form-group"><label className="form-label">البريد</label><input className="form-input"/></div>
          <button className="btn-primary" style={{width:'100%'}}>طلب استشارة <Send size={18}/></button>
        </form>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer>
    <div className="container" style={{textAlign:'center'}}>
      <h2 style={{color:'white'}}>AURA</h2>
      <p style={{color:'#94a3b8'}}>نصنع المستقبل الرقمي.</p>
      <div style={{marginTop:'3rem', color:'#64748b'}}>© 2026 Aura Agency.</div>
    </div>
  </footer>
);

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
            <ClientGrid />
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
