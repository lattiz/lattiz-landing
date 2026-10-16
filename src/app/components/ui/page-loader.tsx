"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useLenis } from "lenis/react";

const LOADER_ID = "page-loader";
// Evita un destello en cargas muy rápidas y nunca bloquea más de lo razonable.
const MIN_VISIBLE_MS = 700;
const MAX_VISIBLE_MS = 6000;

// Progreso "optimista" mientras carga: avanza rápido al inicio y se frena antes del final.
const PROGRESS_HOLD = 0.85;
const PROGRESS_HOLD_DURATION = 2.4;
const PROGRESS_FINISH_DURATION = 0.35;
const EXIT_DURATION = 0.75;

// Antes de hidratar, CSS ya mueve la línea (mismo destino que GSAP); GSAP la retoma donde vaya.
const PRE_HYDRATION_CSS = `
@keyframes page-loader-progress { from { transform: scaleX(0); } to { transform: scaleX(${PROGRESS_HOLD}); } }
#${LOADER_ID} [data-loader-line] { animation: page-loader-progress ${PROGRESS_HOLD_DURATION}s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
@media (prefers-reduced-motion: reduce) { #${LOADER_ID} [data-loader-line] { animation-duration: 0.01s; } }
`;

const waitForPageLoad = () =>
    new Promise<void>((resolve) => {
        if (document.readyState === "complete") return resolve();
        window.addEventListener("load", () => resolve(), { once: true });
    });

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export function PageLoader() {
    const [done, setDone] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const lenis = useLenis();

    // Sin scroll mientras el loader cubre la página.
    useEffect(() => {
        if (done) return;
        const html = document.documentElement;
        const prevOverflow = html.style.overflow;
        html.style.overflow = "hidden";
        lenis?.stop();
        return () => {
            html.style.overflow = prevOverflow;
            lenis?.start();
        };
    }, [done, lenis]);

    useEffect(() => {
        const root = rootRef.current;
        const line = lineRef.current;
        const logo = logoRef.current;
        if (!root || !line || !logo) return;

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const started = performance.now();
        let cancelled = false;

        // Toma el avance de la animación CSS y continúa con GSAP desde ahí.
        const current = new DOMMatrix(getComputedStyle(line).transform).a;
        line.style.animation = "none";
        const remaining = PROGRESS_HOLD_DURATION * (1 - current / PROGRESS_HOLD);

        const ctx = gsap.context(() => {
            gsap.fromTo(
                line,
                { scaleX: current },
                { scaleX: PROGRESS_HOLD, duration: Math.max(0.2, remaining), ease: "power2.out" },
            );
            if (!reduced) {
                gsap.to(logo, { scale: 1.04, duration: 1.1, ease: "sine.inOut", yoyo: true, repeat: -1 });
            }
        }, root);

        const ready = Promise.race([
            Promise.all([waitForPageLoad(), document.fonts?.ready ?? Promise.resolve()]),
            wait(MAX_VISIBLE_MS),
        ]);

        ready
            .then(() => wait(Math.max(0, MIN_VISIBLE_MS - (performance.now() - started))))
            .then(() => {
                if (cancelled) return;
                const tl = gsap.timeline({ onComplete: () => setDone(true) });
                tl.to(line, { scaleX: 1, duration: PROGRESS_FINISH_DURATION, ease: "power1.out", overwrite: true });
                // Salida tipo cortina hacia arriba: sin opacidad.
                if (reduced) {
                    tl.set(root, { yPercent: -100 });
                } else {
                    tl.to(root, { yPercent: -100, duration: EXIT_DURATION, ease: "power3.inOut" }, "+=0.1");
                }
            });

        return () => {
            cancelled = true;
            ctx.revert();
            gsap.killTweensOf([root, line]);
        };
    }, []);

    if (done) return null;

    return (
        <div
            ref={rootRef}
            id={LOADER_ID}
            aria-hidden="true"
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-primary will-change-transform"
        >
            {/* Sin JavaScript el loader no podría retirarse: se oculta desde el inicio */}
            <style dangerouslySetInnerHTML={{ __html: PRE_HYDRATION_CSS }} />
            <noscript>
                <style dangerouslySetInnerHTML={{ __html: `#${LOADER_ID}{display:none}` }} />
            </noscript>

            <div ref={logoRef} className="w-12 md:w-16">
                <Image
                    src="/lattiz_logo_white.svg"
                    alt=""
                    width={424}
                    height={504}
                    preload
                    draggable={false}
                    className="h-auto w-full select-none"
                />
            </div>

            {/* Indicador de carga: línea blanca sobria en la parte inferior */}
            <div className="absolute bottom-[calc(50%-3.67rem)] left-1/2 h-0.5 w-[min(240px,50vw)] -translate-x-1/2 overflow-hidden rounded-full bg-[#ffffff40]">
                <div ref={lineRef} data-loader-line className="h-full w-full origin-left scale-x-0 rounded-full bg-[#fff]" />
            </div>
        </div>
    );
}

export default PageLoader;
