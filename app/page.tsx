'use client';

import React, { useState, useEffect, useRef, useLayoutEffect, useMemo } from 'react';
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

// --- 1. CONFIG ---
const COLORS = {
  primary: '#438FB3',
  secondary: '#58A8B4',
  silver: '#B3B7C1',
  dark: '#0f172a',
  bg: '#ffffff'
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "AURA Digital Agency",
  "url": "https://aurateam3.com"
};

// --- 2. STYLES (Light Theme) ---
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Readex+Pro:wght@200;300;400;500;600;700;800&display=swap');
  
  html, body {
    background-color: #ffffff !important;
    color: #0f172a !important;
    font-family: 'Readex Pro', sans-serif;
    margin: 0; padding: 0;
    overflow-x: hidden;
    direction: rtl;
  }

  /* Intro Overlay */
  .intro-overlay {
    position: fixed; inset: 0; z-index: 10000;
    background: #0f172a; color: white;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center;
  }
  .intro-text { font-size: 1.2rem; color: ${COLORS.secondary}; margin-bottom: 2rem; }
  .intro-counter { font-size: 5rem; font-weight: 900; line-height: 1; color: white; font-variant-numeric: tabular-nums; }
  .intro-bar { width: 200px; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; margin-top: 1rem; overflow: hidden; }
  .intro-fill { height: 100%; background: ${COLORS.primary}; transition: width 0.1s linear; }

  /* Canvas */
  #canvas-container {
    position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
    z-index: 0; pointer-events: none; opacity: 1;
  }

  /* Navbar */
  .navbar {
    position: fixed; top: 25px; left: 50%; transform: translateX(-50%);
    width: 90%; max-width: 950px; z-index: 1000;
    padding: 0.8rem 2rem; border-radius: 100px;
    background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(20px);
    border: 1px solid ${COLORS.silver}40;
    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05);
    display: flex; justify-content: space-between; align-items: center;
    transition: 0.4s;
  }
  .nav-link { color: ${COLORS.dark}; font-weight: 600; cursor: pointer; transition: 0.3s; margin: 0 1rem; text-decoration: none; }
  .nav-link:hover { color: ${COLORS.primary}; }

  /* Typography */
  h1 { font-size: clamp(3rem, 7vw, 5.5rem); font-weight: 800; line-height: 1.1; margin-bottom: 1.5rem; color: ${COLORS.dark}; }
  h2 { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 800; margin-bottom: 1.5rem; }
  p { color: #475569; font-size: 1.1rem; line-height: 1.8; margin-bottom: 1.5rem; }
  
  .text-gradient {
    background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%);
    -webkit-background-clip: text; color: transparent; display: inline-block;
  }

  /* Buttons */
  .btn-primary {
    background: ${COLORS.primary}; color: white; padding: 0.8rem 2.5rem;
    border-radius: 50px; border: none; font-weight: 700; cursor: pointer;
    box-shadow: 0 10px 20px -5px ${COLORS.primary}60; transition: 0.3s;
  }
  .btn-primary:hover { background: ${COLORS.secondary}; transform: translateY(-3px); }

  /* Cards */
  .glass-card {
    background: white; border: 1px solid ${COLORS.silver}40;
    border-radius: 2rem; padding: 2.5rem;
    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.03);
    transition: 0.4s; height: 100%;
  }
  .glass-card:hover { transform: translateY(-8px); border-color: ${COLORS.secondary}; box-shadow: 0 20px 40px -10px ${COLORS.secondary}30; }

  /* Sections */
  .container { max-width: 1300px; margin: 0 auto; padding: 0 2rem; position: relative; z-index: 10; }
  .section { padding: 8rem 0; position: relative; }
  .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }

  @media (max-width: 768px) {
    .nav-links, .desktop-only { display: none; }
    h1 { font-size: 3rem; }
  }
