"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  AGENT_ACCENTS,
  AGENT_ICONS,
  BUILTIN_AGENT_IDS,
  type AgentDefinition,
  type AgentIcon as AgentIconName,
  type AgentAccent,
  type ProviderId,
} from "@/lib/agents";
import { agentIcon } from "@/components/app/AgentIcon";
import {
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
  RotateCcw,
  Power,
  PowerOff,
} from "lucide-react";

type FormState = {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  model: string;
  icon: AgentIconName;
  accent: AgentAccent;
  stage: number;
  pipelineEnabled: boolean;
  disabled: boolean;
  systemPromptAr: string;
  endpointEnv: string;
  inferenceProvider: ProviderId | "none";
  inferenceUrl: string;
  inferenceModel: string;
  inferenceKeyEnv: string;
  inferenceReasoning: boolean;
  imageEnabled: boolean;
  imageUrl: string;
  imageModel: string;
  imageKeyEnv: string;
  imageSteps: number;
};

const PROVIDER_PRESETS: Record<
  Exclude<ProviderId, "openai-compatible">,
  { url: string; model: string }
> = {
  nvidia: {
    url: "https://integrate.api.nvidia.com/v1/chat/completions",
    model: "nvidia/llama-3.3-nemotron-super-49b-v1",
  },
  zai: {
    url: "https://api.z.ai/api/paas/v4/chat/completions",
    model: "glm-4.5",
  },
};

function emptyForm(): FormState {
  return {
    id: "",
    nameAr: "",
    nameEn: "",
    descriptionAr: "",
    model: "",
    icon: "Bot",
    accent: "blue",
    stage: 99,
    pipelineEnabled: false,
    disabled: false,
    systemPromptAr: "",
    endpointEnv: "",
    inferenceProvider: "none",
    inferenceUrl: "",
    inferenceModel: "",
    inferenceKeyEnv: "",
    inferenceReasoning: false,
    imageEnabled: false,
    imageUrl: "",
    imageModel: "",
    imageKeyEnv: "",
    imageSteps: 4,
  };
}

function formFromAgent(a: AgentDefinition): FormState {
  return {
    id: a.id,
    nameAr: a.nameAr,
    nameEn: a.nameEn,
    descriptionAr: a.descriptionAr,
    model: a.model,
    icon: a.icon,
    accent: a.accent,
    stage: a.stage,
    pipelineEnabled: Boolean(a.pipelineEnabled),
    disabled: Boolean(a.disabled),
    systemPromptAr: a.systemPromptAr ?? "",
    endpointEnv: a.endpointEnv ?? "",
    inferenceProvider: a.inference?.provider ?? "none",
    inferenceUrl: a.inference?.url ?? "",
    inferenceModel: a.inference?.model ?? "",
    inferenceKeyEnv: a.inference?.keyEnv ?? "",
    inferenceReasoning: Boolean(a.inference?.reasoning),
    imageEnabled: Boolean(a.imageInference),
    imageUrl: a.imageInference?.url ?? "",
    imageModel: a.imageInference?.model ?? "",
    imageKeyEnv: a.imageInference?.keyEnv ?? "",
    imageSteps: a.imageInference?.steps ?? 4,
  };
}

function formToPayload(f: FormState): Record<string, unknown> {
  const inference =
    f.inferenceProvider === "none" || !f.inferenceUrl.trim()
      ? undefined
      : {
          provider: f.inferenceProvider,
          url: f.inferenceUrl.trim(),
          model: f.inferenceModel.trim(),
          keyEnv: f.inferenceKeyEnv.trim(),
          reasoning: f.inferenceReasoning,
        };
  const imageInference =
    !f.imageEnabled || !f.imageUrl.trim()
      ? undefined
      : {
          provider: "nvidia-image",
          url: f.imageUrl.trim(),
          model: f.imageModel.trim(),
          keyEnv: f.imageKeyEnv.trim(),
          steps: Number.isFinite(f.imageSteps) ? f.imageSteps : 4,
        };
  return {
    id: f.id.trim(),
    nameAr: f.nameAr.trim(),
    nameEn: f.nameEn.trim() || f.id.trim(),
    descriptionAr: f.descriptionAr.trim(),
    model: f.model.trim(),
    icon: f.icon,
    accent: f.accent,
    stage: Number.isFinite(f.stage) ? f.stage : 0,
    pipelineEnabled: f.pipelineEnabled,
    disabled: f.disabled,
    systemPromptAr: f.systemPromptAr.trim() || undefined,
    endpointEnv: f.endpointEnv.trim(),
    inference,
    imageInference,
  };
}

