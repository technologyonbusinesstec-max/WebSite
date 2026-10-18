import { Quaternion, Vector3 } from "three";

/** Centro de las Artes, TEC, Cartago */
export const TEC_CARTAGO = {
  lat: 9.856,
  lon: -83.911,
};

/** Vista inicial / zoom: istmo centrado, un poco al este del pin. */
export const TEC_LOOK = {
  lat: 10.15,
  lon: -79.4,
};

const DEG = Math.PI / 180;
/**
 * La textura actual (NASA Blue Marble) es equirectangular estándar,
 * por lo que no necesita corrección respecto a los UVs de SphereGeometry.
 */
const TEXTURE_LON_SHIFT = 0;
const TEXTURE_LAT_SHIFT = 0;
const _from = new Vector3();
const _to = new Vector3(0, 0, 1);
const _up = new Vector3();
const _qAlign = new Quaternion();
const _qRoll = new Quaternion();

/**
 * Three.js SphereGeometry maps an equirectangular texture so that
 * u = 0 is longitude −180° (−X) and longitude 0° (Greenwich) sits on +X.
 * The camera looks from +Z, so a −90° yaw puts Greenwich in front.
 */
export function latLonToEarthRotation(lat: number, lon: number) {
  return {
    x: (lat + TEXTURE_LAT_SHIFT) * DEG,
    y: -((lon + TEXTURE_LON_SHIFT) * DEG) - Math.PI / 2,
  };
}

/**
 * Surface point matching SphereGeometry vertices:
 * x = −r sinθ cosφ, y = r cosθ, z = r sinθ sinφ
 * with φ = (lon + 180)°, θ = (90 − lat)°.
 */
export function latLonToVector3(lat: number, lon: number, radius: number) {
  const theta = (90 - (lat + TEXTURE_LAT_SHIFT)) * DEG;
  const phi = (lon + TEXTURE_LON_SHIFT + 180) * DEG;
  const ring = radius * Math.sin(theta);
  return new Vector3(-ring * Math.cos(phi), radius * Math.cos(theta), ring * Math.sin(phi));
}

/** Shortest signed delta so GSAP never spins the long way around. */
export function shortestAngle(from: number, to: number) {
  const twoPi = Math.PI * 2;
  let delta = ((to - from) % twoPi + twoPi) % twoPi;
  if (delta > Math.PI) delta -= twoPi;
  return from + delta;
}

/** Quaternion that puts a lat/lon on +Z, keeping north as upright as possible. */
export function latLonToFacingQuaternion(lat: number, lon: number) {
  _from.copy(latLonToVector3(lat, lon, 1)).normalize();
  _qAlign.setFromUnitVectors(_from, _to);
  _up.set(0, 1, 0).applyQuaternion(_qAlign);
  _qRoll.setFromAxisAngle(_to, -Math.atan2(_up.x, _up.y));
  return _qRoll.clone().multiply(_qAlign);
}
