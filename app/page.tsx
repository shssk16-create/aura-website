'use client';

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * AURA DIGITAL AGENCY - ENTERPRISE PLATINUM EDITION (v3.1 Stable)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { useState, useEffect, useRef, useLayoutEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowUpRight, Palette, Search, ShoppingBag, Menu, 
  Megaphone, CheckCircle, Shield, Star, Code, Smartphone,
  Phone, Mail, MapPin, Zap, Send
} from 'lucide-react';
import Script from 'next/script';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "AURA Digital Agency",
  "url": "https://aurateam3.com",
  "logo": "https://aurateam3.com/logo.png",
  "description": "وكالة أورا: نصنع تجارب رقمية استثنائية من خلال دمج الإبداع بالتكنولوجيا.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Riyadh",
    "addressCountry": "SA"
  },
  "priceRange": "$$$"
};

// =========================================
// 2. CSS ARCHITECTURE
// =========================================

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Readex+Pro:wght@200;300;400;500;600;700;800&display=swap');
  
  html, body {
    background-color: #ffffff !important;
    color: #0f172a !important;
    font-family: 'Readex Pro', sans-serif;
    margin: 0; padding: 0;
    overflow-x: hidden;
    direction: rtl;
    scroll-behavior: smooth;
  }

  ::selection { background: ${BRAND_COLORS.primary}; color: white; }

  h1, h2, h3, h4 { color: ${BRAND_COLORS.dark}; fontWeight: 800; line-height: 1.1; letter-spacing: -0.02em; }
  h1 { font-size: clamp(3.5rem, 8vw, 6.5rem); margin-bottom: 1.5rem; }
  h2 { font-size: clamp(2.5rem, 5vw, 4rem); margin-bottom: 1.5rem; }
  h3 { font-size: 1.75rem; margin-bottom: 1rem; }
  p { color: #475569; font-size: 1.125rem; line-height: 1.8; margin-bottom: 1.5rem; max-width: 65ch; }
  
  .text-gradient {
    background: linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.secondary} 100%);
    -webkit-background-clip: text; color: transparent; display: inline-block;
  }

  .container { max-width: 1300px; margin: 0 auto; padding: 0 clamp(1.5rem, 5vw, 3rem); position: relative; z-index: 2; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
  .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2rem; }
  .section { padding: 8rem 0; position: relative; }
  
  #aura-canvas { position: fixed; top: 0; left: 0; width: 100%; height: 100vh; z-index: 0; pointer-events: none; opacity: 0.6; }

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
  .navbar.scrolled { top: 15px; background: rgba(255, 255, 255, 0.98); border-color: ${BRAND_COLORS.primary}; }
  .nav-logo { font-size: 1.6rem; font-weight: 900; color: ${BRAND_COLORS.primary}; letter-spacing: -1px; display: flex; align-items: center; gap: 8px; }
  .nav-dot { width: 10px; height: 10px; background: ${BRAND_COLORS.secondary}; border-radius: 50%; }
  
  .nav-link { 
    color: ${BRAND_COLORS.dark}; font-weight: 600; font-size: 0.95rem; 
    cursor: pointer; text-decoration: none; padding: 0.5rem 1rem;
    transition: 0.3s; border-radius: 20px;
  }
  .nav-link:hover { color: ${BRAND_COLORS.primary}; background: rgba(67, 143, 179, 0.05); }

  .btn {
    padding: 1rem 2.5rem; border-radius: 50px; border: none; cursor: pointer;
    font-weight: 700; font-size: 1.05rem; transition: all 0.3s;
    display: inline-flex; align-items: center; gap: 0.5rem; justify-content: center;
  }
  .btn-primary { background: ${BRAND_COLORS.primary}; color: white; box-shadow: 0 10px 20px -5px rgba(67, 143, 179, 0.4); }
  .btn-primary:hover { background: ${BRAND_COLORS.secondary}; transform: translateY(-3px); }
  .btn-outline { background: transparent; color: ${BRAND_COLORS.dark}; border: 2px solid #e2e8f0; }
  .btn-outline:hover { border-color: ${BRAND_COLORS.primary}; color: ${BRAND_COLORS.primary}; }

  .glass-card {
    background: white; border: 1px solid rgba(179, 183, 193, 0.2);
    border-radius: 2rem; padding: 2.5rem;
    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.03);
    transition: 0.4s; height: 100%; display: flex; flex-direction: column;
  }
  .glass-card:hover { transform: translateY(-8px); border-color: ${BRAND_COLORS.secondary}; box-shadow: 0 20px 50px -15px rgba(88, 168, 180, 0.15); }
  
  .icon-wrapper {
    width: 64px; height: 64px; border-radius: 1.2rem;
    background: linear-gradient(135deg, rgba(67, 143, 179, 0.1), rgba(88, 168, 180, 0.1));
    color: ${BRAND_COLORS.primary}; display: flex; align-items: center; justify-content: center;
    margin-bottom: 1.5rem; transition: 0.3s;
  }
  .glass-card:hover .icon-wrapper { background: ${BRAND_COLORS.primary}; color: white; transform: rotate(-10deg) scale(1.1); }

  .intro-overlay {
    position: fixed; inset: 0; z-index: 9999; background: #0f172a; color: white;
    display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;
  }
  .intro-warning {
    font-size: 1.1rem; color: ${BRAND_COLORS.secondary}; margin-bottom: 2rem;
    padding: 1rem 2rem; border: 1px solid rgba(255,255,255,0.1); border-radius: 50px;
    background: rgba(0,0,0,0.3); opacity: 0; transform: translateY(20px);
  }
  .intro-count { font-size: 8rem; font-weight: 900; line-height: 1; color: white; font-variant-numeric: tabular-nums; }
  
  .marquee-container { overflow: hidden; white-space: nowrap; padding: 2rem 0; background: ${BRAND_COLORS.light}; border-y: 1px solid rgba(0,0,0,0.05); }
  .marquee-content { display: inline-flex; animation: scroll 30s linear infinite; }
  .marquee-item { margin: 0 3rem; font-size: 1.5rem; font-weight: 700; color: ${BRAND_COLORS.silver}; opacity: 0.7; }
  @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

  .pricing-card { position: relative; overflow: hidden; }
  .pricing-header { text-align: center; margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1px solid #f1f5f9; }
  .price-tag { font-size: 3rem; font-weight: 800; color: ${BRAND_COLORS.dark}; }
  .popular-badge { position: absolute; top: 1.5rem; right: -2rem; background: ${BRAND_COLORS.secondary}; color: white; padding: 0.5rem 3rem; transform: rotate(45deg); font-size: 0.8rem; font-weight: 700; }

  .form-group { margin-bottom: 1.5rem; }
  .form-label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: ${BRAND_COLORS.dark}; }
  .form-input {
    width: 100%; padding: 1rem; border-radius: 12px; border: 1px solid #e2e8f0;
    font-family: inherit; font-size: 1rem; transition: 0.3s; background: #f8fafc;
  }
  .form-input:focus { outline: none; border-color: ${BRAND_COLORS.primary}; background: white; }

  footer { background: #0f172a; color: white; padding: 6rem 0 2rem; margin-top: 6rem; }
  .footer-link { color: #94a3b8; text-decoration: none; display: block; margin-bottom: 0.8rem; transition: 0.3s; }
  .footer-link:hover { color: ${BRAND_COLORS.secondary}; }

  @media (max-width: 992px) {
    .grid-2 { grid-template-columns: 1fr; gap: 3rem; }
    .nav-links, .desktop-only { display: none; }
    .mobile-only { display: block !important; }
    h1 { font-size: 3rem; }
  }
  .mobile-only { display: none; }
`;

// =========================================
// 3. HELPERS
// =========================================

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
// 4. COMPONENTS
// =========================================

const Intro = ({ onComplete }: { onComplete: () => void }) => {
  const container = useRef(null);
  const warning = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.to(warning.current, { opacity: 1, y: 0, duration: 1, delay: 0.5 })
      .to(warning.current, { opacity: 0, y: -20, duration: 0.5, delay: 2.5 })
      .call(() => {
        const interval = setInterval(() => {
          setCount(prev => {
            if (prev >= 100) {
              clearInterval(interval);
              gsap.to(container.current, {
                clipPath: "circle(0% at 50% 50%)", duration: 1.8, ease: "expo.inOut", onComplete: onComplete
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
          <div style={{letterSpacing:'4px', color: BRAND_COLORS.silver, marginTop:'1rem'}}>LOADING AURA SYSTEM</div>
        </div>
      )}
    </div>
  );
};

const AuraBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!mountRef.current) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xffffff, 0.015);
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.z = 30;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const textPoints = getTextCoordinates("AURA", 1000, 500);
    const count = textPoints.length;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const c1 = new THREE.Color(BRAND_COLORS.primary);
    const c2 = new THREE.Color(BRAND_COLORS.secondary);

    for (let i = 0; i < count; i++) {
      positions[i*3] = (Math.random() - 0.5) * 150;
      positions[i*3+1] = (Math.random() - 0.5) * 150;
      positions[i*3+2] = (Math.random() - 0.5) * 100;
      const mixed = Math.random() > 0.5 ? c1 : c2;
      colors[i*3] = mixed.r; colors[i*3+1] = mixed.g; colors[i*3+2] = mixed.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({ size: 0.15, vertexColors: true, transparent: true, opacity: 0.8 });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.005;
      particles.rotation.y = Math.sin(time * 0.3) * 0.05;
      renderer.render(scene, camera);
    };
    animate();

    // The Fix: Use arrow function with block for void return
    for(let i=0; i<count; i++) {
        gsap.to(positions, {
            [i*3]: textPoints[i].x,
            [i*3+1]: textPoints[i].y,
            [i*3+2]: 0, // Target Z
            duration: 2.5,
            ease: "expo.out",
            delay: 4 + Math.random() * 1,
            onUpdate: () => { geometry.attributes.position.needsUpdate = true; } // <--- FIX HERE
        });
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
  }, []);
  return <div id="aura-canvas" ref={mountRef}></div>;
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-logo">
        <div className="nav-dot"></div> AURA
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

const ClientMarquee = () => (
  <div className="marquee-container">
    <div className="marquee-content">
      {[...Array(10)].map((_, i) => <span key={i} className="marquee-item">CLIENT {i+1} LOGO</span>)}
    </div>
  </div>
);

const ContactForm = () => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert("شكراً لك! تم استلام طلبك.");
  };
  return (
    <div className="glass-card">
      <h3 className="text-gradient">تحدث مع خبرائنا</h3>
      <p style={{marginBottom:'2rem'}}>املأ النموذج وسنتواصل معك خلال 24 ساعة.</p>
      <form onSubmit={handleSubmit}>
        <div className="grid-2" style={{gap:'1.5rem', marginBottom:'1.5rem'}}>
          <div className="form-group">
            <label className="form-label">الاسم</label>
            <input type="text" className="form-input" required />
          </div>
          <div className="form-group">
            <label className="form-label">البريد</label>
            <input type="email" className="form-input" required />
          </div>
        </div>
        <div className="form-group" style={{marginBottom:'2rem'}}>
          <label className="form-label">التفاصيل</label>
          <textarea className="form-input" style={{minHeight:'100px'}}></textarea>
        </div>
        <button type="submit" className="btn btn-primary" style={{width:'100%'}}>
          إرسال الطلب <Send size={18} />
        </button>
      </form>
    </div>
  );
};

const Hero = () => (
  <section className="section" id="الرئيسية" style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
    <div className="container" style={{textAlign:'center'}}>
      <motion.div initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} transition={{duration:1, delay:3.5}}>
        <div style={{display:'inline-flex', alignItems:'center', gap:'8px', padding:'0.5rem 1.5rem', borderRadius:'50px', background:'#f1f5f9', color:BRAND_COLORS.primary, fontWeight:'700', marginBottom:'2rem', border:`1px solid ${BRAND_COLORS.silver}`}}>
          <Zap size={16} fill="currentColor" /> الإصدار البلاتيني 2026
        </div>
        <h1>نحول الرؤية إلى <span className="text-gradient">واقع رقمي</span></h1>
        <p style={{margin:'0 auto 2.5rem'}}>
          في أورا، نحن لا نكتب الكود فقط. نحن نهندس تجارب رقمية متكاملة تضع علامتك التجارية في الصدارة.
        </p>
        <div className="flex-center" style={{gap:'1rem', flexWrap:'wrap'}}>
          <button className="btn btn-primary">اكتشف خدماتنا <ArrowUpRight size={18} /></button>
          <button className="btn btn-outline">مشاهدة الأعمال</button>
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
      </div>
      <div className="grid-3">
        {[
          {t:'تطوير الويب', d:'مواقع فائقة السرعة.', i: Code},
          {t:'الهوية البصرية', d:'تصاميم تعكس جوهر علامتك.', i: Palette},
          {t:'تطبيقات الجوال', d:'تجربة مستخدم سلسة.', i: Smartphone},
          {t:'التسويق الرقمي', d:'استراتيجيات نمو ذكية.', i: Megaphone},
          {t:'المتاجر', d:'حلول بيع متكاملة.', i: ShoppingBag},
          {t:'SEO', d:'تصدر نتائج البحث.', i: Search},
        ].map((s, idx) => (
          <div key={idx} className="glass-card">
            <div className="icon-wrapper"><s.i size={28} /></div>
            <h3>{s.t}</h3>
            <p>{s.d}</p>
            <div style={{marginTop:'auto', paddingTop:'1rem', color: BRAND_COLORS.primary, fontWeight:'bold'}}>
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
      </div>
      <div className="grid-3">
        <div className="glass-card pricing-card">
          <div className="pricing-header">
            <h3>البداية</h3>
            <div className="price-tag">5,000 <span style={{fontSize:'1rem'}}>ر.س</span></div>
          </div>
          <ul style={{listStyle:'none', padding:0}}>
            {['صفحة هبوط', 'متجاوب', 'دعم شهر'].map((f,i) => <li key={i} style={{marginBottom:'10px'}}>✓ {f}</li>)}
          </ul>
          <button className="btn btn-outline" style={{width:'100%', marginTop:'2rem'}}>اختر الباقة</button>
        </div>
        <div className="glass-card pricing-card" style={{border:`2px solid ${BRAND_COLORS.primary}`, transform:'scale(1.05)', zIndex:2}}>
          <div className="popular-badge">الأكثر طلباً</div>
          <div className="pricing-header">
            <h3>النمو</h3>
            <div className="price-tag">12,000 <span style={{fontSize:'1rem'}}>ر.س</span></div>
          </div>
          <ul style={{listStyle:'none', padding:0}}>
            {['5 صفحات', 'لوحة تحكم', 'SEO أساسي', 'دعم 3 أشهر'].map((f,i) => <li key={i} style={{marginBottom:'10px'}}>✓ {f}</li>)}
          </ul>
          <button className="btn btn-primary" style={{width:'100%', marginTop:'2rem'}}>اختر الباقة</button>
        </div>
        <div className="glass-card pricing-card">
          <div className="pricing-header">
            <h3>المؤسسات</h3>
            <div className="price-tag">مخصص</div>
          </div>
          <ul style={{listStyle:'none', padding:0}}>
            {['منصة كاملة', 'تطبيق جوال', 'تسويق شامل', 'فريق مخصص'].map((f,i) => <li key={i} style={{marginBottom:'10px'}}>✓ {f}</li>)}
          </ul>
          <button className="btn btn-outline" style={{width:'100%', marginTop:'2rem'}}>تواصل معنا</button>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer style={{background: BRAND_COLORS.dark, color:'white', paddingTop:'5rem', paddingBottom:'2rem'}}>
    <div className="container">
      <div className="grid-2" style={{alignItems:'start', marginBottom:'4rem'}}>
        <div>
          <div style={{fontSize:'2rem', fontWeight:'900', color:'white', marginBottom:'1.5rem'}}>AURA</div>
          <p style={{color: BRAND_COLORS.silver}}>شريكك الاستراتيجي في العالم الرقمي.</p>
        </div>
        <div>
          <h4 style={{color:'white', marginBottom:'1.5rem'}}>تواصل</h4>
          <div style={{color: BRAND_COLORS.silver, marginBottom:'0.5rem'}}>hello@aurateam3.com</div>
          <div style={{color: BRAND_COLORS.silver}}>الرياض، المملكة العربية السعودية</div>
        </div>
      </div>
      <div style={{borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:'2rem', textAlign:'center', color: BRAND_COLORS.silver, fontSize:'0.9rem'}}>
        © 2026 AURA Digital Agency.
      </div>
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
        {!introFinished && <Intro onComplete={() => setIntroFinished(true)} />}
      </AnimatePresence>
      <div style={{opacity: introFinished ? 1 : 0, transition: 'opacity 1s ease'}}>
        <AuraBackground />
        <Navbar />
        <main>
          <Hero />
          <ClientMarquee />
          <section className="section" id="عن_أورا">
            <div className="container grid-2">
              <div>
                <div style={{color: BRAND_COLORS.primary, fontWeight:'700', marginBottom:'1rem'}}>عن أورا</div>
                <h2>فريق شغوف <span className="text-gradient">بالتميز</span></h2>
                <p>نحن لسنا مجرد وكالة، نحن امتداد لفريقك.</p>
              </div>
              <div className="glass-card" style={{minHeight:'300px', display:'flex', alignItems:'center', justifyContent:'center'}}>
                <span style={{color:'#94a3b8'}}>صورة الفريق</span>
              </div>
            </div>
          </section>
          <Services />
          <Pricing />
          <section className="section container" id="تواصل">
            <div className="grid-2">
              <div>
                <h2>لنبدأ رحلة <span className="text-gradient">النجاح</span></h2>
                <p>فريقنا جاهز للاستماع إليك.</p>
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
