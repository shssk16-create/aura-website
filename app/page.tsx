'use client';

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * AURA HOLDING - CORPORATE EDITION (Inspired by Hamah.sa)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * * * DESIGN PHILOSOPHY:
 * - Minimalist Corporate
 * - Bento Grid Layouts
 * - High-End Typography (Alexandria Font)
 * - Subtle, silky animations
 * * * COLORS:
 * - Aura Blue: #438FB3
 * - Aura Cyan: #58A8B4
 * - Platinum:  #B3B7C1
 * - Slate:     #0F172A
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowUpRight, Globe, Layers, Zap, Users, BarChart3, 
  Building2, ChevronDown, Mail, Phone, MapPin, Menu, X, ArrowRight
} from 'lucide-react';
import Script from 'next/script';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// =========================================
// 1. DATA LAYER
// =========================================

const CONTENT = {
  hero: {
    title: "نبني المستقبل الرقمي",
    subtitle: "أورا القابضة: استثمار ذكي في التكنولوجيا، التصميم، والابتكار."
  },
  stats: [
    { num: "500M+", label: "قيمة الأصول الرقمية" },
    { num: "120+", label: "شريك استراتيجي" },
    { num: "15", label: "عاماً من التميز" },
  ],
  services: [
    { id: 1, title: "التحول الرقمي", desc: "حلول تقنية للمؤسسات الكبرى.", col: 2 },
    { id: 2, title: "الاستثمار الجريء", desc: "دعم الشركات التقنية الناشئة.", col: 1 },
    { id: 3, title: "التطوير العقاري الرقمي", desc: "منصات المدن الذكية.", col: 1 },
    { id: 4, title: "الإعلام الجديد", desc: "صناعة محتوى يؤثر في الملايين.", col: 2 },
  ]
};

const BRAND_COLORS = {
  primary: '#438FB3',
  secondary: '#58A8B4',
  grey: '#B3B7C1',
  dark: '#0f172a',
  bg: '#ffffff' // Pure corporate white
};

// =========================================
// 2. CSS ARCHITECTURE (HAMAH STYLE)
// =========================================

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Alexandria:wght@200;300;400;500;600;700;800&display=swap');
  
  :root {
    --primary: ${BRAND_COLORS.primary};
    --secondary: ${BRAND_COLORS.secondary};
    --dark: ${BRAND_COLORS.dark};
    --grey: ${BRAND_COLORS.grey};
  }

  html, body {
    background-color: #ffffff;
    color: var(--dark);
    font-family: 'Alexandria', sans-serif;
    margin: 0; padding: 0;
    overflow-x: hidden;
    direction: rtl;
  }

  /* --- TYPOGRAPHY --- */
  h1 { font-size: clamp(3.5rem, 8vw, 7rem); font-weight: 800; line-height: 1.1; letter-spacing: -2px; margin: 0; }
  h2 { font-size: clamp(2rem, 5vw, 4rem); font-weight: 700; line-height: 1.2; margin-bottom: 2rem; }
  h3 { font-size: 1.5rem; font-weight: 600; margin-bottom: 0.5rem; }
  p { color: #64748b; font-size: 1.1rem; line-height: 1.8; max-width: 60ch; }
  
  .text-gradient {
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    -webkit-background-clip: text; color: transparent;
  }

  /* --- LAYOUTS --- */
  .container { max-width: 1400px; margin: 0 auto; padding: 0 2rem; position: relative; z-index: 2; }
  .section { padding: 8rem 0; position: relative; }
  .full-height { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; }

  /* --- COMPONENTS --- */
  
  /* Navbar */
  .navbar {
    position: fixed; top: 0; left: 0; width: 100%; z-index: 100;
    padding: 1.5rem 0; transition: 0.4s ease;
    border-bottom: 1px solid transparent;
  }
  .navbar.scrolled {
    background: rgba(255,255,255,0.9); backdrop-filter: blur(20px);
    padding: 1rem 0; border-bottom: 1px solid #f1f5f9;
  }
  .nav-link { font-weight: 500; color: var(--dark); cursor: pointer; transition: 0.3s; }
  .nav-link:hover { color: var(--primary); }

  /* Bento Grid */
  .bento-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;
    grid-auto-rows: minmax(300px, auto);
  }
  .bento-item {
    background: #f8fafc; border-radius: 2rem; padding: 3rem;
    position: relative; overflow: hidden; transition: 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
    display: flex; flex-direction: column; justify-content: space-between;
    border: 1px solid transparent;
  }
  .bento-item:hover {
    transform: translateY(-5px); background: white;
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
  .ticker-wrap { overflow: hidden; white-space: nowrap; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; padding: 2rem 0; }
  .ticker { display: inline-block; animation: marquee 30s linear infinite; }
  .ticker-item { display: inline-block; font-size: 4rem; font-weight: 800; color: #f1f5f9; margin: 0 4rem; -webkit-text-stroke: 1px #cbd5e1; }
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
  }
`;

// =========================================
// 3. BACKGROUND ANIMATION (SUBTLE WAVES)
// =========================================

const SubtleBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!mountRef.current) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 1000);
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    mountRef.current.appendChild(renderer.domElement);

    // Geometry
    const geometry = new THREE.PlaneGeometry(10, 10, 32, 32);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(BRAND_COLORS.primary) }
      },
      vertexShader: `
        uniform float uTime;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 pos = position;
          pos.z += sin(pos.x * 2.0 + uTime) * 0.2;
          pos.z += cos(pos.y * 2.0 + uTime) * 0.2;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying vec2 vUv;
        void main() {
          float alpha = 0.05 + 0.05 * sin(vUv.x * 10.0);
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      wireframe: true // Mesh look like Hamah/Corporate tech
    });

    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 3;
    scene.add(plane);

    const animate = () => {
      requestAnimationFrame(animate);
      material.uniforms.uTime.value += 0.005;
      renderer.render(scene, camera);
    };
    animate();

    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', resize);
    return () => { window.removeEventListener('resize', resize); renderer.dispose(); };
  }, []);

  return <div ref={mountRef} style={{position:'fixed', top:0, left:0, zIndex:0, opacity:0.6}} />;
};

