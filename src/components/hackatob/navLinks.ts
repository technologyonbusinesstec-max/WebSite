// Enlaces de sección del HackaToB: los comparten el navbar y el footer.

export interface NavLink {
  href: string;
  label: string;
  /** Contenido SVG del icono (viewBox 0 0 24 24, trazo con currentColor) para la barra de tabs */
  icon: string;
  /** Clave de traducción de la etiqueta (public/lang.js) */
  i18n?: string;
  /** Enlace destacado: amarillo */
  featured?: boolean;
}

export const hackatobLinks: NavLink[] = [
  {
    href: '/hackatob/tracks', // página propia, no una sección de /hackatob
    label: 'Tracks',
    i18n: 'hack_nav_tracks',
    icon: '<path d="M12 4 3.5 8.5 12 13l8.5-4.5z"/><path d="m3.5 12.5 8.5 4.5 8.5-4.5"/><path d="m3.5 16.5 8.5 4.5 8.5-4.5"/>',
  },
  {
    href: '#programa',
    label: 'Agenda',
    i18n: 'hack_nav_agenda',
    icon: '<rect x="4" y="5.5" width="16" height="14.5" rx="2.5"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/>',
    featured: true,
  },
  {
    href: '#premios',
    label: 'Premios',
    i18n: 'hack_nav_premios',
    icon: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 5.5H5.5a2.5 2.5 0 0 0 2.6 3.9M16 5.5h2.5a2.5 2.5 0 0 1-2.6 3.9"/><path d="M12 13v4M10 17h4M9 20h6"/>',
  },
  {
    href: '#sponsors',
    label: 'Sponsors',
    i18n: 'hack_nav_sponsors',
    icon: '<path d="M7 4h10l4 5.5L12 20.5 3 9.5z"/><path d="M3 9.5h18M9.5 4 8 9.5l4 11 4-11L14.5 4"/>',
  },
];

/** Antepone la ruta base a las anclas (#seccion) para enlazarlas desde otra página. */
export const withBase = (href: string, basePath = '') => (href.startsWith('#') ? basePath + href : href);
