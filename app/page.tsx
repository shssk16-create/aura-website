'use client';

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowUpRight, Megaphone, Palette, Search, ShoppingBag, Plus, 
  Menu, X, Globe, Zap, CheckCircle, Users, BarChart, Shield,
  MousePointerClick, Lightbulb, Layers, Rocket
} from 'lucide-react';
import Script from 'next/script';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// =========================================
// SEO & STRUCTURED DATA (RICH SNIPPETS)
// =========================================
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "AURA Digital Agency",
  "alternateName": "وكالة أورا الرقمية",
  "url": "https://aurateam3.com",
  "logo": "https://aurateam3.com/logo.png",
  "image": "https://aurateam3.com/cover-aura-light.jpg",
  "description": "أورا هي وكالة رقمية رائدة في المملكة العربية السعودية، متخصصة في صياغة تجارب رقمية استثنائية من خلال دمج الإبداع في التصميم مع دقة البيانات. نقدم خدمات بناء الهوية البصرية، تطوير المواقع والتطبيقات، واستراتيجيات التسويق الرقمي التي تضمن عائداً حقيقياً على الاستثمار.",
  "priceRange": "$$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "طريق الملك فهد، برج العليا",
    "addressLocality": "الرياض",
    "addressRegion": "منطقة الرياض",
    "postalCode": "12214",
    "addressCountry": "SA"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "24.7136",
    "longitude": "46.6753"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  ],
  "sameAs": [
    "https://twitter.com/aura_agency",
    "https://www.linkedin.com/company/aura-agency",
    "https://www.instagram.com/aura.sa"
  ]
};