// =========================================
// 4. COMPONENTS
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
        <div style={{fontSize:'1.5rem', fontWeight:'800', letterSpacing:'-1px'}}>
          AURA <span style={{color:BRAND_COLORS.primary}}>.</span>
        </div>
        
        <div style={{display:'flex', gap:'2rem'}} className="hidden md:flex">
          {['الرئيسية', 'القطاعات', 'الاستدامة', 'المركز الإعلامي', 'تواصل معنا'].map(item => (
            <a key={item} className="nav-link">{item}</a>
          ))}
        </div>

        <div style={{display:'flex', gap:'1rem'}}>
          <button className="btn-circle hidden md:flex"><Globe size={20}/></button>
          <button className="btn-circle"><Menu size={20}/></button>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="full-height" style={{paddingTop:'100px'}}>
      <div className="container">
        <motion.div 
          initial={{opacity:0, y:50}} 
          animate={{opacity:1, y:0}} 
          transition={{duration:1, ease:[0.2, 0.65, 0.3, 0.9]}}
        >
          <h1 style={{maxWidth:'900px'}}>
            نبني <span className="text-gradient">الواقع الرقمي</span> <br/>
            للمستقبل.
          </h1>
          <div style={{marginTop:'3rem', display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:'2rem'}}>
            <p style={{fontSize:'1.5rem', maxWidth:'500px', color:BRAND_COLORS.dark}}>
              شركة أورا القابضة: ريادة في الاستثمار التقني، تطوير المنصات، وصناعة العلامات التجارية.
            </p>
            <div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
              <span style={{fontWeight:'600'}}>اكتشف رؤيتنا</span>
              <button className="btn-circle" style={{background:BRAND_COLORS.primary, color:'white', border:'none'}}>
                <ArrowRight />
              </button>
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
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'end', marginBottom:'4rem'}}>
          <h2>قطاعات <span className="text-gradient">أعمالنا</span></h2>
          <div className="btn-text">جميع القطاعات <ArrowUpRight size={18} /></div>
        </div>

        <div className="bento-grid">
          {CONTENT.services.map((item) => (
            <motion.div 
              key={item.id}
              className={`bento-item ${item.col === 2 ? 'col-span-2' : ''}`}
              initial={{opacity:0, y:20}}
              whileInView={{opacity:1, y:0}}
              viewport={{once:true}}
            >
              <div style={{marginBottom:'auto'}}>
                <div style={{width:50, height:50, background:'white', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1.5rem', boxShadow:'0 4px 10px rgba(0,0,0,0.05)'}}>
                  <Layers color={BRAND_COLORS.primary} />
                </div>
                <h3>{item.title}</h3>
                <p style={{fontSize:'1rem'}}>{item.desc}</p>
              </div>
              <div style={{display:'flex', justifyContent:'flex-end', marginTop:'2rem'}}>
                <div className="btn-circle" style={{width:40, height:40}}><ArrowUpRight size={16} /></div>
              </div>
            </motion.div>
          ))}
          
          {/* Feature Image Block */}
          <div className="bento-item col-span-2" style={{padding:0, minHeight:'400px', background:BRAND_COLORS.dark}}>
            <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000" alt="Building" style={{width:'100%', height:'100%', objectFit:'cover', opacity:0.6}} />
            <div style={{position:'absolute', bottom:0, left:0, padding:'3rem', color:'white'}}>
              <h3>شراكات استراتيجية</h3>
              <p style={{color:'#94a3b8'}}>نتعاون مع كبرى الكيانات الحكومية والخاصة.</p>
            </div>
          </div>
          
          <div className="bento-item" style={{background:BRAND_COLORS.primary, color:'white'}}>
            <h3 style={{fontSize:'3rem', marginBottom:0}}>+50</h3>
            <p style={{color:'rgba(255,255,255,0.8)'}}>مشروعاً نوعياً تم تسليمه في عام 2025.</p>
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
        <div className="bento-grid" style={{gridTemplateColumns: '1fr 1fr'}}>
          <div className="col-span-1" style={{paddingRight:'4rem'}}>
            <h2>لنصنع <span className="text-gradient">الأثر</span> معاً</h2>
            <p>هل تبحث عن شريك استراتيجي لتحقيق طموحاتك الرقمية؟</p>
            
            <div style={{marginTop:'3rem', display:'flex', flexDirection:'column', gap:'2rem'}}>
              <div style={{display:'flex', gap:'1.5rem', alignItems:'center'}}>
                <div className="btn-circle"><MapPin /></div>
                <div>
                  <div style={{fontSize:'0.9rem', color:BRAND_COLORS.grey}}>المقر الرئيسي</div>
                  <div style={{fontWeight:'600'}}>برج أورا، طريق الملك فهد، الرياض</div>
                </div>
              </div>
              <div style={{display:'flex', gap:'1.5rem', alignItems:'center'}}>
                <div className="btn-circle"><Mail /></div>
                <div>
                  <div style={{fontSize:'0.9rem', color:BRAND_COLORS.grey}}>البريد الإلكتروني</div>
                  <div style={{fontWeight:'600'}}>hello@auraholding.sa</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bento-item" style={{background:'white'}}>
            <form style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>
              <div>
                <label style={{display:'block', marginBottom:'0.5rem', fontWeight:'600'}}>الاسم</label>
                <input type="text" style={{width:'100%', padding:'1rem', borderRadius:'8px', border:'1px solid #e2e8f0', background:'#f8fafc'}} placeholder="الاسم الكامل" />
              </div>
              <div>
                <label style={{display:'block', marginBottom:'0.5rem', fontWeight:'600'}}>الجهة</label>
                <input type="text" style={{width:'100%', padding:'1rem', borderRadius:'8px', border:'1px solid #e2e8f0', background:'#f8fafc'}} placeholder="اسم الشركة / المؤسسة" />
              </div>
              <button style={{padding:'1rem', background:BRAND_COLORS.dark, color:'white', border:'none', borderRadius:'8px', fontWeight:'700', cursor:'pointer', marginTop:'1rem'}}>
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
          <h2 style={{color:'white', fontSize:'2rem'}}>AURA.</h2>
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
      <div style={{paddingTop:'2rem', color:'#475569', fontSize:'0.9rem', display:'flex', justifyContent:'space-between'}}>
        <span>© 2026 Aura Holding. All Rights Reserved.</span>
        <div style={{display:'flex', gap:'1rem'}}>
          <span>Linkedin</span>
          <span>Twitter</span>
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
      <Script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js" strategy="beforeInteractive" />
      
      {/* Background Layer */}
      <SubtleBackground />
      
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