export default function AgentManager({
  initialAgents,
}: {
  initialAgents: AgentDefinition[];
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [busy, setBusy] = useState<null | "save" | "delete" | "toggle">(null);
  const [error, setError] = useState<string | null>(null);

  const startEdit = (a: AgentDefinition) => {
    setEditing(a.id);
    setCreating(false);
    setForm(formFromAgent(a));
    setError(null);
  };

  const startCreate = () => {
    setCreating(true);
    setEditing(null);
    setForm(emptyForm());
    setError(null);
  };

  const cancel = () => {
    setEditing(null);
    setCreating(false);
    setForm(emptyForm());
    setError(null);
  };

  const save = async () => {
    setBusy("save");
    setError(null);
    try {
      const payload = formToPayload(form);
      const isCreate = creating;
      const url = isCreate
        ? "/api/agents"
        : `/api/agents/${encodeURIComponent(editing ?? "")}`;
      const method = isCreate ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? `HTTP ${res.status}`);
        return;
      }
      cancel();
      startTransition(() => router.refresh());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const remove = async (id: string, isCustom: boolean) => {
    const ok = window.confirm(
      isCustom
        ? `حذف الوكيل المخصَّص «${id}» نهائيًا؟`
        : `إعادة الوكيل «${id}» إلى الإعدادات الافتراضية؟ التعديلات ستُمسح.`,
    );
    if (!ok) return;
    setBusy("delete");
    setError(null);
    try {
      const res = await fetch(
        `/api/agents/${encodeURIComponent(id)}`,
        { method: "DELETE" },
      );
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? `HTTP ${res.status}`);
        return;
      }
      cancel();
      startTransition(() => router.refresh());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const toggleDisabled = async (a: AgentDefinition) => {
    setBusy("toggle");
    setError(null);
    try {
      const res = await fetch(
        `/api/agents/${encodeURIComponent(a.id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ disabled: !a.disabled }),
        },
      );
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? `HTTP ${res.status}`);
        return;
      }
      startTransition(() => router.refresh());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-aura-dark/70">
          إجمالي الوكلاء: <strong>{initialAgents.length}</strong> · المخصَّص:{" "}
          <strong>{initialAgents.filter((a) => a.custom).length}</strong> ·
          المعطَّل: <strong>{initialAgents.filter((a) => a.disabled).length}</strong>
        </p>
        <button
          onClick={startCreate}
          className="inline-flex items-center gap-2 rounded-full bg-aura-blue px-4 py-2 text-sm font-bold text-white shadow-aura-glow transition hover:bg-aura-dark"
        >
          <Plus className="h-4 w-4" />
          أضف وكيلًا جديدًا
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}

      {creating && (
        <AgentForm
          form={form}
          setForm={setForm}
          isCreate
          onCancel={cancel}
          onSave={save}
          busy={busy === "save"}
        />
      )}

      <ul className="space-y-3">
        {initialAgents.map((a) => {
          const Icon = agentIcon(a.icon);
          const isEditing = editing === a.id;
          const isBuiltin = (BUILTIN_AGENT_IDS as readonly string[]).includes(
            a.id,
          );
          return (
            <li
              key={a.id}
              className="rounded-2xl border border-aura-silver/40 bg-white/80 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      a.accent === "teal"
                        ? "bg-aura-teal/15 text-aura-teal"
                        : a.accent === "silver"
                          ? "bg-aura-silver/30 text-aura-dark"
                          : "bg-aura-blue/15 text-aura-blue"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-black text-aura-dark">
                        {a.nameAr}
                      </h3>
                      <code
                        className="rounded-lg bg-aura-dark/90 px-2 py-0.5 font-mono text-[10px] text-aura-mist"
                        dir="ltr"
                      >
                        {a.id}
                      </code>
                      {a.custom && (
                        <span className="rounded-full bg-aura-blue/15 px-2 py-0.5 text-[10px] font-bold text-aura-blue">
                          مخصَّص
                        </span>
                      )}
                      {a.disabled && (
                        <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                          معطَّل
                        </span>
                      )}
                      {a.pipelineEnabled && !a.disabled && (
                        <span className="rounded-full bg-aura-teal/15 px-2 py-0.5 text-[10px] font-bold text-aura-blue">
                          في خطّ الإنتاج
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wider text-aura-blue/70">
                      {a.model || "—"}
                    </p>
                    {a.descriptionAr && (
                      <p className="mt-1 text-sm text-aura-dark/75">
                        {a.descriptionAr}
                      </p>
                    )}
                    <div
                      className="mt-2 inline-flex flex-wrap items-center gap-2 font-mono text-[10px] text-aura-dark/70"
                      dir="ltr"
                    >
                      {a.inference && (
                        <span className="rounded bg-aura-mist px-2 py-0.5">
                          {a.inference.provider} · {a.inference.keyEnv}
                        </span>
                      )}
                      {a.imageInference && (
                        <span className="rounded bg-aura-mist px-2 py-0.5">
                          image · {a.imageInference.keyEnv}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <button
                    onClick={() => toggleDisabled(a)}
                    disabled={busy === "toggle"}
                    className="inline-flex items-center gap-1 rounded-lg border border-aura-silver/50 px-3 py-1.5 text-xs font-bold text-aura-dark hover:border-aura-blue hover:text-aura-blue disabled:opacity-50"
                  >
                    {a.disabled ? (
                      <>
                        <Power className="h-3.5 w-3.5" /> تفعيل
                      </>
                    ) : (
                      <>
                        <PowerOff className="h-3.5 w-3.5" /> تعطيل
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => startEdit(a)}
                    className="inline-flex items-center gap-1 rounded-lg bg-aura-blue/15 px-3 py-1.5 text-xs font-bold text-aura-blue hover:bg-aura-blue hover:text-white"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    تعديل
                  </button>
                  <button
                    onClick={() => remove(a.id, !isBuiltin)}
                    disabled={busy === "delete"}
                    className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-50 disabled:opacity-50"
                  >
                    {isBuiltin ? (
                      <>
                        <RotateCcw className="h-3.5 w-3.5" />
                        استعادة
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-3.5 w-3.5" />
                        حذف
                      </>
                    )}
                  </button>
                </div>
              </div>

              {isEditing && (
                <div className="mt-4 border-t border-aura-silver/40 pt-4">
                  <AgentForm
                    form={form}
                    setForm={setForm}
                    isCreate={false}
                    onCancel={cancel}
                    onSave={save}
                    busy={busy === "save"}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function AgentForm({
  form,
  setForm,
  isCreate,
  onCancel,
  onSave,
  busy,
}: {
  form: FormState;
  setForm: (f: FormState) => void;
  isCreate: boolean;
  onCancel: () => void;
  onSave: () => void;
  busy: boolean;
}) {
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm({ ...form, [key]: value });

  const applyProviderPreset = (p: ProviderId) => {
    if (p === "openai-compatible") {
      set("inferenceProvider", "openai-compatible");
      return;
    }
    const preset = PROVIDER_PRESETS[p];
    setForm({
      ...form,
      inferenceProvider: p,
      inferenceUrl: form.inferenceUrl || preset.url,
      inferenceModel: form.inferenceModel || preset.model,
      inferenceKeyEnv:
        form.inferenceKeyEnv || (p === "nvidia" ? "Api" : "Glm"),
    });
  };

  return (
    <div className="rounded-2xl border border-aura-silver/40 bg-aura-mist/40 p-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Field label="معرِّف الوكيل (id)" hint="حروف صغيرة وأرقام وشرطات">
          <input
            type="text"
            value={form.id}
            onChange={(e) => set("id", e.target.value)}
            disabled={!isCreate}
            placeholder="pr-expert"
            dir="ltr"
            className="w-full rounded-lg border border-aura-silver/50 bg-white px-3 py-1.5 text-sm font-mono disabled:opacity-60"
          />
        </Field>
        <Field label="الاسم العربي">
          <input
            type="text"
            value={form.nameAr}
            onChange={(e) => set("nameAr", e.target.value)}
            placeholder="خبير العلاقات العامَّة"
            className="w-full rounded-lg border border-aura-silver/50 bg-white px-3 py-1.5 text-sm"
          />
        </Field>
        <Field label="الاسم الإنجليزي">
          <input
            type="text"
            value={form.nameEn}
            onChange={(e) => set("nameEn", e.target.value)}
            placeholder="PR Expert"
            dir="ltr"
            className="w-full rounded-lg border border-aura-silver/50 bg-white px-3 py-1.5 text-sm"
          />
        </Field>
        <Field label="اسم النموذج (للعرض)">
          <input
            type="text"
            value={form.model}
            onChange={(e) => set("model", e.target.value)}
            placeholder="GPT-4o · Custom · ..."
            className="w-full rounded-lg border border-aura-silver/50 bg-white px-3 py-1.5 text-sm"
          />
        </Field>
        <Field label="الأيقونة">
          <select
            value={form.icon}
            onChange={(e) => set("icon", e.target.value as AgentIconName)}
            className="w-full rounded-lg border border-aura-silver/50 bg-white px-3 py-1.5 text-sm"
          >
            {AGENT_ICONS.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </Field>
        <Field label="اللون">
          <select
            value={form.accent}
            onChange={(e) => set("accent", e.target.value as AgentAccent)}
            className="w-full rounded-lg border border-aura-silver/50 bg-white px-3 py-1.5 text-sm"
          >
            {AGENT_ACCENTS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </Field>
        <Field label="ترتيب المرحلة (stage)">
          <input
            type="number"
            value={form.stage}
            onChange={(e) => set("stage", Number(e.target.value))}
            className="w-full rounded-lg border border-aura-silver/50 bg-white px-3 py-1.5 text-sm"
          />
        </Field>
        <div className="flex items-end gap-4">
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.pipelineEnabled}
              onChange={(e) => set("pipelineEnabled", e.target.checked)}
            />
            ضمن خطّ الإنتاج
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.disabled}
              onChange={(e) => set("disabled", e.target.checked)}
            />
            معطَّل
          </label>
        </div>
      </div>

      <Field label="الوصف بالعربية">
        <textarea
          value={form.descriptionAr}
          onChange={(e) => set("descriptionAr", e.target.value)}
          rows={2}
          placeholder="ماذا يفعل هذا الوكيل بالضبط؟"
          className="w-full rounded-lg border border-aura-silver/50 bg-white px-3 py-1.5 text-sm"
        />
      </Field>

      <Field label="موجِّه النظام (system prompt) بالعربية">
        <textarea
          value={form.systemPromptAr}
          onChange={(e) => set("systemPromptAr", e.target.value)}
          rows={4}
          placeholder="أنت «خبير ...» في منصَّة أورا. مهمَّتك أن ..."
          className="w-full rounded-lg border border-aura-silver/50 bg-white px-3 py-1.5 text-sm"
        />
      </Field>

      <div className="mt-4 rounded-xl border border-aura-silver/40 bg-white/70 p-3">
        <h4 className="mb-2 text-sm font-black text-aura-dark">
          استدلال نصِّي (chat completions)
        </h4>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Field label="المزوِّد">
            <select
              value={form.inferenceProvider}
              onChange={(e) =>
                applyProviderPreset(
                  e.target.value as ProviderId | "none" as ProviderId,
                )
              }
              className="w-full rounded-lg border border-aura-silver/50 bg-white px-3 py-1.5 text-sm"
            >
              <option value="none">— بدون (وضع تجريبي) —</option>
              <option value="nvidia">NVIDIA NIM</option>
              <option value="zai">Z.AI / GLM</option>
              <option value="openai-compatible">OpenAI-compatible</option>
            </select>
          </Field>
          <Field label="اسم متغيِّر مفتاح الـ API (keyEnv)">
            <input
              type="text"
              value={form.inferenceKeyEnv}
              onChange={(e) => set("inferenceKeyEnv", e.target.value)}
              placeholder="Api"
              dir="ltr"
              className="w-full rounded-lg border border-aura-silver/50 bg-white px-3 py-1.5 text-sm font-mono"
            />
          </Field>
          <Field label="عنوان نقطة الاستدلال (URL)">
            <input
              type="url"
              value={form.inferenceUrl}
              onChange={(e) => set("inferenceUrl", e.target.value)}
              placeholder="https://integrate.api.nvidia.com/v1/chat/completions"
              dir="ltr"
              className="w-full rounded-lg border border-aura-silver/50 bg-white px-3 py-1.5 text-sm font-mono"
            />
          </Field>
          <Field label="معرِّف النموذج عند المزوِّد">
            <input
              type="text"
              value={form.inferenceModel}
              onChange={(e) => set("inferenceModel", e.target.value)}
              placeholder="nvidia/llama-3.3-nemotron-super-49b-v1"
              dir="ltr"
              className="w-full rounded-lg border border-aura-silver/50 bg-white px-3 py-1.5 text-sm font-mono"
            />
          </Field>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.inferenceReasoning}
              onChange={(e) => set("inferenceReasoning", e.target.checked)}
            />
            نموذج تفكير (reasoning) — يستهلك max_tokens أعلى
          </label>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-aura-silver/40 bg-white/70 p-3">
        <label className="mb-2 inline-flex items-center gap-2 text-sm font-black text-aura-dark">
          <input
            type="checkbox"
            checked={form.imageEnabled}
            onChange={(e) => set("imageEnabled", e.target.checked)}
          />
          توليد صور (NVIDIA NIM Image)
        </label>
        {form.imageEnabled && (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Field label="URL">
              <input
                type="url"
                value={form.imageUrl}
                onChange={(e) => set("imageUrl", e.target.value)}
                placeholder="https://integrate.api.nvidia.com/v1/genai/black-forest-labs/flux.2-klein-4b"
                dir="ltr"
                className="w-full rounded-lg border border-aura-silver/50 bg-white px-3 py-1.5 text-sm font-mono"
              />
            </Field>
            <Field label="Model">
              <input
                type="text"
                value={form.imageModel}
                onChange={(e) => set("imageModel", e.target.value)}
                placeholder="flux.2-klein-4b"
                dir="ltr"
                className="w-full rounded-lg border border-aura-silver/50 bg-white px-3 py-1.5 text-sm font-mono"
              />
            </Field>
            <Field label="Key env">
              <input
                type="text"
                value={form.imageKeyEnv}
                onChange={(e) => set("imageKeyEnv", e.target.value)}
                placeholder="Flux"
                dir="ltr"
                className="w-full rounded-lg border border-aura-silver/50 bg-white px-3 py-1.5 text-sm font-mono"
              />
            </Field>
            <Field label="Steps">
              <input
                type="number"
                min={1}
                max={50}
                value={form.imageSteps}
                onChange={(e) => set("imageSteps", Number(e.target.value))}
                className="w-full rounded-lg border border-aura-silver/50 bg-white px-3 py-1.5 text-sm"
              />
            </Field>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-1 rounded-full border border-aura-silver/50 px-4 py-1.5 text-sm font-bold text-aura-dark hover:border-aura-blue hover:text-aura-blue"
        >
          <X className="h-4 w-4" />
          إلغاء
        </button>
        <button
          onClick={onSave}
          disabled={busy || !form.id || !form.nameAr}
          className="inline-flex items-center gap-1 rounded-full bg-aura-blue px-4 py-1.5 text-sm font-bold text-white shadow-aura-glow hover:bg-aura-dark disabled:opacity-50"
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isCreate ? "إنشاء الوكيل" : "حفظ التعديلات"}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold text-aura-dark/70">
        {label}
      </span>
      {children}
      {hint && (
        <span className="mt-1 block text-[11px] text-aura-dark/55">{hint}</span>
      )}
    </label>
  );
}
