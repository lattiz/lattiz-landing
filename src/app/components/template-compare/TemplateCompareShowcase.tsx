"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useInView } from "framer-motion";
import { Layout } from "lucide-react";
import { Header } from "@/app/components/ui/header";
import { cn } from "@/app/components/lib/utils";
import useMediaQuery from "@/app/hooks/useMediaQuery";
import {
    DEFAULT_PLAN,
    PLANS,
    ROW_KEYS,
    TEMPLATE_COMPARE_COPY as COPY,
    VIDEO_SRC,
    type DeviceKind,
    type Plan,
    type VideoKey,
} from "@/app/data/template-compare";
import { PlanSelector, tabId } from "./PlanSelector";
import { ScrollIndicator } from "../ui/scroll-indicator";

gsap.registerPlugin(ScrollTrigger);
// Evita refrescos cuando la barra de URL del móvil se colapsa.
ScrollTrigger.config({ ignoreMobileResize: true });

const SCROLL_RATIO_DESKTOP = 5.5;
const SCROLL_RATIO_MOBILE = 4.8;
const SCRUB_SMOOTHING = 1;
const SEEK_EPSILON = 1 / 30;
const INTRO = 0.08;
const OUTRO = 0.07;
const BODY = 1 - INTRO - OUTRO;
const TRANSITION_WINDOW = 0.05;

const KINDS: readonly DeviceKind[] = ["desktop", "mobile"];
const REGION_ID = "template-compare-region";
const PRICING_HREF = "#pricing";
const TOTAL_STEPS = ROW_KEYS.length;

const QUERY_MD = "(min-width: 768px)";
const QUERY_REDUCED = "(prefers-reduced-motion: reduce)";
const QUERY_LIST = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
const QUERY_TAKEOVER = "(max-width: 1023px) and (prefers-reduced-motion: no-preference)";

// Insets de la pantalla transparente de cada mockup (% del PNG/SVG).
const SCREEN_INSET: Record<DeviceKind, string> = {
    desktop: "inset-x-[11.69%] inset-y-[11.74%] rounded-[3px]",
    mobile: "inset-x-[5.1%] inset-y-[2.2%] rounded-[14%/6.8%]",
};

const GLOW_PRO: CSSProperties = {
    background:
        "radial-gradient(60% 50% at 50% 55%, color-mix(in oklab, var(--color-primary) 74%, transparent), transparent 82%)",
};
const GLOW_BASIC: CSSProperties = {
    background: "radial-gradient(60% 50% at 50% 55%, #0e0e0e, transparent 62%)",
};

type NavigatorWithConnection = Navigator & { connection?: { saveData?: boolean } };

const videoKey = (plan: Plan, kind: DeviceKind): VideoKey => `${plan}-${kind}`;
const pad = (n: number) => String(n).padStart(2, "0");
const formatStep = (current: number) =>
    COPY.stepOf.replace("{current}", pad(current)).replace("{total}", pad(TOTAL_STEPS));
const otherPlan = (plan: Plan): Plan => (plan === "pro" ? "basic" : "pro");

type DeviceProps = {
    kind: DeviceKind;
    plan: Plan;
    shouldLoad: boolean;
    reduced: boolean;
    loaded: ReadonlySet<VideoKey>;
    failed: ReadonlySet<VideoKey>;
    setVideoRef: Record<VideoKey, (el: HTMLVideoElement | null) => void>;
    onLoaded: (key: VideoKey) => void;
    onError: (key: VideoKey) => void;
    className?: string;
};

