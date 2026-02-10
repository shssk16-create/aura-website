"use client";
import { useEffect, useState } from "react";
import Lenis from "lenis";
import { motion } from "framer-motion";
import LoadingScreen from "@/components/LoadingScreen";
import Hero3D from "@/components/Hero3D";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }, []);

  return (
    <main className="bg-[#F8FAFC] min-h-screen selection:bg-[#58A8B4] selection:text-white">
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <div className="glass-capsule px-6 py-3 rounded-full flex gap-8 text-sm font-medium text-[#0F172A] border border-white/40 shadow-sm backdrop-blur-md bg-white/30">
          <a href="#" className="hover:text-[#438FB3] transition-colors">Home</a>
          <a href="#" className="hover:text-[#438FB3] transition-colors">Work</a>
          <button className="bg-[#438FB3] text-white px-4 py-1 rounded-full text-xs hover:shadow-lg transition-all">Let's Talk</button>
        </div>
      </nav>

      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {!loading && <Hero3D />}
        {!loading && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="z-10 text-center px-4"
          >
            <h1 className="text-6xl md:text-8xl font-bold text-[#0F172A] tracking-tighter mb-6">
              We Create <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#58A8B4] to-[#438FB3]">
                Your Digital Aura.
              </span>
            </h1>
            <p className="text-xl text-[#0F172A]/60 max-w-xl mx-auto">
              Data-driven marketing with a creative soul.
            </p>
          </motion.div>
        )}
      </section>
    </main>
  );
}
