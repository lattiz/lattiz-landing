"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Footer from "@/app/components/Footer";
import { Navbar } from "@/app/components/Navbar";
import { PageLoader } from "@/app/components/ui/page-loader";
import { CookieBanner } from "@/app/components/cookie-banner";
import { LattiLauncher } from "@/app/components/latti/LattiLauncher";
import { SmoothScroll } from "@/app/smooth-scroll";

export function SiteChrome({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	const isRedirectPage = pathname === "/redireccion";

	if (isRedirectPage) {
		return children;
	}

	return (
		<SmoothScroll>
			<PageLoader />
			<Navbar />
			{children}
			<div
				aria-hidden="true"
				className="fixed top-0 left-0 right-0 z-50 h-8 pointer-events-none"
				style={{
					backdropFilter: "blur(2px)",
					background:
						"linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 70%, transparent 100%)",
				}}
			/>
			<div
				aria-hidden="true"
				className="fixed bottom-0 left-0 right-0 z-50 h-14 pointer-events-none"
				style={{
					backdropFilter: "blur(2px)",
					background:
						"linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 70%, transparent 100%)",
				}}
			/>
			<Footer />
			<LattiLauncher />
			<CookieBanner />
		</SmoothScroll>
	);
}
