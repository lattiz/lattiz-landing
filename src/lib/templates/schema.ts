// Shape and validation of `GET /public/templates`. The payload is untrusted:
// every item is checked individually and invalid ones are dropped, never the
// whole list.

export interface LandingTemplate {
  id: string;
  name: string;
  description?: string;
  category?: string;
  previewUrl: string;
  thumbnailUrl: string;
  sortOrder: number;
}

export interface DroppedTemplate {
  index: number;
  id?: string;
  reason: string;
}

export interface ParsedTemplates {
  templates: LandingTemplate[];
  dropped: DroppedTemplate[];
}

// Thumbnails are rendered with next/image, which throws on hosts that are not
// in `images.remotePatterns`. Keep these in sync with next.config.ts so an
// unexpected host drops the item instead of breaking the page.
export const THUMBNAIL_HOSTNAME = "assets.lattiz.app";
export const THUMBNAIL_PATH_PREFIX = "/templates/";

type Result<T> = { ok: true; value: T } | { ok: false; reason: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseUrl(value: string): URL | null {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

export function isSafePreviewUrl(value: unknown, allowedOrigin: string): value is string {
  if (typeof value !== "string") return false;
  const url = parseUrl(value);
  return url !== null && url.protocol === "https:" && url.origin === allowedOrigin;
}

export function isUsableThumbnailUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const url = parseUrl(value);
  return (
    url !== null &&
    url.protocol === "https:" &&
    url.hostname === THUMBNAIL_HOSTNAME &&
    url.port === "" &&
    url.pathname.startsWith(THUMBNAIL_PATH_PREFIX)
  );
}

function requiredString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

// `undefined` means "absent" (null, missing or blank); `null` means wrong type.
function optionalString(value: unknown): string | undefined | null {
  if (value === null || value === undefined) return undefined;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

export function parseTemplate(raw: unknown, previewsOrigin: string): Result<LandingTemplate> {
  if (!isRecord(raw)) return { ok: false, reason: "not an object" };

  const id = requiredString(raw.id);
  if (id === null) return { ok: false, reason: "missing id" };

  const name = requiredString(raw.name);
  if (name === null) return { ok: false, reason: "missing name" };

  const description = optionalString(raw.description);
  if (description === null) return { ok: false, reason: "invalid description" };

  const category = optionalString(raw.category);
  if (category === null) return { ok: false, reason: "invalid category" };

  if (!isSafePreviewUrl(raw.previewUrl, previewsOrigin)) {
    return { ok: false, reason: `previewUrl is not an https URL on ${previewsOrigin}` };
  }

  if (!isUsableThumbnailUrl(raw.thumbnailUrl)) {
    return { ok: false, reason: "thumbnailUrl missing or not on an allowed image host" };
  }

  if (typeof raw.sortOrder !== "number" || !Number.isFinite(raw.sortOrder)) {
    return { ok: false, reason: "invalid sortOrder" };
  }

  return {
    ok: true,
    value: {
      id,
      name,
      ...(description !== undefined && { description }),
      ...(category !== undefined && { category }),
      previewUrl: raw.previewUrl,
      thumbnailUrl: raw.thumbnailUrl,
      sortOrder: raw.sortOrder,
    },
  };
}

const byName = new Intl.Collator("es", { sensitivity: "base" });

export function compareTemplates(a: LandingTemplate, b: LandingTemplate): number {
  return a.sortOrder - b.sortOrder || byName.compare(a.name, b.name);
}

/**
 * Validates a payload already known to be an array: drops invalid items,
 * dedupes by `id` (first occurrence wins) and sorts by `sortOrder`, then `name`.
 */
export function parseTemplates(items: readonly unknown[], previewsOrigin: string): ParsedTemplates {
  const templates: LandingTemplate[] = [];
  const dropped: DroppedTemplate[] = [];
  const seen = new Set<string>();

  items.forEach((raw, index) => {
    const result = parseTemplate(raw, previewsOrigin);
    const rawId = isRecord(raw) && typeof raw.id === "string" ? raw.id : undefined;

    if (!result.ok) {
      dropped.push({ index, id: rawId, reason: result.reason });
      return;
    }
    if (seen.has(result.value.id)) {
      dropped.push({ index, id: result.value.id, reason: "duplicate id" });
      return;
    }
    seen.add(result.value.id);
    templates.push(result.value);
  });

  templates.sort(compareTemplates);
  return { templates, dropped };
}
