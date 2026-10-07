"use client";

import { useEffect } from "react";
import { RotateCw } from "lucide-react";

export default function TemplatesError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 pt-32 pb-24 text-center md:pt-40">
      <h1 className="text-3xl font-bold tracking-tight text-card-foreground md:text-5xl">
        Elige tu plantilla
      </h1>
      <p className="mt-6 text-base text-card-foreground/70 md:text-lg">
        No pudimos cargar las plantillas en este momento. Inténtalo de nuevo en unos segundos.
      </p>
      <button
        type="button"
        onClick={() => retry()}
        className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-[#FFF] shadow-sm dark:text-[#000] hover:cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-safe:transition-transform motion-safe:duration-200 motion-safe:hover:scale-[1.02]"
      >
        <RotateCw aria-hidden="true" className="h-4 w-4" />
        Reintentar
      </button>
    </main>
  );
}
