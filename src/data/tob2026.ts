// Fuente única del programa TOB 2026 (miércoles 4 y jueves 5 de noviembre):
// personas que aparecen en el programa y en /speakers, y la agenda de cada día.
// Los textos en español viven aquí; las traducciones al inglés están en public/lang.js
// con las claves ppl_<id>_role / ppl_<id>_bio y prg_<key>_title / prg_<key>_desc.

export const COMING_SOON_FOTO = "/imagenes/speakers/coming-soon.svg";

export type PersonaTipo = "speaker" | "cultural" | "organizacion";

export type Persona = {
  id: string;
  nombre: string;
  rol: string;
  bio: string;
  foto: string;
  linkedin?: string;
  instagram?: string;
  tipo: PersonaTipo;
};

export const personas: Persona[] = [
  // ── Speakers ─────────────────────────────────────────────
  { id: "maria-jose-artavia", tipo: "speaker", nombre: "María José Artavia", rol: "Directora · Escuela de ATI", foto: "/imagenes/speakers/speaker07.webp", instagram: "https://www.instagram.com/mariajo.aj/", bio: "Directora de la Escuela de Administración de Tecnología de Información, a cargo de la apertura oficial del TOB 2026." },
  { id: "tamara-sancho", tipo: "speaker", nombre: "Tamara Sancho", rol: "P&G", foto: "/imagenes/speakers/speaker02.webp", linkedin: "https://www.linkedin.com/in/tamarajudit/", bio: "Transforma el miedo en una herramienta de crecimiento personal y profesional." },
  { id: "dunnia-vargas", tipo: "speaker", nombre: "Dunnia Vargas González", rol: "LinkedIn Top Voice", foto: "/imagenes/speakers/dunnia-vargas.webp", linkedin: "https://www.linkedin.com/in/dunnia-vargas-gonzalez/", instagram: "https://www.instagram.com/dunniavargasgonzalez/", bio: "Referente en marca personal; enseña a construir una presencia profesional auténtica." },
  { id: "pedro-gutierrez", tipo: "speaker", nombre: "Pedro Gutiérrez", rol: "CEO · Avify", foto: "/imagenes/speakers/pedro-gutierrez.webp", linkedin: "https://www.linkedin.com/in/peter-gg/", instagram: "https://www.instagram.com/heypeter.io/", bio: "Comparte el camino real de construir una startup de 0 a 1M." },
  { id: "luis-jimenez", tipo: "speaker", nombre: "Luis Jiménez", rol: "Grand Fox", foto: "/imagenes/speakers/luis-jimenez.webp", linkedin: "https://www.linkedin.com/in/luis-jimenez22/", bio: "Ayuda a estudiantes a ganar experiencia profesional en tecnología antes de graduarse." },
  { id: "pilar-sanchez", tipo: "speaker", nombre: "Pilar Sánchez", rol: "Avify", foto: "/imagenes/speakers/speaker03.webp", linkedin: "https://www.linkedin.com/in/pilar-sanchezv/", bio: "Líder de la industria que comparte su visión sobre resiliencia y crecimiento." },
  { id: "wendy-badilla", tipo: "speaker", nombre: "Wendy Badilla", rol: "Microsoft", foto: "/imagenes/speakers/speaker04.webp", linkedin: "https://www.linkedin.com/in/wendy-badilla-225630a0/", bio: "Experta de Microsoft en cloud computing y en impulsar a más mujeres en STEM." },
  { id: "paula-brenes", tipo: "speaker", nombre: "Paula Brenes", rol: "Fundación Jobs", foto: "/imagenes/speakers/paula-brenes.webp", linkedin: "https://www.linkedin.com/in/paulabrenes/", bio: "Impulsa la empleabilidad y el desarrollo de talento desde Fundación Jobs." },
  { id: "aaron-omodeo", tipo: "speaker", nombre: "Aarón Omodeo", rol: "Doji Club", foto: "/imagenes/speakers/aaron-omodeo.webp", linkedin: "https://www.linkedin.com/in/aaron-omodeo/", instagram: "https://www.instagram.com/somosdoji/", bio: "Especialista en finanzas prácticas y en tomar decisiones de inversión con criterio." },
  { id: "frank-calvo", tipo: "speaker", nombre: "Frank Calvo", rol: "Loud", foto: "/imagenes/speakers/frank-calvo.webp", linkedin: "https://www.linkedin.com/in/frank-calvo-coto-82871141/", bio: "Estratega de mercadeo digital enfocado en conectar marcas con audiencias saturadas." },
  { id: "karla-fonseca", tipo: "speaker", nombre: "Karla Fonseca", rol: "Moody's", foto: "/imagenes/speakers/karla-fonseca.webp", linkedin: "https://www.linkedin.com/in/karla-fonseca-a80b4223b/", bio: "Comparte claves para armar un CV que abra puertas en procesos de selección." },
  { id: "alejandro-hidalgo", tipo: "speaker", nombre: "Alejandro Hidalgo", rol: "P&G", foto: "/imagenes/speakers/alejandro-hidalgo.webp", linkedin: "https://www.linkedin.com/in/alehs/", bio: "Aplica metodologías ágiles para simplificar procesos y entregar valor más rápido." },
  { id: "alek-castillo", tipo: "speaker", nombre: "Alek Castillo", rol: "Lyfter", foto: "/imagenes/speakers/speaker08.webp", linkedin: "https://www.linkedin.com/in/alek-castillo/", bio: "Explora el rol del AI Engineer y cómo pasar de prompts sueltos a sistemas autónomos." },
  { id: "alejandro-castaneda", tipo: "speaker", nombre: "Alejandro Castañeda", rol: "Sefisa", foto: COMING_SOON_FOTO, linkedin: "https://www.linkedin.com/in/alejandro-casta%C3%B1eda-barrera-a15a5814/", bio: "Muestra la ciberseguridad como una carrera llena de oportunidades." },
  { id: "rei-araya", tipo: "speaker", nombre: "Rei Araya", rol: "Moody's", foto: COMING_SOON_FOTO, bio: "Convierte datos en decisiones con Business Intelligence." },
  { id: "karla-cordoba", tipo: "speaker", nombre: "Karla Córdoba", rol: "Aso Blockchain CR", foto: "/imagenes/speakers/speaker11.webp", linkedin: "https://www.linkedin.com/in/muguika/", bio: "Muestra aplicaciones reales del blockchain más allá de las criptomonedas." },
  { id: "christopher-eleven", tipo: "speaker", nombre: "Christopher", rol: "Eleven.Core", foto: COMING_SOON_FOTO, bio: "Presentará Slinky. Muy pronto más detalles." },
  { id: "ronald-arce", tipo: "speaker", nombre: "Ronald Arce", rol: "INCAE", foto: "/imagenes/speakers/speaker13.webp", linkedin: "https://www.linkedin.com/in/ronald-arce-b38331b/", bio: "Analiza cómo la IA puede impulsar soluciones inteligentes y un futuro sostenible." },

  // ── Actos culturales ─────────────────────────────────────
  { id: "ruben-monarca", tipo: "cultural", nombre: "Rubén Monarca", rol: "Acto cultural", foto: "/imagenes/speakers/actividadCultural01.webp", linkedin: "https://www.linkedin.com/in/rub%C3%A9n-el%C3%ADas-monarca-ugalde-191287421/", bio: "Presentación cultural y artística en vivo." },
  { id: "nestor-morales", tipo: "cultural", nombre: "Nestor Morales", rol: "Acto cultural · Bandati", foto: "/imagenes/speakers/actividadCultural02.webp", instagram: "https://www.instagram.com/nestoramr/", bio: "Presentación musical con Bandati." },
  { id: "pedro-leiva", tipo: "cultural", nombre: "Pedro Leiva", rol: "Acto cultural · Bandati", foto: "/imagenes/speakers/actividadCultural03.webp", linkedin: "https://www.linkedin.com/in/pedro-leiva/", bio: "Presentación musical con Bandati." },
  { id: "melody-coto", tipo: "cultural", nombre: "Melody Coto", rol: "Acto cultural", foto: "/imagenes/speakers/actividadCultural04.webp", linkedin: "https://www.linkedin.com/in/melody-coto-viera-9b4701248/", bio: "Expresión artística y dinamismo musical." },
  { id: "randy-masis", tipo: "cultural", nombre: "Randy Masis", rol: "Acto cultural · Cortometraje", foto: COMING_SOON_FOTO, bio: "Proyección de un cortometraje como cierre artístico del día." },
  { id: "melissa", tipo: "cultural", nombre: "Melissa", rol: "Acto cultural", foto: COMING_SOON_FOTO, bio: "Presentación cultural entre bloques de contenido." },
  { id: "efrain-bastos", tipo: "cultural", nombre: "Efraín Bastos", rol: "Acto cultural", foto: COMING_SOON_FOTO, bio: "Presentación cultural para cerrar el ciclo de charlas." },

  // ── Organización y presentadores del TOB ─────────────────
  { id: "abril-masis", tipo: "organizacion", nombre: "Abril Masis", rol: "Coordinación TOB", foto: "/imagenes/coordinadores/coodinador01.webp", bio: "" },
  { id: "julia-vargas", tipo: "organizacion", nombre: "Julia Vargas Thompson", rol: "Presentadora TOB", foto: "/imagenes/host/presentador03.png", linkedin: "https://www.linkedin.com/in/julia-vargas-thompson-675545189/", bio: "" },
  { id: "anthony-fuentes", tipo: "organizacion", nombre: "Anthony Fuentes", rol: "Presentador TOB", foto: "/imagenes/host/presentador01.webp", linkedin: "https://www.linkedin.com/in/anthony-fuentes-2595a7282/", bio: "" },
  { id: "dennis-rojas", tipo: "organizacion", nombre: "Dennis Rojas", rol: "Presentador TOB", foto: "/imagenes/host/presentador02.webp", linkedin: "https://www.linkedin.com/in/dennis-o-rojas-quesada-749056358/", bio: "" },
  // Easter egg: el tiburón martillo aparece como encargado del cierre del miércoles
  { id: "tiburon-martillo", tipo: "organizacion", nombre: "Tiburón Martillo", rol: "Mascota TOB", foto: "/imagenes/mascotas/tiburon-martillo-avatar.webp", bio: "" },
  { id: "organizacion-tob", tipo: "organizacion", nombre: "Organización TOB", rol: "Technology on Business", foto: "/imagenes/IsotipoColor.webp", bio: "" },
];

