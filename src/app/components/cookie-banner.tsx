"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const CONSENT_STORAGE_KEY = "lattiz_cookie_consent";
const CONSENT_EVENT = "lattiz-cookie-consent";

export function CookieBanner() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		setVisible(localStorage.getItem(CONSENT_STORAGE_KEY) !== "accepted");
	}, []);

	const acceptCookies = () => {
		localStorage.setItem(CONSENT_STORAGE_KEY, "accepted");
		window.dispatchEvent(new Event(CONSENT_EVENT));
		setVisible(false);
	};

	if (!visible) {
		return null;
	}

	return (
		<section
			aria-label="Aviso de cookies"
			className="fixed inset-x-4 bottom-4 z-[60] mx-auto flex max-w-3xl flex-col gap-4 rounded-lg bg-secondary p-3 text-white shadow-2xl sm:flex-row sm:items-center sm:justify-between sm:gap-6"
		>
			<p className="text-sm leading-6 text-white/85">
				Usamos cookies para mejorar la experiencia en lattiz.app y sus
				subdominios. {" "}
				<Link
					href="/cookies"
					className="font-medium text-white underline underline-offset-2 hover:text-white/75"
				>
					Política de Cookies
				</Link>{" "}
			</p>
			<button
				type="button"
				onClick={acceptCookies}
				className="shrink-0 rounded-md bg-foreground hover:cursor-pointer px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
			>
				Aceptar
			</button>
		</section>
	);
}
