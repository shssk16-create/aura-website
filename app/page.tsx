'use client';

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * AURA DIGITAL AGENCY - ULTIMATE ENTERPRISE EDITION (v5.0)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * * CORE COLORS:
 * - Primary:   #438FB3 (Ocean Blue)
 * - Secondary: #58A8B4 (Teal Cyan)
 * - Neutral:   #B3B7C1 (Platinum Silver)
 * - Background: #FFFFFF (Pure White)
 * * * FEATURES:
 * - GPU-Accelerated Shader Morphing (Three.js)
 * - GSAP ScrollTrigger Integration
 * - Advanced Typography System (No Overlaps)
 * - Semantic HTML5 & JSON-LD
 */

import React, { useState, useEffect, useRef, useLayoutEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowUpRight, Palette, Search, ShoppingBag, Menu, X,
  Megaphone, CheckCircle, Shield, Star, Code, Smartphone,
  Phone, Mail, MapPin, Zap, Send, Layout, BarChart, Users,
  Layers, Globe, MousePointer, Lightbulb, TrendingUp, Monitor
} from 'lucide-react';
import Script from 'next/script';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP Plugins Safe Check
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// =========================================
// 1. CONFIGURATION & DATA
// =========================================

const BRAND = {
  colors: {
    primary: '#438FB3',
    secondary: '#58A8B4',
    grey: '#B3B7C1',
    dark: '#0f172a',
    light: '#f8fafc'
  },
  info: {
    email: "hello@aurateam3.com",
    phone: "+966 50 000 0000",
    address: "المملكة العربية السعودية، الرياض، العليا"
  }
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "AURA Digital Agency",
  "url": "https://aurateam3.com",
  "logo": "https://aurateam3.com/logo.png",
  "description": "أورا: الوكالة الرقمية الرائدة في السعودية. نقدم حلولاً متكاملة في التصميم، البرمجة، والتسويق الرقمي.",
  "priceRange": "$$$"
};

