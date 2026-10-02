"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { Wallpaper, Pencil, Globe } from "lucide-react";

interface ProcessCard {
	title: string;
	img: string;
	description: string;
}

interface ProcessCardsProps {
	cards: ProcessCard[];
}

export const ProcessCards: React.FC<ProcessCardsProps> = ({ cards }) => {
	const containerVariants = {
		hidden: { opacity: 0 },
		whileInView: {
			opacity: 1,
			transition: {
				staggerChildren: 0.3,
				delayChildren: 0.2,
			},
		},
	};

	const cardVariants = {
		hidden: {
			opacity: 0,
			y: 30,
		},
		whileInView: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				ease: [0.4, 0, 0.2, 1],
			},
		},
	};

	const lineVariants = {
		hidden: {
			pathLength: 0,
			opacity: 0,
		},
		whileInView: {
			pathLength: 1,
			opacity: 1,
			transition: {
				duration: 0.8,
				ease: [0.4, 0, 0.2, 1],
			},
		},
	};

	const GetIcon = (index: number) => {
		switch (index) {
			case 0:
				return <Wallpaper size={42} color="var(--color-primary)" />
			case 1:
				return <Pencil size={42} color="var(--color-primary)" />
			case 2:
				return <Globe size={42} color="var(--color-primary)" />
		}
	}

	return (
		<motion.div
			className="relative w-full max-w-[400px] mx-auto"
			variants={containerVariants}
			initial="hidden"
			whileInView="whileInView"
			viewport={{ once: false, margin: "-50px" }}
		>
			{cards.map((card, index) => {
				const isLeft = index % 2 === 0;
				const stepNumber = String(index + 1).padStart(2, "0");

				return (
					<div key={index}>
						{/* Process Card */}
						<motion.div
							variants={cardVariants as unknown as Variants}
							className={`relative flex items-start gap-4 mb-16 md:mb-20 ${isLeft ? "flex-row" : "flex-row-reverse"
								}`}
						>

							<motion.div
								className="relative flex-shrink-0"
								whileHover={{ scale: 1.1 }}
								transition={{ duration: 0.3 }}
							>
								{/* Main Circle with Icon */}
								<div className="relative w-20 h-20 md:w-24 md:h-24">
									{/* Dashed Circle Border */}
									<div className="absolute inset-0 bg-secondary border-2 border-quaternary rounded-full" />

									{/* Icon */}
									<div className="absolute inset-0 pb-4 flex items-center justify-center">
										{GetIcon(index)}
									</div>
								</div>

								{/* Step Number Badge */}
								<motion.div
									className="absolute -bottom-2 left-1/2 -translate-x-1/2"
									transition={{ duration: 0.3 }}
								>
									<div className="bg-secondary border-2 border-quaternary rounded-full px-2 py-1">
										<span className="font-bold text-[#60605c] text-base md:text-lg font-primary uppercase">
											{stepNumber}
										</span>
									</div>
								</motion.div>
							</motion.div>

							{/* Text Content */}
							<div
								className={`flex-1 pt-2 md:pt-4 ${isLeft ? "text-left pl-2 md:pl-4" : "text-right pr-2 md:pr-4"
									}`}
							>
								<p className="text-text text-lg md:text-xl leading-relaxed font-medium">
									{card.title}
								</p>
								<p>{card.description}</p>
							</div>
						</motion.div>

						{/* Connecting Line (only if not last item) */}
						{index < cards.length - 1 && (
							<div className="relative h-16 md:h-20 -mt-12 md:-mt-16 mb-4 md:mb-8">
								<svg
									className="absolute inset-0 w-full h-full"
									viewBox="0 0 200 80"
									preserveAspectRatio="none"
								>
									<motion.path
										d={
											isLeft
												? "M 40 0 Q 120 20, 160 80"
												: "M 160 0 Q 80 20, 40 80"
										}
										stroke="var(--quaternary)"
										strokeWidth="1"
										strokeDasharray="5,5"
										fill="none"
										variants={lineVariants as unknown as Variants}
									/>
								</svg>
							</div>
						)}
					</div>
				);
			})}
		</motion.div>
	);
};
