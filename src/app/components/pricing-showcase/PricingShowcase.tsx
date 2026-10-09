"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { PLAN_OPTIONS, type PlanId } from "@/app/data/pricing-showcase";
import { PlanToggle } from "./PlanToggle";

// WebGL solo existe en el navegador: el canvas no se prerenderiza.
const Scene = dynamic(() => import("./Scene"), {
    ssr: false,
    loading: () => (
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-1/2 w-2/3 max-w-xl animate-pulse rounded-2xl bg-[#ffffff]/5" />
        </div>
    ),
});

export default function PricingShowcase() {
    const [plan, setPlan] = useState<PlanId>("basic");
    const sectionRef = useRef<HTMLElement>(null);
    const canvasWrapperRef = useRef<HTMLDivElement>(null);
    const hoveredRef = useRef<boolean>(false);
    const inView = useInView(sectionRef, { margin: "200px 0px" });

    const current = PLAN_OPTIONS.find((option) => option.id === plan) ?? PLAN_OPTIONS[0];

    return (
        <section
            ref={sectionRef}
            aria-label="Comparativa de plantillas"
            className="relative w-full overflow-hidden rounded-[2rem] border border-[#ffffff]/10 bg-[#0a0a0a] py-12 md:py-16"
        >
            {/* Fondo: retícula técnica + halo */}
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
            />
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,rgba(37,99,235,0.18),transparent_55%)]"
            />

            <div className="relative flex flex-col items-center gap-6 px-4 text-center">
                <h2 className="text-2xl font-bold text-[#ffffff] md:text-4xl">Mira lo que hay debajo</h2>
                <PlanToggle options={PLAN_OPTIONS} value={plan} onChange={setPlan} />
                <div className="h-6">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={current.id}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.25 }}
                            className="text-sm text-[#ffffff]/55 md:text-base"
                        >
                            {current.caption}
                        </motion.p>
                    </AnimatePresence>
                </div>
            </div>

            <div
                ref={canvasWrapperRef}
                onPointerEnter={() => (hoveredRef.current = true)}
                onPointerLeave={() => (hoveredRef.current = false)}
                className="relative mt-4 h-[560px] w-full touch-pan-y md:h-[min(860px,90vh)]"
            >
                <Scene plan={plan} eventSource={canvasWrapperRef} hoveredRef={hoveredRef} active={inView} />
            </div>
        </section>
    );
}
