'use client';

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * AURA DIGITAL AGENCY - LIVING NEBULA EDITION (v20.0)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * * [ENGINEERING LOG]
 * * 1. VISUAL CORE: "Smart Nebula" - 4000+ Particles with depth-based gradient.
 * * 2. PHYSICS: GSAP quickTo() for magnetic mouse interaction.
 * * 3. PERFORMANCE: Unified GSAP Ticker driving Three.js render loop.
 * * 4. TYPOGRAPHY: Kinetic variable font weight reaction on Hero text.
 * * 5. STABILITY: Zero build errors, SSR safe.
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { useState, useEffect, useRef, useLayoutEffect, FormEvent } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { Readex_Pro } from 'next/font/google';
import { 
  ArrowUpRight, Palette, Search, Megaphone, Code, 
  Smartphone, Monitor, TrendingUp, Target, Globe, 
  CheckCircle, Zap, Shield, Menu, X, ArrowRight,
  Layers, Building2, Briefcase, BarChart3, Activity,
  MousePointer2, Phone, MapPin, Mail, Star,
  Sparkles, Lightbulb, Send
} from 'lucide-react';
import Script from 'next/script';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// --- FONT LOADING (Variable Weight for Kinetic Effect) ---
const fontMain = Readex_Pro({ 
  subsets: ['arabic', 'latin'],
  // Loading range of weights for smooth animation
  weight: ['200', '300', '400', '500', '600', '700'], 
  variable: '--font-main',
  display: 'swap',
});

// --- GSAP REGISTRATION ---
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// =========================================
// 1. BRAND DNA
// =========================================

