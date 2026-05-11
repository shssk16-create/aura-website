"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

const CHANNELS = [
  { value: "instagram", label: "Instagram" },
  { value: "x", label: "X (تويتر)" },
  { value: "tiktok", label: "TikTok" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "web", label: "موقع / بانر" },
] as const;

const TONES = [
  { value: "corporate", label: "مؤسَّسية" },
  { value: "youthful", label: "شبابية" },
  { value: "luxury", label: "فاخرة" },
  { value: "playful", label: "مرحة" },
] as const;

export default function NewCampaignPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as
        | { campaign: { id: string } }
        | { error: string };
      if (!res.ok || "error" in json) {
        setError("error" in json ? json.error : "تعذَّر إنشاء الحملة");
        setSubmitting(false);
        return;
      }
      router.push(`/app/campaigns/${json.campaign.id}`);
    } catch (err) {
      setError((err as Error).message);
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/app"
        className="inline-flex items-center gap-1 text-sm font-bold text-aura-dark/60 hover:text-aura-blue"
      >
        <ArrowLeft className="h-4 w-4 rotate-180" />
        العودة إلى الحملات
      </Link>

      <div className="mt-4 mb-8">
        <p className="text-sm font-bold uppercase tracking-widest text-aura-blue">
          حملة جديدة
        </p>
        <h1 className="mt-1 text-3xl font-black text-aura-dark">
          أخبر هالة بما تريد إطلاقه.
        </h1>
        <p className="mt-2 text-aura-dark/70">
          خمسة حقول قصيرة، وفريق الوكلاء يتولَّى الباقي.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-5 rounded-3xl border border-aura-silver/40 bg-white/80 p-8 backdrop-blur"
      >
        <Field
          label="اسم الحملة"
          name="name"
          placeholder="مثال: إطلاق المنتج الصيفي"
          required
        />
        <Field
          label="اسم العلامة التجارية"
          name="brand"
          placeholder="مثال: أورا"
          required
        />
        <Field
          label="الهدف الأساسي"
          name="goal"
          placeholder="مثال: زيادة التسجيل بنسبة ٣٠٪"
          required
        />
        <Field
          label="الجمهور المستهدف"
          name="audience"
          placeholder="مثال: مديرو التسويق ٢٥-٤٠ سنة"
          required
        />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Select label="القناة" name="channel" options={CHANNELS} />
          <Select label="النبرة" name="tone" options={TONES} />
        </div>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-aura-blue px-6 py-3.5 text-base font-black text-white shadow-aura-glow transition hover:bg-aura-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Sparkles className="h-5 w-5" />
          {submitting ? "جاري الإنشاء…" : "أطلق الحملة"}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-aura-dark">
        {label}
      </span>
      <input
        name={name}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-aura-silver/60 bg-white px-4 py-3 text-base text-aura-dark outline-none transition focus:border-aura-blue focus:ring-2 focus:ring-aura-blue/20"
      />
    </label>
  );
}

function Select({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: readonly { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-aura-dark">
        {label}
      </span>
      <select
        name={name}
        defaultValue={options[0].value}
        className="w-full rounded-xl border border-aura-silver/60 bg-white px-4 py-3 text-base text-aura-dark outline-none transition focus:border-aura-blue focus:ring-2 focus:ring-aura-blue/20"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
