'use client';

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * AURA DIGITAL AGENCY - ULTIMATE ENTERPRISE EDITION (v5.0 - STABLE)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * * ARCHITECTURE:
 * - Framework: React 19 / Next.js 15
 * - Styling: CSS-in-JS Engine (Performance Optimized)
 * - Motion: Framer Motion (DOM) + Three.js (WebGL Background)
 * - Icons: Lucide React
 * * * BRAND PALETTE:
 * - Primary (Ocean):   #438FB3 (Trust, Depth)
 * - Secondary (Teal):  #58A8B4 (Innovation, Flow)
 * - Neutral (Silver):  #B3B7C1 (Balance, Tech)
 * - Surface (White):   #FFFFFF (Clarity, Space)
 * - Ink (Deep Blue):   #0F172A (Readability, Authority)
 * * * UX PHILOSOPHY:
 * - "Zero-Layout-Shift" Loading
 * - "Adaptive-Bento" Grids
 * - "Silky-Smooth" Scroll Reveal
 */

import React, { useState, useEffect, useRef, useLayoutEffect, useMemo } from 'react';
import { 
  motion, AnimatePresence, useScroll, useTransform, useSpring, 
  useMotionValue, useMotionTemplate 
} from 'framer-motion';
import { 
  ArrowUpRight, Palette, Search, ShoppingBag, Menu, X,
  Megaphone, CheckCircle, Shield, Star, Code, Smartphone,
  Phone, Mail, MapPin, Zap, Send, Layout, BarChart, Users,
  Layers, Globe, MousePointer, Lightbulb, TrendingUp, Monitor,
  Cpu, Target, Anchor, Coffee, Award, Feather
} from 'lucide-react';
import Script from 'next/script';
import * as THREE from 'three';

// =========================================
// 1. DATA LAYER & CONFIGURATION
// =========================================

const BRAND = {
  colors: {
    primary: '#438FB3',
    secondary: '#58A8B4',
    grey: '#B3B7C1',
    dark: '#0f172a',
    bg: '#ffffff',
    introBg: '#0b1120' // Darker blue for intro
  },
  content: {
    hero: {
      badge: "الريادة الرقمية 2026",
      title: "نصنع هالة علامتك",
      highlight: "بذكاء المستقبل",
      desc: "في أورا، لا نكتفي بالتواجد الرقمي. نحن نبني منظومات ذكية تدمج سحر التصميم بدقة البيانات، لنضع علامتك التجارية في مكانة لا يجرؤ المنافسون على الوصول إليها."
    },
    intro: {
      warning: "تنبيه: سطوع بصري عالي الكثافة. هالة أورا تتوهج الآن.",
      loading: "جاري تحميل الأنظمة الإبداعية..."
    }
  }
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "AURA Digital Agency",
  "alternateName": "وكالة أورا القابضة",
  "url": "https://aurateam3.com",
  "logo": "https://aurateam3.com/logo.png",
  "description": "أورا هي الشريك الاستراتيجي للتحول الرقمي في السعودية، نقدم حلولاً في الذكاء الاصطناعي، التسويق، وتطوير المنصات.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Riyadh",
    "addressCountry": "SA"
  },
  "priceRange": "$$$"
};