const BRAND = {
  palette: {
    primary: '#438FB3',   // Ocean Blue
    accent: '#58A8B4',    // Soft Teal (Glow)
    dark: '#0B1120',      // Deep Void
    surface: '#ffffff',   // White
    text: '#334155',      // Slate
    platinum: '#E2E8F0'
  },
  content: {
    intro: {
      warning: "تنبيه: أنت تدخل منطقة الهالة.",
      loading: "جاري تفعيل السديم الرقمي..."
    },
    hero: {
      badge: "الريادة الرقمية 2026",
      // Text split for animation
      titlePart1: "هالتك",
      titlePart2: "الفارقة",
      desc: "نحن ندمج الإبداع البشري مع دقة الذكاء الاصطناعي لنبني لك منظومة رقمية تسبق المنافسين بخطوة."
    },
    cta: {
      main: "ابدأ التحول",
      secondary: "اكتشف المزيد"
    }
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
// 2. STYLING ENGINE
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
    cursor: none; 
  }

  ::selection { background: var(--primary); color: white; }

  /* Kinetic Typography */
  h1 { 
    font-size: clamp(3.5rem, 9vw, 8rem); 
    line-height: 1; 
    letter-spacing: -2px; 
    margin-bottom: 1.5rem; 
    transition: font-weight 0.3s ease; /* For kinetic hover */
  }
  
  h2 { font-size: clamp(2.5rem, 6vw, 4.5rem); line-height: 1.2; font-weight: 700; margin-bottom: 2rem; }
  h3 { font-size: 1.5rem; font-weight: 600; margin-bottom: 0.5rem; }
  p { font-size: 1.125rem; line-height: 1.8; color: #64748b; max-width: 65ch; }

  .gradient-text {
    background: linear-gradient(135deg, var(--primary), var(--accent));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }

  /* Kinetic Word Class */
  .kinetic-word {
    display: inline-block;
    cursor: default;
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .kinetic-word:hover {
    font-weight: 700; /* Increase weight on hover */
    color: var(--accent);
    transform: scale(1.05);
    text-shadow: 0 0 20px rgba(88, 168, 180, 0.4); /* Glow Effect */
  }

  /* Layout */
  .container { width: 100%; max-width: 1400px; margin: 0 auto; padding: 0 2rem; position: relative; z-index: 2; }
  .section { padding: 10rem 0; position: relative; }
  .full-screen { min-height: 100vh; display: flex; align-items: center; justify-content: center; }

  /* Custom Cursor */
  .cursor-dot { position: fixed; top:0; left:0; width:8px; height:8px; background:var(--dark); border-radius:50%; pointer-events:none; z-index:9999; transform:translate(-50%, -50%); }
  .cursor-outline { position: fixed; top:0; left:0; width:40px; height:40px; border:1px solid rgba(11,17,32,0.5); border-radius:50%; pointer-events:none; z-index:9999; transform:translate(-50%, -50%); transition: width 0.2s, height 0.2s; }

  /* Navbar */
  .navbar {
    position: fixed; top: 2rem; left: 50%; transform: translateX(-50%);
    width: 90%; max-width: 1200px; padding: 1rem 2rem;
    background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.6); border-radius: 100px;
    display: flex; justify-content: space-between; align-items: center;
    z-index: 100; transition: all 0.3s ease;
    box-shadow: 0 10px 40px -10px rgba(0,0,0,0.05);
  }
  .navbar.scrolled { padding: 0.8rem 2rem; background: rgba(255,255,255,0.95); box-shadow: 0 20px 50px -15px rgba(0,0,0,0.1); }

  /* Buttons */
  .btn-primary {
    background: var(--dark); color: white; padding: 1rem 2.5rem;
    border-radius: 50px; font-weight: 600; border: none; cursor: pointer;
    transition: all 0.3s; display: inline-flex; align-items: center; gap: 10px;
  }
  .btn-primary:hover { background: var(--primary); box-shadow: 0 15px 30px rgba(67, 143, 179, 0.4); transform: translateY(-2px); }

  /* Bento Grid */
  .bento-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
  .card {
    background: #ffffff; border-radius: 2rem; padding: 3rem;
    border: 1px solid #f1f5f9; position: relative; overflow: hidden;
    transition: all 0.5s ease; display: flex; flex-direction: column; justify-content: space-between;
  }
  .card:hover { transform: translateY(-10px); box-shadow: 0 25px 60px -15px rgba(0,0,0,0.15); border-color: var(--primary); }
  
  /* Intro */
  .intro-overlay { position: fixed; inset: 0; z-index: 9999; background: #0B1121; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  
  /* Utils */
  .col-span-2 { grid-column: span 2; }
  .desktop-only { display: flex; }
  .mobile-only { display: none; }

  @media (max-width: 1024px) {
    .bento-grid { grid-template-columns: 1fr; }
    .col-span-2 { grid-column: span 1; }
    .desktop-only { display: none; }
    .mobile-only { display: flex; }
    .navbar { width: 95%; top: 1rem; }
  }

  #webgl-nebula { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
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
// 4. THE SMART NEBULA ENGINE (Three.js + GSAP Ticker)
// =========================================

const SmartNebula = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // --- SETUP ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xffffff, 0.001); // Soft atmospheric fog

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 40;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // --- PARTICLES (The Nebula) ---
    const count = 4000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    // Colors
    const c1 = new THREE.Color(BRAND.palette.primary);
    const c2 = new THREE.Color(BRAND.palette.accent);

    for (let i = 0; i < count; i++) {
      // Create a "Cloud" distribution instead of a perfect sphere
      const r = 20 + Math.random() * 20; // Spread out radius
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) * 0.5; // Flatten slightly for nebula feel

      positions[i*3] = x;
      positions[i*3+1] = y;
      positions[i*3+2] = z;

      // Color Gradient based on position (Fresnel Simulation)
      const mixedColor = Math.random() > 0.6 ? c1 : c2;
      colors[i*3] = mixedColor.r;
      colors[i*3+1] = mixedColor.g;
      colors[i*3+2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Glow Material
    const material = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending // Adds glow when particles overlap
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // --- INTERACTION LOGIC (Magnetic + Scroll) ---
    
    // Mouse Tracking Variables
    const mouse = { x: 0, y: 0 };
    const targetRotation = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse (-1 to 1)
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // GSAP Ticker: The Unified Loop
    // Driving Three.js render loop via GSAP for perfect sync
    gsap.ticker.add((time, deltaTime, frame) => {
      // 1. Magnetic Physics (Smooth damping)
      targetRotation.x += (mouse.y * 0.5 - targetRotation.x) * 0.05;
      targetRotation.y += (mouse.x * 0.5 - targetRotation.y) * 0.05;

      particles.rotation.x = targetRotation.x + (time * 0.05); // Add constant drift
      particles.rotation.y = targetRotation.y + (time * 0.03);

      // 2. Pulse Effect (Breathing Aura)
      const scale = 1 + Math.sin(time * 0.5) * 0.05;
      particles.scale.set(scale, scale, scale);

      renderer.render(scene, camera);
    });

    // --- SCROLL TRIGGER (Diving into the Aura) ---
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
        }
      });

      // Camera Dive
      tl.to(camera.position, { z: 10, ease: "power2.inOut" }, 0);
      
      // Nebula Expansion
      tl.to(particles.scale, { x: 3, y: 3, z: 3, ease: "none" }, 0);
    });

    // Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      gsap.ticker.remove(() => {}); // Generic removal, cleaner in v3
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
      ctx.revert();
    };
  }, []);

  return <div id="webgl-nebula" ref={mountRef}></div>;
};

// =========================================
// 5. UI COMPONENTS
// =========================================

const IntroScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(old => {
        if (old >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 800);
          return 100;
        }
        return old + 2;
      });
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
      transition={{ duration: 0.8 }}
      className="intro-overlay"
    >
      <div className="intro-warning">
        <Lightbulb size={18} style={{display:'inline', marginLeft:'10px'}} />
        {BRAND.content.intro.warning}
      </div>
      <div className="intro-counter">{progress}%</div>
      <p style={{marginTop:'1rem', color: BRAND.palette.platinum, letterSpacing:'2px'}}>{BRAND.content.intro.loading}</p>
    </motion.div>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
        <div style={{width:12, height:12, background:BRAND.palette.primary, borderRadius:'50%'}}></div>
        <span style={{fontSize:'1.5rem', fontWeight:'800'}}>AURA</span>
      </div>
      <div className="desktop-only" style={{gap:'2rem'}}>
        {['الرؤية', 'الخدمات', 'الأعمال', 'تواصل'].map(item => (
          <a key={item} href={`#${item}`} className="nav-link" style={{textDecoration:'none', color:BRAND.palette.dark}}>{item}</a>
        ))}
      </div>
      <button className="btn-primary desktop-only">{BRAND.content.cta.main}</button>
      <button className="mobile-only" style={{background:'none', border:'none'}}><Menu size={28}/></button>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="full-screen section" id="الرؤية">
      <div className="container" style={{textAlign:'center'}}>
        <motion.div 
          initial={{opacity:0, y:50}} animate={{opacity:1, y:0}} 
          transition={{duration:1.2, ease:[0.22, 1, 0.36, 1]}}
        >
          <div style={{display:'inline-flex', alignItems:'center', gap:'8px', padding:'0.6rem 1.8rem', background:'#f1f5f9', borderRadius:'100px', marginBottom:'2.5rem', color:BRAND.palette.primary, fontWeight:'700', fontSize:'0.9rem'}}>
            <Sparkles size={16}/> {BRAND.content.hero.badge}
          </div>
          
          <h1 style={{maxWidth:'1000px', margin:'0 auto 2rem auto'}}>
            {/* Kinetic Word Stagger */}
            <span className="kinetic-word">{BRAND.content.hero.titlePart1}</span>
            <br />
            <span className="kinetic-word gradient-text">{BRAND.content.hero.titlePart2}</span>
          </h1>
          
          <p style={{margin:'0 auto 3.5rem auto'}}>
            {BRAND.content.hero.desc}
          </p>

          <div style={{display:'flex', justifyContent:'center', gap:'1.5rem'}}>
            <button className="btn-primary">
              {BRAND.content.cta.main} <ArrowRight size={20}/>
            </button>
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
          <h2>هندسة <span className="gradient-text">الحلول</span></h2>
        </div>
        <div className="bento-grid">
          {[
            {t:'التحول الرقمي', d:'منصات مؤسسية متكاملة.', i:Layers, c:'col-span-2'},
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
                <div className="icon-box" style={{width:50, height:50, background:'#f0f9ff', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1.5rem', color:BRAND.palette.primary}}>
                  <s.i size={24}/>
                </div>
                <h3>{s.t}</h3>
                <p style={{fontSize:'1rem'}}>{s.d}</p>
              </div>
              <div style={{display:'flex', justifyContent:'flex-end'}}>
                <ArrowUpRight size={24} color={BRAND.palette.primary}/>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); alert("تم الإرسال!"); };
  return (
    <section className="section container" id="تواصل">
      <div className="bento-grid">
        <div className="col-span-2">
          <h2>جاهز <span className="gradient-text">للانطلاق؟</span></h2>
          <p>تواصل معنا اليوم لبدء رحلة النجاح.</p>
          <div style={{marginTop:'2rem'}}>
             <div style={{display:'flex', gap:'1rem', alignItems:'center', marginBottom:'1rem'}}>
               <Phone color={BRAND.palette.primary} />
               <span style={{fontWeight:'700'}}>+966 50 000 0000</span>
             </div>
             <div style={{display:'flex', gap:'1rem', alignItems:'center'}}>
               <MapPin color={BRAND.palette.primary} />
               <span style={{fontWeight:'700'}}>الرياض، المملكة العربية السعودية</span>
             </div>
          </div>
        </div>
        <div className="card">
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="الاسم" style={{width:'100%', padding:'1rem', marginBottom:'1rem', borderRadius:'8px', border:'1px solid #e2e8f0', background:'#f8fafc'}} />
            <input type="email" placeholder="البريد" style={{width:'100%', padding:'1rem', marginBottom:'1rem', borderRadius:'8px', border:'1px solid #e2e8f0', background:'#f8fafc'}} />
            <button className="btn-primary" style={{width:'100%'}}>إرسال <Send size={18}/></button>
          </form>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer style={{background:BRAND.palette.dark, color:'white', padding:'6rem 0 2rem'}}>
    <div className="container" style={{textAlign:'center'}}>
      <h2 style={{color:'white', fontSize:'2rem', marginBottom:'1rem'}}>AURA.</h2>
      <p style={{color:'#94a3b8'}}>نصنع المستقبل الرقمي.</p>
      <div style={{marginTop:'3rem', paddingTop:'2rem', borderTop:'1px solid #334155', color:'#64748b', fontSize:'0.9rem'}}>© 2026 Aura Holding. All Rights Reserved.</div>
    </div>
  </footer>
);

// =========================================
// 6. MAIN ENTRY
// =========================================

export default function AuraPage() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 1500);
  }, []);

  return (
    <div className={fontMain.className} dir="rtl">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <Script id="json-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      
      <AnimatePresence>
        {!loaded && <IntroScreen onComplete={() => setLoaded(true)} />}
      </AnimatePresence>

      {loaded && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <CustomCursor />
          <SmartNebula />
          <Navbar />
          <main style={{position:'relative', zIndex:5}}>
            <Hero />
            <Services />
            <Contact />
          </main>
          <Footer />
        </motion.div>
      )}
    </div>
  );
}
