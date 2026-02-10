"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence mode="wait" onExitComplete={onComplete}>
      {count < 100 && (
        <motion.div
          key="loader"
          exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0F172A] text-[#58A8B4]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#58A8B4]/10 to-transparent opacity-50" />
          <h2 className="mb-8 text-sm uppercase tracking-widest text-[#58A8B4]/80">Warning: Aura is bright</h2>
          <div className="text-9xl font-bold tabular-nums tracking-tighter text-[#58A8B4] mix-blend-screen">
            {count}%
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
