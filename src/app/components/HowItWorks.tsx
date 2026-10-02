import { Header } from "./ui/header";
import { Milestone } from "lucide-react";
import { ProcessCards } from "./ui/howItWorksCards";

interface HowItWorkdsProps {
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

export const HowItWorks: React.FC<HowItWorkdsProps> = ({ data }) => {
    return (
        <section className="relative w-full pt-32">
            {/* Background Pattern Container */}
            <div
                className="absolute inset-0 w-full h-full z-20"
                style={{
                    backgroundImage: `url('/images/pattern1.svg')`,
                    backgroundRepeat: "repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
                aria-hidden="true"
            />
            <div className="w-full flex flex-col md:flex-row items-start justify-center max-w-7xl mx-auto px-4 relative z-20 gap-8">
                <div className="w-full md:w-1/2 md:sticky md:top-24 h-fit mx-auto flex justify-center pt-24">
                    <Header title={data.title} icon={<Milestone size={24} color="var(--color-primary)" />} />
                </div>
                <div className="w-full md:w-1/2 md:mt-16 mt-12">
                    <ProcessCards cards={data.cards} />
                </div>
                <div className="w-full max-w-[300px] flex md:hidden mx-auto justify-center">
                    <button className="px-8 py-2 bg-red-500">odadpjaopd botona</button>
                </div>
            </div>
        </section>
    );
};