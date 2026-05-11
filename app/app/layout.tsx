import type { Metadata } from "next";
import Sidebar from "@/components/app/Sidebar";

export const metadata: Metadata = {
  title: "AURA AI · لوحة التحكم",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-aura-mist">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-6xl px-6 py-10">{children}</div>
      </main>
    </div>
  );
}
