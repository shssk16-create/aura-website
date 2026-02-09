import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Menu, ArrowDown, Zap, Target, BarChart3, Fingerprint, Sparkles, Gem, Users, Layers, Lightbulb, Rocket, Plus } from 'lucide-react';

// --- مساعد تحميل المكتبات ---
const useScript = (url) => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.onload = () => setLoaded(true);
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, [url]);
  return loaded;
};

// ==========================================
// Advanced Physics Shaders (Curl Noise)
// ==========================================
const particleVertexShader = `
  uniform float uTime;
  uniform float uProgress; 
  
  attribute vec3 aRandomPos;
  attribute vec3 aTargetPos;
  attribute float aSize;
  
  varying float vAlpha;
  varying vec3 vPos;

  vec3 snoiseVec3( vec3 x ){
    float s  = sin(x.x); float c  = cos(x.x);
    float s1 = sin(x.y); float c1 = cos(x.y);
    float s2 = sin(x.z); float c2 = cos(x.z);
    return vec3(c*s1 + s*c2, s*c1 + c*s2, c*s2 + s*c1);
  }

  vec3 curlNoise( vec3 p ){
    const float e = 0.1;
    vec3 dx = vec3( e, 0.0, 0.0 );
    vec3 dy = vec3( 0.0, e, 0.0 );
    vec3 dz = vec3( 0.0, 0.0, e );
    vec3 p_x0 = snoiseVec3( p - dx );
    vec3 p_x1 = snoiseVec3( p + dx );
    vec3 p_y0 = snoiseVec3( p - dy );
    vec3 p_y1 = snoiseVec3( p + dy );
    vec3 p_z0 = snoiseVec3( p - dz );
    vec3 p_z1 = snoiseVec3( p + dz );
    float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
    float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
    float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;
    const float divisor = 1.0 / ( 2.0 * e );
    return normalize( vec3( x , y , z ) * divisor );
  }

  void main() {
    float t = uProgress;
    float ease = 1.0 - pow(1.0 - t, 3.0); 
    vec3 target = mix(aRandomPos, aTargetPos, ease);
    float noiseStrength = (1.0 - ease) * 2.0 + 0.2; 
    vec3 curl = curlNoise(target * 0.5 + uTime * 0.1);
    vec3 finalPos = target + curl * noiseStrength;
    float angle = uTime * 0.1 * (1.0 - ease);
    float s = sin(angle);
    float c = cos(angle);
    float nx = finalPos.x * c - finalPos.z * s;
    float nz = finalPos.x * s + finalPos.z * c;
    finalPos.x = nx;
    finalPos.z = nz;
    vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = (aSize * 2.5) * (1.0 + ease) * (20.0 / -mvPosition.z);
    vAlpha = 0.4 + ease * 0.6;
    vPos = finalPos;
  }
`;

const particleFragmentShader = `
  uniform vec3 uColorPrimary; 
  uniform vec3 uColorSecondary; 
  varying float vAlpha;
  varying vec3 vPos;
  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    float glow = exp(-d * 4.0); 
    if (glow < 0.05) discard;
    float mixFactor = smoothstep(0.0, 5.0, length(vPos));
    vec3 finalColor = mix(uColorSecondary, uColorPrimary, mixFactor * 0.5);
    if (d < 0.1) finalColor = mix(finalColor, vec3(1.0), 0.8);
    gl_FragColor = vec4(finalColor, vAlpha * glow);
  }
`;

