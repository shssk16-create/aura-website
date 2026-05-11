"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function LandingHero() {
  return (
    <section className="relative isolate overflow-hidden pt-32 pb-24 md:pt-44 md:pb-32">
      <div className="living-bg" aria-hidden />
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2">
        <div className="order-2 md:order-1">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-aura-silver/60 bg-white/60 px-4 py-2 backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-aura-teal opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-aura-teal" />
            </span>
            <span className="text-sm font-bold text-aura-dark">
              منصة SaaS عربية ذاتية الاستضافة — ٢٠٢٦
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="text-5xl font-black leading-[1.05] tracking-tight text-aura-dark md:text-7xl"
          >
            فريق وكلاء ذكاء اصطناعي
            <br />
            <span className="kinetic-text">يديرون حملاتك</span> بالعربية البيضاء.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-aura-dark/75 md:text-xl"
          >
            أورا منصَّة موحَّدة تربط ثمانية وكلاء ذكاء اصطناعي مفتوحي المصدر —
            من <strong>Jais-2</strong> للكتابة بلغة عربية فصيحة إلى{" "}
            <strong>FLUX.1</strong> لتوليد الصور و <strong>DeepSeek-V4</strong>{" "}
            للتنسيق — كل ذلك خلف بروكسي آمن، بدون كشف مفاتيحك أو بياناتك لأي طرف
            ثالث.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/app/campaigns/new"
              className="group inline-flex items-center gap-2 rounded-full bg-aura-blue px-7 py-4 text-base font-bold text-white shadow-aura-glow transition hover:bg-aura-dark"
            >
              أنشئ أوَّل حملة
              <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            </Link>
            <Link
              href="/app"
              className="inline-flex items-center gap-2 rounded-full border border-aura-silver/70 bg-white/70 px-6 py-4 text-base font-bold text-aura-dark backdrop-blur transition hover:border-aura-teal"
            >
              <Sparkles className="h-5 w-5 text-aura-teal" />
              لوحة التحكم التجريبية
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-10 flex flex-wrap items-center gap-6 text-sm text-aura-dark/60"
          >
            <span>بنية تحتية ذاتية الاستضافة</span>
            <span className="h-1 w-1 rounded-full bg-aura-silver" />
            <span>دعم كامل للـ RTL</span>
            <span className="h-1 w-1 rounded-full bg-aura-silver" />
            <span>وكلاء متخصِّصون في «العربية البيضاء»</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="order-1 md:order-2"
        >
          <HeroOrb />
        </motion.div>
      </div>
    </section>
  );
}

function HeroOrb() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <div className="absolute inset-6 rounded-full bg-aura-gradient blur-3xl opacity-40" />
      <div className="absolute inset-0 rounded-full border border-aura-silver/40 bg-white/40 backdrop-blur-xl shadow-aura-glow" />
      <div className="absolute inset-10 rounded-full border border-aura-silver/30 bg-gradient-to-br from-white/70 to-aura-teal/20 backdrop-blur" />
      <div className="absolute inset-20 flex items-center justify-center rounded-full bg-white shadow-lg">
        <div className="text-center">
          <div className="text-sm font-bold uppercase tracking-widest text-aura-blue">
            هالة
          </div>
          <div className="mt-1 text-lg font-black text-aura-dark">
            Campaign OS
          </div>
        </div>
      </div>
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = 50 + 42 * Math.cos(angle);
        const y = 50 + 42 * Math.sin(angle);
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.06, duration: 0.5 }}
            className="absolute h-3 w-3 rounded-full bg-aura-teal shadow-md"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        );
      })}
    </div>
  );
}