// =========================================
// 2. CSS ENGINE (Global Styles)
// =========================================

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Readex+Pro:wght@200;300;400;500;600;700;800&display=swap');
  
  :root {
    --primary: ${BRAND.colors.primary};
    --secondary: ${BRAND.colors.secondary};
    --dark: ${BRAND.colors.dark};
    --grey: ${BRAND.colors.grey};
  }

  /* BASE */
  html, body {
    background-color: #ffffff;
    color: var(--dark);
    font-family: 'Readex Pro', sans-serif;
    margin: 0; padding: 0;
    overflow-x: hidden;
    direction: rtl;
    -webkit-font-smoothing: antialiased;
    scroll-behavior: smooth;
  }

  ::selection {
    background: var(--primary);
    color: white;
  }

  /* TYPOGRAPHY SCALE (Fluid Type) */
  h1 { 
    font-size: clamp(3.5rem, 8vw, 6.5rem); 
    line-height: 1.1; 
    font-weight: 800; 
    letter-spacing: -0.03em;
    margin-bottom: 1.5rem;
  }
  
  h2 { 
    font-size: clamp(2.2rem, 5vw, 4rem); 
    line-height: 1.2; 
    font-weight: 700; 
    letter-spacing: -0.02em;
    margin-bottom: 1.5rem;
  }
  
  h3 { font-size: 1.75rem; font-weight: 700; line-height: 1.4; margin-bottom: 1rem; }
  h4 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; }
  
  p { 
    color: #475569; 
    font-size: clamp(1rem, 1.2vw, 1.15rem); 
    line-height: 1.8; 
    margin-bottom: 1.5rem;
    max-width: 65ch;
  }

  .text-gradient {
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    -webkit-background-clip: text; color: transparent; display: inline-block;
  }

  /* LAYOUT UTILITIES */
  .container { 
    width: 100%; max-width: 1350px; 
    margin: 0 auto; padding: 0 clamp(1.5rem, 5vw, 4rem); 
    position: relative; z-index: 10; 
  }
  
  .section { 
    padding: clamp(6rem, 10vw, 10rem) 0; 
    position: relative; 
  }
  
  .full-screen {
    min-height: 100vh; display: flex; 
    align-items: center; justify-content: center;
  }

  /* GRIDS (Bento Style) */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(3rem, 5vw, 6rem); align-items: center; }
  .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2rem; }
  .grid-4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; }

  /* COMPONENTS */
  
  /* Navbar */
  .navbar {
    position: fixed; top: 25px; left: 50%; transform: translateX(-50%);
    width: 90%; max-width: 1000px; z-index: 1000;
    padding: 0.8rem 2rem; border-radius: 100px;
    background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(20px);
    border: 1px solid rgba(179, 183, 193, 0.3);
    box-shadow: 0 10px 40px -10px rgba(0,0,0,0.05);
    display: flex; justify-content: space-between; align-items: center;
    transition: all 0.4s ease;
  }
  .nav-link { 
    color: var(--dark); font-weight: 600; font-size: 0.95rem; cursor: pointer;
    transition: 0.3s; padding: 0.5rem 1rem; position: relative;
  }
  .nav-link::after {
    content: ''; position: absolute; bottom: 0; left: 50%; width: 0; height: 2px;
    background: var(--primary); transition: 0.3s; transform: translateX(-50%);
  }
  .nav-link:hover::after { width: 100%; }

  /* Buttons */
  .btn {
    padding: 1rem 2.5rem; border-radius: 50px; border: none; cursor: pointer;
    font-weight: 700; font-size: 1.05rem; transition: 0.3s;
    display: inline-flex; align-items: center; gap: 0.8rem; justify-content: center;
  }
  .btn-primary {
    background: var(--primary); color: white;
    box-shadow: 0 10px 30px -10px rgba(67, 143, 179, 0.4);
  }
  .btn-primary:hover {
    background: var(--secondary); transform: translateY(-3px);
    box-shadow: 0 20px 40px -10px rgba(88, 168, 180, 0.5);
  }
  .btn-outline {
    background: transparent; color: var(--dark); border: 2px solid #e2e8f0;
  }
  .btn-outline:hover {
    border-color: var(--primary); color: var(--primary);
  }

  /* Glass Cards */
  .glass-card {
    background: #ffffff; border: 1px solid rgba(179, 183, 193, 0.2);
    border-radius: 2rem; padding: 3rem; position: relative; overflow: hidden;
    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.02);
    transition: 0.4s; height: 100%; display: flex; flex-direction: column;
  }
  .glass-card:hover {
    transform: translateY(-8px); border-color: var(--secondary);
    box-shadow: 0 25px 50px -15px rgba(88, 168, 180, 0.15);
  }
  .icon-box {
    width: 70px; height: 70px; border-radius: 1.5rem;
    background: linear-gradient(135deg, rgba(67, 143, 179, 0.1), rgba(88, 168, 180, 0.1));
    color: var(--primary); display: flex; align-items: center; justify-content: center;
    margin-bottom: 2rem; transition: 0.3s;
  }
  .glass-card:hover .icon-box {
    background: var(--primary); color: white; transform: rotate(-10deg) scale(1.1);
  }

  /* Intro Overlay */
  .intro-overlay {
    position: fixed; inset: 0; z-index: 9999;
    background: ${BRAND.colors.introBg}; color: white;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center;
  }
  .intro-warning {
    color: var(--secondary); font-size: 1.1rem; margin-bottom: 2rem;
    padding: 0.8rem 2rem; border: 1px solid rgba(255,255,255,0.1); border-radius: 50px;
    background: rgba(0,0,0,0.2); backdrop-filter: blur(10px);
  }
  .intro-counter {
    font-size: 8rem; font-weight: 900; line-height: 1;
    background: linear-gradient(to bottom, white, #475569);
    -webkit-background-clip: text; color: transparent;
    font-variant-numeric: tabular-nums;
  }

  /* Form */
  .form-group { margin-bottom: 1.5rem; }
  .form-label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--dark); }
  .form-input {
    width: 100%; padding: 1.2rem; border-radius: 1rem; border: 1px solid #e2e8f0;
    font-family: inherit; font-size: 1rem; transition: 0.3s; background: #f8fafc;
  }
  .form-input:focus { outline: none; border-color: var(--primary); background: white; box-shadow: 0 0 0 4px rgba(67, 143, 179, 0.1); }

  /* Footer */
  footer { background: var(--dark); color: white; padding: 8rem 0 3rem; margin-top: 8rem; }
  .footer-link { color: #94a3b8; text-decoration: none; display: block; margin-bottom: 1rem; transition: 0.3s; }
  .footer-link:hover { color: var(--secondary); padding-right: 5px; }

  /* Utilities */
  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .desktop-only { display: none; }
  
  /* RESPONSIVE BREAKPOINTS */
  @media (min-width: 992px) {
    .desktop-only { display: flex; }
    .mobile-only { display: none !important; }
  }
  @media (max-width: 991px) {
    .grid-2, .grid-3 { grid-template-columns: 1fr; gap: 3rem; }
    .navbar { width: 92%; padding: 0.8rem 1.2rem; }
    h1 { font-size: 3rem; }
    .section { padding: 5rem 0; }
  }
`;

// =========================================
// 3. BACKGROUND ENGINE (Three.js Particles)
// =========================================

const ParticleBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xffffff, 0.002);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Particles - "The Aura Field"
    const geometry = new THREE.BufferGeometry();
    const count = 1500;
    const posArray = new Float32Array(count * 3);
    const colorArray = new Float32Array(count * 3);
    
    const color1 = new THREE.Color(BRAND.colors.primary);
    const color2 = new THREE.Color(BRAND.colors.secondary);

    for(let i = 0; i < count * 3; i+=3) {
      posArray[i] = (Math.random() - 0.5) * 150;   // x
      posArray[i+1] = (Math.random() - 0.5) * 150; // y
      posArray[i+2] = (Math.random() - 0.5) * 100; // z
      
      const mixedColor = Math.random() > 0.5 ? color1 : color2;
      colorArray[i] = mixedColor.r;
      colorArray[i+1] = mixedColor.g;
      colorArray[i+2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const material = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Animation
    let mouseX = 0;
    let mouseY = 0;
    
    const animate = () => {
      requestAnimationFrame(animate);
      particles.rotation.y += 0.001;
      particles.rotation.x += 0.0005;
      
      // Gentle mouse interaction
      particles.rotation.y += mouseX * 0.0005;
      particles.rotation.x += mouseY * 0.0005;

      renderer.render(scene, camera);
    };
    animate();

    // Handlers
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX - window.innerWidth / 2;
      mouseY = event.clientY - window.innerHeight / 2;
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', handleMouseMove);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} style={{position:'fixed', top:0, left:0, zIndex:-1, width:'100%', height:'100%', pointerEvents:'none'}} />;
};

// =========================================
// 4. UI COMPONENTS (The Building Blocks)
// =========================================

// --- A. Cinematic Intro ---
const IntroOverlay = ({ onComplete }: { onComplete: () => void }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 30); // 30ms * 50 steps = 1.5s loading time

    const timeout = setTimeout(onComplete, 2500); // Intro lasts 2.5s total
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
      transition={{ duration: 1, ease: 'easeInOut' }}
      className="intro-overlay"
    >
      <motion.div 
        initial={{ y: 20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}
        className="intro-warning"
      >
        <Lightbulb size={20} style={{display:'inline', marginLeft:'10px'}} />
        {BRAND.content.intro.warning}
      </motion.div>
      
      <div className="intro-counter">{count}%</div>
      
      <motion.div 
        className="text-silver"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.5 }}
      >
        {BRAND.content.intro.loading}
      </motion.div>
    </motion.div>
  );
};

// --- B. Navigation ---
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }} animate={{ y: 0 }} transition={{ delay: 2.5, type: 'spring' }}
        className="navbar"
      >
        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
          <div style={{width:12, height:12, background: BRAND.colors.primary, borderRadius:'50%'}}></div>
          <span style={{fontSize:'1.5rem', fontWeight:'800', color: BRAND.colors.dark}}>AURA</span>
        </div>

        <div className="desktop-only" style={{display:'flex', gap:'2rem'}}>
          {['الرئيسية', 'الخدمات', 'أعمالنا', 'المقالات', 'تواصل'].map(link => (
            <a key={link} href={`#${link}`} className="nav-link">{link}</a>
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
            transition={{ type: 'tween' }}
            style={{position:'fixed', inset:0, background:'white', zIndex:2000, padding:'2rem', display:'flex', flexDirection:'column'}}
          >
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'3rem'}}>
              <span style={{fontSize:'1.5rem', fontWeight:'bold'}}>القائمة</span>
              <button onClick={() => setIsOpen(false)} style={{background:'none', border:'none'}}><X size={32} /></button>
            </div>
            {['الرئيسية', 'الخدمات', 'أعمالنا', 'المقالات', 'تواصل'].map(link => (
              <a key={link} href={`#${link}`} onClick={() => setIsOpen(false)} style={{fontSize:'2rem', fontWeight:'bold', marginBottom:'2rem', textDecoration:'none', color:BRAND.colors.dark}}>{link}</a>
            ))}
            <button className="btn btn-primary" style={{marginTop:'auto'}}>تواصل معنا</button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// --- C. Hero Section ---
