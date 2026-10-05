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
    // — Entender qué es y cómo funciona —
    {
      question: '¿Qué es un dominio?',
      answer:
        "Es la dirección de tu negocio en internet, como la calle y el número de tu local. Por ejemplo: barberiadonramon.com. Tu página es el local y el dominio es la dirección que tus clientes escriben (o encuentran en Google) para llegar a él.",
    },
    {
      question: '¿Cómo funciona Lattiz?',
      answer:
        "Es muy sencillo: 1) Elige una plantilla pensada para tu tipo de negocio. 2) Escoge tu dominio o conecta el que ya tienes. 3) Personaliza tu página con tus textos, fotos, servicios y colores, sin tocar código. 4) Publícala en un clic y compártela por WhatsApp, redes sociales o tu tarjeta de presentación.",
    },
    {
      question: '¿Necesito saber de diseño o programación para usar Lattiz?',
      answer:
        "Para nada. Lattiz está hecho para que cualquier persona pueda publicar su sitio sin experiencia técnica. Si puedes escribir un mensaje de WhatsApp, puedes usar Lattiz.",
    },
    {
      question: 'Ya tengo Instagram y Facebook, ¿para qué quiero una página web?',
      answer:
        "Tus redes son importantes, pero no son tuyas: el algoritmo decide quién te ve y las cuentas pueden suspenderse. Tu página sí es tuya. Aparece cuando alguien busca tu tipo de negocio en Google, tiene tu menú, servicios y precios siempre disponibles, y un botón de WhatsApp para que te escriban. Además, tus redes pueden llevar a ella: se complementan, no se reemplazan.",
    },
    {
      question: '¿Puedo personalizar todo en la plantilla?',
      answer:
        'Sí. Textos, colores, imágenes, secciones y estructura — todo es editable desde el panel, sin tocar código.',
    },
    {
      question: '¿Lattiz es solo para cierto tipo de negocio?',
      answer:
        "No. Está diseñado para cualquier emprendimiento o negocio local: barberías, consultorios, cafeterías, restaurantes, estudios de yoga, despachos, tiendas y más. Si tienes clientes, tienes un caso de uso para Lattiz.",
    },
    {
      question: '¿Qué tan rápido puedo tener mi sitio en línea?',
      answer:
        'Con tu información lista (nombre del negocio, servicios, fotos y datos de contacto), el proceso completo toma entre 10 y 30 minutos.',
    },

    // — Dominio —
    {
      question: '¿El dominio está incluido?',
      answer:
        // CONFIRMAR: alcance exacto (tope de precio de compra) y a nombre de quién queda registrado
        'Sí. Está incluido en tu plan: lo buscas, lo registramos por ti y lo conectamos a tu página, sin salir de Lattiz. Incluye dominios de precio estándar; los dominios premium (los que se venden a precios especiales) pueden tener un costo adicional.',
    },
    {
      question: 'Ya tengo un dominio, ¿puedo usarlo?',
      answer:
        'Sí. Lo conectas desde tu panel y te guiamos paso a paso. Normalmente funciona en minutos, aunque a veces puede tardar hasta 48 horas en activarse en todo internet; si pasa, te lo avisamos en tu panel.',
    },

    // — Costos, cuota anual y cancelación —
    {
      question: '¿Hay costos ocultos?',
      answer:
        'No. Pagas tu plan (mensual o anual) y la cuota anual de mantenimiento. El alojamiento, el certificado de seguridad y tu dominio de precio estándar van incluidos. El único costo extra posible son los dominios premium, y te lo mostramos antes de que decidas.',
    },
    {
      question: '¿La cuota anual es obligatoria?',
      answer:
        // CONFIRMAR: monto y si aplica cuando el cliente trae su propio dominio
        'Sí. Cada año hay que renovar tu dominio para que tu dirección siga siendo tuya, y esa renovación tiene un costo. En lugar de subir tu mensualidad, lo cubrimos con una cuota anual de mantenimiento: así tu mensualidad se mantiene accesible y sabes exactamente cuánto pagas. Si no se cubre, el servicio se pausa igual que con una mensualidad vencida y no renovamos tu dominio.',
    },
    {
      question: '¿Puedo cancelar cuando quiera?',
      answer:
        // CONFIRMAR: reembolsos y qué pasa con el dominio al cancelar
        'Sí. Puedes cancelar cuando quieras desde tu cuenta, sin penalizaciones ni letras chiquitas. Tu página sigue en línea hasta que termine el periodo que ya pagaste.',
    },
    {
      question: '¿Qué pasa con mi página si dejo de pagar?',
      answer:
        // CONFIRMAR: por cuánto tiempo se conserva la información
        'Te avisamos en tu panel para que puedas ponerte al corriente. Mientras el pago esté pendiente, tu página se pausa y no estará visible para tus clientes.',
    },

    // — Resultados y seguridad —
    {
      question: '¿Mi negocio va a aparecer en Google?',
      answer:
        'Tu página se entrega lista para que Google la encuentre: rápida, adaptada a celular y con los datos de tu negocio bien ordenados. Eso sí, nadie puede garantizar un lugar específico en los resultados: depende de la competencia en tu zona y toma tiempo. Tienes más oportunidades si además cuidas tu ficha de Google Maps y juntas reseñas.',
    },
    {
      question: '¿Puedo editar mi página después de publicarla?',
      answer:
        'Sí, cuando quieras y las veces que quieras. Cambia un precio, agrega una promoción o actualiza tus horarios desde tu panel y se publica en minutos, sin pedirle a nadie ni pagar por cada cambio.',
    },
    {
      question: '¿Mi página es segura?',
      answer:
        'Sí. Incluye certificado de seguridad (SSL), ese candado que aparece junto a la dirección y que le da confianza a tus clientes, sin costo extra y sin que tengas que configurar nada.',
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
