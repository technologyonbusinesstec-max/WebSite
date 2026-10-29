// src/components/Hero.tsx
import React, { useEffect, useRef, useState } from "react";

const PHRASES: Record<"ES" | "EN", Array<{ text?: string; html?: string }>> = {
  ES: [
    { text: "15 Aniversario del TOB" },
    { text: "Mundo BANI" },
    { text: "2 días" },
    { text: "6 bloques" },
    { text: "18 conferencias" },
    { html: 'Estudiantes de <button type="button" class="ati-modal-trigger">ATI</button>' },
    { text: "Congreso de tecnología" },
    { text: "4 y 5 de noviembre de 2026" },
    { text: "HackaToB: 2–6 nov 2026" },
  ],
  EN: [
    { text: "15th Anniversary of TOB" },
    { text: "BANI World" },
    { text: "2 days" },
    { text: "6 blocks" },
    { text: "18 conferences" },
    { html: 'Students from <button type="button" class="ati-modal-trigger">ATI</button>' },
    { text: "Technology congress" },
    { html: '4<span class="date-ord">th</span> and 5<span class="date-ord">th</span> November 2026' },
    { html: 'HackaToB: 2<span class="date-ord">nd</span>–6<span class="date-ord">th</span> November 2026' },
  ],
};

const PLANETS: Record<"ES" | "EN", string[]> = {
  ES: ["Innovación", "Networking", "Inspiración", "Disrupción", "Sinergia", "Integración"],
  EN: ["Innovation", "Networking", "Inspiration", "Disruption", "Synergy", "Integration"],
};

const MOON_POSITIONS = [
  { top: "50%", left: "0" },
  { top: "100%", left: "50%" },
  { top: "50%", left: "100%" },
  { top: "14.64%", left: "14.64%" },
  { top: "85.35%", left: "85.35%" },
  { top: "85.35%", left: "14.64%" },
];

const EVENT_DATE = new Date("November 4, 2026 09:15:00").getTime();
function pad(n: number) { return n < 10 ? "0" + n : String(n); }

interface HeroProps { lang?: "ES" | "EN"; }

