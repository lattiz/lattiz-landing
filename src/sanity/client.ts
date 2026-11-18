import "server-only";
import { createClient, type SanityClient } from "@sanity/client";

const API_VERSION = "2026-06-01";

/** Seconds a Sanity response is reused before Next revalidates it in the background. */
export const SANITY_REVALIDATE_SECONDS = 300;
/** One tag for all Sanity content; `/api/revalidate` invalidates it after a publish. */
export const SANITY_TAG = "sanity";

let client: SanityClient | null | undefined;

/**
 * Server-only client for the private dataset. Null when the variables are not
 * set, so every loader falls back to the content bundled in the repo.
 */
export function sanityClient(): SanityClient | null {
	if (client !== undefined) return client;
	const projectId = process.env.SANITY_PROJECT_ID?.trim();
	const token = process.env.SANITY_API_READ_TOKEN?.trim();
	client =
		projectId && token
			? createClient({
					projectId,
					dataset: process.env.SANITY_DATASET?.trim() || "production",
					apiVersion: API_VERSION,
					token,
					// The dataset is private: the CDN cannot serve it without the token anyway.
					useCdn: false,
					perspective: "published",
				})
			: null;
	return client;
}

export async function sanityFetch<T>(
	query: string,
	params: Record<string, unknown> = {},
): Promise<T | null> {
	const sanity = sanityClient();
	if (!sanity) return null;
	try {
		return await sanity.fetch<T>(query, params, {
			next: { revalidate: SANITY_REVALIDATE_SECONDS, tags: [SANITY_TAG] },
		});
	} catch (error) {
		console.error(
			`Sanity fetch failed; serving bundled content: ${error instanceof Error ? error.message : "unknown"}`,
		);
		return null;
	}
}
