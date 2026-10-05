import { Header } from "./ui/header";
import { CircleStar } from "lucide-react";

interface FeaturesProps {
    data: {
        eyebrow: string;
        title: string;
        subtitle: string;
        cards: {
            img: string;
            title: string;
            description: string;
        }[];
    }
}

// Cards de 2 columnas en md+ (el móvil siempre es 1 columna, sin placement).
// Con 8 cards y 3 columnas, [0, 3, 6] deja un hueco (11 celdas); el índice 5 cierra la cuadrícula.
//
//   r1 [   0 (2)   ][ 1 ]
//   r2 [ 2 ][   3 (2)   ]
//   r3 [ 4 ][   5 (2)   ]
//   r4 [   6 (2)   ][ 7 ]
//
const WIDE_PLACEMENT: Record<number, string> = {
    0: "md:col-span-2 md:row-start-1",
    3: "md:col-span-2 md:col-start-2 md:row-start-2",
    5: "md:col-span-2 md:col-start-2 md:row-start-3",
    6: "md:col-span-2 md:row-start-4",
};

export const Features: React.FC<FeaturesProps> = ({ data }) => {

    return (
        <section className="w-full bg-foreground px-4 mt-12 py-24">
            <div className="max-w-7xl mx-auto ">
                <Header title={data.eyebrow} subtitle={data.title} icon={<CircleStar size={24} color="var(--color-primary)" />} />
                <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-6">
                    {data.cards.map((card, index) => (
                        <div key={index} className={`
                        bg-[#FFF] hover:scale-100 transition-all flex flex-col w-full max-h-[600px] px-6 py-4 border border-secondary rounded-3xl 
                        ${WIDE_PLACEMENT[index] ?? ""}`}>
                            <img
                                src={card.img}
                                alt=""
                                style={{ maskImage: "linear-gradient(black 85%, transparent)" }}
                                className="object-cover w-full h-[220px] md:h-[400px] "
                            />
                            <h3 className="text-md md:text-lg font-semibold">{card.title}</h3>
                            <p className="text-[14px] pt-2 md:text-base">{card.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section >
    );
};