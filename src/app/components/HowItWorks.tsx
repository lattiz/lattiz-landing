"use client";

import { useCallback, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useInView } from "framer-motion";
import { Milestone } from "lucide-react";
import { Header } from "./ui/header";
import { CloudShader } from "./ui/cloud-shader";
import { cn } from "@/app/components/lib/utils";
import useMediaQuery from "@/app/hooks/useMediaQuery";
import { ScrollIndicator } from "./ui/scroll-indicator";

gsap.registerPlugin(ScrollTrigger);
// Evita refrescos cuando la barra de URL del móvil se colapsa.
ScrollTrigger.config({ ignoreMobileResize: true });

const VIDEO_SRC = "/how-it-works.mp4";
// Recorrido del scrub, en alturas de viewport (mobile-first).
const TRACK_CLASS = "h-[360lvh] md:h-[400lvh]";
const SCRUB_SMOOTHING = 1;
const SEEK_EPSILON = 1 / 30;
const OUTRO = 0.07;
const BODY = 1 - OUTRO;

const QUERY_MD = "(min-width: 768px)";
const QUERY_REDUCED = "(prefers-reduced-motion: reduce)";
const QUERY_MOTION = "(prefers-reduced-motion: no-preference)";

interface HowItWorkdsProps {
    data: {
        eyebrow: string;
        title: string;
        subtitle: string;
        cards: {
            img: string;
            title: string;
            description: string;
        }[];
    }
}

export const HowItWorks: React.FC<HowItWorkdsProps> = ({ data }) => {
    const isMd = useMediaQuery(QUERY_MD);
    const reduced = useMediaQuery(QUERY_REDUCED);

    const sectionRef = useRef<HTMLElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const targetProgress = useRef(0);

    const shouldLoad = useInView(sectionRef, { once: true, margin: "100% 0px 100% 0px" });

    // Lleva el playhead al avance actual (también si los metadatos llegan tarde).
    const syncToProgress = useCallback(() => {
        const video = videoRef.current;
        if (!video || reduced) return;
        const { duration } = video;
        if (!Number.isFinite(duration) || duration <= 0) return;
        video.currentTime = gsap.utils.clamp(0, duration, targetProgress.current * duration);
    }, [reduced]);

    // Línea de tiempo única, escrubeada por scroll.
    useLayoutEffect(() => {
        const section = sectionRef.current;
        const track = trackRef.current;
        if (!section || !track) return;

        // El seek vive en el ticker (no en onUpdate) y jamás encola seeks.
        const tick = () => {
            const video = videoRef.current;
            if (!video || video.readyState < 1 || video.seeking) return;
            const { duration } = video;
            if (!Number.isFinite(duration) || duration <= 0) return;
            const target = gsap.utils.clamp(0, duration, targetProgress.current * duration);
            if (Math.abs(video.currentTime - target) > SEEK_EPSILON) video.currentTime = target;
        };

        targetProgress.current = 0;
        const mm = gsap.matchMedia();

        const ctx = gsap.context(() => {
            mm.add(QUERY_MOTION, () => {
                const tl = gsap.timeline({
                    defaults: { ease: "none" },
                    scrollTrigger: {
                        // El escenario (header + video) es sticky dentro del track:
                        // el scrub arranca en cuanto se fija y dura lo que dura el track.
                        trigger: track,
                        start: "top top",
                        end: "bottom bottom",
                        scrub: SCRUB_SMOOTHING,
                        invalidateOnRefresh: true,
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

                // BODY: playhead del video, desde el primer píxel de scroll.
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
                    0,
                );

                // OUTRO: reposo en el último cuadro antes de soltar el sticky.
                tl.to({}, { duration: OUTRO }, 1 - OUTRO);

                return () => {
                    gsap.ticker.remove(tick);
                };
            });
        }, section);

        // Refresco con debounce: solo cuando cambia el ancho.
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
    }, []);

    return (
        <section ref={sectionRef} className="relative isolate w-full">
            {/* Cielo: una capa del alto del viewport que acompaña todo el recorrido del video */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-clip rounded-b-[55px] bg-foreground">
                <div className="sticky top-0 h-lvh w-full">
                    {shouldLoad && (
                        <CloudShader
                            className="min-h-0"
                            count={isMd ? 6 : 3}
                            maxDpr={isMd ? 1.5 : 1}
                            maxFps={isMd ? 0 : 30}
                        />
                    )}
                </div>
            </div>

            {/* Track alto (sin pin): header y video comparten un escenario sticky durante todo el scrub */}
            <div ref={trackRef} className={cn("relative w-full", reduced ? "py-24" : TRACK_CLASS)}>
                <div
                    className={cn(
                        "relative z-20 mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-6 px-4 pt-24 pb-8 md:flex-row md:gap-10",
                        !reduced && "sticky top-0 h-svh",
                    )}
                >
                    <div className="w-full md:w-5/12 md:shrink-0 flex flex-col gap-6">
                        <Header title={data.title} icon={<Milestone size={24} color="var(--color-primary)" />} subtitle={data.subtitle} orientation="vertical" />
                        <ScrollIndicator className="text-white" tooltipSide="top"/>
                    </div>
                    <div className="w-full min-w-0 md:w-7/12">
                        {/* Ancho limitado por el alto visible: el video siempre cabe completo bajo la navbar */}
                        <div className="relative mx-auto aspect-video w-full max-w-[calc((100svh-14rem)*16/9)] overflow-hidden rounded-2xl bg-foreground shadow-xl shadow-black/20">
                            <video
                                ref={videoRef}
                                src={shouldLoad ? `${VIDEO_SRC}#t=0.001` : undefined}
                                preload="auto"
                                muted
                                playsInline
                                disablePictureInPicture
                                tabIndex={reduced ? undefined : -1}
                                controls={reduced}
                                aria-label={data.title}
                                onLoadedMetadata={syncToProgress}
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
