/**
 * Saudi White-Dialect linguistic constraint engine.
 *
 * Emits a system-prompt fragment that the orchestrator injects ahead of
 * each agent's per-role system prompt. The fragment uses the academic
 * terminology of Arabic morphology (Sarf) and syntax (Nahw) rather than
 * vague style instructions — empirically this raises dialect fidelity
 * far beyond "act as a Saudi marketer" prompts.
 *
 * See `docs/DIALECT.md` for the full framework.
 */

import type { AgentId } from "./agents";

export type DialectTone = "corporate" | "youthful" | "luxury" | "playful";
export type DialectRegion = "saudi-white" | "najdi" | "hijazi";

export interface MorphologyOptions {
  tone: DialectTone;
  /** Default `saudi-white`. */
  region?: DialectRegion;
  /** The agent that will receive this fragment. */
  agent?: AgentId;
}

/**
 * Banned MSA / non-Saudi constructs. Each entry is given to the model as
 * an explicit "do NOT use" instruction.
 */
export const BANNED_CONSTRUCTS = [
  "المبني للمجهول (passive voice) في صلب النص",
  "الترجمة الحرفية من الإنجليزية مثل: «خذ خطوتك التالية» أو «اكتشف المزيد»",
  "العاميَّة المصرية: عشان، إزّاي، كده، فين",
  "العاميَّة الشاميَّة: هلَّق، كتير، شو الأخبار",
  "الكلمات الفصحى الجامدة: لذا، بناءً عليه، عليه، إذن في خطاب إعلاني",
];

/**
 * Power-words available to the copywriter. Each one is tagged with the tone
 * register where it lands naturally — the engine emits only the subset
 * matching the requested tone.
 */
const POWER_WORDS: Record<DialectTone, string[]> = {
  corporate: ["مضمون", "احترافي", "موثوق", "تجربتنا", "نخدم"],
  youthful: ["يلَّا", "أصلي", "تستاهل", "وقتك ذهبي", "كذا بس"],
  luxury: ["فخامة", "تفاصيل", "اقتناء", "نُدرة", "حصري"],
  playful: ["خفيف ولذيذ", "بسيط بشكل غريب", "تعال جرِّب", "حتفرق"],
};

/**
 * Syntactic preset per tone. The engine forces the model to **open** the
 * line with this construction, which is how native KSA copy reads.
 */
const SYNTACTIC_PRESET: Record<DialectTone, string> = {
  corporate:
    "افتح بجملة اسمية يتقدَّم فيها الخبر — مثال: «الجودة عندنا أوَّلًا.»",
  youthful:
    "افتح بنداء قصير ثمَّ فعل أمر — مثال: «يا شباب، جرِّب اللي يستاهل.»",
  luxury:
    "افتح بجملة اسمية مؤكَّدة بـ«إنّ» — مثال: «إنّ التفاصيل هي ما يصنع الفخامة.»",
  playful:
    "افتح بسؤال شرطيّ مرحٍ — مثال: «لو طلبت اليوم؟ كذا بس وخلصت القصَّة.»",
};

/**
 * Region-specific colour. The default `saudi-white` keeps the line
 * accessible nation-wide; `najdi` and `hijazi` add localised lexicon.
 */
const REGIONAL_FLAVOUR: Record<DialectRegion, string> = {
  "saudi-white":
    "اعتمد البياض السعودي العصري المفهوم في كل الأقاليم؛ تجنَّب اللهجة الإقليمية الحادة.",
  najdi:
    "ادمج لفظًا نجديًّا واحدًا فقط (مثل: تكفى، عاد، يا ولد العم) بلا مبالغة.",
  hijazi:
    "ادمج لفظًا حجازيًّا واحدًا فقط (مثل: قولة جد، حالاً، يا ابن الحلال) بلا مبالغة.",
};

/**
 * Build the system-prompt fragment. The output is plain Arabic so the
 * model treats it as an instruction rather than translating it.
 */
export function buildMorphologyFragment(opts: MorphologyOptions): string {
  const region = opts.region ?? "saudi-white";
  const tone = opts.tone;
  const power = POWER_WORDS[tone];

  return [
    "« قواعد لُغوية مُلزِمة »",
    `- اللهجة: ${region === "saudi-white" ? "البياض السعودي" : region}.`,
    `- صرفيًّا: اعتمد اسم الفاعل (وزن «فاعل/مُفعِل») في وصف الفعل، وتجنَّب البناء للمجهول داخل صلب النص.`,
    `- نحويًّا: ${SYNTACTIC_PRESET[tone]}`,
    `- المعجم المُفضَّل (استخدم اثنين منها فقط، بلا حشو): ${power.join(" · ")}.`,
    `- نكهة إقليمية: ${REGIONAL_FLAVOUR[region]}`,
    `- ممنوع منعًا قاطعًا:`,
    ...BANNED_CONSTRUCTS.map((b) => `   · ${b}`),
    `- الإيقاع: السطر القصير أهمّ من الطويل؛ لا يتجاوز السطر ١٢ كلمة.`,
  ].join("\n");
}

/**
 * Decide whether the engine should attach a morphology fragment for the
 * given agent. Copywriter, strategist, social, seo — yes. Designer,
 * analyst, manager, video — no (they speak about the work, not in voice).
 */
export function appliesTo(agent: AgentId): boolean {
  return ["copywriter", "strategist", "social", "seo"].includes(agent);
}
