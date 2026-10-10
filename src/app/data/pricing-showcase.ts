// Datos de <PricingShowcase />: planes del toggle y capas de la vista 3D.

export type PlanId = "basic" | "pro";

export type PlanOption = {
    id: PlanId;
    label: string;
    caption: string;
};

export type LayerId = "ui" | "cms" | "seo";

export type ShowcaseLayer = {
    id: LayerId;
    texture: string;
    /** Relación ancho/alto de la textura, para no deformarla. */
    aspect: number;
    /** Posición vertical en el modo Pro (unidades de mundo, antes de escalar). */
    proY: number;
    annotation: { title: string; description: string; accent: string };
};

export const PLAN_OPTIONS: PlanOption[] = [
    { id: "basic", label: "Plantilla Básica", caption: "Un sitio estático y bonito." },
    { id: "pro", label: "Plantilla Pro", caption: "Interfaz, CMS y SEO trabajando en capas." },
];

// El orden importa: la primera capa es la que se ve en el modo Básico.
export const SHOWCASE_LAYERS: ShowcaseLayer[] = [
    {
        id: "ui",
        texture: "/ui-layer-base.webp",
        aspect: 897 / 616,
        proY: 1.4,
        annotation: {
            title: "Custom Micro-interactions",
            description: "Animaciones y componentes interactivos en cada sección.",
            accent: "#60a5fa",
        },
    },
    {
        id: "cms",
        texture: "/ui-layer-cms.webp",
        aspect: 1117 / 714,
        proY: 0,
        annotation: {
            title: "Real-Time CMS Sync",
            description: "Edita textos, precios y fotos; se publican al instante.",
            accent: "#22d3ee",
        },
    },
    {
        id: "seo",
        texture: "/ui-layer-seo.webp",
        aspect: 906 / 730,
        proY: -1.4,
        annotation: {
            title: "Advanced SEO Built-in",
            description: "Metadatos, sitemap y velocidad optimizados desde el día uno.",
            accent: "#4ade80",
        },
    },
];

export const ISOMETRIC_ROTATION: [number, number, number] = [-Math.PI / 6, Math.PI / 4, 0];
