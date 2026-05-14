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

/**
 * Agent identifier. Widened to `string` so users can register custom
 * agents at runtime via `/app/settings/agents`. Use `BUILTIN_AGENT_IDS`
 * for the 8 default roles shipped with AURA.
 */
export type AgentId = string;

export const BUILTIN_AGENT_IDS = [
  "vision",
  "manager",
  "strategist",
  "copywriter",
  "analyst",
  "designer",
  "social",
  "seo",
  "video",
] as const;
export type BuiltinAgentId = (typeof BUILTIN_AGENT_IDS)[number];

export type ProviderId = "nvidia" | "zai" | "openai-compatible";
export type ImageProviderId = "nvidia-image";

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

export interface ImageInferenceConfig {
  /** Image-gen provider tag. */
  provider: ImageProviderId;
  /** Full image-generation endpoint URL. */
  url: string;
  /** Model id for display. */
  model: string;
  /** Name of the env var that holds the API key. */
  keyEnv: string;
  /** Diffusion steps (FLUX [klein]/[schnell] usually 4-8). */
  steps: number;
}

export const AGENT_ICONS = [
  "Eye",
  "Target",
  "Lightbulb",
  "PenLine",
  "BarChart3",
  "Palette",
  "Share2",
  "Search",
  "Clapperboard",
  "Sparkles",
  "Megaphone",
  "Bot",
  "Brain",
  "Wand2",
] as const;
export type AgentIcon = (typeof AGENT_ICONS)[number];
export const AGENT_ACCENTS = ["blue", "teal", "silver"] as const;
export type AgentAccent = (typeof AGENT_ACCENTS)[number];

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
  /** Live (text) inference configuration. Omit to leave the agent on the stub. */
  inference?: InferenceConfig;
  /** Live image-generation configuration (for diffusion agents). */
  imageInference?: ImageInferenceConfig;
  /** System prompt used when invoking the model. */
  systemPromptAr?: string;
  /** Lucide icon name (kept generic for tree-shaking). */
  icon: AgentIcon;
  /** Stage order in the default campaign pipeline. */
  stage: number;
  /** Accent color token (Tailwind aura-*). */
  accent: AgentAccent;
  /** True when the agent participates in the default campaign pipeline. */
  pipelineEnabled?: boolean;
  /** True when the agent is disabled and should be skipped. */
  disabled?: boolean;
  /** True when this is a user-created custom agent (not a built-in). */
  custom?: boolean;
}

export const DEFAULT_AGENTS: AgentDefinition[] = [
  {
    id: "vision",
    nameAr: "وكيل الرؤية",
    nameEn: "Vision Analyst",
    descriptionAr:
      "يقرأ صورة المنتج الخام ويستخرج JSON منظَّمًا: الألوان، الخامات، إحداثيات السطح الذي يصلح لطباعة النصّ، ومقترحات السياق السعودي.",
    model: "Nemotron 3 Nano Omni 30B-A3B (Vision)",
    inference: {
      provider: "nvidia",
      url: "https://integrate.api.nvidia.com/v1/chat/completions",
      model: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning",
      keyEnv: "Api",
      reasoning: true,
    },
    endpointEnv: "VISION_API_URL",
    systemPromptAr:
      "أنت «وكيل الرؤية» في أورا. حلِّل صورة المنتج المرفوعة وأخرِج JSON صارمًا يصف الوصف والألوان والخامات وإحداثيات السطح الذي يصلح لطباعة النصّ، إضافة إلى مقترحات سياق سعودي. ممنوع أيّ نصّ خارج JSON.",
    icon: "Eye",
    stage: 0,
    accent: "teal",
    pipelineEnabled: false,
  },
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
    stage: 1,
    accent: "blue",
    pipelineEnabled: true,
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
    stage: 2,
    accent: "teal",
    pipelineEnabled: true,
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
    stage: 3,
    accent: "blue",
    pipelineEnabled: true,
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
    stage: 4,
    accent: "teal",
  },
  {
    id: "designer",
    nameAr: "المصمِّم الإبداعي",
    nameEn: "Creative Designer",
    descriptionAr:
      "يولِّد خلفيات بصرية عبر FLUX.2 [klein] 4B ثم يجهِّز الصورة لطباعة النص العربي بدقة طباعية كاملة.",
    model: "FLUX.2 [klein] 4B",
    imageInference: {
      provider: "nvidia-image",
      url: "https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.2-klein-4b",
      model: "black-forest-labs/flux.2-klein-4b",
      keyEnv: "Flux",
      steps: 4,
    },
    endpointEnv: "FLUX_API_URL",
    systemPromptAr:
      "أنت «المصمِّم الإبداعي» في منصَّة أورا. صف بإيجاز خلفية إعلانية واحدة عالية الجودة تخدم نسخة الإعلان، مع مساحة سلبية كافية للنص العربي على اليمين.",
    icon: "Palette",
    stage: 5,
    accent: "blue",
    pipelineEnabled: true,
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
    stage: 6,
    accent: "teal",
    pipelineEnabled: true,
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
    stage: 7,
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
    stage: 8,
    accent: "blue",
  },
];

/**
 * Backwards-compatible alias. New code should import from `lib/registry.ts`
 * via `getAgents()` / `getAgentById()` so user overrides + custom agents are
 * respected. This export is kept so existing imports continue to compile.
 */
export const AGENTS: AgentDefinition[] = DEFAULT_AGENTS;
export const AGENTS_BY_ID: Record<AgentId, AgentDefinition> = DEFAULT_AGENTS.reduce(
  (acc, agent) => {
    acc[agent.id] = agent;
    return acc;
  },
  {} as Record<AgentId, AgentDefinition>,
);

/**
 * True when the agent has a callable inference path configured in the current
 * environment — either an `inference.keyEnv` / `imageInference.keyEnv` secret,
 * or a custom `endpointEnv` URL.
 */
export function isAgentConnected(agent: AgentDefinition): boolean {
  if (agent.inference && process.env[agent.inference.keyEnv]) return true;
  if (agent.imageInference && process.env[agent.imageInference.keyEnv])
    return true;
  return Boolean(process.env[agent.endpointEnv]);
}

/** Human-readable label for an inference provider id. */
export function providerLabel(provider: ProviderId | ImageProviderId): string {
  switch (provider) {
    case "nvidia":
      return "NVIDIA NIM";
    case "zai":
      return "Z.AI / GLM";
    case "openai-compatible":
      return "OpenAI-compatible";
    case "nvidia-image":
      return "NVIDIA NIM (Image)";
  }
}

/**
 * Default pipeline derived from `pipelineEnabled` + `stage`. Use
 * `getDefaultPipeline()` from `lib/registry.ts` for the live, user-aware
 * pipeline that includes custom agents.
 */
export const DEFAULT_PIPELINE: AgentId[] = DEFAULT_AGENTS.filter(
  (a) => a.pipelineEnabled,
)
  .sort((a, b) => a.stage - b.stage)
  .map((a) => a.id);
