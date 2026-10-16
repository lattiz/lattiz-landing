"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Mouse } from "lucide-react";
import { cn } from "@/app/components/lib/utils";

gsap.registerPlugin(useGSAP);

// Geometría del icono de lucide (viewBox 24×24): la rueda termina en y≈11
// y el interior del mouse en y≈21. La "gota" viaja entre ambos.
const TRACK_TOP = 11.5;
const TRACK_HEIGHT = 6.5;
const DOT = 2;
const CYCLE = 1.6;

type ScrollIndicatorProps = {
    className?: string;
    /** Tamaño del icono en px. */
    size?: number;
    /** Texto del tooltip y nombre accesible. */
    label?: string;
    /** Lado del tooltip. */
    tooltipSide?: "top" | "bottom";
    /** Al hacer clic avanza esta fracción del viewport. `false` lo deja solo como indicador. */
    scrollBy?: number | false;
};

export function ScrollIndicator({
    className,
    size = 28,
    label = "Desliza hacia abajo",
    tooltipSide = "top",
    scrollBy = 0.85,
}: ScrollIndicatorProps) {
    const rootRef = useRef<HTMLButtonElement>(null);
    const unit = size / 24;

    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            mm.add("(prefers-reduced-motion: no-preference)", () => {
                // La gota entra por arriba y sale por abajo de su carril (recortado): sin opacidad.
                gsap.fromTo(
                    ".js-scroll-dot",
                    { y: -DOT * unit },
                    { y: TRACK_HEIGHT * unit, duration: CYCLE, ease: "sine.inOut", repeat: -1 },
                );
                // El mouse acompaña con un leve vaivén, dos por ciclo de la gota.
                gsap.to(".js-scroll-mouse", {
                    y: 3 * unit,
                    duration: CYCLE / 4,
                    ease: "sine.inOut",
                    yoyo: true,
                    repeat: -1,
                });
            });
            return () => mm.revert();
        },
        { scope: rootRef, dependencies: [unit] },
    );

    const handleClick = () => {
        if (scrollBy === false) return;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollBy({ top: window.innerHeight * scrollBy, behavior: reduced ? "auto" : "smooth" });
    };

    return (
        <button
            ref={rootRef}
            type="button"
            aria-label={label}
            onClick={handleClick}
            className={cn(
                "group relative inline-flex items-center justify-center rounded-full p-2 text-[#FFF] outline-none",
                "focus-visible:ring-2 focus-visible:ring-[#60a5fa]",
                scrollBy === false ? "cursor-default" : "cursor-pointer",
                className,
            )}
        >
            <span className="js-scroll-mouse relative block will-change-transform" style={{ width: size, height: size }}>
                <Mouse size={size} strokeWidth={2} aria-hidden="true" className="block" />
                {/* Carril recortado bajo la rueda */}
                <span
                    aria-hidden="true"
                    className="absolute left-1/2 -translate-x-1/2 overflow-hidden"
                    style={{ top: TRACK_TOP * unit, width: DOT * unit, height: TRACK_HEIGHT * unit }}
                >
                    <span
                        className="js-scroll-dot block rounded-full bg-current will-change-transform"
                        style={{ width: DOT * unit, height: DOT * unit }}
                    />
                </span>
            </span>

            {/* Tooltip: solo en hover o foco de teclado */}
            <span
                aria-hidden="true"
                className={cn(
                    "pointer-events-none absolute left-1/2 z-30  -translate-x-1/2 whitespace-nowrap rounded-full bg-[#0a0a0a] px-3 py-1 text-[11px] font-semibold text-[#FFF] shadow-lg",
                    "group-hover:block group-focus-visible:block",
                    tooltipSide === "top" ? "bottom-full" : "top-full",
                )}
            >
                {label}
            </span>
        </button>
    );
}

export default ScrollIndicator;