const Hero = () => {
  return (
    <section className="full-screen section" id="الرئيسية">
      <div className="container" style={{textAlign:'center'}}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8, duration: 1 }}
        >
          <div style={{display:'inline-flex', alignItems:'center', gap:'8px', padding:'0.5rem 1.5rem', background:'#f1f5f9', borderRadius:'50px', color: BRAND.colors.primary, fontWeight:'700', marginBottom:'2rem', border:`1px solid ${BRAND.colors.grey}30`}}>
            <Zap size={16} fill="currentColor" /> {BRAND.content.hero.badge}
          </div>
          
          <h1>
            {BRAND.content.hero.title} <br/>
            <span className="text-gradient">{BRAND.content.hero.highlight}</span>
          </h1>
          
          <p style={{margin:'0 auto 3rem'}}>
            {BRAND.content.hero.desc}
          </p>

          <div className="flex-center" style={{gap:'1.5rem', flexWrap:'wrap'}}>
            <button className="btn btn-primary">
              اكتشف خدماتنا <ArrowUpRight size={20} />
            </button>
            <button className="btn btn-outline">
              شاهد معرض الأعمال <Globe size={20} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// --- D. Bento Grid Services ---
const Services = () => {
  const services = [
    { title: "استراتيجيات التحول", desc: "نبني خارطة طريق رقمية تنقل عملك من التقليدية إلى الريادة.", icon: Target, col: "span 2" },
    { title: "الذكاء الاصطناعي", desc: "أتمتة العمليات ورفع الكفاءة.", icon: Cpu, col: "span 1" },
    { title: "تطوير المنصات", desc: "مواقع وتطبيقات فائقة السرعة.", icon: Code, col: "span 1" },
    { title: "التسويق بالأداء", desc: "حملات إعلانية مدروسة تحقق عائداً ملموساً.", icon: TrendingUp, col: "span 2" },
    { title: "صناعة الهوية", desc: "تصميم يعلق في الأذهان.", icon: Palette, col: "span 1" },
    { title: "إنتاج المحتوى", desc: "سرد قصصي يلهم الجمهور.", icon: Megaphone, col: "span 1" },
  ];

  return (
    <section className="section" id="الخدمات" style={{background: BRAND.colors.light}}>
      <div className="container">
        <div style={{textAlign:'center', marginBottom:'5rem'}}>
          <h2 style={{marginBottom:'1rem'}}>منظومة <span className="text-gradient">متكاملة</span></h2>
          <p style={{margin:'0 auto'}}>كل ما تحتاجه للنمو في مكان واحد، بتناغم تام.</p>
        </div>

        <div className="grid-3">
          {services.map((s, i) => (
            <motion.div 
              key={i}
              className="glass-card"
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

// --- E. Process & Methodology ---
const Process = () => {
  const steps = [
    { title: "الاكتشاف العميق", desc: "نجلس معك لنفهم جوهر عملك، تحدياتك، وطموحاتك." },
    { title: "الهندسة الاستراتيجية", desc: "نحول البيانات إلى خطة عمل واضحة المعالم والأهداف." },
    { title: "التنفيذ الإبداعي", desc: "فريقنا من الخبراء يبدأ في بناء الحلول بأعلى معايير الجودة." },
    { title: "الإطلاق والنمو", desc: "نرافقك بعد الإطلاق لضمان التحسين المستمر والنجاح." },
  ];

  return (
    <section className="section" id="المنهجية">
      <div className="container grid-2">
        <div>
          <div style={{color: BRAND.colors.primary, fontWeight:'bold', marginBottom:'1rem'}}>كيف نعمل؟</div>
          <h2>منهجية أورا <span className="text-gradient">للنجاح</span></h2>
          <p>
            نحن لا نؤمن بالصدفة. النجاح هو نتيجة عملية مدروسة بدقة، تجمع بين العلم والفن. منهجيتنا تضمن لك الشفافية في كل خطوة.
          </p>
          
          <div style={{marginTop:'3rem'}}>
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
                style={{position:'relative', paddingRight:'3rem', marginBottom:'3rem', borderRight:`2px solid ${BRAND.colors.grey}40`}}
              >
                <div style={{position:'absolute', right:'-11px', top:0, width:'20px', height:'20px', background:'white', border:`4px solid ${BRAND.colors.primary}`, borderRadius:'50%'}}></div>
                <h3 style={{fontSize:'1.4rem', marginBottom:'0.5rem'}}>{step.title}</h3>
                <p style={{marginBottom:0}}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="glass-card" style={{minHeight:'500px', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg, #fff, #f0f9ff)'}}>
          {/* Abstract Visualization */}
          <div style={{position:'relative'}}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
              <Layers size={200} color={BRAND.colors.grey} style={{opacity:0.2}} />
            </motion.div>
            <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)'}}>
              <Zap size={80} color={BRAND.colors.primary} fill="currentColor" style={{opacity:0.8}} />
            </div>
          </div>
        </div>
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
          { n: "+500M", l: "قيمة أصول رقمية" },
          { n: "98%", l: "نسبة رضا العملاء" },
          { n: "+120", l: "مشروع ناجح" },
          { n: "24/7", l: "دعم فني متواصل" }
        ].map((s, i) => (
          <motion.div 
            key={i}
            className="glass-card"
            style={{padding:'2rem'}}
            whileHover={{ scale: 1.05 }}
          >
            <span style={{display:'block', fontSize:'3rem', fontWeight:'900', color: BRAND.colors.primary, lineHeight:1}}>{s.n}</span>
            <span style={{color: '#64748b', fontWeight:'600'}}>{s.l}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// --- G. Contact Form ---
const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("تم استلام طلبك بنجاح! سيتواصل معك فريقنا قريباً.");
  };

  return (
    <section className="section container" id="تواصل">
      <div className="grid-2">
        <div>
          <h2>جاهز لتفعيل <span className="text-gradient">هالتك؟</span></h2>
          <p>
            لا تترك مكانك في المستقبل للمنافسين. تواصل معنا اليوم واحصل على استشارة مجانية لتحليل وضعك الرقمي الحالي.
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
              <div className="icon-box" style={{marginBottom:0, width:60, height:60}}><MapPin /></div>
              <div>
                <div style={{fontSize:'0.9rem', color: BRAND.colors.grey}}>زورونا في</div>
                <div style={{fontWeight:'700', fontSize:'1.2rem'}}>الرياض، المملكة العربية السعودية</div>
              </div>
            </div>
          </div>
        </div>

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
      </div>
    </section>
  );
};

// --- H. Footer ---
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
          <ParticleBackground />
          <Navbar />
          <main>
            <Hero />
            <Stats />
            <Services />
            <Process />
            <Contact />
          </main>
          <Footer />
        </motion.div>
      )}
    </>
  );
}
