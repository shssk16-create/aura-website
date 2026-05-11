"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const PLANS = [
  {
    name: "بداية",
    price: "مجاني",
    period: "للاستكشاف",
    cta: "ابدأ مجانًا",
    href: "/app/campaigns/new",
    highlight: false,
    features: [
      "حتى ٣ حملات شهريًا",
      "وكلاء المحتوى + النسخة + التصميم",
      "نماذج LLM مجتمعية مشتركة",
      "نسخة عربية بيضاء أساسية",
    ],
  },
  {
    name: "محترف",
    price: "٤٩٩",
    period: "ر.س / شهريًا",
    cta: "اشترك الآن",
    href: "/app",
    highlight: true,
    features: [
      "حملات غير محدودة",
      "الفريق الكامل: ٨ وكلاء",
      "نقاط استدلال مخصَّصة (Self-hosted)",
      "تكامل مع منصَّات النشر",
      "تقارير أداء أسبوعية",
    ],
  },
  {
    name: "مؤسَّسة",
    price: "حسب الطلب",
    period: "تواصل معنا",
    cta: "تحدَّث مع المبيعات",
    href: "mailto:sales@aura.ai",
    highlight: false,
    features: [
      "استضافة ذاتية كاملة في بنيتك",
      "ضبط دقيق للنماذج على بياناتك",
      "اتفاقية مستوى خدمة مخصَّصة",
      "تكامل LDAP / SSO",
      "دعم مهندس مخصَّص",
    ],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-aura-teal/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-aura-blue">
            الأسعار
          </div>
          <h2 className="text-4xl font-black tracking-tight text-aura-dark md:text-5xl">
            خطَّة تناسب كل مرحلة من نموِّك.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {PLANS.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: idx * 0.06 }}
              className={`relative rounded-3xl border p-8 ${
                plan.highlight
                  ? "border-aura-teal bg-aura-gradient text-white shadow-aura-glow"
                  : "border-aura-silver/40 bg-white/80 backdrop-blur"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 right-8 rounded-full bg-aura-dark px-3 py-1 text-xs font-black text-white">
                  الأكثر شيوعًا
                </span>
              )}
              <h3
                className={`text-xl font-black ${
                  plan.highlight ? "text-white" : "text-aura-dark"
                }`}
              >
                {plan.name}
              </h3>
              <div
                className={`mt-4 flex items-baseline gap-2 ${
                  plan.highlight ? "text-white" : "text-aura-dark"
                }`}
              >
                <span className="text-4xl font-black">{plan.price}</span>
                <span className="text-sm opacity-80">{plan.period}</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className={`flex items-start gap-2 ${
                      plan.highlight ? "text-white/90" : "text-aura-dark/80"
                    }`}
                  >
                    <Check
                      className={`mt-0.5 h-4 w-4 shrink-0 ${
                        plan.highlight ? "text-white" : "text-aura-teal"
                      }`}
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-black transition ${
                  plan.highlight
                    ? "bg-white text-aura-blue hover:bg-aura-mist"
                    : "bg-aura-dark text-white hover:bg-aura-blue"
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
