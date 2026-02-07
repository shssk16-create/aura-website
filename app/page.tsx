'use client';

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * AURA DIGITAL AGENCY - ENTERPRISE PLATINUM EDITION (v3.0)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * * DESIGN SYSTEM:
 * - Primary Color: #438FB3 (Oceanic Blue)
 * - Secondary Color: #58A8B4 (Teal/Cyan)
 * - Accent Color: #B3B7C1 (Platinum Silver)
 * - Background: Pure White (#FFFFFF) with Light Mesh
 * * TECH STACK:
 * - React 19 (Client Side)
 * - Three.js (Particle System)
 * - GSAP (High-Performance Animation)
 * - Framer Motion (Micro-interactions)
 * - Lucide React (Iconography)
 */

import React, { useState, useEffect, useRef, useLayoutEffect, FormEvent } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  ArrowUpRight, Palette, Search, ShoppingBag, Menu, Globe, Zap, 
  Megaphone, CheckCircle, Shield, Star, Code, Layout, Smartphone,
  BarChart, Users, Send, MapPin, Phone, Mail, X, ChevronDown,
  Briefcase, TrendingUp, Layers
} from 'lucide-react';
import Script from 'next/script';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP Plugins safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// =========================================
// 1. CONSTANTS & DATA LAYER
// =========================================

const BRAND_COLORS = {
  primary: '#438FB3',
  secondary: '#58A8B4',
  silver: '#B3B7C1',
  dark: '#0f172a',
  light: '#f8fafc'
};

const SITE_DATA = {
  name: "AURA",
  tagline: "هالتك الرقمية تبدأ من هنا",
  email: "hello@aurateam3.com",
  phone: "+966 50 000 0000",
  address: "الرياض، طريق الملك فهد"
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "AURA Digital Agency",
  "url": "https://aurateam3.com",
  "logo": "https://aurateam3.com/logo.png",
  "description": "وكالة أورا: نصنع تجارب رقمية استثنائية من خلال دمج الإبداع بالتكنولوجيا. خدماتنا تشمل الهوية البصرية، تطوير الويب، والتسويق الرقمي.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Riyadh",
    "addressCountry": "SA"
  },
  "priceRange": "$$$",
  "openingHours": "Su-Th 09:00-18:00"
};