// =========================================
// 2. CSS ARCHITECTURE (Zero-Overlap System)
// =========================================

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Readex+Pro:wght@200;300;400;500;600;700;800&display=swap');
  
  /* --- RESET & BASICS --- */
  html, body {
    background-color: #ffffff !important;
    color: #0f172a !important;
    font-family: 'Readex Pro', sans-serif;
    margin: 0; padding: 0;
    overflow-x: hidden;
    direction: rtl;
    -webkit-font-smoothing: antialiased;
  }

  ::selection {
    background: ${BRAND.colors.primary};
    color: white;
  }

  /* --- TYPOGRAPHY ENGINE (NO OVERLAP) --- */
  h1, h2, h3, h4, h5 {
    color: ${BRAND.colors.dark};
    font-weight: 800;
    margin-top: 0;
    margin-bottom: 1.5rem; /* مسافة أمان سفلية */
  }
  
  h1 { 
    font-size: clamp(3rem, 6vw, 6rem); 
    line-height: 1.15; /* ارتفاع سطر ضيق للعناوين الكبيرة */
    letter-spacing: -0.03em;
  }
  
  h2 { 
    font-size: clamp(2.2rem, 5vw, 4rem); 
    line-height: 1.25; 
    letter-spacing: -0.02em;
  }
  
  h3 { 
    font-size: 1.75rem; 
    line-height: 1.4; 
  }
  
  p { 
    color: #475569; 
    font-size: 1.125rem; 
    line-height: 1.8; /* ارتفاع سطر مريح للقراءة */
    margin-bottom: 1.5rem; 
    max-width: 65ch; /* عرض مثالي للقراءة */
  }
  
  .text-gradient {
    background: linear-gradient(135deg, ${BRAND.colors.primary} 0%, ${BRAND.colors.secondary} 100%);
    -webkit-background-clip: text; color: transparent; display: inline-block;
  }
  
  .text-silver { color: ${BRAND.colors.grey}; }

  /* --- LAYOUT GRID SYSTEM --- */
  .container { 
    width: 100%; 
    max-width: 1300px; 
    margin: 0 auto; 
    padding: 0 clamp(1.5rem, 5vw, 3rem); 
    position: relative; 
    z-index: 10; 
  }
  
  .section { 
    padding: clamp(6rem, 10vw, 10rem) 0; /* تباعد رأسي كبير بين الأقسام */
    position: relative; 
  }
  
  .grid-2 { 
    display: grid; 
    grid-template-columns: 1fr 1fr; 
    gap: clamp(3rem, 6vw, 6rem); /* تباعد ذكي */
    align-items: center; 
  }
  
  .grid-3 { 
    display: grid; 
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); 
    gap: 2.5rem; 
  }
  
  .flex-center { display: flex; align-items: center; justify-content: center; }
  .flex-between { display: flex; align-items: center; justify-content: space-between; }
  .flex-col { display: flex; flex-direction: column; }

  /* --- COMPONENTS: CANVAS --- */
  #aura-canvas {
    position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
    z-index: 0; pointer-events: none; opacity: 1;
  }

  /* --- COMPONENTS: NAVBAR --- */
  .navbar {
    position: fixed; top: 25px; left: 50%; transform: translateX(-50%);
    width: 90%; max-width: 950px; z-index: 1000;
    padding: 0.8rem 1.8rem; border-radius: 100px;
    background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(20px);
    border: 1px solid rgba(179, 183, 193, 0.3);
    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05);
    display: flex; justify-content: space-between; align-items: center;
    transition: all 0.4s ease;
  }
  .navbar.scrolled {
    top: 15px; background: rgba(255, 255, 255, 0.98);
    box-shadow: 0 20px 40px -10px rgba(67, 143, 179, 0.1);
    border-color: ${BRAND.colors.primary};
  }
  .nav-logo { font-size: 1.6rem; font-weight: 900; color: ${BRAND.colors.primary}; letter-spacing: -1px; display: flex; align-items: center; gap: 8px; }
  .nav-dot { width: 10px; height: 10px; background: ${BRAND.colors.secondary}; border-radius: 50%; }
  
  .nav-link { 
    text-decoration: none; color: ${BRAND.colors.dark}; font-weight: 600; font-size: 0.95rem;
    transition: 0.3s; padding: 0.5rem 1rem; cursor: pointer;
  }
  .nav-link:hover { color: ${BRAND.colors.primary}; }

  /* --- COMPONENTS: BUTTONS --- */
  .btn {
    padding: 1rem 2.5rem; border-radius: 50px; border: none; cursor: pointer;
    font-weight: 700; font-size: 1.05rem; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: inline-flex; align-items: center; gap: 0.5rem; justify-content: center;
  }
  .btn-primary {
    background: ${BRAND.colors.primary}; color: white;
    box-shadow: 0 10px 25px -5px rgba(67, 143, 179, 0.4);
  }
  .btn-primary:hover {
    background: ${BRAND.colors.secondary}; transform: translateY(-4px);
    box-shadow: 0 20px 40px -10px rgba(88, 168, 180, 0.5);
  }
  .btn-outline {
    background: transparent; color: ${BRAND.colors.dark};
    border: 2px solid #e2e8f0;
  }
  .btn-outline:hover {
    border-color: ${BRAND.colors.primary}; color: ${BRAND.colors.primary};
  }

  /* --- COMPONENTS: GLASS CARDS --- */
  .glass-card {
    background: #ffffff; border: 1px solid rgba(179, 183, 193, 0.2);
    border-radius: 2rem; padding: 3rem;
    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.03);
    transition: 0.4s; height: 100%; display: flex; flex-direction: column;
  }
  .glass-card:hover {
    transform: translateY(-8px); border-color: ${BRAND.colors.secondary};
    box-shadow: 0 25px 60px -15px rgba(88, 168, 180, 0.15);
  }
  .icon-box {
    width: 70px; height: 70px; border-radius: 1.5rem;
    background: linear-gradient(135deg, rgba(67, 143, 179, 0.1), rgba(88, 168, 180, 0.1));
    color: ${BRAND.colors.primary}; display: flex; align-items: center; justify-content: center;
    margin-bottom: 2rem; transition: 0.3s;
  }
  .glass-card:hover .icon-box {
    background: ${BRAND.colors.primary}; color: white; transform: rotate(-10deg) scale(1.1);
  }

  /* --- INTRO OVERLAY --- */
  .intro-overlay {
    position: fixed; inset: 0; z-index: 9999; background: #0f172a; color: white;
    display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;
  }
  .intro-warning {
    font-size: 1.1rem; color: ${BRAND.colors.secondary}; margin-bottom: 2rem;
    padding: 1rem 2rem; border: 1px solid rgba(255,255,255,0.1); border-radius: 50px;
    background: rgba(0,0,0,0.3); opacity: 0; transform: translateY(20px);
  }
  .intro-counter { font-size: 8rem; font-weight: 900; line-height: 1; color: white; font-variant-numeric: tabular-nums; }
  
  /* --- MARQUEE --- */
  .marquee-container { overflow: hidden; white-space: nowrap; padding: 2rem 0; background: ${BRAND.colors.light}; border-y: 1px solid rgba(0,0,0,0.05); }
  .marquee-content { display: inline-flex; animation: scroll 30s linear infinite; }
  .marquee-item { margin: 0 3rem; font-size: 1.5rem; font-weight: 700; color: ${BRAND.colors.grey}; opacity: 0.7; }
  @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

  /* --- PRICING --- */
  .pricing-card { position: relative; overflow: hidden; }
  .pricing-header { text-align: center; margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1px solid #f1f5f9; }
  .price-tag { font-size: 3rem; font-weight: 800; color: ${BRAND.colors.dark}; }
  .popular-badge { position: absolute; top: 1.5rem; right: -2rem; background: ${BRAND.colors.secondary}; color: white; padding: 0.5rem 3rem; transform: rotate(45deg); font-size: 0.8rem; font-weight: 700; }

  /* --- FORM --- */
  .form-input {
    width: 100%; padding: 1.2rem; border-radius: 1rem; border: 1px solid #e2e8f0;
    font-family: inherit; font-size: 1rem; transition: 0.3s; background: #f8fafc;
    margin-bottom: 1.5rem;
  }
  .form-input:focus { outline: none; border-color: ${BRAND.colors.primary}; background: white; }

  /* --- FOOTER --- */
  footer { background: #0f172a; color: white; padding: 8rem 0 3rem; margin-top: 8rem; }
  .footer-link { color: #94a3b8; text-decoration: none; display: block; margin-bottom: 1rem; transition: 0.3s; }
  .footer-link:hover { color: ${BRAND.colors.secondary}; padding-right: 5px; }

  /* --- GSAP CLASSES --- */
  .gsap-reveal { opacity: 0; transform: translateY(30px); }

  /* --- RESPONSIVE --- */
  @media (max-width: 1024px) {
    .grid-2 { grid-template-columns: 1fr; gap: 3rem; }
    .navbar { width: 90%; }
    .nav-links, .btn-navbar { display: none; }
    .mobile-only { display: block !important; }
    h1 { font-size: 3rem; }
  }
  .mobile-only { display: none; }
`;

// =========================================
// 3. SHADER & PARTICLES LOGIC
// =========================================

// Creating the text data safely
const getParticlesData = (text: string, width: number, height: number) => {
  if (typeof document === 'undefined') return [];
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return [];
  
  canvas.width = width; canvas.height = height;
  ctx.fillStyle = '#000'; ctx.fillRect(0,0,width,height);
  ctx.fillStyle = '#fff'; ctx.font = '900 180px Arial';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, width/2, height/2);
  
  const data = ctx.getImageData(0,0,width,height).data;
  const particles = [];
  
  for (let y = 0; y < height; y += 4) {
    for (let x = 0; x < width; x += 4) {
      if (data[(y*width+x)*4] > 128) {
        particles.push({
          x: (x - width/2) * 0.06,
          y: -(y - height/2) * 0.06
        });
      }
    }
  }
  return particles;
};

// =========================================
// 4. COMPONENTS
// =========================================

// --- A. INTRO ---
const Intro = ({ onComplete }: { onComplete: () => void }) => {
  const container = useRef(null);
  const warning = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Reveal warning then counter
    const tl = gsap.timeline();
    
    tl.to(warning.current, { opacity: 1, y: 0, duration: 1, delay: 0.5 })
      .to(warning.current, { opacity: 0, y: -20, duration: 0.5, delay: 2 })
      .call(() => {
        // Start counting
        const interval = setInterval(() => {
          setCount(prev => {
            if (prev >= 100) {
              clearInterval(interval);
              // Explosion exit
              gsap.to(container.current, {
                clipPath: "circle(0% at 50% 50%)", duration: 1.5, ease: "expo.inOut", onComplete: onComplete
              });
              return 100;
            }
            return prev + 2;
          });
        }, 20);
      });
  }, []);

  return (
    <div ref={container} className="intro-overlay" style={{clipPath: "circle(150% at 50% 50%)"}}>
      <div ref={warning} className="intro-warning">
        ⚠️ تنبيه: هالة "أورا" ساطعة جداً. يرجى خفض إضاءة الشاشة.
      </div>
      {count > 0 && (
        <div style={{position:'relative'}}>
          <div className="intro-counter">{count}%</div>
          <div style={{width:'200px', height:'4px', background:'rgba(255,255,255,0.1)', marginTop:'1rem', borderRadius:'2px'}}>
            <div style={{width: `${count}%`, height:'100%', background: BRAND.colors.primary}}></div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- B. AURA SCENE (GPU MORPHING) ---
const AuraScene = ({ startAnimation }: { startAnimation: boolean }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. Setup
    const w = window.innerWidth;
    const h = window.innerHeight;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xffffff, 0.005);
    
    const camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 1000);
    camera.position.z = 40;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // 2. Geometry & Shader
    const textPoints = getParticlesData("AURA", 1000, 500);
    const count = textPoints.length + 2000;
    
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const targetPositions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const randoms = new Float32Array(count);

    const c1 = new THREE.Color(BRAND.colors.primary);
    const c2 = new THREE.Color(BRAND.colors.secondary);

    for(let i=0; i<count; i++) {
      // Start (Chaos)
      positions[i*3] = (Math.random()-0.5) * 200;
      positions[i*3+1] = (Math.random()-0.5) * 200;
      positions[i*3+2] = (Math.random()-0.5) * 100;

      // End (Text)
      if (i < textPoints.length) {
        targetPositions[i*3] = textPoints[i].x;
        targetPositions[i*3+1] = textPoints[i].y;
        targetPositions[i*3+2] = 0;
      } else {
        // Stars background
        targetPositions[i*3] = positions[i*3];
        targetPositions[i*3+1] = positions[i*3+1];
        targetPositions[i*3+2] = positions[i*3+2];
      }

      const mixed = Math.random() > 0.5 ? c1 : c2;
      colors[i*3] = mixed.r; colors[i*3+1] = mixed.g; colors[i*3+2] = mixed.b;
      randoms[i] = Math.random();
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('target', new THREE.BufferAttribute(targetPositions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

    // Custom Shader Material for Morphing
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uProgress;
        attribute vec3 target;
        attribute vec3 color;
        attribute float aRandom;
        varying vec3 vColor;
        
        void main() {
          vColor = color;
          
          // Cubic easeInOut
          float t = uProgress < 0.5 ? 4.0 * uProgress * uProgress * uProgress : 1.0 - pow(-2.0 * uProgress + 2.0, 3.0) / 2.0;
          
          vec3 pos = mix(position, target, t);
          
          // Noise movement
          float noise = sin(pos.x * 0.1 + uTime) * cos(pos.y * 0.1 + uTime) * aRandom;
          pos.z += noise * 2.0 * (1.0 - t * 0.8); // Less noise when formed
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = (6.0 * (1.0 + t)) * (10.0 / -mvPosition.z);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          vec2 center = gl_PointCoord - 0.5;
          if(length(center) > 0.5) discard;
          gl_FragColor = vec4(vColor, 0.8);
        }
      `,
      transparent: true
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 3. Animation
    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      material.uniforms.uTime.value = clock.getElapsedTime();
      
      if (material.uniforms.uProgress.value > 0.8) {
        particles.rotation.y = Math.sin(clock.getElapsedTime() * 0.1) * 0.05;
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // 4. GSAP Trigger
    if (startAnimation) {
      gsap.to(material.uniforms.uProgress, {
        value: 1,
        duration: 3,
        ease: "power2.inOut",
        delay: 0.5
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
  }, [startAnimation]);

  return <div id="aura-canvas" ref={mountRef}></div>;
};

// --- C. NAVBAR ---
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-logo">
        <div className="nav-dot"></div>
        AURA
      </div>
      <div className="nav-links mobile-hidden" style={{display:'flex', gap:'1rem'}}>
        {['الرئيسية', 'منهجيتنا', 'الخدمات', 'أعمالنا', 'الأسعار'].map(item => (
          <a key={item} href={`#${item}`} className="nav-link">{item}</a>
        ))}
      </div>
      <div style={{display:'flex', gap:'1rem'}}>
        <button className="btn btn-primary mobile-hidden">ابدأ مشروعك</button>
        <button className="mobile-only" style={{background:'none', border:'none'}}><Menu color={BRAND.colors.primary} /></button>
      </div>
    </nav>
  );
};

// --- D. SCROLL REVEAL ANIMATION HOOK ---
const useReveal = () => {
  const ref = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current, 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ref.current, start: "top 85%" } }
      );
    }, ref);
    return () => ctx.revert();
  }, []);
  return ref;
};

