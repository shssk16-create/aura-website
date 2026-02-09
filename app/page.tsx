'use client';

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * AURA DIGITAL AGENCY - HAMAH INSPIRED EDITION (v13.0)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * * [ENGINEERING PHILOSOPHY: "KINETIC CONVERGENCE"]
 * * Inspired by Hamah.sa, this build focuses on the seamless marriage of
 * * DOM elements (HTML) and WebGL (Three.js) driven by a single timeline (GSAP).
 * * * [CORE MECHANICS]
 * * 1. THE NETWORK ORB: A 3D structure representing "Connection".
 * * 2. SCROLL-DRIVEN ORCHESTRATION: 
 * - Scroll 0%: Orb is compact (Hero State).
 * - Scroll 30%: Orb expands/explodes (Services State).
 * - Scroll 60%: Orb flattens into a plane (Data State).
 * - Scroll 100%: Orb reforms into a tight core (Footer State).
 * * 3. LUXURY UI: Minimalist, clean typography, vast whitespace.
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowUpRight, Palette, Search, Megaphone, Code, 
  Smartphone, Monitor, TrendingUp, Target, Globe, 
  CheckCircle, Zap, Shield, Menu, X, ArrowRight 
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
// 1. BRAND CONFIGURATION
// =========================================

const BRAND = {
  colors: {
    primary: '#438FB3',   // Aura Blue
    secondary: '#58A8B4', // Cyan
    dark: '#0f172a',      // Deep Navy
    text: '#1e293b',      // Slate Text
    bg: '#ffffff',        // Corporate White
    light: '#f8fafc',
  },
  content: {
    hero: {
      title: "أورا القابضة",
      subtitle: "الاستثمار في رؤية المستقبل الرقمي.",
      desc: "نحن لا نبني مواقع إلكترونية فحسب، بل نصيغ منظومات رقمية ذكية تتحدث لغة البيانات وتتنفس الإبداع."
    }
  }
};