// =========================================
// 2. CSS ARCHITECTURE (GLOBAL STYLES)
// =========================================

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Readex+Pro:wght@200;300;400;500;600;700;800&display=swap');
  
  /* --- RESET & BASE --- */
  html, body {
    background-color: #ffffff !important;
    color: #0f172a !important;
    font-family: 'Readex Pro', sans-serif;
    margin: 0; padding: 0;
    overflow-x: hidden;
    direction: rtl;
    scroll-behavior: smooth;
  }

  ::selection {
    background: ${BRAND_COLORS.primary};
    color: white;
  }

  /* --- TYPOGRAPHY SYSTEM --- */
  h1, h2, h3, h4, h5, h6 {
    color: ${BRAND_COLORS.dark};
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.02em;
  }
  
  h1 { font-size: clamp(3.5rem, 8vw, 6.5rem); margin-bottom: 1.5rem; }
  h2 { font-size: clamp(2.5rem, 5vw, 4rem); margin-bottom: 1.5rem; }
  h3 { font-size: 1.75rem; margin-bottom: 1rem; }
  p { 
    color: #475569; font-size: 1.125rem; line-height: 1.8; 
    margin-bottom: 1.5rem; max-width: 65ch; 
  }
  
  .text-gradient {
    background: linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.secondary} 100%);
    -webkit-background-clip: text; color: transparent; display: inline-block;
  }
  
  .text-silver { color: ${BRAND_COLORS.silver}; }

  /* --- UTILITY CLASSES --- */
  .container { max-width: 1300px; margin: 0 auto; padding: 0 clamp(1.5rem, 5vw, 3rem); position: relative; z-index: 2; }
  .flex-center { display: flex; align-items: center; justify-content: center; }
  .flex-between { display: flex; align-items: center; justify-content: space-between; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
  .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2rem; }
  .section { padding: 8rem 0; position: relative; }
  
  /* --- COMPONENTS: CANVAS --- */
  #aura-canvas {
    position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
    z-index: 0; pointer-events: none; opacity: 0.6;
  }

  /* --- COMPONENTS: NAVBAR --- */
  .navbar {
    position: fixed; top: 25px; left: 50%; transform: translateX(-50%);
    width: 90%; max-width: 950px; z-index: 1000;
    padding: 0.8rem 1.5rem; border-radius: 100px;
    background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(20px);
    border: 1px solid rgba(179, 183, 193, 0.3);
    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05);
    display: flex; justify-content: space-between; align-items: center;
    transition: all 0.4s ease;
  }
  .navbar.scrolled {
    top: 15px; background: rgba(255, 255, 255, 0.98);
    box-shadow: 0 20px 40px -10px rgba(67, 143, 179, 0.1);
    border-color: ${BRAND_COLORS.primary};
  }
  .nav-logo { font-size: 1.6rem; font-weight: 900; color: ${BRAND_COLORS.primary}; letter-spacing: -1px; display: flex; align-items: center; gap: 8px; }
  .nav-dot { width: 10px; height: 10px; background: ${BRAND_COLORS.secondary}; border-radius: 50%; }
  
  .nav-link { 
    color: ${BRAND_COLORS.dark}; font-weight: 600; font-size: 0.95rem; 
    cursor: pointer; text-decoration: none; padding: 0.5rem 1rem;
    transition: 0.3s; border-radius: 20px;
  }
  .nav-link:hover { color: ${BRAND_COLORS.primary}; background: rgba(67, 143, 179, 0.05); }

  /* --- COMPONENTS: BUTTONS --- */
  .btn {
    padding: 1rem 2.5rem; border-radius: 50px; border: none; cursor: pointer;
    font-weight: 700; font-size: 1.05rem; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: inline-flex; align-items: center; gap: 0.5rem; justify-content: center;
  }
  .btn-primary {
    background: ${BRAND_COLORS.primary}; color: white;
    box-shadow: 0 10px 20px -5px rgba(67, 143, 179, 0.4);
  }
  .btn-primary:hover {
    background: ${BRAND_COLORS.secondary}; transform: translateY(-3px);
    box-shadow: 0 15px 30px -5px rgba(88, 168, 180, 0.5);
  }
  .btn-outline {
    background: transparent; color: ${BRAND_COLORS.dark};
    border: 2px solid #e2e8f0;
  }
  .btn-outline:hover {
    border-color: ${BRAND_COLORS.primary}; color: ${BRAND_COLORS.primary};
  }

  /* --- COMPONENTS: GLASS CARDS --- */
  .glass-card {
    background: white; border: 1px solid rgba(179, 183, 193, 0.2);
    border-radius: 2rem; padding: 2.5rem;
    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.03);
    transition: 0.4s; height: 100%; display: flex; flex-direction: column;
  }
  .glass-card:hover {
    transform: translateY(-8px); border-color: ${BRAND_COLORS.secondary};
    box-shadow: 0 20px 50px -15px rgba(88, 168, 180, 0.15);
  }
  .icon-wrapper {
    width: 64px; height: 64px; border-radius: 1.2rem;
    background: linear-gradient(135deg, rgba(67, 143, 179, 0.1), rgba(88, 168, 180, 0.1));
    color: ${BRAND_COLORS.primary}; display: flex; align-items: center; justify-content: center;
    margin-bottom: 1.5rem; transition: 0.3s;
  }
  .glass-card:hover .icon-wrapper {
    background: ${BRAND_COLORS.primary}; color: white; transform: rotate(-10deg) scale(1.1);
  }

  /* --- INTRO OVERLAY --- */
  .intro-overlay {
    position: fixed; inset: 0; z-index: 9999;
    background: #0f172a; color: white;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center;
  }
  .intro-warning {
    font-size: 1.1rem; color: ${BRAND_COLORS.secondary}; margin-bottom: 2rem;
    padding: 1rem 2rem; border: 1px solid rgba(255,255,255,0.1); border-radius: 50px;
    background: rgba(0,0,0,0.3); opacity: 0; transform: translateY(20px);
  }
  .intro-count { font-size: 8rem; font-weight: 900; line-height: 1; color: white; font-variant-numeric: tabular-nums; }
  .intro-label { letter-spacing: 4px; color: ${BRAND_COLORS.silver}; margin-top: 1rem; text-transform: uppercase; font-size: 0.9rem; }

  /* --- MARQUEE --- */
  .marquee-container { overflow: hidden; white-space: nowrap; padding: 2rem 0; background: ${BRAND_COLORS.light}; border-y: 1px solid rgba(0,0,0,0.05); }
  .marquee-content { display: inline-flex; animation: scroll 30s linear infinite; }
  .marquee-item { margin: 0 3rem; font-size: 1.5rem; font-weight: 700; color: ${BRAND_COLORS.silver}; opacity: 0.7; }
  @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

  /* --- PRICING CARDS --- */
  .pricing-card { position: relative; overflow: hidden; }
  .pricing-header { text-align: center; margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1px solid #f1f5f9; }
  .price-tag { font-size: 3rem; font-weight: 800; color: ${BRAND_COLORS.dark}; }
  .price-period { font-size: 1rem; color: #94a3b8; }
  .feature-list { list-style: none; padding: 0; margin: 0; }
  .feature-item { display: flex; align-items: center; gap: 0.8rem; margin-bottom: 1rem; color: #475569; }
  .popular-badge {
    position: absolute; top: 1.5rem; right: -2rem; background: ${BRAND_COLORS.secondary}; color: white;
    padding: 0.5rem 3rem; transform: rotate(45deg); font-size: 0.8rem; font-weight: 700;
  }

  /* --- CONTACT FORM --- */
  .form-group { margin-bottom: 1.5rem; }
  .form-label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: ${BRAND_COLORS.dark}; }
  .form-input {
    width: 100%; padding: 1rem; border-radius: 12px; border: 1px solid #e2e8f0;
    font-family: inherit; font-size: 1rem; transition: 0.3s; background: #f8fafc;
  }
  .form-input:focus { outline: none; border-color: ${BRAND_COLORS.primary}; background: white; box-shadow: 0 0 0 4px rgba(67, 143, 179, 0.1); }
  textarea.form-input { min-height: 150px; resize: vertical; }

  /* --- FOOTER --- */
  footer { background: #0f172a; color: white; padding: 6rem 0 2rem; margin-top: 6rem; position: relative; overflow: hidden; }
  .footer-link { color: #94a3b8; text-decoration: none; display: block; margin-bottom: 0.8rem; transition: 0.3s; }
  .footer-link:hover { color: ${BRAND_COLORS.secondary}; padding-right: 5px; }

  /* --- RESPONSIVE --- */
  @media (max-width: 992px) {
    .grid-2 { grid-template-columns: 1fr; gap: 3rem; }
    .nav-links, .desktop-only { display: none; }
    .mobile-only { display: block !important; }
    h1 { font-size: 3rem; }
  }
  .mobile-only { display: none; }
`;

// =========================================
// 3. HELPER FUNCTIONS & LOGIC
// =========================================

// Generate Particles from Text
const getTextCoordinates = (text: string, width: number, height: number) => {
  if (typeof document === 'undefined') return [];
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return [];
  canvas.width = width; canvas.height = height;
  ctx.fillStyle = 'black'; ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = 'white'; ctx.font = `900 ${Math.min(width * 0.2, 200)}px Arial`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);
  const data = ctx.getImageData(0, 0, width, height).data;
  const particles = [];
  const step = 6;
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      if (data[(y * width + x) * 4] > 128) {
        particles.push({ x: (x - width / 2) * 0.05, y: -(y - height / 2) * 0.05 });
      }
    }
  }
  return particles;
};

// =========================================
// 4. SUB-COMPONENTS
// =========================================

// --- A. INTRO ---
const Intro = ({ onComplete }: { onComplete: () => void }) => {
  const container = useRef(null);
  const warning = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Sequence
    const tl = gsap.timeline();
    
    // 1. Warning
    tl.to(warning.current, { opacity: 1, y: 0, duration: 1, delay: 0.5 })
      .to(warning.current, { opacity: 0, y: -20, duration: 0.5, delay: 2.5 })
      .call(() => {
        // 2. Start Counter
        const interval = setInterval(() => {
          setCount(prev => {
            if (prev >= 100) {
              clearInterval(interval);
              // 3. Explosion
              gsap.to(container.current, {
                clipPath: "circle(0% at 50% 50%)",
                duration: 1.8,
                ease: "expo.inOut",
                onComplete: onComplete
              });
              return 100;
            }
            return prev + 1;
          });
        }, 20);
      });
  }, []);

  return (
    <div ref={container} className="intro-overlay" style={{clipPath: "circle(150% at 50% 50%)"}}>
      <div ref={warning} className="intro-warning">
        ⚠️ تنبيه: هالة "أورا" ساطعة. يرجى خفض الإضاءة لتجربة مثالية.
      </div>
      {count > 0 && (
        <div>
          <div className="intro-count">{count}%</div>
          <div className="intro-label">LOADING AURA SYSTEM</div>
        </div>
      )}
    </div>
  );
};

// --- B. PARTICLES (BACKGROUND) ---
const AuraBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!mountRef.current) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xffffff, 0.015); // White fog
    
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.z = 30;
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Get "AURA" Text Shapes
    const textPoints = getTextCoordinates("AURA", 1000, 500);
    const count = textPoints.length;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const c1 = new THREE.Color(BRAND_COLORS.primary);
    const c2 = new THREE.Color(BRAND_COLORS.secondary);

    for (let i = 0; i < count; i++) {
      // Start spread out (Chaos)
      positions[i*3] = (Math.random() - 0.5) * 150;
      positions[i*3+1] = (Math.random() - 0.5) * 150;
      positions[i*3+2] = (Math.random() - 0.5) * 100;
      
      const mixed = Math.random() > 0.5 ? c1 : c2;
      colors[i*3] = mixed.r; colors[i*3+1] = mixed.g; colors[i*3+2] = mixed.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.15, vertexColors: true, transparent: true, opacity: 0.8
    });
    
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Animation Loop
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.005;
      particles.rotation.y = Math.sin(time * 0.3) * 0.05;
      particles.rotation.x = Math.sin(time * 0.2) * 0.05;
      renderer.render(scene, camera);
    };
    animate();

    // Morph to Text (GSAP)
    // We animate specific particles to target
    // For performance in React + Three without frame loop hook, we use simple tweens on array
    // NOTE: For absolute stability, we will just use a visual drift here and assume text shape
    // But since user asked for "Writing Aura", let's try a simple approach:
    
    const targetPos = textPoints;
    const currentPos = geometry.attributes.position.array as Float32Array;
    
    // We can't easily tween generic array with GSAP inside useEffect without frame loop update
    // So we will use a "Force" method.
    // Let's animate a progress value and update in loop
    const progress = { val: 0 };
    
    gsap.to(progress, {
        val: 1,
        duration: 3,
        ease: "power3.inOut",
        delay: 3.5, // After intro
        onUpdate: () => {
            for(let i=0; i<count; i++) {
                // Lerp current to target
                const tx = targetPos[i].x;
                const ty = targetPos[i].y;
                const tz = 0;
                
                // We need original randoms to interpolate FROM. 
                // To save memory/complexity, we just approximate visually by damping
                // Actually, let's just make them move to target.
                
                // Calculating in loop is expensive.
                // Better approach: Update the position attribute directly via GSAP? No.
                // Let's rely on the visual "Chaos" for now as it's safer than crashing the browser.
            }
        }
    });
    
    // Simpler Alternative: Just position them as text initially but scatter them with noise in shader?
    // Or just animate the Group Scale from 0 to 1?
    
    // Let's manually set them to TEXT positions but with large Z offset, then bring Z to 0.
    for(let i=0; i<count; i++) {
        // Set X/Y to text immediately
        positions[i*3] = textPoints[i].x;
        positions[i*3+1] = textPoints[i].y;
        // Z is random far away
        positions[i*3+2] = (Math.random() - 0.5) * 200 + 50;
        
        // Animate Z to 0
        gsap.to(positions, {
            [i*3+2]: 0,
            duration: 2.5,
            ease: "expo.out",
            delay: 4 + Math.random() * 1, // Staggered arrival
            onUpdate: () => geometry.attributes.position.needsUpdate = true
        });
    }

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize); renderer.dispose(); };
  }, []);

  return <div id="aura-canvas" ref={mountRef}></div>;
};

// --- C. NAVBAR ---
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-logo">
        <div className="nav-dot"></div>
        AURA
      </div>
      <div className="nav-links mobile-hidden" style={{display:'flex', gap:'1rem'}}>
        {['الرئيسية', 'عن أورا', 'الخدمات', 'الأعمال', 'الأسعار'].map(item => (
          <a key={item} href={`#${item}`} className="nav-link">{item}</a>
        ))}
      </div>
      <div style={{display:'flex', gap:'1rem'}}>
        <button className="btn btn-primary mobile-hidden">ابدأ مشروعك</button>
        <button className="mobile-only" style={{background:'none', border:'none'}}><Menu color={BRAND_COLORS.primary} /></button>
      </div>
    </nav>
  );
};

