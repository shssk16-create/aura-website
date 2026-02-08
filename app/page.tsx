'use client';

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * AURA DIGITAL AGENCY - RESPONSIVE MASTERPIECE (v6.0)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * * * RESPONSIVE ENGINE:
 * - Mobile-First Approach
 * - Adaptive Grids (1 -> 2 -> 3 cols)
 * - Touch-Optimized Interactions
 * * * TECH STACK:
 * - React 19 + Next.js 15
 * - Three.js (Optimized for Mobile GPU)
 * - Framer Motion (Guaranteed Animation)
 */

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { 
  ArrowUpRight, Palette, Search, ShoppingBag, Menu, X,
  Megaphone, CheckCircle, Shield, Star, Code, Smartphone,
  Phone, Mail, MapPin, Zap, Send, Layout, BarChart, Users,
  Globe, ChevronDown, Layers
} from 'lucide-react';
import Script from 'next/script';
import * as THREE from 'three';

// =========================================
// 1. CONFIGURATION & BRANDING
// =========================================

const BRAND = {
  colors: {
    primary: '#438FB3',
    secondary: '#58A8B4',
    grey: '#B3B7C1',
    dark: '#0f172a',
    light: '#f8fafc',
    white: '#ffffff'
  },
  info: {
    email: "hello@aurateam3.com",
    phone: "+966 50 000 0000"
  }
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "AURA Digital Agency",
  "url": "https://aurateam3.com",
  "description": "أورا: الوكالة الرقمية الأسرع نمواً في المملكة.",
  "address": { "@type": "PostalAddress", "addressCountry": "SA" }
};

