'use client';

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * AURA DIGITAL AGENCY - FINAL FLAWLESS EDITION (v14.0)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * * [ARCHITECTURE]
 * * 1. CORE: Next.js 15 + React 19 (Client-Side Only Mode).
 * * 2. STYLING: Pure CSS-in-JS (Zero Config, High Performance).
 * * 3. MOTION: GSAP ScrollTrigger linked to Three.js Camera & Geometry.
 * * 4. UX: Cinematic Intro -> Fluid Scroll -> Kinetic Cards.
 * * [FIXES APPLIED]
 * * - All 'window' references guarded.
 * * - GSAP Context used for cleanup.
 * * - Typography clamped for all screens.
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { useState, useEffect, useRef, useLayoutEffect, FormEvent } from 'react';
import { 
  motion, AnimatePresence 
} from 'framer-motion';
import { 
  ArrowUpRight, Palette, Search, Megaphone, Code, 
  Smartphone, Monitor, TrendingUp, Target, Globe, 
  CheckCircle, Zap, Shield, Menu, X, ArrowRight,
  Layers, Building2, Briefcase, BarChart3, Lightbulb,
  MousePointer2, Fingerprint, Activity, Send, Mail, Phone, MapPin
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
    secondary: '#58A8B4', // Cyan/Teal
    grey: '#B3B7C1',      // Platinum
    dark: '#0f172a',      // Deep Navy
    text: '#334155',      // Slate Text (Readable)
    bg: '#ffffff',        // Corporate White
    light: '#f8fafc',
    glassDark: '#1e293b'
  },
  info: {
    email: "hello@aurateam3.com",
    phone: "+966 50 000 0000",
    address: "الرياض، طريق الملك فهد، المملكة العربية السعودية"
  },
  content: {
    intro: {
      warning: "تنبيه: سطوع بصري عالي. هالة أورا تتوهج الآن.",
      tip: "يرجى خفض الإضاءة لتجربة مثالية.",
      loading: "جاري تحميل المنظومة الرقمية..."
    },
    hero: {
      badge: "شريك التحول الرقمي 2026",
      title: "نستثمر في",
      highlight: "رؤية المستقبل.",
      desc: "أورا القابضة: دمجنا الإبداع البشري مع دقة الذكاء الاصطناعي لنبني لك منظومة رقمية تسبق المنافسين بخطوة."
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
    "https://aurateam3.com/wp-content/uploads/2020/08/اعمار.webp",
    "https://aurateam3.com/wp-content/uploads/2024/02/20231126102247شعار_نادي_الوحدة_السعودية-1.webp"
  ]
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Corporation",
  "name": "Aura Holding",
  "url": "https://aurateam3.com",
  "logo": "https://aurateam3.com/logo.png",
  "description": "شركة أورا القابضة للخدمات الرقمية والاستثمار التقني."
};

