import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAgents } from "@/lib/registry";
import AgentManager from "@/components/app/AgentManager";

export const dynamic = "force-dynamic";

export default async function AgentsSettingsPage() {
  const agents = await getAgents();
  return (
    <div>
      <Link
        href="/app/settings"
        className="inline-flex items-center gap-1 text-sm font-bold text-aura-dark/60 hover:text-aura-blue"
      >
        <ArrowLeft className="h-4 w-4 rotate-180" />
        كلّ الإعدادات
      </Link>
      <div className="mt-4 mb-6">
        <p className="text-sm font-bold uppercase tracking-widest text-aura-blue">
          الإعدادات · الوكلاء
        </p>
        <h1 className="mt-1 text-3xl font-black text-aura-dark">
          الوكلاء والنماذج
        </h1>
        <p className="mt-2 max-w-2xl text-aura-dark/70">
          عدِّل أيّ حقل في الوكلاء الجاهزين، أو أضف وكيلًا مخصَّصًا بدور جديد.
          الوكلاء المفعَّلون في «خطّ الإنتاج» يدخلون تلقائيًا في كل حملة جديدة،
          مرتَّبين حسب رقم المرحلة.
        </p>
      </div>

      <AgentManager initialAgents={agents} />

      <p className="mt-8 text-xs text-aura-dark/55">
        التعديلات تُحفظ في{" "}
        <code className="rounded bg-aura-dark/90 px-1.5 py-0.5 font-mono text-[10px] text-aura-mist">
          .data/agents.json
        </code>
        . الوكلاء الجاهزون لا يُحذفون — زرّ «استعادة» يعيدهم إلى الإعدادات
        الافتراضية. لإدارة المفاتيح المطلوبة لكل وكيل، افتح{" "}
        <Link
          href="/app/settings/keys"
          className="font-bold text-aura-blue hover:underline"
        >
          صفحة المفاتيح
        </Link>
        .
      </p>
    </div>
  );
}
