'use client';

import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowUpLeft, Hexagon, Layers, Zap, Search, ChevronDown, Menu } from 'lucide-react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// تسجيل إضافة ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ==========================================
// 1. نظام التصميم والثوابت (Design Tokens)
// ==========================================
const THEME = {
  colors: {
    platinum: '#B3B7C1', // القاعدة
    oceanBlue: '#438FB3', // العمق
    softTeal: '#58A8B4', // التوهج
    darkText: '#1A202C',
    lightText: '#F7FAFC',
  },
  fonts: {
    primary: "'Readex Pro', sans-serif", // بديل DIN الهندسي
  }
};

// ==========================================
// 2. محرك الهالة (Three.js Aura Engine)
// ==========================================
const AuraCanvas = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // إعداد المشهد
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xffffff, 0.002); // ضباب بلاتيني خفيف

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // تحسين الأداء
    mountRef.current.appendChild(renderer.domElement);

    // إنشاء الجسيمات (The Aura Particles)
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);

    const color1 = new THREE.Color(THEME.colors.oceanBlue);
    const color2 = new THREE.Color(THEME.colors.softTeal);

    for(let i = 0; i < particlesCount * 3; i+=3) {
      // توزيع عشوائي في فضاء كروي
      posArray[i] = (Math.random() - 0.5) * 100;
      posArray[i+1] = (Math.random() - 0.5) * 100;
      posArray[i+2] = (Math.random() - 0.5) * 100;

      // مزج الألوان
      const mixedColor = i % 2 === 0 ? color1 : color2;
      colorsArray[i] = mixedColor.r;
      colorsArray[i+1] = mixedColor.g;
      colorsArray[i+2] = mixedColor.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // التفاعل مع الماوس
    let mouseX = 0;
    let mouseY = 0;
    
    const onDocumentMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - window.innerWidth / 2) * 0.05;
      mouseY = (event.clientY - window.innerHeight / 2) * 0.05;
    };
    document.addEventListener('mousemove', onDocumentMouseMove);

    // حلقة الريندر
    const clock = new THREE.Clock();
    
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // حركة تموجية للهالة
      particlesMesh.rotation.y = elapsedTime * 0.05;
      particlesMesh.rotation.x += (mouseY * 0.01 - particlesMesh.rotation.x) * 0.1;
      particlesMesh.rotation.y += (mouseX * 0.01 - particlesMesh.rotation.y) * 0.1;

      // تأثير التنفس (Breathing Effect)
      const scale = 1 + Math.sin(elapsedTime * 0.5) * 0.05;
      particlesMesh.scale.set(scale, scale, scale);

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // التعامل مع تغيير حجم الشاشة
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
      document.removeEventListener('mousemove', onDocumentMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <div ref={mountRef} className="fixed top-0 left-0 w-full h-full -z-10 opacity-60 pointer-events-none" />;
};

// ==========================================
// 3. مكونات الواجهة (UI Components)
// ==========================================

const NavBar = () => (
  <nav className="fixed top-0 w-full z-50 px-8 py-6 flex justify-between items-center backdrop-blur-md border-b border-white/10">
    <div className="text-2xl font-bold tracking-tighter" style={{ color: THEME.colors.oceanBlue }}>AURA.</div>
    <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
      {['الرؤية', 'الخدمات', 'الأعمال', 'المعرفة'].map((item) => (
        <a key={item} href={`#${item}`} className="hover:text-[#438FB3] transition-colors duration-300">{item}</a>
      ))}
    </div>
    <button className="bg-[#1A202C] text-white px-6 py-2 rounded-full text-sm hover:bg-[#438FB3] transition-all duration-300">
      ابدأ المشروع
    </button>
  </nav>
);