// --- D. MARQUEE ---
const ClientMarquee = () => (
  <div className="marquee-container">
    <div className="marquee-content">
      {/* Logos duplicated for seamless loop */}
      {[...Array(10)].map((_, i) => (
        <span key={i} className="marquee-item">CLIENT {i+1} LOGO</span>
      ))}
    </div>
  </div>
);

// --- E. CONTACT FORM ---
const ContactForm = () => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert("شكراً لك! تم استلام طلبك وسيتم التواصل معك قريباً.");
  };

  return (
    <div className="glass-card">
      <h3 className="text-gradient">تحدث مع خبرائنا</h3>
      <p style={{marginBottom:'2rem'}}>املأ النموذج وسنتواصل معك خلال 24 ساعة لتقديم استشارة مجانية.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="grid-2" style={{gap:'1.5rem', marginBottom:'1.5rem'}}>
          <div className="form-group">
            <label className="form-label">الاسم الكامل</label>
            <input type="text" className="form-input" placeholder="محمد أحمد" required />
          </div>
          <div className="form-group">
            <label className="form-label">البريد الإلكتروني</label>
            <input type="email" className="form-input" placeholder="name@company.com" required />
          </div>
        </div>
        <div className="form-group" style={{marginBottom:'1.5rem'}}>
          <label className="form-label">نوع الخدمة</label>
          <select className="form-input">
            <option>تطوير موقع إلكتروني</option>
            <option>هوية بصرية</option>
            <option>تسويق رقمي</option>
            <option>تطبيق جوال</option>
          </select>
        </div>
        <div className="form-group" style={{marginBottom:'2rem'}}>
          <label className="form-label">تفاصيل المشروع</label>
          <textarea className="form-input" placeholder="أخبرنا المزيد عن أهدافك..."></textarea>
        </div>
        <button type="submit" className="btn btn-primary" style={{width:'100%'}}>
          إرسال الطلب <Send size={18} />
        </button>
      </form>
    </div>
  );
};

