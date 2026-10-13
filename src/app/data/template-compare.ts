// Textos y constantes de la sección <TemplateCompareShowcase />. La UI solo los recorre.

export type Plan = "basic" | "pro";
export type DeviceKind = "desktop" | "mobile";
export type VideoKey = `${Plan}-${DeviceKind}`;

export const PLANS = ["pro", "basic"] as const satisfies readonly Plan[];
export const DEFAULT_PLAN: Plan = "pro";

export const VIDEO_SRC: Record<VideoKey, string> = {
    "basic-desktop": "/basico_desktop.mp4",
    "pro-desktop": "/pro_desktop.mp4",
    "basic-mobile": "/basico_mobile.mp4",
    "pro-mobile": "/pro_mobile.mp4",
};

export const ROW_KEYS = [
    "sections",
    "contact",
    "identity",
    "motion",
    "blocks",
    "themes",
    "mobileMenu",
    "plan",
] as const;
export type RowKey = (typeof ROW_KEYS)[number];

type PlanValues = Record<Plan, string>;

export const TEMPLATE_COMPARE_COPY = {
    eyebrow: "Plantillas",
    title: "Básico o Pro: mira la diferencia antes de elegir",
    subtitle: "Desliza para recorrer cada plantilla en computadora y en celular.",
    hint: "Desliza para comparar",
    selectorLabel: "Elegir tipo de plantilla",
    plans: { basic: "Básico", pro: "Pro" } satisfies Record<Plan, string>,
    stepOf: "{current} / {total}",
    videoError: {
        title: "No pudimos cargar el video",
        subtitle: "Recarga la página para intentarlo de nuevo.",
    },
    rows: {
        sections: {
            label: "Secciones",
            basic: "6 a 7 secciones: portada, catálogo, contacto, preguntas frecuentes y lo esencial para recibir mensajes.",
            pro: "8 a 10 secciones: suma sobre nosotros, galería o prueba social y testimonios.",
        },
        contact: {
            label: "Contacto",
            basic: "Contacto compacto.",
            pro: "Tarjeta de contacto con mapa.",
        },
        identity: {
            label: "Diseño",
            basic: "Estructura compartida por giro; cambian el tema y la portada.",
            pro: "Diseño propio por giro: orden de secciones, variantes y tipografía.",
        },
        motion: {
            label: "Movimiento",
            basic: "Limpio y rápido, sin animaciones al hacer scroll.",
            pro: "Lattiz Motion: revelados, contadores, parallax, galería con lightbox, comparador antes/después, cuenta regresiva y «abierto ahora».",
        },
        blocks: {
            label: "Bloques del editor",
            basic: "4 bloques: portada simple, servicios en tarjetas, galería en cuadrícula y contacto con horario.",
            pro: "13 bloques: suma antes y después, cifras animadas, barra de promoción, «abierto ahora» y menú con pedido por WhatsApp.",
        },
        themes: {
            label: "Temas",
            basic: "4 paletas de color; la tipografía no se cambia.",
            pro: "8 paletas con modo oscuro y 6 combinaciones de tipografía.",
        },
        mobileMenu: {
            label: "Menú en celular",
            basic: "Tarjeta flotante.",
            pro: "Pantalla completa.",
        },
        plan: {
            label: "Plan requerido",
            basic: "Plan Básico.",
            pro: "Plan Pro.",
        },
    } satisfies Record<string, { label: string } & PlanValues>,
    both: {
        label: "Incluido en ambos",
        text: "Botón flotante de WhatsApp, contacto por teléfono, correo o mapa y diseño adaptable a celular.",
    },
    footnote:
        "",
    cta: "Ver planes y precios",
} as const;
