'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/app/components/lib/utils';

interface FAQItemProps {
  question: string;
  answer: string;
  index: number;
}

function FAQItem({ question, answer, index }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.15,
        ease: 'easeOut',
      }}
      className={cn(
        'group border-border/60 rounded-lg border',
        'transition-all duration-200 ease-in-out',
        isOpen ? 'bg-foreground' : 'bg-foreground',
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 px-6 py-4 cursor-pointer"
      >
        <h3
          className={cn(
            'text-left text-base font-medium transition-colors duration-200',
            'text-primary',
            isOpen && 'text-primary',
          )}
        >
          {question}
        </h3>
        <motion.div
          animate={{
            rotate: isOpen ? 180 : 0,
            scale: isOpen ? 1.1 : 1,
          }}
          transition={{
            duration: 0.3,
            ease: 'easeInOut',
          }}
          className={cn(
            'shrink-0 rounded-full p-0.5',
            'transition-colors duration-200',
            isOpen ? 'text-primary' : 'text-primary',
          )}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: 'auto',
              opacity: 1,
              transition: {
                height: {
                  duration: 0.4,
                  ease: [0.04, 0.62, 0.23, 0.98],
                },
                opacity: {
                  duration: 0.25,
                  delay: 0.1,
                },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: {
                  duration: 0.3,
                  ease: 'easeInOut',
                },
                opacity: {
                  duration: 0.25,
                },
              },
            }}
          >
            <div className="border-border/40 border-t px-6 pt-2 pb-4">
              <motion.p
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -8, opacity: 0 }}
                transition={{
                  duration: 0.3,
                  ease: 'easeOut',
                }}
                className="text-primary/80 text-sm leading-relaxed"
              >
                {answer}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Faq3() {
  const faqs: Omit<FAQItemProps, 'index'>[] = [
    {
      question: 'Necesito saber de diseño o programación para usar Lattiz?',
      answer:
        "Para nada. Lattiz está hecho para que cualquier persona pueda publicar su sitio sin experiencia técnica. Si puedes escribir un mensaje de WhatsApp, puedes usar Lattiz.",
    },
    {
      question: '¿Puedo personalizar todo en la plantilla?',
      answer:
        'Sí. Textos, colores, imágenes, secciones y estructura — todo es editable desde el panel, sin tocar código.',
    },
    {
      question: '¿Lattiz es solo para cierto tipo de negocio?',
      answer:
        "No. Está diseñado para cualquier emprendimiento o negocio local: barberías, consultorios, restaurantes, estudios de yoga, despachos, tiendas y más. Si tienes clientes, tienes un caso de uso para Lattiz.",
    },
    {
      question: '¿Qué tan rápido puedo tener mi sitio en línea?',
      answer:
        'La mayoría de nuestros usuarios publican en menos de una hora. Con tu información lista, el proceso completo toma entre 10 y 30 minutos.',
    },
    {
      question: '¿El dominio está incluido? ',
      answer:
        'Sí. Puedes buscar, registrar y conectar tu dominio directamente desde Lattiz, sin salir a ninguna otra plataforma o traer el tuyo si es que ya cuentas con uno.',
    },
  ];

  return (
    <section className="relative w-full overflow-hidden py-16">
      <div className="relative container mx-auto max-w-7xl px-4">
        <div className="mx-auto  space-y-2">
          {faqs.map((faq, index) => (
            <FAQItem key={index} {...faq} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
