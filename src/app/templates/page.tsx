import type { Metadata } from "next";
import { TemplatesGrid } from "@/app/components/TemplatesGrid";
import { getTemplates } from "@/lib/templates/get-templates";

const TITLE = "Plantillas para tu página web";
const DESCRIPTION =
  "Elige una plantilla profesional para tu negocio y personalízala en minutos. Mira la demo de cada diseño antes de empezar.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/templates" },
  openGraph: {
    title: `${TITLE} | Lattiz`,
    description: DESCRIPTION,
    url: "/templates",
    siteName: "Lattiz",
    locale: "es_MX",
    type: "website",
    images: [
      {
        url: "/og.webp",
        width: 1200,
        height: 630,
        alt: "Lattiz — Página web para negocios locales en México",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | Lattiz`,
    description: DESCRIPTION,
    images: ["/og.webp"],
  },
};

// Static + ISR: getTemplates() revalidates every 300 s. Errors propagate on
// purpose so ISR keeps serving the last good page (error.tsx covers a cold failure).
export default async function TemplatesPage() {
  const templates = await getTemplates();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pt-32 pb-24 md:pt-40">
      <header className="mx-auto mb-12 max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-card-foreground md:text-5xl">
          Elige tu plantilla
        </h1>
        <p className="mt-4 text-base text-card-foreground/70 md:text-lg">
          Diseños profesionales listos para personalizar.
        </p>
      </header>

      {templates.length > 0 ? (
        <TemplatesGrid templates={templates} />
      ) : (
        <p className="text-center text-lg text-card-foreground/70">
          Pronto publicaremos nuestras plantillas.
        </p>
      )}
    </main>
  );
}
