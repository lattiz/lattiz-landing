"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Sparkles } from "lucide-react";
import type { LandingTemplate, TemplateTier } from "@/lib/templates/schema";

interface TemplatesGridProps {
  templates: LandingTemplate[];
}

type TierFilter = "all" | TemplateTier;

const TIER_LABEL: Record<TemplateTier, string> = { basico: "Básico", pro: "Pro" };

const TIER_FILTERS: { value: TierFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "basico", label: "Básico" },
  { value: "pro", label: "Pro" },
];

const chipBase =
  "inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
const chipIdle = "border-border bg-card text-card-foreground/70 hover:border-primary/40 hover:text-card-foreground";
const chipActive = "border-primary bg-primary text-[#FFF]";

// Cards keep a 20–26rem width and stay centered: 1, 2 or N items never
// stretch a single card to the full row.
export const TemplatesGrid: React.FC<TemplatesGridProps> = ({ templates }) => {
  const [tier, setTier] = useState<TierFilter>("all");
  const [category, setCategory] = useState<string | null>(null);

  const categories = useMemo(
    () => [...new Set(templates.flatMap((t) => (t.category ? [t.category] : [])))].sort((a, b) => a.localeCompare(b, "es")),
    [templates],
  );
  const hasTiers = useMemo(() => templates.some((t) => t.tier), [templates]);

  const filtered = useMemo(
    () =>
      templates.filter(
        (t) => (tier === "all" || t.tier === tier) && (category === null || t.category === category),
      ),
    [templates, tier, category],
  );

  const isFiltering = tier !== "all" || category !== null;
  const reset = () => {
    setTier("all");
    setCategory(null);
  };

  return (
    <div>
      {(hasTiers || categories.length > 0) && (
        <div
          role="group"
          aria-label="Filtrar plantillas"
          className="mx-auto mb-8 flex max-w-4xl flex-col items-center gap-4"
        >
          {hasTiers && (
            <div role="group" aria-label="Plan" className="flex flex-wrap justify-center gap-2">
              {TIER_FILTERS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={tier === option.value}
                  onClick={() => setTier(option.value)}
                  className={`${chipBase} ${tier === option.value ? chipActive : chipIdle}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}

          {categories.length > 0 && (
            <div role="group" aria-label="Categoría" className="flex flex-wrap justify-center gap-2">
              <button
                type="button"
                aria-pressed={category === null}
                onClick={() => setCategory(null)}
                className={`${chipBase} ${category === null ? chipActive : chipIdle}`}
              >
                Todas las categorías
              </button>
              {categories.map((name) => (
                <button
                  key={name}
                  type="button"
                  aria-pressed={category === name}
                  onClick={() => setCategory(category === name ? null : name)}
                  className={`${chipBase} ${category === name ? chipActive : chipIdle}`}
                >
                  {name}
                </button>
              ))}
            </div>
          )}

          <p role="status" className="text-sm text-card-foreground/60">
            {filtered.length === 1 ? "1 plantilla" : `${filtered.length} plantillas`}
          </p>
        </div>
      )}

      {filtered.length > 0 ? (
        <ul
          role="list"
          className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),26rem))] justify-center gap-6"
        >
          {filtered.map((template, index) => (
            <li key={template.id} className="flex">
              <TemplateCard template={template} preload={index === 0} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mx-auto max-w-md rounded-3xl border border-dashed border-border p-8 text-center">
          <p className="text-lg font-semibold text-card-foreground">No hay plantillas con estos filtros</p>
          <p className="mt-2 text-sm text-card-foreground/70">Prueba con otra categoría o plan.</p>
          {isFiltering && (
            <button type="button" onClick={reset} className={`${chipBase} ${chipActive} mt-5`}>
              Limpiar filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
};

function TierBadge({ tier }: { tier: TemplateTier }) {
  const isPro = tier === "pro";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${
        isPro ? "bg-primary text-[#FFF]" : "bg-card/90 text-card-foreground ring-1 ring-border backdrop-blur"
      }`}
    >
      {isPro && <Sparkles aria-hidden="true" className="h-3 w-3" />}
      <span className="sr-only">Plan </span>
      {TIER_LABEL[tier]}
    </span>
  );
}

// Every card has the same size: the image is a fixed aspect ratio and the text
// block reserves a fixed height (1 line category, 1 line name, 3 lines
// description), so long or missing copy never changes the layout.
function TemplateCard({ template, preload }: { template: LandingTemplate; preload: boolean }) {
  return (
    <a
      href={template.previewUrl}
      target="_blank"
      rel="noopener"
      className="group flex w-full flex-col overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-safe:hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-muted">
        <Image
          src={template.thumbnailUrl}
          alt={`Vista previa de la plantilla ${template.name}`}
          fill
          preload={preload}
          sizes="(min-width:1024px) 26rem, (min-width:640px) 50vw, 100vw"
          className="object-cover object-top motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.03]"
        />
        {template.tier && (
          <div className="absolute left-3 top-3">
            <TierBadge tier={template.tier} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="h-4 truncate text-xs font-medium uppercase tracking-wide text-primary">
          {template.category ?? " "}
        </p>
        <h2 className="mt-1 truncate text-lg font-semibold leading-7">{template.name}</h2>
        <p className="mt-1 line-clamp-3 h-[4.5rem] text-sm leading-6 text-card-foreground/70">
          {template.description ?? " "}
        </p>

        <span className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-primary">
          Ver demo
          <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          <span className="sr-only">(se abre en una pestaña nueva)</span>
        </span>
      </div>
    </a>
  );
}
