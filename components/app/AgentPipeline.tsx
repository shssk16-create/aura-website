"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Loader2,
  CheckCircle2,
  CircleDashed,
  AlertCircle,
  PlayCircle,
} from "lucide-react";
import { type AgentId, type AgentDefinition } from "@/lib/agents";
import { agentIcon } from "@/components/app/AgentIcon";
import type { Campaign } from "@/lib/store";

type RunStatus = "pending" | "running" | "completed" | "failed";

interface UiAgent {
  id: AgentId;
  status: RunStatus;
  output: string;
}

interface UiCreative {
  headlineAr: string;
  copyAr: string;
  cta: string;
  imageUrl: string | null;
}

export default function AgentPipeline({
  campaign,
  agentDefs,
}: {
  campaign: Campaign;
  agentDefs: AgentDefinition[];
}) {
  const agentMap = useMemo(() => {
    const m: Record<AgentId, AgentDefinition> = {};
    for (const a of agentDefs) m[a.id] = a;
    return m;
  }, [agentDefs]);
  const [agents, setAgents] = useState<UiAgent[]>(() =>
    campaign.pipeline.map((r) => ({
      id: r.agentId,
      status: r.status,
      output: r.output,
    })),
  );
  const [creative, setCreative] = useState<UiCreative | null>(
    campaign.creative,
  );
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(campaign.status === "completed");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const startedRef = useRef(false);

  async function start() {
    if (running || done) return;
    setRunning(true);
    setErrorMsg(null);

    setAgents((prev) =>
      prev.map((a) => ({ ...a, status: "pending", output: "" })),
    );

    try {
      const res = await fetch(`/api/campaigns/${campaign.id}/run`, {
        method: "POST",
      });
      if (!res.body) throw new Error("لا يوجد دفق استجابة");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done: streamDone, value } = await reader.read();
        if (streamDone) break;
        buffer += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buffer.indexOf("\n\n")) !== -1) {
          const raw = buffer.slice(0, nl);
          buffer = buffer.slice(nl + 2);
          for (const line of raw.split("\n")) {
            if (!line.startsWith("data: ")) continue;
            const json = line.slice(6);
            if (!json) continue;
            try {
              handleEvent(JSON.parse(json));
            } catch {
              // ignore malformed event
            }
          }
        }
      }
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setRunning(false);
    }
  }

  function handleEvent(ev: unknown) {
    if (!ev || typeof ev !== "object") return;
    const e = ev as { type: string } & Record<string, unknown>;
    switch (e.type) {
      case "agent_start":
        setAgents((prev) =>
          prev.map((a) =>
            a.id === e.agentId ? { ...a, status: "running", output: "" } : a,
          ),
        );
        break;
      case "agent_delta":
        setAgents((prev) =>
          prev.map((a) =>
            a.id === e.agentId
              ? { ...a, output: a.output + (e.delta as string) }
              : a,
          ),
        );
        break;
      case "agent_artefact": {
        const artefact = e.artefact as
          | { kind: "image"; url: string }
          | {
              kind: "creative";
              headlineAr: string;
              copyAr: string;
              cta: string;
            };
        if (artefact.kind === "image") {
          setCreative((prev) => ({
            headlineAr: prev?.headlineAr ?? "",
            copyAr: prev?.copyAr ?? "",
            cta: prev?.cta ?? "",
            imageUrl: artefact.url,
          }));
        } else {
          setCreative((prev) => ({
            headlineAr: artefact.headlineAr,
            copyAr: artefact.copyAr,
            cta: artefact.cta,
            imageUrl: prev?.imageUrl ?? null,
          }));
        }
        break;
      }
      case "agent_done":
        setAgents((prev) =>
          prev.map((a) =>
            a.id === e.agentId ? { ...a, status: "completed" } : a,
          ),
        );
        break;
      case "pipeline_done":
        setDone(true);
        break;
      case "error":
        setErrorMsg(typeof e.message === "string" ? e.message : "خطأ غير معروف");
        break;
    }
  }

  // Auto-start on first mount for draft campaigns.
  useEffect(() => {
    if (startedRef.current) return;
    if (campaign.status === "draft") {
      startedRef.current = true;
      start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-3 lg:col-span-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-aura-dark">
            خط إنتاج الوكلاء
          </h2>
          {!running && !done && (
            <button
              onClick={start}
              className="inline-flex items-center gap-2 rounded-full bg-aura-blue px-4 py-2 text-sm font-bold text-white shadow-aura-glow hover:bg-aura-dark"
            >
              <PlayCircle className="h-4 w-4" />
              تشغيل الخط
            </button>
          )}
          {running && (
            <span className="inline-flex items-center gap-2 text-sm font-bold text-aura-blue">
              <Loader2 className="h-4 w-4 animate-spin" />
              جاري التنفيذ…
            </span>
          )}
          {done && (
            <span className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
              اكتمل
            </span>
          )}
        </div>

        {errorMsg && (
          <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {errorMsg}
          </div>
        )}

        <ol className="space-y-3">
          {agents.map((a, idx) => {
            const def = agentMap[a.id];
            const Icon = agentIcon(def?.icon ?? "Bot");
            const nameAr = def?.nameAr ?? a.id;
            const model = def?.model ?? "—";
            const accent = def?.accent ?? "blue";
            return (
              <li
                key={a.id}
                className={`relative overflow-hidden rounded-2xl border bg-white/80 p-5 transition ${
                  a.status === "running"
                    ? "border-aura-teal agent-pulse"
                    : a.status === "completed"
                      ? "border-emerald-200"
                      : a.status === "failed"
                        ? "border-rose-200"
                        : "border-aura-silver/40"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      accent === "teal"
                        ? "bg-aura-teal/15 text-aura-teal"
                        : accent === "silver"
                          ? "bg-aura-silver/30 text-aura-dark"
                          : "bg-aura-blue/15 text-aura-blue"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h3 className="text-base font-black text-aura-dark">
                          {nameAr}
                          <span className="mr-2 text-xs font-medium text-aura-dark/40">
                            #{idx + 1}
                          </span>
                        </h3>
                        <p className="text-[11px] font-medium uppercase tracking-wider text-aura-blue/70">
                          {model}
                        </p>
                      </div>
                      <StatusIcon status={a.status} />
                    </div>
                    {a.output && (
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-aura-dark/80">
                        {a.output}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <aside className="space-y-4">
        <h2 className="text-lg font-black text-aura-dark">المعاينة النهائية</h2>
        <div className="rounded-2xl border border-aura-silver/40 bg-white/80 p-4">
          {creative?.imageUrl ? (
            // SVG generated dynamically by /api/images/overlay — next/image's
            // optimizer can't help here, so a plain <img> is the right tool.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={creative.imageUrl}
              alt="معاينة الإبداع"
              className="aspect-[1200/630] w-full rounded-xl border border-aura-silver/30 object-cover"
            />
          ) : (
            <div className="flex aspect-[1200/630] w-full items-center justify-center rounded-xl border border-dashed border-aura-silver/60 bg-aura-mist text-sm text-aura-dark/40">
              ستظهر الصورة هنا فور انتهاء المصمِّم.
            </div>
          )}
          <div className="mt-4 space-y-2">
            <Detail label="العنوان" value={creative?.headlineAr ?? "—"} />
            <Detail label="النسخة" value={creative?.copyAr ?? "—"} multiline />
            <Detail label="دعوة فعل" value={creative?.cta ?? "—"} />
          </div>
        </div>

        <div className="rounded-2xl border border-aura-silver/40 bg-aura-mist p-4 text-xs text-aura-dark/70">
          <div className="mb-2 font-bold text-aura-dark">معلومة</div>
          النص العربي على الصورة يُطبع عبر سكربت بايثون يستخدم{" "}
          <code className="font-mono text-[10px]">arabic-reshaper</code> و{" "}
          <code className="font-mono text-[10px]">python-bidi</code> لضمان وصل
          الحروف. الواجهة هنا تستخدم SVG كبديل سريع.
        </div>
      </aside>
    </div>
  );
}

function StatusIcon({ status }: { status: RunStatus }) {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
    case "running":
      return <Loader2 className="h-5 w-5 animate-spin text-aura-blue" />;
    case "failed":
      return <AlertCircle className="h-5 w-5 text-rose-500" />;
    default:
      return <CircleDashed className="h-5 w-5 text-aura-silver" />;
  }
}

function Detail({
  label,
  value,
  multiline,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <div>
      <div className="text-[11px] font-bold uppercase tracking-wider text-aura-dark/50">
        {label}
      </div>
      <div
        className={`text-sm text-aura-dark ${multiline ? "whitespace-pre-wrap leading-relaxed" : "font-semibold"}`}
      >
        {value}
      </div>
    </div>
  );
}
