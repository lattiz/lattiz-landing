import type { Metadata } from "next";
import Link from "next/link";
import { FAQs } from "@/app/components/FAQs";
import { Header } from "@/app/components/ui/header";
import { FaqsData } from "@/app/data/content";
import { ALL_FAQS, FAQ_CATEGORIES } from "@/app/data/faqs";
import { CircleQuestionMark } from "lucide-react";

const title = "Preguntas frecuentes";
const description =
	"Resuelve tus dudas sobre Lattiz: cómo funciona, la prueba gratuita, planes y pagos, dominio y cuota anual, cancelación y privacidad.";

export const metadata: Metadata = {
	title,
	description,
	alternates: { canonical: "/faqs" },
	openGraph: {
		title: `${title} | Lattiz`,
		description,
		url: "/faqs",
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

const faqJsonLd = {
	"@context": "https://schema.org",
	"@type": "FAQPage",
	mainEntity: ALL_FAQS.map((faq) => ({
		"@type": "Question",
		name: faq.question,
		acceptedAnswer: { "@type": "Answer", text: faq.answer },
	})),
};

export default function FaqsPage() {
	return (
		<main className="mx-auto w-full max-w-7xl px-0 pt-32 pb-24 md:pt-40">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
			/>
			<div className="px-4">
				<h1 className="sr-only">{title}</h1>
				<Header
					title={FaqsData.data.eyebrow}
					subtitle={FaqsData.data.title}
					icon={<CircleQuestionMark size={24} color="var(--color-primary)" />}
				/>
				<p className="mt-2 max-w-2xl text-sm leading-6 text-primary/80 md:text-base">
					Reunimos las respuestas basadas en nuestros{" "}
					<Link href="/terms" className="font-medium text-primary underline underline-offset-2">
						Términos y Condiciones
					</Link>{" "}
					y nuestro{" "}
					<Link href="/privacy" className="font-medium text-primary underline underline-offset-2">
						Aviso de Privacidad
					</Link>
					. Si no encuentras la tuya, escríbenos a{" "}
					<a href="mailto:contacto@lattiz.app" className="font-medium text-primary underline underline-offset-2">
						contacto@lattiz.app
					</a>
					.
				</p>
			</div>

			{FAQ_CATEGORIES.map((category) => (
				<FAQs
					key={category.id}
					id={category.id}
					compact
					data={{ eyebrow: category.title }}
					items={category.items}
				/>
			))}
		</main>
	);
}
