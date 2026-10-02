import { ScrollProgressText } from "@/app/components/ui/scroll-text";
import { Users } from "lucide-react";
import { Header } from "./ui/header"

export const About = () => {
    return (
        <div className="flex flex-col w-full mt-32 flex-wrap">
            <Header title="Nosotros" subtitle="Hecho para el negocio mexicano de hoy." icon={<Users className="size-6" color="var(--color-primary)" />} />


            <div className="w-full flex flex-col px-2">
                <ScrollProgressText
                stagger={0.05}
                className="w-full text-[26.1px] md:text-4xl lg:text-5xl text-left text-white leading-[1.2] tracking-tight"
                text="Tu negocio existe. Tu sitio web, también debería.
Las redes sociales son prestadas. 
El algoritmo decide quién te ve, cuándo y en qué orden. Un sitio web propio es diferente: es tuyo, aparece en Google, y trabaja para ti mientras tú atiendes el negocio.
7 de cada 10 mexicanos busca en internet antes de comprar o visitar un negocio. Los que tienen sitio web obtienen los clientes y generan reseñas. Los que no, pierden oportunidades.
Una agencia cobra de $6,000 a $80,000 pesos y te entrega algo que no puedes tocar. Lattiz te da lo mismo — con dominio incluido — por menos de lo que pagas de internet al mes. Y tú controlas todo."/>
            </div>
        </div>
    )
}