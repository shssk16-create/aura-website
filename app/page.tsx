'use client';

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowUpRight, Megaphone, PenTool, Search, Palette, 
  ShoppingBag, Plus, Menu, X, Globe, ChevronDown, Zap 
} from 'lucide-react';
import Script from 'next/script';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// --- SEO Data ---
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "AURA Digital Agency",
  "url": "https://aurateam3.com"
};

// --- CSS SYSTEM (Updated Line-Heights & Intro) ---
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Readex+Pro:wght@200;300;400;500;600;700&display=swap');
  
  :root {
    --primary: #4390b3;
    --primary-glow: rgba(67, 144, 179, 0.6);
    --bg-dark: #050607;
    --white: #ffffff;
    --glass-border: rgba(255, 255, 255, 0.08);
    --text-muted: #94a3b8;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  body {
    background-color: var(--bg-dark);
    color: var(--white);
    font-family: 'Readex Pro', sans-serif;
    overflow-x: hidden;
    direction: rtl;
  }

  /* Typography Fixes (Line Height) */
  h1 { font-size: clamp(3rem, 8vw, 6.5rem); font-weight: 800; line-height: 1.1; margin-bottom: 1.5rem; letter-spacing: -0.02em; }
  h2 { font-size: clamp(2rem, 5vw, 4rem); font-weight: 700; line-height: 1.2; margin-bottom: 1.5rem; }
  p { 
    color: var(--text-muted); 
    font-size: 1.1rem; 
    line-height: 1.8; /* Perfect readability for Arabic */
    max-width: 65ch; 
    margin: 0 auto; 
  }

  .container { max-width: 1300px; margin: 0 auto; padding: 0 1.5rem; position: relative; }
  .text-gradient { background: linear-gradient(135deg, #fff 0%, var(--primary) 100%); -webkit-background-clip: text; color: transparent; }
  .full-screen { height: 100vh; width: 100%; position: relative; overflow: hidden; }

  /* Intro Preloader */
  .intro-overlay {
    position: fixed; inset: 0; z-index: 9999;
    background: #000;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
  }
  .intro-counter {
    font-size: 8rem; font-weight: 900; color: var(--white);
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }
  .intro-text {
    font-size: 1.2rem; color: var(--primary); letter-spacing: 2px;
    margin-top: 1rem; text-transform: uppercase;
  }

  /* Navbar (Capsule) */
  .navbar {
    position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
    width: 90%; max-width: 900px; z-index: 1000;
    padding: 0.8rem 2rem; border-radius: 100px;
    background: rgba(5, 6, 7, 0.6); backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  .navbar.scrolled { top: 15px; background: rgba(5, 6, 7, 0.9); border-color: rgba(67, 144, 179, 0.3); }
  .nav-links { display: flex; gap: 2.5rem; }
  .nav-link { color: rgba(255,255,255,0.7); text-decoration: none; transition: 0.3s; font-weight: 500; cursor: pointer; }
  .nav-link:hover { color: white; }

  .btn-primary {
    background: white; color: black; padding: 0.7rem 2rem; border: none;
    border-radius: 50px; cursor: pointer; font-weight: 700; transition: 0.3s;
  }
  .btn-primary:hover { background: var(--primary); color: white; }

  /* Glass Card */
  .glass-card {
    background: rgba(255, 255, 255, 0.02); border: 1px solid var(--glass-border);
    backdrop-filter: blur(15px); border-radius: 1.5rem; padding: 2.5rem;
    transition: 0.4s; position: relative; overflow: hidden; height: 100%;
  }
  .glass-card:hover { border-color: var(--primary); transform: translateY(-10px); }

  /* Works Scroll */
  .works-section { height: 300vh; position: relative; }
  .works-sticky { position: sticky; top: 0; height: 100vh; display: flex; align-items: center; overflow: hidden; background: var(--bg-dark); }
  .works-track { display: flex; gap: 4vw; padding: 0 5vw; flex-direction: row-reverse; }
  .work-card { width: 50vw; height: 60vh; flex-shrink: 0; border-radius: 2rem; overflow: hidden; position: relative; border: 1px solid var(--glass-border); }
  .work-img { width: 100%; height: 100%; object-fit: cover; transition: 0.7s; }
  .work-card:hover .work-img { transform: scale(1.1); }

  /* Responsive */
  .desktop-only { display: flex; } .mobile-only { display: none; }
  @media (max-width: 768px) {
    .nav-links, .desktop-only { display: none; } .mobile-only { display: block; }
    .work-card { width: 85vw; height: 50vh; }
  }
`;

// --- Helpers: Generate Text Particles ---
const createTextParticles = (text: string, font: string = 'bold 150px Arial') => {
  if (typeof document === 'undefined') return { positions: new Float32Array(0), count: 0 };
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return { positions: new Float32Array(0), count: 0 };

  const width = 1000; const height = 500;
  canvas.width = width; canvas.height = height;
  
  ctx.fillStyle = '#000000'; ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#ffffff'; ctx.font = font; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const particles = [];

  for (let y = 0; y < height; y += 4) { // Scan step (density)
    for (let x = 0; x < width; x += 4) {
      if (data[(y * width + x) * 4] > 128) {
        // Map 2D to 3D (Scale down)
        const pX = (x - width / 2) * 0.08;
        const pY = -(y - height / 2) * 0.08;
        particles.push(pX, pY, 0);
      }
    }
  }
  return { positions: new Float32Array(particles), count: particles.length / 3 };
};

// --- Shaders for Morphing ---
const vertexShader = `
  uniform float uTime;
  uniform float uProgress; // 0 = Chaos, 1 = Text
  attribute vec3 aRandomPos;
  attribute vec3 aTextPos;
  attribute float aSize;
  
  varying vec3 vColor;
  
  // Simplex Noise (Simplified)
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) { 
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i); 
    vec4 p = permute( permute( permute( 
              i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    float noise = snoise(vec3(aRandomPos.x * 0.5, aRandomPos.y * 0.5, uTime * 0.5));
    
    // Interpolate between Random and Text
    vec3 mixPos = mix(aRandomPos, aTextPos, uProgress);
    
    // Add some floaty movement
    mixPos.x += noise * 0.5 * (1.0 - uProgress); // Less noise when text is formed
    mixPos.y += noise * 0.5 * (1.0 - uProgress);
    mixPos.z += noise * 2.0 * (1.0 - uProgress);

    vec4 mvPosition = modelViewMatrix * vec4(mixPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Size attenuation
    gl_PointSize = (4.0 * aSize) * (1.0 / -mvPosition.z);
    
    // Color: Mix between White (stars) and Cyan (AURA)
    vColor = mix(vec3(1.0, 1.0, 1.0), vec3(0.26, 0.56, 0.7), uProgress);
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  void main() {
    // Circular particle
    float r = distance(gl_PointCoord, vec2(0.5));
    if (r > 0.5) discard;
    
    // Soft glow
    float glow = 1.0 - (r * 2.0);
    glow = pow(glow, 1.5);
    
    gl_FragColor = vec4(vColor, glow);
  }
`;

// --- Components ---

const IntroOverlay = ({ onComplete }: { onComplete: () => void }) => {
  const container = useRef(null);
  const counterRef = useRef(null);
  const textRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(container.current, { display: 'none' });
          onComplete();
        }
      });

      // 1. Count up
      const counterObj = { val: 0 };
      tl.to(counterObj, {
        val: 100,
        duration: 2.5,
        ease: "power2.inOut",
        onUpdate: () => {
          if (counterRef.current) {
            (counterRef.current as HTMLElement).innerText = Math.floor(counterObj.val).toString();
          }
        }
      });

      // 2. Reveal text
      tl.to(textRef.current, { opacity: 1, y: 0, duration: 0.5 }, "-=1");

      // 3. Exit animation (Slide Up)
      tl.to(container.current, {
        yPercent: -100,
        duration: 1.2,
        ease: "power4.inOut",
        delay: 0.2
      });
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={container} className="intro-overlay">
      <div className="flex-center" style={{flexDirection: 'column'}}>
        <div ref={counterRef} className="intro-counter">0</div>
        <div ref={textRef} className="intro-text" style={{opacity:0, transform:'translateY(20px)'}}>AURA AGENCY</div>
      </div>
    </div>
  );
};

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
          <span style={{fontSize:'1.4rem', fontWeight:'900'}}>AURA</span>
        </div>
        <div className="nav-links desktop-only">
          {['الرئيسية', 'خدماتنا', 'أعمالنا', 'التواصل'].map((item) => <a key={item} href={`#${item}`} className="nav-link">{item}</a>)}
        </div>
        <div className="flex-center" style={{gap: '1rem'}}>
          <button className="btn-primary desktop-only">ابدأ مشروعك</button>
          <button className="mobile-only" style={{background:'none', border:'none', color:'white'}}><Menu /></button>
        </div>
      </div>
    </nav>
  );
};

const HeroScene = ({ startAnimation }: { startAnimation: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Scene Setup
    const w = window.innerWidth;
    const h = window.innerHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.z = 50; // Start far
    
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Data Generation
    const textData = createTextParticles("AURA", w < 768 ? 'bold 100px Arial' : 'bold 180px Arial');
    const count = textData.count; // Exact count needed for text
    const extraStars = 3000; // Background stars
    const totalCount = count + extraStars;

    const geometry = new THREE.BufferGeometry();
    const posRandom = new Float32Array(totalCount * 3);
    const posText = new Float32Array(totalCount * 3);
    const sizes = new Float32Array(totalCount);

    for (let i = 0; i < totalCount; i++) {
      // Random Chaos Positions
      posRandom[i*3] = (Math.random() - 0.5) * 150;
      posRandom[i*3+1] = (Math.random() - 0.5) * 100;
      posRandom[i*3+2] = (Math.random() - 0.5) * 100;

      // Text Positions
      if (i < count) {
        posText[i*3] = textData.positions[i*3];
        posText[i*3+1] = textData.positions[i*3+1];
        posText[i*3+2] = 0; // Flat text
        sizes[i] = Math.random() * 2.0 + 1.0;
      } else {
        // Extra stars stay as stars (map to themselves or random)
        posText[i*3] = posRandom[i*3];
        posText[i*3+1] = posRandom[i*3+1];
        posText[i*3+2] = posRandom[i*3+2];
        sizes[i] = Math.random() * 1.0 + 0.5; // Smaller background stars
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(posRandom, 3)); // Helper for Three
    geometry.setAttribute('aRandomPos', new THREE.BufferAttribute(posRandom, 3));
    geometry.setAttribute('aTextPos', new THREE.BufferAttribute(posText, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 }
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Animation Loop
    const clock = new THREE.Clock();
    const animate = () => {
      material.uniforms.uTime.value = clock.getElapsedTime();
      
      // Gentle rotation
      points.rotation.y = Math.sin(clock.getElapsedTime() * 0.1) * 0.1;
      points.rotation.x = Math.sin(clock.getElapsedTime() * 0.05) * 0.05;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // GSAP Trigger
    if (startAnimation) {
      gsap.to(material.uniforms.uProgress, {
        value: 1, // Morph to Text
        duration: 3,
        ease: "elastic.out(1, 0.5)", // Snappy effect
        delay: 0.5
      });
      
      gsap.to(camera.position, {
        z: 35, // Zoom in slightly
        duration: 3,
        ease: "power2.out"
      });
    }

    // Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    
    return () => { 
      window.removeEventListener('resize', handleResize); 
      renderer.dispose();
      geometry.dispose();
    };
  }, [startAnimation]);

  return (
    <div className="full-screen flex-center" style={{flexDirection: 'column'}}>
      <canvas ref={canvasRef} className="full-screen" style={{position:'absolute', top:0, left:0, zIndex:0}} />
      
      {/* Content that fades in AFTER morph */}
      <motion.div 
        initial={{opacity: 0}} 
        animate={startAnimation ? {opacity: 1} : {}} 
        transition={{delay: 2.5, duration: 1}}
        style={{position:'relative', zIndex:10, textAlign:'center', marginTop:'150px'}}
      >
        <p style={{fontSize: '1.2rem', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '1rem'}}>Digital Reality</p>
        <h2 style={{maxWidth: '800px', margin: '0 auto', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', lineHeight: '1.4'}}>
          نحول الخيال إلى <span className="text-gradient">واقع رقمي</span>
        </h2>
      </motion.div>
      
      <div style={{position:'absolute', bottom: 30, opacity: 0.6}}><ChevronDown className="animate-bounce" /></div>
      <style>{`@keyframes bounce {0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)}}`}</style>
    </div>
  );
};

// ... (Other sections: Services, Works, FAQ - same as before, simplified for length) ...
const Services = () => (
  <section className="container" id="خدماتنا" style={{padding: '8rem 1.5rem'}}>
    <h2 style={{textAlign: 'center'}}>خدماتنا <span className="text-gradient">المتكاملة</span></h2>
    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'2rem', marginTop:'3rem'}}>
      {['هوية بصرية', 'تطوير ويب', 'تسويق رقمي'].map((s, i) => (
        <div key={i} className="glass-card">
          <h3>{s}</h3>
          <p>حلول مبتكرة تضمن نمو أعمالك وتحقيق أهدافك.</p>
        </div>
      ))}
    </div>
  </section>
);

const Footer = () => (
  <footer style={{borderTop:'1px solid var(--glass-border)', padding:'4rem 0', textAlign:'center', marginTop:'4rem'}}>
    <h2 style={{marginBottom:'2rem'}}>جاهز للبدء؟</h2>
    <button className="btn-primary">تواصل معنا</button>
  </footer>
);

export default function AuraWebsite() {
  const [introFinished, setIntroFinished] = useState(false);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <Script id="json-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      <AnimatePresence>
        {!introFinished && <IntroOverlay onComplete={() => setIntroFinished(true)} />}
      </AnimatePresence>

      <Navbar />
      <main>
        <HeroScene startAnimation={introFinished} />
        <Services />
        <Footer />
      </main>
    </>
  );
}
