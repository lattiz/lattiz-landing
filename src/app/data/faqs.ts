/**
 * Fuente única de las preguntas frecuentes.
 *
 * Fuente de verdad del contenido: content/legal/terminos-y-condiciones.md y
 * content/legal/politica-de-privacidad.md. Si cambian los términos (plazos,
 * cuota anual, reglas de dominio, etc.), actualiza aquí las respuestas.
 *
 * - `featuredOrder`: si existe, la pregunta aparece en la página principal (`/`)
 *   en ese orden. El resto vive solo en `/faqs`.
 */

export interface FaqItem {
    id: string;
    question: string;
    answer: string;
    featuredOrder?: number;
}

export interface FaqCategory {
    id: string;
    title: string;
    items: FaqItem[];
}

export const FAQ_CATEGORIES: FaqCategory[] = [
    {
        id: "empezar",
        title: "Cómo funciona Lattiz",
        items: [
            {
                id: "como-funciona",
                featuredOrder: 1,
                question: "¿Cómo funciona Lattiz?",
                answer:
                    "Es muy sencillo: 1) Elige una plantilla pensada para tu tipo de negocio. 2) Edita tus textos, imágenes y datos de contacto desde el panel, sin tocar código. 3) Publícala en una dirección de Lattiz o conecta tu dominio. 4) Comparte tu página por WhatsApp, redes sociales o tu tarjeta de presentación.",
            },
            {
                id: "sin-conocimientos",
                featuredOrder: 2,
                question: "¿Necesito saber de diseño o programación?",
                answer:
                    "Para nada. Lattiz está hecho para que cualquier persona publique su sitio sin experiencia técnica. Si puedes escribir un mensaje de WhatsApp, puedes usar Lattiz.",
            },
            {
                id: "que-es-dominio",
                question: "¿Qué es un dominio?",
                answer:
                    "Es la dirección de tu negocio en internet, como la calle y el número de tu local. Por ejemplo: barberiadonramon.com. Tu página es el local y el dominio es la dirección que tus clientes escriben (o encuentran en Google) para llegar a él.",
            },
            {
                id: "redes-sociales",
                question: "Ya tengo Instagram y Facebook, ¿para qué quiero una página web?",
                answer:
                    "Tus redes son importantes, pero no son tuyas: el algoritmo decide quién te ve y las cuentas pueden suspenderse. Tu página sí es tuya: aparece cuando alguien busca tu tipo de negocio en Google, tiene tus servicios y datos siempre disponibles y un acceso directo a WhatsApp para que te escriban. Tus redes pueden llevar a ella: se complementan, no se reemplazan.",
            },
            {
                id: "tipo-de-negocio",
                question: "¿Lattiz es solo para cierto tipo de negocio?",
                answer:
                    "No. Está pensado para cualquier emprendimiento o negocio local: barberías, consultorios, cafeterías, restaurantes, estudios de yoga, despachos, tiendas y más. Si tienes clientes, tienes un caso de uso para Lattiz.",
            },
            {
                id: "rapidez",
                question: "¿Qué tan rápido puedo tener mi sitio en línea?",
                answer:
                    "Con tu información lista (nombre del negocio, servicios, fotos y datos de contacto), el proceso completo toma entre 10 y 30 minutos.",
            },
            {
                id: "personalizar",
                question: "¿Puedo personalizar mi plantilla y cambiarla después?",
                answer:
                    "Sí. Editas textos, imágenes y datos del negocio desde el panel. Si cambias de plantilla, guardamos antes una copia de tu proyecto, pero la plantilla nueva no hereda tu contenido, así que conviene decidirlo con calma.",
            },
            {
                id: "formularios",
                question: "¿Mi sitio tiene formulario de contacto?",
                answer:
                    "Hoy las plantillas no traen formularios. El contacto de tus visitantes abre WhatsApp, el teléfono, el correo o un mapa, así que los mensajes te llegan directo a ti.",
            },
            {
                id: "imagenes",
                question: "¿Qué imágenes puedo subir?",
                answer:
                    "Puedes subir imágenes en formato PNG, JPEG, WebP o GIF. No las redimensionamos al subirlas y no incluimos un banco de fotos, así que usa tus propias fotos.",
            },
        ],
    },
    {
        id: "prueba-gratuita",
        title: "Prueba gratuita",
        items: [
            {
                id: "prueba-gratis",
                featuredOrder: 3,
                question: "¿Puedo probar Lattiz gratis antes de pagar?",
                answer:
                    "Sí. Puedes armar tu sitio y publicarlo en una dirección temporal de Lattiz, con algunas limitaciones, durante el tiempo que indique la plataforma. El sitio de prueba muestra un aviso de Lattiz y no se indexa en buscadores; el dominio propio y las funciones de pago se activan al contratar un plan.",
            },
            {
                id: "fin-de-prueba",
                question: "¿Qué pasa cuando termina la prueba?",
                answer:
                    "Puedes seguir editando tu borrador, pero ya no puedes publicar, cambiar de plantilla ni subir archivos, y tu sitio muestra una página de Lattiz. Al contratar un plan vuelves a publicar con todo lo que ya armaste.",
            },
            {
                id: "dias-gratis-plan",
                question: "Si contrato un plan, ¿tengo días gratis de la suscripción?",
                answer:
                    "No. La prueba gratuita es aparte: contratar un plan de pago no incluye días de prueba de esa suscripción, el cobro se hace por adelantado desde el inicio.",
            },
        ],
    },
    {
        id: "planes-pagos",
        title: "Planes y pagos",
        items: [
            {
                id: "planes",
                question: "¿Qué planes hay y cada cuánto se cobran?",
                answer:
                    "Hay dos planes de pago, Básico y Pro, y cada uno se contrata por mes o por año. El pago es por adelantado y la suscripción se renueva sola por el mismo periodo hasta que la canceles. El plan Pro añade la medición de visitas en tu panel y soporte por WhatsApp, además del soporte por correo.",
            },
            {
                id: "costos-ocultos",
                featuredOrder: 7,
                question: "¿Hay costos ocultos?",
                answer:
                    "No. Pagas tu plan (los precios publicados ya incluyen IVA) y, desde el segundo año, la cuota anual de mantenimiento del dominio si Lattiz lo registró por ti. Nada más. El alojamiento y tu dominio del primer año van incluidos.",
            },
            {
                id: "como-pago",
                question: "¿Cómo pago y guardan los datos de mi tarjeta?",
                answer:
                    "El pago se hace en la página segura de Stripe. Lattiz no recibe ni guarda el número de tu tarjeta: lo recoge y lo guarda Stripe. Nosotros solo conservamos tu identificador de cliente y el estado de tu suscripción.",
            },
            {
                id: "cambiar-plan",
                question: "¿Puedo subir o bajar de plan?",
                answer:
                    "Sí. Subir de Básico a Pro aplica en el momento, con un cargo proporcional al tiempo que falta de tu periodo. Bajar de Pro a Básico se programa para el final del periodo que ya pagaste, sin cargo extra, y mantiene el mismo intervalo (mensual o anual). Hasta esa fecha sigues con tus funciones Pro.",
            },
            {
                id: "reembolsos",
                question: "¿Hacen reembolsos?",
                answer:
                    "Los pagos de la suscripción no son reembolsables, salvo lo que exija la ley. Lo mismo aplica para la compra del dominio y la cuota anual. Por eso te recomendamos probar la plataforma gratis antes de contratar.",
            },
            {
                id: "factura",
                question: "¿Puedo pedir factura?",
                answer:
                    "La plataforma no emite factura fiscal (CFDI) automáticamente; el comprobante del cobro es un recibo. Si necesitas factura, escríbenos al correo que aparece en el historial de pagos de tu panel y la preparamos fuera del sistema.",
            },
        ],
    },
    {
        id: "dominio",
        title: "Dominio",
        items: [
            {
                id: "dominio-incluido",
                featuredOrder: 4,
                question: "¿El dominio está incluido? ¿A nombre de quién queda?",
                answer:
                    "Sí: el primer año de tu dominio va incluido en tu plan, uno por cuenta. Lattiz lo registra y lo conecta a tu sitio. Ese dominio queda registrado a nombre de Lattiz y tú lo usas mientras tu plan y tu cuota anual estén al corriente. Si prefieres un dominio que sea tuyo, puedes conectar uno propio.",
            },
            {
                id: "dominio-propio",
                question: "Ya tengo un dominio, ¿puedo usarlo?",
                answer:
                    "Sí. Lo conectas a tu sitio y te indicamos qué registros DNS crear. Ese dominio sigue siendo tuyo: tú lo renuevas y respondes por él. Si vence, la conexión deja de funcionar. Al conectarlo, puede tardar un poco en activarse en todo internet.",
            },
            {
                id: "extensiones",
                question: "¿Qué extensiones de dominio puedo elegir?",
                answer:
                    "Puedes buscar dominios .com, .com.mx, .mx, .net y .org. Cuáles aparecen disponibles depende de tu plan: si el precio de un dominio no cabe en Básico pero sí en Pro, lo verás disponible con Pro.",
            },
            {
                id: "mas-de-un-dominio",
                question: "¿Puedo tener más de un dominio incluido?",
                answer:
                    "No. Cada cuenta tiene un solo dominio incluido y no vendemos un segundo dominio. Si necesitas otro, escríbenos y lo revisamos.",
            },
            {
                id: "cuota-anual",
                featuredOrder: 5,
                question: "¿Qué es la cuota anual y es obligatoria?",
                answer:
                    "Es el pago de mantenimiento de tu dominio gestionado por Lattiz, a partir del segundo año: actualmente $599.00 MXN más IVA, igual en Básico y en Pro. Se paga una vez al año con tarjeta desde un enlace de tu panel; no hay cargo automático. Te avisamos por correo desde 28 días antes del vencimiento. Si conectas un dominio propio, no aplica: tú lo renuevas.",
            },
            {
                id: "cuota-no-pagada",
                question: "¿Qué pasa si no pago la cuota anual?",
                answer:
                    "Al vencer, el dominio y el correo que uses en ese nombre dejan de funcionar y tu sitio queda fuera de línea. Tienes 15 días naturales para pagar: si pagas en ese plazo y tu plan sigue activo, recuperamos el dominio y tu sitio vuelve a estar en línea. Pasado el plazo se pierde el uso del dominio, y tu sitio vuelve a estar disponible en tu dirección de Lattiz.",
            },
            {
                id: "transferir-dominio",
                question: "¿Puedo traspasar el dominio a mi nombre?",
                answer:
                    "No ofrecemos el traspaso de un dominio gestionado por Lattiz a tu nombre. Cualquier excepción se atiende caso por caso, por escrito. Si necesitas un dominio que sea tuyo, regístralo por tu cuenta y conéctalo a tu sitio.",
            },
        ],
    },
    {
        id: "cancelacion",
        title: "Cancelación y cuenta",
        items: [
            {
                id: "cancelar",
                featuredOrder: 6,
                question: "¿Puedo cancelar cuando quiera?",
                answer:
                    "Sí. Cancelas desde el portal de pagos y aplica al final del periodo que ya pagaste: hasta entonces tu servicio sigue activo. Tu contenido no se borra, y puedes reactivar tu sitio volviendo a pagar.",
            },
            {
                id: "cobro-fallido",
                question: "¿Qué pasa si falla un cobro?",
                answer:
                    "Te avisamos y el cobrador reintenta el cargo. Mientras el pago esté atrasado y tu periodo pagado no haya terminado, tu sitio sigue en línea, pero no podrás publicar cambios. Al tercer aviso de cobro fallido cancelamos la suscripción.",
            },
            {
                id: "al-cancelar",
                question: "¿Qué pasa con mi sitio y mi dominio al cancelar?",
                answer:
                    "Tu sitio deja de verse en tu dominio y tu cuenta queda sin servicio de pago, pero tu contenido no se borra. Si el dominio lo registró Lattiz, lo conservamos para poder reactivarlo si vuelves a contratar.",
            },
            {
                id: "eliminar-cuenta",
                question: "¿Cómo elimino mi cuenta?",
                answer:
                    "Escríbenos a contacto@lattiz.app desde el correo de tu cuenta. Primero cancelamos tus suscripciones activas y luego borramos tu perfil, tu negocio y tu sitio de nuestros sistemas. Es inmediato y no se puede deshacer. Algunos datos permanecen con terceros, como tus comprobantes en el cobrador, y el dominio sigue a nombre de Lattiz hasta que venza.",
            },
            {
                id: "descargar-datos",
                question: "¿Puedo descargar mis datos o mi sitio?",
                answer:
                    "Hoy no ofrecemos una descarga automática de los datos de tu cuenta. Si necesitas una copia de tu contenido, guárdala antes de eliminar tu cuenta.",
            },
        ],
    },
    {
        id: "tu-sitio",
        title: "Tu sitio y resultados",
        items: [
            {
                id: "google",
                question: "¿Mi negocio va a aparecer en Google?",
                answer:
                    "Tu página se entrega lista para que Google la encuentre: rápida, adaptada a celular y con los datos de tu negocio bien ordenados. Eso sí, nadie puede garantizar un lugar específico en los resultados, ni un número de visitas o ventas: depende de la competencia en tu zona y toma tiempo. Tienes más oportunidades si además cuidas tu ficha de Google Maps y juntas reseñas.",
            },
            {
                id: "editar-despues",
                question: "¿Puedo editar mi página después de publicarla?",
                answer:
                    "Sí, cuando quieras y las veces que quieras. Cambia un precio, agrega una promoción o actualiza tus horarios desde tu panel y se publica en minutos, sin pedirle a nadie ni pagar por cada cambio.",
            },
            {
                id: "seguridad",
                question: "¿Mi página es segura?",
                answer:
                    "Sí. Tu sitio se sirve por HTTPS (el candado que aparece junto a la dirección), sin costo extra y sin que tengas que configurar nada.",
            },
            {
                id: "contenido-propiedad",
                question: "¿De quién es el contenido de mi sitio?",
                answer:
                    "Tuyo. Conservas la titularidad de tus textos, imágenes y marcas, y eres responsable de lo que publicas. Lattiz solo recibe el permiso técnico para alojarlo y mostrarlo. Las plantillas y la plataforma sí son de Lattiz.",
            },
            {
                id: "analitica-pro",
                question: "¿Cómo funciona la medición de visitas del plan Pro?",
                answer:
                    "Con Pro ves en tu panel un resumen de visitas, visitantes y canales de los últimos 28 días. Tu sitio muestra a tus visitantes un aviso para Aceptar o Rechazar: la medición solo se carga si aceptan. No hay un listado de visitantes con nombre y no se usa para publicidad.",
            },
        ],
    },
    {
        id: "soporte-privacidad",
        title: "Soporte y privacidad",
        items: [
            {
                id: "soporte",
                question: "¿Cómo contacto a soporte?",
                answer:
                    "Escribe a soporte@lattiz.app para dudas del panel, en Básico y en Pro. Con plan Pro también puedes contactarnos por WhatsApp desde el panel. Para privacidad o asuntos legales, escribe a contacto@lattiz.app.",
            },
            {
                id: "datos-personales",
                question: "¿Qué hacen con mis datos? ¿Los venden?",
                answer:
                    "No vendemos datos personales ni los usamos para publicidad o boletines. Usamos tu correo, los datos de tu negocio y tu contenido solo para darte la cuenta, cobrar, publicar tu sitio y avisarte del servicio. Puedes pedir acceso, rectificación, cancelación u oposición en contacto@lattiz.app, sin costo. El detalle está en nuestro Aviso de Privacidad.",
            },
        ],
    },
];

export const ALL_FAQS: FaqItem[] = FAQ_CATEGORIES.flatMap((category) => category.items);

/** Top preguntas para la página principal, en el orden de `featuredOrder`. */
export const FEATURED_FAQS: FaqItem[] = ALL_FAQS.filter(
    (faq) => faq.featuredOrder !== undefined,
).sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0));
