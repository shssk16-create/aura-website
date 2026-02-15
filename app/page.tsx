"use client";
import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, Search, Zap, BarChart3, PenTool, Layout } from "lucide-react";

import LoadingScreen from "@/components/LoadingScreen";
import AuraBackground from "@/components/AuraShader";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const container = useRef(null);
  const halaRef = useRef(null); // مرجع لشخصية هالة

  useGSAP(() => {
    if (isLoading) return;

    // 1. Hero Animation: Kinetic Typography
    gsap.from(".hero-text-char", {
      y: 100,
      opacity: 0,
      stagger: 0.05,
      duration: 1,
      ease: "power4.out",
      scrollTrigger: { trigger: ".hero-section" }
    });

    // 2. Hala Follows Mouse (Agentic UX)
    const moveHala = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 50;
      const y = (e.clientY / window.innerHeight - 0.5) * 50;
      gsap.to(halaRef.current, { x: x, y: y, duration: 1, ease: "power2.out" });
    };
    window.addEventListener("mousemove", moveHala);

    // 3. Stats Scroll Animation
    gsap.from(".stat-card", {
      y: 100,
      opacity: 0,
      stagger: 0.2,
      scrollTrigger: {
        trigger: ".stats-section",
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1
      }
    });

    return () => window.removeEventListener("mousemove", moveHala);
  }, [isLoading]);

  return (
    <main ref={container} className="min-h-screen relative" dir="rtl">
      <Head>
        <title>أورا | هالتك الفارقة في عالم التسويق</title>
        <meta name="description" content="وكالة تسويق رقمي سعودية رائدة برؤية 2030" />
      </Head>

      {/* 0. المؤثرات الخلفية */}
      <div className="bg-noise" />
      <AuraBackground />

      {/* شاشة التحميل */}
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {!isLoading && (
        <>
          {/* Header */}
          <header className="fixed top-0 w-full z-40 p-6 flex justify-between items-center mix-blend-difference text-white">
            <h1 className="text-3xl font-black tracking-tighter">AURA</h1>
            <nav className="hidden md:flex gap-8 text-sm font-bold">
              <a href="#services" className="hover:text-[#58A8B4] transition-colors">خدماتنا</a>
              <a href="#about" className="hover:text-[#58A8B4] transition-colors">عن أورا</a>
              <a href="#contact" className="hover:text-[#58A8B4] transition-colors">تواصل معنا</a>
            </nav>
          </header>

          {/* 1. Hero Section: المستقبل يرحب بك */}
          <section className="hero-section h-screen flex flex-col items-center justify-center relative z-10 px-4">
            {/* هالة: الوكيل الرقمي */}
            <div ref={halaRef} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-60 blur-3xl rounded-full bg-gradient-to-r from-[#58A8B4] to-[#438FB3] -z-10 animate-pulse" />
            
            <div className="text-center">
              <h2 className="text-xl md:text-2xl font-medium text-[#1F2937] mb-4">أهلاً بك في المستقبل</h2>
              <h1 className="text-6xl md:text-8xl font-black text-[#1F2937] leading-tight mb-6 overflow-hidden">
                <span className="inline-block hero-text-char">هالتك</span>{" "}
                <span className="inline-block hero-text-char text-transparent bg-clip-text bg-gradient-to-r from-[#438FB3] to-[#58A8B4]">الفارقة</span>
                <br />
                <span className="inline-block hero-text-char">في عالم التسويق</span>
              </h1>
              <p className="max-w-2xl mx-auto text-lg text-gray-700 mb-10">
                في "أورا"، نحن لا نقدم خدمات تسويقية فحسب؛ نحن نصنع "هالة" من الإبداع تحيط بعلامتك التجارية لتجعلها الرقم الصعب في السوق السعودي.
              </p>
              <button className="group relative px-8 py-4 bg-[#1F2937] text-white rounded-full overflow-hidden shadow-lg hover:shadow-[#58A8B4]/50 transition-all duration-300">
                <span className="relative z-10 flex items-center gap-2 font-bold">
                  ابدأ رحلتك مع هالة <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-[#438FB3] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-right duration-500" />
              </button>
            </div>
          </section>

          {/* 2. Services: Bento Grid اللمسية */}
          <section id="services" className="py-20 px-6 relative z-10">
            <div className="max-w-7xl mx-auto">
              <h3 className="text-4xl font-bold mb-12 text-[#1F2937]">خدماتنا: حلول مخصصة لقلب المملكة</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Service 1 */}
                <div className="liquid-glass p-8 rounded-3xl md:col-span-2 hover:scale-[1.02] transition-transform duration-500 group cursor-none">
                  <div className="flex justify-between items-start mb-8">
                    <Search className="w-10 h-10 text-[#438FB3]" />
                    <span className="text-xs font-bold border border-[#1F2937] px-3 py-1 rounded-full">SEO 2.0</span>
                  </div>
                  <h4 className="text-2xl font-bold mb-4 group-hover:text-[#438FB3] transition-colors">تحسين محركات البحث (SEO)</h4>
                  <p className="text-gray-700">نركز على "سيو النية" واستهداف الكلمات المفتاحية ذات القوة الشرائية العالية في الرياض وجدة، لضمان تصدرك النتائج العضوية.</p>
                </div>

                {/* Service 2 */}
                <div className="liquid-glass p-8 rounded-3xl hover:scale-[1.02] transition-transform duration-500 group">
                  <Layout className="w-10 h-10 text-[#58A8B4] mb-8" />
                  <h4 className="text-2xl font-bold mb-4">إدارة التواصل</h4>
                  <p className="text-gray-700">صناعة محتوى "فيروسي" يحترم القيم المحلية ويتحدث بلسان الجمهور السعودي.</p>
                </div>

                 {/* Service 3 */}
                 <div className="liquid-glass p-8 rounded-3xl hover:scale-[1.02] transition-transform duration-500 group">
                  <PenTool className="w-10 h-10 text-[#58A8B4] mb-8" />
                  <h4 className="text-2xl font-bold mb-4">الهوية البصرية</h4>
                  <p className="text-gray-700">تصاميم تدمج الأصالة مع الطابع المستقبلي لـ "هالتك".</p>
                </div>

                {/* Service 4 */}
                <div className="liquid-glass p-8 rounded-3xl md:col-span-2 hover:scale-[1.02] transition-transform duration-500 group">
                  <BarChart3 className="w-10 h-10 text-[#438FB3] mb-8" />
                  <h4 className="text-2xl font-bold mb-4">إدارة الحملات (PPC)</h4>
                  <p className="text-gray-700">استراتيجيات مبنية على البيانات لتحقيق أعلى عائد على الاستثمار (ROI) بأقل تكلفة.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Stats: النمو المرئي */}
          <section className="stats-section py-32 relative z-10 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="stat-card">
                <div className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#1F2937] to-transparent">
                  +250%
                </div>
                <p className="text-xl font-bold text-[#438FB3] mt-4">نمو في المبيعات</p>
              </div>
              <div className="stat-card">
                <div className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#1F2937] to-transparent">
                  +1.5M
                </div>
                <p className="text-xl font-bold text-[#58A8B4] mt-4">وصول مستهدف</p>
              </div>
              <div className="stat-card">
                <div className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#1F2937] to-transparent">
                  2030
                </div>
                <p className="text-xl font-bold text-[#438FB3] mt-4">متوافقون مع الرؤية</p>
              </div>
            </div>
          </section>

          {/* 4. Contact: المساعد الشخصي الاستباقي */}
          <section id="contact" className="py-20 px-6 relative z-10 mb-20">
            <div className="max-w-4xl mx-auto liquid-glass p-10 md:p-16 rounded-[3rem] text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#438FB3] to-[#58A8B4]" />
              
              <h3 className="text-4xl font-bold mb-6">هل أنت مستعد لتكون هالتك هي الفارقة؟</h3>
              <p className="mb-10 text-lg text-gray-600">
                تواصل معنا اليوم في "أورا للتسويق" لنرسم معاً ملامح مستقبلك الرقمي انطلاقاً من أطهر البقاع.
              </p>
              
              <form className="space-y-6 text-right max-w-lg mx-auto">
                <div className="relative group">
                    <input type="text" placeholder="اسمك الكريم" className="w-full bg-white/50 border-b-2 border-gray-300 focus:border-[#438FB3] outline-none py-3 px-4 transition-all" />
                    <Zap className="absolute left-4 top-3 text-[#58A8B4] opacity-0 group-focus-within:opacity-100 transition-opacity" />
                </div>
                <div className="relative group">
                    <input type="email" placeholder="بريدك الإلكتروني" className="w-full bg-white/50 border-b-2 border-gray-300 focus:border-[#438FB3] outline-none py-3 px-4 transition-all" />
                </div>
                <button type="submit" className="w-full bg-[#1F2937] text-white py-4 rounded-full font-bold hover:bg-[#438FB3] transition-colors shadow-xl">
                  إرسال الطلب لـ هالة
                </button>
              </form>
            </div>
          </section>
          
          <footer className="text-center pb-8 text-gray-500 text-sm">
            © 2026 Aura Marketing. Made with Fluid Luminosity.
          </footer>
        </>
      )}
    </main>
  );
}
