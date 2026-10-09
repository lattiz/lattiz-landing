"use client";

import { Suspense, useRef, type ReactNode, type RefObject } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei";
import { animated, useSpring } from "@react-spring/three";
import { motion } from "framer-motion";
import {
    ISOMETRIC_ROTATION,
    SHOWCASE_LAYERS,
    type PlanId,
    type ShowcaseLayer,
} from "@/app/data/pricing-showcase";

const LAYER_WIDTH = 3;
const LAYER_SPRING = { mass: 1.1, tension: 150, friction: 22 };
const TEXTURE_URLS = SHOWCASE_LAYERS.map((layer) => layer.texture);

type SceneProps = {
    plan: PlanId;
    /** Elemento que recibe los eventos de puntero (incluye las etiquetas HTML). */
    eventSource: RefObject<HTMLDivElement | null>;
    /** `true` mientras el cursor está sobre el canvas. */
    hoveredRef: RefObject<boolean>;
    /** Pausa el render loop cuando la sección no está en pantalla. */
    active: boolean;
};

export default function Scene({ plan, eventSource, hoveredRef, active }: SceneProps) {
    return (
        <Canvas
            // `flat` desactiva el tone mapping para que las texturas de UI conserven su color.
            flat
            dpr={[1, 2]}
            frameloop={active ? "always" : "never"}
            eventSource={eventSource as RefObject<HTMLElement>}
            camera={{ position: [0, 0, 9], fov: 35 }}
            gl={{ antialias: true, alpha: true }}
            className="!absolute inset-0"
        >
            <Suspense fallback={null}>
                <ShowcaseContent pro={plan === "pro"} hoveredRef={hoveredRef} labelContainer={eventSource} />
            </Suspense>
        </Canvas>
    );
}

/** Escala de la escena según el viewport 3D visible (móvil vs. escritorio). */
function useResponsiveLayout() {
    const { width, height } = useThree((state) => state.viewport);
    const compact = width < 6;
    const scale = Math.min(width / (compact ? 4.4 : 7.2), height / 6.6, 1);
    // En móvil desplazamos el stack a la izquierda para dejar sitio a las etiquetas.
    const offsetX = compact ? -width * 0.16 : -0.6;
    return { scale, offsetX, compact };
}

type ShowcaseContentProps = {
    pro: boolean;
    hoveredRef: RefObject<boolean>;
    labelContainer: RefObject<HTMLDivElement | null>;
};

function ShowcaseContent({ pro, hoveredRef, labelContainer }: ShowcaseContentProps) {
    const textures = useTexture(TEXTURE_URLS, (loaded) => {
        for (const texture of Array.isArray(loaded) ? loaded : [loaded]) {
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.anisotropy = 8;
        }
    });
    const { scale, offsetX, compact } = useResponsiveLayout();

    // En Pro la luz direccional gana peso para que las capas inclinadas se sombreen.
    const lights = useSpring({
        ambient: pro ? 1.6 : 2.7,
        directional: pro ? 2.4 : 0.6,
        config: LAYER_SPRING,
    });

    const { stackX } = useSpring({ stackX: pro ? offsetX : 0, config: LAYER_SPRING });

    return (
        <>
            <animated.ambientLight intensity={lights.ambient} />
            <animated.directionalLight position={[4, 6, 5]} intensity={lights.directional} />
            <pointLight position={[-5, -2, 3]} intensity={6} color="#3b82f6" />

            <ParallaxRig hoveredRef={hoveredRef}>
                <animated.group position-x={stackX} scale={scale}>
                    {SHOWCASE_LAYERS.map((layer, index) => (
                        <Layer
                            key={layer.id}
                            layer={layer}
                            index={index}
                            texture={textures[index]}
                            pro={pro}
                            compact={compact}
                            hoveredRef={hoveredRef}
                            labelContainer={labelContainer}
                        />
                    ))}
                </animated.group>
            </ParallaxRig>
        </>
    );
}

/** Inclina toda la escena hacia el cursor y añade una flotación sutil. */
function ParallaxRig({ hoveredRef, children }: { hoveredRef: RefObject<boolean>; children: ReactNode }) {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        const group = groupRef.current;
        if (!group) return;
        const hovered = hoveredRef.current;
        const t = 1 - Math.exp(-delta * 4); // lerp independiente del framerate
        group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, hovered ? -state.pointer.y * 0.12 : 0, t);
        group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, hovered ? state.pointer.x * 0.22 : 0, t);
        group.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.06;
    });

    return <group ref={groupRef}>{children}</group>;
}

