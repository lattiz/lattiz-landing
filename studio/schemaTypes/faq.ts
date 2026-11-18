import { defineField, defineType } from 'sanity';

export const faq = defineType({
  name: 'faq',
  title: 'Pregunta frecuente',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Pregunta',
      type: 'string',
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: 'answer',
      title: 'Respuesta',
      description:
        'Texto plano. Es lo que ve la gente en la página y lo que usa Latti AI para responder.',
      type: 'text',
      rows: 6,
      validation: (rule) => rule.required().max(2000),
    }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'reference',
      to: [{ type: 'faqCategory' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Orden dentro de la categoría',
      type: 'number',
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: 'featuredOrder',
      title: 'Orden en la página principal',
      description: 'Vacío: solo aparece en /faqs.',
      type: 'number',
      validation: (rule) => rule.integer().min(1),
    }),
  ],
  preview: { select: { title: 'question', subtitle: 'category.title' } },
});
