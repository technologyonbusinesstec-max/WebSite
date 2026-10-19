// Tracks del HackaToB: los comparten el frame "Cuatro tracks" de /hackatob y la página /hackatob/tracks.
// Los textos en inglés van en public/lang.js con las claves hack_tr_<key>_name / _area / _text
// y, para el detalle de /hackatob/tracks, hack_tr_<key>_challenge / _idea1.._idea3 / _note.

export interface Track {
  /** Identificador: ancla en /hackatob/tracks (#green) y parte de las claves de traducción */
  key: string;
  name: string;
  area: string;
  text: string;
  /** Color de acento (apagado, para no competir con el azul del sitio) */
  accent: string;
  /** Contenido SVG del icono (viewBox 0 0 24 24, trazo con currentColor) */
  icon: string;
  /** Detalle (solo en /hackatob/tracks): el reto, algunas ideas y una nota "Tené en cuenta" */
  challenge: string;
  ideas: string[];
  note: string;
}

/** Página donde se detalla cada track; "Ver track" siempre lleva aquí */
export const TRACKS_PAGE = '/hackatob/tracks';

export const tracks: Track[] = [
  {
    key: 'green',
    name: 'GreenTrack',
    area: 'Ambiente',
    text: 'Cuidá la naturaleza, reducí residuos y aprovechá mejor los recursos.',
    accent: '#4fae8f',
    icon: '<path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14"/><path d="M5 19c2-5 5-8 9-10"/>',
    challenge: 'Desarrollá un prototipo que ayude a reducir el impacto ambiental en tu comunidad, tu universidad o tu hogar.',
    ideas: [
      'Una herramienta para facilitar el reciclaje y la correcta separación de residuos',
      'Un sistema para visualizar y reducir el consumo de agua o energía',
      'Una solución que promueva el turismo sostenible y la conservación',
    ],
    note: 'No buscamos un producto terminado. Una idea clara con un prototipo funcional es un excelente resultado.',
  },
  {
    key: 'fin',
    name: 'FinTrack',
    area: 'Finanzas',
    text: 'Facilitá el ahorro, los pagos y la gestión financiera.',
    accent: '#3d8fdc',
    icon: '<circle cx="12" cy="12" r="8.5"/><path d="M14.6 9.3c-.6-.8-1.500-1.300-2.700-1.300-1.500 0-2.600.8-2.600 2s1 1.700 2.700 2 2.700.9 2.700 2.100-1.100 2-2.700 2c-1.200 0-2.200-.5-2.800-1.300"/><path d="M12 6.200V8M12 16.100v1.700"/>',
    challenge: 'Creá una solución que haga más simple el ahorro, los pagos o la gestión financiera de personas y pequeños negocios.',
    ideas: [
      'Una herramienta para organizar gastos y planificar el presupuesto mensual',
      'Un sistema para que emprendimientos lleven control de ventas, cobros o inventario',
      'Una forma práctica y entretenida de aprender educación financiera',
    ],
    note: 'No necesitás experiencia en finanzas. Entender bien el problema es el mejor punto de partida.',
  },
  {
    key: 'health',
    name: 'HealthTrack',
    area: 'Salud y bienestar',
    text: 'Mejorá la prevención, el bienestar y el acceso a información y servicios.',
    accent: '#e0606b',
    icon: '<path d="M12 20s-7.500-4.600-7.500-10A4.300 4.300 0 0 1 12 7.500 4.300 4.300 0 0 1 19.500 10c0 5.400-7.500 10-7.500 10z"/><path d="M6.500 12.500h3l1.300-2.500 2 4.500 1.200-2h3.500"/>',
    challenge: 'Diseñá un prototipo que mejore la prevención, el bienestar o el acceso a servicios de salud.',
    ideas: [
      'Una aplicación para dar seguimiento a hábitos saludables, citas o tratamientos',
      'Una herramienta de apoyo al bienestar emocional de estudiantes',
      'Una plataforma que facilite el acceso a información de salud confiable',
    ],
    note: 'No es necesario venir del área de salud. Muchas de las mejores soluciones nacen de experiencias cotidianas.',
  },
  {
    key: 'next',
    name: 'The Next Big Thing',
    area: 'Tema abierto',
    text: 'Resolvé un problema de cualquier sector con tecnología.',
    accent: '#f1f4fa',
    icon: '<path d="M11 4.500l1.800 5.700 5.700 1.800-5.700 1.800L11 19.500l-1.800-5.700L3.500 12l5.700-1.800z"/><path d="M18.500 3.500v3.400M16.800 5.200h3.400"/>',
    challenge: 'Identificá un problema real en cualquier sector y proponé una solución tecnológica innovadora.',
    ideas: [
      'Soluciones para educación, movilidad, agricultura, cultura o comercio',
      'Automatización de procesos que hoy se realizan de forma manual',
      'Aplicaciones creativas de inteligencia artificial, datos o IoT',
    ],
    note: 'Este track está abierto a todo nivel de experiencia. Lo importante es aprender, colaborar y construir algo con impacto.',
  },
];
