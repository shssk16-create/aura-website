'use client';

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowUpRight, Megaphone, PenTool, Search, Palette, 
  ShoppingBag, Plus, Menu, X, Globe, ChevronDown, Zap, 
  CheckCircle, Users, BarChart 
} from 'lucide-react';
import Script from 'next/script';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// --- SEO: البيانات المنظمة المتقدمة ---
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "AURA Digital Agency",
  "image": "https://aurateam3.com/logo.png",
  "description": "وكالة أورا الرقمية: شريكك الاستراتيجي في بناء العلامات التجارية، تطوير المواقع الإلكترونية، والتسويق الرقمي في المملكة العربية السعودية.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Riyadh",
    "addressCountry": "SA"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "24.7136",
    "longitude": "46.6753"
  },
  "url": "https://aurateam3.com",
  "telephone": "+966500000000",
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
    "opens": "09:00",
    "closes": "18:00"
  }
};

// --- CSS SYSTEM (Updated for new sections) ---
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Readex+Pro:wght@200;300;400;500;600;700&display=swap');
  
  @font-face {
    font-family: 'DIN Next LT Arabic';
    src: url('https://aurateam3.com/wp-content/uploads/2025/10/DINNextLTArabic-Regular.woff2') format('woff2');
    font-weight: 400; font-display: swap;
  }
  @font-face {
    font-family: 'DIN Next LT Arabic';
    src: url('https://aurateam3.com/wp-content/uploads/2025/10/DINNextLTArabic-Bold-2.woff2') format('woff2');
    font-weight: 700; font-display: swap;
  }

  :root {
    --primary: #4390b3;
    --primary-glow: rgba(67, 144, 179, 0.4);
    --bg-dark: #050607;
    --white: #ffffff;
    --glass-border: rgba(255, 255, 255, 0.08);
    --text-muted: #9ca3af;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  body {
    background-color: var(--bg-dark);
    color: var(--white);
    font-family: 'DIN Next LT Arabic', 'Readex Pro', sans-serif;
    overflow-x: hidden;
    direction: rtl;
    line-height: 1.6;
  }

  /* Layout */
  .container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; position: relative; }
  .flex-center { display: flex; align-items: center; justify-content: center; }
  .flex-between { display: flex; align-items: center; justify-content: space-between; }
  .text-gradient { background: linear-gradient(135deg, #fff 0%, var(--primary) 100%); -webkit-background-clip: text; color: transparent; }
  .full-screen { height: 100vh; width: 100%; position: relative; overflow: hidden; }

  /* Capsule Navbar */
  .navbar {
    position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
    width: 90%; max-width: 850px; z-index: 1000;
    padding: 0.8rem 1.5rem; border-radius: 100px;
    background: rgba(15, 17, 21, 0.6); backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.3);
    transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  .navbar.scrolled { top: 15px; background: rgba(15, 17, 21, 0.85); border-color: rgba(67, 144, 179, 0.25); }
  .nav-links { display: flex; gap: 2.5rem; }
  .nav-link { color: rgba(255,255,255,0.8); text-decoration: none; transition: 0.3s; font-weight: 500; font-size: 0.95rem; position: relative; }
  .nav-link:hover { color: white; }

  /* Typography */
  h1 { font-size: clamp(2.5rem, 6vw, 5rem); font-weight: 800; line-height: 1.2; margin-bottom: 1.5rem; }
  h2 { font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; margin-bottom: 1.5rem; }
  h3 { font-size: 1.4rem; font-weight: 700; margin-bottom: 0.8rem; }
  p { color: var(--text-muted); font-size: 1.05rem; max-width: 65ch; margin: 0 auto; }

  /* Buttons */
  .btn-primary {
    background: var(--white); color: black; padding: 0.8rem 2rem; border: none;
    border-radius: 50px; cursor: pointer; font-weight: 700; transition: 0.3s; font-size: 0.95rem;
  }
  .btn-primary:hover { background: var(--primary); color: white; box-shadow: 0 0 20px var(--primary-glow); }

  /* Glass Card */
  .glass-card {
    background: rgba(255, 255, 255, 0.03); border: 1px solid var(--glass-border);
    backdrop-filter: blur(20px); border-radius: 1.5rem; padding: 2.5rem;
    transition: 0.4s; position: relative; overflow: hidden; height: 100%;
  }
  .glass-card:hover { border-color: var(--primary); transform: translateY(-5px); }

  /* Process Section (New) */
  .process-step { position: relative; padding-right: 2rem; border-right: 2px solid rgba(255,255,255,0.1); margin-bottom: 3rem; }
  .process-step::before {
    content: ''; position: absolute; right: -9px; top: 0; width: 16px; height: 16px;
    background: var(--bg-dark); border: 2px solid var(--primary); border-radius: 50%;
  }
  .process-number { font-size: 4rem; font-weight: 900; position: absolute; left: 1rem; top: 0; opacity: 0.05; color: white; }

  /* Stats Grid (New) */
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; margin: 4rem 0; text-align: center; }
  .stat-number { font-size: 3rem; font-weight: 800; color: var(--primary); display: block; }
  .stat-label { font-size: 0.9rem; letter-spacing: 1px; }

  /* Responsive */
  .desktop-only { display: flex; } .mobile-only { display: none; }
  @media (max-width: 768px) {
    .nav-links, .desktop-only, .btn-primary { display: none; } .mobile-only { display: block; }
    .stats-grid { grid-template-columns: 1fr 1fr; }
    .bento-grid { grid-template-columns: 1fr; }
    .col-span-2 { grid-column: auto; }
  }
`;

// --- Components ---

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler); return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="flex-between" style={{width: '100%'}}>
        <div className="flex-center" style={{gap: '10px', cursor:'pointer'}}>
          <div style={{width:20, height:20, border:'2px solid var(--primary)', borderRadius:'6px', display:'grid', placeItems:'center'}}>
            <div style={{width:8, height:8, background:'var(--primary)', borderRadius:'50%'}}></div>
          </div>
          <span style={{fontSize:'1.3rem', fontWeight:'800'}}>AURA</span>
        </div>
        <div className="nav-links">
          {['الخدمات', 'منهجية العمل', 'الأعمال', 'المدونة'].map((item) => <a key={item} href={`#${item}`} className="nav-link">{item}</a>)}
        </div>
        <button className="btn-primary">استشارة مجانية</button>
        <button className="mobile-only" style={{background:'none', border:'none', color:'white'}}><Menu /></button>
      </div>
    </nav>
  );
};

