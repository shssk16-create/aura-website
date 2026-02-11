"use client";
import { useEffect, useState } from "react";
import Lenis from "lenis";
import { AnimatePresence } from "framer-motion";
import LoadingScreen from "@/components/LoadingScreen";
import ScrollDrivenMorph from "@/components/ScrollDrivenMorph"; 
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
      <AnimatePresence>{loading && <LoadingScreen onComplete={() => setLoading(false)} />}</AnimatePresence>
      
      {/* النافبار الجديد مع اللوجو */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] md:w-auto transition-all">
        <div className="glass-capsule px-6 py-3.5 rounded-full flex items-center justify-between gap-8 text-sm font-bold text-[#0F172A] border border-white/60 shadow-sm backdrop-blur-xl bg-white/40">
          {/* استبدال النص بالصورة */}
          <img src="https://aurateam3.com/wp-content/uploads/2025/09/cropped-Untitled-4.png" alt="AURA Logo" className="h-8 w-auto" />
        </div>
      </nav>

      {!loading && <ScrollDrivenMorph />}
      {!loading && <SelectedWork />}
    </main>
  );
}
