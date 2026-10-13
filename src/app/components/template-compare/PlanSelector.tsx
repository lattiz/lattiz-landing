"use client";

import { useRef, type KeyboardEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PLANS, type Plan } from "@/app/data/template-compare";

type PlanSelectorProps = {
    plan: Plan;
    labels: Record<Plan, string>;
    ariaLabel: string;
    controlsId: string;
    onChange: (plan: Plan) => void;
    onWarm: () => void;
};

const THUMB_SPRING = { type: "spring", stiffness: 420, damping: 34, mass: 0.9 } as const;
const THUMB_INSTANT = { duration: 0 } as const;

export const tabId = (plan: Plan) => `template-compare-tab-${plan}`;

export function PlanSelector({ plan, labels, ariaLabel, controlsId, onChange, onWarm }: PlanSelectorProps) {
    const reduceMotion = useReducedMotion();
    const tabRefs = useRef<Record<Plan, HTMLButtonElement | null>>({ basic: null, pro: null });

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        const step = event.key === "ArrowRight" ? 1 : -1;
        const index = PLANS.indexOf(plan);
        const next = PLANS[(index + step + PLANS.length) % PLANS.length];
        onChange(next);
        tabRefs.current[next]?.focus();
    };

    return (
        <div
            role="tablist"
            aria-label={ariaLabel}
            className="relative flex rounded-full border border-white/15 bg-white/10 p-1"
        >
            {PLANS.map((id) => {
                const active = id === plan;
                return (
                    <button
                        key={id}
                        ref={(el) => {
                            tabRefs.current[id] = el;
                        }}
                        id={tabId(id)}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        aria-controls={controlsId}
                        tabIndex={active ? 0 : -1}
                        onClick={() => onChange(id)}
                        onKeyDown={handleKeyDown}
                        onPointerEnter={onWarm}
                        onFocus={onWarm}
                        onTouchStart={onWarm}
                        className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] outline-none transition-colors duration-300 hover:cursor-pointer focus-visible:ring-2 focus-visible:ring-[#60a5fa] md:px-6 md:text-sm ${active ? "text-[#FFF]" : "text-black hover:text-black"}`}
                    >
                        {active && (
                            <motion.span
                                layoutId="template-compare-plan-thumb"
                                transition={reduceMotion ? THUMB_INSTANT : THUMB_SPRING}
                                aria-hidden="true"
                                className="absolute text-[#FFF] inset-0 rounded-full bg-primary"
                            />
                        )}
                        {id === "pro" && (
                            <span aria-hidden="true" className="relative size-1.5 rounded-full bg-secondary" />
                        )}
                        <span className="relative whitespace-nowrap">{labels[id]}</span>
                    </button>
                );
            })}
        </div>
    );
}
