import type { Metadata } from "next";
import { LegalDocument } from "@/app/components/legal/LegalDocument";
import { LEGAL_DOCUMENTS } from "@/lib/legal/documents";
import { getLegalDocument } from "@/sanity/content";

const doc = LEGAL_DOCUMENTS.privacy;

export async function generateMetadata(): Promise<Metadata> {
	const { title, description } = await getLegalDocument("privacy");
	return {
		title,
		description,
		alternates: { canonical: doc.href },
		openGraph: {
			title: `${title} | Lattiz`,
			description,
			url: doc.href,
			siteName: "Lattiz",
			locale: "es_MX",
			type: "website",
		},
		twitter: {
			card: "summary",
			title: `${title} | Lattiz`,
			description,
		},
	};
}

export default async function PrivacyPage() {
	const { markdown } = await getLegalDocument("privacy");
	return <LegalDocument markdown={markdown} currentHref={doc.href} />;
}
