"use client";

import { useRef, type PointerEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import type { PlanId, PlanOption } from "@/app/data/pricing-showcase";

type PlanToggleProps = {
    options: PlanOption[];
    value: PlanId;
    onChange: (plan: PlanId) => void;
};

const MAGNET_STRENGTH = 0.18;
const MAGNET_SPRING = { stiffness: 220, damping: 18, mass: 0.6 };
const THUMB_SPRING = { type: "spring", stiffness: 420, damping: 34, mass: 0.9 } as const;

export function PlanToggle({ options, value, onChange }: PlanToggleProps) {
    const trackRef = useRef<HTMLDivElement>(null);
    const x = useSpring(useMotionValue(0), MAGNET_SPRING);
    const y = useSpring(useMotionValue(0), MAGNET_SPRING);

    // Efecto magnético: el switch se deja atraer ligeramente por el cursor.
    const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
        const rect = trackRef.current?.getBoundingClientRect();
        if (!rect) return;
        x.set((event.clientX - (rect.left + rect.width / 2)) * MAGNET_STRENGTH);
        y.set((event.clientY - (rect.top + rect.height / 2)) * MAGNET_STRENGTH);
    };

    const handlePointerLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={trackRef}
            role="radiogroup"
            aria-label="Tipo de plantilla"
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            style={{ x, y }}
            className="relative flex rounded-full border border-[#ffffff]/10 bg-gradient-to-b from-[#1a1a1d] to-[#0c0c0e] p-1.5 shadow-[inset_0_2px_6px_rgba(0,0,0,0.8),inset_0_-1px_0_rgba(255,255,255,0.06),0_20px_40px_-20px_rgba(37,99,235,0.45)]"
        >
            {options.map((option) => {
                const active = option.id === value;
                return (
                    <button
                        key={option.id}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => onChange(option.id)}
                        className={`relative flex items-center gap-2 rounded-full px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#60a5fa] md:px-7 md:py-3 md:text-sm md:tracking-[0.14em] ${
                            active ? "text-[#0a0a0a]" : "text-[#ffffff]/50 hover:text-[#ffffff]/80"
                        }`}
                    >
                        {active && (
                            <motion.span
                                layoutId="plan-toggle-thumb"
                                transition={THUMB_SPRING}
                                aria-hidden="true"
                                className="absolute inset-0 rounded-full bg-gradient-to-b from-[#fafafa] via-[#e4e4e7] to-[#a1a1aa] shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_-2px_3px_rgba(0,0,0,0.25),0_6px_14px_-4px_rgba(0,0,0,0.7)]"
                            />
                        )}
                        {/* Indicador LED */}
                        <span
                            aria-hidden="true"
                            className={`relative size-1.5 rounded-full transition-all duration-500 ${
                                active
                                    ? option.id === "pro"
                                        ? "bg-[#22c55e] shadow-[0_0_8px_2px_rgba(34,197,94,0.7)]"
                                        : "bg-[#3b82f6] shadow-[0_0_8px_2px_rgba(59,130,246,0.7)]"
                                    : "bg-[#ffffff]/20"
                            }`}
                        />
                        <span className="relative whitespace-nowrap">{option.label}</span>
                    </button>
                );
            })}
        </motion.div>
    );
}
