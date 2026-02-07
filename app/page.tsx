'use client';

/**
 * AURA DIGITAL AGENCY - PLATINUM EDITION
 * * Color Palette:
 * Primary: #438FB3 (Ocean Blue)
 * Secondary: #58A8B4 (Teal/Cyan)
 * Neutral: #B3B7C1 (Silver Grey)
 * Background: White (#FFFFFF)
 */

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowUpRight, Megaphone, Palette, Search, ShoppingBag, Plus, 
  Menu, X, Globe, Zap, CheckCircle, Users, BarChart, Shield,
  MousePointerClick, Lightbulb, Layers, Rocket, Star, Code
} from 'lucide-react';
import Script from 'next/script';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// =========================================
// 1. SEO & METADATA (Structured Data)
// =========================================
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "AURA Digital Agency",
  "alternateName": "وكالة أورا الرقمية",
  "url": "https://aurateam3.com",
  "logo": "https://aurateam3.com/logo.png",
  "description": "نحول الأفكار إلى واقع رقمي مبهر. وكالة أورا متخصصة في تصميم الهوية، تطوير الويب، والتسويق الرقمي في السعودية.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Riyadh",
    "addressCountry": "SA"
  },
  "priceRange": "$$$"
};

// =========================================
// 2. DESIGN SYSTEM (CUSTOM CSS)
// =========================================
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Readex+Pro:wght@200;300;400;500;600;700;800&display=swap');
  
  /* FORCE LIGHT THEME & RESET */
  html, body {
    background-color: #ffffff !important;
    color: #0f172a !important;
    font-family: 'Readex Pro', sans-serif;
    margin: 0; padding: 0;
    overflow-x: hidden;
    direction: rtl;
    scroll-behavior: smooth;
  }

  :root {
    /* YOUR BRAND COLORS */
    --aura-blue: #438FB3;
    --aura-teal: #58A8B4;
    --aura-grey: #B3B7C1;
    
    /* SYSTEM COLORS */
    --bg-white: #ffffff;
    --bg-soft: #f8fafc;
    --text-main: #1e293b;
    --text-body: #475569;
    
    /* GLASSMOPRHISM */
    --glass-bg: rgba(255, 255, 255, 0.75);
    --glass-border: rgba(179, 183, 193, 0.3); /* Using your grey */
    --shadow-soft: 0 10px 40px -10px rgba(67, 143, 179, 0.15);
    --shadow-hover: 0 20px 50px -15px rgba(88, 168, 180, 0.25);
  }

  /* --- TYPOGRAPHY --- */
  h1, h2, h3, h4 { color: var(--text-main); font-weight: 800; line-height: 1.1; letter-spacing: -0.02em; }
  h1 { font-size: clamp(3rem, 7vw, 5.5rem); margin-bottom: 1.5rem; }
  h2 { font-size: clamp(2rem, 5vw, 3.5rem); margin-bottom: 1.5rem; }
  h3 { font-size: 1.5rem; margin-bottom: 1rem; }
  p { color: var(--text-body); font-size: 1.125rem; line-height: 1.8; margin-bottom: 1.5rem; max-width: 65ch; }
  
  .text-gradient {
    background: linear-gradient(135deg, var(--aura-blue) 0%, var(--aura-teal) 100%);
    -webkit-background-clip: text; color: transparent; display: inline-block;
  }
  
  .text-grey { color: var(--aura-grey); }

  /* --- LAYOUT UTILITIES --- */
  .container { max-width: 1300px; margin: 0 auto; padding: 0 1.5rem; position: relative; z-index: 10; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
  .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; }
  .section { padding: 8rem 0; position: relative; }
  .flex-center { display: flex; align-items: center; justify-content: center; }
  .flex-between { display: flex; align-items: center; justify-content: space-between; }

  /* --- CINEMATIC INTRO --- */
  .intro-overlay {
    position: fixed; inset: 0; z-index: 9999;
    background: #0f172a; /* Dark start for contrast */
    color: white;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center;
  }
  .intro-warning {
    font-size: 1.1rem; color: var(--aura-teal); margin-bottom: 2rem;
    display: flex; align-items: center; gap: 0.5rem;
    opacity: 0; transform: translateY(20px);
  }
  .intro-counter {
    font-size: 8rem; font-weight: 900; line-height: 1;
    background: linear-gradient(to bottom, white, var(--aura-grey));
    -webkit-background-clip: text; color: transparent;
  }
  .intro-bar-wrapper {
    width: 200px; height: 4px; background: rgba(255,255,255,0.1);
    margin-top: 2rem; border-radius: 4px; overflow: hidden;
  }
  .intro-bar { height: 100%; background: var(--aura-blue); width: 0%; }

  /* --- NAVBAR (CAPSULE) --- */
  .navbar {
    position: fixed; top: 25px; left: 50%; transform: translateX(-50%);
    width: 90%; max-width: 850px; z-index: 1000;
    padding: 0.8rem 1.5rem; border-radius: 100px;
    background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(20px);
    border: 1px solid var(--aura-grey);
    display: flex; justify-content: space-between; align-items: center;
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    transition: all 0.4s ease;
  }
  .navbar.scrolled {
    top: 15px; background: rgba(255, 255, 255, 0.95);
    border-color: var(--aura-blue);
    box-shadow: 0 10px 40px rgba(67, 143, 179, 0.15);
  }
  .nav-brand { font-size: 1.5rem; font-weight: 900; color: var(--aura-blue); letter-spacing: -1px; }
  .nav-links { display: flex; gap: 2rem; }
  .nav-link { 
    color: var(--text-main); font-weight: 600; font-size: 0.95rem; cursor: pointer;
    transition: 0.3s; text-decoration: none;
  }
  .nav-link:hover { color: var(--aura-blue); }

  /* --- BUTTONS --- */
  .btn {
    padding: 0.8rem 2rem; border-radius: 50px; border: none; cursor: pointer;
    font-weight: 700; font-size: 1rem; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: inline-flex; align-items: center; gap: 0.5rem;
  }
  .btn-primary {
    background: var(--aura-blue); color: white;
    box-shadow: 0 10px 20px -5px rgba(67, 143, 179, 0.4);
  }
  .btn-primary:hover {
    background: var(--aura-teal); transform: translateY(-3px);
    box-shadow: 0 15px 30px -5px rgba(88, 168, 180, 0.5);
  }
  .btn-outline {
    background: transparent; color: var(--text-main);
    border: 2px solid var(--aura-grey);
  }
  .btn-outline:hover {
    border-color: var(--aura-blue); color: var(--aura-blue);
  }

  /* --- CARDS & GLASS --- */
  .glass-card {
    background: white; border: 1px solid var(--glass-border);
    border-radius: 2rem; padding: 2.5rem;
    box-shadow: var(--shadow-soft); transition: 0.4s;
    height: 100%; display: flex; flex-direction: column;
  }
  .glass-card:hover {
    transform: translateY(-8px); border-color: var(--aura-teal);
    box-shadow: var(--shadow-hover);
  }
  .icon-box {
    width: 60px; height: 60px; border-radius: 1rem;
    background: linear-gradient(135deg, rgba(67, 143, 179, 0.1), rgba(88, 168, 180, 0.1));
    color: var(--aura-blue); display: flex; align-items: center; justify-content: center;
    margin-bottom: 1.5rem; transition: 0.3s;
  }
  .glass-card:hover .icon-box {
    background: var(--aura-blue); color: white; transform: rotate(-10deg) scale(1.1);
  }

  /* --- HERO SECTION --- */
  .hero-wrapper { 
    height: 100vh; display: flex; align-items: center; justify-content: center; 
    position: relative; overflow: hidden; text-align: center;
  }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 0.5rem;
    padding: 0.5rem 1.2rem; border-radius: 50px;
    background: rgba(67, 143, 179, 0.08); color: var(--aura-blue);
    font-weight: 600; font-size: 0.9rem; margin-bottom: 2rem;
    border: 1px solid rgba(67, 143, 179, 0.2);
  }

  /* --- SERVICES & PROCESS --- */
  .process-step {
    position: relative; padding-right: 3rem; margin-bottom: 3rem;
    border-right: 2px solid rgba(179, 183, 193, 0.2);
  }
  .process-marker {
    position: absolute; right: -11px; top: 0; width: 20px; height: 20px;
    background: white; border: 4px solid var(--aura-blue); border-radius: 50%;
  }
  .stat-card {
    text-align: center; padding: 2rem; background: var(--bg-soft); border-radius: 1.5rem;
  }
  .stat-num {
    font-size: 3.5rem; font-weight: 900; display: block;
    background: linear-gradient(to right, var(--aura-blue), var(--aura-teal));
    -webkit-background-clip: text; color: transparent;
  }

  /* --- WORKS SCROLL --- */
  .works-container {
    overflow-x: auto; display: flex; gap: 2rem; padding: 2rem 0 4rem;
    scrollbar-width: none;
  }
  .works-container::-webkit-scrollbar { display: none; }
  .work-card {
    min-width: 380px; height: 500px; border-radius: 2rem; overflow: hidden;
    position: relative; box-shadow: var(--shadow-soft); cursor: pointer; transition: 0.5s;
  }
  .work-card:hover { transform: scale(0.98); }
  .work-img { width: 100%; height: 100%; object-fit: cover; transition: 1s; }
  .work-card:hover .work-img { transform: scale(1.1); }
  .work-info {
    position: absolute; bottom: 0; left: 0; right: 0; padding: 2rem;
    background: linear-gradient(to top, rgba(15, 23, 42, 0.9), transparent);
    color: white; transform: translateY(20px); opacity: 0; transition: 0.4s;
  }
  .work-card:hover .work-info { transform: translateY(0); opacity: 1; }

  /* --- FAQ --- */
  .faq-item {
    border-bottom: 1px solid var(--aura-grey); margin-bottom: 1rem;
  }
  .faq-btn {
    width: 100%; display: flex; justify-content: space-between; align-items: center;
    padding: 1.5rem 0; background: none; border: none; color: var(--text-main);
    font-weight: 700; font-size: 1.1rem; cursor: pointer; text-align: right;
  }
  
  /* --- FOOTER --- */
  footer {
    background: #0f172a; color: white; padding: 6rem 0 2rem;
    margin-top: 6rem; position: relative; overflow: hidden;
  }
  .footer-link { color: var(--aura-grey); text-decoration: none; display: block; margin-bottom: 0.8rem; transition: 0.3s; }
  .footer-link:hover { color: var(--aura-teal); }

  /* --- RESPONSIVE --- */
  @media (max-width: 992px) {
    .grid-2 { grid-template-columns: 1fr; }
    .nav-links, .btn-navbar { display: none; }
    .mobile-only { display: block !important; }
    h1 { font-size: 3rem; }
  }
  .mobile-only { display: none; }
