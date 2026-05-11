/**
 * Agent registry for the AURA AI marketing SaaS.
 *
 * Each agent describes its role and the model it should call. Inference
 * details live in the optional `inference` block: any OpenAI-compatible
 * provider (NVIDIA NIM, Z.AI / GLM, OpenAI, vLLM, etc.) just declares its
 * base URL, model id, and the env var holding the API key. The orchestrator
 * uses a single streaming code path for all of them and falls back to a
 * deterministic stub when the key is missing.
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

export type ProviderId = "nvidia" | "zai" | "openai-compatible";

export interface InferenceConfig {
  /** Provider tag, controls per-provider quirks (key sanitisation, etc.). */
  provider: ProviderId;
  /** Full OpenAI-compatible chat-completions URL. */
  url: string;
  /** Model id exactly as the provider expects it. */
  model: string;
  /** Name of the env var that holds the API key. */
  keyEnv: string;
  /** Reasoning model? Suppress `delta.reasoning_content` in the stream. */
  reasoning?: boolean;
}

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
  /** Env-var key holding a custom inference endpoint URL (legacy hook). */
  endpointEnv: string;
  /** Live inference configuration. Omit to leave the agent on the stub. */
  inference?: InferenceConfig;
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
    inference: {
      provider: "nvidia",
      url: "https://integrate.api.nvidia.com/v1/chat/completions",
      model: "nvidia/llama-3.3-nemotron-super-49b-v1",
      keyEnv: "Api",
    },
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
    inference: {
      provider: "nvidia",
      url: "https://integrate.api.nvidia.com/v1/chat/completions",
      model: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning",
      keyEnv: "Api",
      reasoning: true,
    },
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
    model: "GLM-4.5 (Z.AI)",
    inference: {
      provider: "zai",
      url: "https://api.z.ai/api/paas/v4/chat/completions",
      model: "glm-4.5",
      keyEnv: "Glm",
    },
    endpointEnv: "JAIS_API_URL",
    systemPromptAr:
      "أنت «كاتب إعلانات» في منصَّة أورا. اكتب نسخة إعلانية عربية بيضاء فصيحة تتألَّف من: عنوان رئيس قصير، ثلاثة إلى أربعة أسطر للنسخة الجسمية، ثمَّ دعوة فعل واحدة واضحة. اجتنب الترجمة الحرفية والترقيم التفصيلي، ولا تتجاوز ٦ أسطر إجمالاً.",
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
 * environment — either an `inference.keyEnv` secret, or a custom `endpointEnv`
 * URL.
 */
export function isAgentConnected(agent: AgentDefinition): boolean {
  if (agent.inference && process.env[agent.inference.keyEnv]) return true;
  return Boolean(process.env[agent.endpointEnv]);
}

/** Human-readable label for an inference provider id. */
export function providerLabel(provider: ProviderId): string {
  switch (provider) {
    case "nvidia":
      return "NVIDIA NIM";
    case "zai":
      return "Z.AI / GLM";
    case "openai-compatible":
      return "OpenAI-compatible";
  }
}

/** Default 5-stage pipeline used by the orchestrator for v1 campaigns. */
export const DEFAULT_PIPELINE: AgentId[] = [
  "manager",
  "strategist",
  "copywriter",
  "designer",
  "social",
];