// =========================================
// MASSIVE CSS SYSTEM (PURE CSS IN JS)
// =========================================
const styles = `
  /* Import Fonts */
  @import url('https://fonts.googleapis.com/css2?family=Readex+Pro:wght@200;300;400;500;600;700;800&display=swap');
  
  /* CSS Variables - Light Theme Aura */
  :root {
    --primary: #4390b3; /* لون الهوية الرئيسي - أزرق سماوي */
    --primary-dark: #2c6e8f; /* درجة أغمق للعناوين */
    --accent: #00d4ff; /* لون التوهج */
    --bg-main: #ffffff; /* خلفية بيضاء نقية */
    --bg-secondary: #f8fafc; /* خلفية ثانوية فاتحة جداً */
    --text-main: #0f172a; /* نص داكن جداً للقراءة */
    --text-body: #475569; /* نص الفقرات */
    --text-muted: #94a3b8; /* نص ثانوي */
    --glass-bg: rgba(255, 255, 255, 0.7); /* خلفية زجاجية */
    --glass-border: rgba(67, 144, 179, 0.15); /* حدود زجاجية ملونة خفيفة */
    --shadow-sm: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
    --shadow-md: 0 10px 30px -5px rgba(67, 144, 179, 0.1);
    --shadow-lg: 0 20px 50px -10px rgba(67, 144, 179, 0.2);
    --radius-md: 1rem;
    --radius-lg: 2rem;
    --radius-full: 9999px;
  }

  /* Global Reset */
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }
  ::selection { background: var(--primary); color: white; }
  
  body {
    background-color: var(--bg-main);
    color: var(--text-main);
    font-family: 'Readex Pro', sans-serif;
    overflow-x: hidden;
    direction: rtl;
    line-height: 1.7;
  }

  /* Typography System */
  h1, h2, h3, h4 { color: var(--text-main); font-weight: 800; line-height: 1.2; }
  h1 { font-size: clamp(3rem, 8vw, 6rem); letter-spacing: -2px; }
  h2 { font-size: clamp(2.2rem, 5vw, 4rem); letter-spacing: -1px; margin-bottom: 1.5rem; }
  h3 { font-size: 1.5rem; margin-bottom: 1rem; }
  p { color: var(--text-body); font-size: 1.125rem; max-width: 70ch; margin-bottom: 1.5rem; }
  .lead { font-size: 1.25rem; font-weight: 500; color: var(--primary-dark); }
  
  /* Utility Classes */
  .container { width: 100%; max-width: 1300px; margin: 0 auto; padding: 0 clamp(1.5rem, 4vw, 3rem); position: relative; }
  .flex-center { display: flex; align-items: center; justify-content: center; }
  .flex-between { display: flex; align-items: center; justify-content: space-between; }
  .flex-col { display: flex; flexDirection: column; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
  .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 3rem; }
  .text-center { text-align: center; }
  .relative { position: relative; }
  .hidden { display: none; }

  /* Gradients & Effects */
  .text-gradient {
    background: linear-gradient(135deg, var(--primary-dark) 0%, var(--accent) 100%);
    -webkit-background-clip: text; color: transparent; display: inline-block;
  }
  .aura-glow {
    position: absolute; pointer-events: none; z-index: -1; filter: blur(100px); opacity: 0.15;
    background: radial-gradient(circle, var(--accent) 0%, var(--primary) 50%, transparent 70%);
  }

  /* --- THE INTRO (Cinematic Experience) --- */
  .intro-overlay {
    position: fixed; inset: 0; z-index: 9999; background: #020305; color: white;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 2rem; text-align: center;
  }
  .intro-warning {
    font-size: 1.1rem; color: #fbbf24; max-width: 600px; margin-bottom: 3rem;
    opacity: 0; transform: translateY(20px);
  }
  .intro-counter-wrapper { position: relative; font-variant-numeric: tabular-nums; }
  .intro-counter { font-size: 8rem; font-weight: 900; line-height: 1; background: linear-gradient(to bottom, white, #94a3b8); -webkit-background-clip: text; color: transparent;}
  .intro-percentage { font-size: 3rem; position: absolute; top: 1rem; left: -2rem; color: var(--primary); }
  .intro-brand { margin-top: 2rem; letter-spacing: 4px; font-weight: 700; color: var(--text-muted); opacity: 0; }

  /* --- Navbar (Floating Capsule) --- */
  .navbar {
    position: fixed; top: 25px; left: 50%; transform: translateX(-50%);
    width: auto; min-width: 600px; z-index: 900;
    padding: 0.8rem 1.5rem; border-radius: var(--radius-full);
    background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(25px) saturate(180%);
    border: 1px solid var(--glass-border);
    box-shadow: var(--shadow-sm);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .navbar.scrolled {
    top: 15px; background: rgba(255, 255, 255, 0.95);
    box-shadow: var(--shadow-md); border-color: var(--primary);
  }
  .nav-brand { display: flex; align-items: center; gap: 0.8rem; font-weight: 800; font-size: 1.5rem; color: var(--primary-dark); }
  .nav-links { display: flex; gap: 2.5rem; align-items: center; }
  .nav-link { 
    text-decoration: none; color: var(--text-main); font-weight: 600; font-size: 0.95rem;
    position: relative; padding: 0.5rem 0; transition: 0.3s;
  }
  .nav-link::after {
    content: ''; position: absolute; bottom: 0; left: 50%; width: 0; height: 2px;
    background: var(--primary); transition: 0.3s ease; transform: translateX(-50%);
  }
  .nav-link:hover { color: var(--primary); }
  .nav-link:hover::after { width: 100%; }

  /* --- Buttons --- */
  .btn {
    display: inline-flex; align-items: center; gap: 0.8rem;
    padding: 1rem 2.5rem; border-radius: var(--radius-full);
    font-weight: 700; font-size: 1.05rem; cursor: pointer; transition: all 0.3s ease;
    border: none; outline: none;
  }
  .btn-primary {
    background: var(--primary-dark); color: white;
    box-shadow: 0 10px 20px -5px rgba(44, 110, 143, 0.4);
  }
  .btn-primary:hover {
    background: var(--primary); transform: translateY(-3px);
    box-shadow: 0 15px 30px -5px rgba(44, 110, 143, 0.6);
  }
  .btn-outline {
    background: transparent; color: var(--primary-dark);
    border: 2px solid var(--primary-dark);
  }
  .btn-outline:hover { background: var(--primary-dark); color: white; }

  /* --- Cards & Containers --- */
  .glass-card {
    background: white; border-radius: var(--radius-lg); padding: 3rem;
    border: 1px solid rgba(0,0,0,0.04);
    box-shadow: var(--shadow-sm); transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    height: 100%; display: flex; flex-direction: column;
  }
  .glass-card:hover {
    transform: translateY(-7px); border-color: var(--glass-border);
    box-shadow: var(--shadow-lg);
  }
  .icon-box {
    width: 64px; height: 64px; border-radius: 1.2rem;
    background: linear-gradient(135deg, rgba(67, 144, 179, 0.1), rgba(0, 212, 255, 0.1));
    display: flex; align-items: center; justify-content: center;
    color: var(--primary); margin-bottom: 2rem; transition: 0.3s;
  }
  .glass-card:hover .icon-box {
    background: var(--primary); color: white; transform: rotate(-10deg) scale(1.1);
  }

  /* --- Hero Section --- */
  .hero-section {
    min-height: 100vh; display: flex; align-items: center; padding-top: 120px;
    background: radial-gradient(circle at 70% 30%, rgba(67, 144, 179, 0.07), transparent 50%),
                radial-gradient(circle at 20% 80%, rgba(0, 212, 255, 0.05), transparent 40%);
  }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 0.5rem;
    padding: 0.6rem 1.2rem; background: rgba(67, 144, 179, 0.08);
    border-radius: var(--radius-full); color: var(--primary-dark); font-weight: 600;
    margin-bottom: 2rem; border: 1px solid rgba(67, 144, 179, 0.1);
  }

  /* --- Stats Section --- */
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; padding: 4rem 0; }
  .stat-card { text-align: center; padding: 2rem; background: var(--bg-secondary); border-radius: var(--radius-lg); }
  .stat-num { display: block; font-size: 4rem; font-weight: 900; background: linear-gradient(to bottom, var(--primary-dark), var(--primary)); -webkit-background-clip: text; color: transparent; line-height: 1; margin-bottom: 0.5rem; }
  .stat-label { font-weight: 600; color: var(--text-body); }

  /* --- Process Timeline --- */
  .timeline-step {
    display: flex; gap: 2rem; margin-bottom: 4rem; position: relative;
  }
  .timeline-step:not(:last-child)::after {
    content: ''; position: absolute; top: 60px; right: 25px; width: 2px; height: calc(100% - 20px);
    background: linear-gradient(to bottom, var(--primary), transparent); opacity: 0.3;
  }
  .step-marker {
    flex-shrink: 0; width: 50px; height: 50px; border-radius: 50%;
    background: var(--primary); color: white; display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 1.2rem; box-shadow: 0 0 20px rgba(67, 144, 179, 0.4);
    position: relative; z-index: 2;
  }
  .step-content h3 { margin-bottom: 1rem; font-size: 1.8rem; }

  /* --- Works Carousel --- */
  .works-carousel-wrap {
    overflow-x: auto; padding: 2rem 0 4rem; cursor: grab;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */
  }
  .works-carousel-wrap::-webkit-scrollbar { display: none; } /* Chrome/Safari */
  .works-track { display: flex; gap: 2.5rem; width: max-content; }
  .work-card {
    width: 450px; height: 550px; border-radius: var(--radius-lg); overflow: hidden;
    position: relative; flex-shrink: 0; box-shadow: var(--shadow-md); transition: 0.5s;
  }
  .work-card:hover { transform: scale(0.98) translateY(-10px); box-shadow: var(--shadow-lg); }
  .work-img { width: 100%; height: 100%; object-fit: cover; transition: 1s cubic-bezier(0.2, 0.8, 0.2, 1); }
  .work-card:hover .work-img { transform: scale(1.1) rotate(1deg); }
  .work-info {
    position: absolute; inset: 0; background: linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, transparent 60%);
    display: flex; flex-direction: column; justify-content: flex-end; padding: 3rem; color: white;
    opacity: 0; transition: 0.3s;
  }
  .work-card:hover .work-info { opacity: 1; }
  .work-info h3 { color: white; margin-bottom: 0.5rem; }

  /* --- FAQ --- */
  .faq-item {
    background: white; border-radius: var(--radius-md); margin-bottom: 1rem;
    border: 1px solid rgba(0,0,0,0.05); transition: 0.3s;
  }
  .faq-item.active { border-color: var(--primary); box-shadow: var(--shadow-md); }
  .faq-trigger {
    width: 100%; display: flex; justify-content: space-between; align-items: center;
    padding: 1.5rem 2rem; background: none; border: none; cursor: pointer;
    font-weight: 700; font-size: 1.1rem; color: var(--text-main); font-family: inherit;
  }
  .faq-answer {
    padding: 0 2rem 2rem; color: var(--text-body); line-height: 1.8;
    border-top: 1px solid rgba(0,0,0,0.03);
  }

  /* --- Footer --- */
  .footer {
    background: #0f172a; color: white; padding: 6rem 0 2rem;
    position: relative; overflow: hidden; margin-top: 6rem;
  }
  .footer-cta { text-align: center; margin-bottom: 4rem; position: relative; z-index: 2; }
  .footer-cta h2 { color: white; font-size: 4rem; }
  .footer-cta p { color: rgba(255,255,255,0.7); font-size: 1.3rem; margin-bottom: 2.5rem; }
  .footer-links-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; padding-top: 4rem; border-top: 1px solid rgba(255,255,255,0.1); }
  .footer-col h4 { color: white; margin-bottom: 1.5rem; font-size: 1.1rem; }
  .footer-link { display: block; color: rgba(255,255,255,0.6); text-decoration: none; margin-bottom: 0.8rem; transition: 0.3s; }
  .footer-link:hover { color: var(--accent); }
  .footer-bottom { margin-top: 4rem; text-align: center; color: rgba(255,255,255,0.4); font-size: 0.9rem; }

  /* --- Responsive Breakdown --- */
  @media (max-width: 1200px) {
    .grid-3 { grid-template-columns: repeat(2, 1fr); }
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 992px) {
    .navbar { min-width: auto; width: 90%; top: 20px; padding: 0.8rem 1.2rem; }
    .nav-links-desktop, .btn-navbar { display: none; }
    .mobile-toggle { display: block; }
    .hero-section { text-align: center; padding-top: 150px; }
    .hero-buttons { justify-content: center; }
    .grid-2 { grid-template-columns: 1fr; gap: 2rem; }
  }
  @media (max-width: 768px) {
    h1 { font-size: 3rem; } h2 { font-size: 2rem; }
    .grid-3 { grid-template-columns: 1fr; }
    .stats-grid { grid-template-columns: 1fr; gap: 1rem; }
    .timeline-step { flexDirection: column; gap: 1rem; }
    .timeline-step::after { display: none; }
    .work-card { width: 300px; height: 400px; }
    .footer-cta h2 { font-size: 2.5rem; }
    .footer-links-grid { grid-template-columns: repeat(2, 1fr); }
  }
  .mobile-toggle { display: none; background: none; border: none; color: var(--text-main); }
`;