const HeroSection = () => {
  return (
    <section className="relative h-screen flex flex-col justify-center items-center text-center px-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="z-10 max-w-4xl"
      >
        <h1 className="text-6xl md:text-9xl font-black mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#438FB3] to-[#58A8B4]" style={{ lineHeight: 1.1 }}>
          هالتك الفارقة
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 font-light mb-8 max-w-2xl mx-auto">
          هندسة التجربة الإبداعية لوكالات التسويق العالمية.
          <br/>
          <span className="text-sm text-gray-400 mt-2 block">Powered by A.I & Human Insight</span>
        </p>
      </motion.div>
      
      <motion.div 
        animate={{ y: [0, 10, 0] }} 
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#438FB3]"
      >
        <ChevronDown size={32} />
      </motion.div>
    </section>
  );
};

const BentoGrid = () => {
  const cards = [
    { title: "إدارة الحملات (PPC)", icon: <Zap />, col: "col-span-1", desc: "استهداف دقيق، تكلفة أقل." },
    { title: "SEO & AEO", icon: <Search />, col: "col-span-2", desc: "السيطرة على محركات البحث والإجابة." },
    { title: "النمو (Growth)", icon: <TrendingUp />, col: "col-span-2", desc: "استراتيجيات قائمة على البيانات." },
    { title: "المحتوى الإبداعي", icon: <Layers />, col: "col-span-1", desc: "سرد قصصي يخلق الولاء." },
  ];

  return (
    <section className="py-24 px-4 bg-gray-50/50 backdrop-blur-sm" id="الخدمات">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-4 text-[#1A202C]">هندسة الحلول</h2>
          <p className="text-gray-500">منظومة خدمات متكاملة صممت لعام 2026</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(67, 143, 179, 0.15)" }}
              className={`${card.col} p-8 rounded-3xl bg-white border border-[#B3B7C1]/20 hover:border-[#58A8B4] transition-all duration-300 group`}
            >
              <div className="w-12 h-12 rounded-xl bg-[#f0f9ff] flex items-center justify-center mb-6 text-[#438FB3] group-hover:bg-[#438FB3] group-hover:text-white transition-colors">
                {card.icon}
              </div>
              <h3 className="text-2xl font-bold mb-2 text-[#1A202C]">{card.title}</h3>
              <p className="text-gray-500">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HorizontalScroll = () => {
  const targetRef = useRef(null);
  const scrollRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const totalWidth = scrollRef.current ? (scrollRef.current as any).scrollWidth : 0;
      const windowWidth = window.innerWidth;
      
      gsap.to(scrollRef.current, {
        x: () => -(totalWidth - windowWidth),
        ease: "none",
        scrollTrigger: {
          trigger: targetRef.current,
          pin: true,
          scrub: 1,
          end: () => "+=" + totalWidth,
        }
      });
    }, targetRef);

    return () => ctx.revert();
  }, []);

  const cases = [
    { id: "01", client: "Saudi Fintech", growth: "+300%", metric: "User Acquisition" },
    { id: "02", client: "Riyadh Season", growth: "1.2M", metric: "Social Reach" },
    { id: "03", client: "NEOM Style", growth: "Top 1", metric: "Google Ranking" },
    { id: "04", client: "Luxury Real Estate", growth: "450%", metric: "ROI" },
  ];

  return (
    <section ref={targetRef} className="h-screen bg-[#1A202C] text-white overflow-hidden relative" id="الأعمال">
      <div className="absolute top-12 right-12 z-10">
        <h2 className="text-xl font-light text-[#58A8B4]">مختبر النجاح</h2>
      </div>
      
      <div ref={scrollRef} className="flex h-full items-center pl-12 gap-12 w-fit">
        <div className="w-[30vw] shrink-0 px-12">
          <h2 className="text-6xl font-bold leading-tight">نتائج<br/>تتحدث عن<br/><span className="text-[#438FB3]">نفسها</span></h2>
        </div>
        {cases.map((item) => (
          <div key={item.id} className="w-[60vw] h-[70vh] bg-[#2D3748] rounded-[3rem] p-12 flex flex-col justify-between shrink-0 relative overflow-hidden group hover:bg-[#438FB3] transition-colors duration-500">
            <div className="text-9xl font-black text-white/5 absolute -bottom-10 -left-10">{item.id}</div>
            <div className="z-10">
              <h3 className="text-3xl font-bold mb-2">{item.client}</h3>
              <p className="text-gray-400 group-hover:text-white/80">دراسة حالة</p>
            </div>
            <div className="z-10">
              <div className="text-8xl font-black mb-2">{item.growth}</div>
              <div className="text-xl font-light border-t border-white/20 pt-4 inline-block">{item.metric}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const AEODisplay = () => {
  return (
    <section className="py-24 bg-white" id="المعرفة">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="bg-[#f0f9ff] text-[#438FB3] px-4 py-1 rounded-full text-sm font-bold">AEO 2026 Strategy</span>
          <h2 className="text-4xl font-bold mt-4">مركز المعرفة والسيادة الرقمية</h2>
        </div>
        
        <div className="space-y-6">
          {[
            "كيف تهيئ موقعك لعصر ما بعد محركات البحث؟",
            "استراتيجية الهالة: تحويل الزائر إلى سفير للعلامة.",
            "مستقبل الذكاء الاصطناعي في تحليل سلوك المستهلك السعودي."
          ].map((title, i) => (
            <div key={i} className="border-b border-gray-100 pb-6 group cursor-pointer">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-[#438FB3] transition-colors">{title}</h3>
                <ArrowUpLeft className="opacity-0 group-hover:opacity-100 transition-opacity text-[#438FB3]" />
              </div>
              <div className="h-0 overflow-hidden group-hover:h-auto transition-all duration-300">
                <p className="mt-4 text-gray-500 text-sm leading-relaxed">
                  [إجابة مكثفة ومهيكلة لتظهر في مقتطفات الذكاء الاصطناعي - حوالي 50 كلمة تشرح الفكرة الجوهرية وتعرف كيان أورا كخبير في المجال]
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-[#1A202C] text-white py-20 px-4 border-t border-[#438FB3]/30">
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="col-span-1 md:col-span-2">
        <h2 className="text-4xl font-bold mb-6 text-[#438FB3]">AURA.</h2>
        <p className="text-gray-400 max-w-sm">
          نحن لا نتبع المسار، نحن نضيئه. وكالة أورا للتسويق الرقمي وهندسة التجربة.
        </p>
      </div>
      <div>
        <h4 className="font-bold mb-4 text-[#B3B7C1]">الخدمات</h4>
        <ul className="space-y-2 text-gray-400 text-sm">
          <li>استراتيجية الهالة</li>
          <li>تطوير WebGL</li>
          <li>تحسين محركات الإجابة</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-4 text-[#B3B7C1]">تواصل</h4>
        <ul className="space-y-2 text-gray-400 text-sm">
          <li>hello@aura.agency</li>
          <li>Riyadh, Saudi Arabia</li>
        </ul>
      </div>
    </div>
    <div className="max-w-6xl mx-auto mt-20 pt-8 border-t border-gray-800 text-center text-gray-600 text-xs">
      © 2026 Aura Digital Agency. Built for the Future.
    </div>
  </footer>
);

// ==========================================
// 4. الصفحة الرئيسية (Main Page)
// ==========================================

export default function AuraHome() {
  return (
    <div dir="rtl" className="bg-white min-h-screen font-sans selection:bg-[#438FB3] selection:text-white">
      {/* إعدادات الرأس والخطوط */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Readex+Pro:wght@200;300;400;500;600;700&display=swap');
        body { font-family: 'Readex Pro', sans-serif; }
      `}</style>

      {/* بيانات Schema.org لـ AEO */}
      <Script id="structured-data" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            "name": "Aura Agency",
            "slogan": "هالتك الفارقة في عالم التسويق",
            "description": "وكالة تسويق رقمي رائدة تعتمد على هندسة التجربة والذكاء الاصطناعي.",
            "url": "https://aura.agency",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Riyadh",
              "addressCountry": "SA"
            }
          }
        `}
      </Script>

      <AuraCanvas />
      
      <main className="relative z-10">
        <NavBar />
        <HeroSection />
        <BentoGrid />
        <HorizontalScroll />
        <AEODisplay />
        <Footer />
      </main>
    </div>
  );
}