export const personaPorId = new Map(personas.map((p) => [p.id, p]));

// Etiquetas: definen el estilo y si la sesión lleva botón de inscripción en Luma.
export type Tipo = "charla" | "panel" | "foro" | "inauguracion" | "cultural" | "dinamica" | "podcast" | "rifa" | "receso" | "cierre";

export const TIPOS_CON_LUMA: Tipo[] = ["charla", "panel", "foro"];

export const tipoLabel: Record<Tipo, string> = {
  charla: "Charla",
  panel: "Panel",
  foro: "Foro",
  inauguracion: "Inauguración",
  cultural: "Acto cultural",
  dinamica: "Dinámica",
  podcast: "Podcast",
  rifa: "Rifa",
  receso: "Receso",
  cierre: "Cierre",
};

export type Sesion = {
  key: string;
  hora: string;
  tipo: Tipo;
  titulo: string;
  desc: string;
  personas: string[];
};

export type Bloque = {
  key: string;
  titulo: string;
  tituloKey: string;
  luma?: string;
  sesiones: Sesion[];
};

// luma del día aplica a todos sus bloques; un bloque puede tener uno propio.
export type Dia = { id: string; fecha: string; fechaKey: string; luma?: string; bloques: Bloque[] };

const PRESENTADORES = ["anthony-fuentes", "dennis-rojas"];

