// Mentores y jurados del HackaToB: los usan la sección "Mentores y jurados" de /hackatob (3 de cada uno)
// y la página /hackatob/mentores (6 de cada uno, separados).
// Mientras no estén confirmados, cada lugar muestra la silueta de reemplazo y "Por anunciar".
// Para anunciar a alguien: poner su foto en public/imagenes/hackatob/mentores/ y llenar sus datos en la lista
// (con nombre real ya no usa los textos de "Por anunciar"; el inglés de su puesto y bio va en public/lang.js
// con las claves hack_mt_<NN>_role / _bio para mentores y hack_jd_<NN>_role / _bio para jurados).

export interface Person {
  foto: string;
  nombre: string;
  puesto: string;
  descripcion: string;
  linkedin?: string;
  instagram?: string;
}

export const PERSON_PLACEHOLDER = '/imagenes/hackatob/mentores/placeholder.svg';

/** Página con todos los mentores y jurados */
export const MENTORES_PAGE = '/hackatob/mentores';

/** Cuántos de cada grupo se ven en /hackatob */
export const SHOWN_IN_HOME = 3;

/** Lugar vacío, a la espera de una persona confirmada */
const porAnunciar = (): Person => ({ foto: PERSON_PLACEHOLDER, nombre: '', puesto: '', descripcion: '' });

const FOTOS = '/imagenes/hackatob/mentores';

export const mentores: Person[] = [
  {
    foto: `${FOTOS}/brayan-navarro.webp`,
    nombre: 'Brayan Navarro',
    puesto: 'Mentor · Shape the Value',
    descripcion: 'Da el taller «Shape the Value» del Thinking Ahead: cómo encontrar y comunicar la propuesta de valor de tu proyecto.',
  },
  {
    foto: `${FOTOS}/mariano-ulloa.webp`,
    nombre: 'Mariano Ulloa',
    puesto: 'Mentor · Dojo Coding',
    descripcion: 'Da el taller «Tips and Tricks to Survive My First Hackathon»: consejos para trabajar en equipo y aprovechar el ritmo de un hackathon.',
  },
  {
    foto: `${FOTOS}/daniel-bejarano.webp`,
    nombre: 'Daniel Bejarano',
    puesto: 'Mentor · Dojo Coding',
    descripcion: 'Da el taller «Tools to Build» del Thinking Ahead: las herramientas para pasar de la idea al prototipo.',
  },
  {
    foto: `${FOTOS}/gustavo-machado.webp`,
    nombre: 'Gustavo Machado',
    puesto: 'Mentor · Pitch',
    descripcion: 'Da el taller «Pitch It. Sell It.»: cómo contar tu proyecto con storytelling y venderlo en pocos minutos.',
  },
  {
    foto: `${FOTOS}/stefan-fiedler.webp`,
    nombre: 'Stefan Fiedler',
    puesto: 'Mentor · GreenTrack',
    descripcion: 'Acompaña a los equipos del GreenTrack, el reto de soluciones para cuidar el ambiente.',
  },
];
export const jurados: Person[] = Array.from({ length: 6 }, porAnunciar);

/** Textos de un lugar vacío, por grupo (y sus claves de traducción) */
const TBA = {
  name: { es: 'Por anunciar', key: 'hack_mt_tba_name' },
  mentor: {
    role: { es: 'Mentor/a', key: 'hack_mt_tba_role' },
    bio: { es: 'Muy pronto anunciaremos a quien acompañará a los equipos desde aquí.', key: 'hack_mt_tba_bio' },
  },
  jurado: {
    role: { es: 'Jurado', key: 'hack_jd_tba_role' },
    bio: { es: 'Muy pronto anunciaremos a quien evaluará los proyectos en el Demo Day.', key: 'hack_jd_tba_bio' },
  },
};

/** Datos listos para mostrar: con los textos de "Por anunciar" donde todavía no hay nadie */
const toCards = (list: Person[], group: 'mentor' | 'jurado', idOffset: number) => {
  const prefix = group === 'mentor' ? 'hack_mt' : 'hack_jd';
  return list.map((p, i) => {
    const id = String(i + 1).padStart(2, '0');
    const tba = !p.nombre;
    return {
      id: idOffset + i + 1,
      foto: p.foto || PERSON_PLACEHOLDER,
      name: tba ? TBA.name.es : p.nombre,
      role: tba ? TBA[group].role.es : p.puesto,
      bio: tba ? TBA[group].bio.es : p.descripcion,
      nameKey: tba ? TBA.name.key : `${prefix}_${id}_name`,
      roleKey: tba ? TBA[group].role.key : `${prefix}_${id}_role`,
      bioKey: tba ? TBA[group].bio.key : `${prefix}_${id}_bio`,
      linkedin: p.linkedin || '',
      instagram: p.instagram || '',
    };
  });
};

export const mentorCards = toCards(mentores, 'mentor', 0);
export const juradoCards = toCards(jurados, 'jurado', 100);
