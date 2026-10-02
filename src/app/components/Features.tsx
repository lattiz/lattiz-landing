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

export const Features: React.FC<FeaturesProps> = ({ data }) => {
    return (
        <section className="w-full bg-foreground px-4 mt-12 py-24">
            <div className="max-w-7xl mx-auto ">
                <Header title={data.eyebrow} subtitle={data.title} icon={<CircleStar size={24} color="var(--color-primary)" />} />
                <div className="grid grid-cols-1 md:grid-cols-3 grid-row-5 w-full gap-6">
                    {data.cards.map((card, index) => (
                        <div key={index} className={`bg-[#FFF] hover:scale-100 transition-all flex flex-col max-h-[600px] px-6 py-4 border border-secondary rounded-3xl ${index === 2 && "md:col-span-2 row-start-2"}`}>
                            <img 
                                src={card.img}
                                style={{ maskImage: "linear-gradient(black 50%, transparent)" }}
                                className="object-contain w-full h-[220px] md:h-[300px] "
                            />
                            <h3 className="text-sm md:text-lg font-semibold">{card.title}</h3>
                            <p className="text-xs pt-2 md:text-base">{card.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};