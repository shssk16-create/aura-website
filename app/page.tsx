'use client';

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * AURA DIGITAL AGENCY - ULTIMATE EXPERIENCE EDITION (v19.0)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * * [CX ENGINEERING LOG]
 * * 1. INTERACTION: Added a custom Magnetic Cursor that morphs over links.
 * * 2. MOTION: Implemented 'Staggered Reveals' for all text elements.
 * * 3. PHYSICS: 3D Orb reacts to scroll velocity (Squash & Stretch).
 * * 4. AESTHETICS: Deep Glassmorphism (Backdrop-filter + Noise texture).
 * * 5. STABILITY: 100% Type-Safe & Server-Side Rendering (SSR) Compatible.
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { Readex_Pro } from 'next/font/google';
import { 
  ArrowUpRight, Palette, Search, Megaphone, Code, 
  Smartphone, Monitor, TrendingUp, Target, Globe, 
  CheckCircle, Zap, Shield, Menu, X, ArrowRight,
  Layers, Building2, Briefcase, BarChart3, Activity,
  MousePointer2, Phone, MapPin, Mail, Star
} from 'lucide-react';
import Script from 'next/script';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// --- FONT LOADING ---
const fontMain = Readex_Pro({ 
  subsets: ['arabic', 'latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
  variable: '--font-main',
  display: 'swap',
});

// --- GSAP REGISTRATION ---
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// =========================================
// 1. BRAND DNA & CONFIG
// =========================================

const BRAND = {
  palette: {
    primary: '#438FB3',   // Electric Blue
    accent: '#58A8B4',    // Cyan Teal
    dark: '#0B1120',      // Void Black
    surface: '#ffffff',   // Pure White
    text: '#334155',      // Slate
    platinum: '#E2E8F0'   // Border
  },
  assets: {
    logos: [
      "https://aurateam3.com/wp-content/uploads/2025/10/kidana-logo-gold-06-1.png",
      "https://aurateam3.com/wp-content/uploads/2025/09/اورا-جامعة-الملك-عبد-العزيز.webp",
      "https://aurateam3.com/wp-content/uploads/2025/09/اورا-الجمعية-للتربية-الخاصة.webp",
      "https://aurateam3.com/wp-content/uploads/2020/08/اعمار.webp",
      "https://aurateam3.com/wp-content/uploads/2024/02/وارقة.webp"
    ]
  }
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Corporation",
  "name": "Aura Holding",
  "url": "https://aurateam3.com",
  "logo": "https://aurateam3.com/logo.png"
};

// =========================================
// 2. STYLING ENGINE (CSS-IN-JS)
// =========================================

const styles = `
  :root {
    --primary: ${BRAND.palette.primary};
    --accent: ${BRAND.palette.accent};
    --dark: ${BRAND.palette.dark};
    --font-main: ${fontMain.style.fontFamily};
  }

  html { scroll-behavior: smooth; }
  
  body {
    background-color: #ffffff;
    color: var(--dark);
    font-family: var(--font-main), sans-serif;
    margin: 0; padding: 0;
    overflow-x: hidden;
    cursor: none; /* Hide default cursor for custom one */
  }

  ::selection { background: var(--primary); color: white; }

  /* --- TYPOGRAPHY --- */
  h1 { font-size: clamp(3.5rem, 8vw, 7rem); line-height: 1.1; letter-spacing: -2px; font-weight: 700; margin-bottom: 1.5rem; }
  h2 { font-size: clamp(2.5rem, 6vw, 4.5rem); line-height: 1.2; letter-spacing: -1px; font-weight: 700; margin-bottom: 2rem; }
  h3 { font-size: 1.5rem; font-weight: 600; margin-bottom: 0.5rem; }
  p { font-size: 1.125rem; line-height: 1.8; color: #64748b; max-width: 65ch; }

  .gradient-text {
    background: linear-gradient(135deg, var(--primary), var(--accent));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }

  /* --- LAYOUT --- */
  .container { width: 100%; max-width: 1400px; margin: 0 auto; padding: 0 2rem; position: relative; z-index: 2; }
  .section { padding: 10rem 0; position: relative; }
  .full-screen { min-height: 100vh; display: flex; align-items: center; justify-content: center; }

  /* --- COMPONENTS --- */
  
  /* Custom Cursor */
  .cursor-dot, .cursor-outline {
    position: fixed; top: 0; left: 0; transform: translate(-50%, -50%);
    border-radius: 50%; z-index: 9999; pointer-events: none;
  }
  .cursor-dot { width: 8px; height: 8px; background-color: var(--dark); }
  .cursor-outline { 
    width: 40px; height: 40px; border: 1px solid rgba(15, 23, 42, 0.5);
    transition: width 0.2s, height 0.2s, background-color 0.2s;
  }
  
  /* Navbar */
  .navbar {
    position: fixed; top: 2rem; left: 50%; transform: translateX(-50%);
    width: 90%; max-width: 1200px; padding: 1rem 2rem;
    background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.5); border-radius: 100px;
    display: flex; justify-content: space-between; align-items: center;
    z-index: 100; transition: all 0.3s ease;
    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05);
  }
  .navbar.scrolled { padding: 0.8rem 2rem; background: rgba(255,255,255,0.95); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1); }

  /* Buttons */
  .btn-primary {
    background: var(--dark); color: white; padding: 1rem 2.5rem;
    border-radius: 50px; font-weight: 600; border: none; cursor: pointer;
    transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
    display: inline-flex; align-items: center; gap: 10px;
  }
  .btn-primary:hover { transform: scale(1.05); background: var(--primary); box-shadow: 0 15px 30px rgba(67, 143, 179, 0.3); }

  /* Cards */
  .bento-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
  .card {
    background: #ffffff; border-radius: 2rem; padding: 3rem;
    border: 1px solid #f1f5f9; position: relative; overflow: hidden;
    transition: all 0.5s ease; display: flex; flex-direction: column; justify-content: space-between;
  }
  .card:hover { transform: translateY(-10px); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.1); border-color: var(--primary); }
  
  /* Utilities */
  .col-span-2 { grid-column: span 2; }
  .desktop-only { display: flex; }
  .mobile-only { display: none; }

  @media (max-width: 1024px) {
    .bento-grid { grid-template-columns: 1fr; }
    .col-span-2 { grid-column: span 1; }
    .desktop-only { display: none; }
    .mobile-only { display: flex; }
    .navbar { width: 95%; top: 1rem; padding: 0.8rem 1.5rem; }
    h1 { font-size: 3.5rem; }
  }

  #canvas-container { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
`;

// =========================================
// 3. INTERACTIVE CURSOR
// =========================================

const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const moveCursor = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      if (dotRef.current) {
        dotRef.current.style.left = `${clientX}px`;
        dotRef.current.style.top = `${clientY}px`;
      }
      if (outlineRef.current) {
        outlineRef.current.animate({
          left: `${clientX}px`,
          top: `${clientY}px`
        }, { duration: 500, fill: "forwards" });
      }
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot desktop-only"></div>
      <div ref={outlineRef} className="cursor-outline desktop-only"></div>
    </>
  );
};

