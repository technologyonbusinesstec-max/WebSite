// Patrocinadores y partners del TOB 2026: los usan /sponsors (por categorías) y el carrusel del inicio.
// Logos en public/imagenes/patrocinadores/logos/ (fondo transparente, recortados).
// mono: el logo es oscuro y no se leería sobre el fondo del sitio, así que se muestra en blanco.
// Sin logo no se muestran (quedan acá para sumarlos apenas llegue el logo); sin url la celda no es un enlace.

export type Patrocinador = {
  nombre: string;
  logo?: string;
  url?: string;
  mono?: boolean;
  /** Easter egg: no es un sponsor de verdad; toma color y se menea al pasarle el mouse. No sale en el carrusel del inicio. */
  egg?: boolean;
};

export type Categoria = {
  key: string;
  /** Etiqueta del grupo (y su clave de traducción en public/lang.js) */
  label: { es: string; key: string };
  /** columnas de la cuadrícula en escritorio */
  cols: number;
  items: Patrocinador[];
};

const LOGOS = "/imagenes/patrocinadores/logos";

export const categorias: Categoria[] = [
  {
    key: "patrocinadores",
    label: { es: "Patrocinadores", key: "tob_sp_tier_main" },
    cols: 4,
    items: [
      { nombre: "P&G", logo: `${LOGOS}/pg.webp`, url: "https://us.pg.com" },
      { nombre: "INCAE", logo: `${LOGOS}/incae.svg`, url: "https://www.incae.edu" },
      { nombre: "CR TECH", logo: `${LOGOS}/crtech.webp`, url: "https://crtechstore.com" },
      { nombre: "Artemis", logo: `${LOGOS}/artemis.webp`, url: "https://www.artemis.money", mono: true },
      { nombre: "World Wide Technology", logo: `${LOGOS}/wwt.webp`, url: "https://www.wwt.com" },
      { nombre: "Dojo Coding", logo: `${LOGOS}/dojo-coding.webp`, url: "https://dojocoding.io" },
      { nombre: "Grupo Oroz" },
      { nombre: "Skyline Canopy Tour" },
      { nombre: "Rainforest Adventures", logo: `${LOGOS}/rainforest.webp`, url: "https://www.rainforestadventure.com" },
      { nombre: "FK Store" },
      { nombre: "CENTIC", logo: `${LOGOS}/centic.webp`, url: "https://centicsas.com.co", mono: true },
      { nombre: "Asetec", logo: `${LOGOS}/asetec.webp`, url: "https://aseteccr.com" },
      { nombre: "GYM TEC", logo: `${LOGOS}/gym-tec.webp`, url: "https://gymasetec.com" },
      { nombre: "La Fábrica del Arte" },
    ],
  },
  {
    key: "partners",
    label: { es: "Partners", key: "tob_sp_tier_partners" },
    cols: 4,
    items: [
      { nombre: "XYZ" },
      { nombre: "IBM", logo: `${LOGOS}/ibm.webp`, url: "https://www.ibm.com" },
      { nombre: "Arroyo Vargas", logo: `${LOGOS}/arroyo-vargas.webp`, url: "https://arroyovargas.com", mono: true },
      { nombre: "Doji Club", logo: `${LOGOS}/doji-club.webp`, url: "https://www.instagram.com/somosdoji/", mono: true },
      { nombre: "Muris" },
      { nombre: "Avify", logo: `${LOGOS}/avify.webp`, url: "https://avify.com" },
      { nombre: "Women at Microsoft", logo: `${LOGOS}/women-microsoft.webp`, url: "https://www.linkedin.com/company/microsoft/" },
      { nombre: "Equifax", logo: `${LOGOS}/equifax.webp`, url: "https://www.equifax.com" },
      { nombre: "GrantFox", logo: `${LOGOS}/grantfox.webp`, url: "https://grantfox.xyz" },
      { nombre: "Lyfter", logo: `${LOGOS}/lyfter.webp`, url: "https://www.lyfter.academy", mono: true },
      { nombre: "Aso Blockchain CR", logo: `${LOGOS}/aso-blockchain.webp`, url: "https://asoblockchain.org", mono: true },
      { nombre: "CofiBlocks" },
      { nombre: "Casa Seis", url: "https://www.instagram.com/casa6.lab/" },
      { nombre: "TEC EmprendeLab", logo: `${LOGOS}/emprendelab.webp`, url: "https://www.tec.ac.cr/tec-emprende-lab", mono: true },
      { nombre: "Tiburón Martillo", logo: "/imagenes/mascotas/tiburon-martillo.webp", egg: true },
    ],
  },
];

/** Los que tienen logo, para el carrusel del inicio. */
export const conLogo = (key: string) =>
  (categorias.find((c) => c.key === key)?.items ?? []).filter((p) => p.logo && !p.egg);
