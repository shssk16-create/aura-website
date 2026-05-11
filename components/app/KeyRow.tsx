"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Eye, EyeOff, Loader2, Trash2, XCircle } from "lucide-react";

export interface KeySlotPublic {
  name: string;
  labelAr: string;
  providerLabel: string;
  usedByAr: string[];
  pingable: boolean;
}

export interface KeyMaskPublic {
  slot: string;
  configured: boolean;
  source: "store" | "env" | "none";
  last4: string | null;
  updatedAt: string | null;
}

interface Props {
  slot: KeySlotPublic;
  mask: KeyMaskPublic;
}

type PingState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ok"; latencyMs?: number; httpStatus?: number }
  | { status: "fail"; error: string; httpStatus?: number };

export default function KeyRow({ slot, mask }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [value, setValue] = useState("");
  const [showValue, setShowValue] = useState(false);
  const [busy, setBusy] = useState<null | "save" | "delete" | "ping">(null);
  const [error, setError] = useState<string | null>(null);
  const [ping, setPing] = useState<PingState>({ status: "idle" });

  async function save() {
    if (!value.trim()) return;
    setBusy("save");
    setError(null);
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot: slot.name, value }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? `HTTP ${res.status}`);
        return;
      }
      // Wipe local plaintext immediately — UI never displays it again.
      setValue("");
      setShowValue(false);
      setPing({ status: "idle" });
      startTransition(() => router.refresh());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function remove() {
    setBusy("delete");
    setError(null);
    try {
      const res = await fetch(
        `/api/keys/${encodeURIComponent(slot.name)}`,
        { method: "DELETE" },
      );
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? `HTTP ${res.status}`);
        return;
      }
      setPing({ status: "idle" });
      startTransition(() => router.refresh());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function test() {
    setBusy("ping");
    setError(null);
    setPing({ status: "loading" });
    try {
      const res = await fetch("/api/keys/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot: slot.name }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        latencyMs?: number;
        status?: number;
        error?: string;
      };
      if (data.ok) {
        setPing({
          status: "ok",
          latencyMs: data.latencyMs,
          httpStatus: data.status,
        });
      } else {
        setPing({
          status: "fail",
          error: data.error ?? "failed",
          httpStatus: data.status,
        });
      }
    } catch (err) {
      setPing({ status: "fail", error: (err as Error).message });
    } finally {
      setBusy(null);
    }
  }

  const masked = mask.configured
    ? `••••••${mask.last4 ?? ""}`
    : "غير مضبوط";

  return (
    <div className="rounded-2xl border border-aura-silver/40 bg-white/80 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-black text-aura-dark">
              {slot.labelAr}
            </h3>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                mask.configured
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-aura-silver/30 text-aura-dark/70"
              }`}
            >
              {mask.configured
                ? mask.source === "store"
                  ? "محفوظ بتشفير"
                  : "من البيئة"
                : "غير مضبوط"}
            </span>
            <code
              className="rounded-lg bg-aura-dark/90 px-2 py-0.5 font-mono text-[10px] text-aura-mist"
              dir="ltr"
            >
              {slot.name}
            </code>
          </div>
          <p className="mt-1 text-xs font-medium uppercase tracking-wider text-aura-blue/80" dir="ltr">
            {slot.providerLabel}
          </p>
          <p className="mt-1 text-xs text-aura-dark/60">
            يستخدمه: {slot.usedByAr.join("، ")}
          </p>
        </div>
        <div className="text-right">
          <div className="font-mono text-sm text-aura-dark" dir="ltr">
            {masked}
          </div>
          {mask.updatedAt && (
            <div className="text-[10px] text-aura-dark/50" dir="ltr">
              updated {new Date(mask.updatedAt).toLocaleString()}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-stretch gap-2">
        <div className="relative flex-1 min-w-[14rem]">
          <input
            type={showValue ? "text" : "password"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={mask.configured ? "الصق قيمة جديدة لاستبدالها…" : "الصق المفتاح هنا…"}
            className="block w-full rounded-xl border border-aura-silver/50 bg-aura-mist/40 px-3 py-2 pr-9 font-mono text-sm text-aura-dark placeholder:text-aura-dark/40 focus:border-aura-teal focus:outline-none focus:ring-2 focus:ring-aura-teal/30"
            dir="ltr"
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="button"
            onClick={() => setShowValue((v) => !v)}
            className="absolute inset-y-0 right-2 flex items-center text-aura-dark/40 hover:text-aura-dark"
            aria-label={showValue ? "إخفاء" : "إظهار"}
          >
            {showValue ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={!value.trim() || busy !== null}
          className="inline-flex items-center justify-center rounded-xl bg-aura-blue px-4 py-2 text-sm font-bold text-white shadow-aura-glow transition hover:brightness-110 disabled:opacity-40"
        >
          {busy === "save" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "استبدال"
          )}
        </button>
        {slot.pingable && (
          <button
            type="button"
            onClick={test}
            disabled={!mask.configured || busy !== null}
            className="inline-flex items-center justify-center rounded-xl border border-aura-silver/50 bg-white px-4 py-2 text-sm font-bold text-aura-blue transition hover:border-aura-blue/40 hover:bg-aura-mist disabled:opacity-40"
          >
            {busy === "ping" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "اختبار"
            )}
          </button>
        )}
        {mask.configured && mask.source === "store" && (
          <button
            type="button"
            onClick={remove}
            disabled={busy !== null}
            className="inline-flex items-center justify-center rounded-xl border border-aura-silver/40 bg-white px-3 py-2 text-aura-dark/60 transition hover:border-red-300 hover:text-red-500 disabled:opacity-40"
            aria-label="حذف"
            title="حذف"
          >
            {busy === "delete" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {error && (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      )}

      {ping.status !== "idle" && (
        <div
          className={`mt-3 flex items-center gap-2 rounded-xl border px-3 py-2 text-xs ${
            ping.status === "ok"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : ping.status === "fail"
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-aura-silver/40 bg-aura-mist text-aura-dark/70"
          }`}
        >
          {ping.status === "loading" && (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              جارٍ الاختبار…
            </>
          )}
          {ping.status === "ok" && (
            <>
              <CheckCircle2 className="h-4 w-4" />
              المفتاح مقبول
              {typeof ping.httpStatus === "number" && ` · HTTP ${ping.httpStatus}`}
              {typeof ping.latencyMs === "number" && ` · ${ping.latencyMs}ms`}
            </>
          )}
          {ping.status === "fail" && (
            <>
              <XCircle className="h-4 w-4" />
              فشل الاختبار
              {typeof ping.httpStatus === "number" && ` · HTTP ${ping.httpStatus}`}
              <span className="font-mono" dir="ltr">
                {ping.error.slice(0, 120)}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