type LayerProps = {
    layer: ShowcaseLayer;
    index: number;
    texture: THREE.Texture;
    pro: boolean;
    compact: boolean;
    hoveredRef: RefObject<boolean>;
    labelContainer: RefObject<HTMLDivElement | null>;
};

function Layer({ layer, index, texture, pro, compact, hoveredRef, labelContainer }: LayerProps) {
    const parallaxRef = useRef<THREE.Group>(null);
    const materialRef = useRef<THREE.MeshStandardMaterial>(null);
    const isPrimary = index === 0;
    const height = LAYER_WIDTH / layer.aspect;

    // Valores escalares por eje: los springs de tuplas no tipan bien con `animated`.
    const spring = useSpring({
        // En Básica las capas secundarias se esconden justo detrás de la principal.
        y: pro ? layer.proY : 0,
        z: pro ? 0 : -0.02 * index,
        rotX: pro ? ISOMETRIC_ROTATION[0] : 0,
        rotY: pro ? ISOMETRIC_ROTATION[1] : 0,
        opacity: pro || isPrimary ? 1 : 0,
        // Al abrir se despliegan de arriba abajo; al cerrar, en orden inverso.
        delay: pro ? index * 90 : (SHOWCASE_LAYERS.length - 1 - index) * 70,
        config: LAYER_SPRING,
    });

    // Cada capa se desplaza distinto con el cursor: profundidad real entre capas.
    useFrame((state, delta) => {
        const group = parallaxRef.current;
        const material = materialRef.current;
        if (!group || !material) return;
        material.opacity = spring.opacity.get();
        material.visible = material.opacity > 0.001;
        const depth = pro && hoveredRef.current ? (index + 1) * 0.08 : 0;
        const t = 1 - Math.exp(-delta * 5);
        group.position.x = THREE.MathUtils.lerp(group.position.x, state.pointer.x * depth, t);
        group.position.z = THREE.MathUtils.lerp(group.position.z, state.pointer.y * depth * 0.5, t);
    });

    return (
        <animated.group position-y={spring.y} position-z={spring.z}>
            <group ref={parallaxRef}>
                <animated.mesh
                    // YXZ: primero se inclina hacia atrás y luego gira 45°, como una vista isométrica.
                    rotation-order="YXZ"
                    rotation-x={spring.rotX}
                    rotation-y={spring.rotY}
                    renderOrder={SHOWCASE_LAYERS.length - index}
                >
                    <planeGeometry args={[LAYER_WIDTH, height]} />
                    <meshStandardMaterial
                        ref={materialRef}
                        map={texture}
                        transparent
                        alphaTest={0.02}
                        opacity={isPrimary ? 1 : 0}
                        roughness={0.55}
                        metalness={0.05}
                        side={THREE.DoubleSide}
                    />
                </animated.mesh>
            </group>

            <Html
                position={[compact ? 1.25 : 1.9, 0, 0]}
                // Contenedor fijo: sin él, <Html> cambia de nodo padre al conectar
                // `eventSource` y React desmonta la etiqueta a mitad de render.
                portal={labelContainer as RefObject<HTMLElement>}
                pointerEvents="none"
                zIndexRange={[10, 0]}
            >
                <Annotation layer={layer} index={index} visible={pro} compact={compact} />
            </Html>
        </animated.group>
    );
}

type AnnotationProps = { layer: ShowcaseLayer; index: number; visible: boolean; compact: boolean };

function Annotation({ layer, index, visible, compact }: AnnotationProps) {
    const { title, description, accent } = layer.annotation;

    return (
        <motion.div
            initial={false}
            animate={
                visible
                    ? { opacity: 1, x: 0, filter: "blur(0px)" }
                    : { opacity: 0, x: -16, filter: "blur(6px)" }
            }
            transition={{ type: "spring", stiffness: 180, damping: 22, delay: visible ? 0.35 + index * 0.12 : 0 }}
            className="flex -translate-y-1/2 items-center gap-2 select-none"
        >
            <span className="flex items-center" aria-hidden="true">
                <span className="size-2 rounded-full" style={{ backgroundColor: accent, boxShadow: `0 0 12px ${accent}` }} />
                <span className="h-px w-5 md:w-10" style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }} />
            </span>
            <div
                className={`rounded-xl border border-[#ffffff]/15 bg-[#ffffff]/[0.07] shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md ${
                    compact ? "w-32 px-2.5 py-2" : "w-56 px-4 py-3"
                }`}
            >
                <p className={`font-semibold text-[#ffffff] ${compact ? "text-[11px] leading-tight" : "text-sm"}`}>{title}</p>
                {!compact && <p className="mt-1 text-xs leading-snug text-[#ffffff]/60">{description}</p>}
            </div>
        </motion.div>
    );
}

useTexture.preload(TEXTURE_URLS);
