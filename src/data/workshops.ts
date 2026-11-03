// Workshops del TOB 2026 — fuente única de datos de la página /workshops.
// Cambiar un horario, cupo o enlace = editar una línea acá.
// Los textos visibles también tienen su clave ws_<id>_* en public/lang.js (ES/EN).

/** Fecha de los workshops en formato ISO (AAAA-MM-DD). null = "Fecha por confirmar". */
export const WORKSHOPS_FECHA: string | null = "2026-11-06"; // viernes 6 nov

export type Workshop = {
  id: string;
  titulo: string;
  /** Empresa o aliado que imparte el workshop. */
  empresa: string;
  /** Ruta del logo; null = se muestra un placeholder con las iniciales. */
  logo: string | null;
  charlista?: string;
  lugar: string;
  /** 24 h, "13:00". */
  horaInicio: string;
  /** 24 h; null = hora de fin por confirmar. */
  horaFin: string | null;
  /** null = sin cupo definido (no se muestra el badge). */
  cupo: number | null;
  resumen: string;
  descripcion: string;
  nota?: string;
  /** La nota se destaca como badge (por ejemplo, "Llevar computadora"). */
  notaDestacada?: boolean;
  lumaUrl: string;
  estado: "abierto" | "proximamente";
  /** Color de acento apagado (misma paleta que los tracks del HackaToB). */
  accent: string;
  /** Contenido SVG del ícono (viewBox 0 0 24 24, trazo con currentColor). */
  icon: string;
};

// Íconos de línea, mismo estilo que los tracks del HackaToB
const ICONOS = {
  estrella: '<path d="M11 4.5l1.8 5.7 5.7 1.8-5.7 1.8L11 19.5l-1.8-5.7L3.5 12l5.7-1.8z"/><path d="M18.5 3.5v3.4M16.8 5.2h3.4"/>',
  chip: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M10 10h4v4h-4zM9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/>',
  pincel: '<path d="M18.4 2.6a2 2 0 0 1 2.9 2.9L12 14.8l-2.9-2.9z"/><path d="M9.1 11.9c-2.1 0-3.6 1.6-3.6 3.6 0 1.6-1.2 2.8-2.5 3.3 1 .9 2.5 1.4 4 1.4 3 0 5-2.1 5-5"/>',
  atomo: '<circle cx="12" cy="12" r="1.4"/><ellipse cx="12" cy="12" rx="9" ry="3.6"/><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)"/>',
  layout: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11"/><path d="M14 13l4 1.6-1.7.7-.7 1.7z"/>',
  datos: '<ellipse cx="12" cy="5.5" rx="7.5" ry="2.8"/><path d="M4.5 5.5v13c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8v-13"/><path d="M4.5 12c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8"/>',
};

const DESC_REMARKABLE =
  "I am Remarkable es un workshop enfocado en fortalecer la confianza, reconocer los propios logros y desarrollar la capacidad de comunicar el valor y las habilidades personales de manera efectiva. A través de una experiencia práctica y participativa, las personas asistentes podrán reflexionar sobre sus fortalezas, reconocer sus propios logros y trabajar en la forma en que comunican su experiencia tanto en contextos académicos como profesionales. Este workshop forma parte del Technology on Business 2026 — XV Edición y representa una oportunidad para complementar el aprendizaje técnico con herramientas para el desarrollo personal y profesional.";

const RESUMEN_REMARKABLE =
  "Fortalecé tu confianza, reconocé tus logros y aprendé a comunicar tu valor en contextos académicos y profesionales.";