// =========================================
// 2. CSS ENGINE (RESPONSIVE CORE)
// =========================================

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Readex+Pro:wght@200;300;400;500;600;700;800&display=swap');
  
  /* --- RESET & BASICS --- */
  html, body {
    background-color: #ffffff !important;
    color: #0f172a !important;
    font-family: 'Readex Pro', sans-serif;
    margin: 0; padding: 0;
    overflow-x: hidden;
    direction: rtl;
    -webkit-tap-highlight-color: transparent;
  }

  ::selection {
    background: ${BRAND.colors.primary};
    color: white;
  }

  /* --- TYPOGRAPHY (RESPONSIVE SCALE) --- */
  h1 { 
    font-size: clamp(2.5rem, 8vw, 5.5rem); 
    line-height: 1.1; 
    font-weight: 800; 
    color: ${BRAND.colors.dark};
    margin-bottom: 1.5rem;
    letter-spacing: -1px;
  }
  
  h2 { 
    font-size: clamp(1.8rem, 5vw, 3.5rem); 
    line-height: 1.2; 
    font-weight: 700; 
    color: ${BRAND.colors.dark};
    margin-bottom: 1rem;
  }
  
  h3 { 
    font-size: 1.5rem; 
    font-weight: 700; 
    margin-bottom: 0.8rem; 
  }
  
  p { 
    color: #475569; 
    font-size: clamp(1rem, 2vw, 1.15rem); 
    line-height: 1.7; 
    margin-bottom: 1.5rem; 
    max-width: 65ch;
  }
  
  .text-gradient {
    background: linear-gradient(135deg, ${BRAND.colors.primary} 0%, ${BRAND.colors.secondary} 100%);
    -webkit-background-clip: text; color: transparent; display: inline-block;
  }

  /* --- LAYOUT SYSTEM --- */
  .container { 
    width: 100%; 
    max-width: 1280px; 
    margin: 0 auto; 
    padding: 0 1.5rem; 
    position: relative; 
    z-index: 10; 
  }
  
  .section { 
    padding: clamp(4rem, 8vw, 8rem) 0; 
    position: relative; 
  }
  
  /* Responsive Grids */
  .grid-2 { 
    display: grid; 
    grid-template-columns: 1fr; 
    gap: 3rem; 
    align-items: center; 
  }
  
  .grid-3 { 
    display: grid; 
    grid-template-columns: 1fr; 
    gap: 2rem; 
  }

  @media (min-width: 768px) {
    .grid-2 { grid-template-columns: 1fr 1fr; }
    .grid-3 { grid-template-columns: repeat(2, 1fr); }
  }
  
  @media (min-width: 1024px) {
    .grid-3 { grid-template-columns: repeat(3, 1fr); }
  }

  .flex-center { display: flex; align-items: center; justify-content: center; }
  .flex-between { display: flex; align-items: center; justify-content: space-between; }

  /* --- COMPONENTS --- */
  
  /* Canvas */
  #aura-canvas {
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    z-index: 0; pointer-events: none; opacity: 1;
  }

  /* Navbar */
  .navbar {
    position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
    width: 90%; max-width: 900px; z-index: 1000;
    padding: 0.8rem 1.5rem; border-radius: 100px;
    background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(20px);
    border: 1px solid rgba(0,0,0,0.05);
    box-shadow: 0 10px 30px -5px rgba(0,0,0,0.05);
    display: flex; justify-content: space-between; align-items: center;
    transition: 0.3s;
  }
  
  /* Mobile Menu Drawer */
  .mobile-menu {
    position: fixed; inset: 0; background: white; z-index: 2000;
    padding: 2rem; display: flex; flex-direction: column; justify-content: center;
    transform: translateY(-100%); transition: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .mobile-menu.open { transform: translateY(0); }
  .mobile-link {
    font-size: 2rem; font-weight: 800; color: ${BRAND.colors.dark};
    margin-bottom: 1.5rem; text-decoration: none; text-align: center;
  }

  /* Buttons */
  .btn {
    padding: 0.8rem 2rem; border-radius: 50px; border: none; cursor: pointer;
    font-weight: 700; font-size: 1rem; transition: 0.3s;
    display: inline-flex; align-items: center; gap: 0.5rem; justify-content: center;
    white-space: nowrap;
  }
  .btn-primary {
    background: ${BRAND.colors.primary}; color: white;
    box-shadow: 0 8px 20px -5px ${BRAND.colors.primary}60;
  }
  .btn-primary:hover {
    background: ${BRAND.colors.secondary}; transform: translateY(-2px);
  }
  .btn-outline {
    background: transparent; color: ${BRAND.colors.dark}; border: 2px solid #e2e8f0;
  }

  /* Cards */
  .glass-card {
    background: white; border: 1px solid #f1f5f9;
    border-radius: 1.5rem; padding: 2rem;
    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.03);
    transition: 0.3s; height: 100%;
  }
  .glass-card:hover {
    transform: translateY(-5px); border-color: ${BRAND.colors.primary}40;
    box-shadow: 0 20px 40px -10px rgba(67, 143, 179, 0.1);
  }
  .icon-box {
    width: 60px; height: 60px; border-radius: 1rem;
    background: #f0f9ff; color: ${BRAND.colors.primary};
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 1.5rem;
  }

  /* Intro */
  .intro-overlay {
    position: fixed; inset: 0; z-index: 9999; background: #0f172a; color: white;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
  }
  
  /* Marquee */
  .marquee-wrap { overflow: hidden; white-space: nowrap; padding: 2rem 0; background: ${BRAND.colors.light}; }
  .marquee-content { display: inline-flex; animation: scroll 25s linear infinite; }
  .marquee-item { margin: 0 2rem; font-size: 1.2rem; font-weight: 700; color: ${BRAND.colors.grey}; opacity: 0.7; }
  @keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }

  /* Form */
  .form-input {
    width: 100%; padding: 1rem; border-radius: 0.8rem; border: 1px solid #e2e8f0;
    font-family: inherit; font-size: 1rem; margin-bottom: 1rem; background: #f8fafc;
  }
  
  /* Footer */
  footer { background: #0f172a; color: white; padding: 4rem 0 2rem; margin-top: 4rem; }

  /* UTILS */
  .desktop-only { display: none; }
  @media (min-width: 992px) { 
    .desktop-only { display: flex; } 
    .mobile-trigger { display: none; }
  }
`;

// =========================================
// 3. LOGIC: ROBUST PARTICLES
// =========================================

const getParticlesData = (text: string, width: number, height: number) => {
  if (typeof document === 'undefined') return [];
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return [];
  
  // Use smaller canvas for mobile optimization
  const scale = window.innerWidth < 768 ? 0.5 : 1;
  const w = width * scale;
  const h = height * scale;
  
  canvas.width = w; canvas.height = h;
  ctx.fillStyle = '#000'; ctx.fillRect(0,0,w,h);
  ctx.fillStyle = '#fff'; ctx.font = `900 ${150 * scale}px Arial`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, w/2, h/2);
  
  const data = ctx.getImageData(0,0,w,h).data;
  const particles = [];
  const step = window.innerWidth < 768 ? 6 : 4; // Less particles on mobile
  
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      if (data[(y*w+x)*4] > 128) {
        particles.push({
          x: (x - w/2) * (0.06 / scale),
          y: -(y - h/2) * (0.06 / scale)
        });
      }
    }
  }
  return particles;
};

// =========================================
// 4. COMPONENTS
// =========================================

const Intro = ({ onComplete }: { onComplete: () => void }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 4; // Faster load
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className="intro-overlay"
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div style={{marginBottom:'1rem', color: BRAND.colors.secondary}}>LOADING EXPERIENCE</div>
      <div style={{fontSize:'5rem', fontWeight:'900', lineHeight:1}}>{count}%</div>
    </motion.div>
  );
};

const AuraScene = ({ startAnimation }: { startAnimation: boolean }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Setup
    const w = window.innerWidth;
    const h = window.innerHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 1000);
    camera.position.z = window.innerWidth < 768 ? 50 : 35; // Further back on mobile

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // Particles
    const textPoints = getParticlesData("AURA", 1000, 500);
    const count = textPoints.length + 1000;
    
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const c1 = new THREE.Color(BRAND.colors.primary);
    const c2 = new THREE.Color(BRAND.colors.secondary);

    for(let i=0; i<count; i++) {
      // Initialize spread
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

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      particles.rotation.y += 0.001;
      particles.rotation.x += 0.0005;
      renderer.render(scene, camera);
    };
    animate();

    // Morph Logic (Simple Lerp)
    if (startAnimation) {
      let progress = 0;
      const morph = () => {
        if (progress < 1) {
          progress += 0.01;
          const pos = geometry.attributes.position.array as Float32Array;
          
          for(let i=0; i<count; i++) {
            if (i < textPoints.length) {
              // Linear Interpolation manually
              pos[i*3] += (textPoints[i].x - pos[i*3]) * 0.05;
              pos[i*3+1] += (textPoints[i].y - pos[i*3+1]) * 0.05;
              pos[i*3+2] += (0 - pos[i*3+2]) * 0.05;
            }
          }
          geometry.attributes.position.needsUpdate = true;
          requestAnimationFrame(morph);
        }
      };
      setTimeout(morph, 500);
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

// --- C. UI COMPONENTS ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
          <div style={{width:12, height:12, background: BRAND.colors.primary, borderRadius:'50%'}}></div>
          <span style={{fontSize:'1.5rem', fontWeight:'900', color: BRAND.colors.dark}}>AURA</span>
        </div>
        
        <div className="desktop-only" style={{display:'flex', gap:'2rem'}}>
          {['الرئيسية', 'الخدمات', 'الأعمال', 'التواصل'].map(item => (
            <a key={item} href={`#${item}`} className="nav-link" style={{color: BRAND.colors.dark, fontWeight:'600', textDecoration:'none'}}>{item}</a>
          ))}
        </div>

        <div style={{display:'flex', gap:'1rem'}}>
          <button className="btn btn-primary desktop-only">ابدأ مشروعك</button>
          <button className="mobile-trigger" onClick={() => setIsOpen(true)} style={{background:'none', border:'none'}}>
            <Menu color={BRAND.colors.primary} size={28} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <button onClick={() => setIsOpen(false)} style={{position:'absolute', top:'2rem', right:'2rem', background:'none', border:'none'}}>
          <X size={32} />
        </button>
        {['الرئيسية', 'الخدمات', 'الأعمال', 'التواصل'].map(item => (
          <a key={item} href={`#${item}`} className="mobile-link" onClick={() => setIsOpen(false)}>{item}</a>
        ))}
        <button className="btn btn-primary" style={{marginTop:'2rem'}}>ابدأ مشروعك</button>
      </div>
    </>
  );
};