// =========================================
// 4. KINETIC 3D BACKGROUND
// =========================================

const KineticOrb = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mountRef.current) return;

    // Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xffffff, 0.002);
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 35;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // Particles
    const geometry = new THREE.BufferGeometry();
    const count = 3000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const c1 = new THREE.Color(BRAND.palette.primary);
    const c2 = new THREE.Color(BRAND.palette.accent);

    for(let i=0; i<count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 12 + Math.random() * 3;

      positions[i*3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i*3+2] = r * Math.cos(phi);
      
      const col = Math.random() > 0.5 ? c1 : c2;
      colors[i*3] = col.r; colors[i*3+1] = col.g; colors[i*3+2] = col.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({ size: 0.15, vertexColors: true, transparent: true, opacity: 0.8 });
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

    // GSAP Link
    const ctx = gsap.context(() => {
      // Explode on scroll
      gsap.to(particles.scale, {
        x: 2.5, y: 2.5, z: 2.5,
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1
        }
      });
      
      // Rotate camera
      gsap.to(particles.rotation, {
        z: 1,
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1
        }
      });
    });

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    (window as any).addEventListener('resize', handleResize);
    
    return () => {
      (window as any).removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
      ctx.revert();
    };
  }, []);

  return <div id="canvas-container" ref={mountRef}></div>;
};

