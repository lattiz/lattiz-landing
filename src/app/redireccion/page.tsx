"use client";

import { useEffect, useState } from "react";
import { trackAdsConversion } from "@/lib/analytics";

const DASHBOARD_URL = "https://dashboard.lattiz.app";

export default function RedirectPage() {
	const [countdown, setCountdown] = useState(3);

	useEffect(() => {
		trackAdsConversion();

		const redirect = () => {
			window.location.href = DASHBOARD_URL;
		};
		const fallbackTimer = window.setTimeout(redirect, 5000);
		const countdownTimer = window.setInterval(() => {
			setCountdown((current) => {
				if (current <= 1) {
					window.clearInterval(countdownTimer);
					window.clearTimeout(fallbackTimer);
					redirect();
					return 0;
				}
				return current - 1;
			});
		}, 1000);

		return () => {
			window.clearInterval(countdownTimer);
			window.clearTimeout(fallbackTimer);
		};
	}, []);

	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-white p-4 text-center text-black">
			<h1 className="text-2xl font-semibold tracking-tight">Lattiz</h1>
			<p className="mt-4 max-w-md text-base leading-7 text-black/70">
				Serás redirigido automáticamente al panel de Lattiz en {countdown} segundos...
			</p>
			<p className="mt-8 text-sm text-black/60">
				Si no eres redirigido accede a:{" "}
				<a
					href={DASHBOARD_URL}
					className="font-medium text-black underline underline-offset-2 hover:text-black/60"
				>
					https://dashboard.lattiz.app
				</a>
			</p>
		</main>
	);
}