// --- D. SECTIONS (Using Framer Motion for Reliability) ---

const Hero = () => (
  <section className="section" id="الرئيسية" style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center'}}>
    <div className="container">
      <motion.div 
        initial={{opacity:0, y:30}} 
        animate={{opacity:1, y:0}} 
        transition={{duration:0.8, delay:0.5}}
      >
        <div style={{display:'inline-flex', alignItems:'center', gap:'8px', padding:'0.5rem 1.5rem', borderRadius:'50px', background:'#f1f5f9', color:BRAND.colors.primary, fontWeight:'700', marginBottom:'1.5rem', border:`1px solid ${BRAND.colors.grey}30`}}>
          <Zap size={16} fill="currentColor" /> الإصدار السادس
        </div>
        
        <h1>
          نحول الخيال إلى <span className="text-gradient">واقع رقمي</span>
        </h1>
        
        <p style={{margin:'0 auto 2.5rem'}}>
          في "أورا"، نبني تجارب رقمية متكاملة تتجاوز التوقعات، وتضع علامتك التجارية في المقدمة.
        </p>

        <div className="flex-center" style={{gap:'1rem', flexWrap:'wrap'}}>
          <button className="btn btn-primary">ابدأ الآن <ArrowUpRight size={18} /></button>
          <button className="btn btn-outline">أعمالنا</button>
        </div>
      </motion.div>
    </div>
  </section>
);

