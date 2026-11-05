"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const CONSENT_STORAGE_KEY = "lattiz_cookie_consent";
const CONSENT_EVENT = "lattiz-cookie-consent";

export function AnalyticsProvider() {
	const [consentGranted, setConsentGranted] = useState(false);

	useEffect(() => {
		const updateConsent = () => {
			setConsentGranted(localStorage.getItem(CONSENT_STORAGE_KEY) === "accepted");
		};

		updateConsent();
		window.addEventListener(CONSENT_EVENT, updateConsent);
		return () => window.removeEventListener(CONSENT_EVENT, updateConsent);
	}, []);

	const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
	const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

	if (!consentGranted) {
		return null;
	}

	return (
		<>
			{gtmId ? (
				<>
					<Script id="lattiz-gtm-init" strategy="afterInteractive">
						{`window.dataLayer = window.dataLayer || []; window.dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});`}
					</Script>
					<Script
						id="lattiz-gtm"
						src={`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`}
						strategy="afterInteractive"
					/>
				</>
			) : null}
			{measurementId ? (
				<>
					<Script
						id="lattiz-ga4"
						src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`}
						strategy="afterInteractive"
					/>
					<Script id="lattiz-ga4-config" strategy="afterInteractive">
						{`window.dataLayer = window.dataLayer || []; window.gtag = window.gtag || function(){window.dataLayer.push(arguments);}; window.gtag('js', new Date()); window.gtag('config', '${measurementId}');`}
					</Script>
				</>
			) : null}
		</>
	);
}
