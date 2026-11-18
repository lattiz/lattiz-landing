import { defineField, defineType } from 'sanity';

export const pricingSettings = defineType({
  name: 'pricingSettings',
  title: 'Ajustes de precios',
  type: 'document',
  fields: [
    defineField({
      name: 'annualFeeNote',
      title: 'Aviso de la cuota anual',
      description:
        'Se muestra bajo los planes. Debe coincidir con el cobro de mantenimiento anual en Stripe.',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required().max(300),
    }),
  ],
  preview: { prepare: () => ({ title: 'Ajustes de precios' }) },
});