const Services = () => (
  <section className="section" id="الخدمات" style={{background: BRAND.colors.light}}>
    <div className="container">
      <motion.div 
        initial={{opacity:0}} 
        whileInView={{opacity:1}} 
        viewport={{once:true}} 
        style={{textAlign:'center', marginBottom:'4rem'}}
      >
        <h2>خدماتنا <span className="text-gradient">المتكاملة</span></h2>
        <p style={{margin:'0 auto'}}>حلول تقنية مصممة لنمو أعمالك.</p>
      </motion.div>

      <div className="grid-3">
        {[
          {t:'تطوير الويب', d:'مواقع فائقة السرعة.', i: Code},
          {t:'الهوية البصرية', d:'تصاميم تعكس علامتك.', i: Palette},
          {t:'تطبيقات الجوال', d:'تجربة مستخدم سلسة.', i: Smartphone},
          {t:'التسويق الرقمي', d:'استراتيجيات نمو ذكية.', i: Megaphone},
          {t:'المتاجر', d:'حلول بيع متكاملة.', i: ShoppingBag},
          {t:'SEO', d:'تصدر نتائج البحث.', i: Search},
        ].map((s, idx) => (
          <motion.div 
            key={idx} 
            className="glass-card"
            initial={{opacity:0, y:20}}
            whileInView={{opacity:1, y:0}}
            viewport={{once:true}}
            transition={{delay: idx * 0.1}}
          >
            <div className="icon-box"><s.i size={28} /></div>
            <h3>{s.t}</h3>
            <p>{s.d}</p>
            <div style={{marginTop:'auto', paddingTop:'1rem', color: BRAND.colors.primary, fontWeight:'bold', display:'flex', alignItems:'center', gap:'5px'}}>
              المزيد <ArrowUpRight size={16} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Stats = () => (
  <section className="container" style={{marginBottom:'6rem'}}>
    <div className="grid-3" style={{gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', textAlign:'center'}}>
      {[
        {n:'+150', l:'مشروع'}, {n:'99%', l:'رضا'}, {n:'5+', l:'سنوات'}, {n:'24/7', l:'دعم'}
      ].map((s,i) => (
        <motion.div 
          key={i} 
          className="glass-card" 
          style={{padding:'2rem'}}
          initial={{scale:0.9, opacity:0}}
          whileInView={{scale:1, opacity:1}}
          transition={{delay: i * 0.1}}
        >
          <span style={{fontSize:'3rem', fontWeight:'900', color: BRAND.colors.primary, display:'block'}}>{s.n}</span>
          <span style={{color: '#64748b', fontWeight:'600'}}>{s.l}</span>
        </motion.div>
      ))}
    </div>
  </section>
);

const Works = () => (
  <section className="section" id="أعمالنا">
    <div className="container">
      <div className="flex-between" style={{marginBottom:'3rem'}}>
        <h2>أحدث <span className="text-gradient">الأعمال</span></h2>
        <button className="btn btn-outline desktop-only">مشاهدة الكل</button>
      </div>
      
      <div className="grid-3">
        {[1, 2, 3].map((item) => (
          <motion.div 
            key={item} 
            className="glass-card" 
            style={{padding:0, overflow:'hidden', minHeight:'300px', background:'#f1f5f9'}}
            whileHover={{y:-10}}
          >
            <div style={{height:'200px', display:'flex', alignItems:'center', justifyContent:'center', background:'#e2e8f0'}}>
              <Layout size={40} color={BRAND.colors.grey} />
            </div>
            <div style={{padding:'1.5rem', background:'white'}}>
              <span style={{color:BRAND.colors.secondary, fontSize:'0.9rem', fontWeight:'bold'}}>تطوير ويب</span>
              <h3 style={{fontSize:'1.3rem', margin:'0.5rem 0'}}>اسم المشروع {item}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Contact = () => {
  return (
    <section className="section container" id="التواصل">
      <div className="grid-2">
        <div>
          <h2>جاهز لبدء <span className="text-gradient">مشروعك؟</span></h2>
          <p>املأ النموذج وسنتواصل معك خلال 24 ساعة.</p>
          <div style={{marginTop:'2rem'}}>
            <div style={{display:'flex', gap:'1rem', marginBottom:'1rem', alignItems:'center'}}>
              <div className="icon-box" style={{marginBottom:0, width:50, height:50}}><Phone /></div>
              <div style={{fontWeight:'bold'}}>{BRAND.info.phone}</div>
            </div>
            <div style={{display:'flex', gap:'1rem', alignItems:'center'}}>
              <div className="icon-box" style={{marginBottom:0, width:50, height:50}}><Mail /></div>
              <div style={{fontWeight:'bold'}}>{BRAND.info.email}</div>
            </div>
          </div>
        </div>
        
        <div className="glass-card">
          <form onSubmit={(e) => { e.preventDefault(); alert('Sent!'); }}>
            <input type="text" placeholder="الاسم" className="form-input" />
            <input type="email" placeholder="البريد" className="form-input" />
            <textarea placeholder="الرسالة..." className="form-input" style={{minHeight:'120px'}}></textarea>
            <button className="btn btn-primary" style={{width:'100%'}}>إرسال</button>
          </form>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer style={{background: BRAND.colors.dark, color:'white', padding:'4rem 0 2rem'}}>
    <div className="container" style={{textAlign:'center'}}>
      <h2 style={{color:'white'}}>AURA</h2>
      <p style={{color: BRAND.colors.grey}}>نصنع المستقبل الرقمي.</p>
      <div style={{marginTop:'3rem', borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:'2rem', fontSize:'0.9rem', color: BRAND.colors.grey}}>
        © 2026 AURA. All rights reserved.
      </div>
    </div>
  </footer>
);

// =========================================
// 5. MAIN ENTRY
// =========================================

export default function AuraWebsite() {
  const [introFinished, setIntroFinished] = useState(false);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <Script id="json-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      
      <AnimatePresence>
        {!introFinished && <Intro onComplete={() => setIntroFinished(true)} />}
      </AnimatePresence>

      {introFinished && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:1}}>
          <AuraScene startAnimation={introFinished} />
          <Navbar />
          <main>
            <Hero />
            <div className="marquee-wrap">
              <div className="marquee-content">
                {[...Array(10)].map((_, i) => <span key={i} className="marquee-item">CLIENT {i+1}</span>)}
              </div>
            </div>
            <Stats />
            <Services />
            <Works />
            <Contact />
          </main>
          <Footer />
        </motion.div>
      )}
    </>
  );
}