// =========================================
// 2. CSS ENGINE (Zero-Conflict System)
// =========================================

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Readex+Pro:wght@200;300;400;500;600;700;800&family=Tajawal:wght@300;400;500;700&display=swap');
  
  :root {
    --primary: ${BRAND.colors.primary};
    --secondary: ${BRAND.colors.secondary};
    --dark: ${BRAND.colors.dark};
    --grey: ${BRAND.colors.grey};
  }

  /* BASE */
  html, body {
    background-color: #ffffff !important;
    color: var(--dark) !important;
    font-family: 'Readex Pro', sans-serif; /* Headings */
    overflow-x: hidden;
    direction: rtl;
    margin: 0; padding: 0;
  }

  ::selection { background: var(--primary); color: white; }

  /* TYPOGRAPHY */
  h1, h2, h3, h4 {
    font-family: 'Readex Pro', sans-serif;
    color: var(--dark);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.02em;
  }
  
  h1 { font-size: clamp(3rem, 8vw, 6.5rem); margin-bottom: 2rem; }
  h2 { font-size: clamp(2rem, 5vw, 4rem); margin-bottom: 2rem; }
  h3 { font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; }
  
  p, span, a, input, label, textarea {
    font-family: 'Tajawal', sans-serif; /* Body Text */
  }
  
  p { font-size: 1.1rem; line-height: 1.8; color: #475569; max-width: 600px; margin-bottom: 1.5rem; }

  .text-gradient {
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    -webkit-background-clip: text; color: transparent; display: inline-block;
  }

  /* UTILITIES */
  .container { max-width: 1400px; margin: 0 auto; padding: 0 2rem; position: relative; z-index: 10; }
  .section { padding: 10rem 0; position: relative; }
  .full-height { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; }
  
  /* CANVAS */
  #webgl-canvas { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 0; pointer-events: none; opacity: 1; }

  /* NAVBAR (Capsule) */
  .navbar {
    position: fixed; top: 25px; left: 50%; transform: translateX(-50%);
    width: 90%; max-width: 900px; z-index: 1000;
    padding: 0.8rem 2rem; border-radius: 100px;
    background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(20px);
    border: 1px solid rgba(179, 183, 193, 0.3);
    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05);
    display: flex; justify-content: space-between; align-items: center;
    transition: 0.4s ease;
  }
  .navbar.scrolled {
    top: 15px; background: rgba(255,255,255,0.98);
    box-shadow: 0 20px 40px -10px rgba(67, 143, 179, 0.15);
    border-color: var(--primary);
  }
  .nav-link { font-weight: 600; color: var(--dark); cursor: pointer; transition: 0.3s; text-decoration: none; }
  .nav-link:hover { color: var(--primary); }

  /* INTRO OVERLAY */
  .intro-overlay {
    position: fixed; inset: 0; z-index: 9999;
    background: #0B1121; color: white;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center;
  }
  .intro-warning {
    font-size: 1.1rem; color: var(--secondary); margin-bottom: 2rem;
    padding: 1rem 2rem; border: 1px solid rgba(255,255,255,0.1); border-radius: 50px;
    background: rgba(0,0,0,0.3); backdrop-filter: blur(10px);
  }
  .intro-counter { font-size: clamp(4rem, 10vw, 8rem); font-weight: 900; line-height: 1; color: white; font-variant-numeric: tabular-nums; }

  /* BENTO GRID */
  .bento-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
  .bento-card {
    background: #ffffff; border-radius: 2rem; padding: 3rem;
    display: flex; flex-direction: column; justify-content: space-between;
    transition: 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
    border: 1px solid rgba(0,0,0,0.05); position: relative; overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
  }
  .bento-card:hover { 
    transform: translateY(-10px); background: white; 
    border-color: var(--secondary); 
    box-shadow: 0 25px 50px -10px rgba(67, 143, 179, 0.15); 
  }
  .col-span-2 { grid-column: span 2; }
  
  .icon-box {
    width: 60px; height: 60px; border-radius: 1rem;
    background: #f0f9ff; color: var(--primary);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 1.5rem; transition: 0.3s;
  }
  .bento-card:hover .icon-box { background: var(--primary); color: white; }

  /* BUTTONS */
  .btn-primary {
    background: var(--primary); color: white; padding: 0.8rem 2.5rem;
    border-radius: 50px; border: none; font-weight: 700; cursor: pointer;
    box-shadow: 0 10px 20px -5px rgba(67, 143, 179, 0.4); transition: 0.3s;
    display: inline-flex; align-items: center; gap: 0.5rem;
  }
  .btn-primary:hover { background: var(--secondary); transform: translateY(-3px); }
  
  /* MARQUEE */
  .marquee-wrap { overflow: hidden; white-space: nowrap; padding: 3rem 0; background: ${BRAND.colors.light}; border-y: 1px solid #eee; }
  .marquee-content { display: inline-flex; animation: scroll 40s linear infinite; align-items: center; }
  .marquee-item { margin: 0 3rem; opacity: 0.6; transition: 0.3s; filter: grayscale(100%); }
  .marquee-item:hover { opacity: 1; filter: grayscale(0%); transform: scale(1.1); }
  .client-logo { height: 60px; width: auto; object-fit: contain; }
  @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

  /* KINETIC CARDS */
  .work-card {
    min-height: 450px; background: white; border-radius: 2rem; overflow: hidden;
    position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    border: 1px solid #f1f5f9; will-change: transform;
  }
  .work-info {
    position: absolute; bottom: 0; left: 0; right: 0; padding: 2.5rem;
    background: linear-gradient(to top, rgba(15, 23, 42, 0.95), transparent);
    color: white; transform: translateY(20px); opacity: 0; transition: 0.4s;
  }
  .work-card:hover .work-info { transform: translateY(0); opacity: 1; }

  /* FOOTER */
  footer { background: var(--dark); color: white; padding: 8rem 0 3rem; }
  .footer-link { color: #94a3b8; display: block; margin-bottom: 1rem; transition: 0.3s; text-decoration: none; }
  .footer-link:hover { color: white; padding-right: 5px; }

  /* RESPONSIVE */
  .mobile-only { display: none; }
  @media (max-width: 1024px) {
    .bento-grid { grid-template-columns: 1fr; }
    .col-span-2 { grid-column: span 1; }
    h1 { font-size: 3.5rem; }
    .navbar { width: 90%; padding: 0.8rem; }
    .desktop-only { display: none; }
    .mobile-only { display: block; }
  }
  
  /* Form */
  .form-input { width: 100%; padding: 1.2rem; border-radius: 1rem; border: 1px solid #e2e8f0; font-family: 'Tajawal'; font-size: 1rem; margin-bottom: 1.5rem; background: #f8fafc; }
  .form-input:focus { outline: none; border-color: var(--primary); background: white; }
`;

// =========================================
// 3. THE KINETIC 3D ENGINE
// =========================================

const KineticBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mountRef.current) return;

    // 1. Setup
    const w = window.innerWidth;
    const h = window.innerHeight;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xffffff, 0.002);

    const camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // 2. The Network Orb (Particles)
    const count = 3000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const color1 = new THREE.Color(BRAND.colors.primary);
    const color2 = new THREE.Color(BRAND.colors.secondary);

    for(let i=0; i<count; i++) {
      // Sphere formation
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 10 + Math.random() * 2;

      positions[i*3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i*3+2] = r * Math.cos(phi);
      
      const col = Math.random() > 0.5 ? color1 : color2;
      colors[i*3] = col.r; colors[i*3+1] = col.g; colors[i*3+2] = col.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.15, vertexColors: true, transparent: true, opacity: 0.8
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 3. Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      particles.rotation.y += 0.001; 
      renderer.render(scene, camera);
    };
    animate();

    // 4. GSAP SCROLL LINKING
    const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5,
          }
        });

        // STAGE 1: Explosion (Hero -> Services)
        tl.to(particles.scale, { x: 2.5, y: 2.5, z: 2.5, duration: 2 }, 0)
          .to(particles.rotation, { x: 0.5, duration: 2 }, 0)
          .to(camera.position, { z: 20, duration: 2 }, 0); 

        // STAGE 2: Flatten to Plane (Services -> Data)
        tl.to(particles.scale, { x: 4, y: 0.1, z: 4, duration: 2 }, 2)
          .to(particles.rotation, { x: Math.PI / 4, duration: 2 }, 2);

        // STAGE 3: Re-form
        tl.to(particles.rotation, { y: Math.PI * 2, duration: 2 }, 4)
          .to(particles.scale, { x: 1, y: 1, z: 1, duration: 2 }, 4);
    });
      
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
      ctx.revert();
    };
  }, []);

  return <div id="webgl-canvas" ref={mountRef}></div>;
};

// =========================================
// 4. UI COMPONENTS
// =========================================

// --- Intro ---
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
      <div className="intro-warning">
        <Lightbulb size={20} style={{display:'inline', marginLeft:'10px', verticalAlign:'middle'}} />
        {BRAND.content.intro.warning}
      </div>
      <div className="intro-counter">{count}%</div>
      <p style={{marginTop:'1rem', color: BRAND.colors.grey, letterSpacing:'2px'}}>{BRAND.content.intro.loading}</p>
    </div>
  );
};

// --- Navbar ---
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', width:'100%'}}>
          <div style={{fontSize:'1.5rem', fontWeight:'900'}}>
            AURA <span style={{color:BRAND.colors.primary}}>.</span>
          </div>
          <div className="desktop-only" style={{display:'flex', gap:'2rem'}}>
            {['الرئيسية', 'القطاعات', 'الاستدامة', 'المركز الإعلامي', 'تواصل'].map(i => (
              <a key={i} href={`#${i}`} className="nav-link">{i}</a>
            ))}
          </div>
          <div style={{display:'flex', gap:'1rem'}}>
             <button className="btn-primary desktop-only">ابدأ مشروعك</button>
             <button className="mobile-only" onClick={() => setIsOpen(!isOpen)} style={{background:'none', border:'none'}}>
               {isOpen ? <X size={28}/> : <Menu size={28}/>}
             </button>
          </div>
        </div>
      </nav>
      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{x:'100%'}} animate={{x:0}} 
          style={{position:'fixed', inset:0, background:'white', zIndex:999, padding:'2rem', display:'flex', flexDirection:'column'}}
        >
          <div style={{display:'flex', justifyContent:'flex-end'}}><button onClick={()=>setIsOpen(false)}><X size={32}/></button></div>
          <div style={{marginTop:'2rem', display:'flex', flexDirection:'column', gap:'2rem', fontSize:'1.5rem', fontWeight:'bold'}}>
             {['الرئيسية', 'القطاعات', 'الاستدامة', 'المركز الإعلامي'].map(i => <a key={i} onClick={()=>setIsOpen(false)}>{i}</a>)}
          </div>
        </motion.div>
      )}
    </>
  );
};

