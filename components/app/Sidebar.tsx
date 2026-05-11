"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  Users2,
  Settings,
  BookOpen,
} from "lucide-react";

const ITEMS = [
  { href: "/app", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/app/campaigns/new", label: "حملة جديدة", icon: Sparkles },
  { href: "/app/agents", label: "فريق الوكلاء", icon: Users2 },
  { href: "/app/docs", label: "الدليل", icon: BookOpen },
  { href: "/app/settings", label: "الإعدادات", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-l border-aura-silver/40 bg-white/60 backdrop-blur md:flex">
      <div className="flex h-16 items-center gap-2 border-b border-aura-silver/40 px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-aura-gradient text-white font-black shadow-aura-glow">
            A
          </span>
          <span className="text-lg font-black tracking-tighter text-aura-dark">
            AURA<span className="text-aura-teal"> AI</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-6 text-sm">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== "/app" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium transition ${
                active
                  ? "bg-aura-blue text-white shadow-aura-glow"
                  : "text-aura-dark/75 hover:bg-aura-mist hover:text-aura-blue"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="m-4 rounded-2xl border border-aura-silver/40 bg-aura-mist p-4 text-xs text-aura-dark/70">
        <div className="mb-1 flex items-center gap-2 font-bold text-aura-dark">
          <span className="h-1.5 w-1.5 rounded-full bg-aura-teal" />
          وضع التجربة
        </div>
        النماذج الحقيقية غير متَّصلة. اربط نقاط الاستدلال عبر متغيِّرات البيئة:
        <code className="mt-2 block rounded-lg bg-aura-dark/90 p-2 font-mono text-[10px] text-aura-mist" dir="ltr">
          JAIS_API_URL=…
        </code>
      </div>
    </aside>
  );
}
