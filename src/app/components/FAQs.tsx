import Faq3 from "@/app/components/ui/faq"
import { Header } from "./ui/header";
import { CircleQuestionMark } from "lucide-react";

interface FAQsProps {
    data: {
        eyebrow: string;
        title: string;
    }
}

export const FAQs: React.FC<FAQsProps> = ({ data }) => {

    return (
        <section className="relative w-full pt-32" id="faq">
            <Header title={data.eyebrow} subtitle={data.title} icon={<CircleQuestionMark size={24} color="var(--color-primary)" />} />
            <Faq3 />
        </section>
    )
}