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
        <div
            ref={trackRef}
            className="relative flex p-1.5"
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
                        className={`relative flex items-center gap-2 rounded-full px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#60a5fa] md:px-7 md:py-3 md:text-sm hover:scale-105 hover:cursor-pointer transition-all md:tracking-[0.14em] ${active ? "text-[#FFF]" : "text-black underline hover:text-black"
                            }`}
                    >
                        {active && (
                            <motion.span
                                layoutId="plan-toggle-thumb"
                                transition={THUMB_SPRING}
                                aria-hidden="true"
                                className="absolute inset-0 rounded-full bg-primary text-[#FFF]"
                            />
                        )}
                        {/* Indicador LED */}
                        <span
                            aria-hidden="true"
                            className={`relative size-1.5 rounded-full transition-all duration-500 ${active
                                ? option.id === "pro"
                                    ? "bg-secondary"
                                    : "bg-secondary"
                                : "bg-[#ffffff]/20"
                                }`}
                        />
                        <span className="relative whitespace-nowrap">{option.label}</span>
                    </button>
                );
            })}
        </div>
    );
}
