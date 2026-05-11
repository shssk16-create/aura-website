"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all ${
        scrolled
          ? "bg-white/80 backdrop-blur-md border-b border-aura-silver/40"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-aura-gradient text-white font-black shadow-aura-glow">
            A
          </span>
          <span className="text-xl font-black tracking-tighter text-aura-dark">
            AURA<span className="text-aura-teal"> AI</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#agents"
            className="text-sm font-medium text-aura-dark/80 hover:text-aura-blue"
          >
            فريق الوكلاء
          </a>
          <a
            href="#how"
            className="text-sm font-medium text-aura-dark/80 hover:text-aura-blue"
          >
            كيف يعمل
          </a>
          <a
            href="#pricing"
            className="text-sm font-medium text-aura-dark/80 hover:text-aura-blue"
          >
            الأسعار
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/app"
            className="hidden rounded-full border border-aura-silver/60 px-4 py-2 text-sm font-bold text-aura-dark transition hover:border-aura-teal hover:text-aura-blue md:inline-flex"
          >
            تسجيل الدخول
          </Link>
          <Link
            href="/app/campaigns/new"
            className="rounded-full bg-aura-blue px-5 py-2 text-sm font-bold text-white shadow-aura-glow transition hover:bg-aura-dark"
          >
            ابدأ مجانًا
          </Link>
        </div>
      </div>
    </nav>
  );
}
