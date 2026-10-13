import Link from "next/link";
import { ArrowUpRight, CircleQuestionMark } from "lucide-react";
import Faq3 from "@/app/components/ui/faq";
import { Header } from "./ui/header";
import type { FaqItem } from "@/app/data/faqs";

interface FAQsProps {
    data: {
        eyebrow: string;
        title?: string;
    };
    items: Pick<FaqItem, "question" | "answer">[];
    /** Muestra el botón "Ver todas las preguntas" que lleva a `/faqs`. */
    showAllLink?: boolean;
    /** Ancla de la sección. */
    id?: string;
    /** Reduce el espacio superior para usarlo dentro de una página dedicada. */
    compact?: boolean;
}

export const FAQs: React.FC<FAQsProps> = ({ data, items, showAllLink = false, id, compact = false }) => {

    return (
        <section className={`relative w-full px-4 ${compact ? "pt-12" : "pt-32"}`} id={id}>
            <Header title={data.eyebrow} subtitle={data.title} icon={<CircleQuestionMark size={24} color="var(--color-primary)" />} />
            <Faq3 faqs={items} />
            {showAllLink && (
                <div className="flex justify-center">
                    <Link
                        href="/faqs"
                        className="flex w-full items-center justify-between gap-3 rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-primary shadow-sm transition-transform duration-200 hover:scale-[1.02] sm:w-[280px]"
                    >
                        <span>Ver todas las preguntas</span>
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <ArrowUpRight className="h-6 w-6" color="white" />
                        </span>
                    </Link>
                </div>
            )}
        </section>
    )
}