`;

// =========================================
// 3. INTRO COMPONENT (THE MARKETING HOOK)
// =========================================
const CinematicIntro = ({ onComplete }: { onComplete: () => void }) => {
  const [count, setCount] = useState(0);
  const containerRef = useRef(null);
  const warningRef = useRef(null);

  useEffect(() => {
    // 1. Show warning first
    gsap.to(warningRef.current, { opacity: 1, y: 0, duration: 1, delay: 0.5 });
    
    // 2. Hide warning
    gsap.to(warningRef.current, { opacity: 0, y: -20, duration: 0.5, delay: 3 });

    // 3. Start Counter after warning
    setTimeout(() => {
      const interval = setInterval(() => {
        setCount((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            // 4. Explosion Effect
            gsap.to(containerRef.current, {
              clipPath: "circle(0% at 50% 50%)",
              duration: 1.5,
              ease: "expo.inOut",
              onComplete: onComplete
            });
            return 100;
          }
          return prev + 1;
        });
      }, 25);
    }, 3500); // Wait for warning to finish
  }, []);

  return (
    <div ref={containerRef} className="intro-overlay" style={{clipPath: "circle(150% at 50% 50%)"}}>
      <div ref={warningRef} className="intro-warning">
        <Lightbulb size={24} color="#58A8B4" />
        <p>تنبيه: هالة "أورا" ساطعة جداً. يرجى خفض إضاءة الشاشة لتجربة بصرية مريحة.</p>
      </div>
      
      {count > 0 && (
        <div style={{position:'relative'}}>
          <div className="intro-counter">{count}%</div>
          <div className="intro-bar-wrapper">
            <div className="intro-bar" style={{width: `${count}%`}}></div>
          </div>
          <p style={{marginTop:'1rem', color:'#B3B7C1', letterSpacing:'2px'}}>LOADING EXPERIENCE</p>
        </div>
      )}
    </div>
  );
};

// =========================================
// 4. THREE.JS SCENE (AURA PARTICLES)
// =========================================
const AuraParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xffffff, 0.02); // White Fog
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particles Data
    const count = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    // Brand Colors for Particles
    const color1 = new THREE.Color('#438FB3'); // Blue
    const color2 = new THREE.Color('#58A8B4'); // Teal

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;

      // Mix colors
      const mixedColor = Math.random() > 0.5 ? color1 : color2;
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Material (Solid Circles for White BG)
    const material = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      particles.rotation.y += 0.001; // Gentle spin
      particles.rotation.x -= 0.0005;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize); renderer.dispose(); };
  }, []);

  return <canvas ref={canvasRef} style={{position:'absolute', top:0, left:0, zIndex:-1, width:'100%', height:'100%'}} />;
};

// =========================================
// 5. MAIN COMPONENTS
// =========================================

const Navbar = () => (
  <nav className="navbar">
    <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
      <div style={{width:12, height:12, background:'var(--aura-blue)', borderRadius:'50%'}}></div>
      <span className="nav-brand">AURA</span>
    </div>
    
    <div className="nav-links mobile-hidden" style={{display:'flex'}}>
      {['الرئيسية', 'منهجيتنا', 'الخدمات', 'أعمالنا'].map(item => (
        <a key={item} href={`#${item}`} className="nav-link">{item}</a>
      ))}
    </div>

    <div style={{display:'flex', gap:'1rem'}}>
      <button className="btn btn-primary mobile-hidden">ابدأ مشروعك</button>
      <button className="mobile-only" style={{background:'none', border:'none', cursor:'pointer'}}>
        <Menu color="#438FB3" />
      </button>
    </div>
  </nav>
);

