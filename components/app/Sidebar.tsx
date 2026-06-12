import SidebarNav from "./SidebarNav";
import { getAgents } from "@/lib/registry";
import { isAgentConnectedAsync } from "@/lib/secrets";

export default async function Sidebar() {
  const agents = await getAgents();
  const flags = await Promise.all(agents.map((a) => isAgentConnectedAsync(a)));
  const connectedCount = flags.filter(Boolean).length;
  const total = agents.length;
  const anyConnected = connectedCount > 0;

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-l border-aura-silver/40 bg-white/60 backdrop-blur md:flex">
      <SidebarNav />

      <div className="m-4 rounded-2xl border border-aura-silver/40 bg-aura-mist p-4 text-xs text-aura-dark/70">
        <div className="mb-1 flex items-center gap-2 font-bold text-aura-dark">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              anyConnected ? "bg-emerald-500" : "bg-aura-teal"
            }`}
          />
          {anyConnected
            ? `${connectedCount}/${total} وكلاء متَّصلون`
            : "وضع التجربة"}
        </div>
        {anyConnected ? (
          <>
            النماذج الحقيقية تعمل. الوكلاء غير المتَّصلين يستخدمون مخرجات
            تجريبية حتى تربط مفتاح المزوِّد.
          </>
        ) : (
          <>
            النماذج الحقيقية غير متَّصلة. اربط نقاط الاستدلال من{" "}
            <a className="font-bold text-aura-blue" href="/app/settings/keys">
              صفحة المفاتيح
            </a>{" "}
            أو عبر متغيِّرات البيئة:
            <code
              className="mt-2 block rounded-lg bg-aura-dark/90 p-2 font-mono text-[10px] text-aura-mist"
              dir="ltr"
            >
              JAIS_API_URL=…
            </code>
          </>
        )}
      </div>
    </aside>
  );
}