// =========================================
// 6. MAIN SECTIONS
// =========================================

const Hero = () => (
  <section className="section" id="الرئيسية" style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
    <div className="container" style={{textAlign:'center'}}>
      <motion.div initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} transition={{duration:1, delay:3.5}}>
        <div style={{display:'inline-flex', alignItems:'center', gap:'8px', padding:'0.5rem 1.5rem', borderRadius:'50px', background:'#f1f5f9', color:BRAND_COLORS.primary, fontWeight:'700', marginBottom:'2rem', border:`1px solid ${BRAND_COLORS.silver}`}}>
          <Zap size={16} fill="currentColor" /> الإصدار البلاتيني 2026
        </div>
        
        <h1>
          نحول الرؤية إلى <span className="text-gradient">واقع رقمي</span><br/>
          يسبق عصره
        </h1>
        
        <p style={{margin:'0 auto 2.5rem'}}>
          في أورا، نحن لا نكتب الكود فقط. نحن نهندس تجارب رقمية متكاملة تضع علامتك التجارية في الصدارة. 
          شريكك الاستراتيجي في التحول الرقمي.
        </p>

        <div className="flex-center" style={{gap:'1rem', flexWrap:'wrap'}}>
          <button className="btn btn-primary">اكتشف خدماتنا <ArrowUpRight size={18} /></button>
          <button className="btn btn-outline">مشاهدة الأعمال <Globe size={18} /></button>
        </div>
      </motion.div>
    </div>
  </section>
);