const HeroScene = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const particlesGeometry = new THREE.BufferGeometry();
    const count = 3000;
    const posArray = new Float32Array(count * 3);
    for(let i = 0; i < count * 3; i++) posArray[i] = (Math.random() - 0.5) * 60;
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const material = new THREE.PointsMaterial({ size: 0.12, color: 0x4390b3, transparent: true, opacity: 0.8 });
    const particles = new THREE.Points(particlesGeometry, material);
    scene.add(particles);

    const animate = () => {
      requestAnimationFrame(animate);
      particles.rotation.y += 0.001; particles.rotation.x += 0.0005;
      renderer.render(scene, camera);
    };
    animate();
    
    const resize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', resize);
    return () => { window.removeEventListener('resize', resize); renderer.dispose(); };
  }, []);

  return (
    <div className="full-screen flex-center" style={{flexDirection: 'column'}}>
      <canvas ref={canvasRef} className="full-screen" style={{position:'absolute', top:0, left:0, zIndex:0}} />
      <div style={{position:'relative', zIndex:10, textAlign:'center', padding:'0 1rem'}}>
        <motion.div initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} transition={{duration:1}}>
          <div style={{marginBottom:'1.5rem', display:'inline-block', padding:'0.5rem 1.5rem', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'50px', background:'rgba(255,255,255,0.05)'}}>
            ✨ شريكك الرقمي في رؤية 2030
          </div>
          <h1>نحول الأفكار إلى <br/><span className="text-gradient">منظومات رقمية ذكية</span></h1>
          <p style={{marginBottom: '2rem'}}>
            في وكالة أورا، نمزج الإبداع الفني مع ذكاء البيانات لنبني علامات تجارية تتصدر السوق السعودي. 
            لسنا مجرد مصممين، نحن مهندسو تجارب رقمية.
          </p>
          <div className="flex-center" style={{gap: '1rem'}}>
            <button className="btn-primary">اكتشف خدماتنا</button>
            <button style={{background:'transparent', color:'white', border:'1px solid rgba(255,255,255,0.2)', padding:'0.8rem 2rem', borderRadius:'50px', cursor:'pointer'}}>مشاهدة الأعمال</button>
          </div>
        </motion.div>
      </div>
      <div style={{position:'absolute', bottom: 30, opacity: 0.6}}><ChevronDown className="animate-bounce" /></div>
    </div>
  );
};

