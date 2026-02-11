"use client";
import { useEffect, useState } from "react";
import Lenis from "lenis";
import { motion, AnimatePresence } from "framer-motion";
import LoadingScreen from "@/components/LoadingScreen";
import Hero3D from "@/components/Hero3D";
import SelectedWork from "@/components/SelectedWork";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }, []);

  return (
    // الطبقة 1: القماش الثلجي (Base Canvas)
    <main className="bg-[#F8FAFC] min-h-screen relative selection:bg-[#58A8B4] selection:text-white font-cairo overflow-x-hidden">
      
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>
      
      {/* الطبقة 2: البقع الضبابية (Soft Blobs) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-[#58A8B4]/20 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-10%] right-[-10%] w-[600px] md:w-[900px] h-[600px] md:h-[900px] bg-[#438FB3]/15 rounded-full blur-[120px]"
        />
      </div>

      {/* النافبار العائم */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] md:w-auto transition-all">
        <div className="glass-capsule px-6 py-3.5 rounded-full flex items-center justify-between md:justify-center gap-8 text-sm font-bold text-[#0F172A] border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] backdrop-blur-xl bg-white/40">
          <span className="text-xl tracking-wider text-[#438FB3]">AURA</span>
          <div className="hidden md:flex gap-8">
            <a href="#" className="hover:text-[#58A8B4] transition-colors">الرئيسية</a>
            <a href="#" className="hover:text-[#58A8B4] transition-colors">أعمالنا</a>
            <a href="#" className="hover:text-[#58A8B4] transition-colors">الخدمات</a>
          </div>
          <button className="bg-gradient-to-r from-[#58A8B4] to-[#438FB3] text-white px-6 py-2 rounded-full text-xs hover:shadow-[0_0_20px_rgba(88,168,180,0.4)] hover:scale-105 transition-all">
            تواصل معنا
          </button>
        </div>
      </nav>

      {/* الطبقة 3 (الـ 3D) والطبقة 4 (المحتوى التوأم) */}
      <section className="relative h-screen w-full flex items-center justify-center">
        {/* Layer 3: Particles */}
        {!loading && <Hero3D />}
        
        {/* Layer 4: Twin Content (SEO & Visibility) */}
        {!loading && (
          <motion.div 
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.2, duration: 1.2, ease: "easeOut" }}
            className="z-10 text-center px-4 mt-20"
          >
            <h1 className="text-5xl md:text-8xl font-black text-[#0F172A] tracking-tighter mb-6 leading-[1.1]">
              نصنع لك <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#58A8B4] to-[#438FB3]">
                هالتك الفارقة
              </span>
            </h1>
            <p className="text-lg md:text-2xl text-[#0F172A]/70 max-w-2xl mx-auto font-medium leading-relaxed">
              تسويق يعتمد على البيانات، بروح إبداعية لا تُنسى. نأخذ علامتك التجارية إلى بُعد آخر.
            </p>
          </motion.div>
        )}
      </section>

      {/* قسم الأعمال */}
      {!loading && <SelectedWork />}
      
    </main>
  );
}