`;

// --- 3. SHADERS (GPU POWERED ANIMATION) ---
const vertexShader = `
  uniform float uTime;
  uniform float uProgress;
  attribute vec3 aRandomPos;
  attribute vec3 aTargetPos;
  
  varying vec2 vUv;
  varying float vAlpha;

  void main() {
    vUv = uv;
    
    // Mix positions based on progress (0 = Chaos, 1 = Text)
    // Using a cubic bezier curve for smooth transition
    float t = uProgress;
    float ease = t * t * (3.0 - 2.0 * t);
    
    vec3 pos = mix(aRandomPos, aTargetPos, ease);
    
    // Add some noise/float when in chaos mode
    float noise = sin(aRandomPos.x * 0.1 + uTime) * cos(aRandomPos.y * 0.1 + uTime);
    pos.z += noise * 5.0 * (1.0 - ease); // Less movement when text forms
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = (80.0 * (1.0 + ease)) / -mvPosition.z; // Size calculation
    
    vAlpha = 0.6 + 0.4 * ease; // More opaque when text
  }
`;

const fragmentShader = `
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  varying float vAlpha;

  void main() {
    // Circular particle
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);
    if (dist > 0.5) discard;
    
    // Gradient Color
    vec3 color = mix(uColor1, uColor2, 0.5 + 0.5 * sin(gl_FragCoord.x * 0.01));
    
    gl_FragColor = vec4(color, vAlpha);
  }
`;

// --- 4. INTRO COMPONENT ---
const Intro = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    // Simple JS Interval to avoid GSAP load issues
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          gsap.to(containerRef.current, {
            yPercent: -100,
            duration: 1.2,
            ease: "power4.inOut",
            onComplete: onComplete
          });
          return 100;
        }
        return prev + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} className="intro-overlay">
      <p className="intro-text">⚠️ تنبيه: هالة "أورا" ساطعة جداً</p>
      <div className="intro-counter">{progress}%</div>
      <div className="intro-bar">
        <div className="intro-fill" style={{width: `${progress}%`}}></div>
      </div>
    </div>
  );
};

// --- 5. AURA SCENE (GPU) ---
const AuraScene = ({ startAnimation }: { startAnimation: boolean }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    const scene = new THREE.Scene();
    // No Fog to keep colors crisp
    
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.z = 40;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // --- GENERATE TEXT POSITIONS ---
    const canvas = document.createElement('canvas');
    canvas.width = 1000; canvas.height = 500;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'black'; ctx.fillRect(0,0,1000,500);
      ctx.fillStyle = 'white'; ctx.font = '900 200px Arial';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('AURA', 500, 250);
    }
    const data = ctx?.getImageData(0,0,1000,500).data;
    const targets: number[] = [];
    if (data) {
      for(let y=0; y<500; y+=5) {
        for(let x=0; x<1000; x+=5) {
          if(data[(y*1000+x)*4] > 128) {
            targets.push((x-500)*0.08, -(y-250)*0.08, 0);
          }
        }
      }
    }

    // --- GEOMETRY SETUP ---
    const count = targets.length / 3 + 2000; // Text + Background stars
    const geometry = new THREE.BufferGeometry();
    const randomPos = new Float32Array(count * 3);
    const targetPos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Random Start
      randomPos[i*3] = (Math.random()-0.5) * 150;
      randomPos[i*3+1] = (Math.random()-0.5) * 100;
      randomPos[i*3+2] = (Math.random()-0.5) * 100;

      // Targets
      if (i < targets.length/3) {
        targetPos[i*3] = targets[i*3];
        targetPos[i*3+1] = targets[i*3+1];
        targetPos[i*3+2] = targets[i*3+2];
      } else {
        // Background stars stay random
        targetPos[i*3] = randomPos[i*3];
        targetPos[i*3+1] = randomPos[i*3+1];
        targetPos[i*3+2] = randomPos[i*3+2];
      }
    }

    geometry.setAttribute('aRandomPos', new THREE.BufferAttribute(randomPos, 3));
    geometry.setAttribute('aTargetPos', new THREE.BufferAttribute(targetPos, 3));

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uColor1: { value: new THREE.Color(COLORS.primary) },
        uColor2: { value: new THREE.Color(COLORS.secondary) }
      },
      transparent: true,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Animation Loop
    const clock = new THREE.Clock();
    const animate = () => {
      material.uniforms.uTime.value = clock.getElapsedTime();
      points.rotation.y = Math.sin(clock.getElapsedTime() * 0.1) * 0.1; // Gentle sway
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // TRIGGER MORPH
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

  return <div id="canvas-container" ref={mountRef}></div>;
};

// --- 6. MAIN COMPONENTS ---
const Navbar = () => (
  <nav className="navbar">
    <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
      <span style={{fontSize:'1.5rem', fontWeight:'900', color: COLORS.primary}}>AURA</span>
    </div>
    <div className="nav-links desktop-only" style={{display:'flex', gap:'2rem'}}>
      {['الرئيسية', 'خدماتنا', 'أعمالنا', 'الأسعار'].map(i => (
        <a key={i} href={`#${i}`} className="nav-link">{i}</a>
      ))}
    </div>
    <button className="btn-primary desktop-only">ابدأ مشروعك</button>
    <button className="mobile-only" style={{background:'none', border:'none'}}><Menu color={COLORS.primary}/></button>
  </nav>
);

