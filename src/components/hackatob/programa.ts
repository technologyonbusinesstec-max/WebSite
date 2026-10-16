// Programa del HackaToB (2–6 nov 2026, hora de Costa Rica, UTC−6). Lo comparten el frame "Programa"
// de /hackatob (línea de planetas) y la página /hackatob/programa (detalle completo).

export interface Sprint {
  /** 01–04: solo hay cuatro sprints; la preparación del lunes y el Demo Day no son sprints */
  num: string;
  title: string;
  text: string;
  result: string;
  /** Aclaración bajo el sprint */
  note?: string;
}

export interface Day {
  /** Identificador: ancla en /hackatob/programa (#lun) y parte de las claves de traducción */
  key: string;
  /** Etiqueta corta sobre el planeta */
  short: string;
  date: string;
  name: string;
  mode: 'Presencial' | 'Remoto';
  venue?: string;
  hours?: string;
  text: string;
  /** Segunda línea de descripción */
  extra?: string;
  /** Actividades del día, en un desplegable */
  activities?: string[];
  sprints?: Sprint[];
  /** Reunión del día: va en una franja destacada */
  meeting?: { time: string; label: string };
  /** Las conferencias ToB ocurren en paralelo ese día */
  tobParallel?: boolean;
  /** Planeta del día: colores (luz / sombra), tamaño relativo y anillo. Las lunas salen de los sprints. */
  planet: { light: string; dark: string; scale: number; ring?: boolean };
}

/** Página con el programa completo; cada planeta lleva a su día */
export const PROGRAMA_PAGE = '/hackatob/programa';

export const days: Day[] = [
  {
    key: 'lun',
    short: 'LUN 2',
    date: 'Lunes 2 de noviembre',
    name: 'Thinking Ahead',
    mode: 'Presencial',
    venue: 'EmprendeLab',
    hours: '9:00 a. m.–6:00 p. m.',
    text: 'Talleres, presentación de tracks e integración para formar tu equipo.',
    activities: [
      'Propiedad intelectual y propuesta de valor',
      'UX/UI',
      'Herramientas de desarrollo e IA aplicada',
      'Preparación del pitch',
      'Integración',
      'Dinámicas y rifas',
    ],
    planet: { light: '#5fa3e6', dark: '#0a4f8c', scale: 0.86 },
  },
  {
    key: 'mar',
    short: 'MAR 3',
    date: 'Martes 3 de noviembre',
    name: 'Build Day',
    mode: 'Presencial',
    venue: 'EmprendeLab',
    hours: '9:00 a. m.–3:00 p. m.',
    text: 'Empezá a construir con mentoría presencial y revisión de avances.',
    sprints: [
      {
        num: '01',
        title: 'Encontrá el reto',
        text: 'Definí el problema, el usuario, la evidencia inicial y la propuesta de valor.',
        result: 'Reto y alcance definidos, con responsabilidades del equipo.',
      },
      {
        num: '02',
        title: 'Dale forma',
        text: 'Construí una primera versión con un recorrido que pueda probarse.',
        result: 'Prototipo inicial y registro de lo que funciona y lo que falta.',
      },
    ],
    planet: { light: '#aab8d2', dark: '#3b4763', scale: 1 },
  },
  {
    key: 'mie',
    short: 'MIÉ 4',
    date: 'Miércoles 4 de noviembre',
    name: 'Development Day I',
    mode: 'Remoto',
    text: 'Desarrollo autónomo.',
    sprints: [
      {
        num: '03',
        title: 'Probá y mejorá',
        text: 'Probá el prototipo, registrá aprendizajes y aplicá mejoras.',
        result: 'Evidencia de pruebas, cambios y próximos pasos.',
        note: 'Este sprint continúa el jueves antes del cierre.',
      },
    ],
    meeting: { time: '7:00 p. m.', label: 'Reunión obligatoria de seguimiento.' },
    tobParallel: true,
    planet: { light: '#6fa8e8', dark: '#1b6fc2', scale: 0.8 },
  },
  {
    key: 'jue',
    short: 'JUE 5',
    date: 'Jueves 5 de noviembre',
    name: 'Development Day II',
    mode: 'Remoto',
    text: 'Desarrollo autónomo.',
    extra: 'Completá las mejoras del sprint 03 y prepará la entrega final.',
    sprints: [
      {
        num: '04',
        title: 'Mostrá su valor',
        text: 'Finalizá el prototipo, completá la entrega y ensayá la presentación.',
        result: 'Entrega registrada y demostración preparada.',
      },
    ],
    meeting: { time: '7:00 p. m.', label: 'Reunión obligatoria de cierre.' },
    tobParallel: true,
    planet: { light: '#8fb0de', dark: '#2a5fa8', scale: 0.8 },
  },
  {
    key: 'vie',
    short: 'VIE 6',
    date: 'Viernes 6 de noviembre',
    name: 'Demo Day',
    mode: 'Presencial',
    venue: 'Auditorio D3',
    hours: '8:00 a. m.–1:00 p. m.',
    text: 'Presentación ante el jurado y premiación de los tres mejores proyectos globales.',
    planet: { light: '#f1f4fa', dark: '#6f8fc0', scale: 1.12, ring: true },
  },
];
