"use client";
import React from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "motion/react";

import useIsMobile from "@/app/hooks/isMobile";
import { ScrollIndicator } from "./scroll-indicator";

export type HeroProduct = {
  title: string;
  link: string;
  thumbnail: string;
};

const CARDS_PER_ROW = 5;
const ROWS = 3;

// Repeat the products so all three rows stay full even with fewer than 15.
function fillRows(products: HeroProduct[]): HeroProduct[][] {
  if (products.length === 0) return Array.from({ length: ROWS }, () => []);
  return Array.from({ length: ROWS }, (_, row) =>
    Array.from(
      { length: CARDS_PER_ROW },
      (_, col) => products[(row * CARDS_PER_ROW + col) % products.length],
    ),
  );
}

export const HeroParallax = ({ products }: { products: HeroProduct[] }) => {
  const [firstRow, secondRow, thirdRow] = React.useMemo(
    () => fillRows(products),
    [products],
  );
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  );
  return (
    <div
      ref={ref}
      className="h-[300vh] py-40 overflow-hidden  antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((product, i) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={i}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row  mb-20 space-x-20 ">
          {secondRow.map((product, i) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={i}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((product, i) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={i}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

const Pills = ({ steps }: { steps: string[] }) => {
  const isMobile = useIsMobile();

  if (isMobile) return null;

  return (
    <div className="flex flex-row gap-3 flex-wrap justify-center max-w-md md:max-w-full">
      {steps.map((step, idx) => (
        <div className="text-[12px] rounded-full border-1 border-primary text-white px-4 py-2" key={idx}>
          {step}
        </div>
      ))}
    </div>
  );
};

export const Header = () => {
  const isMobile = useIsMobile();
  return (
    <div className={`max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full text-center left-0 ${isMobile ? "top-[calc(50vh-100px)]" : "top-0"}`}>
      <h1 className="text-2xl md:text-7xl font-bold">
        Tu sitio web ya está <br />  construido, <span className="border-b-4 border-primary px-2 rounded-none">solo lánzalo.</span>
      </h1>
      <div className="md:max-w-2xl max-w-[420px] px-10 mx-auto text-sm md:text-lg flex flex-row gap-4 mt-8 text-white">
        Elige una base diseñada profesionalmente, personalízala con tu marca, contenido, y publica en segundos. Sin diseñadores, sin programadores, sin complicaciones.
      </div>
      <ScrollIndicator className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white" />
      <div className="flex flex-row gap-3 mt-8 justify-center">
         {!isMobile ? <Pills steps={["•  Tu marca en internet ", "• Edita cuando quieras", "• Métricas en tiempo real", "• .com/.mx incluido", "• Cancela cuando quieras"]} /> : null}
      </div>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: HeroProduct;
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      className="group/product h-96 w-[30rem] relative shrink-0"
    >
      <a
        href={product.link}
        target="_blank"
        rel="noopener"
        className="block group-hover/product:shadow-2xl "
      >
        <Image
          src={product.thumbnail}
          fill
          sizes="30rem"
          className="object-cover object-left-top"
          alt={`Vista previa de la plantilla ${product.title}`}
        />
      </a>
      <div className="absolute inset-0 h-full w-full opacity-0 hover:cursor-text"></div>
    </motion.div>
  );
};
