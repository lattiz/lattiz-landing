"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { ArrowUp, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

type LattiMessage = UIMessage<{ remaining?: number }>;

const MAX_CHARS = 1000;
const CONVERSATION_KEY = "latti-conversation";
const GENERIC_ERROR = "No pude responder en este momento. Inténtalo de nuevo en un minuto.";
const SUGGESTIONS = [
	"¿Cuánto cuesta y qué incluye cada plan?",
	"¿Qué plantilla me conviene para mi negocio?",
	"¿El dominio está incluido?",
];

function conversationId(): string {
	try {
		const saved = sessionStorage.getItem(CONVERSATION_KEY);
		if (saved) return saved;
		const created = crypto.randomUUID();
		sessionStorage.setItem(CONVERSATION_KEY, created);
		return created;
	} catch {
		return crypto.randomUUID();
	}
}

function textOf(message: UIMessage): string {
	return message.parts
		.map((part) => (part.type === "text" ? part.text : ""))
		.join("")
		.trim();
}

/** The API answers `{ error: { code, message } }`; anything else gets a fixed text. */
function errorText(error: Error): string {
	try {
		const body = JSON.parse(error.message) as { error?: { code?: string; message?: string } };
		const { code, message } = body.error ?? {};
		if (code?.startsWith("CHAT_") && message) return message;
		if (/too many/i.test(message ?? "")) {
			return "Vas muy rápido. Espera un minuto y vuelve a preguntar.";
		}
	} catch {
		// Network failures and stream errors are not JSON.
	}
	return GENERIC_ERROR;
}

function isLattizUrl(href: string | undefined): boolean {
	if (!href) return false;
	try {
		const url = new URL(href, "https://lattiz.app");
		return (
			url.protocol === "https:" &&
			(url.hostname === "lattiz.app" || url.hostname.endsWith(".lattiz.app"))
		);
	} catch {
		return false;
	}
}

// Model output is untrusted: no raw HTML (react-markdown default), no images, only Lattiz links.
const markdownComponents: Components = {
	a: ({ href, children }) =>
		isLattizUrl(href) ? (
			<a
				href={href}
				target="_blank"
				rel="noopener noreferrer"
				className="font-medium text-primary underline underline-offset-2"
			>
				{children}
			</a>
		) : (
			<span>{children}</span>
		),
	img: () => null,
	p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
	ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>,
	ol: ({ children }) => <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>,
};