const Hero = () => (
  <section className="hero-wrapper" id="الرئيسية">
    <AuraParticles />
    
    <div className="container">
      <motion.div initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} transition={{duration:1, delay:0.5}}>
        <div className="hero-badge">
          <Star size={16} fill="currentColor" /> الوكالة الرقمية الأسرع نمواً
        </div>
        
        <h1>
          نبتكر هالتك <span className="text-gradient">الرقمية</span><br/>
          بلمسة من المستقبل
        </h1>
        
        <p style={{margin:'0 auto 2.5rem'}}>
          في عالم رقمي مزدحم، تحتاج إلى أكثر من مجرد موقع. تحتاج إلى تجربة تأسر الحواس. 
          نحن في أورا ندمج جماليات التصميم مع ذكاء البيانات لنصنع لك علامة تجارية لا تُنسى.
        </p>

        <div className="flex-center" style={{gap:'1rem', flexWrap:'wrap'}}>
          <button className="btn btn-primary">
            احجز استشارة مجانية <ArrowUpRight size={18} />
          </button>
          <button className="btn btn-outline">
            استكشف أعمالنا
          </button>
        </div>

        {/* Abstract shapes using your colors */}
        <div style={{position:'absolute', top:'20%', left:'10%', width:'300px', height:'300px', background:'var(--aura-blue)', opacity:0.05, filter:'blur(80px)', borderRadius:'50%', zIndex:-1}}></div>
        <div style={{position:'absolute', bottom:'10%', right:'10%', width:'400px', height:'400px', background:'var(--aura-teal)', opacity:0.05, filter:'blur(80px)', borderRadius:'50%', zIndex:-1}}></div>
      </motion.div>
    </div>
  </section>
);

