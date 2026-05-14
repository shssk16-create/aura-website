/**
 * Hand-written Supabase database types.
 *
 * In a fully wired deployment these would be generated via
 *   `supabase gen types typescript --linked > lib/supabase/types.ts`.
 * The hand-written shape lives here so the rest of the codebase can import
 * stable types without requiring the Supabase CLI to be installed.
 */

export type GenerationJobStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export type SubscriptionTier = "free" | "pro" | "enterprise";

export interface UsersProfileRow {
  id: string;
  company_name: string;
  commercial_registration_number: string | null;
  preferred_locale: string;
  created_at: string;
  updated_at: string;
}

export interface UserCreditsRow {
  account_id: string;
  available_tokens: number;
  subscription_tier: SubscriptionTier;
  last_refilled_at: string;
  updated_at: string;
}

export interface ProductRow {
  id: string;
  account_id: string;
  display_name: string;
  raw_storage_path: string;
  vision_metadata: VisionMetadata | null;
  created_at: string;
  updated_at: string;
}

export interface VisionMetadata {
  description: string;
  dominant_colors: string[];
  materials: string[];
  label_surfaces: LabelSurface[];
  cultural_context_hints: string[];
}

export interface LabelSurface {
  /** e.g. "front", "side", "lid". */
  label: string;
  /**
   * Four (x, y) corner points in clockwise order, normalised to
   * [0, 1] image-space coordinates.
   */
  polygon: [
    [number, number],
    [number, number],
    [number, number],
    [number, number],
  ];
}

export interface GenerationJobRow {
  id: string;
  account_id: string;
  product_id: string | null;
  status: GenerationJobStatus;
  input: GenerationJobInput;
  progress: GenerationJobProgress;
  output: GenerationJobOutput | null;
  locked_at: string | null;
  attempts: number;
  last_error: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface GenerationJobInput {
  brand: string;
  goal: string;
  audience: string;
  channel: string;
  tone: string;
  /** Optional override for the headline; otherwise the LLM picks one. */
  headline?: string;
  /** Pipeline agent ids, in order. */
  pipeline: string[];
}

export interface GenerationJobProgress {
  stage?: string;
  /** 0..1 fraction. */
  fraction?: number;
  /** Last visible delta the worker emitted. */
  message?: string;
}

export interface GenerationJobOutput {
  /** Storage path of the final composited image. */
  final_storage_path: string;
  /** Storage path of the diffusion background (pre-text). */
  background_storage_path: string;
  /** Final headline / body / CTA strings. */
  copy: {
    headline_ar: string;
    body_ar: string;
    cta_ar: string;
  };
}

export interface StyleCorpusRow {
  id: string;
  account_id: string;
  brand: string;
  channel: string;
  tone: string;
  agents: string[];
  body: string;
  label: string;
  created_at: string;
  updated_at: string;
}

export interface AuditLogRow {
  id: string;
  account_id: string | null;
  actor: string;
  action: string;
  target_table: string | null;
  target_id: string | null;
  payload: Record<string, unknown>;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      users_profile: {
        Row: UsersProfileRow;
        Insert: Omit<UsersProfileRow, "created_at" | "updated_at"> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<UsersProfileRow>;
      };
      user_credits: {
        Row: UserCreditsRow;
        Insert: Omit<UserCreditsRow, "updated_at" | "last_refilled_at"> & {
          updated_at?: string;
          last_refilled_at?: string;
        };
        Update: Partial<UserCreditsRow>;
      };
      products: {
        Row: ProductRow;
        Insert: Omit<ProductRow, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<ProductRow>;
      };
      generation_jobs: {
        Row: GenerationJobRow;
        Insert: Omit<
          GenerationJobRow,
          "id" | "created_at" | "updated_at" | "completed_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
        };
        Update: Partial<GenerationJobRow>;
      };
      style_corpus: {
        Row: StyleCorpusRow;
        Insert: Omit<StyleCorpusRow, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<StyleCorpusRow>;
      };
      audit_log: {
        Row: AuditLogRow;
        Insert: Omit<AuditLogRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: never;
      };
    };
  };
}
