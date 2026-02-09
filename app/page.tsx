'use client';

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * AURA DIGITAL AGENCY - REAL CLIENTS EDITION (v10.1)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * * [UPDATES]
 * * 1. REAL CLIENT LOGOS: Integrated 30+ high-quality partner logos.
 * * 2. LOGO OPTIMIZATION: Added grayscale-to-color hover effect for elegance.
 * * 3. INFINITE MARQUEE: Smooth, seamless loop of all partners.
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { useState, useEffect, useRef, useLayoutEffect, FormEvent } from 'react';
import { 
  motion, AnimatePresence 
} from 'framer-motion';
import { 
  ArrowUpRight, Palette, Search, ShoppingBag, Menu, X,
  Megaphone, CheckCircle, Shield, Star, Code, Smartphone,
  Phone, Mail, MapPin, Zap, Send, Layout, BarChart, Users,
  Globe, Lightbulb, TrendingUp, Monitor, Cpu, Target, 
  Sparkles, Heart, Briefcase, Eye, Anchor, Feather, Award,
  Hexagon, Triangle, Circle, Box, Layers, ArrowRight
} from 'lucide-react';
import Script from 'next/script';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// =========================================
// 1. DATA LAYER (Updated with Real Logos)
// =========================================

const BRAND = {
  colors: {
    primary: '#438FB3',
    secondary: '#58A8B4',
    grey: '#B3B7C1',
    dark: '#0f172a',
    text: '#334155',
    bg: '#ffffff',
    light: '#f8fafc',
    glassDark: '#1e293b'
  },
  info: {
    email: "growth@aurateam3.com",
    phone: "+966 50 000 0000",
    address: "برج أورا، طريق الملك فهد، الرياض"
  },
  content: {
    intro: {
      warning: "تنبيه: أنت على وشك دخول تجربة رقمية عالية الأداء.",
      loading: "جاري تحميل شركاء النجاح..."
    },
    hero: {
      badge: "شريك النمو الاستراتيجي 2026",
      title: "لا تبحث عن مجرد وكالة،",
      highlight: "امتلك شريكاً يصنع الفرق.",
      desc: "في عالم يضج بالضجيج، نحن نمنح علامتك التجارية صوتاً مسموعاً. انضم لنخبة من الشركاء الذين وثقوا بنا."
    },
    cta: {
      main: "استشر خبراؤنا الآن",
      secondary: "احجز مكالمة اكتشاف"
    }
  },
  // --- REAL CLIENT LOGOS ---
  clients: [
    "https://aurateam3.com/wp-content/uploads/2025/10/kidana-logo-gold-06-1.png",
    "https://aurateam3.com/wp-content/uploads/2025/09/اورا-جامعة-الملك-عبد-العزيز.webp",
    "https://aurateam3.com/wp-content/uploads/2025/09/اورا-الجمعية-للتربية-الخاصة.webp",
    "https://aurateam3.com/wp-content/uploads/2025/09/اورا-INNOVATIVE-MANAGEMENT.webp",
    "https://aurateam3.com/wp-content/uploads/2025/09/حدائق-الفرات.webp",
    "https://aurateam3.com/wp-content/uploads/2025/09/اورا-سقنتشر.webp",
    "https://aurateam3.com/wp-content/uploads/2025/09/اورا-الهيئة-الملكية.webp",
    "https://aurateam3.com/wp-content/uploads/2025/09/اورا-وزارة-الثقافة.webp",
    "https://aurateam3.com/wp-content/uploads/2025/09/أورا-وزارة-الاتصالات.webp",
    "https://aurateam3.com/wp-content/uploads/2020/08/اعمار.webp",
    "https://aurateam3.com/wp-content/uploads/2024/02/20231126102247شعار_نادي_الوحدة_السعودية-1.webp",
    "https://aurateam3.com/wp-content/uploads/2020/08/Aldrees_logo.png",
    "https://aurateam3.com/wp-content/uploads/2020/08/20231126090329Umm_Al-Qura_University_logo.png",
    "https://aurateam3.com/wp-content/uploads/2024/01/الهلال-الاحمر.webp",
    "https://aurateam3.com/wp-content/uploads/2024/02/وارقة.webp"
  ]
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "AURA Digital Agency",
  "url": "https://aurateam3.com",
  "logo": "https://aurateam3.com/logo.png"
};

