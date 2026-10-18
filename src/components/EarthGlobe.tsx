import { useEffect, useRef, useState } from "react";
import { createEarthGlobe, type EarthGlobeHandle } from "../lib/earth";
import "../styles/earth-globe.css";

function useTobLang() {
  const [lang, setLang] = useState("es");

  useEffect(() => {
    const saved = (localStorage.getItem("tob_lang") || "es").toLowerCase();
    setLang(saved);
    const onChange = (event: Event) => {
      const next = (event as CustomEvent).detail?.lang;
      if (typeof next === "string") setLang(next.toLowerCase());
    };
    window.addEventListener("languageChanged", onChange);
    return () => window.removeEventListener("languageChanged", onChange);
  }, []);

  const t = (key: string, fallback: string) => {
    if (typeof window === "undefined") return fallback;
    const dict = (window as unknown as { translations?: Record<string, Record<string, string>> }).translations?.[lang];
    return dict?.[key] ?? fallback;
  };

  return { t };
}

function hideLocationCard() {
  document.getElementById("layerContent")?.classList.remove("is-revealed");
  document.getElementById("layerEarth")?.classList.remove("is-located");
  window.dispatchEvent(new CustomEvent("earthReset"));
}

function showLocationCard() {
  document.getElementById("layerContent")?.classList.add("is-revealed");
  document.getElementById("layerEarth")?.classList.add("is-located");
  const frame = document.querySelector("#layerContent .location-map iframe");
  if (frame instanceof HTMLIFrameElement && frame.dataset.src && !frame.src.includes("output=embed")) {
    frame.src = frame.dataset.src;
  }
  window.dispatchEvent(new CustomEvent("earthLocated"));
}

export function EarthGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<EarthGlobeHandle | null>(null);
  const [pinOn, setPinOn] = useState(false);
  const { t } = useTobLang();

  useEffect(() => {
    const canvas = canvasRef.current;
    const pin = pinRef.current;
    if (!canvas || !pin) return;

    handleRef.current = createEarthGlobe({
      canvas,
      pin,
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      onPinChange: setPinOn,
    });

    const wrapper = document.getElementById("ubicacion");
    const closeBtn = document.getElementById("locationClose");
    let cardOn = false;
    let scrollRaf = 0;

    const syncScroll = () => {
      scrollRaf = 0;
      if (!wrapper) return;
      const travel = Math.max(wrapper.offsetHeight - window.innerHeight, 1);
      const scrolled = -wrapper.getBoundingClientRect().top;
      const progress = Math.min(1, Math.max(0, scrolled / travel));
      handleRef.current?.setScroll(progress);
      if (!cardOn && progress > 0.82) {
        cardOn = true;
        showLocationCard();
      } else if (cardOn && progress < 0.7) {
        cardOn = false;
        setPinOn(false);
        hideLocationCard();
      }
    };

    const onScroll = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(syncScroll);
    };

    const onClose = () => {
      if (!wrapper) return;
      const top = wrapper.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: Math.max(0, top - 12), behavior: "smooth" });
    };

    syncScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    closeBtn?.addEventListener("click", onClose);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      closeBtn?.removeEventListener("click", onClose);
      handleRef.current?.destroy();
      handleRef.current = null;
    };
  }, []);

  return (
    <div className="earth-globe" id="layerEarth" data-earth-rev="22">
      <div className="earth-globe-stage" id="earthGlobeStage">
        <canvas ref={canvasRef} className="earth-globe-canvas" aria-label={t("loc_globe_alt", "Tierra vista desde el espacio")} />
        <div ref={pinRef} className={pinOn ? "earth-pin is-visible" : "earth-pin"} aria-hidden={pinOn ? "false" : "true"}>
          <span className="earth-pin-dot" />
          <span className="earth-pin-label">{t("loc_pin", "Centro de las Artes, TEC")}</span>
        </div>
      </div>
    </div>
  );
}

export default EarthGlobe;