// =========================================
// THE INTRO COMPONENT (The Core Experience)
// =========================================
const CinematicIntro = ({ onComplete }: { onComplete: () => void }) => {
  const container = useRef(null);
  const counterRef = useRef(null);
  const warningRef = useRef(null);
  const brandRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(container.current, { display: 'none' });
          onComplete();
        }
      });

      // 1. Warning message appears
      tl.to(warningRef.current, { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, "+=0.5");
      // 2. Warning message disappears
      tl.to(warningRef.current, { opacity: 0, y: -20, duration: 0.8, ease: "power2.in", delay: 2 });

      // 3. Counter starts immediately after warning
      const counterObj = { val: 0 };
      tl.to(counterObj, {
        val: 100, duration: 2.5, ease: "expo.inOut",
        onUpdate: () => { if (counterRef.current) (counterRef.current as HTMLElement).innerText = Math.floor(counterObj.val).toString(); }
      }, "-=0.2");

      // 4. Brand name appears slightly before counter ends
      tl.to(brandRef.current, { opacity: 1, duration: 0.5 }, "-=0.8");

      // 5. The Great Reveal (Explosion of Light)
      tl.to(container.current, {
        clipPath: "circle(0% at 50% 50%)", // Shrink the darkness into nothing
        duration: 1.5,
        ease: "expo.inOut",
        delay: 0.2
      });
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={container} className="intro-overlay" style={{clipPath: "circle(150% at 50% 50%)"}}>
      <div ref={warningRef} className="intro-warning">
        <Lightbulb size={32} style={{marginBottom:'1rem', color:'#fbbf24'}} />
        <p>تنبيه: هالة "أورا" ساطعة جداً. ننصح بخفض إضاءة شاشتك قليلاً للاستمتاع بالتجربة المثالية.</p>
      </div>
      <div className="intro-counter-wrapper">
        <div ref={counterRef} className="intro-counter">0</div>
        <span className="intro-percentage">%</span>
      </div>
      <div ref={brandRef} className="intro-brand">AURA DIGITAL AGENCY</div>
    </div>
  );
};