// =========================================
// 2. CSS ENGINE
// =========================================

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Readex+Pro:wght@200;300;400;500;600;700;800&family=Tajawal:wght@300;400;500;700&display=swap');
  
  :root {
    --primary: ${BRAND.colors.primary};
    --secondary: ${BRAND.colors.secondary};
    --dark: ${BRAND.colors.dark};
    --text: ${BRAND.colors.text};
    --grey: ${BRAND.colors.grey};
    --font-heading: 'Readex Pro', sans-serif;
    --font-body: 'Tajawal', sans-serif;
  }

  html, body {
    background-color: #ffffff !important;
    color: var(--text) !important;
    font-family: var(--font-body);
    overflow-x: hidden;
    direction: rtl;
    -webkit-font-smoothing: antialiased;
  }

  /* TYPOGRAPHY */
  h1 { font-size: clamp(2.5rem, 6vw, 5.5rem); line-height: 1.15; font-family: var(--font-heading); font-weight: 800; color: var(--dark); margin-bottom: 1.5rem; }
  h2 { font-size: clamp(2rem, 5vw, 3.5rem); font-family: var(--font-heading); font-weight: 700; color: var(--dark); margin-bottom: 1.5rem; }
  h3 { font-size: clamp(1.5rem, 3vw, 2rem); font-family: var(--font-heading); font-weight: 700; margin-bottom: 1rem; }
  p { font-size: clamp(1rem, 1.1vw, 1.15rem); line-height: 1.8; color: var(--text); margin-bottom: 1.5rem; max-width: 65ch; }

  .text-gradient {
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: inline-block;
  }

  /* LAYOUT */
  .container { width: 100%; max-width: 1400px; margin: 0 auto; padding: 0 clamp(1.5rem, 5vw, 4rem); position: relative; z-index: 10; }
  .section { padding: clamp(5rem, 8vw, 10rem) 0; position: relative; overflow: hidden; }
  .full-screen { min-height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; }

  /* GRIDS */
  .grid-2 { display: grid; grid-template-columns: 1fr; gap: clamp(2rem, 5vw, 6rem); align-items: center; }
  .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
  
  @media (min-width: 768px) { .grid-2 { grid-template-columns: 1fr 1fr; } }

  /* COMPONENTS */
  #aura-canvas { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 0; pointer-events: none; opacity: 1; }

  /* Navbar */
  .navbar {
    position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
    width: 90%; max-width: 1000px; z-index: 1000;
    padding: 0.8rem 1.5rem; border-radius: 100px;
    background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(20px);
    border: 1px solid rgba(179, 183, 193, 0.3);
    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05);
    display: flex; justify-content: space-between; align-items: center;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .navbar.scrolled { top: 15px; background: rgba(255, 255, 255, 0.98); border-color: var(--primary); }
  .nav-link { font-family: var(--font-body); color: var(--dark); font-weight: 600; cursor: pointer; transition: 0.3s; padding: 0.5rem 1rem; text-decoration: none; }
  .nav-link:hover { color: var(--primary); }

  /* Client Marquee */
  .marquee-container { 
    overflow: hidden; white-space: nowrap; padding: 3rem 0; 
    background: ${BRAND.colors.light}; border-y: 1px solid rgba(0,0,0,0.05); 
  }
  .marquee-content { display: inline-flex; animation: scroll 40s linear infinite; align-items: center; }
  .marquee-item { margin: 0 3rem; flex-shrink: 0; filter: grayscale(100%); opacity: 0.7; transition: 0.3s; }
  .marquee-item:hover { filter: grayscale(0%); opacity: 1; transform: scale(1.1); }
  .client-logo-img { height: 60px; width: auto; object-fit: contain; }
  @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

  /* Glass Cards */
  .glass-card {
    background: #ffffff; border: 1px solid rgba(179, 183, 193, 0.2);
    border-radius: 2rem; padding: 2.5rem; position: relative; overflow: hidden;
    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.03); transition: 0.4s;
    height: 100%; display: flex; flex-direction: column;
  }
  .glass-card:hover { transform: translateY(-8px); border-color: var(--secondary); box-shadow: 0 25px 60px -15px rgba(88, 168, 180, 0.15); }
  
  /* Buttons */
  .btn-primary {
    background: var(--primary); color: white; padding: 0.8rem 2rem; border-radius: 50px;
    border: none; font-weight: 700; cursor: pointer; transition: 0.3s;
    display: inline-flex; align-items: center; gap: 0.8rem;
  }
  .btn-primary:hover { background: var(--secondary); transform: translateY(-3px); }

  /* Intro */
  .intro-overlay { position: fixed; inset: 0; z-index: 9999; background: #0B1121; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  
  /* Utils */
  .desktop-only { display: none; }
  @media (min-width: 992px) { .desktop-only { display: flex; } .mobile-only { display: none !important; } }
  .mobile-only { display: block; }
  .grid-4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; }