export function LattiChat({
	apiUrl,
	open,
	onClose,
}: {
	apiUrl: string;
	open: boolean;
	onClose: () => void;
}) {
	const [input, setInput] = useState("");
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const endRef = useRef<HTMLDivElement>(null);

	const transport = useMemo(
		() =>
			new DefaultChatTransport<LattiMessage>({
				api: `${apiUrl}/chat`,
				// The API takes plain text turns only; it rebuilds the prompt on its side.
				prepareSendMessagesRequest: ({ messages }) => ({
					body: {
						conversationId: conversationId(),
						messages: messages
							.filter((message) => message.role === "user" || message.role === "assistant")
							.map((message) => ({ role: message.role, text: textOf(message) }))
							.filter((message) => message.text),
					},
				}),
			}),
		[apiUrl],
	);

	const { messages, sendMessage, status, error, clearError } = useChat<LattiMessage>({ transport });
	const busy = status === "submitted" || status === "streaming";

	const remaining = useMemo(() => {
		for (let index = messages.length - 1; index >= 0; index -= 1) {
			const value = messages[index].metadata?.remaining;
			if (typeof value === "number") return value;
		}
		return undefined;
	}, [messages]);

	useEffect(() => {
		if (open) inputRef.current?.focus();
	}, [open]);

	useEffect(() => {
		endRef.current?.scrollIntoView({ block: "end" });
	}, [messages, status]);

	useEffect(() => {
		if (!open) return;
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, onClose]);

	function ask(text: string) {
		const question = text.trim();
		if (!question || busy) return;
		clearError();
		void sendMessage({ text: question.slice(0, MAX_CHARS) });
		setInput("");
	}

	if (!open) return null;

	return (
		<section
			role="dialog"
			aria-label="Latti AI, asistente de Lattiz"
			className="fixed inset-x-3 bottom-3 z-[70] mx-auto flex h-[min(34rem,calc(100dvh-1.5rem))] max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-white text-card-foreground shadow-2xl sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[24rem]"
		>
			<header className="flex items-center justify-between gap-3 bg-primary px-4 py-3 text-white">
				<div className="min-w-0">
					<p className="text-sm font-semibold">Latti AI</p>
					<p className="text-xs text-white/80">Dudas sobre planes, plantillas y tu sitio</p>
				</div>
				<button
					type="button"
					onClick={onClose}
					aria-label="Cerrar el chat"
					className="rounded-full p-1.5 hover:cursor-pointer hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
				>
					<X className="h-5 w-5" aria-hidden="true" />
				</button>
			</header>

			<div
				data-lenis-prevent
				aria-live="polite"
				className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-4 py-4 text-sm leading-6"
			>
				{messages.length === 0 ? (
					<div className="flex flex-col gap-3">
						<p>
							Hola, soy Latti. Te ayudo a elegir plan y plantilla, y a resolver dudas sobre
							Lattiz.
						</p>
						<ul className="flex flex-col gap-2">
							{SUGGESTIONS.map((suggestion) => (
								<li key={suggestion}>
									<button
										type="button"
										onClick={() => ask(suggestion)}
										className="w-full rounded-xl border border-border px-3 py-2 text-left hover:cursor-pointer hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
									>
										{suggestion}
									</button>
								</li>
							))}
						</ul>
					</div>
				) : null}

				{messages.map((message) => {
					const text = textOf(message);
					if (!text) return null;
					return message.role === "user" ? (
						<p
							key={message.id}
							className="ml-8 self-end rounded-2xl rounded-br-md bg-primary px-3 py-2 whitespace-pre-wrap text-white"
						>
							{text}
						</p>
					) : (
						<div
							key={message.id}
							className="mr-8 self-start rounded-2xl rounded-bl-md bg-muted px-3 py-2 break-words"
						>
							<ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
								{text}
							</ReactMarkdown>
						</div>
					);
				})}

				{status === "submitted" ? (
					<p className="mr-8 self-start rounded-2xl rounded-bl-md bg-muted px-3 py-2 text-muted-foreground">
						Buscando la respuesta…
					</p>
				) : null}
				{error ? (
					<p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-red-800">
						{errorText(error)}
					</p>
				) : null}
				<div ref={endRef} />
			</div>

			<form
				onSubmit={(event) => {
					event.preventDefault();
					ask(input);
				}}
				className="border-t border-border px-3 pt-3 pb-2"
			>
				<div className="flex items-end gap-2">
					<label htmlFor="latti-input" className="sr-only">
						Tu pregunta
					</label>
					<textarea
						id="latti-input"
						ref={inputRef}
						value={input}
						rows={1}
						maxLength={MAX_CHARS}
						placeholder="Escribe tu pregunta"
						onChange={(event) => setInput(event.target.value)}
						onKeyDown={(event) => {
							if (event.key === "Enter" && !event.shiftKey) {
								event.preventDefault();
								ask(input);
							}
						}}
						className="max-h-28 min-h-10 flex-1 resize-none rounded-xl border border-border bg-white px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
					/>
					<button
						type="submit"
						disabled={busy || !input.trim()}
						aria-label="Enviar pregunta"
						className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
					>
						<ArrowUp className="h-5 w-5" aria-hidden="true" />
					</button>
				</div>
				<p className="mt-2 text-[11px] leading-4 text-muted-foreground">
					{typeof remaining === "number"
						? `Te quedan ${remaining} ${remaining === 1 ? "pregunta" : "preguntas"} hoy. `
						: null}
					Respuestas generadas con IA; pueden tener errores. No compartas datos sensibles.{" "}
					<Link href="/privacy#8-asistente-latti-ai" className="underline underline-offset-2">
						Privacidad
					</Link>
				</p>
			</form>
		</section>
	);
}
