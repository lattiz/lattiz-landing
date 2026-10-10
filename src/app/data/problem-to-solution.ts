// Textos de la sección <ProblemToSolution />. La UI solo los recorre.

export type PainPoint = {
    id: string;
    title: string;
    detail: string;
};

export type SolutionLine = {
    id: string;
    text: string;
    variant: "kicker" | "headline" | "subhead";
};

export const PROBLEM_COPY = {
    eyebrow: "El modelo de agencia tradicional",
    title: "El desarrollo web tradicional está roto.",
} as const;

export const PAIN_POINTS: PainPoint[] = [
    { id: "price", title: "Pagas $3,000+ USD", detail: "Por un sitio que no podrás tocar sin volver a pagar." },
    { id: "time", title: "Esperas 3 meses", detail: "Cotizaciones, juntas, revisiones y más juntas." },
    { id: "rigid", title: "Cero flexibilidad", detail: "Cada cambio es un ticket, un correo y otra factura." },
];

export const SOLUTION_LINES: SolutionLine[] = [
    { id: "kicker", text: "La evolución WaaS.", variant: "kicker" },
    { id: "headline", text: "Tu sitio hoy, no en otoño.", variant: "headline" },
    { id: "subhead", text: "Diseños de clase mundial. CMS integrado.", variant: "subhead" },
];

export const SOLUTION_STATS = [
    { id: "launch", value: "20 min", label: "para publicar" },
    { id: "edits", value: "∞", label: "cambios incluidos" },
    { id: "uptime", value: "99.9%", label: "uptime gestionado" },
] as const;
