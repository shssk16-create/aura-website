import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="prose prose-slate max-w-3xl">
      <Link
        href="/app"
        className="not-prose inline-flex items-center gap-1 text-sm font-bold text-aura-dark/60 hover:text-aura-blue"
      >
        <ArrowLeft className="h-4 w-4 rotate-180" />
        العودة
      </Link>

      <h1 className="mt-4 text-3xl font-black text-aura-dark">دليل الاستخدام</h1>
      <p className="text-aura-dark/70">
        أورا منصَّة وكلاء ذكاء اصطناعي لإدارة الحملات التسويقية بالعربية البيضاء.
        هذا الدليل يلخِّص كيفية ربط النماذج، تشغيل البروكسي، وتوليد الإبداع.
      </p>

      <h2 className="mt-8 text-xl font-black text-aura-dark">١. ربط النماذج</h2>
      <p className="text-aura-dark/75">
        لكل وكيل متغيِّر بيئة يحدِّد نقطة الاستدلال. مثال:
      </p>
      <pre className="rounded-xl bg-aura-dark/95 p-4 text-sm text-aura-mist" dir="ltr">
{`JAIS_API_URL=https://jais.local/v1/chat
DEEPSEEK_API_URL=https://deepseek.local/v1/chat
FLUX_API_URL=https://flux.local/v1/images`}
      </pre>

      <h2 className="mt-8 text-xl font-black text-aura-dark">
        ٢. سكربت طباعة النص العربي
      </h2>
      <p className="text-aura-dark/75">
        داخل المشروع، استخدم السكربت التالي لطبع النص العربي على الصورة:
      </p>
      <pre className="rounded-xl bg-aura-dark/95 p-4 text-sm text-aura-mist" dir="ltr">
{`python scripts/overlay_arabic.py \\
  --image background.png \\
  --text "هالتك الفارقة" \\
  --output final.png`}
      </pre>

      <h2 className="mt-8 text-xl font-black text-aura-dark">
        ٣. تدفُّق العمل (Workflow)
      </h2>
      <ol className="list-decimal space-y-2 pr-4 text-aura-dark/75">
        <li>المستخدم يدخل تفاصيل الحملة من الواجهة.</li>
        <li>الطلب يمرُّ إلى Node.js مع توقيع المصادقة.</li>
        <li>
          LangChain يستدعي الوكلاء بالترتيب: Manager → Strategist → Copywriter
          → Designer → Social.
        </li>
        <li>كل وكيل يرسل ناتجه عبر SSE إلى الواجهة.</li>
        <li>الناتج النهائي يُخزَّن في قاعدة البيانات للمراجعة.</li>
      </ol>
    </div>
  );
}
