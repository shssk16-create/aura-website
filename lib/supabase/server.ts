/**
 * Supabase server client.
 *
 * @scaffold — the project supports two storage backends:
 *
 *   1. Supabase (Postgres + Storage), when `SUPABASE_URL` and
 *      `SUPABASE_SERVICE_ROLE_KEY` (or `SUPABASE_ANON_KEY` for tenant-scoped
 *      reads) are configured.
 *   2. File-backed JSON store (`lib/store.ts` + `lib/style.ts`), which keeps
 *      the local dashboard demoable without provisioning a Supabase
 *      project.
 *
 * The functions in this module are intentionally lazy: they import
 * `@supabase/supabase-js` dynamically so the dependency is optional. If the
 * package is not installed and Supabase env vars are unset, every call
 * returns `null` and downstream code falls back to the file store.
 *
 * The `@supabase/supabase-js` package is NOT in `package.json` by default —
 * add it (`npm install @supabase/supabase-js`) when you wire a real
 * project. Until then, this module simply reports the backend as
 * "unconfigured".
 */

import type { Database } from "./types";

export interface SupabaseClients {
  /** Service-role client (bypasses RLS — use only in trusted server code). */
  service: unknown;
  /** Anon client (respects RLS — safe for tenant-scoped reads). */
  anon: unknown;
}

let cached: SupabaseClients | null | undefined;

/**
 * Returns the Supabase clients, or `null` when the project is unconfigured.
 * Cached after the first call.
 */
export async function getSupabase(): Promise<SupabaseClients | null> {
  if (cached !== undefined) return cached;

  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.SUPABASE_ANON_KEY;

  if (!url || (!serviceKey && !anonKey)) {
    cached = null;
    return null;
  }

  let createClient: unknown;
  try {
    // The module specifier is computed at runtime so TypeScript does not
    // attempt to resolve `@supabase/supabase-js` at build time. This keeps
    // the SDK as an *optional* peer dependency — install it explicitly
    // when wiring a real Supabase project.
    const specifier = ["@supabase", "supabase-js"].join("/");
    const dynamicImport = new Function(
      "s",
      "return import(s)",
    ) as (s: string) => Promise<unknown>;
    const mod = (await dynamicImport(specifier).catch(() => null)) as
      | { createClient?: unknown }
      | null;
    createClient = mod?.createClient;
  } catch {
    createClient = undefined;
  }

  if (typeof createClient !== "function") {
    cached = null;
    return null;
  }

  const factory = createClient as <T>(url: string, key: string) => T;
  cached = {
    service: serviceKey ? factory<Database>(url, serviceKey) : null,
    anon: anonKey ? factory<Database>(url, anonKey) : null,
  };
  return cached;
}

/** True when Supabase clients are configured AND the SDK is installed. */
export async function isSupabaseConfigured(): Promise<boolean> {
  const c = await getSupabase();
  return c !== null && (c.service !== null || c.anon !== null);
}