const Stats = () => (
  <section className="container" style={{marginBottom:'6rem'}}>
    <div className="grid-3" style={{gridTemplateColumns:'repeat(4, 1fr)'}}>
      {[
        {n: '+150', l: 'مشروع ناجح', i: CheckCircle},
        {n: '99%', l: 'رضا العملاء', i: Users},
        {n: '5+', l: 'سنوات خبرة', i: Zap},
        {n: '24/7', l: 'دعم فني', i: Shield},
      ].map((s, i) => (
        <div key={i} className="stat-card">
          <s.i size={32} color="var(--aura-teal)" style={{marginBottom:'1rem', marginInline:'auto'}} />
          <span className="stat-num">{s.n}</span>
          <span style={{color:'var(--text-body)', fontWeight:'600'}}>{s.l}</span>
        </div>
      ))}
    </div>
  </section>
);

const Services = () => (
  <section className="section" id="الخدمات" style={{background:'var(--bg-soft)'}}>
    <div className="container">
      <div style={{textAlign:'center', marginBottom:'4rem'}}>
        <h2>خدمات مصممة <span className="text-gradient">للنمو</span></h2>
        <p style={{margin:'0 auto'}}>حلول متكاملة تغطي كل جانب من جوانب تواجدك الرقمي.</p>
      </div>

      <div className="grid-3">
        {/* Service 1 */}
        <div className="glass-card">
          <div className="icon-box"><Palette size={28} /></div>
          <h3>الهوية البصرية والعلامة التجارية</h3>
          <p>نصنع لعلامتك التجارية شخصية بصرية فريدة (شعار، ألوان، خطوط) تعكس قيمك وتخاطب جمهورك المستهدف مباشرة.</p>
          <a href="#" style={{marginTop:'auto', color:'var(--aura-blue)', fontWeight:'bold', display:'flex', alignItems:'center', gap:'5px'}}>التفاصيل <ArrowUpRight size={16}/></a>
        </div>

        {/* Service 2 */}
        <div className="glass-card" style={{border:'2px solid var(--aura-blue)', transform:'scale(1.02)'}}>
          <div className="icon-box" style={{background:'var(--aura-blue)', color:'white'}}><Globe size={28} /></div>
          <h3>تطوير المواقع والتطبيقات</h3>
          <p>مواقع إلكترونية فائقة السرعة مبنية بأحدث تقنيات Next.js و React، متجاوبة مع جميع الأجهزة ومحسنة لمحركات البحث.</p>
          <a href="#" style={{marginTop:'auto', color:'var(--aura-blue)', fontWeight:'bold', display:'flex', alignItems:'center', gap:'5px'}}>التفاصيل <ArrowUpRight size={16}/></a>
        </div>

        {/* Service 3 */}
        <div className="glass-card">
          <div className="icon-box"><Megaphone size={28} /></div>
          <h3>التسويق الرقمي والنمو</h3>
          <p>استراتيجيات تسويقية تعتمد على البيانات. ندير حملاتك الإعلانية على جوجل ومنصات التواصل لضمان أعلى عائد استثمار (ROI).</p>
          <a href="#" style={{marginTop:'auto', color:'var(--aura-blue)', fontWeight:'bold', display:'flex', alignItems:'center', gap:'5px'}}>التفاصيل <ArrowUpRight size={16}/></a>
        </div>

        {/* Service 4 */}
        <div className="glass-card">
          <div className="icon-box"><ShoppingBag size={28} /></div>
          <h3>حلول التجارة الإلكترونية</h3>
          <p>نبني متاجر إلكترونية متكاملة (سلة، زد، أو مخصصة) تساعدك على بيع منتجاتك بسهولة وإدارة مخزونك بذكاء.</p>
          <a href="#" style={{marginTop:'auto', color:'var(--aura-blue)', fontWeight:'bold', display:'flex', alignItems:'center', gap:'5px'}}>التفاصيل <ArrowUpRight size={16}/></a>
        </div>

        {/* Service 5 */}
        <div className="glass-card">
          <div className="icon-box"><Search size={28} /></div>
          <h3>تحسين محركات البحث (SEO)</h3>
          <p>نضمن ظهور موقعك في النتائج الأولى في جوجل من خلال تحسين المحتوى والسرعة والروابط الخلفية.</p>
          <a href="#" style={{marginTop:'auto', color:'var(--aura-blue)', fontWeight:'bold', display:'flex', alignItems:'center', gap:'5px'}}>التفاصيل <ArrowUpRight size={16}/></a>
        </div>

        {/* Service 6 */}
        <div className="glass-card">
          <div className="icon-box"><Layers size={28} /></div>
          <h3>إدارة المحتوى الإبداعي</h3>
          <p>فريقنا من كتاب المحتوى والمصممين جاهز لإنشاء محتوى جذاب يروي قصتك ويحافظ على تفاعل جمهورك.</p>
          <a href="#" style={{marginTop:'auto', color:'var(--aura-blue)', fontWeight:'bold', display:'flex', alignItems:'center', gap:'5px'}}>التفاصيل <ArrowUpRight size={16}/></a>
        </div>
      </div>
    </div>
  </section>
);

