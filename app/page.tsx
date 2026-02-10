'use client';

import React, { useEffect, useRef, useState } from 'react';
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring, 
  useInView, 
  useMotionValueEvent,
  AnimatePresence
} from 'framer-motion';
import { 
  Sparkles, 
  ArrowUpLeft, 
  PlayCircle, 
  Disc, 
  Fingerprint, 
  Zap, 
  Palette, 
  Code2, 
  Rocket, 
  Megaphone, 
  LineChart, 
  Mail, 
  Phone, 
  MapPin, 
  Instagram, 
  Twitter, 
  Linkedin,
  Menu,
  X
} from 'lucide-react';
import Lenis from '@studio-freight/lenis';
import Link from 'next/link';

/* -------------------------------------------------------------------------- */
/* COMPONENTS                                */
/* -------------------------------------------------------------------------- */

// --- 1. Navbar Component ---
const Navbar = () => {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) setHidden(true);
    else setHidden(false);
    setScrolled(latest > 50);
  });

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3' : 'py-6'
      }`}
    >
      <div className="container mx-auto px-6 md:px-12">
        <div className={`flex items-center justify-between transition-all duration-300 ${
            scrolled 
            ? 'bg-[#0a0f1e]/60 backdrop-blur-xl border border-white/10 rounded-full pl-3 pr-4 py-2 shadow-lg shadow-purple-900/10' 
            : 'bg-transparent'
        }`}>
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group relative z-10">
            <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-tr from-violet-600 to-blue-600 rounded-xl rotate-3 group-hover:rotate-12 transition-transform duration-500">
                <Sparkles className="text-white w-5 h-5" />
                <div className="absolute inset-0 bg-white/40 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            <span className="text-2xl font-black tracking-wider text-white">
              AURA<span className="text-cyan-400">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-300">
            {['الرئيسية', 'خدماتنا', 'عن الأورا', 'أعمالنا'].map((item, index) => (
              <Link key={index} href={`#${item}`} className="relative hover:text-white transition-colors group py-2">
                {item}
                <span className="absolute bottom-0 right-0 w-0 h-[2px] bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden md:flex px-6 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-bold items-center gap-2 shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-shadow"
            >
                ابدأ هالتك
            </motion.button>
            
            {/* Mobile Menu Toggle */}
            <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
            <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden absolute top-full left-0 w-full bg-[#0a0f1e] border-b border-white/10 overflow-hidden"
            >
                <div className="flex flex-col p-6 gap-4 text-center">
                    {['الرئيسية', 'خدماتنا', 'عن الأورا', 'أعمالنا'].map((item) => (
                        <Link key={item} href="#" className="text-slate-300 hover:text-white py-2 text-lg">{item}</Link>
                    ))}
                    <button className="w-full py-4 rounded-xl bg-violet-600 text-white font-bold mt-4">ابدأ مشروعك</button>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

// --- 2. Hero Component ---
const HeroSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring", damping: 12, stiffness: 100 }
    },
    hidden: { opacity: 0, y: 50, filter: "blur(10px)" },
  };

  return (
    <section ref={ref} className="relative z-20 min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-violet-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>

      <div className="container mx-auto px-6 md:px-12 flex flex-col items-center text-center relative z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium mb-8 backdrop-blur-md"
        >
          <Sparkles size={14} className="animate-pulse text-cyan-400" />
          <span>وكالة الجيل القادم الإبداعية</span>
        </motion.div>

        <motion.div variants={container} initial="hidden" animate={isInView ? "visible" : "hidden"} className="max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[1.15] mb-8 text-white">
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
              {['نصنع', 'لك', 'وجوداً', 'رقمياً'].map((word, idx) => (
                <motion.span key={idx} variants={child} className="inline-block">{word}</motion.span>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
                <motion.span variants={child}>لا يمكن</motion.span>
                <motion.span variants={child} className="relative inline-block group">
                    <span className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-500 blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"></span>
                    <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                    تجاهل هالته.
                    </span>
                </motion.span>
            </div>
          </h1>

          <motion.p 
             initial={{ opacity: 0 }}
             animate={isInView ? { opacity: 1 } : {}}
             transition={{ delay: 1, duration: 1 }}
             className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            في عالم مزدحم بالضجيج، لا يكفي أن تكون موجوداً. يجب أن تكون <span className="text-white font-bold glow-text">مُشعاً</span>. نحن نمزج السحر البصري بالذكاء الاصطناعي لنمنح علامتك التجارية هالتها الفارقة.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2, type: "spring" }}
          className="flex flex-col sm:flex-row gap-5"
        >
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="px-10 py-5 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-white text-lg font-bold flex items-center gap-3 shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:shadow-[0_0_50px_rgba(124,58,237,0.6)] transition-all"
          >
            اطلب استشارة مجانية 
            <ArrowUpLeft size={24} />
          </motion.button>

          <motion.button 
             whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" }}
             whileTap={{ scale: 0.98 }}
             className="px-10 py-5 rounded-full text-lg font-bold text-white border border-white/10 flex items-center gap-3 backdrop-blur-sm hover:border-violet-500/50 transition-colors"
          >
            <PlayCircle size={24} className="text-cyan-400" />
            شاهد الفيديو
          </motion.button>
        </motion.div>
      </div>

       {/* Scroll Indicator */}
       <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ delay: 2, duration: 2, repeat: Infinity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-500 flex flex-col items-center gap-2 text-sm"
        >
            <span>اكتشف الهالة</span>
            <div className="w-5 h-10 border-2 border-white/10 rounded-full flex justify-center pt-2">
                <motion.div 
                    animate={{ y: [0, 12, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-1 h-2 bg-cyan-400 rounded-full"
                />
            </div>
        </motion.div>
    </section>
  );
};

// --- 3. Concept Component ---
const ConceptSection = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const ySlow = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 45]);

    return (
        <section ref={ref} className="relative z-20 py-32 overflow-hidden bg-[#02040a]">
             <div className="container mx-auto px-6 md:px-12 relative">
                {/* Parallax Background Text */}
                <motion.div style={{ y: ySlow }} className="absolute top-0 right-0 text-[15rem] md:text-[20rem] font-black text-white/[0.02] leading-none pointer-events-none select-none -z-10">
                    AURA
                </motion.div>

                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight text-white">
                            ما هي <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">الهالة</span> <br/> في عالم التسويق؟
                        </h2>
                        <p className="text-lg text-slate-400 mb-10 leading-relaxed">
                             التسويق التقليدي يصرخ لطلب الانتباه. أما تسويق "الأورا" فهو يهمس، لكن همسه مسموع أكثر من أي صراخ. هي الطاقة غير المرئية التي تجعل عميلك يشعر بالولاء قبل أن يشتري.
                        </p>
                        
                        <div className="space-y-6">
                            {[
                                { icon: Disc, title: "جاذبية مغناطيسية", desc: "تصميمات تجبر العميل على التوقف." },
                                { icon: Fingerprint, title: "هوية لا تتكرر", desc: "بصمة بصرية يستحيل تقليدها." },
                                { icon: Zap, title: "تأثير فوري", desc: "إقناع في أول 3 ثوانٍ." },
                            ].map((item, index) => (
                                <motion.div 
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.2 }}
                                    viewport={{ once: true }}
                                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] transition-colors group"
                                >
                                    <div className="bg-violet-500/10 p-3 rounded-xl text-violet-400 group-hover:text-cyan-400 transition-colors">
                                        <item.icon size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-1">{item.title}</h4>
                                        <p className="text-slate-400 text-sm">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Abstract Visual */}
                    <motion.div style={{ rotate }} className="relative hidden md:flex justify-center items-center">
                        <div className="absolute inset-0 bg-gradient-to-tr from-violet-600 to-cyan-600 rounded-full blur-[80px] opacity-20 animate-pulse"></div>
                        <div className="relative w-80 h-80 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3rem] flex items-center justify-center overflow-hidden shadow-2xl">
                             <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-transparent"></div>
                             <Zap size={100} className="text-white/20" />
                        </div>
                    </motion.div>
                </div>
             </div>
        </section>
    )
}

