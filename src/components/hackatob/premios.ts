// Premios del HackaToB: los usa el frame "Premios" (id: premios) de /hackatob.
// Cada premio se muestra como un pase de abordar; los campos del boleto salen del copy, sin inventar datos
// (nada de fechas, horas, puertas, asientos, vigencias, precios ni números de serie).
// Los textos en inglés van en public/lang.js con las claves hack_pz_<place>_* y hack_pz_t_*.

export interface Prize {
  /** Puesto: 1, 2 o 3 (también el orden en el código y en móvil) */
  place: 1 | 2 | 3;
  rank: string;
  /** Copy textual completo (lo leen los lectores de pantalla) */
  text: string;
  /** Campos del boleto */
  qty: string;
  type: { es: string; key: string };
  destination: { es: string; key: string };
  includes?: { es: string; key: string };
  /** EMITIDO POR: nombre del patrocinador */
  issuer: string;
  /** Color del talón */
  metal: 'accent' | 'silver' | 'bronze';
}

const skyline = { es: 'Skyline · Grupo Oroz', key: 'hack_pz_t_dest_skyline' };
const tickets = { es: 'Entradas', key: 'hack_pz_t_type_single' };

export const prizes: Prize[] = [
  {
    place: 1,
    rank: '1.er lugar',
    text: '4 entradas al tour 5 en 1 de Rainforest Adventures, con teleférico y canopy.',
    qty: '4',
    type: tickets,
    destination: { es: 'Tour 5 en 1 · Rainforest Adventures', key: 'hack_pz_t_dest_1' },
    includes: { es: 'Teleférico · Canopy', key: 'hack_pz_t_incl_1' },
    issuer: 'Rainforest Adventures',
    metal: 'accent',
  },
  {
    place: 2,
    rank: '2.º lugar',
    text: '4 entradas a Skyline, Grupo Oroz.',
    qty: '4',
    type: tickets,
    destination: skyline,
    issuer: 'Grupo Oroz',
    metal: 'silver',
  },
  {
    place: 3,
    rank: '3.er lugar',
    text: '4 entradas a Skyline, Grupo Oroz.',
    qty: '4',
    type: tickets,
    destination: skyline,
    issuer: 'Grupo Oroz',
    metal: 'bronze',
  },
];
