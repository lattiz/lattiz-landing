import "server-only";

import { cache } from "react";
import { getLattizApiUrl, getTemplatePreviewsOrigin } from "./config";
import { parseTemplates, type DroppedTemplate, type LandingTemplate } from "./schema";

const REQUEST_TIMEOUT_MS = 5_000;
const REVALIDATE_SECONDS = 300;

export type TemplatesFetchErrorKind = "timeout" | "network" | "http" | "invalid-payload";

export class TemplatesFetchError extends Error {
  readonly kind: TemplatesFetchErrorKind;
  readonly status?: number;

  constructor(kind: TemplatesFetchErrorKind, message: string, options?: { status?: number; cause?: unknown }) {
    super(message, { cause: options?.cause });
    this.name = "TemplatesFetchError";
    this.kind = kind;
    this.status = options?.status;
  }
}

// Log each distinct set of dropped items once per server instance instead of
// on every render/revalidation.
const loggedDrops = new Set<string>();

function logDropped(dropped: DroppedTemplate[]): void {
  if (dropped.length === 0) return;
  const key = JSON.stringify(dropped);
  if (loggedDrops.has(key)) return;
  loggedDrops.add(key);
  console.warn(`[templates] Dropped ${dropped.length} invalid template(s) from the API response:`, dropped);
}

/**
 * Fetches the public templates list on the server (ISR, revalidated every 5 min).
 *
 * Throws `TemplatesConfigError` when env is missing/invalid and
 * `TemplatesFetchError` on timeout, network failure, non-2xx or a payload that
 * is not an array. A valid empty array resolves to `[]`.
 */
export const getTemplates = cache(async (): Promise<LandingTemplate[]> => {
  const endpoint = `${getLattizApiUrl()}/public/templates`;
  const previewsOrigin = getTemplatePreviewsOrigin();

  let response: Response;
  try {
    response = await fetch(endpoint, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      next: { revalidate: REVALIDATE_SECONDS },
    });
  } catch (error) {
    if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) {
      throw new TemplatesFetchError("timeout", `GET ${endpoint} timed out after ${REQUEST_TIMEOUT_MS} ms`, {
        cause: error,
      });
    }
    throw new TemplatesFetchError("network", `GET ${endpoint} failed`, { cause: error });
  }

  if (!response.ok) {
    throw new TemplatesFetchError("http", `GET ${endpoint} responded ${response.status}`, {
      status: response.status,
    });
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch (error) {
    throw new TemplatesFetchError("invalid-payload", `GET ${endpoint} returned invalid JSON`, { cause: error });
  }

  if (!Array.isArray(payload)) {
    throw new TemplatesFetchError("invalid-payload", `GET ${endpoint} did not return an array`);
  }

  const { templates, dropped } = parseTemplates(payload, previewsOrigin);
  logDropped(dropped);
  return templates;
});
