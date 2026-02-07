'use client';

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, useMotionValue, AnimatePresence } from 'framer-motion';
import { 
  ArrowUpRight, Megaphone, PenTool, Share2, Search, Palette, 
  ShoppingBag, Plus, Crosshair, Rocket, Menu, X, Globe, ChevronDown
} from 'lucide-react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// تسجيل GSAP فقط في المتصفح
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// --- نظام التصميم العالمي (CSS) ---
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Readex+Pro:wght@200;300;400;500;600;700&display=swap');
  
  /* خطوط عربية فاخرة */
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
    --bg-dark: #050607;
    --primary: #4390b3;
    --primary-glow: rgba(67, 144, 179, 0.5);
    --white: #ffffff;
    --border-color: rgba(255, 255, 255, 0.08);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  
  body { 
    background-color: var(--bg-dark); 
    color: var(--white); 
    font-family: 'DIN Next LT Arabic', 'Readex Pro', sans-serif; 
    overflow-x: hidden; 
    direction: rtl; 
  }

  /* Typography */
  h1, h2, h3 { font-weight: 700; margin: 0; line-height: 1.1; }
  h1 { font-size: clamp(2.5rem, 8vw, 5.5rem); letter-spacing: -1px; }
  h2 { font-size: clamp(2rem, 5vw, 3.5rem); }
  p { font-size: clamp(0.95rem, 2vw, 1.1rem); line-height: 1.8; color: #94a3b8; }
  
  .text-gradient { 
    background: linear-gradient(135deg, #fff 0%, var(--primary) 100%); 
    -webkit-background-clip: text; color: transparent; 
  }

  /* Layout Utilities */
  .container { max-width: 1400px; margin: 0 auto; padding: 0 clamp(1.5rem, 5vw, 3rem); position: relative; }
  .flex-center { display: flex; align-items: center; justify-content: center; }
  .absolute-fill { position: absolute; inset: 0; }
  
  /* Responsive Utilities (لحل مشكلة md: hidden) */
  .desktop-only { display: none !important; }
  .mobile-only { display: flex !important; }
  
  @media (min-width: 768px) {
    .desktop-only { display: flex !important; }
    .mobile-only { display: none !important; }
  }

  /* --- Glass Navbar --- */
  .navbar { 
    position: fixed; top: 0; left: 0; width: 100%; z-index: 1000; 
    padding: 1.5rem 0; transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1); 
  }
  .navbar.scrolled { 
    padding: 1rem 0; 
    background: rgba(5, 6, 7, 0.75); 
    backdrop-filter: blur(16px); 
    border-bottom: 1px solid rgba(255,255,255,0.08); 
  }
  
  .nav-link { 
    cursor: pointer; opacity: 0.7; transition: 0.3s; font-weight: 500; font-size: 1.1rem;
    position: relative;
  }
  .nav-link::after {
    content: ''; position: absolute; bottom: -5px; left: 0; width: 0; height: 2px;
    background: var(--primary); transition: 0.3s;
  }
  .nav-link:hover { opacity: 1; color: white; }
  .nav-link:hover::after { width: 100%; }

  .nav-btn { 
    padding: 0.8rem 2rem; background: rgba(255,255,255,0.05); 
    border: 1px solid rgba(255,255,255,0.1); border-radius: 99px; 
    color: white; cursor: pointer; transition: 0.4s; font-family: inherit; font-weight: bold;
  }
  .nav-btn:hover { 
    background: var(--primary); border-color: var(--primary); 
    box-shadow: 0 0 25px var(--primary-glow); transform: translateY(-2px);
  }

  /* Mobile Menu */
  .mobile-menu { 
    position: fixed; inset: 0; background: var(--bg-dark); z-index: 999; 
    display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 2rem; 
  }
  .mobile-link { font-size: 2.5rem; font-weight: 800; color: white; cursor: pointer; transition: 0.3s; }
  .mobile-link:hover { color: var(--primary); letter-spacing: 2px; }

  /* Hero Section */
  .hero-wrapper { height: 100vh; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; }
  .scroll-indicator { position: absolute; bottom: 2rem; opacity: 0.6; animation: bounce 2s infinite; }
  @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }

  /* Bento Grid */
  .bento-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
  .bento-card { 
    padding: 2rem; border-radius: 1.5rem; 
    border: 1px solid var(--border-color); 
    background: linear-gradient(145deg, #0F1115 0%, #08090b 100%); 
    transition: 0.4s; position: relative; overflow: hidden; 
    min-height: 260px; display: flex; flex-direction: column; justify-content: space-between;
  }
  .bento-card:hover { transform: translateY(-10px); border-color: var(--primary); }
  .bento-icon-bg { position: absolute; bottom: -20px; left: -20px; opacity: 0.05; transform: rotate(-10deg); transition: 0.4s; }
  .bento-card:hover .bento-icon-bg { transform: scale(1.2) rotate(0deg); opacity: 0.1; }

  /* Works Scroll */
  .works-section { height: 300vh; position: relative; }
  .works-sticky { height: 100vh; position: sticky; top: 0; overflow: hidden; display: flex; align-items: center; }
  .works-track { display: flex; gap: 4vw; padding: 0 5vw; flex-direction: row-reverse; }
  .work-card { 
    width: 60vw; height: 60vh; flex-shrink: 0; border-radius: 2rem; overflow: hidden; 
    border: 1px solid var(--border-color); position: relative; cursor: pointer;
  }
  .work-img { width: 100%; height: 100%; object-fit: cover; transition: 0.7s; }
  .work-card:hover .work-img { transform: scale(1.1); }
  
  /* Footer */
  footer { padding: 5rem 0; border-top: 1px solid var(--border-color); background: radial-gradient(circle at 50% 0%, rgba(67, 144, 179, 0.1), transparent 70%); }

  /* Custom Cursor */
  .custom-cursor { 
    position: fixed; top: 0; left: 0; width: 20px; height: 20px; 
    background: var(--primary); border-radius: 50%; pointer-events: none; 
    z-index: 9999; transform: translate(-50%, -50%); mix-blend-mode: difference; 
  }

  /* Responsive Rules */
  @media (min-width: 768px) {
    .bento-grid { grid-template-columns: repeat(2, 1fr); }
    .col-span-2 { grid-column: span 2; }
    .work-card { width: 35vw; height: 70vh; }
  }
  @media (min-width: 1024px) {
    .bento-grid { grid-template-columns: repeat(3, 1fr); }
  }
  @media (max-width: 767px) {
    .works-section { height: auto; }
    .works-sticky { position: relative; height: auto; display: block; }
    .works-track { flex-direction: column; transform: none !important; padding: 2rem 1rem; gap: 2rem; }
    .work-card { width: 100%; height: 50vh; }
  }
`;

// --- THREE.js Shaders (تأثير الشفق القطبي) ---
const particleVertexShader = `
  uniform float uTime; uniform float uProgress; uniform vec2 uMouse;
  attribute vec3 aRandomPos; attribute vec3 aTargetPos; attribute float aSize;
  varying float vAlpha; varying vec3 vPos;
  void main() {
    float t = uProgress;
    float ease = 1.0 - pow(1.0 - t, 3.0);
    vec3 p = aRandomPos;
    // Simple wave effect
    vec3 auroraPos = p + vec3(0.0, sin(p.x * 0.1 + uTime * 0.5) * 5.0, sin(p.z * 0.2 + uTime * 0.2) * 4.0);
    vec3 finalPos = mix(auroraPos, aTargetPos, ease);
    
    // Mouse Interaction
    vec3 mouseWorld = vec3(uMouse.x * 40.0, uMouse.y * 20.0, 0.0); 
    float dist = distance(finalPos, mouseWorld);
    if (dist < 8.0) { 
      vec3 dir = normalize(finalPos - mouseWorld);
      finalPos += dir * ((8.0 - dist) / 8.0) * 2.0 * ease; 
    }
    
    vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = (aSize * 4.0) * (1.0 + ease * 0.5) * (20.0 / -mvPosition.z);
    vAlpha = 0.4 + ease * 0.6; vPos = finalPos;
  }
`;

const particleFragmentShader = `
  uniform vec3 uColorPrimary; uniform vec3 uColorAurora; uniform float uProgress;
  varying float vAlpha; varying vec3 vPos;
  void main() {
    vec2 center = gl_PointCoord - 0.5;
    if (length(center) > 0.5) discard;
    float glow = exp(-length(center) * 4.0);
    // Mix colors based on height
    float heightFactor = smoothstep(-10.0, 10.0, vPos.y);
    vec3 color = mix(mix(uColorAurora, uColorPrimary, heightFactor), vec3(1.0), uProgress * 0.2);
    gl_FragColor = vec4(color, vAlpha * glow);
  }
`;

// --- Helper Functions ---
const generateTextPoints = (text: string, count: number, factor: number) => {
  if (typeof document === 'undefined') return new Float32Array(count * 3);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return new Float32Array(count * 3);
  
  canvas.width = 1000; canvas.height = 500;
  ctx.fillStyle = 'black'; ctx.fillRect(0, 0, 1000, 500);
  ctx.fillStyle = 'white'; ctx.font = '900 150px "DIN Next LT Arabic", sans-serif'; 
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 500, 250);
  
  const data = ctx.getImageData(0, 0, 1000, 500).data;
  const validPixels = [];
  for (let y = 0; y < 500; y += 4) { 
    for (let x = 0; x < 1000; x += 4) {
      if (data[(y * 1000 + x) * 4] > 100) { 
        validPixels.push({ x: (x / 1000 - 0.5) * factor, y: -(y / 500 - 0.5) * 20 }); 
      }
    }
  }
  
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const pixel = validPixels[i % validPixels.length] || { x: 0, y: 0 };
    positions[i*3] = pixel.x; positions[i*3+1] = pixel.y; positions[i*3+2] = 0; 
  }
  return positions;
};

// --- Components ---

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navLinks = ['الرئيسية', 'خدماتنا', 'أعمالنا', 'عن أورا'];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          {/* Logo */}
          <div className="flex-center" style={{ gap: '0.8rem', cursor:'pointer' }}>
             <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{ width: '30px', height: '30px', border: '2px solid #4390b3', borderRadius: '8px', position:'relative' }}>
                <div style={{position:'absolute', inset:'3px', background:'rgba(67, 144, 179, 0.3)'}} />
             </motion.div>
             <span style={{ fontSize: '1.6rem', fontWeight: '800', letterSpacing: '-0.5px' }}>AURA</span>
          </div>
          
          {/* Desktop Menu */}
          <div className="desktop-only flex-center" style={{ gap: '3rem' }}>
             {navLinks.map((link, i) => <a key={i} className="nav-link">{link}</a>)}
          </div>
          
          {/* Actions */}
          <div className="flex-center" style={{ gap: '1rem' }}>
            <button className="nav-btn desktop-only">ابدأ مشروعك</button>
            <button className="mobile-only" style={{background:'none', border:'none', color:'white', cursor:'pointer'}} onClick={() => setMobileMenuOpen(true)}>
                <Menu size={28} />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div className="mobile-menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button style={{position:'absolute', top:'2rem', left:'2rem', background:'none', border:'none', color:'white', cursor:'pointer'}} onClick={() => setMobileMenuOpen(false)}>
                <X size={32} />
            </button>
            {navLinks.map((link, i) => (
              <motion.a key={i} className="mobile-link" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} onClick={() => setMobileMenuOpen(false)}>
                {link}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const HeroScene = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useLayoutEffect(() => {
        if (!canvasRef.current) return;
        let w = window.innerWidth, h = window.innerHeight;
        const isMobile = w < 768;
        
        const scene = new THREE.Scene(); 
        scene.fog = new THREE.FogExp2(0x050607, 0.02);
        const camera = new THREE.PerspectiveCamera(45, w/h, 0.1, 1000);
        camera.position.set(0, 0, isMobile ? 60 : 40);
        
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: !isMobile });
        renderer.setSize(w, h); 
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Create Particles
        const count = isMobile ? 4000 : 12000;
        const geometry = new THREE.BufferGeometry();
        const pos = new Float32Array(count * 3);
        const rand = new Float32Array(count * 3);
        const size = new Float32Array(count);
        const target = generateTextPoints("AURA", count, isMobile ? 25 : 45);
        
        for(let i=0; i<count; i++) {
            rand[i*3] = (Math.random()-0.5)*70; 
            rand[i*3+1] = (Math.random()-0.5)*30; 
            rand[i*3+2] = (Math.random()-0.5)*20;
            size[i] = Math.random()*2.0 + 0.5;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geometry.setAttribute('aRandomPos', new THREE.BufferAttribute(rand, 3));
        geometry.setAttribute('aTargetPos', new THREE.BufferAttribute(target, 3));
        geometry.setAttribute('aSize', new THREE.BufferAttribute(size, 1));

        const mat = new THREE.ShaderMaterial({
            vertexShader: particleVertexShader,
            fragmentShader: particleFragmentShader,
            uniforms: {
                uTime: {value:0}, uProgress: {value:0}, uMouse: {value: new THREE.Vector2(999,999)},
                uColorPrimary: {value: new THREE.Color('#4390b3')}, uColorAurora: {value: new THREE.Color('#0047AB')}
            },
            transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
        });
        
        const points = new THREE.Points(geometry, mat);
        scene.add(points);

        // GSAP Animation
        const tl = gsap.timeline({ scrollTrigger: { trigger: ".hero-wrapper", start: "top top", end: "+=300%", scrub: 1, pin: true } });
        tl.to(mat.uniforms.uProgress, { value: 1, duration: 5 });
        tl.to(camera.position, { z: isMobile ? 80 : 60, duration: 5 }, 0);
        tl.to(".hero-text-initial", { opacity: 0, scale: 0.9, duration: 1 }, 0);
        tl.fromTo(".hero-text-final", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 2 }, 1);

        // Animation Loop
        const clock = new THREE.Clock(); 
        const mouse = new THREE.Vector2(0,0);
        const onMove = (e: MouseEvent) => { mouse.x = (e.clientX/w)*2-1; mouse.y = -(e.clientY/h)*2+1; };
        window.addEventListener('mousemove', onMove);
        
        let req: number;
        const animate = () => {
            mat.uniforms.uTime.value = clock.getElapsedTime(); 
            mat.uniforms.uMouse.value.lerp(mouse, 0.05);
            renderer.render(scene, camera); 
            req = requestAnimationFrame(animate);
        };
        animate();
        
        // Cleanup
        return () => { 
            window.removeEventListener('mousemove', onMove); 
            cancelAnimationFrame(req); 
            renderer.dispose();
            if (tl.scrollTrigger) tl.scrollTrigger.kill();
            tl.kill();
        };
    }, []);

    return (
        <div className="hero-wrapper">
            <canvas ref={canvasRef} className="absolute-fill" style={{zIndex:1}}/>
            
            <div className="absolute-fill flex-center" style={{zIndex:10, pointerEvents:'none'}}>
                {/* Initial Text */}
                <div className="hero-text-initial" style={{textAlign:'center', padding:'0 1rem'}}>
                    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:1 }}>
                        <div style={{display:'inline-block', padding:'0.5rem 1rem', background:'rgba(255,255,255,0.05)', borderRadius:'99px', border:'1px solid rgba(255,255,255,0.1)', marginBottom:'1.5rem'}}>
                            ✨ وكالة إبداعية رقمية
                        </div>
                    </motion.div>
                    <h1 style={{textShadow:'0 0 40px rgba(0,0,0,1)'}}>من شتات <span className="text-gradient">الفضاء</span></h1>
                    <p style={{marginTop:'1.5rem'}}>نشكل هالتك الفارقة ونبني حضوراً لا ينسى</p>
                </div>
                
                {/* Scroll Reveal Text */}
                <div className="hero-text-final" style={{position:'absolute', opacity:0, textAlign:'center', width:'100%', padding:'0 1rem'}}>
                    <Globe size={40} color="#4390b3" style={{marginBottom:'1rem'}} />
                    <h2>نصنع مستقبلك <span style={{color:'#4390b3'}}>الرقمي</span></h2>
                    <p>نحول الأفكار المعقدة إلى تجارب رقمية سلسة ومؤثرة.</p>
                </div>
            </div>
            
            <div className="scroll-indicator desktop-only">
                <ChevronDown size={24} />
            </div>
        </div>
    );
};

const ServicesSection = () => {
    const services = [
        { title: "بناء العلامة", icon: Palette, desc: "هوية بصرية تخلد في الأذهان." },
        { title: "التسويق الرقمي", icon: Megaphone, desc: "نصل بصوتك للجمهور الصحيح." },
        { title: "تطوير الويب", icon: Globe, desc: "مواقع فائقة السرعة والتفاعل." },
        { title: "صناعة المحتوى", icon: PenTool, desc: "قصص تروى وتأثير يبقى." },
        { title: "تحسين المحركات", icon: Search, desc: "تصدر النتائج الأولى." },
        { title: "التجارة الإلكترونية", icon: ShoppingBag, desc: "متاجر تبيع 24/7." }
    ];
    return (
        <section className="container" style={{paddingTop:'8rem', paddingBottom:'8rem'}}>
            <div style={{textAlign:'center', marginBottom:'4rem'}}>
                <h2 style={{marginBottom:'1rem'}}>خدمات <span className="text-gradient">متكاملة</span></h2>
                <p>كل ما تحتاجه للنمو في العالم الرقمي تحت سقف واحد.</p>
            </div>
            <div className="bento-grid">
                {services.map((s, i) => (
                    <motion.div key={i} className={`bento-card ${i===0||i===3 ? 'col-span-2' : ''}`} whileHover={{ y: -5 }}>
                        <s.icon size={80} color={i===0||i===3 ? "#4390b3" : "#fff"} className="bento-icon-bg" />
                        <div style={{marginBottom:'1rem'}}>
                            <div style={{width:'50px', height:'50px', background:'rgba(255,255,255,0.05)', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1rem'}}>
                                <s.icon size={24} color={i===0||i===3 ? "#4390b3" : "#fff"} />
                            </div>
                            <h3>{s.title}</h3>
                        </div>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
                            <p style={{fontSize:'0.9rem', maxWidth:'80%'}}>{s.desc}</p>
                            <ArrowUpRight size={18} />
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

const WorksSection = () => {
    const container = useRef(null); const track = useRef(null);
    useLayoutEffect(() => {
        if(window.innerWidth < 768) return;
        const ctx = gsap.context(() => {
            const el = track.current as any;
            if(el) {
                gsap.to(el, {
                    x: () => el.scrollWidth - window.innerWidth,
                    ease: "none",
                    scrollTrigger: { trigger: container.current, pin: true, scrub: 1, end: "+=300%" }
                });
            }
        }, container);
        return () => ctx.revert();
    }, []);
    
    const works = [
        {title:"العلا", img:"https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?q=80&w=1000", cat:"سياحة"},
        {title:"نيوم", img:"https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=1000", cat:"تطوير عقاري"},
        {title:"مسك", img:"https://images.unsplash.com/photo-1596707328659-56540c490a6c?q=80&w=1000", cat:"مبادرة"},
        {title:"جدة", img:"https://images.unsplash.com/photo-1558231294-8777990176dc?q=80&w=1000", cat:"فعاليات"}
    ];

    return (
        <div ref={container} className="works-section">
            <div className="works-sticky">
                <div style={{position:'absolute', top:'10%', right:'5%', zIndex:20}}><h2>أحدث <span className="text-gradient">الأعمال</span></h2></div>
                <div ref={track} className="works-track">
                    {works.map((w, i) => (
                        <div key={i} className="work-card">
                            <img src={w.img} alt={w.title} className="work-img" />
                            <div style={{position:'absolute', bottom:0, right:0, width:'100%', padding:'2rem', background:'linear-gradient(to top, #050607, transparent)'}}>
                                <span style={{fontSize:'0.9rem', color:'#4390b3', fontWeight:'bold'}}>{w.cat}</span>
                                <h3>{w.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const FAQ = () => {
    const [open, setOpen] = useState<number | null>(0);
    const faqs = [
        {q:"كم يستغرق تنفيذ المشروع؟", a:"يعتمد على حجم المشروع، لكن المواقع التعريفية تستغرق عادة 2-4 أسابيع."},
        {q:"هل تقدمون دعم فني؟", a:"نعم، نقدم باقات صيانة ودعم فني لضمان استقرار موقعك 24/7."},
        {q:"كيف نبدأ؟", a:"تواصل معنا عبر الزر في الأسفل لتحديد جلسة استشارية مجانية."}
    ];
    return (
        <section className="container" style={{padding:'6rem 1.5rem', maxWidth:'800px'}}>
            <h2 style={{textAlign:'center', marginBottom:'3rem'}}>الأسئلة الشائعة</h2>
            {faqs.map((f, i) => (
                <div key={i} style={{borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
                    <button onClick={() => setOpen(open===i ? null : i)} style={{width:'100%', padding:'2rem 1rem', display:'flex', justifyContent:'space-between', background:'none', border:'none', color:'white', cursor:'pointer'}}>
                        <span style={{fontSize:'1.1rem', fontWeight:'600'}}>{f.q}</span>
                        <Plus style={{transform: open===i ? 'rotate(45deg)' : 'none', transition:'0.3s', color:'#4390b3'}} />
                    </button>
                    <AnimatePresence>
                        {open===i && (
                            <motion.div initial={{height:0}} animate={{height:'auto'}} exit={{height:0}} style={{overflow:'hidden'}}>
                                <p style={{padding:'0 1rem 2rem 1rem', color:'#94a3b8'}}>{f.a}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </section>
    );
};

const CustomCursor = () => {
    const mouseX = useMotionValue(-100); const mouseY = useMotionValue(-100);
    useEffect(() => {
        if (typeof window === 'undefined' || window.matchMedia("(pointer: coarse)").matches) return;
        const move = (e: MouseEvent) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
        window.addEventListener('mousemove', move); return () => window.removeEventListener('mousemove', move);
    }, []);
    return <motion.div className="custom-cursor" style={{ x: mouseX, y: mouseY }} />;
};

export default function AuraWebsite() {
    return (
        <div className="main-wrapper">
            <style dangerouslySetInnerHTML={{ __html: styles }} />
            <CustomCursor />
            <Navbar />
            <main>
                <HeroScene />
                <ServicesSection />
                <WorksSection />
                <FAQ />
            </main>
            <footer>
                <div className="container" style={{textAlign:'center'}}>
                    <h2 style={{fontSize:'3rem', marginBottom:'2rem'}}>جاهز لصناعة <span className="text-gradient">الفرق؟</span></h2>
                    <button className="nav-btn" style={{padding:'1rem 3rem', background:'white', color:'black', borderColor:'white'}}>تواصل معنا الآن</button>
                    <div style={{marginTop:'4rem', color:'#666'}}>© 2026 AURA.</div>
                </div>
            </footer>
        </div>
    );
}