const AboutAndStats = () => {
  return (
    <section className="container" style={{padding: '6rem 1.5rem'}}>
      <div style={{textAlign: 'center', maxWidth: '800px', margin: '0 auto'}}>
        <h2 style={{fontSize: '2.5rem'}}>لماذا تختار <span className="text-gradient">أورا؟</span></h2>
        <p style={{fontSize: '1.1rem', marginBottom: '3rem'}}>
          في عالم يضج بالضوضاء الرقمية، نحن نصنع الوضوح. نؤمن بأن التصميم الجميل لا يكفي؛ يجب أن يعمل. 
          نعتمد منهجية "التصميم المبني على الأداء" لضمان عائد حقيقي على استثمارك (ROI).
          فريقنا يجمع بين خبراء الاستراتيجية، مطوري الويب، ومبدعي المحتوى لتقديم حلول شاملة.
        </p>
      </div>
      
      <div className="stats-grid">
        {[
          { num: "+50", label: "مشروع ناجح" },
          { num: "98%", label: "رضا العملاء" },
          { num: "+5", label: "سنوات خبرة" },
          { num: "24/7", label: "دعم فني" }
        ].map((s, i) => (
          <div key={i} className="glass-card" style={{padding: '2rem'}}>
            <span className="stat-number">{s.num}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

const ServicesDetailed = () => {
  const services = [
    { title: "بناء العلامة التجارية", desc: "نصمم هوية بصرية كاملة (Logo, Guidelines) تعكس قيم شركتك وتخاطب جمهورك المستهدف بذكاء.", icon: Palette, span: "col-span-2" },
    { title: "تطوير المواقع والتطبيقات", desc: "مواقع سريعة، آمنة، ومتجاوبة مع الجوال باستخدام أحدث التقنيات (Next.js & React).", icon: Globe, span: "" },
    { title: "التسويق الرقمي و SEO", desc: "نضمن ظهور موقعك في الصفحة الأولى على جوجل، وندير حملات إعلانية تحقق مبيعات.", icon: Megaphone, span: "" },
    { title: "تصميم تجربة المستخدم (UI/UX)", desc: "نحلل سلوك المستخدم لنبني واجهات سهلة الاستخدام تزيد من معدلات التحويل.", icon: Zap, span: "col-span-2" },
    { title: "إدارة المتاجر الإلكترونية", desc: "حلول متكاملة لمنصات سلة وزيد، من التصميم إلى تحسين المبيعات.", icon: ShoppingBag, span: "" },
  ];

  return (
    <section className="container" id="الخدمات" style={{paddingBottom: '6rem'}}>
      <h2 style={{textAlign: 'center', marginBottom: '3rem'}}>خدماتنا <span className="text-gradient">الاحترافية</span></h2>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem'}}>
        {services.map((s, i) => (
          <div key={i} className={`glass-card`} style={i===0 || i===3 ? {gridColumn: 'span 2'} : {}}>
            <div style={{background: 'rgba(67, 144, 179, 0.1)', width: 'fit-content', padding: '10px', borderRadius: '10px', marginBottom: '1rem', color: 'var(--primary)'}}>
              <s.icon size={28} />
            </div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
            <div style={{marginTop: '1.5rem', color: 'var(--primary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px'}}>
              تفاصيل الخدمة <ArrowUpRight size={16} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const ProcessTimeline = () => {
  const steps = [
    { title: "الاكتشاف والتحليل", desc: "نبدأ بفهم عميق لأهدافك، تحليل المنافسين، ودراسة جمهورك المستهدف لوضع استراتيجية دقيقة." },
    { title: "التخطيط والاستراتيجية", desc: "نرسم خارطة طريق واضحة تشمل هيكلية الموقع (Sitemap)، وتجربة المستخدم (User Journey)." },
    { title: "التصميم والتطوير", desc: "مرحلة الإبداع! نصمم واجهات عصرية ونكتب كوداً نظيفاً (Clean Code) يضمن الأداء العالي." },
    { title: "الإطلاق والنمو", desc: "بعد اختبارات صارمة، نطلق مشروعك للعالم ونبدأ خطة التسويق لضمان الانتشار." }
  ];

  return (
    <section className="container" id="منهجية العمل" style={{padding: '6rem 1.5rem'}}>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: '4rem'}}>
        <div style={{flex: 1, minWidth: '300px'}}>
          <h2 style={{position: 'sticky', top: '100px'}}>كيف نحقق <br/><span className="text-gradient">النتائج؟</span></h2>
          <p style={{marginTop: '1rem'}}>منهجية أورا المبتكرة تضمن لك الانتقال من الفكرة إلى الواقع بأقل وقت وأعلى جودة.</p>
        </div>
        <div style={{flex: 1.5, minWidth: '300px'}}>
          {steps.map((step, i) => (
            <div key={i} className="process-step">
              <span className="process-number">0{i+1}</span>
              <h3 style={{fontSize: '1.5rem', marginBottom: '0.5rem'}}>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const WorksScroll = () => {
  const container = useRef(null); const track = useRef(null);
  useLayoutEffect(() => {
    if (window.innerWidth < 768) return;
    const ctx = gsap.context(() => {
      const trk = track.current as any;
      gsap.to(trk, {
        x: () => -(trk.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: { trigger: container.current, pin: true, scrub: 1, end: "+=3000" }
      });
    }, container);
    return () => ctx.revert();
  }, []);

  const works = [
    { name: "مشروع نيوم", cat: "تطوير ويب", img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=1000" },
    { name: "موسم الرياض", cat: "حملة تسويقية", img: "https://images.unsplash.com/photo-1596707328659-56540c490a6c?q=80&w=1000" },
    { name: "العلا", cat: "هوية بصرية", img: "https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?q=80&w=1000" },
    { name: "البحر الأحمر", cat: "تطبيق جوال", img: "https://images.unsplash.com/photo-1558231294-8777990176dc?q=80&w=1000" },
  ];

  return (
    <div ref={container} id="الأعمال" style={{height: '300vh', position: 'relative'}}>
      <div style={{position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', background: 'var(--bg-dark)'}}>
        <div className="container" style={{position:'absolute', top: '10%', right: '5%', zIndex: 10}}>
          <h2>أحدث <span className="text-gradient">مشاريعنا</span></h2>
        </div>
        <div ref={track} style={{display: 'flex', gap: '3rem', padding: '0 5vw', flexDirection: 'row-reverse'}}>
          {works.map((w, i) => (
            <div key={i} className="work-card" style={{width: '60vw', height: '60vh', flexShrink: 0, borderRadius: '2rem', overflow: 'hidden', position: 'relative', border: '1px solid var(--glass-border)'}}>
              <img src={w.img} alt={w.name} style={{width:'100%', height:'100%', objectFit:'cover'}} />
              <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem', background: 'linear-gradient(to top, black, transparent)'}}>
                <span style={{color: 'var(--primary)', fontWeight: 'bold'}}>{w.cat}</span>
                <h3 style={{fontSize: '2rem'}}>{w.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FAQ = () => {
  const [active, setActive] = useState<number | null>(0);
  const faqs = [
    { q: "ما هي تكلفة تصميم موقع إلكتروني؟", a: "تختلف التكلفة بناءً على متطلبات المشروع (عدد الصفحات، الميزات، التصميم). نقدم باقات مرنة تناسب الشركات الناشئة والشركات الكبيرة. تواصل معنا للحصول على عرض سعر دقيق." },
    { q: "كم تستغرق مدة التنفيذ؟", a: "للمواقع التعريفية، تتراوح المدة بين 2-3 أسابيع. أما المتاجر الإلكترونية والأنظمة المعقدة فقد تستغرق 4-8 أسابيع. نلتزم دائماً بالجدول الزمني المتفق عليه." },
    { q: "هل تقدمون خدمات الاستضافة والدومين؟", a: "نعم، نقدم استشارات لاختيار أفضل استضافة (Server) وحجز النطاق (Domain) لضمان سرعة وأمان موقعك." },
    { q: "هل الموقع سيكون متوافقاً مع محركات البحث (SEO)؟", a: "بالتأكيد. جميع مواقعنا تُبنى وفق معايير Google Core Web Vitals لضمان أرشفتها بسرعة وظهورها في النتائج الأولى." }
  ];

  return (
    <section className="container" style={{padding: '6rem 1.5rem', maxWidth: '900px'}}>
      <h2 style={{textAlign:'center', marginBottom: '3rem'}}>الأسئلة <span className="text-gradient">الشائعة</span></h2>
      <div className="glass-card">
        {faqs.map((f, i) => (
          <div key={i} style={{borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '1rem'}}>
            <button onClick={() => setActive(active === i ? null : i)} style={{width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 0', background: 'none', border: 'none', color: 'white', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', textAlign: 'right'}}>
              {f.q} <Plus style={{transform: active === i ? 'rotate(45deg)' : 'none', transition: '0.3s', color: 'var(--primary)'}} />
            </button>
            <AnimatePresence>
              {active === i && <motion.div initial={{height:0}} animate={{height:'auto'}} exit={{height:0}} style={{overflow: 'hidden', color: '#9ca3af'}}><p style={{paddingBottom: '1.5rem'}}>{f.a}</p></motion.div>}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
};

export default function AuraWebsite() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <Script id="json-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main>
        <HeroScene />
        <AboutAndStats />
        <ServicesDetailed />
        <ProcessTimeline />
        <WorksScroll />
        <FAQ />
      </main>
      <footer style={{borderTop: '1px solid var(--glass-border)', padding: '5rem 0 2rem', marginTop: '5rem', textAlign: 'center'}}>
        <div className="container">
          <h2 style={{fontSize: '3rem', marginBottom: '1.5rem'}}>هل أنت مستعد <span className="text-gradient">للانطلاق؟</span></h2>
          <p style={{marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem'}}>دعنا نناقش مشروعك القادم ونضع خطة نجاح مخصصة لك.</p>
          <div className="flex-center" style={{gap: '1rem', flexWrap: 'wrap'}}>
            <button className="btn-primary" style={{padding: '1rem 3rem', fontSize: '1.2rem'}}>احجز استشارة مجانية</button>
            <button style={{background:'transparent', border:'1px solid rgba(255,255,255,0.2)', color:'white', padding:'1rem 3rem', borderRadius:'50px', cursor:'pointer'}}>تواصل عبر واتساب</button>
          </div>
          <div style={{marginTop: '5rem', color: '#666', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'}}>
            <span>© 2026 AURA Digital Agency. All rights reserved.</span>
            <div style={{display: 'flex', gap: '1.5rem'}}>
              {['Twitter', 'LinkedIn', 'Instagram', 'Email'].map(s => <span key={s} style={{cursor:'pointer'}}>{s}</span>)}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
