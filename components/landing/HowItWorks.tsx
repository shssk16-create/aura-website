"use client";
import { motion } from "framer-motion";

const STEPS = [
  {
    n: "01",
    title: "أدخل تفاصيل الحملة",
    body: "اسم العلامة، الهدف، الجمهور، القناة، والنبرة — في نموذج واحد قصير. هالة تتولَّى الباقي.",
  },
  {
    n: "02",
    title: "البروكسي الآمن يستلم",
    body: "كل الطلبات تمرُّ عبر Node.js + LangChain. لا تُكشف مفاتيحك للواجهة الأمامية أبدًا.",
  },
  {
    n: "03",
    title: "Jais-2 يكتب النسخة",
    body: "عربية بيضاء فصيحة، مناسبة للنبرة المؤسسية، بعيدة عن الترجمة الحرفية.",
  },
  {
    n: "04",
    title: "FLUX.1 يولِّد الخلفية",
    body: "صورة فائقة الواقعية مع مساحة سلبية مخصَّصة لتلقِّي النص العربي لاحقًا.",
  },
  {
    n: "05",
    title: "Python يطبع النص بدقَّة",
    body: "Pillow + arabic-reshaper + python-bidi يضعون الحروف موصولة وبترتيب صحيح ١٠٠٪.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="relative bg-white/40 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 grid grid-cols-1 gap-8 md:grid-cols-2 md:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-aura-blue/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-aura-blue">
              <span className="h-1.5 w-1.5 rounded-full bg-aura-blue" />
              كيف يعمل
            </div>
            <h2 className="text-4xl font-black tracking-tight text-aura-dark md:text-5xl">
              من فكرة إلى منشور حيّ في خمس خطوات.
            </h2>
          </div>
          <p className="text-lg text-aura-dark/70">
            خط الإنتاج بأكمله مرئيّ للمستخدم. لا صناديق سوداء — تستطيع التدخُّل
            في أي خطوة، تعديل الناتج، أو إعادة تشغيل الوكيل بمعاملات جديدة.
          </p>
        </div>

        <ol className="grid grid-cols-1 gap-4 md:grid-cols-5">
          {STEPS.map((step, idx) => (
            <motion.li
              key={step.n}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
              className="relative rounded-2xl border border-aura-silver/40 bg-white/80 p-6 backdrop-blur"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl font-black text-aura-teal">
                  {step.n}
                </span>
                {idx < STEPS.length - 1 && (
                  <span className="hidden text-aura-silver md:inline">←</span>
                )}
              </div>
              <h3 className="mt-4 text-base font-black text-aura-dark">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-aura-dark/70">
                {step.body}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
