import { Header } from "./ui/header";
import useIsMobile from "../hooks/isMobile";
import { Smile, Globe, PanelsTopLeft, MonitorSmartphone, ChartSpline, ClockFading } from "lucide-react";

interface BenefitsProps {
	data: {
		eyebrow: string;
		title: string;
		subtitle: string;
		cards: {
			title: string;
			description: string;
			icon?: React.ReactNode;
		}[];
	}
}

export const Benefits: React.FC<BenefitsProps> = ({ data }) => {
	return (
		<div className="flex flex-col w-full mt-32">
			<Header title={data.eyebrow} subtitle={data.title} icon={<Smile size={24} color="var(--color-primary)" />} />

			<div className="">
				<BenefitsCards cards={data.cards} />
			</div>
		</div>
	)
}

const BenefitsCards: React.FC<{ cards: { title: string; description: string; icon?: React.ReactNode }[] }> = ({ cards }) => {

	const getIcon = (idx: number) => {
		switch (idx) {
			case 0:
				return <ClockFading size={28} color="var(--color-primary)" />
			case 1:
				return <PanelsTopLeft size={28} color="var(--color-primary)" />
			case 2:
				return <Globe size={28} color="var(--color-primary)" />
			case 3:
				return <MonitorSmartphone size={28} color="var(--color-primary)" />
			case 4:
				return <ChartSpline size={28} color="var(--color-primary)" />
			default:
				return null;
		}
	}

	return (
		<div className="grid grid-cols-1 gap-4 mt-8 md:grid-cols-5 md:grid-rows-4 md:gap-6">
			{cards.map((card, index) => (
				<div
					key={index}
					className={`p-4 bg-foreground rounded-3xl border border-primary/20 hover:scale-[1.02] transition-transform duration-300 ease-in-out
			md:p-6 md:rounded-4xl
			${index === 0
							? 'md:col-span-2 md:row-span-2'
							: index === 1
								? 'md:col-span-3 md:row-span-2'
								: index === 2
									? 'md:col-span-2 md:row-span-3'
									: index === 3
										? 'md:col-span-3 md:row-span-3'
										: 'md:col-span-5 md:row-span-1'
						}`}
				>
					<div className="mb-4 bg-[#FFF] w-fit px-4 py-3 rounded-2xl border border-primary/20 md:px-6 md:py-4 md:rounded-3xl">
						{getIcon(index)}
					</div>
					<h3 className="text-base font-semibold mb-2 md:text-lg">{card.title}</h3>
					<p className="text-sm text-white/80">{card.description}</p>
				</div>
			))}
		</div>
	)
}