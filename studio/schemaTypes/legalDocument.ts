import { defineField, defineType } from 'sanity';

export const legalDocument = defineType({
  name: 'legalDocument',
  title: 'Documento legal',
  type: 'document',
  fields: [
    defineField({
      name: 'kind',
      title: 'Documento',
      type: 'string',
      options: {
        list: [
          { title: 'Términos y Condiciones (/terms)', value: 'terms' },
          { title: 'Política de Privacidad (/privacy)', value: 'privacy' },
          { title: 'Política de Cookies (/cookies)', value: 'cookies' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'description',
      title: 'Descripción para buscadores',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: 'version',
      title: 'Versión',
      type: 'string',
      validation: (rule) => rule.required().max(20),
    }),
    defineField({
      name: 'updatedOn',
      title: 'Última actualización',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Texto',
      description:
        'Markdown: «## » abre una sección del índice y las tablas usan «|». Publicar aquí cambia el texto legal del sitio.',
      type: 'text',
      rows: 40,
      validation: (rule) => rule.required().min(200),
    }),
  ],
  preview: {
    select: { title: 'title', version: 'version', date: 'updatedOn' },
    prepare: ({ title, version, date }) => ({
      title,
      subtitle: `Versión ${version ?? '—'} · ${date ?? 'sin fecha'}`,
    }),
  },
});
