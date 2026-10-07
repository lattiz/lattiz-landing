// Server-side env for the templates data layer. Read lazily (inside functions)
// so a missing value fails at the point of use with a clear message.

const DEFAULT_TEMPLATE_PREVIEWS_ORIGIN = "https://templates.lattiz.app";

export class TemplatesConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TemplatesConfigError";
  }
}

/**
 * `LATTIZ_API_URL` without trailing slashes, e.g. `https://api.lattiz.app`.
 * Stripping them avoids `//public/templates`, which the API redirects.
 */
export function getLattizApiUrl(): string {
  const raw = process.env.LATTIZ_API_URL?.trim();
  if (!raw) {
    throw new TemplatesConfigError(
      "LATTIZ_API_URL is not set. Add it to the environment (e.g. LATTIZ_API_URL=https://api.lattiz.app) " +
        "in .env.local for development and in the Vercel project for Production and Preview.",
    );
  }

  const normalized = raw.replace(/\/+$/, "");
  let url: URL;
  try {
    url = new URL(normalized);
  } catch {
    throw new TemplatesConfigError(`LATTIZ_API_URL is not a valid URL: "${raw}".`);
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new TemplatesConfigError(`LATTIZ_API_URL must be an http(s) URL: "${raw}".`);
  }
  if (url.search || url.hash) {
    throw new TemplatesConfigError(`LATTIZ_API_URL must not include a query string or hash: "${raw}".`);
  }
  return normalized;
}

/** Origin every template `previewUrl` must belong to (default https://templates.lattiz.app). */
export function getTemplatePreviewsOrigin(): string {
  const raw = process.env.TEMPLATE_PREVIEWS_ORIGIN?.trim() || DEFAULT_TEMPLATE_PREVIEWS_ORIGIN;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new TemplatesConfigError(`TEMPLATE_PREVIEWS_ORIGIN is not a valid URL: "${raw}".`);
  }
  if (url.protocol !== "https:") {
    throw new TemplatesConfigError(`TEMPLATE_PREVIEWS_ORIGIN must use https: "${raw}".`);
  }
  return url.origin;
}