// =========================================
// 2. CSS ENGINE (Hamah Style Typography)
// =========================================

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Alexandria:wght@100;300;400;500;700;900&display=swap');
  
  :root {
    --primary: ${BRAND.colors.primary};
    --dark: ${BRAND.colors.dark};
  }

  html, body {
    background-color: #ffffff;
    color: var(--dark);
    font-family: 'Alexandria', sans-serif; /* Hamah uses sharp geometric fonts */
    overflow-x: hidden;
    direction: rtl;
    margin: 0; padding: 0;
  }

  ::selection { background: var(--primary); color: white; }

  /* Typography */
  h1 { font-size: clamp(3rem, 8vw, 7rem); font-weight: 800; line-height: 1.1; letter-spacing: -2px; margin-bottom: 2rem; }
  h2 { font-size: clamp(2rem, 5vw, 4rem); font-weight: 700; line-height: 1.2; margin-bottom: 2rem; }
  h3 { font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem; }
  p { font-size: 1.1rem; line-height: 1.8; color: #475569; max-width: 600px; }

  /* Utilities */
  .container { max-width: 1400px; margin: 0 auto; padding: 0 2rem; position: relative; z-index: 10; }
  .section { padding: 10rem 0; position: relative; }
  .full-height { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; }
  
  /* Canvas Layer */
  #webgl-canvas { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 0; pointer-events: none; opacity: 0.6; }

  /* Navbar */
  .navbar {
    position: fixed; top: 0; left: 0; width: 100%; padding: 2rem 0; z-index: 100;
    transition: 0.4s; display: flex; justify-content: space-between; align-items: center;
  }
  .navbar.scrolled { background: rgba(255,255,255,0.9); backdrop-filter: blur(10px); padding: 1rem 0; border-bottom: 1px solid #eee; }
  
  /* Bento Grid */
  .bento-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
  .bento-card {
    background: #f8fafc; border-radius: 2rem; padding: 3rem;
    display: flex; flex-direction: column; justify-content: space-between;
    transition: 0.4s; border: 1px solid transparent;
  }
  .bento-card:hover { transform: translateY(-10px); background: white; border-color: #e2e8f0; box-shadow: 0 20px 40px rgba(0,0,0,0.05); }
  .col-span-2 { grid-column: span 2; }

  /* Buttons */
  .btn-circle {
    width: 60px; height: 60px; border-radius: 50%; border: 1px solid #e2e8f0;
    display: flex; align-items: center; justify-content: center; transition: 0.3s; cursor: pointer;
  }
  .btn-circle:hover { background: var(--dark); color: white; border-color: var(--dark); }

  @media (max-width: 1024px) {
    .bento-grid { grid-template-columns: 1fr; }
    .col-span-2 { grid-column: span 1; }
  }
`;

// =========================================
// 3. THE 3D ENGINE (The "Hamah" Particle System)
// =========================================

const InteractiveBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<THREE.Points>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. Scene Setup
    const w = window.innerWidth;
    const h = window.innerHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 1000);
    camera.position.z = 30; // Initial Camera Position

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // 2. The "Network" Geometry (Complex Particle System)
    const count = 3000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const originalPositions = new Float32Array(count * 3); // Store for morphing
    const colors = new Float32Array(count * 3);

    const color1 = new THREE.Color(BRAND.colors.primary);
    const color2 = new THREE.Color(BRAND.colors.secondary);

    for(let i=0; i<count; i++) {
      // Sphere formation
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 10 + Math.random() * 2; // Radius

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i*3] = x;
      positions[i*3+1] = y;
      positions[i*3+2] = z;
      
      originalPositions[i*3] = x;
      originalPositions[i*3+1] = y;
      originalPositions[i*3+2] = z;

      const col = Math.random() > 0.5 ? color1 : color2;
      colors[i*3] = col.r; colors[i*3+1] = col.g; colors[i*3+2] = col.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.15, vertexColors: true, transparent: true, opacity: 0.8
    });

    const particles = new THREE.Points(geometry, material);
    particlesRef.current = particles;
    scene.add(particles);

    // 3. Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      particles.rotation.y += 0.001; // Constant idle rotation
      renderer.render(scene, camera);
    };
    animate();

    // 4. GSAP SCROLL LINKING (The Magic)
    // This creates the "Hamah" effect where 3D reacts to scroll
    if (typeof window !== 'undefined') {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5, // Smooth scrubbing
          }
        });

        // STAGE 1: Explosion (Hero -> Services)
        tl.to(particles.scale, { x: 2, y: 2, z: 2, duration: 2 }, 0)
          .to(particles.rotation, { x: 1, duration: 2 }, 0)
          .to(camera.position, { z: 20, duration: 2 }, 0); // Zoom in

        // STAGE 2: Flatten to Plane (Services -> Data)
        tl.to(geometry.attributes.position.array, {
          endArray: originalPositions.map((v, i) => i % 3 === 1 ? v * 0.1 : v * 2), // Flatten Y, Expand X
          onUpdate: () => { geometry.attributes.position.needsUpdate = true; },
          duration: 2
        }, 2);

        // STAGE 3: Chaos/Reassemble (Data -> Contact)
        tl.to(particles.rotation, { y: Math.PI * 4, duration: 2 }, 4)
          .to(particles.scale, { x: 0.5, y: 0.5, z: 0.5, duration: 2 }, 4);

      });
      
      return () => ctx.revert();
    }

    // Resize
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
  }, []);

  return <div id="webgl-canvas" ref={mountRef}></div>;
};

// =========================================
// 4. UI COMPONENTS
// =========================================

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container" style={{display:'flex', justifyContent:'space-between', width:'100%'}}>
        <div style={{fontSize:'1.5rem', fontWeight:'900'}}>AURA.</div>
        <div className="hidden md:flex gap-8">
          {['الرئيسية', 'القطاعات', 'الاستدامة', 'المركز الإعلامي'].map(i => (
            <a key={i} href="#" style={{textDecoration:'none', color:BRAND.colors.dark, fontWeight:'500'}}>{i}</a>
          ))}
        </div>
        <div className="btn-circle"><Menu size={20}/></div>
      </div>
    </nav>
  );
};

const Hero = () => (
  <section className="full-height section">
    <div className="container">
      <motion.div initial={{opacity:0, y:50}} animate={{opacity:1, y:0}} transition={{duration:1}}>
        <h1 style={{maxWidth:'900px'}}>
          نبتكر <span style={{color:BRAND.colors.primary}}>المستقبل الرقمي</span> <br/>
          اليوم.
        </h1>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:'2rem'}}>
          <p>{BRAND.content.hero.desc}</p>
          <div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
            <span style={{fontWeight:'700'}}>اكتشف خدماتنا</span>
            <div className="btn-circle" style={{background:BRAND.colors.dark, color:'white'}}><ArrowRight/></div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

const Services = () => (
  <section className="section">
    <div className="container">
      <div style={{marginBottom:'4rem'}}>
        <h2>قطاعات <span style={{color:BRAND.colors.primary}}>أعمالنا</span></h2>
      </div>
      <div className="bento-grid">
        {[
          {t:'التحول الرقمي', d:'بناء منصات ذكية للمؤسسات الكبرى.', col:2},
          {t:'الاستثمار الجريء', d:'دعم الشركات التقنية الناشئة.', col:1},
          {t:'الذكاء الاصطناعي', d:'حلول أتمتة وتحليل بيانات متقدمة.', col:1},
          {t:'الإعلام الجديد', d:'صناعة محتوى يؤثر في الملايين.', col:2},
        ].map((s, i) => (
          <div key={i} className={`bento-card ${s.col===2 ? 'col-span-2':''}`}>
            <div>
              <div style={{width:50, height:50, background:'white', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1.5rem', boxShadow:'0 4px 10px rgba(0,0,0,0.05)'}}>
                <Target color={BRAND.colors.primary} />
              </div>
              <h3>{s.t}</h3>
              <p style={{fontSize:'0.9rem'}}>{s.d}</p>
            </div>
            <div style={{marginTop:'2rem', display:'flex', justifyContent:'flex-end'}}>
              <div className="btn-circle" style={{width:40, height:40}}><ArrowUpRight size={16}/></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Stats = () => (
  <section className="section" style={{background:'#f8fafc'}}>
    <div className="container">
      <div className="bento-grid" style={{textAlign:'center'}}>
        {[
          {n:'+500M', l:'قيمة الأصول'},
          {n:'+120', l:'شريك استراتيجي'},
          {n:'2026', l:'رؤية المستقبل'}
        ].map((s,i)=>(
          <div key={i}>
            <span style={{fontSize:'4rem', fontWeight:'800', color:BRAND.colors.primary, display:'block'}}>{s.n}</span>
            <span style={{fontSize:'1.2rem', fontWeight:'600', color:'#64748b'}}>{s.l}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Contact = () => (
  <section className="section">
    <div className="container">
      <div className="bento-grid" style={{gridTemplateColumns:'1fr 1fr'}}>
        <div className="col-span-1">
          <h2>لنصنع الأثر معاً</h2>
          <p>هل تبحث عن شريك استراتيجي لتحقيق طموحاتك الرقمية؟</p>
        </div>
        <div className="bento-card" style={{background:'white', border:'1px solid #e2e8f0'}}>
          <form style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>
            <input type="text" placeholder="الاسم" style={{padding:'1rem', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'8px'}} />
            <input type="email" placeholder="البريد الإلكتروني" style={{padding:'1rem', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'8px'}} />
            <button style={{padding:'1rem', background:BRAND.colors.dark, color:'white', border:'none', borderRadius:'8px', fontWeight:'bold', cursor:'pointer'}}>إرسال</button>
          </form>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer style={{background:BRAND.colors.dark, color:'white', padding:'4rem 0'}}>
    <div className="container">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', paddingBottom:'4rem', borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
        <h2 style={{color:'white', margin:0}}>AURA.</h2>
        <div style={{display:'flex', gap:'2rem'}}>
          <span>Linkedin</span>
          <span>Twitter</span>
        </div>
      </div>
      <div style={{marginTop:'2rem', color:'#64748b', fontSize:'0.9rem'}}>© 2026 Aura Holding. All Rights Reserved.</div>
    </div>
  </footer>
);

// =========================================
// 5. MAIN ENTRY
// =========================================

export default function AuraHamahEdition() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <Script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js" strategy="beforeInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js" strategy="beforeInteractive" />
      
      {/* The Kinetic Core */}
      <InteractiveBackground />
      
      {/* Content Layer */}
      <main style={{position:'relative', zIndex:1}}>
        <Navbar />
        <Hero />
        <Stats />
        <Services />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
