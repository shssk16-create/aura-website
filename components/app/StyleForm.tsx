"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import type { StyleSample } from "@/lib/style";

const CHANNELS: { value: string; labelAr: string }[] = [
  { value: "any", labelAr: "جميع القنوات" },
  { value: "instagram", labelAr: "إنستجرام" },
  { value: "x", labelAr: "إكس / تويتر" },
  { value: "tiktok", labelAr: "تيك توك" },
  { value: "linkedin", labelAr: "لينكدإن" },
  { value: "web", labelAr: "موقع ويب" },
];
const TONES: { value: string; labelAr: string }[] = [
  { value: "any", labelAr: "جميع النبرات" },
  { value: "corporate", labelAr: "مؤسسي" },
  { value: "youthful", labelAr: "شبابي" },
  { value: "luxury", labelAr: "فاخر" },
  { value: "playful", labelAr: "مرح" },
];

interface Props {
  samples: StyleSample[];
}

export default function StyleForm({ samples }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [brand, setBrand] = useState("");
  const [channel, setChannel] = useState("any");
  const [tone, setTone] = useState("any");
  const [label, setLabel] = useState("");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!brand.trim() || !text.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/style-samples", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand, channel, tone, label, text }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? `HTTP ${res.status}`);
        return;
      }
      setBrand("");
      setLabel("");
      setText("");
      setChannel("any");
      setTone("any");
      startTransition(() => router.refresh());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/style-samples/${id}`, { method: "DELETE" });
      if (!res.ok) return;
      startTransition(() => router.refresh());
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={submit}
        className="space-y-4 rounded-2xl border border-aura-silver/40 bg-white/80 p-5"
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Field label="العلامة">
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Mira"
              className="block w-full rounded-xl border border-aura-silver/50 bg-aura-mist/40 px-3 py-2 text-sm text-aura-dark placeholder:text-aura-dark/40 focus:border-aura-teal focus:outline-none focus:ring-2 focus:ring-aura-teal/30"
            />
          </Field>
          <Field label="عنوان داخلي للعيِّنة">
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="إعلان عطر فاخر — رمضان"
              className="block w-full rounded-xl border border-aura-silver/50 bg-aura-mist/40 px-3 py-2 text-sm text-aura-dark placeholder:text-aura-dark/40 focus:border-aura-teal focus:outline-none focus:ring-2 focus:ring-aura-teal/30"
            />
          </Field>
          <Field label="القناة">
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="block w-full rounded-xl border border-aura-silver/50 bg-aura-mist/40 px-3 py-2 text-sm text-aura-dark focus:border-aura-teal focus:outline-none focus:ring-2 focus:ring-aura-teal/30"
            >
              {CHANNELS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.labelAr}
                </option>
              ))}
            </select>
          </Field>
          <Field label="النبرة">
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="block w-full rounded-xl border border-aura-silver/50 bg-aura-mist/40 px-3 py-2 text-sm text-aura-dark focus:border-aura-teal focus:outline-none focus:ring-2 focus:ring-aura-teal/30"
            >
              {TONES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.labelAr}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="النص المرجعي بلغة عربية بيضاء">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            placeholder="الصق فقرة إعلانية أو منشورًا قويًا لعلامتك. سيُحقن في موجِّه الكاتب كمثال محتذى."
            className="block w-full rounded-xl border border-aura-silver/50 bg-aura-mist/40 px-3 py-2 text-sm leading-relaxed text-aura-dark placeholder:text-aura-dark/40 focus:border-aura-teal focus:outline-none focus:ring-2 focus:ring-aura-teal/30"
          />
        </Field>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={!brand.trim() || !text.trim() || busy}
            className="inline-flex items-center gap-2 rounded-xl bg-aura-blue px-5 py-2.5 text-sm font-bold text-white shadow-aura-glow transition hover:brightness-110 disabled:opacity-40"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <PlusCircle className="h-4 w-4" />
            )}
            إضافة عيِّنة
          </button>
        </div>
      </form>

      <div className="space-y-3">
        <h2 className="text-lg font-black text-aura-dark">
          مكتبة العيِّنات ({samples.length})
        </h2>
        {samples.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-aura-silver/50 bg-white/60 p-6 text-center text-sm text-aura-dark/60">
            لا توجد عيِّنات بعد. أضِف نصًّا واحدًا على الأقل ليحاكيه الكاتب.
          </p>
        ) : (
          samples.map((s) => (
            <div
              key={s.id}
              className="rounded-2xl border border-aura-silver/40 bg-white/80 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-black text-aura-dark">
                      {s.label}
                    </h3>
                    <span className="rounded-full bg-aura-blue/10 px-2 py-0.5 text-[10px] font-bold text-aura-blue">
                      {s.brand}
                    </span>
                    <span className="rounded-full bg-aura-teal/10 px-2 py-0.5 text-[10px] font-bold text-aura-teal">
                      {channelLabel(s.channel)}
                    </span>
                    <span className="rounded-full bg-aura-silver/30 px-2 py-0.5 text-[10px] font-bold text-aura-dark/70">
                      {toneLabel(s.tone)}
                    </span>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-aura-dark/85">
                    {s.text}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(s.id)}
                  disabled={deletingId === s.id}
                  className="inline-flex items-center gap-1 rounded-xl border border-aura-silver/40 bg-white px-2.5 py-1.5 text-xs text-aura-dark/60 transition hover:border-red-300 hover:text-red-500 disabled:opacity-40"
                >
                  {deletingId === s.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                  حذف
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-aura-dark/70">
        {label}
      </span>
      {children}
    </label>
  );
}

function channelLabel(c: string): string {
  return CHANNELS.find((x) => x.value === c)?.labelAr ?? c;
}
function toneLabel(t: string): string {
  return TONES.find((x) => x.value === t)?.labelAr ?? t;
}
