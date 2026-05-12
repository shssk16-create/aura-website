import Link from "next/link";
import { providerLabel } from "@/lib/agents";
import { getAgents } from "@/lib/registry";
import { isAgentConnectedAsync } from "@/lib/secrets";
import { agentIcon, ArrowLeft } from "@/components/app/AgentIcon";

export const dynamic = "force-dynamic";

export default async function AgentsPage() {
  const AGENTS = await getAgents();
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
        العودة إلى لوحة التحكم
      </Link>
      <div className="mt-4 mb-8">
        <p className="text-sm font-bold uppercase tracking-widest text-aura-blue">
          الفريق
        </p>
        <h1 className="mt-1 text-3xl font-black text-aura-dark">
          {AGENTS.length} وكلاء جاهزون للعمل.
        </h1>
        <p className="mt-2 max-w-2xl text-aura-dark/70">
          كل وكيل يعمل خلف بروكسي Node.js + LangChain. وصِّل نقطة الاستدلال
          المناسبة عبر متغيِّر البيئة الموضَّح بجانبه. لإضافة وكيل جديد أو
          تعديل دوره، افتح{" "}
          <Link
            href="/app/settings/agents"
            className="font-bold text-aura-blue hover:underline"
          >
            إعدادات الوكلاء
          </Link>
          .
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {AGENTS.map((a, i) => {
          const Icon = agentIcon(a.icon);
          const endpointConfigured = connected[i];
          const endpointLabel = a.inference
            ? `${providerLabel(a.inference.provider)} · ${a.inference.keyEnv}`
            : a.imageInference
              ? `${providerLabel(a.imageInference.provider)} · ${a.imageInference.keyEnv}`
              : a.endpointEnv;
          return (
            <div
              key={a.id}
              className="flex items-start gap-4 rounded-2xl border border-aura-silver/40 bg-white/80 p-5"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                  a.accent === "teal"
                    ? "bg-aura-teal/15 text-aura-teal"
                    : a.accent === "silver"
                      ? "bg-aura-silver/30 text-aura-dark"
                      : "bg-aura-blue/15 text-aura-blue"
                }`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-lg font-black text-aura-dark">
                    {a.nameAr}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    {a.custom && (
                      <span className="rounded-full bg-aura-blue/15 px-2 py-0.5 text-[10px] font-bold text-aura-blue">
                        مخصَّص
                      </span>
                    )}
                    {a.disabled ? (
                      <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                        معطَّل
                      </span>
                    ) : (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          endpointConfigured
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-aura-silver/30 text-aura-dark/70"
                        }`}
                      >
                        {endpointConfigured ? "متَّصل" : "وضع التجربة"}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs font-medium uppercase tracking-wider text-aura-blue/70">
                  {a.model}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-aura-dark/75">
                  {a.descriptionAr}
                </p>
                <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-aura-dark/90 px-2 py-1 font-mono text-[10px] text-aura-mist" dir="ltr">
                  {endpointLabel}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
