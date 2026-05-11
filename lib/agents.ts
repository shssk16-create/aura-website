/**
 * Agent registry for the AURA AI marketing SaaS.
 *
 * Each agent maps to an open-weight model and a role. Where supported, an
 * agent can target an NVIDIA NIM model — the orchestrator will then call
 * `https://integrate.api.nvidia.com/v1/chat/completions` with the OpenAI
 * compatible payload. Otherwise the agent falls back to a generic endpoint
 * resolved from `endpointEnv`, and finally to a deterministic stub.
 */

export type AgentId =
  | "manager"
  | "strategist"
  | "copywriter"
  | "analyst"
  | "designer"
  | "social"
  | "seo"
  | "video";

export interface AgentDefinition {
  id: AgentId;
  /** Arabic display name shown to users. */
  nameAr: string;
  /** English/internal title. */
  nameEn: string;
  /** Short Arabic description for UI cards. */
  descriptionAr: string;
  /** Open-weight model name powering this agent. */
  model: string;
  /** Env-var key holding the inference endpoint URL (used when not NIM). */
  endpointEnv: string;
  /**
   * NVIDIA NIM model id. When present, the orchestrator calls NIM directly
   * with the API key from the env var declared in `nvidiaKeyEnv` (or `Api`
   * / `NVIDIA_API_KEY` as fallbacks).
   */
  nvidiaModel?: string;
  /** Env-var key holding the NVIDIA NIM API token. */
  nvidiaKeyEnv?: string;
  /** System prompt used when invoking the model. */
  systemPromptAr?: string;
  /** Lucide icon name (kept generic for tree-shaking). */
  icon:
    | "Target"
    | "Lightbulb"
    | "PenLine"
    | "BarChart3"
    | "Palette"
    | "Share2"
    | "Search"
    | "Clapperboard";
  /** Stage order in the default campaign pipeline. */
  stage: number;
  /** Accent color token (Tailwind aura-*). */
  accent: "blue" | "teal" | "silver";
}

