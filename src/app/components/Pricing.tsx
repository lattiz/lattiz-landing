'use client';

import { useState } from 'react';
import { cn } from '@/app/components/lib/utils';
import NumberFlow from '@number-flow/react';
import { BadgeCheck, Regex } from 'lucide-react';
import { motion } from 'framer-motion';
import { Header } from './ui/header';

const PAYMENT_FREQUENCIES: ('mensual' | 'anual')[] = ['mensual', 'anual'];
// Must match the Stripe "Mantenimiento anual de dominio" one-time Price.
const DOMAIN_MAINTENANCE_DISCLOSURE =
  'Cuota anual de mantenimiento: $599 MXN a partir del 2.º año.';
const TIERS = [
  {
    id: 'individuals',
    name: 'Básico',
    price: {
      mensual: 449,
      anual: 4490,
    },
    description: 'Para salones, consultorios, tiendas locales y restaurantes pequeños.',
    features: [
      '1 Sitio Web Profesional',
      'Acceso al panel de edición (CMS)',
      `Dominio incluido a elección.`,
      'Certificado de seguridad SSL incluido',
      'Botón de WhatsApp integrado',
      '99.9% de uptime',
      'Soporte por correo (respuesta 48hrs)',
    ],
    cta: 'Empezar con plan básico ahora',
  },
  {
    id: 'teams',
    name: 'Pro',
    price: {
      mensual: 699,
      anual: 6990,
    },
    description: "Para restaurantes establecidos, despachos, clínicas con volumen y boutiques.",
    features: [
      'Todo lo del plan Básico',
      `Más opciones de dominios (.com, .mx...)`,
      'SEO avanzado pre-configurado',
      'Sitios web premium con acceso anticipado',
      'Analíticas y métricas sobre clientes ',
      'Acceso anticipado a nuevas funciones',
      'Soporte prioritario por WhatsApp'
    ],
    cta: 'Empezar con plan Pro ahora',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Empresarial',
    price: {
      mensual: 'Desde $1,999 MXN',
      anual: 'Desde $1,999 MXN',
    },
    description: 'Para multi-ubicaciones, franquicias y empresas con necesidades específicas.',
    features: [
      'Todo lo del plan Pro',
      'Múltiples sitios web bajo una sola cuenta',
      'Diseño y sitios web personalizados, únicos',
      'Integraciones personalizadas (CRM, reservas, pagos)',
      'Dominios múltiples a elección*',
      'SLA con garantía de disponibilidad',
      'Account manager dedicado',
      'Soporte prioritario con atención directa',
    ],
    cta: 'Contáctanos',
    highlighted: true,
  },
];

const HighlightedBackground = () => (
  <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] bg-[size:45px_45px] opacity-100 dark:opacity-30" />
);

const PopularBackground = () => (
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(240,119,119,0.1),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(220,119,118,0.3),rgba(255,255,255,0))]" />
);

const Tab = ({
  text,
  selected,
  setSelected,
  discount = false,
}: {
  text: string;
  selected: boolean;
  setSelected: (text: string) => void;
  discount?: boolean;
}) => {
  return (
    <button
      onClick={() => setSelected(text)}
      className={cn(
        'text-[#000] relative w-fit cursor-pointer px-4 py-2 text-sm font-semibold capitalize transition-colors',
        discount && 'flex items-center justify-center gap-2.5',
      )}
    >
      <span className="relative z-10">{text}</span>
      {selected && (
        <motion.span
          layoutId="tab"
          transition={{ type: 'spring', duration: 0.4 }}
          className="bg-background absolute inset-0 z-0 rounded-full shadow-sm"
        ></motion.span>
      )}
      {discount && (
        <div
          className={cn(
            'relative z-10 bg-gray-100 text-xs px-2 py-1 whitespace-nowrap text-[#FFF] shadow-none hover:bg-gray-100',
            selected
              ? 'bg-primary rounded-2xl hover:bg-primary/80'
              : 'bg-primary hover:bg-primary/80',
          )}
        >
          ¡Ahorra 2 meses!
        </div>
      )}
    </button>
  );
};