// --- 4. Bento Grid Component ---
const BentoCard = ({ title, desc, icon: Icon, className, delay = 0, colSpan = "" }: any) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        viewport={{ once: true, margin: "-50px" }}
        whileHover={{ y: -5 }}
        className={`relative p-8 rounded-3xl bg-[#0f1623]/80 border border-white/5 overflow-hidden group hover:border-violet-500/30 transition-all duration-500 ${colSpan} ${className}`}
      >
        {/* Glow Effect on Hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-transparent to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

        <div className="relative z-10">
            <div className="mb-6 inline-flex p-3 rounded-2xl bg-white/5 border border-white/5 text-cyan-400 group-hover:text-violet-400 group-hover:scale-110 transition-all duration-300">
                <Icon size={28} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
            <p className="text-slate-400 leading-relaxed text-sm md:text-base">{desc}</p>
        </div>

        <div className="mt-8 flex items-center text-cyan-400 font-bold text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            اقرأ المزيد <ArrowUpLeft size={16} className="mr-2" />
        </div>
      </motion.div>
    );
};

const ServicesBento = () => {
    return (
        <section className="relative z-20 py-32 bg-[#02040a]">
            <div className="container mx-auto px-6 md:px-12">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        خدمات تصنع <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-cyan-400">الفرق</span>
                    </h2>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        حلول متكاملة مصممة لرفع قيمة علامتك التجارية وزيادة جاذبيتها في السوق الرقمي.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <BentoCard
                        colSpan="md:col-span-2"
                        title="تطوير ويب & Next.js"
                        desc="مواقع فائقة السرعة، متجاوبة، ومبنية بأحدث تقنيات 2026. نضمن لك تصدر محركات البحث وأداء لا يضاهى."
                        icon={Code2}
                        delay={0.1}
                    />
                    <BentoCard
                        title="تطبيقات الموبايل"
                        desc="تصميم وتطوير تطبيقات iOS و Android بتجربة مستخدم (UX) سلسة وساحرة."
                        icon={Palette}
                        delay={0.2}
                    />
                    <BentoCard
                        title="الهوية البصرية"
                        desc="نبني نظاماً بصرياً (Brand System) يعكس قيمك ويحفر مكانك في ذاكرة الجمهور."
                        icon={Rocket}
                        delay={0.3}
                    />
                     <BentoCard
                        colSpan="md:col-span-2"
                        title="استراتيجيات النمو الرقمي"
                        desc="خطط تسويقية تعتمد على البيانات والذكاء الاصطناعي. نستهدف جمهورك بدقة لتحويل الزوار إلى عملاء دائمين."
                        icon={LineChart}
                        delay={0.4}
                    />
                    <BentoCard
                        title="إدارة السوشيال ميديا"
                        desc="محتوى إبداعي، تصاميم جذابة، وإدارة مجتمعات احترافية."
                        icon={Megaphone}
                        delay={0.5}
                    />
                </div>
            </div>
        </section>
    )
}

// --- 5. Footer Component ---
const Footer = () => {
    return (
        <footer className="relative z-20 bg-[#010205] pt-32 pb-10 border-t border-white/5 overflow-hidden">
             {/* Glow Background */}
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-violet-900/10 to-transparent blur-[100px] pointer-events-none"></div>

             <div className="container mx-auto px-6 md:px-12 relative">
                {/* CTA Box */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative rounded-[3rem] bg-[#0a0f1e]/50 border border-white/10 p-12 md:p-20 text-center mb-24 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/20 via-transparent to-cyan-600/20 opacity-50 mix-blend-overlay"></div>
                    <h2 className="text-4xl md:text-7xl font-black text-white mb-8 leading-tight">
                        جاهز لتُشع <br/> 
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">بهالتك الفارقة؟</span>
                    </h2>
                    <button className="px-12 py-6 rounded-full bg-white text-black text-xl font-bold hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                        احجز استشارتك الآن
  
