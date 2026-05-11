import Link from "next/link";
import { listCampaigns } from "@/lib/store";
import { AGENTS_BY_ID } from "@/lib/agents";
import { ArrowLeft, Plus, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    draft: "bg-aura-silver/30 text-aura-dark",
    running: "bg-aura-teal/15 text-aura-blue agent-pulse",
    completed: "bg-emerald-100 text-emerald-700",
    failed: "bg-rose-100 text-rose-700",
  };
  const labels: Record<string, string> = {
    draft: "مسوَّدة",
    running: "قيد التنفيذ",
    completed: "مكتملة",
    failed: "فشلت",
  };
  return (
    <span
      className={`relative inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
        styles[status] ?? styles.draft
      }`}
    >
      {labels[status] ?? status}
    </span>
  );
}

export default async function DashboardPage() {
  const campaigns = await listCampaigns();

  return (
    <div>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-aura-blue">
            لوحة التحكم
          </p>
          <h1 className="mt-1 text-3xl font-black text-aura-dark">حملاتك</h1>
        </div>
        <Link
          href="/app/campaigns/new"
          className="inline-flex items-center gap-2 rounded-full bg-aura-blue px-5 py-2.5 text-sm font-bold text-white shadow-aura-glow transition hover:bg-aura-dark"
        >
          <Plus className="h-4 w-4" />
          حملة جديدة
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="space-y-3">
          {campaigns.map((campaign) => (
            <li key={campaign.id}>
              <Link
                href={`/app/campaigns/${campaign.id}`}
                className="group flex flex-col gap-3 rounded-2xl border border-aura-silver/40 bg-white/80 p-5 transition hover:border-aura-teal md:flex-row md:items-center md:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="truncate text-lg font-black text-aura-dark group-hover:text-aura-blue">
                      {campaign.name}
                    </h3>
                    <StatusPill status={campaign.status} />
                  </div>
                  <p className="mt-1 truncate text-sm text-aura-dark/70">
                    {campaign.brand} · {campaign.goal}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-1.5 space-x-reverse">
                    {campaign.pipeline.slice(0, 5).map((run) => {
                      const a = AGENTS_BY_ID[run.agentId];
                      return (
                        <div
                          key={run.agentId}
                          title={a.nameAr}
                          className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[10px] font-black ${
                            run.status === "completed"
                              ? "bg-emerald-100 text-emerald-700"
                              : run.status === "running"
                                ? "bg-aura-teal/20 text-aura-blue"
                                : run.status === "failed"
                                  ? "bg-rose-100 text-rose-700"
                                  : "bg-aura-silver/40 text-aura-dark/60"
                          }`}
                        >
                          {a.nameEn.slice(0, 2)}
                        </div>
                      );
                    })}
                  </div>
                  <ArrowLeft className="h-5 w-5 text-aura-silver group-hover:text-aura-blue group-hover:-translate-x-1 transition-transform" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border-2 border-dashed border-aura-silver/60 bg-white/40 p-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-aura-teal/15 text-aura-teal">
        <Sparkles className="h-7 w-7" />
      </div>
      <h2 className="mt-4 text-xl font-black text-aura-dark">
        لا توجد حملات بعد
      </h2>
      <p className="mt-2 text-sm text-aura-dark/70">
        ابدأ بإطلاق حملتك الأولى — هالة وفريقها سيتولَّون التنفيذ خطوةً خطوة.
      </p>
      <Link
        href="/app/campaigns/new"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-aura-blue px-5 py-2.5 text-sm font-bold text-white shadow-aura-glow transition hover:bg-aura-dark"
      >
        <Plus className="h-4 w-4" />
        أنشئ حملتك الأولى
      </Link>
    </div>
  );
}