export const workshops: Workshop[] = [
  {
    id: "remarkable-1",
    titulo: "I am Remarkable — Sesión 1",
    empresa: "Equifax",
    logo: "/imagenes/patrocinadores/logos/equifax.webp",
    charlista: "Ashely Quesada", // [CONFIRMAR ortografía]
    lugar: "TEC Emprende Lab",
    horaInicio: "08:00",
    horaFin: "09:30",
    cupo: 20,
    resumen: RESUMEN_REMARKABLE,
    descripcion: DESC_REMARKABLE,
    lumaUrl: "https://luma.com/t4d00lcd",
    accent: "#e0606b",
    icon: ICONOS.estrella,
    estado: "abierto",
  },
  {
    id: "ai",
    titulo: "Fundamentals of AI", // [CONFIRMAR título vs. descripción de automatización]
    empresa: "P&G",
    logo: "/imagenes/patrocinadores/logos/pg.webp",
    charlista: "Mario Rodríguez",
    lugar: "Laboratorio, TEC", // [CONFIRMAR cuál laboratorio]
    horaInicio: "09:30",
    horaFin: "11:30",
    cupo: 20,
    resumen: "Explorá el potencial de la automatización para optimizar tareas, procesos y formas de trabajo.",
    descripcion:
      "En este workshop exploraremos el potencial de la automatización y su aplicación para optimizar tareas, procesos y formas de trabajo. La actividad busca brindar a las personas participantes una experiencia práctica alrededor del uso de herramientas y enfoques de automatización, mostrando cómo estas tecnologías pueden contribuir a mejorar la eficiencia y generar nuevas oportunidades dentro de las organizaciones. El workshop forma parte del Technology on Business 2026 — XV Edición y estará a cargo de Mario Rodríguez, de P&G.",
    lumaUrl: "https://luma.com/ne6wjst2",
    accent: "#3d8fdc",
    icon: ICONOS.chip,
    estado: "abierto",
  },
  {
    id: "remarkable-2",
    titulo: "I am Remarkable — Sesión 2",
    empresa: "Equifax",
    logo: "/imagenes/patrocinadores/logos/equifax.webp",
    charlista: "Ashely Quesada", // [CONFIRMAR ortografía]
    lugar: "TEC Emprende Lab",
    horaInicio: "10:00",
    horaFin: "11:30", // [CONFIRMAR hora de fin]
    cupo: 20,
    resumen: RESUMEN_REMARKABLE,
    descripcion: DESC_REMARKABLE,
    lumaUrl: "https://luma.com/y8ee4fwx",
    accent: "#e0606b",
    icon: ICONOS.estrella,
    estado: "abierto",
  },
  {
    id: "pinta-terapia",
    titulo: "Pinta Terapia", // [CONFIRMAR "Pinta" o "Pinto"]
    empresa: "La Fábrica de Arte",
    logo: null, // falta: fabrica-arte.webp
    lugar: "Detrás de FEITEC",
    horaInicio: "13:00",
    horaFin: "16:30",
    cupo: null,
    resumen: "Un espacio creativo y participativo para explorar, compartir y desconectarte de la rutina.",
    descripcion:
      "Pinta Terapia será un espacio dentro del Technology on Business 2026 orientado a complementar la experiencia del evento mediante una actividad creativa y participativa. Durante la actividad, las personas participantes podrán disfrutar de un espacio diferente para explorar la creatividad, compartir y desconectarse de la rutina.",
    nota: "Más información próximamente.",
    lumaUrl: "https://luma.com/a3hdqmf0",
    accent: "#d9a35f",
    icon: ICONOS.pincel,
    estado: "proximamente",
  },
  {
    id: "cuantica",
    titulo: "Computación Cuántica",
    empresa: "IBM",
    logo: "/imagenes/patrocinadores/logos/ibm.webp",
    lugar: "TEC Emprende Lab",
    horaInicio: "13:00",
    horaFin: "14:30",
    cupo: 20,
    resumen: "Acercate a los conceptos y al potencial de la computación cuántica en el panorama tecnológico actual.",
    descripcion:
      "La computación cuántica representa una nueva forma de abordar problemas computacionales y abre posibilidades para el desarrollo de tecnologías y soluciones que pueden transformar diferentes industrias. En este workshop, las personas participantes tendrán la oportunidad de acercarse a los conceptos y posibilidades de la computación cuántica, explorando su relevancia y su potencial dentro del panorama tecnológico actual. Esta actividad forma parte del Technology on Business 2026 — XV Edición y cuenta con la participación de IBM.",
    nota: "Llevar computadora",
    notaDestacada: true,
    lumaUrl: "https://luma.com/f7raa07e",
    accent: "#9b8cd9",
    icon: ICONOS.atomo,
    estado: "abierto",
  },
  {
    id: "ux-ui",
    titulo: "Acelera que te contraten — UX/UI",
    empresa: "Casa 6",
    logo: null, // falta: casa6.webp / arte UX/UI
    lugar: "TEC Emprende Lab",
    horaInicio: "14:00",
    horaFin: "16:00",
    cupo: 40,
    resumen: "Descubrí los principios para diseñar experiencias digitales intuitivas y centradas en las personas.",
    descripcion:
      "En este workshop exploraremos conceptos relacionados con UX/UI (User Experience / User Interface) y la importancia de diseñar experiencias digitales centradas en las personas. La actividad busca acercar a las personas participantes a los principios que permiten crear productos y soluciones digitales más intuitivos, funcionales y orientados a las necesidades de sus usuarios. El workshop forma parte del Technology on Business 2026 — XV Edición y cuenta con la participación de Casa 6.",
    lumaUrl: "https://luma.com/ugak2ec7",
    accent: "#4fae8f",
    icon: ICONOS.layout,
    estado: "abierto",
  },
  {
    id: "sql",
    titulo: "SQL",
    empresa: "Moody's",
    logo: null, // falta: moodys.webp / arte SQL (hormiga ToB)
    lugar: "Laboratorio, TEC", // [CONFIRMAR cuál laboratorio]
    horaInicio: "15:00",
    horaFin: null, // [CONFIRMAR hora de fin]
    cupo: 30,
    resumen: "Aprendé a consultar y trabajar con datos de forma estructurada en una experiencia práctica.",
    descripcion:
      "SQL es una herramienta fundamental para trabajar con datos y consultar información almacenada en bases de datos. En este workshop, las personas participantes tendrán la oportunidad de acercarse al uso de SQL mediante una experiencia práctica orientada a comprender cómo realizar consultas y trabajar con información de manera estructurada. La actividad forma parte del Technology on Business 2026 — XV Edición y cuenta con la participación de Moody's.",
    lumaUrl: "https://luma.com/4z84p5mo",
    accent: "#f1f4fa",
    icon: ICONOS.datos,
    estado: "abierto",
  },
];

// ── Formato de horas ──────────────────────────────────────
const parte = (h: string) => {
  const [hh, mm] = h.split(":").map(Number);
  return { h12: `${hh % 12 || 12}:${String(mm).padStart(2, "0")}`, pm: hh >= 12 };
};

/** "8:00 – 9:30 a. m." o "11:00 a. m. – 1:00 p. m."; sufijos según idioma. */
export function rangoHora(inicio: string, fin: string | null, lang: "es" | "en" = "es") {
  const suf = (pm: boolean) => (lang === "en" ? (pm ? "p.m." : "a.m.") : pm ? "p. m." : "a. m.");
  const a = parte(inicio);
  if (!fin) return `${a.h12} ${suf(a.pm)}`;
  const b = parte(fin);
  return a.pm === b.pm ? `${a.h12} – ${b.h12} ${suf(b.pm)}` : `${a.h12} ${suf(a.pm)} – ${b.h12} ${suf(b.pm)}`;
}

export const esManana = (w: Workshop) => w.horaInicio < "12:00";