export const Hero: React.FC<HeroProps> = ({ lang: initialLang = "ES" }) => {
  const [currentLang, setCurrentLang] = useState<"ES" | "EN">(initialLang);

  useEffect(() => {
    const saved = localStorage.getItem("tob_lang");
    if (saved === "en" || saved === "EN") {
      setCurrentLang("EN");
    }

    const handleLangChanged = (e: any) => {
      const l = e.detail?.lang;
      if (l) {
        setCurrentLang(l.toUpperCase() === "EN" ? "EN" : "ES");
      }
    };

    window.addEventListener("languageChanged", handleLangChanged);
    return () => window.removeEventListener("languageChanged", handleLangChanged);
  }, []);

  const phraseRef = useRef<HTMLSpanElement>(null);
  const phraseIndexRef = useRef(0);
  const rotatorPausedRef = useRef(false);
  const DISPLAY_TIME = 2000;
  const ATI_DISPLAY_TIME = 4500;
  const TRANSITION_TIME = 400;

  const solarRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const [logoDimmed, setLogoDimmed] = useState(false);
  const starCanvasRef = useRef<HTMLCanvasElement>(null);

  // Countdown
  const [countdown, setCountdown] = useState({ d: "00", h: "00", m: "00", s: "00" });
  useEffect(() => {
    const update = () => {
      const dist = EVENT_DATE - Date.now();
      if (dist < 0) { setCountdown({ d: "00", h: "00", m: "00", s: "00" }); return; }
      setCountdown({
        d: pad(Math.floor(dist / 86400000)),
        h: pad(Math.floor((dist % 86400000) / 3600000)),
        m: pad(Math.floor((dist % 3600000) / 60000)),
        s: pad(Math.floor((dist % 60000) / 1000)),
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  // Phrase rotator
  useEffect(() => {
    const el = phraseRef.current;
    if (!el) return;
    const phrases = PHRASES[currentLang];
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let leavingId: ReturnType<typeof setTimeout> | undefined;

    const showPhrase = (index: number) => {
      const phrase = phrases[index];
      if (!phrase) return;
      if (phrase.html) {
        el.innerHTML = phrase.html;
      } else {
        el.textContent = phrase.text ?? "";
      }
      el.classList.remove("leaving");
      void el.offsetWidth;
      el.classList.add("entering");

      const trigger = el.querySelector(".ati-modal-trigger");
      if (trigger) {
        const pause = () => { rotatorPausedRef.current = true; };
        const resume = () => {
          if (!document.getElementById("atiModal")?.classList.contains("active")) {
            rotatorPausedRef.current = false;
          }
        };
        trigger.addEventListener("mouseenter", pause);
        trigger.addEventListener("focus", pause);
        trigger.addEventListener("mouseleave", resume);
        trigger.addEventListener("blur", resume);
      }
    };

    const scheduleNext = (delay: number) => {
      timeoutId = setTimeout(() => {
        if (rotatorPausedRef.current) {
          scheduleNext(400);
          return;
        }
        el.classList.remove("entering");
        el.classList.add("leaving");
        leavingId = setTimeout(() => {
          phraseIndexRef.current = (phraseIndexRef.current + 1) % phrases.length;
          showPhrase(phraseIndexRef.current);
          const current = phrases[phraseIndexRef.current];
          const hold = current?.html?.includes("ati-modal-trigger") ? ATI_DISPLAY_TIME : DISPLAY_TIME;
          scheduleNext(hold + TRANSITION_TIME);
        }, TRANSITION_TIME);
      }, delay);
    };

    const onModalToggle = (e: Event) => {
      const open = Boolean((e as CustomEvent).detail?.open);
      rotatorPausedRef.current = open;
    };

    phraseIndexRef.current = 0;
    showPhrase(0);
    const first = phrases[0];
    const firstHold = first?.html?.includes("ati-modal-trigger") ? ATI_DISPLAY_TIME : DISPLAY_TIME;
    scheduleNext(firstHold + TRANSITION_TIME);
    window.addEventListener("atiModalToggle", onModalToggle);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (leavingId) clearTimeout(leavingId);
      window.removeEventListener("atiModalToggle", onModalToggle);
    };
  }, [currentLang]);

  // Parallax
  useEffect(() => {
    const hero = heroRef.current;
    const solar = solarRef.current;
    if (!hero || !solar) return;
    const onMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      const rx = (((e.clientY - rect.top) - rect.height / 2) / (rect.height / 2)) * -15;
      const ry = (((e.clientX - rect.left) - rect.width / 2) / (rect.width / 2)) * 15;
      solar.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      solar.style.transition = "transform 0.1s ease-out";
    };
    const onLeave = () => {
      solar.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
      solar.style.transition = "transform 0.5s ease-out";
    };
    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);
    return () => { hero.removeEventListener("mousemove", onMove); hero.removeEventListener("mouseleave", onLeave); };
  }, []);

  // Star canvas
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const canvas = starCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const COLORS = ["255,255,255", "33,208,255", "4,116,196"];
    let particles: any[] = [];
    let rafId: number | null = null;
    let mouseIn = false;
    const spawn = (x: number, y: number) => {
      if (particles.length >= 100) return;
      for (let i = 0; i < 2; i++) {
        particles.push({
          x: x + (Math.random() - 0.5) * 6, y: y + (Math.random() - 0.5) * 6,
          radius: 1.5 + Math.random() * 2,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          alpha: 0.7 + Math.random() * 0.3,
          vx: (Math.random() - 0.5) * 0.6, vy: -0.3 - Math.random() * 0.5,
          born: performance.now(), lifetime: 500 + Math.random() * 300,
        });
      }
    };
    const draw = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter((p) => {
        const progress = (now - p.born) / p.lifetime;
        if (progress >= 1) return false;
        const alpha = p.alpha * (1 - progress);
        ctx.save();
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(${p.color},${alpha})`;
        ctx.fillStyle = `rgba(${p.color},${alpha})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        p.x += p.vx; p.y += p.vy;
        return true;
      });
      if (mouseIn || particles.length > 0) { rafId = requestAnimationFrame(draw); } else { rafId = null; }
    };
    const hero = heroRef.current;
    if (!hero) return;
    const onMove = (e: MouseEvent) => { mouseIn = true; if (!rafId) rafId = requestAnimationFrame(draw); spawn(e.clientX, e.clientY); };
    const onLeave = () => { mouseIn = false; };
    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("resize", resize);
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const handlePlanetClick = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    if (highlighted === idx) { setHighlighted(null); setLogoDimmed(false); }
    else { setHighlighted(idx); setLogoDimmed(true); }
  };

  const planets = PLANETS[currentLang];

  return (
    <header className="hero" id="hero" ref={heroRef} onClick={() => { setHighlighted(null); setLogoDimmed(false); }}>
      <canvas ref={starCanvasRef} id="globalStarCanvas"
        style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1, pointerEvents: "none" }} />

      <div className="hero-content">
        <p className="hero-eyebrow">Technology on Business</p>
        <h1 className="hero-title">Master <br /><span className="text-cyan">The </span>Chaos</h1>

        <div className="hero-rotator" aria-live="polite" data-hero-react="true">
          <span className="rotator-phrase" id="rotatorPhrase" ref={phraseRef} />
        </div>

        <div className="hero-status-container" id="heroStatusContainer">
          <div className="hero-status-boxes" aria-label={currentLang === "ES" ? "Tiempo restante para ToB" : "Time remaining until ToB"}>
            {([
              { value: countdown.d, label: currentLang === "ES" ? "DÍAS" : "DAYS" },
              { value: countdown.h, label: currentLang === "ES" ? "HRS" : "HRS" },
              { value: countdown.m, label: currentLang === "ES" ? "MIN" : "MIN" },
              { value: countdown.s, label: currentLang === "ES" ? "SEG" : "SEC" },
            ]).map((unit) => (
              <div className="status-box" key={unit.label}>
                <span className="status-value glitch-text" data-text={unit.value}>{unit.value}</span>
                <span className="status-label">{unit.label}</span>
              </div>
            ))}
          </div>
          <div className="hero-new-date">
            <span className="new-date-dot" />
            <span className="new-date-text">
              {currentLang === "ES" ? (
                "4 y 5 de noviembre de 2026"
              ) : (
                <>4<span className="date-ord">th</span> and 5<span className="date-ord">th</span> November 2026</>
              )}
            </span>
          </div>
        </div>

        <div className="hero-actions">
          <a href="https://luma.com/technologyonbusiness" target="_blank" className="btn btn-primary btn-large">
            {currentLang === "ES" ? "Asistir" : "Attend"}
          </a>
        </div>
      </div>

      <div className="hero-visual">
        <div className="solar-system" id="solarSystem" ref={solarRef}>
          <div className={"sun" + (logoDimmed ? " dimmed" : "")} id="heroLogo">
            <img src="/imagenes/IsotipoColor-1024.webp" alt="ToB Isotipo" className="sun-img" width="1024" height="1024" decoding="async" />
          </div>
          {planets.map((word, i) => {
            const moonPos = MOON_POSITIONS[i];
            return (
              <div key={i} className={`orbit orbit-${i + 1}` + (highlighted !== null && highlighted !== i ? " dimmed" : "")}>
                <div className={"planet" + (highlighted === i ? " highlighted" : "")} onClick={(e) => handlePlanetClick(e, i)}>
                  <span className="planet-word">{word}</span>
                </div>
                <div className="moon" style={{ top: moonPos.top, left: moonPos.left }} />
                {i === 5 && <div className="moon moon-large" style={{ top: "14.64%", left: "85.35%" }} />}
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
};
