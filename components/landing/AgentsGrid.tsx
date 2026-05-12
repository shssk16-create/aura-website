"use client";
import { motion } from "framer-motion";
import { DEFAULT_AGENTS } from "@/lib/agents";
import { agentIcon } from "@/components/app/AgentIcon";

// Landing page advertises the 8 default agents — user customs only show up
// in the authenticated /app surface.
const AGENTS = DEFAULT_AGENTS;

export default function AgentsGrid() {
  return (
    <section id="agents" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-aura-teal/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-aura-blue">
            <span className="h-1.5 w-1.5 rounded-full bg-aura-teal" />
            فريق الوكلاء
          </div>
          <h2 className="text-4xl font-black tracking-tight text-aura-dark md:text-5xl">
            ثمانية وكلاء، عقلٌ منسِّق واحد.
          </h2>
          <p className="mt-4 text-lg text-aura-dark/70">
            كل وكيل يعمل على نموذج مفتوح متخصِّص في مهمته. الـ <em>Campaign
            Manager</em> يقسِّم العمل، يمرِّر السياق، ويعيد التركيب — وأنت ترى
            كل خطوة لحظيًا.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {AGENTS.map((agent, idx) => {
            const Icon = agentIcon(agent.icon);
            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="liquid-glass rounded-3xl p-6"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                      agent.accent === "teal"
                        ? "bg-aura-teal/15 text-aura-teal"
                        : agent.accent === "silver"
                          ? "bg-aura-silver/30 text-aura-dark"
                          : "bg-aura-blue/15 text-aura-blue"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-bold text-aura-dark/40">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-black text-aura-dark">
                  {agent.nameAr}
                </h3>
                <div className="mt-1 text-xs font-medium uppercase tracking-wider text-aura-blue/70">
                  {agent.model}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-aura-dark/70">
                  {agent.descriptionAr}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
