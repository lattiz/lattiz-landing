import { defineArrayMember, defineField, defineType } from 'sanity';

export const plan = defineType({
  name: 'plan',
  title: 'Plan',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'slug',
      title: 'Identificador',
      type: 'slug',
      options: { source: 'name', maxLength: 40 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'priceMonthly',
      title: 'Precio mensual (MXN)',
      description:
        'Debe coincidir con el precio de Stripe. Vacío si el plan se cotiza.',
      type: 'number',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'priceAnnual',
      title: 'Precio anual (MXN)',
      type: 'number',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'priceLabel',
      title: 'Texto de precio',
      description:
        'Solo para planes sin precio fijo, por ejemplo «Desde $1,999 MXN».',
      type: 'string',
      validation: (rule) =>
        rule.custom((value, context) => {
          const doc = context.document as
            | { priceMonthly?: number; priceAnnual?: number }
            | undefined;
          const hasPrice = doc?.priceMonthly != null && doc?.priceAnnual != null;
          if (!value && !hasPrice) {
            return 'Indica precio mensual y anual, o un texto de precio.';
          }
          return true;
        }),
    }),
    defineField({
      name: 'description',
      title: 'Para quién es',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: 'features',
      title: 'Qué incluye',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      validation: (rule) => rule.required().min(1).max(12),
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Texto del botón',
      type: 'string',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'emphasis',
      title: 'Énfasis',
      type: 'string',
      options: {
        list: [
          { title: 'Ninguno', value: 'none' },
          { title: 'Más popular', value: 'popular' },
          { title: 'Destacado (tarjeta oscura)', value: 'highlighted' },
        ],
        layout: 'radio',
      },
      initialValue: 'none',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Orden',
      type: 'number',
      validation: (rule) => rule.required().integer().min(0),
    }),
  ],
  orderings: [
    { title: 'Orden', name: 'order', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: { select: { title: 'name', subtitle: 'description' } },
});
