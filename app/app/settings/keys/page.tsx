import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { listMasks, listSlotConfig } from "@/lib/secrets";
import KeyRow from "@/components/app/KeyRow";

export const dynamic = "force-dynamic";

export default async function KeysPage() {
  const slots = await listSlotConfig();
  const masks = await listMasks();
  const masksByName = new Map(masks.map((m) => [m.slot, m]));

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
          الإعدادات · أمان
        </p>
        <h1 className="mt-1 text-3xl font-black text-aura-dark">
          مفاتيح مزوِّدي الاستدلال
        </h1>
        <p className="mt-2 max-w-2xl text-aura-dark/70">
          الصق المفتاح، احفظه، ثمَّ اختبره. تُشفَّر القيم محليًا بـ AES‑256‑GCM
          ولا تُعرَض ثانيةً في الواجهة بعد الحفظ.
        </p>
      </div>

      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-aura-teal/30 bg-aura-teal/10 p-4 text-sm text-aura-dark/80">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-aura-teal" />
        <div>
          <p className="font-bold text-aura-dark">سياسة الأمان</p>
          <ul className="mt-1 list-inside list-disc space-y-0.5 text-xs">
            <li>
              تُخزَّن المفاتيح مشفَّرة في{" "}
              <code className="font-mono">.data/secrets.enc</code> ولا تُلتقَط
              في سجلَّات Git.
            </li>
            <li>
              مفتاح التشفير الرئيسي يأتي من{" "}
              <code className="font-mono">AURA_MASTER_KEY</code> أو يُولَّد
              تلقائيًا في <code className="font-mono">.data/master.key</code>{" "}
              عند أوَّل تشغيل.
            </li>
            <li>
              الواجهة تعرض الأرقام الأربعة الأخيرة فقط؛ لا توجد طريقة لكشف
              النص الكامل بعد الحفظ.
            </li>
          </ul>
        </div>
      </div>

      <div className="space-y-3">
        {slots.map((slot) => {
          const mask =
            masksByName.get(slot.name) ?? {
              slot: slot.name,
              configured: false,
              source: "none" as const,
              last4: null,
              updatedAt: null,
            };
          return (
            <KeyRow
              key={slot.name}
              slot={{
                name: slot.name,
                labelAr: slot.labelAr,
                providerLabel: slot.providerLabel,
                usedByAr: slot.usedByAr,
                pingable: slot.ping.kind !== "presence-only",
              }}
              mask={mask}
            />
          );
        })}
      </div>
    </div>
  );
}
