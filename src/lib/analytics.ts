export type GtagFunction = (
	command: "config" | "event",
	target: string,
	parameters?: Record<string, string>,
) => void;

declare global {
	interface Window {
		dataLayer: unknown[];
		gtag?: GtagFunction;
	}
}

export function trackAdsConversion(
	conversionId = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID,
	label = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL,
) {
	if (
		typeof window === "undefined" ||
		localStorage.getItem("lattiz_cookie_consent") !== "accepted" ||
		!conversionId
	) {
		return;
	}

	window.dataLayer = window.dataLayer || [];
	window.gtag =
		window.gtag ||
		((...args) => {
			window.dataLayer.push(args);
		});
	window.gtag("event", "conversion", {
		send_to: label ? `${conversionId}/${label}` : conversionId,
	});
}
