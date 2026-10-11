import Link from "next/link";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ReactNode } from "react";
import {
	LEGAL_DOCUMENTS,
	extractHeadings,
	protectBusinessMarkers,
	type LegalHeading,
} from "@/lib/legal/documents";

const tocLinkClassName =
	"block rounded-md px-2 py-1.5 text-sm leading-snug text-card-foreground/80 hover:bg-muted hover:text-card-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

function reactNodeToText(node: ReactNode): string {
	if (typeof node === "string" || typeof node === "number") return String(node);
	if (Array.isArray(node)) return node.map(reactNodeToText).join("");
	if (node && typeof node === "object" && "props" in node) {
		const element = node as { props?: { children?: ReactNode } };
		return reactNodeToText(element.props?.children);
	}
	return "";
}

function createMarkdownComponents(headings: LegalHeading[]): Components {
	let h2Index = 0;

	return {
		h1: ({ children }) => (
			<h1 className="text-3xl font-semibold tracking-tight text-card-foreground md:text-4xl">
				{children}
			</h1>
		),
		h2: ({ children }) => {
			const heading = headings[h2Index];
			h2Index += 1;
			return (
				<h2
					id={heading?.id}
					className="mt-10 mb-3 scroll-mt-32 text-xl font-semibold tracking-tight text-card-foreground md:text-2xl"
				>
					{children}
				</h2>
			);
		},
		h3: ({ children }) => (
			<h3 className="mt-8 mb-2 scroll-mt-32 text-lg font-semibold text-card-foreground">
				{children}
			</h3>
		),
		p: ({ children }) => {
			const isVersion = reactNodeToText(children).startsWith("Versión ");
			return (
				<p
					className={
						isVersion
							? "mt-3 text-sm leading-6 text-card-foreground/70"
							: "my-4 leading-7 text-card-foreground"
					}
				>
					{children}
				</p>
			);
		},
		ul: ({ children }) => <ul className="my-4 list-disc space-y-2 pl-6">{children}</ul>,
		ol: ({ children }) => <ol className="my-4 list-decimal space-y-2 pl-6">{children}</ol>,
		li: ({ children }) => <li className="leading-7">{children}</li>,
		strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
		a: ({ href, children }) => {
			const external = typeof href === "string" && /^https?:\/\//.test(href);
			return (
				<a
					href={href}
					className="font-medium text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
					{...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
				>
					{children}
				</a>
			);
		},
		code: ({ children }) => (
			<code className="break-words rounded bg-muted px-1 py-0.5 font-mono text-[0.875em] text-card-foreground">
				{children}
			</code>
		),
		table: ({ children }) => (
			<div className="my-6 max-w-full overflow-x-auto overscroll-x-contain">
				<table className="w-full min-w-[36rem] border-collapse text-left text-sm leading-6">
					{children}
				</table>
			</div>
		),
		th: ({ children }) => (
			<th
				scope="col"
				className="border border-border bg-muted px-3 py-2 align-bottom font-semibold text-card-foreground"
			>
				{children}
			</th>
		),
		td: ({ children }) => (
			<td className="border border-border px-3 py-2 align-top text-card-foreground">{children}</td>
		),
	};
}

function TocList({ headings }: { headings: LegalHeading[] }) {
	return (
		<ul className="space-y-0.5">
			{headings.map((heading) => (
				<li key={heading.id}>
					<a href={`#${heading.id}`} className={tocLinkClassName}>
						{heading.text}
					</a>
				</li>
			))}
		</ul>
	);
}

export function LegalDocument({
	markdown,
	currentHref,
}: {
	markdown: string;
	currentHref: string;
}) {
	const headings = extractHeadings(markdown);
	const others = Object.values(LEGAL_DOCUMENTS).filter((doc) => doc.href !== currentHref);

	return (
		<main className="mx-auto w-full max-w-6xl px-4 pt-32 pb-24 md:px-6 md:pt-40">
			<div className="lg:grid lg:grid-cols-[minmax(0,15rem)_minmax(0,72ch)] lg:justify-center lg:gap-14">
				<nav aria-label="Índice del documento" className="mb-8 min-w-0 lg:mb-0">
					<details className="rounded-lg border border-border bg-card lg:hidden">
						<summary className="cursor-pointer px-4 py-3 font-medium text-card-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
							Índice
						</summary>
						<div className="px-2 pb-3">
							<TocList headings={headings} />
						</div>
					</details>
					<div
						className="sticky top-28 hidden max-h-[calc(100vh-8rem)] overflow-y-auto lg:block"
						data-lenis-prevent
					>
						<p className="mb-2 px-2 text-xs font-semibold tracking-wide text-card-foreground/60 uppercase">
							Índice
						</p>
						<TocList headings={headings} />
					</div>
				</nav>

				<article className="min-w-0 max-w-[72ch] text-base text-card-foreground">
					<ReactMarkdown remarkPlugins={[remarkGfm]} components={createMarkdownComponents(headings)}>
						{protectBusinessMarkers(markdown)}
					</ReactMarkdown>

					<section className="mt-12 border-t border-border pt-6" aria-label="Otros documentos legales">
						<p className="text-sm font-medium text-card-foreground">También puedes consultar</p>
						<ul className="mt-3 space-y-2">
							{others.map((doc) => (
								<li key={doc.href}>
									<Link
										href={doc.href}
										className="text-sm font-medium text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
									>
										{doc.title}
									</Link>
								</li>
							))}
						</ul>
					</section>
				</article>
			</div>
		</main>
	);
}