function Device({
    kind,
    plan,
    shouldLoad,
    reduced,
    loaded,
    failed,
    setVideoRef,
    onLoaded,
    onError,
    className,
}: DeviceProps) {
    const activeKey = videoKey(plan, kind);
    const isDesktop = kind === "desktop";
    const hasError = failed.has(activeKey);

    return (
        <div className={cn("grid min-h-0 min-w-0 place-items-center [container-type:size]", className)}>
            <div
                className={cn(
                    "relative",
                    isDesktop
                        ? "aspect-[3944/2564] w-[min(100cqw,calc(100cqh*1.5382))]"
                        : "aspect-[490/1000] w-[min(100cqw,calc(100cqh*0.49))]",
                )}
            >
                <div className="js-pulse relative h-full w-full">
                    <div className={cn("absolute overflow-hidden bg-black", SCREEN_INSET[kind])}>
                        {/* Esqueleto hasta que el video activo pinta su primer cuadro */}
                        <div
                            aria-hidden="true"
                            className={cn(
                                "absolute inset-0 animate-pulse bg-gradient-to-br from-white/10 via-white/[0.04] to-white/10 transition-opacity duration-500",
                                loaded.has(activeKey) || hasError ? "opacity-0" : "opacity-100",
                            )}
                        />
                        {PLANS.map((p) => {
                            const key = videoKey(p, kind);
                            const active = p === plan;
                            return (
                                <video
                                    key={key}
                                    ref={setVideoRef[key]}
                                    src={shouldLoad ? `${VIDEO_SRC[key]}#t=0.001` : undefined}
                                    preload={active ? "auto" : "none"}
                                    muted
                                    playsInline
                                    disablePictureInPicture
                                    tabIndex={-1}
                                    controls={reduced && active}
                                    aria-hidden={active ? undefined : true}
                                    onLoadedData={() => onLoaded(key)}
                                    onError={() => onError(key)}
                                    className={cn(
                                        "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
                                        active ? "opacity-100" : "pointer-events-none opacity-0",
                                    )}
                                />
                            );
                        })}
                        {hasError && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-[#0a0a0a]/90 p-4 text-center">
                                <span className="text-xs font-semibold text-white md:text-sm">
                                    {COPY.videoError.title}
                                </span>
                                <span className="text-[11px] text-white/60 md:text-xs">{COPY.videoError.subtitle}</span>
                            </div>
                        )}
                    </div>
                    <Image
                        src={isDesktop ? "/macbook-mock.png" : "/iphone_mock.svg"}
                        alt=""
                        fill
                        sizes={isDesktop ? "(min-width: 1024px) 45vw, 90vw" : "(min-width: 1024px) 20vw, 60vw"}
                        draggable={false}
                        className="pointer-events-none select-none object-contain"
                    />
                </div>
            </div>
        </div>
    );
}

function ClosingContent({ compact }: { compact: boolean }) {
    return (
        <>
            <div aria-hidden="true" className="flex flex-col gap-0.5">
                <span className="font-primary text-[11px] uppercase font-semibold text-white/50">
                    {COPY.both.label}
                </span>
                <p className={cn("text-white", compact ? "text-xs leading-snug" : "text-[13px] leading-snug")}>
                    {COPY.both.text}
                </p>
            </div>
            <p aria-hidden="true" className="text-[11px] leading-snug text-white/55">
                {COPY.footnote}
            </p>
            <a
                href={PRICING_HREF}
                className="inline-block w-fit whitespace-nowrap rounded-full bg-primary px-5 py-2 text-center text-xs font-semibold text-[#FFF] outline-none hover:bg-primary/80 focus-visible:ring-2 focus-visible:ring-[#60a5fa] md:text-sm"
            >
                {COPY.cta}
            </a>
        </>
    );
}