const PricingCard = ({
  tier,
  paymentFrequency,
}: {
  tier: (typeof TIERS)[0];
  paymentFrequency: keyof typeof tier.price;
}) => {
  const price = tier.price[paymentFrequency];
  const isHighlighted = tier.highlighted;
  const isPopular = tier.popular;

  return (
    <div
      className={cn(
        'relative flex flex-col gap-8 overflow-hidden rounded-2xl border p-6 shadow hover:scale-105 transition-all duration-300',
        isHighlighted
          ? 'bg-foreground text-[#000]'
          : 'bg-background text-[#000]',
        isPopular && 'outline outline-primary bg-gradient-to-r from-[#0f172a]  to-[#334155] text-[#FFF]',
      )}
    >
      {isHighlighted && <HighlightedBackground />}
      {isPopular && <PopularBackground />}

      <h2 className="flex items-center gap-3 text-xl font-medium capitalize">
        {tier.name}
        {isPopular && (
          <div className="mt-1 bg-foreground px-2 py-1 text-white hover:bg-primary">
            🔥 Más popular
          </div>
        )}
      </h2>

      <div className="relative h-12">
        {typeof price === 'number' ? (
          <>
            <NumberFlow
              format={{
                style: 'currency',
                currency: 'MXN',
                trailingZeroDisplay: 'stripIfInteger',

              }}
              value={price}
              className="text-4xl font-medium"
            />
            <p className="-mt-2 text-xs font-medium">{paymentFrequency === 'mensual' ? 'Por mes' : 'Por año'}</p>
          </>
        ) : (
          <h1 className="text-4xl font-medium">{price}</h1>
        )}
      </div>

      <div className="flex-1 space-y-2">
        <h3 className="text-sm font-medium">{tier.description}</h3>
        <ul className="space-y-2">
          {tier.features.map((feature, index) => (
            <li
              key={index}
              className={cn(
                'flex items-center gap-2 text-sm font-medium',
                isPopular && 'text-[#FFF]',
                isHighlighted && 'text-[#000]',
              )}
            >
              <BadgeCheck strokeWidth={1} size={16} />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <button
        className={cn(
          'h-fit w-full text-center hover:cursor-pointer z-20 rounded-full bg-primary py-3 text-[#FFF] hover:bg-primary/80',
          isHighlighted && 'bg-[#FFF] text-[#000] hover:bg-accent/95',
        )}>
        <a 
          href={tier.id === 'enterprise' ? 'mailto:enterprise@lattiz.com' : 'https://lattiz.app/'}
          target="_blank"
          rel="noopener noreferrer"
        >
          {tier.cta}
        </a>
      </button>
    </div>
  );
};

export default function PricingSection() {
  const [selectedPaymentFreq, setSelectedPaymentFreq] = useState<
    'mensual' | 'anual'
  >(PAYMENT_FREQUENCIES[0]);

  return (
    <section className="flex flex-col items-center gap-10 pt-42">
      <Header title="Planes y precios" subtitle='Un plan para cada etapa de tu negocio' icon={<Regex size={24} color='var(--color-primary)' />} />
      <div className="space-y-7 text-center">
        <div className="mx-auto flex w-fit rounded-full bg-[#F3F4F6] p-1 dark:bg-[#222]">
          {PAYMENT_FREQUENCIES.map((freq) => (
            <Tab
              key={freq}
              text={freq}
              selected={selectedPaymentFreq === freq}
              setSelected={(text) =>
                setSelectedPaymentFreq(text as 'mensual' | 'anual')
              }
              discount={freq === 'anual'}
            />
          ))}
        </div>
      </div>

      <div className="grid w-full max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {TIERS.map((tier, i) => (
          <PricingCard
            key={i}
            tier={tier}
            paymentFrequency={selectedPaymentFreq}
          />
        ))}
      </div>
    </section>
  );
}
