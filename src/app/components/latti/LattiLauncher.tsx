"use client";

import dynamic from "next/dynamic";
import { MessageCircle } from "lucide-react";
import { useState } from "react";

// The chat (AI SDK + markdown) loads on first open, not with the page.
const LattiChat = dynamic(() => import("./LattiChat").then((mod) => mod.LattiChat), {
	ssr: false,
});

const API_URL = process.env.NEXT_PUBLIC_LATTIZ_API_URL?.replace(/\/+$/, "");

export function LattiLauncher() {
	const [open, setOpen] = useState(false);
	const [loaded, setLoaded] = useState(false);

	if (!API_URL) return null;

	return (
		<>
			{loaded ? (
				<LattiChat apiUrl={API_URL} open={open} onClose={() => setOpen(false)} />
			) : null}
			{open ? null : (
				<button
					type="button"
					onClick={() => {
						setLoaded(true);
						setOpen(true);
					}}
					aria-haspopup="dialog"
					className="fixed right-4 bottom-5 z-[55] flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-medium text-white shadow-xl transition-transform duration-200 hover:scale-[1.03] hover:cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:right-6 sm:bottom-6"
				>
					<MessageCircle className="h-5 w-5" aria-hidden="true" />
					Pregúntale a Latti
				</button>
			)}
		</>
	);
}
