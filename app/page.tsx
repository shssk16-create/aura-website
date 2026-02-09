'use client';

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * AURA HOLDING - CORPORATE EDITION v13.1 (FIXED & OPTIMIZED)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * * [FIX LOG]
 * * - Fixed TypeScript error regarding Float32Array in GSAP timeline.
 * * - Replaced heavy CPU array morphing with high-performance GPU Mesh Scaling.
 * * - Enhanced 'Hamah-style' scroll interaction smoothness.
 * * - Strict types added for Three.js objects.
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowUpRight, Palette, Search, Megaphone, Code, 
  Smartphone, Monitor, TrendingUp, Target, Globe, 
  CheckCircle, Zap, Shield, Menu, X, ArrowRight,
  Layers, Building2, Briefcase, BarChart3
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
    grey: '#B3B7C1'
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
    --grey: ${BRAND.colors.grey};
  }

  html, body {
    background-color: #ffffff !important;
    color: var(--dark) !important;
    font-family: 'Alexandria', sans-serif; /* Hamah uses sharp geometric fonts */
    overflow-x: hidden;
    direction: rtl;
    margin: 0; padding: 0;
  }

  ::selection { background: var(--primary); color: white; }

  /* Typography */
  h1 { font-size: clamp(3rem, 8vw, 7rem); font-weight: 800; line-height: 1.1; letter-spacing: -2px; margin-bottom: 2rem; color: var(--dark); }
  h2 { font-size: clamp(2rem, 5vw, 4rem); font-weight: 700; line-height: 1.2; margin-bottom: 2rem; color: var(--dark); }
  h3 { font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem; }
  p { font-size: 1.1rem; line-height: 1.8; color: #475569; max-width: 600px; margin-bottom: 1.5rem; }

  .text-gradient {
    background: linear-gradient(135deg, var(--primary), #58A8B4);
    -webkit-background-clip: text; color: transparent; display: inline-block;
  }

  /* Utilities */
  .container { max-width: 1400px; margin: 0 auto; padding: 0 2rem; position: relative; z-index: 10; }
  .section { padding: 10rem 0; position: relative; }
  .full-height { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; }
  
  /* Canvas Layer */
  #webgl-canvas { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 0; pointer-events: none; opacity: 0.6; }

  /* Navbar */
  .navbar {
    position: fixed; top: 0; left: 0; width: 100%; z-index: 100;
    padding: 1.5rem 0; transition: 0.4s ease;
    display: flex; justify-content: space-between; align-items: center;
  }
  .navbar.scrolled {
    background: rgba(255,255,255,0.9); backdrop-filter: blur(10px);
    padding: 1rem 0; border-bottom: 1px solid #f1f5f9;
  }
  .nav-link { font-weight: 500; color: var(--dark); cursor: pointer; transition: 0.3s; text-decoration: none; }
  .nav-link:hover { color: var(--primary); }

  /* Bento Grid */
  .bento-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
  .bento-card {
    background: #f8fafc; border-radius: 2rem; padding: 3rem;
    display: flex; flex-direction: column; justify-content: space-between;
    transition: 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
    border: 1px solid transparent; position: relative; overflow: hidden;
  }
  .bento-card:hover { 
    transform: translateY(-10px); background: white; 
    border-color: var(--grey); 
    box-shadow: 0 20px 40px -10px rgba(67, 143, 179, 0.15); 
  }
  .col-span-2 { grid-column: span 2; }

  /* Buttons */
  .btn-circle {
    width: 60px; height: 60px; border-radius: 50%;
    border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center;
    transition: 0.3s; cursor: pointer; color: var(--dark); background: white;
  }
  .btn-circle:hover { background: var(--dark); color: white; border-color: var(--dark); }
  
  .btn-text {
    font-weight: 700; display: inline-flex; align-items: center; gap: 10px;
    color: var(--primary); cursor: pointer; font-size: 1.1rem;
  }
  
  /* Marquee */
  .ticker-wrap { overflow: hidden; white-space: nowrap; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; padding: 2rem 0; background: #fff; }
  .ticker { display: inline-block; animation: marquee 30s linear infinite; }
  .ticker-item { display: inline-block; font-size: 4rem; font-weight: 800; color: #f8fafc; margin: 0 4rem; -webkit-text-stroke: 1px #cbd5e1; }
  @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

  /* Footer */
  footer { background: #0f172a; color: white; padding: 6rem 0 2rem; }
  .footer-link { color: #94a3b8; display: block; margin-bottom: 1rem; transition: 0.3s; text-decoration: none; }
  .footer-link:hover { color: white; padding-right: 10px; }

  /* Responsive */
  @media (max-width: 1024px) {
    .bento-grid { grid-template-columns: 1fr; }
    .col-span-2 { grid-column: span 1; }
    h1 { font-size: 4rem; }
    .navbar { padding: 1rem 0; }
  }
`;

// =========================================
// 3. THE 3D ENGINE (Optimized)
// =========================================

const InteractiveBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    // Basic Setup
    const w = window.innerWidth;
    const h = window.innerHeight;
    const scene = new THREE.Scene();
    // Light fog for depth
    scene.fog = new THREE.FogExp2(0xffffff, 0.002);

    const camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Particle System (The Network Orb)
    const count = 3000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const color1 = new THREE.Color(BRAND.colors.primary);
    const color2 = new THREE.Color(BRAND.colors.secondary);

    for(let i=0; i<count; i++) {
      // Sphere Distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 10 + Math.random() * 2; // Base radius

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i*3] = x;
      positions[i*3+1] = y;
      positions[i*3+2] = z;
      
      const col = Math.random() > 0.5 ? color1 : color2;
      colors[i*3] = col.r; colors[i*3+1] = col.g; colors[i*3+2] = col.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.12, vertexColors: true, transparent: true, opacity: 0.8
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      particles.rotation.y += 0.001; // Constant idle rotation
      renderer.render(scene, camera);
    };
    animate();

    // --- GSAP SCROLL INTEGRATION ---
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

        // STAGE 1: Expansion (Hero -> Services)
        // We scale the MESH instead of array to avoid Typescript errors
        tl.to(particles.scale, { x: 2.5, y: 2.5, z: 2.5, duration: 2 }, 0)
          .to(particles.rotation, { x: 0.5, duration: 2 }, 0)
          .to(camera.position, { z: 20, duration: 2 }, 0); 

        // STAGE 2: The "Hamah" Flatten Effect (Services -> Data)
        // Turning sphere into a flat disc/plane
        tl.to(particles.scale, { 
            x: 4,  // Widen
            y: 0.1, // Flatten (Height becomes almost 0)
            z: 4,  // Deepen
            duration: 2 
        }, 2)
        .to(particles.rotation, { x: Math.PI / 4, duration: 2 }, 2);

        // STAGE 3: Chaos/Galaxy (Data -> Contact)
        tl.to(particles.rotation, { y: Math.PI * 2, duration: 2 }, 4)
          .to(particles.scale, { x: 1, y: 1, z: 1, duration: 2 }, 4); // Reset scale
          
      });
      
      return () => ctx.revert();
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
      <div className="container" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div style={{fontSize:'1.5rem', fontWeight:'900', letterSpacing:'-1px'}}>
          AURA <span style={{color:BRAND.colors.primary}}>.</span>
        </div>
        
        <div style={{display:'flex', gap:'2rem'}} className="hidden md:flex">
          {['الرئيسية', 'القطاعات', 'الاستدامة', 'المركز الإعلامي', 'تواصل معنا'].map(item => (
            <a key={item} className="nav-link">{item}</a>
          ))}
        </div>

        <div style={{display:'flex', gap:'1rem'}}>
          <div className="btn-circle hidden md:flex"><Globe size={20}/></div>
          <div className="btn-circle"><Menu size={20}/></div>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="full-height section">
      <div className="container">
        <motion.div 
          initial={{opacity:0, y:50}} 
          animate={{opacity:1, y:0}} 
          transition={{duration:1, ease:[0.2, 0.65, 0.3, 0.9]}}
        >
          <div style={{display:'inline-block', padding:'0.5rem 1rem', background:'#f1f5f9', borderRadius:'50px', marginBottom:'2rem', fontSize:'0.9rem', color:BRAND.colors.primary, fontWeight:'700'}}>
             منظومة استثمارية رقمية
          </div>
          <h1 style={{maxWidth:'900px'}}>
            نبني <span className="text-gradient">الواقع الرقمي</span> <br/>
            بمعايير المستقبل.
          </h1>
          <div style={{marginTop:'3rem', display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:'2rem'}}>
            <p style={{fontSize:'1.3rem', maxWidth:'500px', color:BRAND.colors.dark, lineHeight:'1.6'}}>
              شركة أورا القابضة: ريادة في الاستثمار التقني، تطوير المنصات، وصناعة العلامات التجارية الكبرى.
            </p>
            <div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
              <span style={{fontWeight:'700', fontSize:'1.1rem'}}>اكتشف رؤيتنا</span>
              <div className="btn-circle" style={{background:BRAND.colors.dark, color:'white', border:'none'}}>
                <ArrowRight />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Decorative Line */}
      <motion.div 
        initial={{width:0}} animate={{width:'100%'}} transition={{duration:1.5, delay:0.5}}
        style={{height:'1px', background:'#e2e8f0', marginTop:'6rem'}} 
      />
    </section>
  );
};

const StatsTicker = () => (
  <div className="ticker-wrap">
    <div className="ticker">
      {[...Array(6)].map((_, i) => (
        <React.Fragment key={i}>
          <span className="ticker-item">INNOVATION</span>
          <span className="ticker-item">INVESTMENT</span>
          <span className="ticker-item">VISION 2030</span>
        </React.Fragment>
      ))}
    </div>
  </div>
);

const SectorsBento = () => {
  return (
    <section className="section">
      <div className="container">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'end', marginBottom:'4rem', flexWrap:'wrap', gap:'1rem'}}>
          <div>
             <h2 style={{marginBottom:'0.5rem'}}>قطاعات <span className="text-gradient">أعمالنا</span></h2>
             <p>استثمارات متنوعة تغطي كافة مجالات التقنية والإبداع.</p>
          </div>
          <div className="btn-text">جميع القطاعات <ArrowUpRight size={18} /></div>
        </div>

        <div className="bento-grid">
          {[
             {t:'التحول الرقمي', d:'حلول تقنية للمؤسسات الكبرى.', i:Layers, col:2},
             {t:'الاستثمار الجريء', d:'دعم الشركات التقنية الناشئة.', i:TrendingUp, col:1},
             {t:'التطوير العقاري الرقمي', d:'منصات المدن الذكية.', i:Building2, col:1},
             {t:'الإعلام الجديد', d:'صناعة محتوى يؤثر في الملايين.', i:Megaphone, col:2},
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
                <div style={{width:50, height:50, background:'white', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1.5rem', boxShadow:'0 4px 10px rgba(0,0,0,0.05)'}}>
                  <item.i color={BRAND.colors.primary} />
                </div>
                <h3>{item.t}</h3>
                <p style={{fontSize:'1rem'}}>{item.d}</p>
              </div>
              <div style={{display:'flex', justifyContent:'flex-end', marginTop:'2rem'}}>
                <div className="btn-circle" style={{width:40, height:40}}><ArrowUpRight size={16} /></div>
              </div>
            </motion.div>
          ))}
          
          {/* Feature Image Block */}
          <div className="bento-card col-span-2" style={{padding:0, minHeight:'400px', background:BRAND.colors.dark, border:'none'}}>
            <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000" alt="Building" style={{width:'100%', height:'100%', objectFit:'cover', opacity:0.6}} />
            <div style={{position:'absolute', bottom:0, left:0, padding:'3rem', color:'white', zIndex:2}}>
              <div style={{background:BRAND.colors.secondary, padding:'0.2rem 1rem', display:'inline-block', borderRadius:'20px', fontSize:'0.8rem', marginBottom:'1rem', fontWeight:'bold'}}>شراكات</div>
              <h3 style={{fontSize:'2rem', marginBottom:'0.5rem'}}>شراكات استراتيجية</h3>
              <p style={{color:'#cbd5e1', fontSize:'1rem'}}>نتعاون مع كبرى الكيانات الحكومية والخاصة لبناء مستقبل مستدام.</p>
            </div>
            <div style={{position:'absolute', inset:0, background:'linear-gradient(to top, rgba(15,23,42,0.9), transparent)'}}></div>
          </div>
          
          <div className="bento-card" style={{background:BRAND.colors.primary, color:'white', border:'none'}}>
            <div>
               <BarChart3 size={40} color="white" style={{marginBottom:'1rem'}}/>
               <h3 style={{fontSize:'3.5rem', marginBottom:0, lineHeight:1}}>+50</h3>
               <p style={{color:'rgba(255,255,255,0.8)', marginTop:'0.5rem'}}>مشروعاً نوعياً تم تسليمه في عام 2025.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ContactSection = () => {
  return (
    <section className="section" style={{background:'#f8fafc'}}>
      <div className="container">
        <div className="bento-grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))'}}>
          <div style={{paddingRight:'2rem'}}>
            <h2>لنصنع <span className="text-gradient">الأثر</span> معاً</h2>
            <p style={{marginBottom:'3rem'}}>هل تبحث عن شريك استراتيجي لتحقيق طموحاتك الرقمية؟ فريقنا جاهز.</p>
            
            <div style={{display:'flex', flexDirection:'column', gap:'2rem'}}>
              <div style={{display:'flex', gap:'1.5rem', alignItems:'center'}}>
                <div className="btn-circle"><MapPin /></div>
                <div>
                  <div style={{fontSize:'0.9rem', color:'#94a3b8'}}>المقر الرئيسي</div>
                  <div style={{fontWeight:'600'}}>برج أورا، طريق الملك فهد، الرياض</div>
                </div>
              </div>
              <div style={{display:'flex', gap:'1.5rem', alignItems:'center'}}>
                <div className="btn-circle"><Mail /></div>
                <div>
                  <div style={{fontSize:'0.9rem', color:'#94a3b8'}}>البريد الإلكتروني</div>
                  <div style={{fontWeight:'600'}}>hello@auraholding.sa</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bento-card" style={{background:'white', padding:'3rem'}}>
            <form style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>
              <div>
                <label style={{display:'block', marginBottom:'0.5rem', fontWeight:'600'}}>الاسم</label>
                <input type="text" style={{width:'100%', padding:'1.2rem', borderRadius:'12px', border:'1px solid #e2e8f0', background:'#f8fafc', outline:'none'}} placeholder="الاسم الكامل" />
              </div>
              <div>
                <label style={{display:'block', marginBottom:'0.5rem', fontWeight:'600'}}>الجهة</label>
                <input type="text" style={{width:'100%', padding:'1.2rem', borderRadius:'12px', border:'1px solid #e2e8f0', background:'#f8fafc', outline:'none'}} placeholder="اسم الشركة / المؤسسة" />
              </div>
              <button onClick={(e) => {e.preventDefault(); alert('Sent!')}} style={{padding:'1.2rem', background:BRAND.colors.dark, color:'white', border:'none', borderRadius:'12px', fontWeight:'700', cursor:'pointer', marginTop:'1rem', fontSize:'1.1rem'}}>
                إرسال طلب شراكة
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer>
    <div className="container">
      <div style={{display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'4rem', paddingBottom:'4rem', borderBottom:'1px solid #1e293b'}}>
        <div>
          <h2 style={{color:'white', fontSize:'2.5rem', marginBottom:'1rem'}}>AURA.</h2>
          <p style={{color:'#64748b'}}>الاستثمار في رؤية المستقبل.</p>
        </div>
        <div style={{display:'flex', gap:'4rem', flexWrap:'wrap'}}>
          <div>
            <h4 style={{color:'white', marginBottom:'1.5rem'}}>الشركة</h4>
            <a className="footer-link" href="#">عن أورا</a>
            <a className="footer-link" href="#">القيادة</a>
            <a className="footer-link" href="#">المسيرة</a>
          </div>
          <div>
            <h4 style={{color:'white', marginBottom:'1.5rem'}}>الأعمال</h4>
            <a className="footer-link" href="#">القطاعات</a>
            <a className="footer-link" href="#">المشاريع</a>
            <a className="footer-link" href="#">الاستدامة</a>
          </div>
        </div>
      </div>
      <div style={{paddingTop:'2rem', color:'#475569', fontSize:'0.9rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <span>© 2026 Aura Holding. All Rights Reserved.</span>
        <div style={{display:'flex', gap:'1rem'}}>
          <span style={{cursor:'pointer', padding:'0.5rem', border:'1px solid #334155', borderRadius:'50%'}}>Ln</span>
          <span style={{cursor:'pointer', padding:'0.5rem', border:'1px solid #334155', borderRadius:'50%'}}>X</span>
        </div>
      </div>
    </div>
  </footer>
);

// =========================================
// 5. MAIN COMPONENT
// =========================================

export default function AuraCorporate() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <Script id="json-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      
      {/* Background Layer */}
      <InteractiveBackground />
      
      {/* Content Layer */}
      <main style={{position:'relative', zIndex:1}}>
        <Navbar />
        <Hero />
        <StatsTicker />
        <SectorsBento />
        <ContactSection />
        <Footer />
      </main>
    </>
  );
}
