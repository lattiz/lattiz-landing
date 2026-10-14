import { ArrowUpRight, Check, ImageIcon, Sparkles } from "lucide-react";

// Pega aquí la URL de la imagen del bloque (ideal: formato 4:3, mín. 1200px de ancho).
// Mientras esté vacía se muestra un marco de relleno.
const CUSTOM_TEMPLATE_IMAGE_URL = "/cta.jpeg";
const CUSTOM_TEMPLATE_IMAGE_ALT =
  "Ejemplo de una plantilla personalizada con la marca de un negocio local";

const PROMO_DEADLINE = "diciembre 2026";

const BENEFITS = [
  "Diseñada con tu logo, tus colores y tu estilo",
  "Pensada para tu giro y para los clientes que quieres atraer",
  "Lista para publicarse y actualizarla tú mismo en tiempo real",
];

export default function CTA2() {
  return (
    <section className="relative w-full overflow-hidden rounded-[40px] bg-primary p-6 sm:p-10 md:p-16 lg:p-20 mb-12">
      {/* Soft glow behind the image */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/2 hidden h-[560px] w-[560px] -translate-y-1/2 rounded-full bg-accent/20 blur-3xl md:block"
      />

      <div className="relative z-10 grid items-center gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">
        {/* Copy */}
        <div className="flex flex-col">

          <h2 className="mb-4 text-2xl font-bold tracking-tight text-[#FFF] md:text-2xl">
            ¿Ninguna plantilla se parece a tu negocio?
            <br />
            Te hacemos una a tu medida sin costo adicional
          </h2>

          <p className="mb-6 max-w-xl text-[15.6px] text-[#FFF]">
            Por promoción de lanzamiento, válida hasta {PROMO_DEADLINE}, puedes
            solicitar una plantilla personalizada que refleje tu marca y tu
            imagen. Tu sitio se verá como tu negocio, no como el de todos los
            demás.
          </p>

          <ul className="mb-8 flex flex-col gap-3 md:mb-10">
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3 text-sm text-[#FFF] sm:text-base">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FFF]/20">
                  <Check aria-hidden="true" className="h-3.5 w-3.5" color="white" />
                </span>
                {benefit}
              </li>
            ))}
          </ul>

          {/* CTAs */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <a
              href="https://dashboard.lattiz.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-between gap-3 rounded-full bg-background px-6 py-3.5 text-sm font-medium text-black shadow-sm transition-transform duration-200 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFF] sm:w-fit"
            >
              <span>Solicita tu plantilla personalizada</span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                <ArrowUpRight aria-hidden="true" className="h-6 w-6" color="white" />
              </span>
              <span className="sr-only">(se abre en una pestaña nueva)</span>
            </a>

            <a
              href="/templates"
              className="inline-flex min-h-11 items-center justify-center text-sm font-medium text-[#FFF] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFF]"
            >
              Ver plantillas disponibles
            </a>
          </div>
        </div>

        {/* Image slot */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-[#FFF]/10 shadow-2xl ring-1 ring-[#FFF]/25">
          {CUSTOM_TEMPLATE_IMAGE_URL ? (
            // eslint-disable-next-line @next/next/no-img-element -- host externo aún no configurado en next.config
            <img
              src={CUSTOM_TEMPLATE_IMAGE_URL}
              alt={CUSTOM_TEMPLATE_IMAGE_ALT}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div
              aria-hidden="true"
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[#FFF]/70"
            >
              <ImageIcon className="h-10 w-10" />
              <span className="text-sm">Tu imagen aquí</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
