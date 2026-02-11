"use client";
import { useEffect, useState } from "react";
import Lenis from "lenis";
import { AnimatePresence } from "framer-motion";
import LoadingScreen from "@/components/LoadingScreen";
import ScrollDrivenHero from "@/components/ScrollDrivenHero";
import SelectedWork from "@/components/SelectedWork";
import CustomCursor from "@/components/CustomCursor";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }, []);

  return (
    <main className="bg-[#F8FAFC] min-h-screen relative selection:bg-[#58A8B4] selection:text-white font-cairo overflow-x-hidden cursor-none">
      <CustomCursor />
      
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>
      
      {/* البقع الضبابية الفاخرة */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-[#58A8B4]/15 rounded-full blur-[120px] mix-blend-multiply animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[900px] h-[900px] bg-[#438FB3]/10 rounded-full blur-[120px] mix-blend-multiply" />
      </div>

      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] md:w-auto transition-all">
        <div className="glass-capsule px-6 py-3.5 rounded-full flex items-center justify-between md:justify-center gap-8 text-sm font-bold text-[#0F172A] border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] backdrop-blur-xl bg-white/40">
          <span className="text-xl tracking-wider text-[#438FB3]">AURA</span>
          <div className="hidden md:flex gap-8 cursor-auto">
            <a href="#" className="hover:text-[#58A8B4] transition-colors">الرئيسية</a>
            <a href="#" className="hover:text-[#58A8B4] transition-colors">أعمالنا</a>
            <a href="#" className="hover:text-[#58A8B4] transition-colors">الخدمات</a>
          </div>
          <button className="bg-gradient-to-r from-[#58A8B4] to-[#438FB3] text-white px-6 py-2 rounded-full text-xs hover:shadow-[0_0_20px_rgba(88,168,180,0.4)] hover:scale-105 transition-all cursor-auto">
            تواصل معنا
          </button>
        </div>
      </nav>

      {!loading && <ScrollDrivenHero />}
      {!loading && <SelectedWork />}
    </main>
  );
}
