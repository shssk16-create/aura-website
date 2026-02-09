'use client';

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Readex_Pro } from 'next/font/google';
import { 
  ArrowUpRight, Palette, Search, Megaphone, Code, 
  Target, Layers, Zap, Menu, X, ArrowRight,
  Globe, Sparkles, Phone, MapPin, Send, MousePointer2
} from 'lucide-react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// --- إعداد الخط ---
const fontMain = Readex_Pro({ 
  subsets: ['arabic', 'latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
  display: 'swap',
});

// --- تسجيل GSAP ---
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// =========================================
// 1. الماوس المغناطيسي (Custom Cursor)
// =========================================
const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.2,
          ease: 'power2.out'
        });
      }
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <div 
      ref={cursorRef} 
      className="fixed top-0 left-0 w-8 h-8 border border-slate-800 rounded-full pointer-events-none z-[9999] hidden md:flex -translate-x-1/2 -translate-y-1/2 mix-blend-difference bg-white/20 backdrop-blur-sm"
    />
  );
};

// =========================================
// 2. خلفية الهالة (3D Nebula)
// =========================================
const KineticNebula = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // إعداد المشهد
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xffffff, 0.002);
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // الجسيمات
    const count = 3000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color1 = new THREE.Color('#438FB3'); // لون الهوية
    const color2 = new THREE.Color('#58A8B4'); // التيل

    for(let i=0; i<count; i++) {
      const r = 15 + Math.random() * 10;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i*3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i*3+2] = r * Math.cos(phi);
      
      const c = Math.random() > 0.5 ? color1 : color2;
      colors[i*3] = c.r; colors[i*3+1] = c.g; colors[i*3+2] = c.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({ size: 0.15, vertexColors: true, transparent: true, opacity: 0.8 });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // الحركة
    const animate = () => {
      requestAnimationFrame(animate);
      particles.rotation.y += 0.001;
      particles.rotation.x += 0.0005;
      renderer.render(scene, camera);
    };
    animate();

    // تفاعل GSAP مع التمرير
    const ctx = gsap.context(() => {
      gsap.to(particles.scale, {
        x: 3, y: 3, z: 3,
        scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 1.5 }
      });
    });

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
      ctx.revert();
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 -z-10 opacity-70 pointer-events-none" />;
};

