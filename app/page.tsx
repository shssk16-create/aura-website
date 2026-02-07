'use client';

import React, { useState, useEffect, useRef, useLayoutEffect, Suspense } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  ArrowUpRight, Megaphone, PenTool, Search, Palette, 
  ShoppingBag, Plus, Menu, X, Globe, ChevronDown, Zap, Layers 
} from 'lucide-react';
import Script from 'next/script';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// --- تهيئة المكتبات ---
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// --- SEO: البيانات المنظمة (JSON-LD) ---
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "AURA Digital Agency",
  "image": "https://aurateam3.com/logo.png",
  "description": "وكالة رقمية إبداعية متخصصة في بناء الهوية البصرية وتطوير المواقع بمعايير 2026.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Riyadh",
    "addressCountry": "SA"
  },
  "url": "https://aurateam3.com",
  "priceRange": "$$$",
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
    "opens": "09:00",
    "closes": "18:00"
  }
};

// --- CSS (Global Styles for Tailwind workaround) ---
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Readex+Pro:wght@200;300;400;500;600;700&display=swap');
  :root { --primary: #4390b3; --bg-dark: #050607; }
  body { background-color: var(--bg-dark); color: white; font-family: 'Readex Pro', sans-serif; overflow-x: hidden; }
  .glass-panel { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.08); }
  .text-gradient { background: linear-gradient(135deg, #fff 0%, var(--primary) 100%); -webkit-background-clip: text; color: transparent; }
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: #050607; }
  ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--primary); }
`;

// --- UI Components (Design System) ---

const GlassCard = ({ children, className = "", noHover = false }: any) => (
  <motion.div 
    whileHover={!noHover ? { y: -5, scale: 1.01 } : {}}
    className={`glass-panel relative overflow-hidden rounded-3xl transition-all duration-500 hover:border-[#4390b3]/40 hover:shadow-[0_0_40px_rgba(67,144,179,0.15)] ${className}`}
  >
    {children}
  </motion.div>
);

const SectionHeader = ({ title, highlight, subtitle }: any) => (
  <div className="mb-20 text-center relative z-10">
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <h2 className="text-4xl md:text-7xl font-bold tracking-tighter mb-6">
        {title} <span className="text-gradient">{highlight}</span>
      </h2>
      <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[#4390b3] to-transparent mx-auto mb-6 opacity-50"></div>
      <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
    </motion.div>
  </div>
);

// --- 1. Navbar Component ---
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'py-4 bg-[#050607]/80 backdrop-blur-xl border-b border-white/5' : 'py-8'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="text-2xl font-bold tracking-tighter flex items-center gap-2">
          <div className="w-3 h-3 bg-[#4390b3] rounded-full animate-pulse shadow-[0_0_15px_#4390b3]"></div>
          AURA
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
          {['الرئيسية', 'الخدمات', 'الأعمال', 'المدونة'].map((item) => (
            <a key={item} href="#" className="hover:text-[#4390b3] transition-colors">{item}</a>
          ))}
        </div>
        <button className="px-6 py-2.5 rounded-full border border-white/10 hover:bg-white/10 hover:border-[#4390b3] transition-all text-sm font-bold">
          ابدأ مشروعك
        </button>
      </div>
    </nav>
  );
};

