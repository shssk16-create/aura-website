import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCampaign } from "@/lib/store";
import AgentPipeline from "@/components/app/AgentPipeline";

export const dynamic = "force-dynamic";

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaign = await getCampaign(id);
  if (!campaign) notFound();

  return (
    <div>
      <Link
        href="/app"
        className="inline-flex items-center gap-1 text-sm font-bold text-aura-dark/60 hover:text-aura-blue"
      >
        <ArrowLeft className="h-4 w-4 rotate-180" />
        كل الحملات
      </Link>

      <div className="mt-4 mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-aura-blue">
            {campaign.brand}
          </p>
          <h1 className="mt-1 text-3xl font-black text-aura-dark">
            {campaign.name}
          </h1>
          <p className="mt-1 text-aura-dark/70">{campaign.goal}</p>
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 rounded-2xl border border-aura-silver/40 bg-white/80 px-5 py-3 text-sm md:grid-cols-3">
          <Meta label="القناة" value={campaign.channel} />
          <Meta label="النبرة" value={campaign.tone} />
          <Meta label="الجمهور" value={campaign.audience} />
        </dl>
      </div>

      <AgentPipeline campaign={campaign} />
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-bold uppercase tracking-wider text-aura-dark/50">
        {label}
      </dt>
      <dd className="font-semibold text-aura-dark">{value}</dd>
    </div>
  );
}
