import { Clock, X, Check, Zap } from "lucide-react";

// Referencia de mercado (misma que la sección "Nosotros"): agencia $6,000 – $80,000 MXN.
const AGENCY = {
    price: "$6,000 – $80,000 MXN",
    time: "De 2 a 6 semanas",
    points: [
        "Esperas cotizaciones y revisiones",
        "Te entregan algo que no puedes tocar",
        "Cada cambio es otro pago",
        "El dominio se paga aparte",
    ],
};

const LATTIZ = {
    price: "$449 MXN al mes",
    time: "En 20 minutos",
    points: [
        "1 sitio web profesional",
        "Dominio incluido a elección",
        "Edita tu sitio web en cualquier momento",
        "Sin límites de cambios",
    ],
};

const BeforeAfter = () => {
    const Card = ({
        label, time, price, points, good,
    }: { label: string; time: string; price: string; points: string[]; good?: boolean }) => (
        <div
            className={`flex flex-1 flex-col gap-5 rounded-3xl p-5 md:p-8 ${
                good ? "bg-foreground border-2 border-primary" : "bg-white/5 border border-white/10 text-white"
            }`}
        >
            <span className="text-xs font-bold uppercase md:text-sm tracking-wide opacity-70">{label}</span>
            <div className="flex items-center gap-3">
                {good ? <Zap className="size-5 md:size-7" color="var(--color-primary)" /> : <Clock className="size-5 md:size-7" />}
                <span className="text-xl font-bold md:text-4xl">{time}</span>
            </div>
            <span className="text-base font-semibold md:text-lg">{price}</span>
            <ul className="flex flex-col gap-2">
                {points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-[14px] md:text-base">
                        {good ? (
                            <Check className="mt-1 size-4 shrink-0" color="var(--color-primary)" />
                        ) : (
                            <X className="mt-1 size-4 shrink-0 text-red-400" />
                        )}
                        {p}
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <div className="flex flex-col items-center w-full gap-8 py-8 my-16">
            <h2 className="text-xl font-bold text-center text-white md:text-3xl">
                Antes y después de tener tu sitio web
            </h2>
            <div className="flex w-full flex-col gap-4 md:flex-row">
                <Card label="Sin Lattiz (con una agencia)" {...AGENCY} />
                <Card label="Con Lattiz" {...LATTIZ} good />
            </div>
        </div>
    );
};

export default BeforeAfter;