// =========================================
// MAIN APP COMPONENT
// =========================================
export default function AuraWebsite() {
  const [introFinished, setIntroFinished] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  
  // Scroll Trigger for Navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="main-wrapper">
      {/* Inject massive styles */}
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      {/* Inject SEO Schema */}
      <Script id="json-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      {/* The Cinematic Intro */}
      <AnimatePresence>
        {!introFinished && <CinematicIntro onComplete={() => setIntroFinished(true)} />}
      </AnimatePresence>

      {/* Main Content (Revealed after intro) */}
      <div style={{ opacity: introFinished ? 1 : 0, transition: 'opacity 1s ease' }}>
        
        {/* Navbar */}
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
          <div className="flex-between" style={{width: '100%'}}>
            <div className="nav-brand">
              <Zap size={28} className="text-primary" fill="currentColor" />
              <span>AURA</span>
            </div>
            {/* Desktop Links */}
            <div className="nav-links nav-links-desktop">
              {['الرئيسية', 'منهجيتنا', 'خدماتنا', 'أعمالنا', 'المدونة'].map(item => (
                <a key={item} href={`#${item}`} className="nav-link">{item}</a>
              ))}
            </div>
            {/* Action Button */}
            <button className="btn btn-primary btn-navbar">
              حجز استشارة مجانية <ArrowUpRight size={20} />
            </button>
            {/* Mobile Toggle */}
            <button className="mobile-toggle" onClick={() => setMobileMenu(!mobileMenu)}>
              <Menu size={28} />
            </button>
          </div>
        </nav>

        <main>
          {/* 1. Hero Section: The Hook */}
          <section className="hero-section container" id="الرئيسية">
            <div className="grid-2 items-center">
              <motion.div initial={{opacity:0, x:50}} animate={introFinished ? {opacity:1, x:0} : {}} transition={{duration:1, delay:0.2}}>
                <div className="hero-badge">
                  <Rocket size={18} />
                  الشريك الرقمي الاستراتيجي للشركات الطموحة في السعودية
                </div>
                <h1>نحول التعقيد الرقمي إلى <br/><span className="text-gradient">وضوح وتأثير</span></h1>
                <p className="lead" style={{marginBottom:'1.5rem'}}>في عالم مليء بالضوضاء، "أورا" هي هالتك التي لا يمكن تجاهلها.</p>
                <p>
                  نحن لا نبني مجرد مواقع إلكترونية؛ نحن نصمم منظومات رقمية متكاملة تدمج بين جمالية التصميم، ذكاء البيانات، وقوة التكنولوجيا لتحقيق نمو مستدام لعلامتك التجارية. دعنا نأخذ بيدك في رحلة التحول الرقمي.
                </p>
                <div className="flex gap-4 hero-buttons" style={{marginTop:'2.5rem'}}>
                  <button className="btn btn-primary">ابدأ مشروعك الآن</button>
                  <button className="btn btn-outline">شاهد قصص نجاحنا</button>
                </div>
              </motion.div>
              
              {/* Abstract Visual Element */}
              <motion.div initial={{opacity:0, scale:0.8}} animate={introFinished ? {opacity:1, scale:1} : {}} transition={{duration:1.2, delay:0.4}} className="relative hidden md:block">
                <div style={{width:'100%', height:'600px', background:'url(https://images.unsplash.com/photo-1633412802994-5c058f151b66?q=80&w=800) center/cover', borderRadius:'30% 70% 70% 30% / 30% 30% 70% 70%', boxShadow:'var(--shadow-lg)'}}></div>
                <div className="aura-glow" style={{top:'-10%', right:'-10%', width:'300px', height:'300px'}}></div>
                <div className="aura-glow" style={{bottom:'-10%', left:'-10%', width:'400px', height:'400px', background:'radial-gradient(circle, #8b5cf6 0%, transparent 70%)'}}></div>
              </motion.div>
            </div>
          </section>

          {/* 2. Stats Section: Social Proof */}
          <section className="container">
            <div className="stats-grid">
              <div className="stat-card">
                <Users size={40} className="text-primary mb-4 mx-auto" />
                <span className="stat-num">+85</span>
                <span className="stat-label">عميل سعيد في المملكة</span>
              </div>
              <div className="stat-card">
                <CheckCircle size={40} className="text-primary mb-4 mx-auto" />
                <span className="stat-num">120+</span>
                <span className="stat-label">مشروع رقمي ناجح</span>
              </div>
              <div className="stat-card">
                <BarChart size={40} className="text-primary mb-4 mx-auto" />
                <span className="stat-num">%250</span>
                <span className="stat-label">متوسط نمو العملاء</span>
              </div>
              <div className="stat-card">
                <Shield size={40} className="text-primary mb-4 mx-auto" />
                <span className="stat-num">24/7</span>
                <span className="stat-label">دعم فني واستشارات</span>
              </div>
            </div>
          </section>

          {/* 3. Why Aura? (The Philosophy) */}
          <section className="container" style={{padding:'6rem 1.5rem'}} id="منهجيتنا">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2>لماذا تختار <span className="text-gradient">أورا</span> كشريك لك؟</h2>
              <p className="lead">نحن نؤمن بأن التصميم الجميل وحده لا يكفي في عام 2026.</p>
              <p>
                النجاح الرقمي اليوم يتطلب معادلة دقيقة: (إبداع يخطف الأنفاس + تكنولوجيا فائقة السرعة + استراتيجية مبنية على الأرقام). في أورا، نحن لا نوظف مصممين فقط، بل نوظف مفكرين استراتيجيين ومهندسي بيانات يعملون معاً لضمان أن كل بكسل في موقعك يخدم هدفاً تجارياً محدداً. نحن مهووسون بالنتائج، لا بالمظاهر فقط.
              </p>
            </div>
            
            {/* Process Timeline */}
            <div className="max-w-4xl mx-auto">
              <div className="timeline-step">
                <div className="step-marker">01</div>
                <div className="step-content glass-card">
                  <h3>الاكتشاف والتحليل العميق</h3>
                  <p>لا نبدأ بكتابة سطر كود واحد قبل أن نفهم عملك بعمق. نحلل منافسيك، ندرس سلوك جمهورك المستهدف، ونحدد الأهداف KPIs بدقة. هذه المرحلة هي الأساس الصلب لأي مشروع ناجح.</p>
                </div>
              </div>
              <div className="timeline-step">
                <div className="step-marker">02</div>
                <div className="step-content glass-card">
                  <h3>صياغة الاستراتيجية والتصميم</h3>
                  <p>نقوم بترجمة البيانات إلى خرائط تجربة مستخدم (UX Maps) وتصاميم واجهات (UI) مذهلة. نركز على خلق رحلة عميل سلسة تحول الزائر إلى عميل دائم، مع الحفاظ على هوية بصرية قوية.</p>
                </div>
              </div>
              <div className="timeline-step">
                <div className="step-marker">03</div>
                <div className="step-content glass-card">
                  <h3>التطوير بتقنيات المستقبل</h3>
                  <p>نستخدم أحدث ما توصلت إليه التكنولوجيا (Next.js 15, React) لبناء مواقع وتطبيقات فائقة السرعة، آمنة، ومتوافقة تماماً مع محركات البحث (SEO) من اليوم الأول.</p>
                </div>
              </div>
               <div className="timeline-step">
                <div className="step-marker">04</div>
                <div className="step-content glass-card">
                  <h3>الإطلاق والنمو المستمر</h3>
                  <p>الإطلاق ليس النهاية. نحن نستمر في مراقبة الأداء، تحليل البيانات، وتحسين معدلات التحويل (CRO) لضمان أن استثمارك ينمو يوماً بعد يوم.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Services Detailed (The Value Proposition) */}
          <section className="bg-secondary py-24" id="خدماتنا">
            <div className="container">
              <div className="text-center mb-16">
                <h2>منظومة خدماتنا <span className="text-gradient">المتكاملة</span></h2>
                <p>حلول مصممة خصيصاً لتغطية كافة احتياجاتك في الرحلة الرقمية.</p>
              </div>
              
              <div className="grid-3">
                {/* Service 1 */}
                <div className="glass-card">
                  <div className="icon-box"><Palette size={32} /></div>
                  <h3>بناء الهوية البصرية والعلامة التجارية</h3>
                  <p style={{flexGrow:1}}>
                    علامتك التجارية هي وعدك للعميل. نحن نصمم شعارات، أنظمة ألوان، وأدلة استخدام (Brand Guidelines) تخلق انطباعاً أولياً قوياً وتبقى في ذاكرة جمهورك، مما يميزك عن المنافسين في السوق المزدحم.
                  </p>
                  <a href="#" className="text-primary font-bold flex items-center gap-2 mt-4">اقرأ المزيد <ArrowUpRight size={18} /></a>
                </div>
                {/* Service 2 */}
                <div className="glass-card" style={{border:'2px solid var(--primary)', transform:'scale(1.05)'}}>
                   <div className="icon-box" style={{background:'var(--primary)', color:'white'}}><Globe size={32} /></div>
                  <h3>تطوير المواقع والمنصات الإلكترونية</h3>
                  <p style={{flexGrow:1}}>
                    نحن متخصصون في بناء مواقع ويب تفاعلية فائقة الأداء. سواء كنت تحتاج إلى موقع تعريفي للشركات، منصة تعليمية، أو نظام حجز معقد، نحن نضمن لك تجربة مستخدم (UX) لا تشوبها شائبة على جميع الأجهزة.
                  </p>
                  <a href="#" className="text-primary font-bold flex items-center gap-2 mt-4">اقرأ المزيد <ArrowUpRight size={18} /></a>
                </div>
                {/* Service 3 */}
                <div className="glass-card">
                   <div className="icon-box"><ShoppingBag size={32} /></div>
                  <h3>حلول التجارة الإلكترونية المتكاملة</h3>
                  <p style={{flexGrow:1}}>
                    نحول زوارك إلى مشترين. نبني متاجر إلكترونية على منصات عالمية أو مخصصة (مثل Shopify أو Custom Next.js) مع التركيز على تبسيط عملية الدفع وزيادة متوسط قيمة السلة الشرائية.
                  </p>
                  <a href="#" className="text-primary font-bold flex items-center gap-2 mt-4">اقرأ المزيد <ArrowUpRight size={18} /></a>
                </div>
                 {/* Service 4 */}
                <div className="glass-card">
                   <div className="icon-box"><Megaphone size={32} /></div>
                  <h3>التسويق الرقمي وإدارة الحملات</h3>
                  <p style={{flexGrow:1}}>
                    لا فائدة من موقع رائع لا يزوره أحد. ندير حملات إعلانية مدفوعة (PPC) على جوجل ومنصات التواصل، ونطور استراتيجيات محتوى تجذب جمهورك المستهدف بدقة عالية لتعظيم العائد على الإنفاق الإعلاني (ROAS).
                  </p>
                  <a href="#" className="text-primary font-bold flex items-center gap-2 mt-4">اقرأ المزيد <ArrowUpRight size={18} /></a>
                </div>
                {/* Service 5 */}
                <div className="glass-card">
                   <div className="icon-box"><Search size={32} /></div>
                  <h3>تحسين محركات البحث (SEO)</h3>
                  <p style={{flexGrow:1}}>
                    الظهور في الصفحة الأولى من جوجل ليس سحراً، بل علم. نطبق استراتيجيات SEO تقنية ومحتوائية متقدمة لضمان تصدر موقعك للكلمات المفتاحية الأكثر أهمية في مجال عملك، مما يجلب لك زيارات مجانية مستمرة.
                  </p>
                  <a href="#" className="text-primary font-bold flex items-center gap-2 mt-4">اقرأ المزيد <ArrowUpRight size={18} /></a>
                </div>
                {/* Service 6 */}
                <div className="glass-card">
                   <div className="icon-box"><MousePointerClick size={32} /></div>
                  <h3>تحسين معدلات التحويل (CRO)</h3>
                  <p style={{flexGrow:1}}>
                    نستخدم أدوات تحليل الحرارة (Heatmaps) واختبارات A/B لفهم أين يتوقف عملاؤك، ثم نقوم بإجراء تعديلات دقيقة على التصميم والمحتوى لزيادة نسبة الزوار الذين يتخذون إجراءً فعلياً على موقعك.
                  </p>
                  <a href="#" className="text-primary font-bold flex items-center gap-2 mt-4">اقرأ المزيد <ArrowUpRight size={18} /></a>
                </div>
              </div>
            </div>
          </section>

          {/* 5. Works Carousel (Interactive UX) */}
          <section className="py-24 overflow-hidden" id="أعمالنا">
            <div className="container mb-12 flex-between">
              <div>
                <h2>معرض <span className="text-gradient">قصص النجاح</span></h2>
                <p>بعض مما أنجزناه لشركائنا الطموحين.</p>
              </div>
              <div className="hidden md:flex gap-4">
                <button className="w-12 h-12 rounded-full border border-gray-200 flex-center hover:bg-primary hover:text-white transition-all">←</button>
                <button className="w-12 h-12 rounded-full border border-gray-200 flex-center hover:bg-primary hover:text-white transition-all">→</button>
              </div>
            </div>
            
            <div className="works-carousel-wrap container">
              <div className="works-track">
                {/* Work 1 */}
                <div className="work-card">
                  <img src="https://images.unsplash.com/photo-1559136555-9303d06e0f0d?q=80&w=600" alt="مشروع نيوم" className="work-img" />
                  <div className="work-info">
                    <span className="text-accent font-bold mb-2 block">تطوير منصة عقارية</span>
                    <h3>مشروع ذا لاين - نيوم</h3>
                    <p className="text-white/80 text-sm">تصميم وتطوير واجهة تفاعلية ثلاثية الأبعاد لعرض الوحدات السكنية.</p>
                  </div>
                </div>
                 {/* Work 2 */}
                <div className="work-card">
                  <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=600" alt="موسم الرياض" className="work-img" />
                  <div className="work-info">
                    <span className="text-accent font-bold mb-2 block">هوية وحملة تسويقية</span>
                    <h3>موسم الرياض 2025</h3>
                    <p className="text-white/80 text-sm">إدارة الحملة الرقمية وتصميم الهوية البصرية للفعاليات المصاحبة.</p>
                  </div>
                </div>
                {/* Work 3 */}
                <div className="work-card">
                  <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600" alt="تطبيق مسك" className="work-img" />
                  <div className="work-info">
                    <span className="text-accent font-bold mb-2 block">تصميم تطبيق (UI/UX)</span>
                    <h3>منصة مسك التعليمية</h3>
                    <p className="text-white/80 text-sm">إعادة تصميم تجربة المستخدم لزيادة تفاعل الطلاب مع المحتوى التعليمي.</p>
                  </div>
                </div>
                 {/* Work 4 */}
                <div className="work-card">
                  <img src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=600" alt="متجر أزياء" className="work-img" />
                  <div className="work-info">
                    <span className="text-accent font-bold mb-2 block">تجارة إلكترونية متكاملة</span>
                    <h3>متجر "أناقة" للأزياء</h3>
                    <p className="text-white/80 text-sm">بناء متجر Shopify متكامل مع ربط بوابات الدفع والشحن المحلي.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 6. FAQ Section (Detailed Answers) */}
          <FAQSection />

        </main>

        {/* 7. The Grand Footer */}
        <footer className="footer">
          {/* Abstract Glows */}
          <div className="aura-glow" style={{top:'-20%', left:'20%', width:'600px', height:'600px', opacity:0.1}}></div>
          <div className="aura-glow" style={{bottom:'-20%', right:'20%', width:'500px', height:'500px', opacity:0.1, background:'radial-gradient(circle, #8b5cf6 0%, transparent 70%)'}}></div>

          <div className="container">
            <div className="footer-cta">
              <h2>هل أنت جاهز لإشعال <span className="text-gradient">هالتك الرقمية؟</span></h2>
              <p>لا تترك مكانك في المستقبل للمنافسين. دعنا نبدأ اليوم.</p>
              <button className="btn btn-primary text-lg px-12 py-4">احجز جلستك الاستشارية المجانية الآن</button>
            </div>

            <div className="footer-links-grid">
              <div className="footer-col">
                <div className="nav-brand mb-6 text-white">
                  <Zap size={24} fill="currentColor" /> <span>AURA</span>
                </div>
                <p className="text-sm text-white/60 mb-4">
                  وكالة رقمية مقرها الرياض، نكرس شغفنا وخبرتنا لبناء علامات تجارية رقمية تتحدى المستحيل وتخلق تأثيراً دائماً.
                </p>
              </div>
              <div className="footer-col">
                <h4>الخدمات الرئيسية</h4>
                <a href="#" className="footer-link">بناء الهوية البصرية</a>
                <a href="#" className="footer-link">تطوير المواقع والتطبيقات</a>
                <a href="#" className="footer-link">التسويق الرقمي (SEO/SEM)</a>
                <a href="#" className="footer-link">حلول التجارة الإلكترونية</a>
              </div>
              <div className="footer-col">
                <h4>روابط سريعة</h4>
                <a href="#" className="footer-link">عن أورا</a>
                <a href="#" className="footer-link">معرض الأعمال</a>
                <a href="#" className="footer-link">المدونة والمقالات</a>
                <a href="#" className="footer-link">الوظائف (نحن نوظف!)</a>
              </div>
              <div className="footer-col">
                <h4>تواصل معنا</h4>
                <a href="mailto:hello@aurateam3.com" className="footer-link flex items-center gap-2">hello@aurateam3.com</a>
                <a href="tel:+966500000000" className="footer-link flex items-center gap-2">+966 50 000 0000</a>
                <div className="flex gap-4 mt-4">
                  {/* Social Icons placeholders */}
                  <div className="w-10 h-10 rounded-full bg-white/10 flex-center cursor-pointer hover:bg-primary transition-all">X</div>
                  <div className="w-10 h-10 rounded-full bg-white/10 flex-center cursor-pointer hover:bg-primary transition-all">In</div>
                  <div className="w-10 h-10 rounded-full bg-white/10 flex-center cursor-pointer hover:bg-primary transition-all">Ig</div>
                </div>
              </div>
            </div>

            <div className="footer-bottom">
              <div className="flex-between flex-col md:flex-row gap-4">
                <p>© 2026 AURA Digital Agency. جميع الحقوق محفوظة.</p>
                <div className="flex gap-6">
                  <a href="#" className="hover:text-white transition-colors">سياسة الخصوصية</a>
                  <a href="#" className="hover:text-white transition-colors">الشروط والأحكام</a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