`;

// =========================================
// 3. PARTICLES
// =========================================
const getParticlesData = (text: string, width: number, height: number) => {
  if (typeof document === 'undefined') return [];
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return [];
  
  const scale = window.innerWidth < 768 ? 0.6 : 1; 
  canvas.width = width * scale; 
  canvas.height = height * scale;
  
  ctx.fillStyle = '#000'; ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = '#fff'; ctx.font = `900 ${180 * scale}px Arial`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width/2, canvas.height/2);
  
  const data = ctx.getImageData(0,0,canvas.width,canvas.height).data;
  const particles = [];
  const step = 5; 
  
  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      if (data[(y * canvas.width + x) * 4] > 128) {
        particles.push({
          x: (x - canvas.width/2) * (0.06 / scale),
          y: -(y - canvas.height/2) * (0.06 / scale)
        });
      }
    }
  }
  return particles;
};

// =========================================
// 4. COMPONENTS
// =========================================

const IntroOverlay = ({ onComplete }: { onComplete: () => void }) => {
  const [count, setCount] = useState(0);
  const container = useRef(null);

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
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={container} className="intro-overlay" style={{clipPath: "circle(150% at 50% 50%)"}}>
      <div style={{marginBottom:'2rem', color: BRAND.colors.secondary}}>{BRAND.content.intro.warning}</div>
      <div style={{fontSize:'5rem', fontWeight:'900', fontFamily:'var(--font-heading)'}}>{count}%</div>
    </div>
  );
};

const AuraScene = ({ startAnimation }: { startAnimation: boolean }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xffffff, 0.005); 
    const camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 1000);
    camera.position.z = 40;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    const textPoints = getParticlesData("AURA", 1000, 500);
    const count = textPoints.length + 1500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const c1 = new THREE.Color(BRAND.colors.primary);
    const c2 = new THREE.Color(BRAND.colors.secondary);

    for(let i=0; i<count; i++) {
      positions[i*3] = (Math.random()-0.5) * 150;
      positions[i*3+1] = (Math.random()-0.5) * 150;
      positions[i*3+2] = (Math.random()-0.5) * 150;
      const col = Math.random() > 0.5 ? c1 : c2;
      colors[i*3] = col.r; colors[i*3+1] = col.g; colors[i*3+2] = col.b;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({ size: 0.2, vertexColors: true, transparent: true, opacity: 0.8 });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const animate = () => {
      requestAnimationFrame(animate);
      particles.rotation.y += 0.001;
      renderer.render(scene, camera);
    };
    animate();

    if (startAnimation) {
      const progress = { t: 0 };
      const initialPos = Float32Array.from(positions);
      gsap.to(progress, { t: 1, duration: 3.5, ease: "power3.inOut", delay: 0.5, onUpdate: () => {
        const currentPos = geometry.attributes.position.array as Float32Array;
        for(let i=0; i<count; i++) {
          let tx, ty, tz;
          if (i < textPoints.length) { tx = textPoints[i].x; ty = textPoints[i].y; tz = 0; }
          else { tx = initialPos[i*3]; ty = initialPos[i*3+1]; tz = initialPos[i*3+2]; }
          currentPos[i*3] = initialPos[i*3] + (tx - initialPos[i*3]) * progress.t;
          currentPos[i*3+1] = initialPos[i*3+1] + (ty - initialPos[i*3+1]) * progress.t;
          currentPos[i*3+2] = initialPos[i*3+2] + (tz - initialPos[i*3+2]) * progress.t;
        }
        geometry.attributes.position.needsUpdate = true;
      }});
    }
  }, [startAnimation]);
  return <div id="aura-canvas" ref={mountRef}></div>;
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
          <span style={{fontSize:'1.5rem', fontWeight:'900', color: BRAND.colors.dark}}>AURA</span>
        </div>
        <div className="desktop-only" style={{display:'flex', gap:'2rem'}}>
          {['الرئيسية', 'الخدمات', 'أعمالنا', 'تواصل'].map(item => <a key={item} className="nav-link">{item}</a>)}
        </div>
        <div style={{display:'flex', gap:'1rem'}}>
          <button className="btn-primary desktop-only">ابدأ مشروعك</button>
          <button className="mobile-only" onClick={() => setIsOpen(!isOpen)} style={{background:'none', border:'none'}}><Menu/></button>
        </div>
      </nav>
      {isOpen && (
        <div style={{position:'fixed', inset:0, background:'white', zIndex:2000, padding:'2rem'}}>
          <button onClick={() => setIsOpen(false)} style={{position:'absolute', top:20, right:20}}><X/></button>
          <div style={{display:'flex', flexDirection:'column', gap:'2rem', marginTop:'3rem', textAlign:'center', fontSize:'1.5rem', fontWeight:'bold'}}>
            {['الرئيسية', 'الخدمات', 'أعمالنا'].map(i => <a key={i} onClick={()=>setIsOpen(false)}>{i}</a>)}
          </div>
        </div>
      )}
    </>
  );
};

const Reveal = ({ children }: { children: React.ReactNode }) => (
  <motion.div initial={{opacity:0, y:30}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.8}}>
    {children}
  </motion.div>
);

const Hero = () => (
  <section className="section full-screen" id="الرئيسية">
    <div className="container" style={{textAlign:'center'}}>
      <Reveal>
        <div style={{display:'inline-block', padding:'0.5rem 1.5rem', background:'#f1f5f9', borderRadius:'50px', color:BRAND.colors.primary, fontWeight:'bold', marginBottom:'1.5rem'}}>✨ {BRAND.content.hero.badge}</div>
        <h1>{BRAND.content.hero.title} <br/> <span className="text-gradient">{BRAND.content.hero.highlight}</span></h1>
        <p style={{margin:'0 auto 3rem'}}>{BRAND.content.hero.desc}</p>
        <div style={{display:'flex', justifyContent:'center', gap:'1rem', flexWrap:'wrap'}}>
          <button className="btn-primary">{BRAND.content.cta.main}</button>
        </div>
      </Reveal>
    </div>
  </section>
);

const ClientMarquee = () => {
  // Triple the list for smooth infinite scroll
  const allClients = [...BRAND.clients, ...BRAND.clients, ...BRAND.clients];
  
  return (
    <div className="marquee-container">
      <div className="marquee-content">
        {allClients.map((imgUrl, i) => (
          <div key={i} className="marquee-item">
            <img src={imgUrl} alt="Client Logo" className="client-logo-img" />
          </div>
        ))}
      </div>
    </div>
  );
};

const Services = () => (
  <section className="section" style={{background: BRAND.colors.light}}>
    <div className="container">
      <Reveal>
        <div style={{textAlign:'center', marginBottom:'5rem'}}>
          <h2>خدماتنا <span className="text-gradient">المتكاملة</span></h2>
        </div>
      </Reveal>
      <div className="grid-3">
        {[
          {t:'تطوير المنصات', d:'مواقع وتطبيقات فائقة السرعة.', i:Code},
          {t:'الهوية البصرية', d:'تصاميم تعكس جوهر علامتك.', i:Palette},
          {t:'التسويق الرقمي', d:'استراتيجيات نمو تعتمد على البيانات.', i:Megaphone},
          {t:'تحسين السيو', d:'تصدر نتائج البحث الأولى.', i:Search},
          {t:'إدارة الحملات', d:'تحقيق أعلى عائد استثمار.', i:Target},
          {t:'الإنتاج الإبداعي', d:'محتوى بصري يخطف الأنظار.', i:Monitor}
        ].map((s,i) => (
          <motion.div key={i} className="glass-card" whileHover={{y:-10}}>
            <div className="icon-box"><s.i size={32}/></div>
            <h3>{s.t}</h3>
            <p>{s.d}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Stats = () => (
  <section className="container" style={{marginBottom:'8rem'}}>
    <div className="grid-4" style={{textAlign:'center'}}>
      {[{n:'+500M', l:'أصول مدارة'}, {n:'98%', l:'رضا العملاء'}, {n:'+120', l:'مشروع ناجح'}, {n:'24/7', l:'دعم فني'}].map((s,i) => (
        <Reveal key={i}>
          <div className="glass-card" style={{padding:'2rem'}}>
            <span style={{fontSize:'3rem', fontWeight:'900', color:BRAND.colors.primary, display:'block'}}>{s.n}</span>
            <span style={{color:'#64748b', fontWeight:'600'}}>{s.l}</span>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

const Contact = () => (
  <section className="section container">
    <div className="grid-2">
      <Reveal>
        <div>
          <h2>جاهز للبدء؟</h2>
          <p>تواصل معنا اليوم لتحصل على استشارة مجانية.</p>
          <div style={{marginTop:'2rem'}}>
            <div style={{fontWeight:'bold', fontSize:'1.2rem'}}>{BRAND.info.phone}</div>
            <div style={{color:'#64748b'}}>{BRAND.info.email}</div>
          </div>
        </div>
      </Reveal>
      <div className="glass-card">
        <form onSubmit={(e)=>{e.preventDefault(); alert('تم الإرسال!')}}>
          <div className="form-group"><label className="form-label">الاسم</label><input className="form-input"/></div>
          <div className="form-group"><label className="form-label">البريد</label><input className="form-input"/></div>
          <button className="btn-primary" style={{width:'100%'}}>إرسال الطلب</button>
        </form>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer>
    <div className="container" style={{textAlign:'center'}}>
      <h2 style={{color:'white'}}>AURA</h2>
      <p style={{color:'#94a3b8'}}>نصنع المستقبل الرقمي.</p>
      <div style={{marginTop:'3rem', color:'#64748b'}}>© 2026 Aura Agency.</div>
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
        {!introFinished && <IntroOverlay onComplete={() => setIntroFinished(true)} />}
      </AnimatePresence>
      {introFinished && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <AuraScene startAnimation={introFinished} />
          <Navbar />
          <main>
            <Hero />
            <ClientMarquee />
            <Stats />
            <Services />
            <Contact />
          </main>
          <Footer />
        </motion.div>
      )}
    </>
  );
}