const Methodology = () => (
  <section className="section" id="منهجيتنا">
    <div className="container grid-2">
      <div>
        <div style={{color:'var(--aura-blue)', fontWeight:'bold', marginBottom:'1rem'}}>كيف نعمل؟</div>
        <h2>منهجية أورا <span className="text-gradient">للنجاح</span></h2>
        <p>
          نحن لا نؤمن بالحلول الجاهزة. كل مشروع هو تحدٍ جديد نخوضه بمنهجية علمية واضحة تضمن النتائج.
        </p>
        
        <div style={{marginTop:'3rem'}}>
          {[
            {step: '01', title: 'الاكتشاف والتحليل', desc: 'نجلس معك لنفهم أهدافك، ثم نحلل السوق والمنافسين لنضع استراتيجية محكمة.'},
            {step: '02', title: 'التصميم والتطوير', desc: 'نبدأ برسم المخططات ثم نحولها لتصاميم واجهات مبهرة وكود برمجي نظيف.'},
            {step: '03', title: 'الاختبار والإطلاق', desc: 'نخضع المشروع لاختبارات أداء صارمة قبل إطلاقه للعالم.'},
            {step: '04', title: 'النمو والتحسين', desc: 'لا نتوقف هنا، نستمر في مراقبة الأداء وتحسين النتائج.'}
          ].map((s, i) => (
            <div key={i} className="process-step">
              <div className="process-marker"></div>
              <h3 style={{fontSize:'1.3rem', marginBottom:'0.5rem'}}>
                <span style={{color:'var(--aura-grey)', marginLeft:'10px'}}>{s.step}</span>
                {s.title}
              </h3>
              <p style={{marginBottom:0}}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{position:'relative', display:'flex', justifyContent:'center'}}>
        {/* Abstract Visual Representation of Process */}
        <div style={{width:'80%', height:'500px', background:'linear-gradient(135deg, #f1f5f9, white)', borderRadius:'2rem', border:'1px solid var(--aura-grey)', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden'}}>
           <div style={{position:'absolute', width:'300px', height:'300px', background:'var(--aura-blue)', filter:'blur(100px)', opacity:0.1}}></div>
           <Code size={120} color="var(--aura-grey)" style={{opacity:0.2}} />
        </div>
      </div>
    </div>
  </section>
);

const Works = () => (
  <section className="section" id="أعمالنا" style={{overflow:'hidden'}}>
    <div className="container">
      <div className="flex-between" style={{marginBottom:'3rem'}}>
        <div>
          <h2>قصص نجاح <span className="text-gradient">حقيقية</span></h2>
          <p>بعض مما أنجزناه لشركائنا الطموحين.</p>
        </div>
        <button className="btn btn-outline mobile-hidden">مشاهدة الكل</button>
      </div>
      
      <div className="works-container">
        {[
          {t:'مشروع نيوم', c:'تطوير منصة', i:'https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=600'},
          {t:'تطبيق العلا', c:'تجربة مستخدم', i:'https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?q=80&w=600'},
          {t:'موسم الرياض', c:'هوية بصرية', i:'https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?q=80&w=600'},
          {t:'البحر الأحمر', c:'موقع تعريفي', i:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600'},
        ].map((w, i) => (
          <div key={i} className="work-card">
            <img src={w.i} alt={w.t} className="work-img" />
            <div className="work-info">
              <span style={{color:'var(--aura-teal)', fontWeight:'bold', fontSize:'0.9rem', display:'block', marginBottom:'5px'}}>{w.c}</span>
              <h3 style={{color:'white', margin:0}}>{w.t}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FAQ = () => {
  const [open, setOpen] = useState<number | null>(0);
  const faqs = [
    {q: "كم تكلفة إنشاء موقع إلكتروني؟", a: "تعتمد التكلفة على نوع الموقع (تعريفي، متجر، منصة). لكننا نقدم باقات تنافسية تبدأ من أسعار مناسبة للشركات الناشئة مع ضمان الجودة."},
    {q: "كم تستغرق مدة التنفيذ؟", a: "في المتوسط، تستغرق المواقع التعريفية 2-3 أسابيع، والمتاجر الإلكترونية 4-6 أسابيع. نلتزم دائماً بالجدول الزمني المحدد في العقد."},
    {q: "هل تقدمون خدمة الدعم الفني بعد التسليم؟", a: "نعم، نقدم فترة دعم فني مجانية بعد الإطلاق، بالإضافة إلى باقات صيانة شهرية وسنوية لضمان استقرار موقعك."},
    {q: "هل يمكنني تعديل محتوى الموقع بنفسي؟", a: "بالتأكيد! نستخدم لوحات تحكم سهلة (CMS) ونوفر لك تدريباً كاملاً لتتمكن من إضافة وتعديل المحتوى والصور بسهولة."},
  ];

  return (
    <section className="container section" style={{maxWidth:'900px'}}>
      <div style={{textAlign:'center', marginBottom:'4rem'}}>
        <h2>الأسئلة <span className="text-gradient">الشائعة</span></h2>
      </div>
      <div className="glass-card" style={{padding:'1rem 2rem'}}>
        {faqs.map((f, i) => (
          <div key={i} className="faq-item">
            <button className="faq-btn" onClick={() => setOpen(open === i ? null : i)}>
              <span>{f.q}</span>
              <Plus size={20} color="var(--aura-blue)" style={{transform: open === i ? 'rotate(45deg)' : 'none', transition:'0.3s'}} />
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.div initial={{height:0, opacity:0}} animate={{height:'auto', opacity:1}} exit={{height:0, opacity:0}} style={{overflow:'hidden'}}>
                  <p style={{paddingBottom:'1.5rem', color:'var(--text-body)'}}>{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
};

const Footer = () => (
  <footer style={{background:'#0f172a', color:'white', padding:'6rem 0 2rem', marginTop:'4rem'}}>
    <div className="container">
      <div className="grid-2" style={{alignItems:'start', marginBottom:'4rem'}}>
        <div>
          <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'1.5rem'}}>
            <div style={{width:12, height:12, background:'var(--aura-blue)', borderRadius:'50%'}}></div>
            <span style={{fontSize:'1.8rem', fontWeight:'900', color:'white'}}>AURA</span>
          </div>
          <p style={{color:'#94a3b8', maxWidth:'400px'}}>
            شريكك الاستراتيجي في العالم الرقمي. نصنع مستقبلك اليوم بخبرات سعودية ومعايير عالمية.
          </p>
        </div>
        
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(150px, 1fr))', gap:'2rem'}}>
          <div>
            <h4 style={{color:'white', marginBottom:'1.5rem'}}>الخدمات</h4>
            <a href="#" style={{display:'block', color:'#94a3b8', marginBottom:'0.8rem', textDecoration:'none'}}>تطوير الويب</a>
            <a href="#" style={{display:'block', color:'#94a3b8', marginBottom:'0.8rem', textDecoration:'none'}}>المتاجر الإلكترونية</a>
            <a href="#" style={{display:'block', color:'#94a3b8', marginBottom:'0.8rem', textDecoration:'none'}}>التسويق الرقمي</a>
          </div>
          <div>
            <h4 style={{color:'white', marginBottom:'1.5rem'}}>الشركة</h4>
            <a href="#" style={{display:'block', color:'#94a3b8', marginBottom:'0.8rem', textDecoration:'none'}}>عن أورا</a>
            <a href="#" style={{display:'block', color:'#94a3b8', marginBottom:'0.8rem', textDecoration:'none'}}>الوظائف</a>
            <a href="#" style={{display:'block', color:'#94a3b8', marginBottom:'0.8rem', textDecoration:'none'}}>تواصل معنا</a>
          </div>
        </div>
      </div>
      
      <div style={{borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:'2rem', textAlign:'center', color:'#64748b', fontSize:'0.9rem'}}>
        © 2026 AURA Digital Agency. جميع الحقوق محفوظة.
      </div>
    </div>
  </footer>
);

// =========================================
// 6. APP ENTRY POINT
// =========================================
export default function AuraWebsite() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <Script id="json-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      <AnimatePresence>
        {!introDone && <CinematicIntro onComplete={() => setIntroDone(true)} />}
      </AnimatePresence>

      <div style={{opacity: introDone ? 1 : 0, transition: 'opacity 1s ease'}}>
        <Navbar />
        <main>
          <Hero />
          <Stats />
          <Methodology />
          <Services />
          <Works />
          <FAQ />
        </main>
        <Footer />
      </div>
    </>
  );
}
