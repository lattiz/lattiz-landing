import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { LandingTemplate } from "@/lib/templates/schema";

interface TemplatesGridProps {
  templates: LandingTemplate[];
}

// Cards keep a 20–26rem width and stay centered: 1, 2 or N items never
// stretch a single card to the full row.
export const TemplatesGrid: React.FC<TemplatesGridProps> = ({ templates }) => {
  return (
    <ul
      role="list"
      className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),26rem))] justify-center gap-6"
    >
      {templates.map((template, index) => (
        <li key={template.id} className="flex">
          <TemplateCard template={template} preload={index === 0} />
        </li>
      ))}
    </ul>
  );
};

function TemplateCard({ template, preload }: { template: LandingTemplate; preload: boolean }) {
  return (
    <div className="w-full">
      <a
        href={template.previewUrl}
        target="_blank"
        rel="noopener"
        className="group flex w-full flex-col overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary hover:scale-105 transition-all"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          <Image
            src={template.thumbnailUrl}
            alt={`Vista previa de la plantilla ${template.name}`}
            fill
            preload={preload}
            sizes="(min-width:1024px) 26rem, (min-width:640px) 50vw, 100vw"
            className="object-cover object-top motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.03]"
          />
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5">
          <h2 className="line-clamp-2 text-lg font-semibold">{template.name}</h2>
          <span className="mt-auto inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-primary">
            Ver demo
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            <span className="sr-only">(se abre en una pestaña nueva)</span>
          </span>
        </div>
      </a>
    </div>
  );

}