export const programa: Dia[] = [
  {
    id: "day1",
    fecha: "Miércoles 4 nov",
    fechaKey: "prg_day1_short",
    luma: "https://luma.com/qmjum5ed",
    bloques: [
      {
        key: "d1-equilibrio", titulo: "You can’t make a change if you can’t master yourself", tituloKey: "prg_block_d1_1",
        sesiones: [
          { key: "d1_inauguracion", hora: "09:15 AM — 09:30 AM", tipo: "inauguracion", titulo: "Inauguración", desc: "Palabras de bienvenida para dar apertura oficial al TOB 2026: dos días dedicados a la innovación, el crecimiento profesional y la conexión con la industria.", personas: ["maria-jose-artavia", "abril-masis"] },
          { key: "d1_bandati", hora: "09:35 AM — 09:45 AM", tipo: "cultural", titulo: "Acto cultural: Bandati", desc: "Un respiro musical antes de arrancar con el contenido del día.", personas: ["nestor-morales", "pedro-leiva"] },
          { key: "d1_intro", hora: "09:50 AM — 10:10 AM", tipo: "dinamica", titulo: "Introducción al evento", desc: "Dinámica para romper el hielo y presentar la mecánica, los bloques y los objetivos del TOB 2026.", personas: ["julia-vargas"] },
          { key: "d1_miedos", hora: "10:15 AM — 11:00 AM", tipo: "charla", titulo: "Extraordinary fears: a quick guide on how to transform fear", desc: "Una guía práctica para ver el miedo como motor de cambio y convertirlo en una herramienta de crecimiento.", personas: ["tamara-sancho"] },
          { key: "d1_marca", hora: "11:05 AM — 11:45 AM", tipo: "charla", titulo: "Tu próximo gran proyecto eres tú", desc: "Cómo construir una marca personal auténtica que impulse tu carrera y te abra nuevas oportunidades.", personas: ["dunnia-vargas"] },
          { key: "d1_rifa1", hora: "11:45 AM — 11:50 AM", tipo: "rifa", titulo: "Retroalimentación y rifa", desc: "Compartí tu experiencia del bloque con el código QR y participá en la rifa.", personas: PRESENTADORES },
          { key: "d1_almuerzo", hora: "12:00 PM — 12:45 PM", tipo: "receso", titulo: "Almuerzo", desc: "Receso para almorzar y hacer networking con asistentes, speakers y patrocinadores.", personas: ["organizacion-tob"] },
        ],
      },
      {
        key: "d1-crecimiento", titulo: "Technology never stops evolving, so why should we?", tituloKey: "prg_block_d1_2",
        sesiones: [
          { key: "d1_startup", hora: "01:00 PM — 01:45 PM", tipo: "charla", titulo: "Empresa de 0 a 1M", desc: "El camino real de llevar una startup desde cero hasta el primer millón: retos, decisiones clave y aprendizajes.", personas: ["pedro-gutierrez"] },
          { key: "d1_experiencia", hora: "01:50 PM — 02:30 PM", tipo: "charla", titulo: "¿Cómo construir experiencia profesional en tecnología antes de graduarse?", desc: "Proyectos, comunidades y networking para llegar al primer empleo con experiencia real.", personas: ["luis-jimenez"] },
          { key: "d1_melody", hora: "02:35 PM — 02:45 PM", tipo: "cultural", titulo: "Acto cultural", desc: "Una pausa artística para dar dinamismo entre bloques.", personas: ["melody-coto"] },
          { key: "d1_panel", hora: "02:50 PM — 03:50 PM", tipo: "panel", titulo: "Women Who Outgrew the Plan", desc: "Panel con mujeres líderes de la industria sobre los giros de carrera, la resiliencia y cómo crecer más allá del plan inicial.", personas: ["pilar-sanchez", "wendy-badilla", "paula-brenes"] },
          { key: "d1_rifa2", hora: "03:50 PM — 03:55 PM", tipo: "rifa", titulo: "Retroalimentación y rifa", desc: "Compartí tu experiencia del bloque con el código QR y participá en la rifa.", personas: PRESENTADORES },
          { key: "d1_receso", hora: "03:55 PM — 04:05 PM", tipo: "receso", titulo: "Receso", desc: "Pausa corta antes del último bloque del día.", personas: ["organizacion-tob"] },
        ],
      },
      {
        key: "d1-productividad", titulo: "We don’t count the hours; we make the hours count", tituloKey: "prg_block_d1_3",
        sesiones: [
          { key: "d1_dinero", hora: "04:05 PM — 04:50 PM", tipo: "charla", titulo: "Tu dinero, tus decisiones", desc: "Fundamentos para empezar a invertir con criterio y construir una base financiera sólida.", personas: ["aaron-omodeo"] },
          { key: "d1_mercadeo", hora: "04:55 PM — 05:40 PM", tipo: "charla", titulo: "Mercadeo en la era digital", desc: "Estrategias para conectar con audiencias saturadas de contenido y destacar con una propuesta de valor clara.", personas: ["frank-calvo"] },
          { key: "d1_corto", hora: "05:45 PM — 05:55 PM", tipo: "cultural", titulo: "Acto cultural: Cortometraje", desc: "Proyección de un cortometraje como cierre artístico del bloque.", personas: ["randy-masis"] },
          { key: "d1_cv", hora: "06:00 PM — 06:30 PM", tipo: "charla", titulo: "Tu próximo sí empieza en el CV", desc: "Cómo estructurar un CV que destaque y prepararte para tu próxima entrevista.", personas: ["karla-fonseca"] },
          { key: "d1_cierre", hora: "06:35 PM — 06:45 PM", tipo: "cierre", titulo: "Cierre y rifa", desc: "Retroalimentación final, cierre oficial del día y la última rifa de la jornada.", personas: [...PRESENTADORES, "tiburon-martillo"] },
        ],
      },
    ],
  },
  {
    id: "day2",
    fecha: "Jueves 5 nov",
    fechaKey: "prg_day2_short",
    luma: "https://luma.com/da8149o8",
    bloques: [
      {
        key: "d2-optimizacion", titulo: "Keep it simple to keep the flow going", tituloKey: "prg_block_d2_1",
        sesiones: [
          { key: "d2_inicio", hora: "09:15 AM — 09:25 AM", tipo: "inauguracion", titulo: "Inicio del último día", desc: "Apertura de la segunda jornada del TOB 2026, enfocada en optimización, datos y tecnologías disruptivas.", personas: PRESENTADORES },
          { key: "d2_ruben", hora: "09:30 AM — 09:40 AM", tipo: "cultural", titulo: "Acto cultural", desc: "Presentación cultural para empezar el día con energía.", personas: ["ruben-monarca"] },
          { key: "d2_podcast", hora: "09:45 AM — 10:00 AM", tipo: "podcast", titulo: "Introducción al día", desc: "Formato podcast para presentar de forma dinámica los temas y objetivos del día.", personas: ["anthony-fuentes"] },
          { key: "d2_agile", hora: "10:05 AM — 10:50 AM", tipo: "charla", titulo: "The Art of Agile Simplicity: Maximizing Impact, Minimizing Complexity", desc: "Cómo las metodologías ágiles simplifican procesos, mejoran la colaboración y entregan más valor con menos complejidad.", personas: ["alejandro-hidalgo"] },
          { key: "d2_ai_engineer", hora: "10:55 AM — 11:40 AM", tipo: "foro", titulo: "De prompts sueltos a sistemas autónomos", desc: "El rol del AI Engineer: cómo se pasa de usar prompts aislados a diseñar agentes y sistemas que trabajan solos.", personas: ["alek-castillo"] },
          { key: "d2_rifa1", hora: "11:45 AM — 11:50 AM", tipo: "rifa", titulo: "Retroalimentación y rifa", desc: "Compartí tu experiencia del bloque con el código QR y participá en la rifa.", personas: PRESENTADORES },
          { key: "d2_almuerzo", hora: "12:00 PM — 12:55 PM", tipo: "receso", titulo: "Almuerzo", desc: "Receso para almorzar y hacer networking.", personas: ["organizacion-tob"] },
        ],
      },
      {
        key: "d2-datos", titulo: "Knowledge is power, but data is control", tituloKey: "prg_block_d2_2",
        sesiones: [
          { key: "d2_ciber", hora: "01:00 PM — 01:45 PM", tipo: "charla", titulo: "Ciberseguridad como oportunidad profesional", desc: "Amenazas actuales, buenas prácticas y por qué la ciberseguridad es una de las carreras con más demanda.", personas: ["alejandro-castaneda"] },
          { key: "d2_bi", hora: "01:45 PM — 02:15 PM", tipo: "charla", titulo: "BI: de los datos a las decisiones", desc: "Cómo el Business Intelligence transforma datos en información accionable para decidir mejor.", personas: ["rei-araya"] },
          { key: "d2_melissa", hora: "02:20 PM — 02:25 PM", tipo: "cultural", titulo: "Acto cultural", desc: "Una pausa artística para dar dinamismo entre charlas.", personas: ["melissa"] },
          { key: "d2_cloud", hora: "02:30 PM — 03:10 PM", tipo: "charla", titulo: "Cloud Computing", desc: "Cómo gestionar datos en la nube de forma segura y eficiente, y qué modelos cloud están cambiando a las empresas.", personas: ["wendy-badilla"] },
          { key: "d2_rifa2", hora: "03:10 PM — 03:15 PM", tipo: "rifa", titulo: "Retroalimentación y rifa", desc: "Compartí tu experiencia del bloque con el código QR y participá en la rifa.", personas: PRESENTADORES },
          { key: "d2_receso", hora: "03:15 PM — 03:20 PM", tipo: "receso", titulo: "Receso", desc: "Pausa corta antes del último bloque del evento.", personas: ["organizacion-tob"] },
        ],
      },
      {
        key: "d2-disruptivas", titulo: "The rules are being rewritten, and we’re holding the pen", tituloKey: "prg_block_d2_3",
        sesiones: [
          { key: "d2_blockchain", hora: "03:20 PM — 04:05 PM", tipo: "charla", titulo: "Rethinking the Problem: Innovación y Blockchain", desc: "Aplicaciones reales del blockchain más allá de las criptomonedas y cómo replantear problemas para innovar.", personas: ["karla-cordoba"] },
          { key: "d2_slinky", hora: "04:10 PM — 04:55 PM", tipo: "charla", titulo: "Slinky", desc: "Eleven.Core presenta Slinky. Muy pronto más detalles de esta charla.", personas: ["christopher-eleven"] },
          { key: "d2_efrain", hora: "05:00 PM — 05:10 PM", tipo: "cultural", titulo: "Acto cultural", desc: "Presentación cultural para cerrar el ciclo de charlas del día.", personas: ["efrain-bastos"] },
          { key: "d2_ia", hora: "05:15 PM — 06:00 PM", tipo: "charla", titulo: "AI smart solution, sustainable future", desc: "Cómo la inteligencia artificial puede crear soluciones inteligentes para un futuro más sostenible.", personas: ["ronald-arce"] },
          { key: "d2_cierre", hora: "06:05 PM — 06:15 PM", tipo: "cierre", titulo: "Cierre y rifa", desc: "Retroalimentación final, cierre oficial del evento y la última rifa del TOB 2026.", personas: PRESENTADORES },
        ],
      },
    ],
  },
];

// Sesiones del programa en las que participa una persona (para mostrarlas en /speakers).
export function sesionesDe(personaId: string) {
  return programa.flatMap((dia) =>
    dia.bloques.flatMap((bloque) =>
      bloque.sesiones.filter((s) => s.personas.includes(personaId)).map((sesion) => ({ dia, sesion }))
    )
  );
}