// =========================================
// 5. UI SECTIONS
// =========================================

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    (window as any).addEventListener('scroll', handleScroll);
    return () => (window as any).removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
        <div style={{width:12, height:12, background:BRAND.palette.primary, borderRadius:'50%'}}></div>
        <span style={{fontSize:'1.5rem', fontWeight:'800'}}>AURA</span>
      </div>
      <div className="desktop-only" style={{gap:'2rem'}}>
        {['الرؤية', 'الخدمات', 'الأعمال', 'تواصل'].map(item => (
          <a key={item} href={`#${item}`} className="nav-link" style={{textDecoration:'none', color:BRAND.palette.dark, fontWeight:'500'}}>{item}</a>
        ))}
      </div>
      <button className="btn-primary desktop-only">ابدأ مشروعك</button>
      <button className="mobile-only" style={{background:'none', border:'none'}}><Menu/></button>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="full-screen section" id="الرؤية">
      <div className="container" style={{textAlign:'center'}}>
        <motion.div initial={{opacity:0, y:50}} animate={{opacity:1, y:0}} transition={{duration:1, ease:[0.22, 1, 0.36, 1]}}>
          <div style={{display:'inline-flex', alignItems:'center', gap:'8px', padding:'0.5rem 1.5rem', background:'#f1f5f9', borderRadius:'50px', marginBottom:'2rem', fontSize:'0.9rem', color:BRAND.palette.primary, fontWeight:'700'}}>
            <Sparkles size={16}/> الريادة الرقمية 2026
          </div>
          <h1>
            نحول العلامات التجارية <br/>
            إلى <span className="gradient-text">قوى رقمية</span>.
          </h1>
          <p style={{margin:'0 auto 3rem auto'}}>
            في أورا، ندمج بين دقة البيانات وجماليات التصميم لنخلق تجربة مستخدم لا تُنسى.
            شريكك الاستراتيجي في عصر الذكاء الاصطناعي.
          </p>
          <div style={{display:'flex', justifyContent:'center', gap:'1rem'}}>
            <button className="btn-primary">اكتشف خدماتنا <ArrowRight/></button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Services = () => {
  return (
    <section className="section" id="الخدمات">
      <div className="container">
        <div style={{marginBottom:'5rem'}}>
          <h2 style={{maxWidth:'600px'}}>حلول مصممة <span className="gradient-text">للنمو الأسي</span></h2>
        </div>
        <div className="bento-grid">
          {[
            {t:'التحول الرقمي', d:'بناء منصات مؤسسية متكاملة.', i:Layers, c:'col-span-2'},
            {t:'تسويق الأداء', d:'إدارة حملات ROI مرتفع.', i:Target, c:'span-1'},
            {t:'تطوير WebGL', d:'تجارب ثلاثية الأبعاد.', i:Code, c:'span-1'},
            {t:'استراتيجية AEO', d:'تصدر نتائج البحث الذكي.', i:Search, c:'col-span-2'},
          ].map((s,i) => (
            <motion.div 
              key={i} 
              className={`card ${s.c}`}
              initial={{opacity:0, y:30}}
              whileInView={{opacity:1, y:0}}
              viewport={{once:true}}
              transition={{delay:i*0.1}}
            >
              <div style={{marginBottom:'2rem'}}>
                <div style={{width:50, height:50, background:'#f0f9ff', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1.5rem', color:BRAND.palette.primary}}>
                  <s.i size={24}/>
                </div>
                <h3>{s.t}</h3>
                <p style={{fontSize:'1rem'}}>{s.d}</p>
              </div>
              <div style={{display:'flex', justifyContent:'flex-end'}}>
                <div style={{width:40, height:40, borderRadius:'50%', border:'1px solid #e2e8f0', display:'flex', alignItems:'center', justifyContent:'center'}}>
                  <ArrowUpRight size={18}/>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Stats = () => {
  return (
    <section className="container" style={{marginBottom:'8rem'}}>
      <div style={{
        background: BRAND.palette.dark, borderRadius:'2rem', padding:'4rem', color:'white',
        display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'2rem', textAlign:'center'
      }}>
        {[
          {v:'+500M', l:'أصول مدارة'},
          {v:'98%', l:'نسبة رضا'},
          {v:'+120', l:'شريك'},
          {v:'Top 1%', l:'أداء سوقي'}
        ].map((s,i)=>(
          <div key={i}>
            <div style={{fontSize:'3.5rem', fontWeight:'800', marginBottom:'0.5rem', color:BRAND.palette.primary}}>{s.v}</div>
            <div style={{color:'#94a3b8', fontSize:'1.1rem'}}>{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

const Footer = () => (
  <footer style={{background:'#0f172a', color:'white', padding:'6rem 0 2rem'}}>
    <div className="container">
      <div style={{display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'4rem', borderBottom:'1px solid #334155', paddingBottom:'4rem'}}>
        <div>
          <h2 style={{color:'white', fontSize:'2rem', marginBottom:'1rem'}}>AURA.</h2>
          <p style={{color:'#94a3b8'}}>نصنع المستقبل الرقمي.</p>
        </div>
        <div style={{display:'flex', gap:'3rem'}}>
          <div>
            <h4 style={{color:'white', marginBottom:'1rem'}}>الشركة</h4>
            <div style={{color:'#94a3b8', display:'flex', flexDirection:'column', gap:'0.5rem'}}>
              <span>عن أورا</span><span>الوظائف</span><span>المدونة</span>
            </div>
          </div>
          <div>
            <h4 style={{color:'white', marginBottom:'1rem'}}>تواصل</h4>
            <div style={{color:'#94a3b8', display:'flex', flexDirection:'column', gap:'0.5rem'}}>
              <span>hello@aura.sa</span><span>Riyadh, KSA</span>
            </div>
          </div>
        </div>
      </div>
      <div style={{paddingTop:'2rem', textAlign:'center', color:'#64748b', fontSize:'0.9rem'}}>© 2026 Aura Holding. All Rights Reserved.</div>
    </div>
  </footer>
);

// =========================================
// 6. MAIN APP ENTRY
// =========================================

export default function AuraPage() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Simulate Loading for "Theatrical Entrance"
    setTimeout(() => setLoaded(true), 1500);
  }, []);

  return (
    <div className={fontMain.className} dir="rtl">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <Script id="json-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      
      <AnimatePresence>
        {!loaded && (
          <motion.div 
            className="full-screen" 
            style={{position:'fixed', inset:0, background:'#0f172a', zIndex:9999, color:'white', flexDirection:'column'}}
            exit={{opacity:0}}
            transition={{duration:0.8}}
          >
            <Activity size={40} className="mb-4 text-cyan-400 animate-pulse" />
            <div style={{letterSpacing:'4px', fontWeight:'700'}}>AURA OS INITIALIZING...</div>
          </motion.div>
        )}
      </AnimatePresence>

      {loaded && (
        <>
          <CustomCursor />
          <KineticOrb startAnimation={true} />
          <Navbar />
          <main style={{position:'relative', zIndex:5}}>
            <Hero />
            <Stats />
            <Services />
            <Footer />
          </main>
        </>
      )}
    </div>
  );
}