export default function TemplateCompareShowcase() {
    const [plan, setPlan] = useState<Plan>(DEFAULT_PLAN);
    const [loaded, setLoaded] = useState<ReadonlySet<VideoKey>>(() => new Set());
    const [failed, setFailed] = useState<ReadonlySet<VideoKey>>(() => new Set());

    const isMd = useMediaQuery(QUERY_MD);
    const reduced = useMediaQuery(QUERY_REDUCED);

    const sectionRef = useRef<HTMLElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const hintRef = useRef<HTMLDivElement>(null);
    const closingPanelRef = useRef<HTMLDivElement>(null);
    const stepRef = useRef<HTMLSpanElement>(null);
    const barRef = useRef<HTMLDivElement>(null);

    const planRef = useRef<Plan>(DEFAULT_PLAN);
    const targetProgress = useRef(0);
    const warmed = useRef<Set<VideoKey>>(new Set());
    const firstPlanRender = useRef(true);
    const videoRefs = useRef<Record<VideoKey, HTMLVideoElement | null>>({
        "basic-desktop": null,
        "pro-desktop": null,
        "basic-mobile": null,
        "pro-mobile": null,
    });

    const shouldLoad = useInView(sectionRef, { once: true, margin: "100% 0px 100% 0px" });

    const setVideoRef = useMemo(() => {
        const setters = {} as Record<VideoKey, (el: HTMLVideoElement | null) => void>;
        for (const p of PLANS) {
            for (const k of KINDS) {
                const key = videoKey(p, k);
                setters[key] = (el) => {
                    videoRefs.current[key] = el;
                };
            }
        }
        return setters;
    }, []);

    const markLoaded = useCallback((key: VideoKey) => {
        setLoaded((prev) => (prev.has(key) ? prev : new Set(prev).add(key)));
    }, []);
    const markFailed = useCallback((key: VideoKey) => {
        setFailed((prev) => (prev.has(key) ? prev : new Set(prev).add(key)));
    }, []);

    // Sube un plan a preload="auto" una sola vez por video.
    const warmPlan = useCallback((target: Plan, force: boolean) => {
        if (!force && (navigator as NavigatorWithConnection).connection?.saveData) return;
        for (const kind of KINDS) {
            const key = videoKey(target, kind);
            const video = videoRefs.current[key];
            if (!video || warmed.current.has(key)) continue;
            warmed.current.add(key);
            video.preload = "auto";
            video.load();
        }
    }, []);

    // Los videos del plan activo cargan solos; se marcan para no recargarlos al volver a ese plan.
    useEffect(() => {
        if (!shouldLoad) return;
        for (const kind of KINDS) warmed.current.add(videoKey(planRef.current, kind));
    }, [shouldLoad]);

    const handlePlanChange = useCallback(
        (next: Plan) => {
            if (planRef.current === next) return;
            planRef.current = next;
            setPlan(next);
            warmPlan(next, true);
        },
        [warmPlan],
    );

    const handleWarm = useCallback(() => warmPlan(otherPlan(planRef.current), false), [warmPlan]);

    // Mantiene los videos recién activos sincronizados con el avance actual.
    useEffect(() => {
        if (reduced) return;
        const cleanups: Array<() => void> = [];
        for (const kind of KINDS) {
            const video = videoRefs.current[videoKey(plan, kind)];
            if (!video) continue;
            const seek = () => {
                const { duration } = video;
                if (!Number.isFinite(duration) || duration <= 0) return;
                video.currentTime = gsap.utils.clamp(0, duration, targetProgress.current * duration);
            };
            if (video.readyState >= 1) {
                seek();
            } else {
                video.addEventListener("loadedmetadata", seek, { once: true });
                cleanups.push(() => video.removeEventListener("loadedmetadata", seek));
            }
        }
        return () => cleanups.forEach((fn) => fn());
    }, [plan, reduced]);

    // Línea de tiempo única, escrubeada por scroll.
    useLayoutEffect(() => {
        const section = sectionRef.current;
        const stage = stageRef.current;
        if (!section || !stage) return;

        const getActiveVideos = (): HTMLVideoElement[] =>
            KINDS.map((kind) => videoRefs.current[videoKey(planRef.current, kind)]).filter(
                (video): video is HTMLVideoElement => video !== null,
            );

        // El seek vive en el ticker (no en onUpdate) y jamás encola seeks.
        const tick = () => {
            for (const video of getActiveVideos()) {
                if (video.readyState < 1 || video.seeking) continue;
                const { duration } = video;
                if (!Number.isFinite(duration) || duration <= 0) continue;
                const target = gsap.utils.clamp(0, duration, targetProgress.current * duration);
                if (Math.abs(video.currentTime - target) > SEEK_EPSILON) video.currentTime = target;
            }
        };

        targetProgress.current = 0;
        const mm = gsap.matchMedia();

        const ctx = gsap.context(() => {
            mm.add({ list: QUERY_LIST, takeover: QUERY_TAKEOVER }, (context) => {
                const mode = context.conditions?.list ? "list" : "takeover";
                const rows = gsap.utils.toArray<HTMLElement>(".js-row", stage);
                const bars = gsap.utils.toArray<HTMLElement>(".js-bar", stage);
                // En list el cierre está visible desde el inicio; en takeover es el último "paso" del panel.
                const closing = mode === "takeover" ? closingPanelRef.current : null;
                const hint = hintRef.current;
                const step = stepRef.current;
                const bar = barRef.current;
                if (!rows.length) return;

                const seg = BODY / rows.length;
                let lastStep = 0;

                const tl = gsap.timeline({
                    defaults: { ease: "none" },
                    scrollTrigger: {
                        trigger: stage,
                        start: "top top",
                        end: () => `+=${window.innerHeight * (window.innerWidth >= 768 ? SCROLL_RATIO_DESKTOP : SCROLL_RATIO_MOBILE)}`,
                        scrub: SCRUB_SMOOTHING,
                        pin: true,
                        pinSpacing: true,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                        onUpdate: (self) => {
                            const p = self.progress;
                            const bodyP = gsap.utils.clamp(0, 1, (p - INTRO) / BODY);
                            const index =
                                p >= 1 - OUTRO ? TOTAL_STEPS : Math.min(TOTAL_STEPS, Math.floor(bodyP * TOTAL_STEPS) + 1);
                            if (index !== lastStep) {
                                lastStep = index;
                                if (step) step.textContent = formatStep(index);
                            }
                            if (bar) bar.style.transform = `scaleX(${p})`;
                        },
                        onToggle: (self) => {
                            if (self.isActive) {
                                gsap.ticker.add(tick);
                            } else {
                                gsap.ticker.remove(tick);
                                // El scrub aún converge tras salir del rango: un último ajuste.
                                gsap.delayedCall(SCRUB_SMOOTHING + 0.15, tick);
                            }
                        },
                    },
                });

                // INTRO: todo está visible desde el primer scroll; solo se retira la pista.
                if (hint) tl.fromTo(hint, { autoAlpha: 1 }, { autoAlpha: 0, duration: INTRO }, INTRO);

                // BODY: playhead de los videos del plan activo.
                const proxy = { progress: 0 };
                tl.to(
                    proxy,
                    {
                        progress: 1,
                        duration: BODY,
                        onUpdate: () => {
                            targetProgress.current = proxy.progress;
                        },
                    },
                    INTRO,
                );

                // BODY: filas. En list todas son visibles; la barra de acento marca el paso activo.
                if (mode === "list") {
                    bars.forEach((accent, i) => {
                        const start = INTRO + i * seg;
                        tl.fromTo(accent, { scaleY: 0 }, { scaleY: 1, duration: seg * 0.3 }, start);
                        if (i < bars.length - 1) tl.to(accent, { scaleY: 0, duration: seg * 0.2 }, start + seg);
                    });
                } else {
                    gsap.set(rows, { autoAlpha: 0, y: 24 });
                    gsap.set(rows[0], { autoAlpha: 1, y: 0 });
                    rows.forEach((row, i) => {
                        const boundary = INTRO + i * seg;
                        if (i > 0) {
                            tl.to(
                                row,
                                { autoAlpha: 1, y: 0, duration: TRANSITION_WINDOW, ease: "power2.out" },
                                boundary - TRANSITION_WINDOW / 2,
                            );
                        }
                        const exitAt = i < rows.length - 1 ? boundary + seg - TRANSITION_WINDOW / 2 : 1 - OUTRO;
                        tl.to(
                            row,
                            { autoAlpha: 0, y: -24, duration: TRANSITION_WINDOW, ease: "power2.in" },
                            exitAt,
                        );
                    });
                }

                // OUTRO: cierre (solo takeover, comparte panel con las filas).
                if (closing) {
                    tl.fromTo(closing, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: OUTRO }, 1 - OUTRO);
                }

                return () => {
                    gsap.ticker.remove(tick);
                };
            });
        }, section);

        // Refresco con debounce: solo cuando cambia el ancho (el pin altera la altura).
        let frame = 0;
        let lastWidth = section.clientWidth;
        const observer = new ResizeObserver((entries) => {
            const width = entries[0]?.contentRect.width ?? lastWidth;
            if (Math.abs(width - lastWidth) < 1) return;
            lastWidth = width;
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => ScrollTrigger.refresh());
        });
        observer.observe(section);

        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
            gsap.ticker.remove(tick);
            mm.revert();
            ctx.revert();
        };
        // Se reconstruye solo si el MacBook se monta/desmonta, nunca al cambiar de plan.
    }, [isMd]);

    // Cambio de plan: valores de texto y pulso de dispositivos (sin tocar la línea de scroll).
    useLayoutEffect(() => {
        if (firstPlanRender.current) {
            firstPlanRender.current = false;
            return;
        }
        const stage = stageRef.current;
        if (!stage || reduced) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".js-row-value",
                { autoAlpha: 0, y: 6 },
                { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.03, overwrite: "auto" },
            );
            gsap.fromTo(
                ".js-pulse",
                { scale: 1 },
                { scale: 1.02, duration: 0.125, yoyo: true, repeat: 1, ease: "power1.out", overwrite: "auto" },
            );
        }, stage);
        return () => ctx.revert();
    }, [plan, reduced]);

    const deviceProps = {
        plan,
        shouldLoad,
        reduced,
        loaded,
        failed,
        setVideoRef,
        onLoaded: markLoaded,
        onError: markFailed,
    };

    return (
        <section
            ref={sectionRef}
            id="template-compare"
            aria-label={COPY.title}
            className="relative w-full overflow-hidden"
        >
            <div className="mx-auto w-full max-w-7xl px-4">
                <Header
                    title={COPY.eyebrow}
                    subtitle={COPY.title}
                    icon={<Layout size={24} color="var(--color-primary)" />}
                />
            </div>

            <div ref={stageRef} className="relative h-svh w-full overflow-hidden rounded-3xl">
                {/* Glow: el color cambia por plan con CSS */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-70">
                    <div
                        style={GLOW_PRO}
                        className={cn(
                            "absolute inset-0 transition-opacity duration-500",
                            plan === "pro" ? "opacity-100" : "opacity-0",
                        )}
                    />
                    <div
                        style={GLOW_BASIC}
                        className={cn(
                            "absolute inset-0 transition-opacity duration-500",
                            plan === "basic" ? "opacity-100" : "opacity-0",
                        )}
                    />
                </div>

                <div className="absolute inset-x-0 top-34 z-20 flex justify-center">
                    <PlanSelector
                        plan={plan}
                        labels={COPY.plans}
                        ariaLabel={COPY.selectorLabel}
                        controlsId={REGION_ID}
                        onChange={handlePlanChange}
                        onWarm={handleWarm}
                    />
                    <ScrollIndicator className="absolute top-[calc(100%+2.5rem)] left-1/2 -translate-x-1/2 text-white" />
                </div>

                <div
                    id={REGION_ID}
                    role="tabpanel"
                    aria-labelledby={tabId(plan)}
                    className="relative mx-auto flex h-full max-w-7xl flex-col gap-3 px-4 pb-10 pt-[12.25rem] md:pb-14 lg:gap-4"
                >
                    <div className="flex min-h-0 flex-1 flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-6">
                        <div className="flex min-h-0 flex-1 gap-4 lg:contents">
                            {isMd && (
                                <Device
                                    {...deviceProps}
                                    kind="desktop"
                                    className="flex-[1.9] lg:order-1 lg:flex-[2.2]"
                                />
                            )}
                            <Device
                                {...deviceProps}
                                kind="mobile"
                                className="flex-1 md:flex-[0.8] lg:order-3"
                            />
                        </div>

                        <div
                            className={cn(
                                "relative mx-auto w-full max-w-xl lg:order-3 lg:max-w-none lg:self-center lg:shrink-0 lg:basis-[clamp(300px,30vw,400px)] lg:w-[clamp(300px,30vw,400px)]",
                                reduced
                                    ? "flex flex-col gap-4"
                                    : "h-[clamp(150px,19svh,260px)] rounded-2xl md:h-[clamp(150px,30svh,260px)] lg:h-auto lg:rounded-none lg:border-0 lg:bg-transparent",
                            )}
                        >
                            <ul
                                aria-hidden="true"
                                className={cn(
                                    reduced
                                        ? "flex flex-col gap-3 rounded-2x lg:bg-transparent lg:p-0"
                                        : "relative h-full lg:flex lg:h-auto lg:flex-col lg:gap-[clamp(6px,1.4svh,14px)]",
                                )}
                            >
                                {ROW_KEYS.map((key) => (
                                    <li
                                        key={key}
                                        className={cn(
                                            "js-row flex flex-col justify-center gap-1 will-change-transform",
                                            reduced
                                                ? "relative lg:pl-3"
                                                : "absolute inset-0 px-4 lg:relative lg:inset-auto lg:px-0 lg:pl-3",
                                        )}
                                    >
                                        <span className="js-bar absolute inset-y-0 left-0 hidden w-0.5 origin-top rounded bg-secondary lg:block" />
                                        <span className="font-primary text-center md:text-right text-[11px] sm:text-center uppercase font-semibold text-white/50">
                                            {COPY.rows[key].label}
                                        </span>
                                        <p className="js-row-value text-sm text-center md:text-right leading-snug text-[#000] lg:text-[clamp(11px,1.55svh,14px)]">
                                            {COPY.rows[key][plan]}
                                        </p>
                                    </li>
                                ))}
                            </ul>

                            {/* Cierre en < lg: es un "paso" más dentro del mismo panel */}
                            <div
                                ref={closingPanelRef}
                                className={cn(
                                    "flex flex-col justify-center gap-2 lg:hidden",
                                    reduced ? "relative" : "absolute inset-0 px-4",
                                )}
                            >
                                <ClosingContent compact />
                            </div>
                        </div>
                    </div>

                    {/* Cierre en ≥ lg: franja bajo los tres bloques */}
                    <div
                        className="hidden items-center gap-6 lg:grid lg:h-[clamp(56px,10svh,84px)] lg:grid-cols-[1fr_1.4fr_auto]"
                    >
                        <ClosingContent compact={false} />
                    </div>
                </div>

                <div
                    ref={hintRef}
                    aria-hidden="true"
                    className={cn(
                        "absolute inset-x-0 bottom-9 text-center font-primary text-[11px] uppercase tracking-[0.2em] text-white/45",
                        reduced && "hidden",
                    )}
                >
                    {COPY.hint}
                </div>

                <div
                    aria-hidden="true"
                    className={cn(
                        "absolute inset-x-4 bottom-3 mx-auto flex max-w-7xl items-center gap-3",
                        reduced && "hidden",
                    )}
                >
                    <span ref={stepRef} className="font-secondary text-[11px] tabular-nums  text-white/60">
                        {formatStep(1)}
                    </span>
                    <div className="h-px flex-1 bg-white/15">
                        <div ref={barRef} className="h-full origin-left scale-x-0 bg-secondary" />
                    </div>
                </div>
            </div>

            {/* Contenido completo para lectores de pantalla y buscadores, independiente del scroll */}
            <div className="sr-only">
                <table>
                    <caption>{COPY.title}</caption>
                    <thead>
                        <tr>
                            <th scope="col">{COPY.eyebrow}</th>
                            <th scope="col">{COPY.plans.basic}</th>
                            <th scope="col">{COPY.plans.pro}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ROW_KEYS.map((key) => (
                            <tr key={key}>
                                <th scope="row">{COPY.rows[key].label}</th>
                                <td>{COPY.rows[key].basic}</td>
                                <td>{COPY.rows[key].pro}</td>
                            </tr>
                        ))}
                        <tr>
                            <th scope="row">{COPY.both.label}</th>
                            <td colSpan={2}>{COPY.both.text}</td>
                        </tr>
                    </tbody>
                </table>
                <p>{COPY.footnote}</p>
            </div>
        </section>
    );
}
