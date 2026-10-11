import { readFile } from "node:fs/promises";
import path from "node:path";

export type LegalSlug = "terms" | "privacy" | "cookies";

export type LegalDocumentMeta = {
	title: string;
	description: string;
	file: string;
	href: `/${LegalSlug}`;
};

export const LEGAL_DOCUMENTS: Record<LegalSlug, LegalDocumentMeta> = {
	terms: {
		title: "Términos y Condiciones",
		description:
			"Condiciones de uso de Lattiz: cuenta, planes, pagos, dominios y responsabilidades de quien publica un sitio.",
		file: "terminos-y-condiciones.md",
		href: "/terms",
	},
	privacy: {
		title: "Política de Privacidad",
		description:
			"Aviso de privacidad de Lattiz: qué datos tratamos, para qué, con quién y cómo ejercer tus derechos.",
		file: "politica-de-privacidad.md",
		href: "/privacy",
	},
	cookies: {
		title: "Política de Cookies",
		description:
			"Qué cookies y tecnologías similares usa Lattiz en el sitio informativo, el panel y los sitios de los clientes.",
		file: "politica-de-cookies.md",
		href: "/cookies",
	},
};

export type LegalHeading = {
	id: string;
	text: string;
};

export async function readLegalMarkdown(slug: LegalSlug): Promise<string> {
	const filePath = path.join(process.cwd(), "content", "legal", LEGAL_DOCUMENTS[slug].file);
	return readFile(filePath, "utf8");
}

// Keeps [NEGOCIO: …] as visible text. These files have no Markdown links;
// escaping the marker stops a later reference definition from swallowing it.
export function protectBusinessMarkers(markdown: string): string {
	return markdown.replaceAll("[NEGOCIO:", "\\[NEGOCIO:");
}

export function slugifyHeading(text: string): string {
	const plain = text.replace(/`([^`]*)`/g, "$1").replace(/[*_]/g, "").trim();
	const slug = plain
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
	return slug || "seccion";
}

function uniqueSlug(base: string, used: Map<string, number>): string {
	const count = used.get(base) ?? 0;
	used.set(base, count + 1);
	return count === 0 ? base : `${base}-${count + 1}`;
}

export function extractHeadings(markdown: string): LegalHeading[] {
	const used = new Map<string, number>();
	const headings: LegalHeading[] = [];

	for (const line of markdown.split("\n")) {
		const match = /^##\s+(.+?)\s*$/.exec(line);
		if (!match) continue;
		const text = match[1].replace(/`([^`]*)`/g, "$1").replace(/[*_]/g, "").trim();
		headings.push({ id: uniqueSlug(slugifyHeading(text), used), text });
	}

	return headings;
}
