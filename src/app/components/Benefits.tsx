import Image from "next/image";
import { Header } from "./ui/header";
import {
	Smile,
	Search,
	Star,
	ListChecks,
	MessageCircle,
	Share2,
	ChartSpline,
	PencilLine,
	Puzzle,
} from "lucide-react";

interface BenefitCard {
	title: string;
	description: string;
	icon?: React.ReactNode;
	img: string;
	badge?: string;
}

interface BenefitsProps {
	data: {
		eyebrow: string;
		title: string;
		subtitle: string;
		cards: BenefitCard[];
	}
}

// Posiciones especiales dentro del bento
const HERO_INDEX = 0;  // 2x2 arriba a la izquierda
const WIDE_INDEX = 5;  // 2x1 en la última fila, texto a la izquierda e imagen a la derecha
const LARGE_INDEX = 1; // 2x2 a la derecha (contrapeso del hero)

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

const BenefitsCards: React.FC<{ cards: BenefitCard[] }> = ({ cards }) => {

	const getIcon = (idx: number) => {
		const iconProps = { size: 28, color: "var(--color-primary)" };

		switch (idx) {
			case 0:
				return <Search {...iconProps} />
			case 1:
				return <Star {...iconProps} />
			case 2:
				return <ListChecks {...iconProps} />
			case 3:
				return <MessageCircle {...iconProps} />
			case 4:
				return <Share2 {...iconProps} />
			case 5:
				return <ChartSpline {...iconProps} />
			case 6:
				return <PencilLine {...iconProps} />
			case 7:
				return <Puzzle {...iconProps} />
			default:
				return null;
		}
	}

	// Móvil: 1 columna en orden del arreglo · md+: 3 columnas x 5 filas
	//
	//   r1 [     0 (2x2)     ][ 1 ]
	//   r2 [                 ][ 2 ]
	//   r3 [ 3 ][       6 (2x2)    ]
	//   r4 [ 4 ][                  ]
	//   r5 [    5 (2x1)      ][ 7 ]
	//
	const getPlacement = (idx: number) => {
		switch (idx) {
			case 0:
				return "md:col-start-1 md:row-start-1 md:col-span-2 md:row-span-2";
			case 1:
				return "md:col-start-3 md:row-start-1";
			case 2:
				return "md:col-start-3 md:row-start-2";
			case 3:
				return "md:col-start-1 md:row-start-3";
			case 4:
				return "md:col-start-1 md:row-start-4";
			case 5:
				return "md:col-start-1 md:row-start-5 md:col-span-2";
			case 6:
				return "md:col-start-2 md:row-start-3 md:col-span-2 md:row-span-2";
			case 7:
				return "md:col-start-3 md:row-start-5";
			default:
				return "";
		}
	}

	const getImageBox = (idx: number) => {
		if (idx === WIDE_INDEX) return "aspect-[8/3] md:mt-0 md:w-auto md:aspect-auto md:flex-1 md:self-stretch md:min-h-26";
		return "aspect-[5/4] md:aspect-auto md:flex-1 md:min-h-32";
	}

	const getSizes = (idx: number) =>
		idx === HERO_INDEX || idx === LARGE_INDEX
			? "(min-width: 768px) 66vw, 100vw"
			: "(min-width: 768px) 33vw, 100vw";

	return (
		<div className="grid grid-cols-1 gap-4 mt-8 md:grid-cols-3 md:grid-rows-5 md:gap-6">
			{cards.map((card, index) => {
				const isWide = index === WIDE_INDEX;

				return (
					<div
						key={index}
						className={`flex flex-col overflow-hidden p-4 bg-[#FFF] rounded-3xl border border-primary/20 hover:scale-[1.02] motion-reduce:hover:scale-100 transition-transform duration-300 ease-in-out
			md:p-6 md:rounded-4xl
			${getPlacement(index)}
			${isWide ? "md:flex-row md:items-center md:gap-6" : ""}`}
					>
						<div className={isWide ? "md:w-1/2 md:shrink-0" : ""}>
							<div className="mb-4 bg-[#FFF] w-fit px-4 py-3 rounded-2xl border border-primary/20 md:px-6 md:py-4 md:rounded-3xl">
								{card.icon ?? getIcon(index)}
							</div>
							<div className="mb-2 flex flex-wrap items-center gap-2">
								<h3 className="text-base font-semibold md:text-lg">{card.title}</h3>
								{card.badge && (
									<span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
										{card.badge}
									</span>
								)}
							</div>
							<p className="text-sm text-white/80">{card.description}</p>
						</div>

						<div className={`relative mt-4 w-full h-[500px] ${getImageBox(index)}`}>
							<Image
								src={card.img}
								alt=""
								aria-hidden="true"
								fill
								sizes={getSizes(index)}
								className="object-contain"
								loading="lazy"
							/>
						</div>
					</div>
				)
			})}
		</div>
	)
}