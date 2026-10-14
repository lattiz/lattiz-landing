"use client";

import dynamic from "next/dynamic";
import useHeavyMediaCapable from "@/app/hooks/useHeavyMediaCapable";

// Separate chunk: gsap and the section's videos/images are only downloaded
// once the device passes the check, never on phones or metered connections.
const TemplateCompareShowcase = dynamic(() => import("./TemplateCompareShowcase"), { ssr: false });

// Desktop-only: the wrapper (and its top margin) is rendered together with the
// section, so mobile users don't get an empty gap.
export default function DesktopTemplateCompare() {
    const enabled = useHeavyMediaCapable();
    if (!enabled) return null;

    return (
        <div className="px-4 mt-32">
            <TemplateCompareShowcase />
        </div>
    );
}