// =========================================
// 5. MAIN SECTIONS
// =========================================

const Hero = () => {
  return (
    <section className="section" id="الرئيسية" style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <div className="container" style={{textAlign:'center'}}>
        <motion.div initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} transition={{duration:1, delay:3}}>
          <div style={{display:'inline-flex', alignItems:'center', gap:'8px', padding:'0.6rem 1.8rem', borderRadius:'50px', background:'#f1f5f9', color:BRAND.colors.primary, fontWeight:'700', marginBottom:'2rem', border:`1px solid ${BRAND.colors.grey}30`}}>
            <Zap size={18} fill="currentColor" /> الإصدار الخامس 2026
          </div>
          
          <h1>
            نحول الرؤية إلى <span className="text-gradient">واقع رقمي</span><br/>
            يفوق التوقعات
          </h1>
          
          <p style={{margin:'0 auto 3rem'}}>
            في "أورا"، ندمج الفن بالتكنولوجيا لنبني لك منظومة رقمية متكاملة. 
            شريكك الاستراتيجي في بناء العلامات التجارية وتطوير المنصات الرقمية.
          </p>

          <div className="flex-center" style={{gap:'1.5rem', flexWrap:'wrap'}}>
            <button className="btn btn-primary">ابدأ رحلتك معنا <ArrowUpRight size={20} /></button>
            <button className="btn btn-outline">استكشف أعمالنا <Globe size={20} /></button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const ClientMarquee = () => (
  <div className="marquee-container">
    <div className="marquee-content">
      {[...Array(10)].map((_, i) => (
        <span key={i} className="marquee-item">CLIENT PARTNER {i+1}</span>
      ))}
    </div>
  </div>
);

const About = () => {
  const ref = useReveal();
  return (
    <section className="section" id="عن_أورا" ref={ref}>
      <div className="container grid-2">
        <div>
          <div style={{color: BRAND.colors.primary, fontWeight:'700', marginBottom:'1rem'}}>عن أورا</div>
          <h2>فريق شغوف <span className="text-gradient">بالتميز</span></h2>
          <p>
            نحن لسنا مجرد وكالة، نحن امتداد لفريقك. نؤمن بأن النجاح الرقمي يتطلب شراكة حقيقية، فهماً عميقاً للأهداف، وتنفيذاً لا يقبل المساومة على الجودة.
          </p>
          <div style={{display:'flex', gap:'3rem', marginTop:'2rem'}}>
            <div>
              <span style={{fontSize:'3rem', fontWeight:'900', color: BRAND.colors.primary}}>+50</span>
              <div style={{color:'#64748b', fontWeight:'600'}}>مشروع ناجح</div>
            </div>
            <div>
              <span style={{fontSize:'3rem', fontWeight:'900', color: BRAND.colors.secondary}}>98%</span>
              <div style={{color:'#64748b', fontWeight:'600'}}>رضا العملاء</div>
            </div>
          </div>
        </div>
        <div className="glass-card" style={{padding:'0', overflow:'hidden', minHeight:'400px', display:'flex', alignItems:'center', justifyContent:'center', background:'#f8fafc'}}>
          <Users size={100} color={BRAND.colors.grey} style={{opacity:0.3}} />
        </div>
      </div>
    </section>
  );
};

const Services = () => (
  <section className="section" id="الخدمات" style={{background: BRAND.colors.light}}>
    <div className="container">
      <div style={{textAlign:'center', marginBottom:'6rem'}}>
        <h2>خدمات مصممة <span className="text-gradient">للنمو</span></h2>
        <p style={{margin:'0 auto'}}>حلول تقنية وإبداعية شاملة تغطي كل زاوية من احتياجاتك.</p>
      </div>

      <div className="grid-3">
        {[
          {t:'تطوير الويب', d:'مواقع فائقة السرعة بتقنية Next.js.', i: Code},
          {t:'الهوية البصرية', d:'تصاميم تعكس جوهر علامتك.', i: Palette},
          {t:'تطبيقات الجوال', d:'تجربة مستخدم سلسة (iOS/Android).', i: Smartphone},
          {t:'التسويق الرقمي', d:'استراتيجيات نمو تعتمد على البيانات.', i: Megaphone},
          {t:'المتاجر الإلكترونية', d:'حلول بيع متكاملة وقابلة للتوسع.', i: ShoppingBag},
          {t:'تحسين محركات البحث', d:'تصدر النتائج الأولى في جوجل.', i: Search},
        ].map((s, idx) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const ref = useReveal();
          return (
            <div key={idx} className="glass-card" ref={ref}>
              <div className="icon-wrapper"><s.i size={32} /></div>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
              <div style={{marginTop:'auto', paddingTop:'1.5rem', color: BRAND.colors.primary, fontWeight:'bold', display:'flex', alignItems:'center', gap:'5px'}}>
                المزيد <ArrowUpRight size={18} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  </section>
);

const Methodology = () => (
  <section className="section" id="منهجيتنا">
    <div className="container grid-2">
      <div>
        <div style={{color: BRAND.colors.primary, fontWeight:'bold', marginBottom:'1rem'}}>كيف نعمل؟</div>
        <h2>منهجية أورا <span className="text-gradient">للنجاح</span></h2>
        <p>نحن لا نؤمن بالصدفة. كل مشروع يمر بمسار مدروس لضمان تحقيق الأهداف.</p>
        
        <div style={{marginTop:'3rem'}}>
          {[
            {t:'الاكتشاف والتحليل', d:'نفهم أهدافك ونحلل السوق بدقة.'},
            {t:'الاستراتيجية والتصميم', d:'نرسم خارطة الطريق ونصمم تجربة المستخدم.'},
            {t:'التطوير والبرمجة', d:'نكتب كوداً نظيفاً وقابلاً للتوسع.'},
            {t:'الاختبار والإطلاق', d:'نضمن الجودة قبل الظهور للعالم.'}
          ].map((s, i) => (
            <div key={i} className="process-step">
              <div className="process-marker"></div>
              <h3 style={{fontSize:'1.4rem', marginBottom:'0.5rem'}}>{s.t}</h3>
              <p style={{marginBottom:0}}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="glass-card" style={{display:'flex', alignItems:'center', justifyContent:'center', minHeight:'500px'}}>
        <Layout size={120} color={BRAND.colors.grey} style={{opacity:0.3, position:'absolute'}} />
      </div>
    </div>
  </section>
);

const Works = () => {
  const ref = useReveal();
  return (
    <section className="section" id="أعمالنا">
      <div className="container" ref={ref}>
        <div className="flex-between" style={{marginBottom:'4rem'}}>
          <div>
            <h2>قصص نجاح <span className="text-gradient">حقيقية</span></h2>
            <p>بعض مما أنجزناه لشركائنا الطموحين.</p>
          </div>
          <button className="btn btn-outline mobile-hidden">مشاهدة الكل</button>
        </div>
        
        <div className="grid-3">
          {[
            {t:'مشروع نيوم', c:'تطوير منصة', i:'https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=600'},
            {t:'تطبيق العلا', c:'تجربة مستخدم', i:'https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?q=80&w=600'},
            {t:'موسم الرياض', c:'هوية بصرية', i:'https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?q=80&w=600'},
          ].map((w, i) => (
            <div key={i} className="glass-card" style={{padding:0, overflow:'hidden', minHeight:'400px', display:'flex', alignItems:'flex-end'}}>
              <img src={w.i} alt={w.t} style={{position:'absolute', width:'100%', height:'100%', objectFit:'cover'}} />
              <div style={{position:'relative', background:'white', width:'100%', padding:'2rem'}}>
                <span style={{color:BRAND.colors.secondary, fontWeight:'bold', fontSize:'0.9rem'}}>{w.c}</span>
                <h3 style={{marginBottom:0}}>{w.t}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Pricing = () => (
  <section className="section" id="الأسعار" style={{background: BRAND.colors.light}}>
    <div className="container">
      <div style={{textAlign:'center', marginBottom:'5rem'}}>
        <h2>استثمار ذكي <span className="text-gradient">لمستقبلك</span></h2>
        <p style={{margin:'0 auto'}}>باقات مرنة تناسب حجم طموحاتك.</p>
      </div>

      <div className="grid-3">
        <div className="glass-card pricing-card">
          <div className="pricing-header">
            <h3>البداية</h3>
            <div className="price-tag">5,000 <span style={{fontSize:'1rem'}}>ر.س</span></div>
          </div>
          <ul className="feature-list">
            {['تصميم صفحة هبوط واحدة', 'متجاوب مع الجوال', 'نموذج اتصال أساسي', 'دعم فني لمدة شهر'].map((f,i) => (
              <li key={i} className="feature-item"><CheckCircle size={16} color={BRAND.colors.secondary} /> {f}</li>
            ))}
          </ul>
          <button className="btn btn-outline" style={{width:'100%', marginTop:'2rem'}}>اختر الباقة</button>
        </div>

        <div className="glass-card pricing-card" style={{border:`2px solid ${BRAND.colors.primary}`, transform:'scale(1.05)', zIndex:2}}>
          <div className="popular-badge">الأكثر طلباً</div>
          <div className="pricing-header">
            <h3>النمو</h3>
            <div className="price-tag">12,000 <span style={{fontSize:'1rem'}}>ر.س</span></div>
          </div>
          <ul className="feature-list">
            {['موقع متعدد الصفحات (5+)', 'نظام إدارة محتوى (CMS)', 'تحسين محركات البحث (Basic SEO)', 'ربط تحليلات جوجل', 'دعم فني 3 أشهر'].map((f,i) => (
              <li key={i} className="feature-item"><CheckCircle size={16} color={BRAND.colors.primary} /> {f}</li>
            ))}
          </ul>
          <button className="btn btn-primary" style={{width:'100%', marginTop:'2rem'}}>اختر الباقة</button>
        </div>

        <div className="glass-card pricing-card">
          <div className="pricing-header">
            <h3>المؤسسات</h3>
            <div className="price-tag">مخصص</div>
          </div>
          <ul className="feature-list">
            {['تطوير منصات معقدة', 'تطبيقات جوال Native', 'استراتيجية تسويق شاملة', 'فريق مخصص', 'اتفاقية مستوى خدمة (SLA)'].map((f,i) => (
              <li key={i} className="feature-item"><CheckCircle size={16} color={BRAND.colors.secondary} /> {f}</li>
            ))}
          </ul>
          <button className="btn btn-outline" style={{width:'100%', marginTop:'2rem'}}>تواصل معنا</button>
        </div>
      </div>
    </div>
  </section>
);

const Contact = () => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert("تم إرسال طلبك بنجاح!");
  };

  return (
    <section className="section container" id="تواصل">
      <div className="grid-2">
        <div>
          <h2>لنتحدث عن <span className="text-gradient">مشروعك القادم</span></h2>
          <p>فريقنا جاهز للاستماع إليك وتقديم الحلول الأنسب لنمو أعمالك.</p>
          
          <div style={{marginTop:'3rem', display:'flex', flexDirection:'column', gap:'2rem'}}>
            <div style={{display:'flex', gap:'1rem', alignItems:'center'}}>
              <div className="icon-box" style={{marginBottom:0, width:60, height:60}}><Phone /></div>
              <div>
                <div style={{fontSize:'0.9rem', color: BRAND.colors.grey}}>اتصل بنا</div>
                <div style={{fontWeight:'bold', fontSize:'1.2rem'}}>{BRAND.info.phone}</div>
              </div>
            </div>
            <div style={{display:'flex', gap:'1rem', alignItems:'center'}}>
              <div className="icon-box" style={{marginBottom:0, width:60, height:60}}><Mail /></div>
              <div>
                <div style={{fontSize:'0.9rem', color: BRAND.colors.grey}}>راسلنا</div>
                <div style={{fontWeight:'bold', fontSize:'1.2rem'}}>{BRAND.info.email}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{marginBottom:'2rem'}}>نموذج التواصل</h3>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="الاسم الكامل" className="form-input" required />
            <input type="email" placeholder="البريد الإلكتروني" className="form-input" required />
            <textarea placeholder="تفاصيل المشروع..." className="form-input" style={{minHeight:'120px'}}></textarea>
            <button className="btn btn-primary" style={{width:'100%'}}>إرسال الطلب <Send size={18} /></button>
          </form>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer style={{background: BRAND.colors.dark, color:'white', paddingTop:'5rem', paddingBottom:'2rem'}}>
    <div className="container">
      <div className="grid-2" style={{alignItems:'start', marginBottom:'4rem'}}>
        <div>
          <div style={{fontSize:'2rem', fontWeight:'900', color:'white', marginBottom:'1.5rem'}}>AURA</div>
          <p style={{color: BRAND.colors.grey, maxWidth:'400px'}}>
            الوكالة الرقمية التي تثق بها العلامات التجارية الطموحة في المملكة. نصنع الفرق من خلال الجودة، الابتكار، والنتائج الملموسة.
          </p>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2rem'}}>
          <div>
            <h4 style={{color:'white', marginBottom:'1.5rem'}}>الروابط</h4>
            {['الرئيسية', 'خدماتنا', 'أعمالنا', 'الوظائف'].map(l => (
              <a key={l} href="#" className="footer-link">{l}</a>
            ))}
          </div>
          <div>
            <h4 style={{color:'white', marginBottom:'1.5rem'}}>تواصل</h4>
            <div style={{color: BRAND.colors.grey, marginBottom:'0.5rem'}}>{BRAND.info.email}</div>
            <div style={{color: BRAND.colors.grey}}>{BRAND.info.address}</div>
          </div>
        </div>
      </div>
      <div style={{borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:'2rem', textAlign:'center', color: BRAND.colors.grey, fontSize:'0.9rem'}}>
        © 2026 AURA Digital Agency. All rights reserved.
      </div>
    </div>
  </footer>
);

// =========================================
// 6. MAIN APP
// =========================================

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
        <AuraScene startAnimation={introFinished} />
        <Navbar />
        <main>
          <Hero />
          <ClientMarquee />
          <About />
          <Services />
          <Methodology />
          <Works />
          <Pricing />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}