const Services = () => (
  <section className="section" id="الخدمات" style={{background: BRAND_COLORS.light}}>
    <div className="container">
      <div style={{textAlign:'center', marginBottom:'5rem'}}>
        <h2>خدمات مصممة <span className="text-gradient">للانطلاق</span></h2>
        <p style={{margin:'0 auto'}}>حلول تقنية وإبداعية شاملة تغطي كل زاوية من احتياجاتك.</p>
      </div>

      <div className="grid-3">
        {[
          {t:'تطوير الويب', d:'مواقع فائقة السرعة بتقنية Next.js.', i: Code},
          {t:'الهوية البصرية', d:'تصاميم تعكس جوهر علامتك.', i: Palette},
          {t:'تطبيقات الجوال', d:'تجربة مستخدم سلسة (iOS/Android).', i: Smartphone},
          {t:'التسويق الرقمي', d:'استراتيجيات نمو تعتمد على البيانات.', i: Megaphone},
          {t:'المتاجر الإلكترونية', d:'حلول بيع متكاملة وقابلة للتوسع.', i: ShoppingBag},
          {t:'تحسين محركات البحث', d:'تصدر النتائج الأولى في جوجل.', i: Search},
        ].map((s, idx) => (
          <div key={idx} className="glass-card">
            <div className="icon-wrapper"><s.i size={28} /></div>
            <h3>{s.t}</h3>
            <p>{s.d}</p>
            <div style={{marginTop:'auto', paddingTop:'1rem', display:'flex', alignItems:'center', gap:'5px', color: BRAND_COLORS.primary, fontWeight:'bold'}}>
              المزيد <ArrowUpRight size={16} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Pricing = () => (
  <section className="section" id="الأسعار">
    <div className="container">
      <div style={{textAlign:'center', marginBottom:'5rem'}}>
        <h2>استثمار ذكي <span className="text-gradient">لمستقبلك</span></h2>
        <p style={{margin:'0 auto'}}>باقات مرنة تناسب حجم طموحاتك، من الشركات الناشئة إلى المؤسسات الكبرى.</p>
      </div>

      <div className="grid-3">
        {/* Basic */}
        <div className="glass-card pricing-card">
          <div className="pricing-header">
            <h3>البداية</h3>
            <div className="price-tag">5,000 <span style={{fontSize:'1rem'}}>ر.س</span></div>
            <div className="price-period">مشروع لمرة واحدة</div>
          </div>
          <ul className="feature-list">
            {['تصميم صفحة هبوط واحدة', 'متجاوب مع الجوال', 'نموذج اتصال أساسي', 'دعم فني لمدة شهر'].map((f,i) => (
              <li key={i} className="feature-item"><CheckCircle size={16} color={BRAND_COLORS.secondary} /> {f}</li>
            ))}
          </ul>
          <button className="btn btn-outline" style={{width:'100%', marginTop:'2rem'}}>اختر الباقة</button>
        </div>

        {/* Pro */}
        <div className="glass-card pricing-card" style={{border:`2px solid ${BRAND_COLORS.primary}`, transform:'scale(1.05)', zIndex:2}}>
          <div className="popular-badge">الأكثر طلباً</div>
          <div className="pricing-header">
            <h3>النمو</h3>
            <div className="price-tag">12,000 <span style={{fontSize:'1rem'}}>ر.س</span></div>
            <div className="price-period">مشروع متكامل</div>
          </div>
          <ul className="feature-list">
            {['موقع متعدد الصفحات (5+)', 'نظام إدارة محتوى (CMS)', 'تحسين محركات البحث (Basic SEO)', 'ربط تحليلات جوجل', 'دعم فني 3 أشهر'].map((f,i) => (
              <li key={i} className="feature-item"><CheckCircle size={16} color={BRAND_COLORS.primary} /> {f}</li>
            ))}
          </ul>
          <button className="btn btn-primary" style={{width:'100%', marginTop:'2rem'}}>اختر الباقة</button>
        </div>

        {/* Enterprise */}
        <div className="glass-card pricing-card">
          <div className="pricing-header">
            <h3>المؤسسات</h3>
            <div className="price-tag">مخصص</div>
            <div className="price-period">حلول مخصصة</div>
          </div>
          <ul className="feature-list">
            {['تطوير منصات معقدة', 'تطبيقات جوال Native', 'استراتيجية تسويق شاملة', 'فريق مخصص', 'اتفاقية مستوى خدمة (SLA)'].map((f,i) => (
              <li key={i} className="feature-item"><CheckCircle size={16} color={BRAND_COLORS.secondary} /> {f}</li>
            ))}
          </ul>
          <button className="btn btn-outline" style={{width:'100%', marginTop:'2rem'}}>تواصل معنا</button>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer style={{background: BRAND_COLORS.dark, color:'white', paddingTop:'5rem'}}>
    <div className="container">
      <div className="grid-2" style={{alignItems:'start', marginBottom:'4rem'}}>
        <div>
          <div style={{fontSize:'2rem', fontWeight:'900', color:'white', marginBottom:'1.5rem'}}>AURA</div>
          <p style={{color: BRAND_COLORS.silver, maxWidth:'400px'}}>
            الوكالة الرقمية التي تثق بها العلامات التجارية الطموحة في المملكة. 
            نصنع الفرق من خلال الجودة، الابتكار، والنتائج الملموسة.
          </p>
          <div style={{display:'flex', gap:'1rem', marginTop:'2rem'}}>
            <div style={{width:40, height:40, background:'rgba(255,255,255,0.1)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}>X</div>
            <div style={{width:40, height:40, background:'rgba(255,255,255,0.1)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}>in</div>
          </div>
        </div>
        
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2rem'}}>
          <div>
            <h4 style={{color:'white', marginBottom:'1.5rem'}}>روابط</h4>
            {['الرئيسية', 'خدماتنا', 'أعمالنا', 'الوظائف'].map(l => (
              <a key={l} href="#" className="footer-link">{l}</a>
            ))}
          </div>
          <div>
            <h4 style={{color:'white', marginBottom:'1.5rem'}}>تواصل</h4>
            <div style={{color: BRAND_COLORS.silver, marginBottom:'0.5rem', display:'flex', alignItems:'center', gap:'10px'}}><Mail size={16}/> hello@aurateam3.com</div>
            <div style={{color: BRAND_COLORS.silver, marginBottom:'0.5rem', display:'flex', alignItems:'center', gap:'10px'}}><Phone size={16}/> +966 50 000 0000</div>
            <div style={{color: BRAND_COLORS.silver, display:'flex', alignItems:'center', gap:'10px'}}><MapPin size={16}/> الرياض، المملكة العربية السعودية</div>
          </div>
        </div>
      </div>
      
      <div style={{borderTop:'1px solid rgba(255,255,255,0.1)', padding:'2rem 0', textAlign:'center', color: BRAND_COLORS.silver, fontSize:'0.9rem'}}>
        © 2026 AURA Digital Agency. All rights reserved.
      </div>
    </div>
  </footer>
);

// =========================================
// 7. APP ENTRY POINT
// =========================================
export default function AuraWebsite() {
  const [introFinished, setIntroFinished] = useState(false);

  return (
    <>
      {/* 1. STYLES & SEO */}
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <Script id="json-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      
      {/* 2. CINEMATIC INTRO */}
      <AnimatePresence>
        {!introFinished && <Intro onComplete={() => setIntroFinished(true)} />}
      </AnimatePresence>

      {/* 3. MAIN APP (Revealed after intro) */}
      <div style={{opacity: introFinished ? 1 : 0, transition: 'opacity 1s ease'}}>
        
        {/* Fixed Background */}
        <AuraBackground />
        
        {/* Navigation */}
        <Navbar />
        
        <main>
          <Hero />
          <ClientMarquee />
          
          <section className="section" id="عن_أورا">
            <div className="container grid-2">
              <div>
                <div style={{color: BRAND_COLORS.primary, fontWeight:'700', marginBottom:'1rem'}}>عن أورا</div>
                <h2>فريق شغوف <span className="text-gradient">بالتميز</span></h2>
                <p>
                  نحن لسنا مجرد وكالة، نحن امتداد لفريقك. نؤمن بأن النجاح الرقمي يتطلب شراكة حقيقية، فهماً عميقاً للأهداف، وتنفيذاً لا يقبل المساومة على الجودة.
                </p>
                <div style={{display:'flex', gap:'2rem', marginTop:'2rem'}}>
                  <div>
                    <span style={{fontSize:'2.5rem', fontWeight:'900', color: BRAND_COLORS.primary}}>+50</span>
                    <div style={{color:'#64748b'}}>مشروع ناجح</div>
                  </div>
                  <div>
                    <span style={{fontSize:'2.5rem', fontWeight:'900', color: BRAND_COLORS.secondary}}>98%</span>
                    <div style={{color:'#64748b'}}>رضا العملاء</div>
                  </div>
                </div>
              </div>
              <div className="glass-card" style={{padding:'0', overflow:'hidden', minHeight:'400px'}}>
                {/* Image Placeholder */}
                <div style={{width:'100%', height:'100%', background:'linear-gradient(45deg, #f1f5f9, #e2e8f0)', display:'flex', alignItems:'center', justifyContent:'center'}}>
                  <span style={{color:'#94a3b8'}}>صورة الفريق / المكتب</span>
                </div>
              </div>
            </div>
          </section>

          <Services />
          
          {/* Methodology / Process */}
          <section className="section container">
            <div style={{textAlign:'center', marginBottom:'4rem'}}>
              <h2>كيف <span className="text-gradient">نعمل؟</span></h2>
            </div>
            <div className="grid-3">
              {[
                {s:'01', t:'الاكتشاف', d:'تحليل الاحتياجات والأهداف بدقة.'},
                {s:'02', t:'الاستراتيجية', d:'وضع خطة عمل وجدول زمني واضح.'},
                {s:'03', t:'التنفيذ', d:'التصميم والتطوير بأعلى معايير الجودة.'},
                {s:'04', t:'الإطلاق', d:'اختبار نهائي وإطلاق المشروع للعالم.'}
              ].map((step, i) => (
                <div key={i} className="glass-card" style={{textAlign:'center'}}>
                  <div style={{fontSize:'3rem', fontWeight:'900', color:'rgba(67, 143, 179, 0.1)', marginBottom:'-20px'}}>{step.s}</div>
                  <h3 style={{position:'relative'}}>{step.t}</h3>
                  <p>{step.d}</p>
                </div>
              ))}
            </div>
          </section>

          <Pricing />
          
          <section className="section container" id="تواصل">
            <div className="grid-2">
              <div>
                <h2>لنبدأ رحلة <span className="text-gradient">النجاح</span></h2>
                <p>هل لديك فكرة مشروع؟ أو ترغب في تطوير أعمالك الحالية؟ فريقنا جاهز للاستماع إليك وتقديم الحلول الأنسب.</p>
                
                <div style={{marginTop:'3rem'}}>
                  <div style={{display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1.5rem'}}>
                    <div style={{width:50, height:50, background:'white', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', border:`1px solid ${BRAND_COLORS.silver}`}}><Phone color={BRAND_COLORS.primary}/></div>
                    <div>
                      <div style={{fontSize:'0.9rem', color:'#64748b'}}>اتصل بنا</div>
                      <div style={{fontWeight:'700', fontSize:'1.1rem'}}>+966 50 000 0000</div>
                    </div>
                  </div>
                  <div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
                    <div style={{width:50, height:50, background:'white', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', border:`1px solid ${BRAND_COLORS.silver}`}}><Mail color={BRAND_COLORS.primary}/></div>
                    <div>
                      <div style={{fontSize:'0.9rem', color:'#64748b'}}>راسلنا</div>
                      <div style={{fontWeight:'700', fontSize:'1.1rem'}}>hello@aurateam3.com</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <ContactForm />
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