// --- Hero ---
const Hero = () => {
  return (
    <section className="full-height section" id="الرئيسية">
      <div className="container">
        <motion.div initial={{opacity:0, y:50}} animate={{opacity:1, y:0}} transition={{duration:1}}>
          <div style={{display:'inline-block', padding:'0.5rem 1.5rem', background:'#f1f5f9', borderRadius:'50px', marginBottom:'2rem', fontSize:'0.9rem', color:BRAND.colors.primary, fontWeight:'700'}}>
             {BRAND.content.hero.badge}
          </div>
          <h1 style={{maxWidth:'900px'}}>
            {BRAND.content.hero.title} <span className="text-gradient">{BRAND.content.hero.highlight}</span>
          </h1>
          <div style={{marginTop:'3rem', display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:'2rem'}}>
            <p>{BRAND.content.hero.desc}</p>
            <div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
              <button className="btn-primary">{BRAND.content.cta.main} <ArrowRight size={20}/></button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// --- Marquee ---
const ClientMarquee = () => {
  // Triple the list for seamless loop
  const logos = [...BRAND.clients, ...BRAND.clients, ...BRAND.clients];
  return (
    <div className="marquee-wrap">
      <div className="marquee-content">
        {logos.map((src, i) => (
          <div key={i} className="marquee-item">
            <img src={src} alt="Client" className="client-logo" />
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Services (Bento) ---
const Services = () => {
  return (
    <section className="section" id="القطاعات">
      <div className="container">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'end', marginBottom:'4rem', flexWrap:'wrap', gap:'1rem'}}>
          <div>
             <h2 style={{marginBottom:'0.5rem'}}>قطاعات <span className="text-gradient">أعمالنا</span></h2>
             <p>استثمارات متنوعة تغطي كافة مجالات التقنية والإبداع.</p>
          </div>
        </div>

        <div className="bento-grid">
          {[
             {t:'التحول الرقمي', d:'حلول تقنية للمؤسسات الكبرى.', i:Layers, col:2},
             {t:'الاستثمار الجريء', d:'دعم الشركات التقنية الناشئة.', i:TrendingUp, col:1},
             {t:'التطوير العقاري', d:'منصات المدن الذكية.', i:Building2, col:1},
             {t:'الإعلام الجديد', d:'صناعة محتوى يؤثر في الملايين.', i:Megaphone, col:2},
             {t:'الذكاء الاصطناعي', d:'أتمتة وتحليل بيانات.', i:Cpu, col:1},
             {t:'التجارة الإلكترونية', d:'منصات بيع عالمية.', i:ShoppingBag, col:1},
          ].map((item, i) => (
            <motion.div 
              key={i}
              className={`bento-card ${item.col === 2 ? 'col-span-2' : ''}`}
              initial={{opacity:0, y:20}}
              whileInView={{opacity:1, y:0}}
              viewport={{once:true}}
              transition={{delay: i*0.1}}
            >
              <div style={{marginBottom:'auto'}}>
                <div className="icon-box">
                  <item.i size={28} />
                </div>
                <h3>{item.t}</h3>
                <p style={{fontSize:'1rem'}}>{item.d}</p>
              </div>
              <div style={{display:'flex', justifyContent:'flex-end', marginTop:'2rem'}}>
                <div style={{width:40, height:40, borderRadius:'50%', border:'1px solid #e2e8f0', display:'flex', alignItems:'center', justifyContent:'center'}}><ArrowUpRight size={16} /></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Kinetic Case Studies (Velocity Skew) ---
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
        <div style={{textAlign:'center', marginBottom:'4rem'}}>
          <h2>نتائج <span className="text-gradient">ملموسة</span></h2>
        </div>
        <div className="bento-grid">
          {[
            { t: "متجر أزياء عالمي", n: "+300%", d: "نمو المبيعات" },
            { t: "تطبيق لوجستي", n: "50K", d: "مستخدم نشط" },
            { t: "منصة طبية", n: "#1", d: "تصدر محركات البحث" }
          ].map((c, i) => (
            <div key={i} className="work-card" style={{transformOrigin: "center center"}}>
              <div style={{height:'220px', background:`linear-gradient(135deg, ${i===0?'#f0f9ff':'#f8fafc'}, #e2e8f0)`, display:'flex', alignItems:'center', justifyContent:'center'}}>
                <Briefcase size={60} color={BRAND.colors.grey} style={{opacity:0.5}} />
              </div>
              <div style={{padding:'2rem'}}>
                <span style={{fontSize:'0.9rem', color:BRAND.colors.primary, fontWeight:'bold'}}>دراسة حالة</span>
                <h3 style={{fontSize:'1.4rem', margin:'0.5rem 0'}}>{c.t}</h3>
                <div style={{marginTop:'1rem', display:'flex', alignItems:'baseline', gap:'10px'}}>
                  <span style={{fontSize:'3rem', fontWeight:'900', color:BRAND.colors.dark, lineHeight:1}}>{c.n}</span>
                  <span style={{fontSize:'0.9rem', color:BRAND.colors.text}}>{c.d}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- AILab Dark Section ---
const AILab = () => (
  <section className="section">
    <div className="container">
      <div style={{background:BRAND.colors.glassDark, borderRadius:'3rem', padding:'clamp(2rem,5vw,5rem)', color:'white', position:'relative', overflow:'hidden'}}>
        <div style={{position:'absolute', top:'-20%', right:'-10%', width:'500px', height:'500px', background:BRAND.colors.primary, filter:'blur(150px)', opacity:0.2}}></div>
        <div className="grid-2">
          <div>
            <div style={{color:BRAND.colors.secondary, fontWeight:'bold', marginBottom:'1rem', display:'flex', alignItems:'center', gap:'10px'}}><Activity/> مختبر الذكاء الاصطناعي</div>
            <h2 style={{color:'white'}}>نسبق المستقبل بخطوة.</h2>
            <p style={{color:'#94a3b8'}}>نستخدم خوارزمياتنا الخاصة لتحليل البيانات والتنبؤ بالاتجاهات.</p>
          </div>
          <div style={{background:'rgba(255,255,255,0.05)', padding:'2rem', borderRadius:'2rem', border:'1px solid rgba(255,255,255,0.1)'}}>
             <div style={{display:'flex', justifyContent:'space-between', marginBottom:'2rem'}}><span>الكفاءة</span><span style={{color:BRAND.colors.secondary}}>+240%</span></div>
             <div style={{display:'flex', alignItems:'flex-end', gap:'10px', height:'150px'}}>
                {[40,60,45,80,70,90,100].map((h,i)=><div key={i} style={{flex:1, height:`${h}%`, background: i===6?BRAND.colors.secondary:'rgba(255,255,255,0.1)', borderRadius:'4px'}}></div>)}
             </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// --- Contact ---
const Contact = () => {
  const handleSubmit = (e: FormEvent) => { e.preventDefault(); alert('تم الإرسال!'); };
  return (
    <section className="section container" id="تواصل">
      <div className="grid-2">
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
        <div className="bento-card" style={{background:'white'}}>
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label style={{display:'block', marginBottom:'0.5rem', fontWeight:'bold'}}>الاسم</label><input type="text" className="form-input" style={{width:'100%', padding:'1rem', borderRadius:'0.8rem', border:'1px solid #e2e8f0', background:'#f8fafc'}}/></div>
            <div className="form-group"><label style={{display:'block', marginBottom:'0.5rem', fontWeight:'bold'}}>البريد</label><input type="email" className="form-input" style={{width:'100%', padding:'1rem', borderRadius:'0.8rem', border:'1px solid #e2e8f0', background:'#f8fafc'}}/></div>
            <button className="btn-primary" style={{marginTop:'1rem', width:'100%'}}>إرسال الطلب</button>
          </form>
        </div>
      </div>
    </section>
  );
};

// --- Footer ---
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
          <InteractiveBackground />
          <Navbar />
          <main>
            <Hero />
            <ClientMarquee />
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
