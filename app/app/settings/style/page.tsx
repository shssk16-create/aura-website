import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { listSamples } from "@/lib/style";
import StyleForm from "@/components/app/StyleForm";

export const dynamic = "force-dynamic";

export default async function StylePage() {
  const samples = await listSamples();

  return (
    <div>
      <Link
        href="/app/settings"
        className="inline-flex items-center gap-1 text-sm font-bold text-aura-dark/60 hover:text-aura-blue"
      >
        <ArrowLeft className="h-4 w-4 rotate-180" />
        العودة إلى الإعدادات
      </Link>
      <div className="mt-4 mb-6">
        <p className="text-sm font-bold uppercase tracking-widest text-aura-blue">
          الإعدادات · تدريب النبرة
        </p>
        <h1 className="mt-1 text-3xl font-black text-aura-dark">
          ذاكرة أسلوب العلامة
        </h1>
        <p className="mt-2 max-w-2xl text-aura-dark/70">
          أضِف عيِّنات من نصوص علامتك الأقوى. أورا تختار أنسبَ ثلاث عيِّنات لكل
          حملة وتُحقنها في موجِّه الكاتب كأمثلة محتذاة، فتُحاكي النموذجُ النبرة
          بدل اللجوء إلى صياغة عامَّة.
        </p>
      </div>

      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-aura-blue/20 bg-aura-blue/5 p-4 text-sm text-aura-dark/80">
        <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-aura-blue" />
        <div>
          <p className="font-bold text-aura-dark">كيف يعمل الحقن؟</p>
          <p className="mt-1 text-xs leading-relaxed">
            عند تشغيل حملة، نختار حتَّى ثلاث عيِّنات تطابق العلامة + القناة +
            النبرة (مع تقدير دقيق للأقرب فالأقرب)، ونُلصقها بعنوان «أمثلة
            محتذاة» قبل بيانات الحملة في موجِّه الوكيل. النموذج يحاكي النبرة دون
            نسخ الجمل حرفيًّا.
          </p>
        </div>
      </div>

      <StyleForm samples={samples} />
    </div>
  );
}
