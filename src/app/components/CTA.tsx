import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowRight } from "lucide-react";

function BrowserAvatar({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <Avatar className="h-12 w-12 border-2 border-background bg-card shadow-sm sm:h-14 sm:w-14">
      <AvatarFallback
        className="bg-card text-foreground"
        aria-label={label}
      >
        {children}
      </AvatarFallback>
    </Avatar>
  );
}

export default function CTA2() {
  return (
    <section className="relative w-full overflow-hidden rounded-[40px] bg-primary p-6 sm:p-10 md:p-16 lg:p-20 mb-12">
      {/* Decorative circles */}
      <div className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block">
        <div className="absolute right-[-25%] top-1/2 aspect-square h-[700px] w-[700px] -translate-y-1/2 lg:right-[-20%]">
          <div className="absolute inset-0 rounded-full bg-accent/20" />
          <div className="absolute inset-[10%] rounded-full bg-accent/20" />
          <div className="absolute inset-[20%] rounded-full bg-accent/20" />
          <div className="absolute inset-[30%] rounded-full bg-accent/20" />
          <div className="absolute inset-[40%] rounded-full bg-accent/20" />
          <div className="absolute inset-[48%] rounded-full bg-background/20" />
        </div>
      </div>

      <div className="relative z-10 flex flex-col">
        {/* Browser compatibility avatars */}
        <div
          className="mb-6 flex items-center pl-2 sm:mb-8"
          aria-label="Compatible con navegadores modernos"
        >
          <BrowserAvatar label="Google Chrome">
            <img src="/chrome.svg" alt="Google Chrome" className="h-6 w-6 sm:h-8 sm:w-8" />
          </BrowserAvatar>

          <div className="-ml-3">
            <BrowserAvatar label="Safari">
              <img src="/safari.svg" alt="Safari" className="h-6 w-6 sm:h-8 sm:w-8" />
            </BrowserAvatar>
          </div>

          <div className="-ml-3">
            <BrowserAvatar label="Mozilla Firefox">
              <img src="/fireforx.svg" alt="Mozilla Firefox" className="h-6 w-6 sm:h-8 sm:w-8" />
            </BrowserAvatar>
          </div>

          <div className="-ml-3">
            <BrowserAvatar label="Más navegadores">
              <span className="text-sm font-semibold text-muted-foreground sm:text-base">
                +3
              </span>
            </BrowserAvatar>
          </div>
        </div>

        {/* Copy */}
        <div className="max-w-2xl">
          <h2 className="mb-4 text-3xl md:text-4xl font-bold tracking-tight text-[#FFF]">
            Tu negocio ya existe.
            <br />
            <span className="text-[#FFF]">
              Ahora haz que internet lo sepa.
            </span>
          </h2>

          <p className="mb-8 max-w-xl text-base text-[#FFF] sm:text-lg md:mb-10">
            Ten un sitio web profesional, optimizado para buscadores y
            compatible con los navegadores que tus clientes usan todos los
            días. Actualízalo en tiempo real, sin esperar meses para tener
            presencia en internet.
          </p>

          {/* CTA */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href="https://lattiz.app/" target="_blank" rel="noopener noreferrer" className="flex w-fit items-center justify-start">
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-full bg-background px-6 py-3.5 text-sm font-medium text-black shadow-sm transition-transform duration-200 hover:scale-[1.02] sm:w-[220px] hover:cursor-pointer"
              >
                <span>Lanza tu sitio</span>

                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <ArrowRight className="h-6 w-6" color="white" />
                </span>
              </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}