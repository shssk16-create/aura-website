'use client';

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { 
  ArrowUpRight, Palette, Globe, Megaphone, Search, 
  Menu, X, Sparkles, ChevronDown 
} from 'lucide-react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// --- Global Custom CSS (No Tailwind) ---
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Readex+Pro:wght@200;300;400;500;600;700&display=swap');

  :root {
    --bg-dark: #030303;
    --bg-card: #0a0a0a;
    --primary: #4390b3;
    --accent: #b34390;
    --text-main: #ffffff;
    --text-muted: #888888;
    --glass-border: rgba(255, 255, 255, 0.08);
    --glass-bg: rgba(20, 20, 20, 0.6);
    --capsule-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
    --transition-smooth: cubic-bezier(0.23, 1, 0.32, 1);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; outline: none; -webkit-tap-highlight-color: transparent; }
  
  html, body {
    background-color: var(--bg-dark);
    color: var(--text-main);
    font-family: 'Readex Pro', sans-serif;
    overflow-x: hidden;
    direction: rtl;
    scroll-behavior: smooth;
  }

  /* Typography */
  h1 { font-size: clamp(3rem, 10vw, 7rem); font-weight: 700; letter-spacing: -2px; line-height: 1.1; }
  h2 { font-size: clamp(2rem, 6vw, 4rem); font-weight: 600; letter-spacing: -1px; }
  h3 { font-size: 1.5rem; font-weight: 500; }
  p { color: var(--text-muted); line-height: 1.8; font-size: 1.1rem; }
  
  .text-gradient {
    background: linear-gradient(135deg, #fff 0%, var(--primary) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  /* Layout Utilities */
  .main-container { width: 100%; max-width: 1400px; margin: 0 auto; padding: 0 2rem; position: relative; }
  .flex-center { display: flex; align-items: center; justify-content: center; }
  .grid-services { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }

  /* --- The Glass Capsule Navbar --- */
  .nav-wrapper {
    position: fixed; top: 2rem; left: 0; width: 100%; 
    z-index: 1000; pointer-events: none;
    display: flex; justify-content: center;
  }
  
  .nav-capsule {
    pointer-events: auto;
    background: var(--glass-bg);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid var(--glass-border);
    padding: 0.8rem 1.5rem;
    border-radius: 100px;
    display: flex; align-items: center; justify-content: space-between;
    gap: 3rem;
    box-shadow: var(--capsule-shadow);
    transition: all 0.5s var(--transition-smooth);
    width: auto;
    max-width: 90%;
  }

  .nav-capsule:hover {
    border-color: rgba(255,255,255,0.2);
    box-shadow: 0 15px 40px -10px rgba(67, 144, 179, 0.15);
  }

  .nav-links { display: flex; gap: 2rem; align-items: center; }
  .nav-item { 
    color: var(--text-muted); text-decoration: none; font-size: 0.95rem; 
    transition: 0.3s; position: relative; cursor: pointer;
  }
  .nav-item:hover { color: white; }
  
  .nav-cta {
    background: white; color: black; border-radius: 50px;
    padding: 0.6rem 1.4rem; font-weight: 600; border: none;
    cursor: pointer; transition: transform 0.3s var(--transition-smooth);
  }
  .nav-cta:hover { transform: scale(1.05); }

  /* Mobile Nav */
  .mobile-toggle { display: none; background: none; border: none; color: white; cursor: pointer; }
  
  @media (max-width: 768px) {
    .nav-links { display: none; }
    .mobile-toggle { display: block; }
    .nav-capsule { padding: 0.8rem 1.2rem; width: 85%; justify-content: space-between; }
  }

  /* --- Hero Section --- */
  .hero-section {
    height: 100vh; position: relative; overflow: hidden;
    display: flex; flex-direction: column; justify-content: center; align-items: center;
    text-align: center; z-index: 1;
  }
  
  .scroll-indicator {
    position: absolute; bottom: 3rem; left: 50%; transform: translateX(-50%);
    animation: float 3s ease-in-out infinite; opacity: 0.6;
  }

  /* --- Services Card --- */
  .glass-card {
    background: linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
    border: 1px solid var(--glass-border);
    border-radius: 24px;
    padding: 2.5rem;
    position: relative; overflow: hidden;
    transition: transform 0.4s var(--transition-smooth), border-color 0.4s;
  }
  .glass-card:hover {
    transform: translateY(-10px);
    border-color: var(--primary);
  }
  .card-icon {
    width: 60px; height: 60px; border-radius: 16px;
    background: rgba(67, 144, 179, 0.1);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 1.5rem; color: var(--primary);
  }

  /* --- Works Horizontal Scroll --- */
  .works-section { height: 400vh; position: relative; }
  .works-sticky {
    position: sticky; top: 0; height: 100vh; width: 100%;
    overflow: hidden; display: flex; align-items: center;
  }
  .works-track {
    display: flex; gap: 4vw; padding-right: 10vw; padding-left: 5vw;
    width: max-content; /* Critical for horizontal scroll */
  }
  .work-item {
    width: 45vw; height: 65vh; position: relative;
    border-radius: 30px; overflow: hidden; flex-shrink: 0;
    border: 1px solid var(--glass-border);
  }
  .work-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.7s; }
  .work-item:hover .work-img { transform: scale(1.1); }
  
  @media (max-width: 768px) {
    .works-section { height: auto; }
    .works-sticky { position: relative; height: auto; display: block; }
    .works-track { flex-direction: column; width: 100%; padding: 2rem; gap: 2rem; transform: none !important; }
    .work-item { width: 100%; height: 50vh; }
  }

  /* --- Footer --- */
  footer {
    padding: 6rem 0; border-top: 1px solid var(--glass-border);
    background: radial-gradient(circle at 50% 0%, rgba(67,144,179,0.08), transparent 60%);
    text-align: center;
  }

  /* Animations */
  @keyframes float { 0%, 100% { transform: translate(-50%, 0); } 50% { transform: translate(-50%, 10px); } }
  
  .custom-cursor {
    width: 12px; height: 12px; background: var(--primary);
    border-radius: 50%; position: fixed; pointer-events: none; z-index: 9999;
    mix-blend-mode: difference;
  }
`;

/* --- Three.js Logic --- */
// (Same robust particle system as before, optimized)
const particleShader = {
  vertex: `
    uniform float uTime; uniform float uProgress;
    attribute vec3 aTarget; attribute float aSize; attribute vec3 aRandom;
    varying float vAlpha;
    void main() {
      vec3 pos = mix(aRandom, aTarget, uProgress);
      pos.y += sin(uTime * 1.5 + pos.x * 0.05) * 0.3 * (1.0 - uProgress); 
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      gl_PointSize = (aSize * 2.5) * (1.0 / -mvPosition.z);
      vAlpha = 0.5 + 0.5 * uProgress;
    }
  `,
  fragment: `
    uniform vec3 uColor; varying float vAlpha;
    void main() {
      float r = distance(gl_PointCoord, vec2(0.5));
      if (r > 0.5) discard;
      gl_FragColor = vec4(uColor, vAlpha * (1.0 - r*2.0));
    }
  `
};

const generateParticles = (text) => {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d');
  canvas.width = 800; canvas.height = 400;
  ctx.font = '900 130px "Readex Pro"'; ctx.fillStyle = 'white'; 
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 400, 200);
  const data = ctx.getImageData(0,0,800,400).data;
  const particles = [];
  for(let i=0; i<800; i+=3) { for(let j=0; j<400; j+=3) {
    if(data[(j*800+i)*4] > 128) particles.push({x:(i-400)/12, y:-(j-200)/12, z:0});
  }}
  return particles;
};

/* --- Components --- */

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navItems = ['الرئيسية', 'خدماتنا', 'المشاريع', 'المدونة'];

  return (
    <>
      <div className="nav-wrapper">
        <motion.nav 
          className="nav-capsule"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={18} color="#000" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '1.2rem', letterSpacing: '1px' }}>AURA</span>
          </div>

          {/* Desktop Links */}
          <div className="nav-links">
            {navItems.map((item, i) => (
              <a key={i} className="nav-item">{item}</a>
            ))}
          </div>

          {/* CTA & Mobile Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="nav-cta" style={{ display: isOpen ? 'none' : 'block' }}>اتصل بنا</button>
            <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </motion.nav>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(3,3,3,0.95)', backdropFilter: 'blur(10px)', zIndex: 999, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '2rem' }}
          >
            {navItems.map((item, i) => (
              <motion.a 
                key={i} 
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                transition={{ delay: 0.1 * i }}
                style={{ fontSize: '2rem', fontWeight: 600, color: 'white', cursor: 'pointer' }}
                onClick={() => setIsOpen(false)}
              >
                {item}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Hero = () => {
  const mount = useRef(null);
  useEffect(() => {
    if (!mount.current) return;
    const w = window.innerWidth, h = window.innerHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 100);
    camera.position.z = 30;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    mount.current.appendChild(renderer.domElement);

    const baseData = generateParticles("إبداع");
    if(!baseData) return;
    const count = baseData.length;
    const geo = new THREE.BufferGeometry();
    const target = new Float32Array(count*3);
    const random = new Float32Array(count*3);
    const sizes = new Float32Array(count);
    
    baseData.forEach((p, i) => {
      target[i*3]=p.x; target[i*3+1]=p.y; target[i*3+2]=p.z;
      random[i*3]=(Math.random()-0.5)*80; random[i*3+1]=(Math.random()-0.5)*80; random[i*3+2]=(Math.random()-0.5)*50;
      sizes[i] = Math.random();
    });
    
    geo.setAttribute('position', new THREE.BufferAttribute(target, 3));
    geo.setAttribute('aTarget', new THREE.BufferAttribute(target, 3));
    geo.setAttribute('aRandom', new THREE.BufferAttribute(random, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    
    const mat = new THREE.ShaderMaterial({
      vertexShader: particleShader.vertex, fragmentShader: particleShader.fragment,
      uniforms: { uTime: {value:0}, uProgress: {value:0}, uColor: {value: new THREE.Color('#4390b3')} },
      transparent: true, blending: THREE.AdditiveBlending, depthTest: false
    });
    
    scene.add(new THREE.Points(geo, mat));
    
    gsap.to(mat.uniforms.uProgress, { value: 1, duration: 2.5, ease: "power3.out" });
    
    const clock = new THREE.Clock();
    let req;
    const animate = () => {
      mat.uniforms.uTime.value = clock.getElapsedTime();
      scene.rotation.y = Math.sin(clock.getElapsedTime()*0.1)*0.1;
      renderer.render(scene, camera);
      req = requestAnimationFrame(animate);
    };
    animate();
    
    return () => { cancelAnimationFrame(req); mount.current?.removeChild(renderer.domElement); geo.dispose(); };
  }, []);

  return (
    <div className="hero-section">
      <div ref={mount} style={{ position: 'absolute', inset: 0 }} />
      <div className="main-container" style={{ zIndex: 10, marginTop: '10vh' }}>
        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          style={{ letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1rem', color: '#4390b3' }}
        >
          Creative Digital Agency
        </motion.p>
        <motion.h1 
          initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1 }}
        >
          نبتكر المستقبل <br /> <span className="text-gradient">الرقمي</span>
        </motion.h1>
      </div>
      <div className="scroll-indicator">
        <ChevronDown color="#555" size={32} />
      </div>
    </div>
  );
};

const Services = () => {
  const list = [
    { t: "الهوية البصرية", i: Palette, d: "تصاميم تعكس جوهر علامتك التجارية." },
    { t: "تطوير الويب", i: Globe, d: "واجهات عصرية بأحدث التقنيات." },
    { t: "التسويق", i: Megaphone, d: "وصول استراتيجي لجمهورك المستهدف." },
    { t: "SEO", i: Search, d: "تصدر نتائج البحث بشكل طبيعي." }
  ];

  return (
    <section className="main-container" style={{ paddingBottom: '10rem', paddingTop: '5rem' }}>
      <div style={{ marginBottom: '5rem', textAlign: 'center' }}>
        <h2>حلول <span className="text-gradient">احترافية</span></h2>
      </div>
      <div className="grid-services">
        {list.map((item, i) => (
          <div key={i} className="glass-card">
            <div className="card-icon"><item.i size={28} /></div>
            <h3 style={{ marginBottom: '0.8rem' }}>{item.t}</h3>
            <p style={{ fontSize: '0.95rem' }}>{item.d}</p>
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
              <ArrowUpRight size={20} color="#4390b3" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const Works = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  
  useLayoutEffect(() => {
    if (window.innerWidth < 768) return;
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      // Scroll Right (RTL) logic
      gsap.to(track, {
        x: window.innerWidth - track.scrollWidth, // Move leftwards
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=300%",
          scrub: 1,
          pin: true
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const works = [
    { t: "مشروع نيوم", img: "https://images.unsplash.com/photo-1596707328659-56540c490a6c?w=800&q=80" },
    { t: "العلا", img: "https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?w=800&q=80" },
    { t: "القدية", img: "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=800&q=80" },
    { t: "البحر الأحمر", img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80" }
  ];

  return (
    <section ref={sectionRef} className="works-section">
      <div className="works-sticky">
        <div style={{ position: 'absolute', top: '10vh', right: '5vw', zIndex: 10 }}>
          <h2 style={{ fontSize: '3rem' }}>أعمالنا <span className="text-gradient">المميزة</span></h2>
        </div>
        <div ref={trackRef} className="works-track">
          {works.map((w, i) => (
            <div key={i} className="work-item">
              <img src={w.img} alt={w.t} className="work-img" />
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: '100%', padding: '2rem', background: 'linear-gradient(to top, #000 0%, transparent 100%)' }}>
                <h3 style={{ color: 'white' }}>{w.t}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function AuraPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  // Custom Cursor
  const cursorRef = useRef(null);
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const move = (e) => {
      if(cursorRef.current) cursorRef.current.style.transform = `translate3d(${e.clientX - 6}px, ${e.clientY - 6}px, 0)`;
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--bg-dark)', minHeight: '100vh' }}>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      
      {/* Scroll Progress Bar */}
      <motion.div style={{ scaleX, position: 'fixed', top: 0, left: 0, right: 0, height: '2px', background: 'var(--primary)', transformOrigin: '0%', zIndex: 2000 }} />
      
      <div ref={cursorRef} className="custom-cursor" />
      
      <Navbar />
      
      <main>
        <Hero />
        <Services />
        <Works />
      </main>

      <footer>
        <div className="main-container">
          <h2 style={{ marginBottom: '2rem' }}>لنبدأ رحلة النجاح</h2>
          <button style={{ background: 'white', color: 'black', border: 'none', padding: '1rem 3rem', borderRadius: '50px', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 'bold' }}>تواصل معنا</button>
          <div style={{ marginTop: '4rem', opacity: 0.5 }}>© 2026 AURA Inc.</div>
        </div>
      </footer>
    </div>
  );
}
