import { Quaternion, Vector3 } from "three";
import { latLonToFacingQuaternion, TEC_CARTAGO } from "./coordinates";
import { createEarthScene, type EarthScene } from "./createScene";

export type EarthGlobeOptions = {
  canvas: HTMLCanvasElement;
  pin: HTMLElement;
  reducedMotion?: boolean;
  onPinChange?: (visible: boolean) => void;
  onLocated?: () => void;
};

export type EarthGlobeHandle = {
  flyToTec: () => void;
  reset: () => void;
  setScroll: (progress: number) => void;
  destroy: () => void;
};

const IDLE_Y = 0.045;
const CLOUD_Y = 0.018;
const ZOOM_Z = 1.5;

const easeOut3 = (t: number) => 1 - (1 - t) ** 3;
const easeInOut3 = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

type Flight = {
  mode: "in" | "out";
  startedAt: number;
  duration: number;
  startZ: number;
  endZ: number;
  startQ: Quaternion;
  endQ: Quaternion;
};

export function createEarthGlobe({
  canvas,
  pin,
  reducedMotion = false,
  onPinChange,
  onLocated,
}: EarthGlobeOptions): EarthGlobeHandle {
  const built: EarthScene = createEarthScene(canvas);
  const { scene, camera, renderer, earthGroup, cloudMesh, pinAnchor, fitCamera, getHomeZ, dispose } = built;

  let idle = !reducedMotion;
  let located = false;
  let dollyZ = 3.4;
  let scrollProgress = 0;
  let scrollActive = false;
  const scrollStartQ = new Quaternion();
  const scrollEndQ = latLonToFacingQuaternion(TEC_CARTAGO.lat, TEC_CARTAGO.lon);
  let pinVisible = false;
  let raf = 0;
  let last = performance.now();
  let flight: Flight | null = null;
  const projected = new Vector3();
  const world = new Vector3();
  const camDir = new Vector3();
  const facingNormal = new Vector3();
  const nowQ = new Quaternion();
  const root = canvas.closest("#layerEarth");

  const applyDolly = (z: number) => {
    dollyZ = z;
    camera.position.z = z;
    if (root instanceof HTMLElement) root.dataset.earthZ = z.toFixed(2);
  };

  const setPinVisible = (visible: boolean) => {
    pinVisible = visible;
    pinAnchor.visible = visible;
    pin.hidden = false;
    pin.removeAttribute("hidden");
    pin.style.opacity = "";
    pin.classList.toggle("is-visible", visible);
    pin.classList.toggle("is-behind", false);
    pin.setAttribute("aria-hidden", visible ? "false" : "true");
    onPinChange?.(visible);
  };

  const projectPin = () => {
    if (!pinVisible) return;
    pinAnchor.getWorldPosition(world);
    const facing = facingNormal.copy(world).normalize().dot(camDir.copy(camera.position).normalize());
    projected.copy(world).project(camera);
    if (facing < 0.12 || projected.z > 1) {
      pin.classList.add("is-behind");
      return;
    }
    const x = (projected.x * 0.5 + 0.5) * canvas.clientWidth;
    const y = (-projected.y * 0.5 + 0.5) * canvas.clientHeight;
    pin.style.left = `${x}px`;
    pin.style.top = `${y}px`;
    pin.classList.remove("is-behind");
  };

  const finishFlight = () => {
    if (!flight) return;
    const done = flight;
    flight = null;
    applyDolly(done.endZ);
    if (done.mode === "in") {
      earthGroup.quaternion.copy(done.endQ);
      located = true;
      setPinVisible(true);
      onLocated?.();
      return;
    }
    located = false;
  };

  const applyFlight = (now: number) => {
    if (!flight) return;
    const uRaw = (now - flight.startedAt) / (flight.duration * 1000);
    const u = flight.mode === "in" ? easeOut3(clamp01(uRaw)) : easeInOut3(clamp01(uRaw));
    applyDolly(flight.startZ + (flight.endZ - flight.startZ) * u);
    if (flight.mode === "in") {
      nowQ.slerpQuaternions(flight.startQ, flight.endQ, u);
      earthGroup.quaternion.copy(nowQ);
    }
    if (uRaw >= 1) finishFlight();
  };

  const tick = (now: number) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    applyFlight(now);
    if (idle) {
      earthGroup.rotateY(IDLE_Y * dt);
    }
    cloudMesh.rotation.y += CLOUD_Y * dt;
    camera.position.z = dollyZ;
    projectPin();
    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  };

  const setScroll = (progress: number) => {
    const p = clamp01(progress);
    scrollProgress = p;
    flight = null;
    if (p <= 0.001) {
      if (scrollActive) {
        scrollActive = false;
        idle = !reducedMotion;
        located = false;
        setPinVisible(false);
        applyDolly(getHomeZ());
      }
      return;
    }
    if (!scrollActive) {
      scrollActive = true;
      idle = false;
      scrollStartQ.copy(earthGroup.quaternion);
    }
    const u = easeInOut3(Math.min(1, p / 0.72));
    applyDolly(getHomeZ() + (ZOOM_Z - getHomeZ()) * u);
    nowQ.slerpQuaternions(scrollStartQ, scrollEndQ, u);
    earthGroup.quaternion.copy(nowQ);
    const showPin = u > 0.62;
    if (showPin !== pinVisible) setPinVisible(showPin);
    located = p > 0.8;
  };

  const flyToTec = () => {
    idle = false;
    located = false;
    setPinVisible(false);
    flight = {
      mode: "in",
      startedAt: performance.now(),
      duration: reducedMotion ? 0.35 : 2.5,
      startZ: dollyZ,
      endZ: ZOOM_Z,
      startQ: earthGroup.quaternion.clone(),
      endQ: latLonToFacingQuaternion(TEC_CARTAGO.lat, TEC_CARTAGO.lon),
    };
  };

  const reset = () => {
    setPinVisible(false);
    located = false;
    idle = !reducedMotion;
    flight = {
      mode: "out",
      startedAt: performance.now(),
      duration: reducedMotion ? 0.3 : 2.2,
      startZ: dollyZ,
      endZ: Math.max(getHomeZ(), 2.6),
      startQ: earthGroup.quaternion.clone(),
      endQ: earthGroup.quaternion.clone(),
    };
  };

  const onResize = () => {
    fitCamera();
    if (scrollActive) {
      const u = easeInOut3(Math.min(1, scrollProgress / 0.72));
      applyDolly(getHomeZ() + (ZOOM_Z - getHomeZ()) * u);
      return;
    }
    if (flight) {
      if (flight.mode === "out") flight.endZ = getHomeZ();
      return;
    }
    applyDolly(located ? ZOOM_Z : getHomeZ());
  };
  const observer = new ResizeObserver(onResize);
  observer.observe(canvas.parentElement || canvas);
  fitCamera();
  applyDolly(getHomeZ());
  setPinVisible(false);
  raf = requestAnimationFrame(tick);
  const pump = window.setInterval(() => {
    applyFlight(performance.now());
    camera.position.z = dollyZ;
    projectPin();
    renderer.render(scene, camera);
  }, 16);

  const handle: EarthGlobeHandle = {
    flyToTec,
    reset,
    setScroll,
    destroy: () => {
      cancelAnimationFrame(raf);
      window.clearInterval(pump);
      flight = null;
      observer.disconnect();
      if (root instanceof HTMLElement && (root as HTMLElement & { __earth?: EarthGlobeHandle }).__earth === handle) {
        delete (root as HTMLElement & { __earth?: EarthGlobeHandle }).__earth;
      }
      dispose();
    },
  };
  if (root instanceof HTMLElement) {
    (root as HTMLElement & { __earth?: EarthGlobeHandle }).__earth = handle;
  }
  return handle;
}