// --- 2. Hero Scene (Three.js + Suspense) ---
const HeroScene = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    // إعداد المشهد (مبسط للأداء)
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050607, 0.02);
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // جزيئات الفضاء
    const particlesGeometry = new THREE.BufferGeometry();
    const count = 3000;
    const posArray = new Float32Array(count * 3);
    for(let i = 0; i < count * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 60;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const material = new THREE.PointsMaterial({ size: 0.15, color: 0x4390b3, transparent: true, opacity: 0.8 });
    const particles = new THREE.Points(particlesGeometry, material);
    scene.add(particles);

    // التحريك
    const animate = () => {
      requestAnimationFrame(animate);
      particles.rotation.y += 0.001;
      particles.rotation.x += 0.0005;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize); renderer.dispose(); };
  }, []);

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <div className="relative z-10 text-center px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <span className="inline-block py-1 px-3 rounded-full border border-[#4390b3]/30 bg-[#4390b3]/10 text-[#4390b3] text-sm mb-6">
            ✨ الجيل القادم من الوكالات الرقمية
          </span>
          <h1 className="text-5xl md:text-9xl font-bold mb-6 tracking-tighter">
            من شتات <span className="text-gradient">الفضاء</span>
          </h1>
          <p className="text-gray-400 text-xl md:text-2xl max-w-2xl mx-auto">
            نشكل هالتك الرقمية الفارقة بتقنيات المستقبل.
          </p>
        </motion.div>
      </div>
      <motion.div 
        animate={{ y: [0, 10, 0] }} 
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-50"
      >
        <ChevronDown size={30} />
      </motion.div>
    </div>
  );
};