// =========================================
// ISOLATED FAQ COMPONENT (For Cleaner Main Component)
// =========================================
const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const faqs = [
    { 
      q: "ما الذي يميز 'أورا' عن باقي الوكالات الرقمية في السوق؟", 
      a: "نحن لا نعتمد على الحدس، بل على البيانات. الفرق الجوهري هو منهجيتنا التي تدمج بين الإبداع الفني (لجذب الانتباه) والتحليل الدقيق للبيانات (لضمان النتائج). بالإضافة إلى ذلك، نحن نعتبر أنفسنا شركاء نجاح وليس مجرد موردين، فنحن نستثمر الوقت لفهم عملك كأنه عملنا الخاص."
    },
    { 
      q: "كم تبلغ التكلفة التقديرية لمشروع متكامل (هوية + موقع)؟", 
      a: "التكلفة ليست رقماً ثابتاً، بل استثمار يعتمد على حجم طموحاتك وتعقيد المشروع. المشاريع المخصصة للشركات الناشئة تختلف عن المنصات الكبيرة للشركات القائمة. لكننا نضمن لك دائماً أفضل قيمة مقابل السعر، مع خطط دفع مرنة تناسب ميزانيتك. تواصل معنا للحصول على عرض سعر مخصص." 
    },
    { 
      q: "كم تستغرق مدة تنفيذ المشروع من البداية للنهاية؟", 
      a: "نحن نحترم وقتك بشدة. للمواقع التعريفية والهويات البصرية، تتراوح المدة عادة بين 3-5 أسابيع. أما مشاريع التجارة الإلكترونية والمنصات المعقدة فقد تستغرق 6-10 أسابيع لضمان أعلى جودة. نحن نضع جدولاً زمنياً واضحاً في بداية المشروع ونلتزم به." 
    },
    { 
      q: "هل سأتمكن من إدارة محتوى موقعي بنفسي بعد الإطلاق؟", 
      a: "بالتأكيد! نحن نبني جميع مواقعنا باستخدام أنظمة إدارة محتوى (CMS) حديثة وسهلة الاستخدام (مثل Sanity أو Strapi المربوطة بـ Next.js). سنوفر لك تدريباً كاملاً لك ولفريقك لتتمكنوا من إضافة المقالات، المنتجات، وتعديل النصوص والصور بسهولة تامة دون الحاجة لخبرة برمجية." 
    },
    { 
      q: "هل تقدمون خدمات استضافة ودعم فني بعد تسليم المشروع؟", 
      a: "نعم، علاقتنا لا تنتهي عند التسليم. نقدم باقات استضافة سحابية فائقة السرعة والأمان، بالإضافة إلى عقود صيانة ودعم فني (SLA) تضمن أن موقعك يعمل بكفاءة 24/7، مع تحديثات دورية للحماية والأداء." 
    }
  ];

  return (
    <section className="container py-24 max-w-4xl mx-auto" id="الأسئلة_الشائعة">
      <div className="text-center mb-16">
        <h2>إجابات شفافة <span className="text-gradient">لأسئلتك</span></h2>
        <p>كل ما تحتاج معرفته قبل بدء شراكتنا.</p>
      </div>
      <div className="flex flex-col gap-4">
        {faqs.map((item, index) => (
          <div key={index} className={`faq-item ${activeIndex === index ? 'active' : ''}`}>
            <button className="faq-trigger" onClick={() => setActiveIndex(activeIndex === index ? null : index)}>
              <span>{item.q}</span>
              <Plus size={24} className={`text-primary transition-transform duration-300 ${activeIndex === index ? 'rotate-45' : ''}`} />
            </button>
            <AnimatePresence>
              {activeIndex === index && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: 'auto', opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="faq-answer">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
};
