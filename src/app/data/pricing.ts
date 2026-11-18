// Respaldo de planes y precios: se usa cuando Sanity no está configurado o no responde.
// La fuente editable es el Studio (tipos `plan` y `pricingSettings`).

export type PricingTier = {
  id: string;
  name: string;
  price: { mensual: number | string; anual: number | string };
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
  highlighted?: boolean;
};

// Must match the Stripe "Mantenimiento anual de dominio" one-time Price.
export const DOMAIN_MAINTENANCE_DISCLOSURE =
  'Se cobra una couta anual de mantenimiento del sitio web: $599 MXN + IVA a partir del 2º año en plan Básico y Pro.';
export const TIERS: PricingTier[] = [
  {
    id: 'individuals',
    name: 'Básico',
    price: {
      mensual: 449,
      anual: 4490,
    },
    description: 'Para salones, consultorios, tiendas locales y restaurantes pequeños.',
    features: [
      '(1) Sitio Web Profesional',
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
      'Sitios web premium + secciones premium',
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
