// Sponsors del HackaToB: los usa la página /hackatob/sponsors.
// Los logos se ven en blanco y negro y toman su color al pasar el mouse; cada uno lleva a la página oficial.
// Los grupos salen de cómo estaban en la versión anterior del sitio: patrocinadores y aliados.

export interface Sponsor {
  name: string;
  logo: string;
  url: string;
}

export interface SponsorTier {
  key: string;
  /** Etiqueta del grupo (y su clave de traducción) */
  label: { es: string; key: string };
  /** columnas de la cuadrícula en escritorio */
  cols: number;
  sponsors: Sponsor[];
}

export const sponsorTiers: SponsorTier[] = [
  {
    key: 'patrocinadores',
    label: { es: 'Patrocinadores', key: 'hack_sp_tier_main' },
    cols: 1,
    sponsors: [
      { name: 'World Wide Technology', logo: '/imagenes/hackatob/partner02.webp', url: 'https://www.wwt.com' },
      { name: 'Rainforest Adventures', logo: '/imagenes/hackatob/partner06.webp', url: 'https://www.rainforestadventure.com' },
    ],
  },
  {
    key: 'aliados',
    label: { es: 'Aliados', key: 'hack_sp_tier_allies' },
    cols: 3,
    sponsors: [
      { name: 'TEC EmprendeLab', logo: '/imagenes/hackatob/partner01.webp', url: 'https://www.instagram.com/tecemprendelab/' },
      { name: 'ATI · TEC', logo: '/imagenes/hackatob/partner03.webp', url: 'https://www.tec.ac.cr/administracion-tecnologia-informacion' },
      { name: 'asetec', logo: '/imagenes/hackatob/partner04.webp', url: 'https://aseteccr.com/' },
    ],
  },
];
