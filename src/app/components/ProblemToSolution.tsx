"use client";

import { useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
    PAIN_POINTS,
    PROBLEM_COPY,
    SOLUTION_LINES,
    SOLUTION_STATS,
    type SolutionLine,
} from "@/app/data/problem-to-solution";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Ruido fractal en SVG; se desplaza en saltos para simular grano de película.
const NOISE_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

// La línea de tiempo dura 3 unidades: una por cada fase (0-100vh, 100-200vh, 200-300vh).
const PHASE = { problem: 0, transition: 1, solution: 2 } as const;

const GRADIENT_TEXT =
    "bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#06b6d4] bg-[length:200%_auto] bg-clip-text text-transparent";

const LINE_STYLES: Record<SolutionLine["variant"], string> = {
    kicker:
        "rounded-full border border-[#2563eb]/20 bg-[#2563eb]/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] md:text-sm",
    headline: "text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl lg:text-8xl",
    subhead: "max-w-2xl text-lg font-medium md:text-2xl",
};

export default function ProblemToSolution() {
    const sectionRef = useRef<HTMLElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const problemContentRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const noiseRef = useRef<HTMLDivElement>(null);
    const maskRef = useRef<HTMLDivElement>(null);
    const painRefs = useRef<HTMLDivElement[]>([]);
    const solutionRefs = useRef<HTMLElement[]>([]);
    const gradientRefs = useRef<HTMLSpanElement[]>([]);

    useGSAP(
        () => {
            const section = sectionRef.current;
            const stage = stageRef.current;
            const problemContent = problemContentRef.current;
            const title = titleRef.current;
            const noise = noiseRef.current;
            const mask = maskRef.current;
            if (!section || !stage || !problemContent || !title || !noise || !mask) return;

            const painItems = painRefs.current;
            const solutionItems = solutionRefs.current;
            const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

            // Estados iniciales (se fijan antes de pintar para evitar parpadeos).
            gsap.set(painItems, { yPercent: -160, rotate: (i: number) => (i % 2 ? 4 : -5), opacity: 0 });
            gsap.set(mask, { clipPath: "circle(0% at 50% 50%)" });
            gsap.set(solutionItems, { y: 50, opacity: 0 });

            const tl = gsap.timeline({
                defaults: { ease: "none" },
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: "bottom bottom",
                    pin: stage,
                    // La sección ya mide 300vh; el espacio del pin lo aporta ella misma.
                    pinSpacing: false,
                    scrub: 1,
                    invalidateOnRefresh: true,
                },
            });

            // 1. PROBLEMA: bloques pesados que caen con retraso intencional.
            tl.to(
                title,
                { y: -24, opacity: 0.55, duration: 0.8 },
                PHASE.problem + 0.15,
            ).to(
                painItems,
                {
                    yPercent: 0,
                    rotate: 0,
                    opacity: 1,
                    duration: 0.45,
                    ease: "power3.in",
                    stagger: 0.22,
                },
                PHASE.problem + 0.1,
            );

            // 2. TRANSICIÓN: el mundo viejo se hunde y un círculo blanco lo devora.
            tl.to(
                problemContent,
                { scale: 0.9, opacity: 0.25, filter: "blur(6px)", duration: 1 },
                PHASE.transition,
            ).to(
                mask,
                { clipPath: "circle(75% at 50% 50%)", duration: 1, ease: "power2.inOut" },
                PHASE.transition,
            );

            // 3. SOLUCIÓN: los elementos flotan hacia arriba (y: 50 → 0).
            tl.to(
                solutionItems,
                { y: 0, opacity: 1, duration: 0.6, ease: "power4.out", stagger: 0.12 },
                PHASE.solution - 0.15,
            ).to({}, { duration: 0.4 }); // pequeño respiro antes de soltar el pin

            if (reduceMotion) return;

            // Animaciones ambientales, independientes del scroll.
            gsap.to(noise, {
                x: () => gsap.utils.random(-60, 60),
                y: () => gsap.utils.random(-60, 60),
                duration: 0.12,
                ease: "steps(1)",
                repeat: -1,
                repeatRefresh: true,
            });
            gsap.to(gradientRefs.current.filter(Boolean), {
                backgroundPosition: "100% 50%",
                duration: 4,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
            });
        },
        { scope: sectionRef },
    );

    const collect = <T extends HTMLElement>(list: RefObject<T[]>, index: number) => (el: T | null) => {
        if (el) list.current[index] = el;
    };

    return (
        <section
            ref={sectionRef}
            aria-label="Del modelo de agencia tradicional a Website-as-a-Service"
            className="relative h-[300vh] w-full"
        >
            <div ref={stageRef} className="relative h-screen w-full overflow-hidden">
                {/* Capa 1 — El problema */}
                <div className="absolute inset-0 bg-[#0a0a0a] text-[#ededed]">
                    <div
                        ref={noiseRef}
                        aria-hidden="true"
                        className="pointer-events-none absolute -inset-[60px] opacity-[0.09] mix-blend-screen"
                        style={{ backgroundImage: NOISE_SVG }}
                    />
                    <div
                        ref={problemContentRef}
                        className="absolute inset-0 flex flex-col items-center justify-center gap-10 px-4 font-secondary md:gap-14"
                    >
                        <div ref={titleRef} className="flex max-w-5xl flex-col items-center gap-5 text-center">
                            <span className="text-xs uppercase tracking-[0.3em] text-[#ededed]/50 md:text-sm">
                                {PROBLEM_COPY.eyebrow}
                            </span>
                            <h2 className="text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
                                {PROBLEM_COPY.title}
                            </h2>
                        </div>

                        <div className="grid w-full max-w-5xl grid-cols-1 gap-3 md:grid-cols-3 md:gap-5">
                            {PAIN_POINTS.map((pain, i) => (
                                <div
                                    key={pain.id}
                                    ref={collect(painRefs, i)}
                                    className="flex flex-col gap-2 border-2 border-[#ededed]/15 bg-[#141414] p-4 shadow-[6px_6px_0_0_rgba(255,255,255,0.06)] md:p-6"
                                >
                                    <span className="text-xl font-bold md:text-2xl">{pain.title}</span>
                                    <span className="text-sm text-[#ededed]/55">{pain.detail}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Capa 2 — La solución, revelada por la máscara circular */}
                <div
                    ref={maskRef}
                    className="absolute inset-0 bg-[#ffffff] text-[#0a0a0a]"
                    style={{ clipPath: "circle(0% at 50% 50%)" }}
                >
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.12),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(124,58,237,0.10),transparent_50%)]"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-4 text-center md:gap-8">
                        {SOLUTION_LINES.map((line, i) => (
                            <p key={line.id} ref={collect(solutionRefs, i)} className={LINE_STYLES[line.variant]}>
                                {line.variant === "subhead" ? (
                                    <span className="text-[#0a0a0a]/60">{line.text}</span>
                                ) : (
                                    <span ref={collect(gradientRefs, i)} className={GRADIENT_TEXT}>
                                        {line.text}
                                    </span>
                                )}
                            </p>
                        ))}

                        <ul
                            ref={collect(solutionRefs, SOLUTION_LINES.length)}
                            className="mt-4 grid grid-cols-3 gap-2 md:gap-4"
                        >
                            {SOLUTION_STATS.map((stat) => (
                                <li
                                    key={stat.id}
                                    className="flex flex-col items-center rounded-2xl border border-[#0a0a0a]/[0.06] bg-[#ffffff]/70 px-3 py-3 shadow-[0_10px_30px_-12px_rgba(37,99,235,0.25)] backdrop-blur md:px-8 md:py-5"
                                >
                                    <span className="text-xl font-bold md:text-3xl">{stat.value}</span>
                                    <span className="text-[11px] text-[#0a0a0a]/55 md:text-sm">{stat.label}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