// --- النافبار ---
const Navbar = () => (
  <nav className="fixed top-6 left-0 right-0 z-[100] flex justify-center px-4">
    <div className="water-nav flex items-center px-6 py-3 gap-6 md:gap-12 transition-all duration-500">
      <div className="flex items-center gap-2 pr-2 border-l border-slate-300/50 ml-2">
        <div className="w-2.5 h-2.5 bg-[#4390b3] rounded-full shadow-[0_0_15px_rgba(67,144,179,0.8)] animate-pulse"></div>
        <span className="font-din font-bold text-sm text-slate-800 tracking-tighter">أورا</span>
      </div>
      <div className="hidden md:flex items-center gap-8">
        {['الرئيسية', 'خدماتنا', 'أعمالنا', 'شركاء النجاح'].map((item) => (
          <a key={item} href={`#${item}`} className="text-xs font-bold text-slate-500 hover:text-[#4390b3] transition-colors relative group font-din">
            {item}
            <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-[#4390b3] transition-all duration-300 group-hover:w-full"></span>
          </a>
        ))}
      </div>
      <button className="md:hidden p-1 text-slate-600"><Menu size={18} /></button>
    </div>
  </nav>
);

// --- قسم الأعمال (Portfolio Section) ---
const PortfolioSection = () => {
  const projects = [
    { title: "مشروع النخبة", category: "تطوير عقاري", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80" },
    { title: "تطبيق مدى", category: "تكنولوجيا مالية", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" },
    { title: "منصة تعلم", category: "تعليم إلكتروني", img: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&q=80" },
    { title: "هوية بصرية", category: "تصميم وإبداع", img: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=800&q=80" },
  ];

  return (
    <div id="أعمالنا" className="relative py-32 px-4 bg-slate-50 z-20 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-[#2d2d2d] font-din mb-6 portfolio-title opacity-0 translate-y-10">
            أحدث <span className="text-[#4390b3]">إبداعاتنا</span>
          </h2>
          <p className="text-lg text-slate-500 font-din max-w-2xl mx-auto portfolio-desc opacity-0 translate-y-10">
            نحول الأفكار إلى مشاريع رقمية استثنائية تترك أثراً.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {projects.map((project, index) => (
            <div 
              key={index} 
              className={`portfolio-card group relative rounded-[2rem] overflow-hidden shadow-lg cursor-pointer transform transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl opacity-0 translate-y-20 ${index % 2 !== 0 ? 'md:translate-y-16' : ''}`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 transition-opacity duration-500 group-hover:opacity-90"></div>
              <img 
                src={project.img} 
                alt={project.title} 
                className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute bottom-0 right-0 p-8 z-20 w-full transform translate-y-4 transition-transform duration-500 group-hover:translate-y-0">
                <span className="inline-block px-3 py-1 mb-3 text-xs font-bold text-white bg-[#4390b3] rounded-full font-din opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {project.category}
                </span>
                <h3 className="text-2xl font-bold text-white font-din mb-2">{project.title}</h3>
                <div className="h-0.5 w-0 bg-[#4390b3] transition-all duration-500 group-hover:w-20"></div>
              </div>
              <div className="absolute top-6 left-6 z-20 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 opacity-0 -translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 delay-200">
                <ArrowDown className="transform -rotate-135" size={20} />
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-24">
           <button className="px-10 py-4 bg-white text-[#2d2d2d] font-bold rounded-full border border-slate-200 shadow-md hover:shadow-xl hover:border-[#4390b3] hover:text-[#4390b3] transition-all duration-300 font-din portfolio-btn opacity-0 translate-y-10">
             عرض جميع المشاريع
           </button>
        </div>
      </div>
    </div>
  );
};

// --- المشهد التفاعلي (Scrollytelling) ---
const AuraScene = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const auraGlowRef = useRef(null);
  
  const threeLoaded = useScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');
  const gsapLoaded = useScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js');
  const scrollTriggerLoaded = useScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js');

  useLayoutEffect(() => {
    if (!threeLoaded || !gsapLoaded || !scrollTriggerLoaded || !canvasRef.current) return;

    const THREE = window.THREE;
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 12;
    
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const count = 5000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const aRandomPos = new Float32Array(count * 3);
    const aTargetPos = new Float32Array(count * 3);
    const aSize = new Float32Array(count);

    const targetGeom = new THREE.OctahedronGeometry(2.2, 1);
    const targetVerts = targetGeom.attributes.position.array;
    const tCount = targetVerts.length / 3;

    for (let i = 0; i < count; i++) {
      aRandomPos[i * 3] = (Math.random() - 0.5) * 40;
      aRandomPos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      aRandomPos[i * 3 + 2] = (Math.random() - 0.5) * 20;

      const idx = i % tCount;
      const jitter = 0.5 + Math.random() * 0.5;
      aTargetPos[i * 3] = targetVerts[idx * 3] * jitter;
      aTargetPos[i * 3 + 1] = targetVerts[idx * 3 + 1] * jitter;
      aTargetPos[i * 3 + 2] = targetVerts[idx * 3 + 2] * jitter;

      aSize[i] = Math.random() * 2.0 + 0.5;
      positions[i * 3] = 0; positions[i * 3 + 1] = 0; positions[i * 3 + 2] = 0;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aRandomPos', new THREE.BufferAttribute(aRandomPos, 3));
    geometry.setAttribute('aTargetPos', new THREE.BufferAttribute(aTargetPos, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(aSize, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uColorPrimary: { value: new THREE.Color('#4390b3') },
        uColorSecondary: { value: new THREE.Color('#5fc2d0') }
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    let isVisible = true;
    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
    }, { threshold: 0.1 });
    observer.observe(canvasRef.current);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=600%", // مسافة السكرول
          scrub: 1.5,
          pin: true,
          anticipatePin: 1
        }
      });

      gsap.to(auraGlowRef.current, {
        scale: 1.2,
        opacity: 0.8,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // المشهد 1: الهيرو (تجمع الذرات)
      tl.to(material.uniforms.uProgress, { value: 1, duration: 3, ease: "power2.inOut" }, "start");
      tl.to(".text-1", { opacity: 0, y: -50, filter: 'blur(10px)', duration: 1 }, "start");
      
      // المشهد 2: ظهور العنوان "هالتك الفارقة"
      tl.fromTo(".text-2", { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1 }, "start+=1.5");
      
      // المشهد 3: الانتقال للنص الثالث "نضع نجمتك"
      tl.to(".text-2", { opacity: 0, scale: 1.1, duration: 1 }, "scene3");
      tl.fromTo(".text-3", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.5 }, "scene3+=0.5");

      // المشهد 4: الانتقال المباشر لقسم "لماذا أورا" مع تأثير الدخول المتسلسل
      
      // أ. إخفاء العناصر السابقة
      tl.to(".text-3", { opacity: 0, scale: 0.9, duration: 0.5 }, "scene4");
      tl.to(canvasRef.current, { opacity: 0, duration: 1 }, "scene4");
      
      // ب. ظهور حاوية "لماذا أورا" (الخلفية البيضاء)
      tl.fromTo(".why-aura-fullscreen", 
        { y: "-30%", opacity: 0 }, 
        { y: "0%", opacity: 1, duration: 2, ease: "power2.out" }, 
        "scene4+=0.2"
      );

      // ج. ظهور العناصر الداخلية بترتيب (Title -> Text -> Message -> Cards)
      tl.fromTo(".why-tag", 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.2)" }, 
        "-=1.2"
      );
      
      tl.fromTo(".why-title", 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, 
        "-=0.6"
      );
      
      tl.fromTo(".why-text", 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, 
        "-=0.6"
      );
      
      tl.fromTo(".why-message", 
        { x: -30, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, 
        "-=0.6"
      );
      
      // تحريك الكروت بتتابع (Stagger)
      tl.fromTo(".why-card", 
        { x: 50, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out" }, 
        "-=0.8"
      );

      // ============================================
      // ScrollTrigger for Portfolio Section
      // ============================================
      const portfolioTl = gsap.timeline({
        scrollTrigger: {
          trigger: "#أعمالنا", // ID of the portfolio section
          start: "top 80%", // Start when top of section hits 80% of viewport
          end: "bottom bottom",
          toggleActions: "play none none reverse"
        }
      });

      portfolioTl
        .to(".portfolio-title", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
        .to(".portfolio-desc", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
        .to(".portfolio-card", { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          stagger: 0.2, // Stagger effect for cards
          ease: "power3.out" 
        }, "-=0.4")
        .to(".portfolio-btn", { opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.7)" }, "-=0.2");

    }, containerRef);

    const clock = new THREE.Clock();
    const animate = () => {
      if (isVisible) {
        const time = clock.getElapsedTime();
        material.uniforms.uTime.value = time;
        particles.rotation.y = time * 0.05;
        renderer.render(scene, camera);
      }
      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      ctx.revert();
      renderer.dispose();
    };
  }, [threeLoaded, gsapLoaded, scrollTriggerLoaded]);

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-[#F8F8F8]">
      
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div ref={auraGlowRef} className="w-[70vw] h-[70vw] rounded-full bg-gradient-to-tr from-[#4390b3]/15 via-[#5fc2d0]/10 to-transparent blur-[100px] opacity-60"></div>
        <div className="absolute inset-0 bg-radial-gradient-vignette opacity-30"></div>
      </div>

      <canvas ref={canvasRef} className="absolute inset-0 z-1 w-full h-full transition-opacity duration-1000" />
      
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center px-4 pointer-events-none">
        
        <div className="text-1 absolute transition-opacity duration-500">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#4390b3]/20 bg-white/70 backdrop-blur-md text-[#4390b3] font-bold text-xs mb-6 shadow-sm">
            <Sparkles size={14} className="text-[#57a8b4]" />
            <span>نصنع جوهرك الرقمي</span>
          </div>
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-bold text-[#2d2d2d] leading-[1.0] font-din">
            أثرٌ لا <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#57a8b4] to-[#5fc2d0]">يُمحى</span>
          </h1>
          <p className="mt-6 text-xl text-slate-500 font-medium font-din">حرك الماوس وانظر كيف تتشكل الرؤية</p>
        </div>

        <div className="text-2 absolute opacity-0 w-full max-w-4xl px-4">
          <h2 className="text-4xl md:text-7xl font-bold text-[#2d2d2d] font-din mb-6 leading-tight">
            هالتك <span className="text-[#4390b3]">الفارقة</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 font-din bg-white/60 backdrop-blur-sm p-4 rounded-2xl inline-block shadow-sm">
            حيث يلتقي الإبداع بالاستراتيجية ليصنع نجماً ساطعاً في السوق.
          </p>
        </div>

        <div className="text-3 absolute opacity-0 w-full max-w-4xl px-4">
          <h2 className="text-3xl md:text-6xl font-bold text-[#2d2d2d] font-din mb-6">
            نضع نجمتك في<br/><span className="text-[#57a8b4]">سماء من يُقدرها</span>
          </h2>
        </div>

        {/* قسم لماذا أورا - Fullscreen Overlay - مرتب العناصر */}
        <div className="why-aura-fullscreen absolute inset-0 z-40 bg-white -translate-y-full opacity-0 pointer-events-auto overflow-y-auto no-scrollbar">
          <div className="min-h-full w-full max-w-7xl mx-auto px-4 py-8 md:py-16 flex flex-col justify-center">
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center">
              
              {/* المحتوى النصي */}
              <div className="text-right order-1 lg:order-none">
                <div className="why-tag inline-flex items-center gap-3 mb-6 bg-[#4390b3]/5 px-5 py-2 rounded-full border border-[#4390b3]/10 opacity-0">
                  <Sparkles size={18} className="text-[#4390b3]" />
                  <span className="text-[#4390b3] font-bold text-sm font-din tracking-wide uppercase">لماذا تختار أورا؟</span>
                </div>
                
                <h2 className="why-title text-3xl md:text-5xl lg:text-6xl font-bold text-[#2d2d2d] font-din mb-8 leading-[1.2] opacity-0">
                  بريق مبتكر في <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#4390b3] to-[#5fc2d0]">عالم التسويق</span>
                </h2>

                <p className="why-text text-base md:text-lg lg:text-xl text-slate-600 font-din leading-relaxed mb-10 pl-4 md:pl-8 border-r-4 border-[#5fc2d0]/30 pr-6 text-justify opacity-0">
                  تسعى أورا لتكون الهالة الفارقة التي تميز مشروعك. منذ انطلاقنا، عملنا بجد وفق خطط مدروسة لنطور مفهوم صناعة الدعاية والإعلان والتسويق الرقمي في الشرق الأوسط. نحن نؤمن بكل فكرة تسعى للتألق، ونحولها من مجرد خاطرة إلى واقع ملموس ويسمع ويرى.
                </p>

                <div className="why-message bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-6 transform hover:-translate-y-1 transition-transform duration-300 opacity-0">
                   <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#4390b3] to-[#5fc2d0] flex items-center justify-center text-white shadow-lg shrink-0">
                     <Gem size={28} />
                   </div>
                   <div>
                     <h4 className="font-bold text-[#4390b3] mb-1 font-din text-lg">رسالتنا</h4>
                     <p className="text-slate-600 font-din text-base md:text-lg">
                       أن نكون أقرب لعملائك، لتظهر وتصل وتحقق ما يناسب طموحك.
                     </p>
                   </div>
                </div>
              </div>

              {/* الكروت */}
              <div className="why-cards flex flex-col gap-4 md:gap-6 order-2 lg:order-none">
                 <div className="why-card bg-white p-6 md:p-8 rounded-[2rem] shadow-lg border border-slate-100 relative overflow-hidden group hover:border-[#4390b3]/30 transition-all duration-300 opacity-0">
                    <div className="absolute inset-0 bg-pattern-lines opacity-[0.05] pointer-events-none"></div>
                    <div className="relative z-10 flex items-start gap-4 md:gap-6">
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[#eaf6fa] flex items-center justify-center text-[#4390b3] group-hover:scale-110 transition-transform duration-300 shrink-0">
                         <Lightbulb size={28} />
                      </div>
                      <div>
                          <h4 className="font-bold text-xl md:text-2xl text-[#2d2d2d] font-din mb-2">إبداع لا محدود</h4>
                          <p className="text-slate-500 font-din text-base md:text-lg">نبتكر حلولاً إعلانية تكسر النمطية وتلامس احتياج جمهورك بدقة.</p>
                      </div>
                    </div>
                 </div>

                 <div className="why-card bg-white p-6 md:p-8 rounded-[2rem] shadow-lg border border-slate-100 relative overflow-hidden group hover:border-[#5fc2d0]/30 transition-all duration-300 lg:translate-x-8 opacity-0">
                    <div className="absolute inset-0 bg-pattern-lines opacity-[0.05] pointer-events-none"></div>
                    <div className="relative z-10 flex items-start gap-4 md:gap-6">
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[#f0fcfd] flex items-center justify-center text-[#5fc2d0] group-hover:scale-110 transition-transform duration-300 shrink-0">
                         <Target size={28} />
                      </div>
                      <div>
                          <h4 className="font-bold text-xl md:text-2xl text-[#2d2d2d] font-din mb-2">خطط مدروسة</h4>
                          <p className="text-slate-500 font-din text-base md:text-lg">لا نترك شيئاً للصدفة، كل خطوة مبنية على بيانات وتحليلات دقيقة.</p>
                      </div>
                    </div>
                 </div>

                 <div className="why-card bg-white p-6 md:p-8 rounded-[2rem] shadow-lg border border-slate-100 relative overflow-hidden group hover:border-[#57a8b4]/30 transition-all duration-300 opacity-0">
                    <div className="absolute inset-0 bg-pattern-lines opacity-[0.05] pointer-events-none"></div>
                    <div className="relative z-10 flex items-start gap-4 md:gap-6">
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[#f2f9fa] flex items-center justify-center text-[#57a8b4] group-hover:scale-110 transition-transform duration-300 shrink-0">
                         <Rocket size={28} />
                      </div>
                      <div>
                          <h4 className="font-bold text-xl md:text-2xl text-[#2d2d2d] font-din mb-2">واقع ملموس</h4>
                          <p className="text-slate-500 font-din text-base md:text-lg">نحول الأفكار المجردة إلى نتائج وأرقام يمكنك رؤيتها وقياس أثرها.</p>
                      </div>
                    </div>
                 </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- قسم الخدمات ---
const ServicesSection = () => {
  const services = [
    { t: "استراتيجيات التسويق", i: <Target />, c: "#4390b3" },
    { t: "الهوية البصرية", i: <Fingerprint />, c: "#57a8b4" },
    { t: "إدارة الحملات", i: <Zap />, c: "#4390b3" },
    { t: "الإنتاج الإبداعي", i: <Layers />, c: "#57a8b4" }
  ];

  return (
    <div className="relative py-32 px-4 bg-white z-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-[#2d2d2d] font-din mb-6">
            منهجية <span className="text-[#4390b3]">التأثير</span>
          </h2>
          <p className="text-lg text-slate-500 font-din max-w-2xl mx-auto">
            نحول الرؤية إلى واقع ملموس عبر خطوات مدروسة بدقة.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((s, i) => (
            <div key={i} className="group p-8 rounded-[2rem] bg-[#F8F8F8] hover:bg-white border border-transparent hover:border-[#4390b3]/20 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 cursor-pointer relative overflow-hidden">
              <div className="absolute inset-0 bg-pattern-lines opacity-[0.05] pointer-events-none"></div>
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 text-2xl shadow-lg transition-transform duration-500 group-hover:scale-110 relative z-10"
                style={{ backgroundColor: s.c }}
              >
                {s.i}
              </div>
              <h3 className="text-xl font-bold text-[#2d2d2d] mb-3 font-din relative z-10">{s.t}</h3>
              <p className="text-sm text-slate-500 font-din relative z-10">نبتكر حلولاً مخصصة تضمن وصول رسالتك بوضوح.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- التطبيق الرئيسي ---
export default function App() {
  return (
    <div className="text-[#2d2d2d] bg-[#F8F8F8] overflow-x-hidden" dir="rtl">
      <style>{`
        @font-face {
          font-family: 'DINNextLTArabic';
          src: url('https://aurateam3.com/wp-content/uploads/2025/10/DINNextLTArabic-Regular.woff2') format('woff2');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'DINNextLTArabic';
          src: url('https://aurateam3.com/wp-content/uploads/2025/10/DINNextLTArabic-Bold-2.woff2') format('woff2');
          font-weight: bold;
          font-style: normal;
          font-display: swap;
        }
        
        body { font-family: 'DINNextLTArabic', sans-serif; margin: 0; }
        .font-din { font-family: 'DINNextLTArabic', sans-serif !important; }
        
        .bg-radial-gradient-vignette {
          background: radial-gradient(circle, transparent 60%, rgba(0,0,0,0.03) 100%);
        }

        /* نقش خطي هندسي للكروت */
        .bg-pattern-lines {
          background-image: repeating-linear-gradient(
            45deg,
            #4390b3 0,
            #4390b3 1px,
            transparent 0,
            transparent 50%
          );
          background-size: 10px 10px;
        }

        .water-nav { 
          background: rgba(255, 255, 255, 0.6); 
          backdrop-filter: blur(20px) saturate(180%); 
          border: 1px solid rgba(255, 255, 255, 0.8); 
          box-shadow: 0 4px 30px rgba(0,0,0,0.03);
          border-radius: 40px; 
        }
        
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #F8F8F8; }
        ::-webkit-scrollbar-thumb { background: #4390b3; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #2d6a84; }

        /* إخفاء شريط التمرير لقسم لماذا أورا */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
      
      <Navbar />
      <AuraScene />
      <PortfolioSection />
      <ServicesSection />
      
      <div className="h-24 bg-white flex items-center justify-center border-t border-slate-100">
        <p className="text-xs text-slate-400 font-din">© 2026 Aura Agency. All Rights Reserved.</p>
      </div>
    </div>
  );
}
