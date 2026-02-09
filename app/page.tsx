'use client';

import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import Image from 'next/image';
import { Alexandria } from 'next/font/google';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  ArrowUpLeft, Hexagon, Layers, Zap, Search, 
  ChevronDown, Menu, Globe, Shield, Cpu, Activity 
} from 'lucide-react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

// تحميل الخط الهندسي (بديل DIN)
const alexandria = Alexandria({ subsets: ['arabic', 'latin'], weight: ['100', '300', '400', '700', '900'] });

// تسجيل إضافات GSAP
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ==========================================
// 1. نظام التصميم والثوابت (Design Tokens)
// ==========================================
const THEME = {
  colors: {
    platinum: '#B3B7C1', // الأساس: الاستقرار
    oceanBlue: '#438FB3', // الثانوي: الثقة
    softTeal: '#58A8B4', // اللكنة: الابتكار (مركز الهالة)
    dark: '#0f172a',
    light: '#f8fafc',
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
    // ضباب بلاتيني خفيف لدمج العناصر مع الخلفية
    scene.fog = new THREE.FogExp2(0xffffff, 0.001);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // تحسين الأداء للجوال
    mountRef.current.appendChild(renderer.domElement);

    // نظام الجسيمات (The Aura Particles)
    const particlesCount = 3000;
    const geometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);

    const color1 = new THREE.Color(THEME.colors.oceanBlue);
    const color2 = new THREE.Color(THEME.colors.softTeal);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      // توزيع دائري (هالة)
      const r = 20 + Math.random() * 30;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      posArray[i] = r * Math.cos(theta) * Math.sin(phi);
      posArray[i + 1] = r * Math.sin(theta) * Math.sin(phi);
      posArray[i + 2] = r * Math.cos(phi);

      // مزج الألوان
      const mixedColor = Math.random() > 0.5 ? color1 : color2;
      colorArray[i] = mixedColor.r;
      colorArray[i + 1] = mixedColor.g;
      colorArray[i + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    // Shader Material لمحاكاة التوهج (Glow)
    const material = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particlesMesh = new THREE.Points(geometry, material);
    scene.add(particlesMesh);

    // التفاعل مع الماوس (المغناطيس)
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onDocumentMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - window.innerWidth / 2) * 0.01;
      mouseY = (event.clientY - window.innerHeight / 2) * 0.01;
    };
    document.addEventListener('mousemove', onDocumentMouseMove);

    // حلقة الريندر
    const animate = () => {
      targetX = mouseX * 0.5;
      targetY = mouseY * 0.5;

      // حركة انسيابية للكاميرا والجسيمات
      particlesMesh.rotation.y += 0.001;
      particlesMesh.rotation.x += 0.0005;

      particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
      particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // إدارة تغيير حجم الشاشة
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if(mountRef.current) mountRef.current.removeChild(renderer.domElement);
      document.removeEventListener('mousemove', onDocumentMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <div ref={mountRef} className="fixed top-0 left-0 w-full h-full -z-10 opacity-70 pointer-events-none" />;
};

// ==========================================
// 3. مكونات الواجهة (UI Components)
// ==========================================

const NavBar = () => (
  <nav className="fixed top-0 w-full z-50 px-6 py-6 flex justify-between items-center backdrop-blur-sm border-b border-white/5">
    <div className="text-2xl font-black tracking-tighter text-[#0f172a]">AURA.</div>
    <div className="hidden md:flex gap-10 text-sm font-bold text-gray-600">
      {['الرؤية', 'الخدمات', 'دراسات الحالة', 'المعرفة'].map((item) => (
        <a key={item} href={`#${item}`} className="hover:text-[#438FB3] transition-colors duration-300 relative group">
          {item}
          <span className="absolute -bottom-2 right-0 w-0 h-0.5 bg-[#58A8B4] transition-all duration-300 group-hover:w-full"></span>
        </a>
      ))}
    </div>
    <div className="flex gap-4">
        <button className="hidden md:block border border-[#B3B7C1] text-[#0f172a] px-6 py-2 rounded-full text-sm font-bold hover:bg-[#0f172a] hover:text-white transition-all duration-300">
        تواصل معنا
        </button>
        <button className="md:hidden text-[#0f172a]"><Menu /></button>
    </div>
  </nav>
);

const HeroSection = () => {
  return (
    <section className="relative h-screen flex flex-col justify-center items-center text-center px-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="z-10 max-w-5xl"
      >
        <h1 className="text-7xl md:text-[9rem] font-black mb-4 text-[#0f172a] leading-[0.9] tracking-tight">
          هالتك <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#438FB3] to-[#58A8B4]">الفارقة</span>
        </h1>
        <h2 className="text-3xl md:text-5xl font-light text-[#B3B7C1] mb-8">
          في عالم التسويق الرقمي
        </h2>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
          هندسة التجربة الإبداعية لوكالات المستقبل. نحن لا نصمم المواقع، نحن نخلق منظومات رقمية تتحدث لغة الذكاء الاصطناعي وتخاطب المشاعر البشرية.
        </p>
      </motion.div>
      
      <motion.div 
        animate={{ y: [0, 10, 0] }} 
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#438FB3]"
      >
        <div className="w-[1px] h-16 bg-gradient-to-b from-[#438FB3] to-transparent mx-auto mb-2"></div>
        <span className="text-xs font-bold tracking-widest">اكتشف</span>
      </motion.div>
    </section>
  );
};

// شبكة البنتو (Bento Grid) للخدمات
const ServicesBento = () => {
  const cards = [
    { title: "هندسة الهوية", icon: <Hexagon />, col: "col-span-1 md:col-span-1", bg: "bg-white", text: "بناء علامات تجارية بصرية تخترق الضجيج." },
    { title: "SEO & AEO 2026", icon: <Search />, col: "col-span-1 md:col-span-2", bg: "bg-[#f8fafc]", text: "السيطرة على محركات البحث ومنصات الإجابة (ChatGPT/Gemini)." },
    { title: "تجارب WebGL", icon: <Globe />, col: "col-span-1 md:col-span-2", bg: "bg-[#f8fafc]", text: "مواقع ثلاثية الأبعاد تفاعلية ترفع معدل البقاء." },
    { title: "النمو الرقمي", icon: <Zap />, col: "col-span-1 md:col-span-1", bg: "bg-white", text: "استراتيجيات قائمة على البيانات لزيادة التحويل." },
  ];

  return (
    <section className="py-32 px-4" id="الخدمات">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16">
            <h2 className="text-5xl font-bold text-[#0f172a]">هندسة <span className="text-[#438FB3]">الحلول</span></h2>
            <p className="text-[#B3B7C1] max-w-md text-left hidden md:block">
                تصميم يخدم الوظيفة، وتقنية تخدم النمو. حلولنا مصممة لتكون قابلة للتوسع ومستعدة للمستقبل.
            </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className={`${card.col} ${card.bg} p-8 rounded-[2rem] border border-[#B3B7C1]/20 relative overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:shadow-[#438FB3]/10`}
            >
              <div className="absolute top-8 left-8 p-3 rounded-full bg-white border border-gray-100 text-[#438FB3] group-hover:bg-[#438FB3] group-hover:text-white transition-colors duration-300">
                {card.icon}
              </div>
              <div className="absolute bottom-8 right-8 text-right max-w-[80%]">
                <h3 className="text-2xl font-bold mb-2 text-[#0f172a]">{card.title}</h3>
                <p className="text-gray-500 text-sm">{card.text}</p>
              </div>
              {/* تأثير التوهج عند التحويم */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#58A8B4]/0 to-[#58A8B4]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// مختبر النجاح (Horizontal Scroll)
const CaseStudies = () => {
  const sectionRef = useRef(null);
  const triggerRef = useRef(null);

  useLayoutEffect(() => {
    const pin = gsap.fromTo(
      sectionRef.current,
      { translateX: 0 },
      {
        translateX: "-200vw",
        ease: "none",
        duration: 1,
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "2000 top",
          scrub: 0.6,
          pin: true,
        },
      }
    );
    return () => {
      pin.kill();
    };
  }, []);

  return (
    <section className="overflow-hidden bg-[#0f172a] text-white">
      <div ref={triggerRef}>
        <div ref={sectionRef} className="h-screen w-[300vw] flex flex-row relative">
          
          {/* Intro Panel */}
          <div className="h-screen w-screen flex flex-col justify-center items-start px-24 border-r border-white/10">
            <span className="text-[#58A8B4] font-bold tracking-widest mb-4">مختبر النجاح</span>
            <h2 className="text-8xl font-black mb-8">أرقام<br />تتحدث</h2>
            <p className="text-xl text-[#B3B7C1] max-w-xl">
              نحن لا نبيع الوعود، نحن نصنع النتائج. شاهد كيف حولنا العلامات التجارية إلى قادة في السوق.
            </p>
          </div>

          {/* Case Study 1 */}
          <div className="h-screen w-screen flex items-center justify-center relative border-r border-white/10 group">
            <div className="absolute inset-0 bg-[#438FB3]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="text-center z-10">
                <h3 className="text-[10rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 leading-none">
                    +300%
                </h3>
                <p className="text-2xl mt-4 font-light text-[#58A8B4]">نمو في المبيعات - قطاع التجزئة</p>
            </div>
          </div>

          {/* Case Study 2 */}
          <div className="h-screen w-screen flex items-center justify-center relative">
             <div className="text-center z-10">
                <h3 className="text-[10rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 leading-none">
                    #1
                </h3>
                <p className="text-2xl mt-4 font-light text-[#58A8B4]">ترتيب جوجل - AEO Strategy</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

// مركز المعرفة (AEO Hub)
const KnowledgeHub = () => {
  return (
    <section className="py-32 px-4 bg-white" id="المعرفة">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="bg-[#f0f9ff] text-[#438FB3] px-4 py-2 rounded-full text-sm font-bold border border-[#438FB3]/20">
            AEO - Answer Engine Optimization
          </span>
          <h2 className="text-4xl font-bold mt-6 text-[#0f172a]">مركز السيادة الرقمية</h2>
          <p className="text-[#B3B7C1] mt-4">إجابات مهيكلة لتصدر نتائج الذكاء الاصطناعي في 2026</p>
        </div>

        <div className="space-y-6">
          {[
            { q: "لماذا يعد AEO مستقبل البحث الرقمي؟", a: "لأن المستخدمين انتقلوا من البحث عن روابط إلى البحث عن إجابات مباشرة. نحن نهيكل بياناتك لتكون المصدر الأول لـ ChatGPT و Gemini." },
            { q: "ما هي استراتيجية الهالة؟", a: "هي منهجية شاملة تدمج الجاذبية البصرية مع العمق التقني، لضمان بقاء العميل لفترة أطول وزيادة معدل التحويل." },
            { q: "كيف تضمنون سرعة الموقع مع الجرافيك العالي؟", a: "نستخدم تقنيات Lazy Loading و WebGL Instancing، مما يضمن تجربة سلسة حتى على الأجهزة المتوسطة." }
          ].map((item, i) => (
            <div key={i} className="border border-gray-100 rounded-2xl p-8 hover:border-[#438FB3] transition-colors cursor-pointer group bg-[#f8fafc]">
              <h3 className="text-xl font-bold text-[#0f172a] group-hover:text-[#438FB3] transition-colors flex justify-between items-center">
                {item.q}
                <ArrowUpLeft className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              
              {/* Structured Data Block for AEO */}
              <div className="mt-4 text-gray-600 text-sm leading-relaxed border-t border-gray-200 pt-4">
                {item.a}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// تذييل الصفحة (Footer)
const Footer = () => (
  <footer className="bg-[#0f172a] text-white py-20 px-4 border-t border-white/10">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="col-span-1 md:col-span-2">
        <h2 className="text-5xl font-black mb-6 tracking-tighter">AURA.</h2>
        <p className="text-[#B3B7C1] max-w-sm">
          نحن لا نتبع المسار، نحن نضيئه.
          <br/>
          الرياض، المملكة العربية السعودية.
        </p>
      </div>
      <div>
        <h4 className="font-bold mb-6 text-[#58A8B4]">الخدمات</h4>
        <ul className="space-y-3 text-sm text-gray-400">
          <li><a href="#" className="hover:text-white transition-colors">استراتيجية الهالة</a></li>
          <li><a href="#" className="hover:text-white transition-colors">تطوير WebGL</a></li>
          <li><a href="#" className="hover:text-white transition-colors">تحسين محركات الإجابة</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-6 text-[#58A8B4]">تواصل</h4>
        <ul className="space-y-3 text-sm text-gray-400">
          <li>hello@aura.agency</li>
          <li>+966 50 000 0000</li>
          <li>Linkedin / Twitter</li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 text-center text-[#B3B7C1] text-xs flex justify-between items-center">
      <span>© 2026 Aura Digital Agency. All Rights Reserved.</span>
      <span className="opacity-50">Designed for the Future.</span>
    </div>
  </footer>
);

// ==========================================
// 4. التجميع النهائي للصفحة (Main Page)
// ==========================================

export default function Home() {
  // تهيئة مكتبة التمرير الناعم (Lenis)
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);

  return (
    <div className={alexandria.className} dir="rtl">
      {/* Schema.org for AEO */}
      <Script id="structured-data" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            "name": "Aura Digital Agency",
            "slogan": "هالتك الفارقة في عالم التسويق",
            "description": "وكالة تسويق رقمي رائدة في الرياض تعتمد على هندسة التجربة والذكاء الاصطناعي.",
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
        <ServicesBento />
        <CaseStudies />
        <KnowledgeHub />
        <Footer />
      </main>
    </div>
  );
}