const Hero = () => (
  <section className="section" style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center'}}>
    <div className="container">
      <motion.div initial={{opacity:0, y:50}} animate={{opacity:1, y:0}} transition={{duration:1, delay:1}}>
        <div style={{display:'inline-block', padding:'0.5rem 1.5rem', background:'#f1f5f9', borderRadius:'50px', color: COLORS.primary, fontWeight:'bold', marginBottom:'1.5rem'}}>
          ✨ الوكالة الرقمية للمستقبل
        </div>
        <h1>
          نحول الخيال إلى <span className="text-gradient">واقع رقمي</span>
        </h1>
        <p style={{margin:'0 auto 2.5rem', maxWidth:'600px'}}>
          في أورا، ندمج البيانات مع الإبداع لنصنع لك تجربة مستخدم لا تُنسى.
        </p>
        <div style={{display:'flex', justifyContent:'center', gap:'1rem'}}>
          <button className="btn-primary">استكشف خدماتنا</button>
        </div>
      </motion.div>
    </div>
  </section>
);

const Services = () => (
  <section className="section container" id="خدماتنا" style={{background:'rgba(255,255,255,0.5)', borderRadius:'2rem'}}>
    <div style={{textAlign:'center', marginBottom:'4rem'}}>
      <h2>خدماتنا <span className="text-gradient">المتكاملة</span></h2>
    </div>
    <div className="grid-3">
      {[
        {t: 'هوية بصرية', i: Palette, d: 'نصنع علامة لا تُنسى.'},
        {t: 'تطوير ويب', i: Code, d: 'مواقع سريعة بـ Next.js.'},
        {t: 'تسويق رقمي', i: Megaphone, d: 'نصل لجمهورك بدقة.'},
        {t: 'تطبيقات', i: Smartphone, d: 'تجربة مستخدم سلسة.'},
        {t: 'متاجر', i: ShoppingBag, d: 'حلول بيع متكاملة.'},
        {t: 'SEO', i: Search, d: 'تصدر نتائج البحث.'}
      ].map((s, i) => (
        <div key={i} className="glass-card">
          <div style={{width:50, height:50, background:`${COLORS.primary}10`, borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1.5rem', color: COLORS.primary}}>
            <s.i size={24} />
          </div>
          <h3>{s.t}</h3>
          <p>{s.d}</p>
        </div>
      ))}
    </div>
  </section>
);

const Footer = () => (
  <footer style={{background: COLORS.dark, color:'white', padding:'6rem 0 2rem', marginTop:'6rem', textAlign:'center'}}>
    <div className="container">
      <h2 style={{color:'white', marginBottom:'2rem'}}>جاهز للبدء؟</h2>
      <button className="btn-primary" style={{background:'white', color: COLORS.dark}}>تواصل معنا</button>
      <div style={{marginTop:'4rem', color: COLORS.silver}}>© 2026 AURA.</div>
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
        <AuraScene startAnimation={introFinished} />
        <Navbar />
        <main>
          <Hero />
          <Services />
        </main>
        <Footer />
      </div>
    </>
  );
}
