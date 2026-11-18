import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { SANITY_TAG } from "@/sanity/client";

function sameSecret(given: string, expected: string): boolean {
	const a = Buffer.from(given);
	const b = Buffer.from(expected);
	return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Sanity webhook: refreshes the content right after a publish instead of
 * waiting for the five-minute revalidation. Off until the secret is set.
 */
export async function POST(request: Request) {
	const expected = process.env.SANITY_REVALIDATE_SECRET?.trim();
	if (!expected) return Response.json({ error: "not_configured" }, { status: 503 });

	const given = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
	if (!sameSecret(given, expected)) {
		return Response.json({ error: "unauthorized" }, { status: 401 });
	}

	revalidateTag(SANITY_TAG, "max");
	return Response.json({ revalidated: true });
}