// =========================================
// 3. النافبار (Tailwind Styled)
// =========================================
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl backdrop-blur-xl bg-white/70 border border-white/50 rounded-full z-50 px-8 py-4 flex justify-between items-center shadow-lg shadow-slate-200/50 transition-all hover:shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-[#438FB3] rounded-full animate-pulse"></div>
          <span className="text-xl font-bold tracking-tighter text-slate-900">AURA</span>
        </div>

        <div className="hidden md:flex gap-8">
          {['الرئيسية', 'خدماتنا', 'أعمالنا', 'تواصل'].map((item) => (
            <a key={item} href={`#${item}`} className="text-sm font-semibold text-slate-600 hover:text-[#438FB3] transition-colors relative group">
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#438FB3] transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        <button className="bg-[#0f172a] text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#438FB3] transition-colors hidden md:block shadow-lg shadow-slate-900/20">
          ابدأ مشروعك
        </button>

        <button className="md:hidden text-slate-800" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* قائمة الجوال */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-white/95 backdrop-blur-lg z-40 flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {['الرئيسية', 'خدماتنا', 'أعمالنا', 'تواصل'].map((item) => (
              <a key={item} href={`#${item}`} onClick={() => setIsOpen(false)} className="text-2xl font-bold text-slate-800">
                {item}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// =========================================
// 4. الأقسام الرئيسية
// =========================================

const Hero = () => (
  <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 relative pt-20">
    <motion.div 
      initial={{ opacity: 0, y: 50 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 1 }}
      className="max-w-4xl"
    >
      <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-slate-50 border border-slate-200 text-[#438FB3] font-bold text-sm mb-8 shadow-sm">
        <Sparkles size={16} /> شريك التحول الرقمي 2026
      </div>
      
      <h1 className="text-5xl md:text-8xl font-bold text-slate-900 mb-6 leading-[1.1] tracking-tight">
        هالتك <span className="bg-gradient-to-r from-[#438FB3] to-[#58A8B4] bg-clip-text text-transparent">الفارقة</span>
        <br /> في عالم التسويق
      </h1>
      
      <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
        نحن لا نصمم المواقع فحسب، بل نهندس تجربة رقمية متكاملة تدمج الذكاء الاصطناعي بالإبداع البشري لتضعك في المقدمة.
      </p>

      <div className="flex justify-center gap-4">
        <button className="bg-[#0f172a] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#438FB3] transition-all shadow-xl shadow-slate-900/20 flex items-center gap-2">
          اكتشف خدماتنا <ArrowRight size={20} />
        </button>
      </div>
    </motion.div>
  </section>
);

const Stats = () => (
  <div className="container mx-auto px-4 mb-32">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 bg-[#0f172a] rounded-[3rem] p-8 md:p-16 text-white shadow-2xl">
      {[
        { n: '+500M', t: 'أصول مدارة' },
        { n: '98%', t: 'نسبة رضا' },
        { n: '+120', t: 'شريك استراتيجي' },
        { n: 'Top 1%', t: 'أداء سوقي' }
      ].map((stat, i) => (
        <div key={i} className="text-center border-l border-white/10 last:border-0">
          <div className="text-4xl md:text-6xl font-bold text-[#438FB3] mb-2">{stat.n}</div>
          <div className="text-slate-400 font-medium">{stat.t}</div>
        </div>
      ))}
    </div>
  </div>
);

const Services = () => {
  const items = [
    { title: "التحول الرقمي", desc: "بناء منصات مؤسسية متكاملة.", icon: Layers, span: "md:col-span-2" },
    { title: "تسويق الأداء", desc: "إدارة حملات ROI مرتفع.", icon: Target, span: "" },
    { title: "تطوير WebGL", desc: "تجارب ثلاثية الأبعاد.", icon: Code, span: "" },
    { title: "استراتيجية AEO", desc: "تصدر نتائج البحث الذكي.", icon: Search, span: "md:col-span-2" },
  ];

  return (
    <section className="py-24 px-4 max-w-7xl mx-auto" id="خدماتنا">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">هندسة <span className="text-[#438FB3]">الحلول</span></h2>
        <p className="text-slate-500">خدمات مصممة لضمان نموك الأسي.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -10 }}
            className={`${item.span} bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-lg shadow-slate-100/50 hover:border-[#438FB3]/30 transition-all duration-300 group cursor-pointer relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#438FB3]/5 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
            <div className="w-14 h-14 bg-[#f0f9ff] rounded-2xl flex items-center justify-center text-[#438FB3] mb-6 relative z-10 group-hover:bg-[#438FB3] group-hover:text-white transition-colors">
              <item.icon size={28} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2 relative z-10">{item.title}</h3>
            <p className="text-slate-500 relative z-10">{item.desc}</p>
            <div className="absolute bottom-8 left-8 text-[#438FB3] opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const Contact = () => (
  <section className="py-24 px-4 bg-slate-50" id="تواصل">
    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
      <div>
        <div className="inline-block px-4 py-1 rounded-full bg-white border border-slate-200 text-[#438FB3] font-bold text-sm mb-6">
          تواصل معنا
        </div>
        <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">جاهز للبدء في <br/> <span className="text-[#438FB3]">رحلتك؟</span></h2>
        <p className="text-slate-500 text-lg mb-8">فريقنا مستعد لتحليل احتياجاتك وبناء استراتيجية مخصصة لعلامتك التجارية.</p>
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100">
            <div className="w-12 h-12 bg-[#f0f9ff] rounded-full flex items-center justify-center text-[#438FB3]"><Phone size={20}/></div>
            <div>
              <div className="text-sm text-slate-400">اتصل بنا</div>
              <div className="font-bold text-slate-900">+966 50 000 0000</div>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100">
            <div className="w-12 h-12 bg-[#f0f9ff] rounded-full flex items-center justify-center text-[#438FB3]"><MapPin size={20}/></div>
            <div>
              <div className="text-sm text-slate-400">الموقع</div>
              <div className="font-bold text-slate-900">الرياض، المملكة العربية السعودية</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">الاسم الكامل</label>
            <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:outline-none focus:border-[#438FB3] transition-colors" placeholder="محمد أحمد" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">البريد الإلكتروني</label>
            <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:outline-none focus:border-[#438FB3] transition-colors" placeholder="name@company.com" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">رسالتك</label>
            <textarea className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:outline-none focus:border-[#438FB3] transition-colors min-h-[120px]" placeholder="كيف يمكننا مساعدتك؟"></textarea>
          </div>
          <button className="bg-[#438FB3] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#2d6a84] transition-colors flex justify-center items-center gap-2 mt-2">
            إرسال الطلب <Send size={20}/>
          </button>
        </form>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-[#0f172a] text-white py-20 border-t border-white/10">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-4xl font-bold mb-4">AURA.</h2>
      <p className="text-slate-400 mb-8">نصنع المستقبل الرقمي برؤية سعودية.</p>
      <div className="flex justify-center gap-6 mb-8 text-sm font-medium text-slate-300">
        <a href="#" className="hover:text-[#438FB3] transition-colors">تويتر</a>
        <a href="#" className="hover:text-[#438FB3] transition-colors">لينكد إن</a>
        <a href="#" className="hover:text-[#438FB3] transition-colors">إنستقرام</a>
      </div>
      <div className="text-slate-500 text-xs border-t border-white/5 pt-8">
        © 2026 Aura Holding. جميع الحقوق محفوظة.
      </div>
    </div>
  </footer>
);

// =========================================
// 5. التطبيق الرئيسي
// =========================================
export default function AuraPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className={`${fontMain.className} bg-white text-slate-900 selection:bg-[#438FB3] selection:text-white overflow-x-hidden`} dir="rtl">
      {mounted && <CustomCursor />}
      <KineticNebula />
      
      <main className="relative z-10">
        <Navbar />
        <Hero />
        <Stats />
        <Services />
        <Contact />
        <Footer />
      </main>
    </div>
  );
}
