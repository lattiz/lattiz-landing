import type { Metadata } from "next";
import { LegalDocument } from "@/app/components/legal/LegalDocument";
import { LEGAL_DOCUMENTS, readLegalMarkdown } from "@/lib/legal/documents";

const doc = LEGAL_DOCUMENTS.cookies;

export const metadata: Metadata = {
	title: doc.title,
	description: doc.description,
	alternates: { canonical: doc.href },
	openGraph: {
		title: `${doc.title} | Lattiz`,
		description: doc.description,
		url: doc.href,
		siteName: "Lattiz",
		locale: "es_MX",
		type: "website",
	},
	twitter: {
		card: "summary",
		title: `${doc.title} | Lattiz`,
		description: doc.description,
	},
};

export default async function CookiesPage() {
	const markdown = await readLegalMarkdown("cookies");
	return <LegalDocument markdown={markdown} currentHref={doc.href} />;
}
