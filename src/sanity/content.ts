import "server-only";
import { FAQ_CATEGORIES, type FaqCategory, type FaqItem } from "@/app/data/faqs";
import {
	DOMAIN_MAINTENANCE_DISCLOSURE,
	TIERS,
	type PricingTier,
} from "@/app/data/pricing";
import {
	LEGAL_DOCUMENTS,
	readLegalMarkdown,
	type LegalSlug,
} from "@/lib/legal/documents";
import { sanityFetch } from "./client";
import {
	FAQ_CATEGORIES_QUERY,
	LEGAL_DOCUMENT_QUERY,
	PRICING_QUERY,
} from "./queries";

type SanityFaqCategory = {
	id: string | null;
	title: string | null;
	items: {
		id: string;
		question: string | null;
		answer: string | null;
		featuredOrder: number | null;
	}[];
};

type SanityPricing = {
	plans: {
		id: string | null;
		name: string | null;
		priceMonthly: number | null;
		priceAnnual: number | null;
		priceLabel: string | null;
		description: string | null;
		features: string[] | null;
		ctaLabel: string | null;
		emphasis: "none" | "popular" | "highlighted" | null;
	}[];
	annualFeeNote: string | null;
};

type SanityLegalDocument = {
	title: string | null;
	description: string | null;
	version: string | null;
	updatedOn: string | null;
	body: string | null;
};

export type LegalContent = {
	title: string;
	description: string;
	markdown: string;
};

/** FAQ categories from Sanity; the bundled list when Sanity has none. */
export async function getFaqCategories(): Promise<FaqCategory[]> {
	const rows = await sanityFetch<SanityFaqCategory[]>(FAQ_CATEGORIES_QUERY);
	const categories = (rows ?? [])
		.map((row) => ({
			id: row.id ?? "",
			title: row.title ?? "",
			items: row.items
				.filter((item) => item.question && item.answer)
				.map((item) => ({
					id: item.id,
					question: item.question as string,
					answer: item.answer as string,
					...(item.featuredOrder != null ? { featuredOrder: item.featuredOrder } : {}),
				})),
		}))
		.filter((category) => category.id && category.items.length > 0);
	return categories.length > 0 ? categories : FAQ_CATEGORIES;
}

export function featuredFaqs(categories: FaqCategory[]): FaqItem[] {
	return categories
		.flatMap((category) => category.items)
		.filter((item) => item.featuredOrder != null)
		.sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0));
}

export async function getPricing(): Promise<{ tiers: PricingTier[]; disclosure: string }> {
	const data = await sanityFetch<SanityPricing>(PRICING_QUERY);
	const tiers = (data?.plans ?? []).flatMap((plan): PricingTier[] => {
		const fixed = plan.priceMonthly != null && plan.priceAnnual != null;
		if (!plan.id || !plan.name || (!fixed && !plan.priceLabel)) return [];
		return [
			{
				id: plan.id,
				name: plan.name,
				price: fixed
					? { mensual: plan.priceMonthly as number, anual: plan.priceAnnual as number }
					: { mensual: plan.priceLabel as string, anual: plan.priceLabel as string },
				description: plan.description ?? "",
				features: plan.features ?? [],
				cta: plan.ctaLabel ?? "Empezar",
				popular: plan.emphasis === "popular",
				highlighted: plan.emphasis === "highlighted",
			},
		];
	});
	if (tiers.length === 0) return { tiers: TIERS, disclosure: DOMAIN_MAINTENANCE_DISCLOSURE };
	return { tiers, disclosure: data?.annualFeeNote ?? DOMAIN_MAINTENANCE_DISCLOSURE };
}

/** Legal text from Sanity (Markdown); the file in `content/legal` when Sanity has none. */
export async function getLegalDocument(slug: LegalSlug): Promise<LegalContent> {
	const meta = LEGAL_DOCUMENTS[slug];
	const doc = await sanityFetch<SanityLegalDocument>(LEGAL_DOCUMENT_QUERY, { kind: slug });
	if (doc?.body) {
		return {
			title: doc.title ?? meta.title,
			description: doc.description ?? meta.description,
			markdown: doc.body,
		};
	}
	return {
		title: meta.title,
		description: meta.description,
		markdown: await readLegalMarkdown(slug),
	};
}