// --- 3. Services Bento Grid ---
const ServicesBento = () => {
  const services = [
    { title: "هوية بصرية", desc: "نصنع علامات تجارية تعلق في الأذهان.", icon: Palette, size: "md:col-span-2", bg: "bg-gradient-to-br from-[#4390b3]/10 to-transparent" },
    { title: "تطوير ويب", desc: "Next.js 15 & 3D WebGL.", icon: Globe, size: "", bg: "" },
    { title: "تسويق رقمي", desc: "استراتيجيات نمو تعتمد على البيانات.", icon: Megaphone, size: "", bg: "" },
    { title: "تطبيقات", desc: "تجربة مستخدم (UX) سلسة.", icon: Zap, size: "md:col-span-2", bg: "bg-gradient-to-bl from-[#4390b3]/10 to-transparent" },
    { title: "SEO ومحتوى", desc: "تصدر نتائج البحث بذكاء.", icon: Search, size: "", bg: "" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
      {services.map((item, idx) => (
        <GlassCard key={idx} className={`${item.size} p-8 flex flex-col justify-between group ${item.bg}`}>
          <div>
            <div className="w-14 h-14 rounded-2xl bg-[#4390b3]/10 flex items-center justify-center text-[#4390b3] mb-6 group-hover:scale-110 transition-transform">
              <item.icon size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
            <p className="text-gray-400 leading-relaxed">{item.desc}</p>
          </div>
          <div className="mt-8 flex items-center gap-2 text-[#4390b3] text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
            اكتشف المزيد <ArrowUpRight size={16} />
          </div>
        </GlassCard>
      ))}
    </div>
  );
};

// --- 4. Works Horizontal Scroll (GSAP) ---
const WorksHorizontalScroll = () => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  useLayoutEffect(() => {
    if (window.innerWidth < 768) return; // تعطيل السكرول الأفقي للجوال
    
    let ctx = gsap.context(() => {
      const track = trackRef.current as any;
      const scrollWidth = track.scrollWidth - window.innerWidth;
      
      gsap.to(track, {
        x: -scrollWidth,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          end: "+=3000", // طول السكرول
        }
      });
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  const works = [
    { name: "NEOM Future", cat: "Web Development", img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&q=80" },
    { name: "AlUla Tourism", cat: "Branding", img: "https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&fit=crop&q=80" },
    { name: "Riyadh Season", cat: "Marketing", img: "https://images.unsplash.com/photo-1596707328659-56540c490a6c?auto=format&fit=crop&q=80" },
    { name: "Red Sea", cat: "App Design", img: "https://images.unsplash.com/photo-1558231294-8777990176dc?auto=format&fit=crop&q=80" },
  ];

  return (
    <div ref={containerRef} className="relative h-screen flex flex-col justify-center overflow-hidden bg-[#050607]">
       <div className="absolute top-10 right-10 z-10 md:hidden text-gray-500 text-sm">اسحب لليسار</div>
       <div className="container mx-auto px-6 mb-12 md:absolute md:top-20 md:right-20 md:mb-0 z-10">
         <h2 className="text-4xl font-bold">أعمالنا <span className="text-gradient">المميزة</span></h2>
       </div>
       
       <div ref={trackRef} className="flex gap-8 px-6 md:px-20 w-max">
         {works.map((work, i) => (
           <div key={i} className="relative w-[85vw] md:w-[40vw] h-[50vh] md:h-[60vh] rounded-[2rem] overflow-hidden border border-white/10 group grayscale hover:grayscale-0 transition-all duration-500">
             <img src={work.img} alt={work.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
               <span className="text-[#4390b3] font-mono text-sm mb-2">{work.cat}</span>
               <h3 className="text-3xl font-bold">{work.name}</h3>
             </div>
           </div>
         ))}
       </div>
    </div>
  );
};

// --- 5. FAQ Section ---
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqs = [
    { q: "كم يستغرق بناء موقع متكامل؟", a: "يعتمد على التعقيد، لكن المواقع التعريفية تستغرق عادة 2-4 أسابيع، والمتاجر الإلكترونية 4-8 أسابيع." },
    { q: "هل تقدمون خدمات ما بعد الإطلاق؟", a: "نعم، نقدم باقات صيانة ودعم فني لضمان استقرار ونمو مشروعك الرقمي." },
    { q: "ما هي التقنيات المستخدمة؟", a: "نعتمد أحدث التقنيات: Next.js 15, React, Tailwind CSS, Three.js لضمان السرعة والأداء." },
  ];

  return (
    <div className="max-w-3xl mx-auto px-6">
      <SectionHeader title="الأسئلة" highlight="الشائعة" subtitle="كل ما تحتاج معرفته قبل البدء." />
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <GlassCard key={i} noHover className="border-white/5 bg-white/[0.02]">
            <button 
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex items-center justify-between w-full p-6 text-right"
            >
              <span className="text-lg font-bold">{faq.q}</span>
              <Plus className={`text-[#4390b3] transition-transform duration-300 ${openIndex === i ? 'rotate-45' : ''}`} />
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: "auto", opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-6 text-gray-400 leading-relaxed">{faq.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

// --- 6. Footer ---
const Footer = () => (
  <footer className="border-t border-white/10 pt-20 pb-10 bg-[#020304]">
    <div className="container mx-auto px-6 text-center">
      <h2 className="text-5xl md:text-8xl font-bold mb-10 opacity-20 hover:opacity-100 transition-opacity duration-500 cursor-default">
        AURA AGENCY
      </h2>
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-gray-500 text-sm">
        <div>© 2026 Aura Digital. جميع الحقوق محفوظة.</div>
        <div className="flex gap-6">
          {['LinkedIn', 'Twitter', 'Instagram', 'Behance'].map(s => (
            <a key={s} href="#" className="hover:text-[#4390b3] transition-colors">{s}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

// --- المكون الرئيسي المجمع ---
export default function AuraGlobalSite() {
  return (
    <div className="bg-[#050607] text-white selection:bg-[#4390b3] selection:text-white">
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      
      {/* 1. SEO Data */}
      <Script id="structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Navbar />
      
      <main>
        {/* 2. Hero Section */}
        <HeroScene />

        {/* 3. Services (Bento Grid) */}
        <section className="container mx-auto px-6 py-32 relative z-10">
          <SectionHeader title="خدمات" highlight="متكاملة" subtitle="منصات نمو رقمية مستدامة، ليست مجرد مواقع." />
          <ServicesBento />
        </section>

        {/* 4. Works (Horizontal Scroll) */}
        <WorksHorizontalScroll />

        {/* 5. FAQ */}
        <section className="py-32 relative z-10">
          <FAQSection />
        </section>
      </main>

      <Footer />
    </div>
  );
}
