// programa/storytelling.js
// Scrollytelling visual â€” EvoluciÃ³n tecnolÃ³gica detrÃ¡s del programa

(function () {
    'use strict';

    gsap.registerPlugin(ScrollTrigger);

    const canvas = document.getElementById('storytelling-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;

    // Detectar si es mÃ³vil
    const isMobile = window.innerWidth <= 768;
    const NUM_PARTICLES = isMobile ? 60 : 120;

    // PartÃ­culas
    let particles = [];

    // Estado global del scroll (0 a 1)
    let globalProgress = 0;

    // DefiniciÃ³n de eras
    const eras = [
        { id: 'year-1940', start: 0.00, end: 0.18 },
        { id: 'year-1980', start: 0.18, end: 0.35 },
        { id: 'year-1990', start: 0.35, end: 0.55 },
        { id: 'year-2000', start: 0.55, end: 0.72 },
        { id: 'year-2020', start: 0.72, end: 0.88 },
        { id: 'year-next', start: 0.88, end: 0.97 }
    ];

    // â”€â”€ Canvas setup â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    function initCanvas() {
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        for (let i = 0; i < NUM_PARTICLES; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                targetX: Math.random() * width,
                targetY: Math.random() * height,
                size: Math.random() * 1.8 + 0.5,
                alpha: 0.4,
                phase: Math.random() * Math.PI * 2,
                speed: 0.008 + Math.random() * 0.015
            });
        }

        requestAnimationFrame(renderLoop);
    }

    // â”€â”€ Particle target positions per stage â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    function computeTargets(progress) {
        const cx = width * 0.12;   // Zona izquierda segura
        const cy = height * 0.5;
        const rx = width * 0.88;   // Zona derecha segura

        particles.forEach((p, i) => {
            const angle = (i / NUM_PARTICLES) * Math.PI * 2;
            const t = i / NUM_PARTICLES;

            // STAGE 1: Mainframe (grid cuadrado a la izquierda)
            if (progress < 0.18) {
                const cols = 12;
                const row = Math.floor(i / cols);
                const col = i % cols;
                p.targetX = cx - 40 + col * 8;
                p.targetY = cy - 50 + row * 8;
                p.alpha = 0.25;
            }
            // STAGE 2: PC (forma mÃ¡s compacta a la derecha)
            else if (progress < 0.35) {
                const cols = 8;
                const row = Math.floor(i / cols);
                const col = i % cols;
                p.targetX = rx - 80 + col * 10;
                p.targetY = cy - 40 + row * 10;
                p.alpha = 0.35;
            }
            // STAGE 3: Internet (nodos dispersos en bordes)
            else if (progress < 0.55) {
                const side = i % 2 === 0;
                const baseX = side ? width * 0.05 : width * 0.95;
                p.targetX = baseX + Math.sin(angle + progress * 4) * 60;
                p.targetY = height * t;
                p.alpha = 0.5;
            }
            // STAGE 4: Cloud (arco superior)
            else if (progress < 0.72) {
                const spread = width * 0.35;
                p.targetX = width * 0.5 + Math.cos(angle) * spread * t;
                p.targetY = height * 0.12 + Math.sin(angle) * 40 + t * 30;
                p.alpha = 0.35;
            }
            // STAGE 5: AI â€” red neuronal (3 columnas)
            else if (progress < 0.88) {
                const layer = i % 4;
                const nodeIndex = Math.floor(i / 4);
                const nodesPerLayer = Math.ceil(NUM_PARTICLES / 4);
                p.targetX = width * 0.08 + layer * (width * 0.06);
                p.targetY = (height / nodesPerLayer) * nodeIndex;
                p.alpha = 0.5;
            }
            // STAGE 6: Quantum (anillos concÃ©ntricos)
            else if (progress < 0.97) {
                const ring = i % 3;
                const radius = 60 + ring * 40;
                p.targetX = width * 0.5 + Math.cos(angle + progress * 3) * radius;
                p.targetY = height * 0.5 + Math.sin(angle + progress * 3) * radius;
                p.alpha = 0.6;
            }
            // FINAL: converge al centro y desvanece
            else {
                p.targetX = width * 0.5;
                p.targetY = height * 0.5;
                p.alpha = Math.max(0, 1 - ((progress - 0.97) / 0.03));
            }
        });
    }

    // â”€â”€ Render loop â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    function renderLoop() {
        ctx.clearRect(0, 0, width, height);
        computeTargets(globalProgress);

        // Mover partÃ­culas con lerp
        particles.forEach(p => {
            p.phase += 0.01;
            p.x += (p.targetX - p.x) * p.speed * 3;
            p.y += (p.targetY - p.y) * p.speed * 3;
            // Micro-ondulaciÃ³n orgÃ¡nica
            p.x += Math.sin(p.phase) * 0.3;
            p.y += Math.cos(p.phase * 0.7) * 0.3;
        });

        // Dibujar conexiones (solo en etapas Internet y AI)
        if (globalProgress > 0.35 && globalProgress < 0.90) {
            ctx.lineWidth = 0.4;
            const maxDist = 12000;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distSq = dx * dx + dy * dy;
                    if (distSq < maxDist) {
                        const a = (1 - distSq / maxDist) * 0.2;
                        ctx.strokeStyle = `rgba(33, 208, 255, ${a})`;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        // Dibujar partÃ­culas
        particles.forEach(p => {
            ctx.fillStyle = `rgba(33, 208, 255, ${p.alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(renderLoop);
    }

    // â”€â”€ Year labels â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    function updateYears(progress) {
        eras.forEach(era => {
            const el = document.getElementById(era.id);
            if (!el) return;
            let opacity = 0;
            if (progress >= era.start && progress < era.end) {
                const mid = (era.start + era.end) / 2;
                const halfRange = (era.end - era.start) / 2;
                const normalDist = Math.abs(progress - mid) / halfRange;
                opacity = (1 - normalDist) * 0.06; // Muy sutil
            }
            el.style.opacity = Math.max(0, opacity);
        });
    }

    function updateFinalText(progress) {
        const el = document.getElementById('story-final-text');
        if (!el) return;
        // Solo visible en el cierre del cronograma (0.92 a 0.98), luego se desvanece antes del footer
        if (progress > 0.90 && progress < 0.98) {
            const fadeIn = (progress - 0.90) / 0.04;
            const fadeOut = (0.98 - progress) / 0.02;
            el.style.opacity = Math.max(0, Math.min(1, Math.min(fadeIn, fadeOut)));
        } else {
            el.style.opacity = '0';
        }
    }

    // ── ScrollTrigger ──────────────────────────────────────────

    function initScrollTrigger() {
        ScrollTrigger.create({
            trigger: '.schedule-section',
            start: 'top top',
            end: 'bottom bottom',
            onUpdate: function (self) {
                globalProgress = self.progress;
                updateYears(globalProgress);
                updateFinalText(globalProgress);
            }
        });
    }

    // â”€â”€ IntersectionObserver para tarjetas activas â”€â”€â”€â”€â”€â”€â”€â”€

    function initCardObserver() {
        const items = document.querySelectorAll('.timeline-item:not(.block-header)');
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active-event');
                } else {
                    entry.target.classList.remove('active-event');
                }
            });
        }, {
            rootMargin: '-35% 0px -35% 0px',
            threshold: 0
        });
        items.forEach(function (item) { observer.observe(item); });
    }

    // â”€â”€ Sobrecargar switchDay para refrescar ScrollTrigger â”€

    (function hookSwitchDay() {
        var orig = window.switchDay;
        if (typeof orig === 'function') {
            window.switchDay = function (dayId) {
                orig(dayId);
                setTimeout(function () { ScrollTrigger.refresh(); }, 150);
            };
        }
    })();

    // â”€â”€ Inicializar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

    function boot() {
        initCanvas();
        initScrollTrigger();
        initCardObserver();
    }

})();

