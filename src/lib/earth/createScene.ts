import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  AmbientLight,
  BackSide,
  BufferGeometry,
  Color,
  DirectionalLight,
  Float32BufferAttribute,
  Group,
  LinearFilter,
  LinearMipmapLinearFilter,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  Object3D,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  SRGBColorSpace,
  TextureLoader,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { latLonToFacingQuaternion, latLonToVector3, TEC_CARTAGO, TEC_LOOK } from "./coordinates";

export const EARTH_RADIUS = 1;
const TEXTURE_BASE = "/imagenes/Ubicacion/earth";

export type EarthScene = {
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  earthGroup: Group;
  cloudMesh: Mesh;
  pinAnchor: Object3D;
  sunDirection: Vector3;
  fitCamera: () => void;
  getHomeZ: () => number;
  dispose: () => void;
};

export function createEarthScene(canvas: HTMLCanvasElement): EarthScene {
  const scene = new Scene();
  const camera = new PerspectiveCamera(45, 1, 0.08, 100);
  camera.position.set(0, 0, 3.4);

  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(Math.max(window.devicePixelRatio || 1, 2), 3));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.45;

  const sunDirection = new Vector3(0.35, 0.22, 1).normalize();
  const sun = new DirectionalLight(0xfff1dc, 4.2);
  sun.position.copy(sunDirection).multiplyScalar(8);
  scene.add(sun);

  const fill = new DirectionalLight(0x5f7fb0, 0.9);
  fill.position.set(-2.4, -0.4, 0.6);
  scene.add(fill);
  scene.add(new AmbientLight(0x9aa9c4, 0.75));

  const loader = new TextureLoader();
  const colorMap = loader.load(`${TEXTURE_BASE}/earth_color.jpg`);
  colorMap.colorSpace = SRGBColorSpace;
  const normalMap = loader.load(`${TEXTURE_BASE}/earth_normal.jpg`);
  const specularMap = loader.load(`${TEXTURE_BASE}/earth_specular.jpg`);
  const earthGroup = new Group();
  earthGroup.quaternion.copy(latLonToFacingQuaternion(TEC_LOOK.lat, TEC_LOOK.lon));
  scene.add(earthGroup);

  const geometry = new SphereGeometry(EARTH_RADIUS, 192, 192);
  const earthMaterial = new MeshPhongMaterial({
    map: colorMap,
    normalMap,
    normalScale: new Vector2(0.85, 0.85),
    specularMap,
    specular: new Color(0x222833),
    shininess: 18,
  });
  // Aclara y satura el océano usando el mapa especular (blanco = agua).
  earthMaterial.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <map_fragment>",
      `#include <map_fragment>
      float waterMask = texture2D(specularMap, vSpecularMapUv).r;
      vec3 lifted = pow(diffuseColor.rgb, vec3(0.8)) * vec3(0.85, 0.95, 1.12);
      diffuseColor.rgb = mix(diffuseColor.rgb, lifted, waterMask * 0.7);`
    );
  };
  earthGroup.add(new Mesh(geometry, earthMaterial));

  // Nubes desactivadas: mesh vacío para mantener compatible el controlador.
  const cloudMesh = new Mesh();

  const pinAnchor = new Object3D();
  pinAnchor.position.copy(latLonToVector3(TEC_CARTAGO.lat, TEC_CARTAGO.lon, EARTH_RADIUS * 1.018));
  pinAnchor.visible = false;
  pinAnchor.add(
    new Mesh(
      new SphereGeometry(0.007, 12, 12),
      new MeshBasicMaterial({ color: 0x21d0ff })
    )
  );
  earthGroup.add(pinAnchor);

  // Halo que sigue al planeta: el brillo nace del limbo, no de un fondo plano.
  const atmosphere = new Mesh(
    new SphereGeometry(EARTH_RADIUS * 1.04, 64, 64),
    new ShaderMaterial({
      uniforms: { glowColor: { value: new Color(0x2f7ec4) } },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        uniform vec3 glowColor;
        void main() {
          float rim = pow(clamp(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0, 1.0), 6.5);
          gl_FragColor = vec4(glowColor, rim * 0.2);
        }
      `,
      side: BackSide,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      toneMapped: false,
    })
  );
  scene.add(atmosphere);

  const starCount = 1100;
  const starPositions = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const radius = 14 + Math.random() * 36;
    const theta = Math.acos(2 * Math.random() - 1);
    const phi = Math.random() * Math.PI * 2;
    const sinT = Math.sin(theta);
    starPositions[i * 3] = radius * sinT * Math.cos(phi);
    starPositions[i * 3 + 1] = radius * sinT * Math.sin(phi);
    starPositions[i * 3 + 2] = radius * Math.cos(theta);
    const cool = Math.random();
    const bright = 0.55 + Math.random() * 0.45;
    starColors[i * 3] = bright * (cool > 0.82 ? 0.75 : 1);
    starColors[i * 3 + 1] = bright * (cool > 0.82 ? 0.86 : 1);
    starColors[i * 3 + 2] = bright;
  }
  const starGeometry = new BufferGeometry();
  starGeometry.setAttribute("position", new Float32BufferAttribute(starPositions, 3));
  starGeometry.setAttribute("color", new Float32BufferAttribute(starColors, 3));
  const starMaterial = new PointsMaterial({
    size: 0.045,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    blending: AdditiveBlending,
    toneMapped: false,
  });
  scene.add(new Points(starGeometry, starMaterial));

  const textures = [colorMap, normalMap, specularMap];
  const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
  textures.forEach((texture) => {
    texture.anisotropy = maxAnisotropy;
    texture.generateMipmaps = true;
    texture.minFilter = LinearMipmapLinearFilter;
    texture.magFilter = LinearFilter;
    texture.needsUpdate = true;
  });
  let homeZ = 3.4;

  const fitCamera = () => {
    const parent = canvas.parentElement;
    const width = parent?.clientWidth || canvas.clientWidth || 1;
    const height = parent?.clientHeight || canvas.clientHeight || 1;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    const padding = 1.18;
    const fov = (camera.fov * Math.PI) / 180;
    const fitHeight = (EARTH_RADIUS * padding) / Math.tan(fov / 2);
    const fitWidth = fitHeight / camera.aspect;
    homeZ = Math.max(fitHeight, fitWidth, 2.6);
    camera.updateProjectionMatrix();
  };

  const dispose = () => {
    geometry.dispose();
    earthMaterial.dispose();
    atmosphere.geometry.dispose();
    (atmosphere.material as ShaderMaterial).dispose();
    starGeometry.dispose();
    starMaterial.dispose();
    textures.forEach((texture) => texture.dispose());
    renderer.dispose();
  };

  return { scene, camera, renderer, earthGroup, cloudMesh, pinAnchor, sunDirection, fitCamera, getHomeZ: () => homeZ, dispose };
}
