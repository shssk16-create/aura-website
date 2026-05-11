import Link from "next/link";
import { ArrowLeft, KeyRound, Sparkles } from "lucide-react";
import { AGENTS, providerLabel } from "@/lib/agents";
import { isAgentConnectedAsync } from "@/lib/secrets";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const connected = await Promise.all(
    AGENTS.map((a) => isAgentConnectedAsync(a)),
  );
  return (
    <div>
      <Link
        href="/app"
        className="inline-flex items-center gap-1 text-sm font-bold text-aura-dark/60 hover:text-aura-blue"
      >
        <ArrowLeft className="h-4 w-4 rotate-180" />
        العودة
      </Link>
      <div className="mt-4 mb-8">
        <p className="text-sm font-bold uppercase tracking-widest text-aura-blue">
          الإعدادات
        </p>
        <h1 className="mt-1 text-3xl font-black text-aura-dark">
          مركز التحكم
        </h1>
        <p className="mt-2 max-w-2xl text-aura-dark/70">
          أمَّن المفاتيح، درِّب أورا على نبرة علامتك، وراجع توصيل الوكلاء —
          كلُّه من مكان واحد.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card
          href="/app/settings/keys"
          icon={KeyRound}
          accent="blue"
          titleAr="مفاتيح المزوِّدين"
          descAr="الصق مفاتيح NVIDIA NIM وZ.AI وغيرها بأمان. تُحفظ مشفَّرة محليًا ولا تُكشَف بعد الحفظ."
          metaAr="AES‑256‑GCM · paste‑only · مع زرّ اختبار"
        />
        <Card
          href="/app/settings/style"
          icon={Sparkles}
          accent="teal"
          titleAr="ذاكرة الأسلوب"
          descAr="أضِف نصوصًا ناجحة لعلامتك. تُحقن كأمثلة محتذاة في موجِّه الكاتب لتُحاكي النبرة بدقَّة."
          metaAr="عيِّنات مصنَّفة بالعلامة + القناة + النبرة"
        />
      </div>

      <div className="mt-10">
        <h2 className="mb-3 text-lg font-black text-aura-dark">
          توصيل الوكلاء
        </h2>
        <div className="rounded-2xl border border-aura-silver/40 bg-white/80">
          <table className="w-full text-sm">
            <thead className="border-b border-aura-silver/40 text-right text-xs font-bold uppercase tracking-wider text-aura-dark/60">
              <tr>
                <th className="px-5 py-3">الوكيل</th>
                <th className="px-5 py-3">النموذج</th>
                <th className="px-5 py-3">المفتاح المعتمد</th>
                <th className="px-5 py-3">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {AGENTS.map((a, i) => {
                const configured = connected[i];
                const envLabel = a.inference
                  ? `${a.inference.keyEnv} (${providerLabel(a.inference.provider)})`
                  : a.imageInference
                    ? `${a.imageInference.keyEnv} (${providerLabel(a.imageInference.provider)})`
                    : a.endpointEnv;
                return (
                  <tr
                    key={a.id}
                    className="border-b border-aura-silver/30 last:border-0"
                  >
                    <td className="px-5 py-3 font-bold text-aura-dark">
                      {a.nameAr}
                    </td>
                    <td className="px-5 py-3 text-aura-dark/75">{a.model}</td>
                    <td
                      className="px-5 py-3 font-mono text-xs text-aura-blue"
                      dir="ltr"
                    >
                      {envLabel}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                          configured
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-aura-silver/30 text-aura-dark/70"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            configured ? "bg-emerald-500" : "bg-aura-silver"
                          }`}
                        />
                        {configured ? "متَّصل" : "غير مضبوط"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-aura-dark/60">
          هذه نظرة عامَّة. لإدارة المفاتيح، استخدم{" "}
          <Link href="/app/settings/keys" className="font-bold text-aura-blue hover:underline">
            صفحة المفاتيح
          </Link>
          . لاستكشاف قدرات كل وكيل، افتح{" "}
          <Link
            href="/app/agents"
            className="font-bold text-aura-blue hover:underline"
          >
            صفحة الفريق
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

interface CardProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: "blue" | "teal";
  titleAr: string;
  descAr: string;
  metaAr: string;
}

function Card({ href, icon: Icon, accent, titleAr, descAr, metaAr }: CardProps) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-4 rounded-2xl border border-aura-silver/40 bg-white/80 p-5 transition hover:border-aura-blue/40 hover:shadow-md"
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
          accent === "teal"
            ? "bg-aura-teal/15 text-aura-teal"
            : "bg-aura-blue/15 text-aura-blue"
        }`}
      >
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-black text-aura-dark">{titleAr}</h3>
        <p className="mt-1 text-sm leading-relaxed text-aura-dark/75">
          {descAr}
        </p>
        <p className="mt-2 text-xs font-medium uppercase tracking-wider text-aura-blue/80">
          {metaAr}
        </p>
      </div>
    </Link>
  );
}