export const AGENTS: AgentDefinition[] = [
  {
    id: "manager",
    nameAr: "مدير الحملة",
    nameEn: "Campaign Manager",
    descriptionAr:
      "العقل المنظِّم الذي يفكِّك أهداف الحملة، يوزِّع المهام على باقي الوكلاء، ويشغِّل سكربتات بايثون عند الحاجة.",
    model: "Nemotron Super 49B (Llama-3.3)",
    nvidiaModel: "nvidia/llama-3.3-nemotron-super-49b-v1",
    nvidiaKeyEnv: "Api",
    endpointEnv: "DEEPSEEK_API_URL",
    systemPromptAr:
      "أنت «مدير حملة» في منصَّة أورا. مهمَّتك أن تقرأ بريف الحملة، تستخرج الأهداف القابلة للقياس، تقسِّم العمل على فريق وكلاء التسويق، وتلخِّص الخطَّة في فقرة عربية بيضاء فصيحة، لا تتجاوز ٦ أسطر، خالية من الترجمة الحرفية، وبدون عناوين أو ترقيم.",
    icon: "Target",
    stage: 0,
    accent: "blue",
  },
  {
    id: "strategist",
    nameAr: "خبير المحتوى",
    nameEn: "Content Strategist",
    descriptionAr:
      "يحلِّل محتوى المنافسين البصري والصوتي ويصوغ خطة محتوى تتماشى مع هوية العلامة.",
    model: "Nemotron 3 Nano Omni 30B-A3B Reasoning",
    nvidiaModel: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning",
    nvidiaKeyEnv: "Api",
    endpointEnv: "NEMOTRON_API_URL",
    systemPromptAr:
      "أنت «خبير محتوى» في منصَّة أورا. حلِّل بريف الحملة، اقترح زاوية المحتوى الأقوى، حدِّد الرسالة الجوهرية، وصياغة الإطار التحريري في فقرة عربية بيضاء فصيحة لا تتجاوز ٦ أسطر، بلا ترقيم وبلا عناوين فرعية.",
    icon: "Lightbulb",
    stage: 1,
    accent: "teal",
  },
  {
    id: "copywriter",
    nameAr: "كاتب الإعلانات",
    nameEn: "Copywriter",
    descriptionAr:
      "يكتب نسخًا إعلانية بلغة عربية بيضاء فصيحة بعيدة عن الترجمة الحرفية، وملائمة للنبرة المؤسسية.",
    model: "Jais-2 70B Chat",
    endpointEnv: "JAIS_API_URL",
    icon: "PenLine",
    stage: 2,
    accent: "blue",
  },
  {
    id: "analyst",
    nameAr: "محلِّل البيانات",
    nameEn: "Data Analyst",
    descriptionAr:
      "يفكِّك مؤشرات الأداء وجداول إكسل ويخرج بتوصيات قابلة للتنفيذ على شكل تقارير قصيرة.",
    model: "DeepSeek-V4-Pro",
    endpointEnv: "DEEPSEEK_API_URL",
    icon: "BarChart3",
    stage: 3,
    accent: "teal",
  },
  {
    id: "designer",
    nameAr: "المصمِّم الإبداعي",
    nameEn: "Creative Designer",
    descriptionAr:
      "يولِّد خلفيات بصرية بـ FLUX.1 ثم يستدعي سكربت بايثون لِطَبع النص العربي بدقة طباعية كاملة.",
    model: "FLUX.1 [pro] + Pillow",
    endpointEnv: "FLUX_API_URL",
    icon: "Palette",
    stage: 4,
    accent: "blue",
  },
  {
    id: "social",
    nameAr: "أخصائي السوشيال",
    nameEn: "Social Media Specialist",
    descriptionAr:
      "نموذج خفيف وسريع لتوليد تغريدات ومنشورات يومية بنبرة العلامة لقنوات متعدِّدة.",
    model: "Qwen3-8B",
    endpointEnv: "QWEN_API_URL",
    icon: "Share2",
    stage: 5,
    accent: "teal",
  },
  {
    id: "seo",
    nameAr: "خبير السيو",
    nameEn: "SEO Expert",
    descriptionAr:
      "يطابق محتوى المنصَّة مع اتجاهات البحث العربية، ويقترح كلمات مفتاحية وعناوين محسَّنة.",
    model: "Falcon-H1 Arabic 34B",
    endpointEnv: "FALCON_API_URL",
    icon: "Search",
    stage: 6,
    accent: "silver",
  },
  {
    id: "video",
    nameAr: "صانع الفيديو",
    nameEn: "Video Creator",
    descriptionAr:
      "يحوِّل الصور الثابتة والنصوص إلى إعلانات فيديو ديناميكية قصيرة عبر Cosmos-Transfer2.5.",
    model: "Cosmos-Transfer2.5",
    endpointEnv: "COSMOS_API_URL",
    icon: "Clapperboard",
    stage: 7,
    accent: "blue",
  },
];

export const AGENTS_BY_ID: Record<AgentId, AgentDefinition> = AGENTS.reduce(
  (acc, agent) => {
    acc[agent.id] = agent;
    return acc;
  },
  {} as Record<AgentId, AgentDefinition>,
);

/**
 * True when the agent has a callable inference path configured in the current
 * environment — either an NVIDIA NIM key for `nvidiaModel`, or a custom
 * `endpointEnv` URL.
 */
export function isAgentConnected(agent: AgentDefinition): boolean {
  if (agent.nvidiaModel) {
    const key =
      (agent.nvidiaKeyEnv && process.env[agent.nvidiaKeyEnv]) ||
      process.env.NVIDIA_API_KEY ||
      process.env.NEMOTRON_API_KEY ||
      process.env.Api;
    if (key) return true;
  }
  return Boolean(process.env[agent.endpointEnv]);
}

/** Default 5-stage pipeline used by the orchestrator for v1 campaigns. */
export const DEFAULT_PIPELINE: AgentId[] = [
  "manager",
  "strategist",
  "copywriter",
  "designer",
  "social",
];
