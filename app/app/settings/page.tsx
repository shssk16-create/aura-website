import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AGENTS, isAgentConnected, providerLabel } from "@/lib/agents";

export default function SettingsPage() {
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
          نقاط استدلال النماذج
        </h1>
        <p className="mt-2 text-aura-dark/70">
          أورا تقرأ نقاط الاستدلال من متغيِّرات البيئة. عدِّل ملف{" "}
          <code className="font-mono">.env.local</code> ثم أعد تشغيل الخادم.
        </p>
      </div>

      <div className="rounded-2xl border border-aura-silver/40 bg-white/80">
        <table className="w-full text-sm">
          <thead className="border-b border-aura-silver/40 text-right text-xs font-bold uppercase tracking-wider text-aura-dark/60">
            <tr>
              <th className="px-5 py-3">الوكيل</th>
              <th className="px-5 py-3">النموذج</th>
              <th className="px-5 py-3">متغيِّر البيئة</th>
              <th className="px-5 py-3">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {AGENTS.map((a) => {
              const configured = isAgentConnected(a);
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
                  <td className="px-5 py-3 font-mono text-xs text-aura-blue" dir="ltr">
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
    </div>
  );
}
