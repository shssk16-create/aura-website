"use client";
import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, Play, Sparkles } from "lucide-react";
import FluidBackground from "@/components/FluidBackground";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function AuraHome() {
  const container = useRef<HTMLDivElement>(null);
  const halaRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  
  // حالة هالة (Idle, Greeting, Active)
  const [halaState, setHalaState] = useState("greeting");

  // 1. مؤشر الماوس المخصص (The Aura Cursor)
  useGSAP(() => {
    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: "power2.out",
      });
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  // 2. أنميشن السكرول والسرد
  useGSAP(() => {
    // دخول الهيرو
    gsap.from(".hero-char", {
      y: 100,
      opacity: 0,
      stagger: 0.05,
      duration: 1.2,
      ease: "power4.out",
    });

    // تحرك هالة مع السكرول
    gsap.to(halaRef.current, {
      y: 200, // تتحرك للأسفل ببطء
      scale: 0.8,
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });

    // ظهور بطاقات الخدمات (Bento Grid)
    gsap.from(".bento-item", {
      y: 50,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      scrollTrigger: {
        trigger: ".services-section",
        start: "top 70%",
      },
    });
  }, { scope: container });

  return (
    <main ref={container} className="relative min-h-screen selection:bg-aura-teal selection:text-white" dir="rtl">
      
      {/* الخلفية الحية */}
      <div className="living-bg" />
      <FluidBackground /> {/* الـ Shader الثلاثي الأبعاد */}

      {/* مؤشر الماوس (الهالة) */}
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-aura-teal bg-aura-blue/20 blur-sm pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-screen"
      />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center backdrop-blur-sm bg-white/5 border-b border-white/10">
        <h1 className="text-3xl font-black tracking-tighter text-aura-dark">AURA</h1>
        <button className="px-6 py-2 rounded-full border border-aura-silver text-aura-dark font-bold hover:bg-aura-teal hover:text-white hover:border-transparent transition-all">
          ابدأ المشروع
        </button>
      </nav>

      {/* --- SECTION 1: HERO --- */}
      <section className="hero-section h-screen flex flex-col items-center justify-center relative overflow-hidden px-4">
        
        {/* هالة (المساعد الرقمي) */}
        <div ref={halaRef} className="absolute right-[5%] md:right-[15%] top-[20%] w-[300px] md:w-[500px] h-[500px] z-0 pointer-events-none">
          {/* هنا نضع فيديو هالة أو صورتها بتأثير 2.5D */}
          {/* تمثيل تجريدي حالياً */}
          <div className="w-full h-full bg-gradient-to-tr from-aura-blue to-aura-teal rounded-full blur-[100px] opacity-60 animate-pulse" />
          <img 
            src="/api/placeholder/400/600" // استبدلها بصورة هالة المفرغة
            alt="Hala Agent"
            className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_30px_rgba(88,168,180,0.5)]"
          />
        </div>

        <div className="relative z-10 text-center md:text-right md:w-full md:pr-[10%] max-w-7xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/30 border border-aura-silver/50 backdrop-blur-md mb-6">
            <span className="w-2 h-2 rounded-full bg-aura-teal animate-ping" />
            <span className="text-sm font-bold text-aura-dark">مستقبل التسويق الحي</span>
          </div>

          <h1 className="text-6xl md:text-9xl font-black text-aura-dark leading-[0.9] tracking-tighter mb-8">
            <div className="overflow-hidden"><span className="hero-char inline-block">هالتك</span></div>
            <div className="overflow-hidden">
              <span className="hero-char inline-block kinetic-text drop-shadow-lg">الفارقة</span>
            </div>
            <div className="overflow-hidden"><span className="hero-char inline-block text-4xl md:text-7xl opacity-80">في عالم التسويق</span></div>
          </h1>

          <p className="text-lg md:text-2xl text-slate-600 max-w-xl md:ml-auto leading-relaxed mb-10">
            أهلاً بك في بيئة أورا. أنا <span className="text-aura-blue font-bold">هالة</span>، وكيلك الرقمي لقيادة علامتك التجارية نحو المستقبل عبر تجارب بصرية حية.
          </p>

          <div className="flex gap-4 justify-center md:justify-start">
            <button className="group relative px-8 py-4 bg-aura-dark text-white rounded-full overflow-hidden shadow-xl hover:shadow-aura-blue/40 transition-shadow">
              <span className="relative z-10 flex items-center gap-2 font-bold">
                تحدث مع هالة <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-aura-gradient transform scale-x-0 group-hover:scale-x-100 transition-transform origin-right duration-500" />
            </button>
            
            <button className="w-14 h-14 rounded-full flex items-center justify-center border border-aura-silver hover:border-aura-teal hover:bg-aura-teal/10 transition-colors">
              <Play className="w-5 h-5 text-aura-dark ml-1" />
            </button>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: SERVICES (Tactile Bento Grid) --- */}
      <section className="services-section py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black mb-16 flex items-center gap-4">
            <Sparkles className="text-aura-teal" />
            خدمات تتنفس إبداعاً
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {/* بطاقة كبيرة */}
            <div className="bento-item liquid-glass md:col-span-2 rounded-[2rem] p-10 flex flex-col justify-between group cursor-pointer">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-aura-blue to-aura-teal flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl font-bold">AI</span>
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-2">التسويق بالذكاء الاصطناعي</h3>
                <p className="text-slate-600">تحليلات دقيقة، استهداف ذكي، ومحتوى يتكيف مع الجمهور لحظياً.</p>
              </div>
              <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowLeft className="text-aura-teal w-8 h-8" />
              </div>
            </div>

            {/* بطاقة عمودية */}
            <div className="bento-item liquid-glass md:row-span-2 rounded-[2rem] p-10 group relative overflow-hidden">
              <div className="absolute inset-0 bg-aura-gradient opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
              <div className="relative z-10 h-full flex flex-col justify-between">
                 <h3 className="text-3xl font-bold group-hover:text-white transition-colors">الهوية البصرية</h3>
                 <div className="w-full h-40 bg-white/20 backdrop-blur-md rounded-xl border border-white/30" />
              </div>
            </div>

            {/* بطاقات صغيرة */}
            <div className="bento-item liquid-glass rounded-[2rem] p-8 flex flex-col justify-center items-center text-center group">
               <h3 className="text-xl font-bold mb-2">SEO 2.0</h3>
               <p className="text-sm text-slate-500">تصدر النتائج بذكاء.</p>
            </div>

            <div className="bento-item liquid-glass rounded-[2rem] p-8 flex flex-col justify-center items-center text-center group">
               <h3 className="text-xl font-bold mb-2">Social Media</h3>
               <p className="text-sm text-slate-500">محتوى فيروسي.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-aura-silver font-bold relative z-10">
        © 2026 AURA Agency. Powered by Fluid Intelligence.
      </footer>
    </main>
  );
}
