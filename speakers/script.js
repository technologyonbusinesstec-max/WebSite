document.addEventListener('DOMContentLoaded', () => {

    // LOADER — se oculta al cargar la página
    const loader = document.getElementById('loader-wrapper');
    if (loader) {
        // Al cargar todo (imágenes incluidas)
        window.addEventListener('load', () => {
            loader.classList.add('loader-hidden');
        });
        // Fallback: máximo 1.5s para que no quede bloqueado
        setTimeout(() => {
            loader.classList.add('loader-hidden');
        }, 1500);
    }

    // NAVBAR SCROLL
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 60);
        }, { passive: true });
    }

    // HAMBURGER MENU
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileNav.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !mobileNav.contains(e.target)) {
                menuToggle.classList.remove('active');
                mobileNav.classList.remove('open');
            }
        });
    }


    // MODAL "Error del sistema" del botón cerrar
    const closeBtn = document.getElementById('termCloseBtn');
    const sysModal = document.getElementById('sysErrorModal');
    const sysClose = document.getElementById('sysErrorCloseBtn');

    if (closeBtn && sysModal) {
        closeBtn.addEventListener('click', () => {
            sysModal.classList.add('visible');
        });
        sysClose?.addEventListener('click', () => {
            sysModal.classList.remove('visible');
        });
    }

    // SCROLL TOP BUTTON
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // LÓGICA DE SPEAKERS (Expositores)
    const speakersData = [
        { foto: "../imagenes/speakers/speaker01.webp", nombre: "Pedro Gutiérrez", puesto: "Avify", descripcion: "CEO de Avify. Compartirá el camino de construir una startup.", linkedin: "https://www.linkedin.com/in/peter-gg/", instagram: "#", charla: "Empresa de 0 a 1M" },
        { foto: "../imagenes/speakers/speaker02.webp", nombre: "Tamara Sancho", puesto: "P&G", descripcion: "Transformando el miedo en una herramienta de crecimiento profesional.", linkedin: "https://www.linkedin.com/in/tamarajudit/", instagram: "#", charla: "Extraordinary Fears" },
        { foto: "../imagenes/speakers/speaker03.webp", nombre: "Pilar Sánchez", puesto: "Avify", descripcion: "Líder de la industria compartiendo su visión en resiliencia.", linkedin: "https://www.linkedin.com/in/tamarajudit/?locale=Pilar%20S%C3%A1nchez%20Avify", instagram: "#", charla: "Panel Mujeres en Tech" },
        { foto: "../imagenes/speakers/speaker04.webp", nombre: "Wendy Badilla", puesto: "Microsoft", descripcion: "Experta de Microsoft enfocada en empoderamiento femenino en STEM.", linkedin: "https://www.linkedin.com/in/wendy-badilla-225630a0/", instagram: "#", charla: "Panel Mujeres en Tech" },
        { foto: "../imagenes/speakers/speaker05.webp", nombre: "Aaron Omodeo", puesto: "Doji Club", descripcion: "Especialista en finanzas prácticas y toma de decisiones de inversión.", linkedin: "https://www.linkedin.com/in/aaron-omodeo/", instagram: "#", charla: "Finanzas personales en inversiones" },
        { foto: "../imagenes/speakers/speaker12.webp", nombre: "Diego Loud", puesto: "Loud", descripcion: "Estrategias de mercadeo para conectar con audiencias saturadas.", linkedin: "#", instagram: "#", charla: "Mercadeo en la era digital" },
        { foto: "../imagenes/speakers/speaker07.webp", nombre: "María José Artavia", puesto: "ATI", descripcion: "Directora dando apertura oficial a TOB-ATI 2026.", linkedin: "#", instagram: "#", charla: "Inauguración" },
        { foto: "../imagenes/speakers/speaker08.webp", nombre: "Alek Castillo", puesto: "Lyfter", descripcion: "Experta en liderazgo adaptativo en entornos de cambio acelerado.", linkedin: "#", instagram: "#", charla: "Liderazgo en la era de la transformación digital" },
        { foto: "../imagenes/speakers/speaker09.webp", nombre: "Alejandro Hidalgo", puesto: "P&G", descripcion: "Aplicación de metodologías ágiles para entregar valor más rápido.", linkedin: "#", instagram: "#", charla: "Metodologías ágiles" },
        { foto: "../imagenes/speakers/speaker10.webp", nombre: "Gerardo Nájera", puesto: "Sefisa", descripcion: "Estrategias de ciberseguridad para proteger información vital.", linkedin: "#", instagram: "#", charla: "Ciberseguridad" },
        { foto: "../imagenes/speakers/speaker11.webp", nombre: "Karla Córdoba", puesto: "Aso Blockchain CR", descripcion: "Aplicaciones reales de la confianza digital más allá de cripto.", linkedin: "#", instagram: "#", charla: "Blockchain" },
        { foto: "../imagenes/speakers/speaker13.webp", nombre: "Ronald Arce", puesto: "INCAE", descripcion: "Cómo la IA está redefiniendo los modelos de negocio.", linkedin: "#", instagram: "#", charla: "IA" },
        { foto: "../imagenes/speakers/speaker14.webp", nombre: "Muy pronto...", puesto: "Por definir", descripcion: "", charla: "..." },
        { foto: "../imagenes/speakers/speaker14.webp", nombre: "Muy pronto...", puesto: "Por definir", descripcion: "", charla: "..." },
        { foto: "../imagenes/speakers/speaker14.webp", nombre: "Muy pronto...", puesto: "Por definir", descripcion: "", charla: "..." },
        { foto: "../imagenes/speakers/speaker14.webp", nombre: "Muy pronto...", puesto: "Por definir", descripcion: "", charla: "..." },
        { foto: "../imagenes/speakers/speaker14.webp", nombre: "Muy pronto...", puesto: "Por definir", descripcion: "", charla: "..." },
        { foto: "../imagenes/speakers/actividadCultural01.webp", nombre: "Rubén Monarca", puesto: "Actividad Cultural", descripcion: "", charla: "..." },
        { foto: "../imagenes/speakers/actividadCultural02.webp", nombre: "Nestor Morales", puesto: "Actividad Cultural", descripcion: "", charla: "..." },
        { foto: "../imagenes/speakers/actividadCultural03.webp", nombre: "Pedro Leiva", puesto: "Actividad Cultural", descripcion: "", charla: "..." },
        { foto: "../imagenes/speakers/actividadCultural04.webp", nombre: "Melody Coto", puesto: "Actividad Cultural", descripcion: "", charla: "..." }
    ];

    const speakersGrid = document.getElementById('speakersGrid');

    function renderSpeakerCard(speaker, index, isHidden = false) {
        const hiddenClass = isHidden ? 'style="display:none;"' : '';
        const i18nId = String(index + 1).padStart(2, '0');

        return `
            <div class="speaker-simple-card" data-index="${index}" ${hiddenClass}>
                <div class="speaker-avatar-wrap">
                    <img src="${speaker.foto}" alt="${speaker.nombre}" class="speaker-avatar">
                </div>
                <h3 class="speaker-simple-name" data-i18n="speaker_${i18nId}_name">${speaker.nombre}</h3>
                <p class="speaker-simple-role" data-i18n="speaker_${i18nId}_role">${speaker.puesto}</p>
            </div>
        `;
    }

    if (speakersGrid) {
        const showAll = speakersGrid.hasAttribute('data-show-all');
        const cardsHTML = speakersData.map((sp, i) => renderSpeakerCard(sp, i, showAll ? false : i >= 6)).join('');
        speakersGrid.innerHTML = cardsHTML;
    }

    if (typeof applyTranslations === 'function') {
        applyTranslations(localStorage.getItem('tob_lang') || 'es');
    }

    // Inicializar interacción de lluvia al hacer clic en el tiburón
    initSharkRainToggle();

});

// =========================================================
// INTERACTIVE SHARK RAIN TOGGLE (Speakers)
// =========================================================
function initSharkRainToggle() {
    let rainCanvas = null;
    let ctx = null;
    let animationFrameId = null;
    let isRaining = false;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const LAYER_CONFIGS = [
        { count: 85, minLen: 12, maxLen: 22, minSpeed: 12, maxSpeed: 18, width: 1.0, color: 'rgba(83, 121, 174, ', alphaBase: 0.35 },
        { count: 65, minLen: 20, maxLen: 34, minSpeed: 19, maxSpeed: 26, width: 1.4, color: 'rgba(33, 208, 255, ', alphaBase: 0.55 },
        { count: 40, minLen: 30, maxLen: 50, minSpeed: 28, maxSpeed: 38, width: 2.0, color: 'rgba(235, 248, 255, ', alphaBase: 0.85 }
    ];
    const WIND_ANGLE = 0.16;
    let drops = [];
    let splashes = [];
    const MAX_SPLASHES = 70;

    function createDrop(layer, randomY = false) {
        const speed = layer.minSpeed + Math.random() * (layer.maxSpeed - layer.minSpeed);
        const length = layer.minLen + Math.random() * (layer.maxLen - layer.minLen);
        const alpha = layer.alphaBase * (0.8 + Math.random() * 0.4);
        return {
            x: Math.random() * (width + 300) - 150,
            y: randomY ? Math.random() * height : -length - Math.random() * 50,
            length,
            speed,
            vx: speed * WIND_ANGLE,
            vy: speed,
            width: layer.width,
            color: layer.color,
            alpha,
            layerIndex: LAYER_CONFIGS.indexOf(layer)
        };
    }

    function createSplash(x, y, layerIndex) {
        if (splashes.length >= MAX_SPLASHES) return;
        const count = layerIndex === 2 ? 3 : 2;
        for (let i = 0; i < count; i++) {
            splashes.push({
                x,
                y,
                vx: (Math.random() - 0.5) * 3.5 + 1.2,
                vy: -(Math.random() * 2.8 + 1.2),
                radius: Math.random() * 1.3 + 0.7,
                alpha: 0.7,
                decay: 0.04 + Math.random() * 0.03,
                color: layerIndex === 2 ? 'rgba(235, 248, 255, ' : 'rgba(33, 208, 255, '
            });
        }
    }

    function resize() {
        if (!rainCanvas) return;
        width = window.innerWidth;
        height = window.innerHeight;
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        rainCanvas.width = width * dpr;
        rainCanvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function render() {
        if (!isRaining || !ctx) return;

        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < drops.length; i++) {
            const drop = drops[i];
            drop.x += drop.vx;
            drop.y += drop.vy;

            const tailX = drop.x - drop.vx * (drop.length / drop.speed);
            const tailY = drop.y - drop.length;

            const grad = ctx.createLinearGradient(tailX, tailY, drop.x, drop.y);
            grad.addColorStop(0, `${drop.color}0)`);
            grad.addColorStop(1, `${drop.color}${drop.alpha})`);

            ctx.strokeStyle = grad;
            ctx.lineWidth = drop.width;
            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(drop.x, drop.y);
            ctx.stroke();

            if (drop.y >= height) {
                if (drop.layerIndex >= 1 && Math.random() > 0.35) {
                    createSplash(drop.x, height - 3, drop.layerIndex);
                }
                drop.x = Math.random() * (width + 300) - 150;
                drop.y = -drop.length - Math.random() * 25;
            }
        }

        for (let i = splashes.length - 1; i >= 0; i--) {
            const s = splashes[i];
            s.x += s.vx;
            s.y += s.vy;
            s.vy += 0.25;
            s.alpha -= s.decay;

            if (s.alpha <= 0 || s.y > height) {
                splashes.splice(i, 1);
                continue;
            }

            ctx.fillStyle = `${s.color}${s.alpha})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        animationFrameId = requestAnimationFrame(render);
    }

    function startRain() {
        if (!rainCanvas) {
            rainCanvas = document.createElement('canvas');
            rainCanvas.id = 'sharkRainCanvas';
            rainCanvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9998;transition:opacity 0.4s ease;opacity:0;';
            document.body.appendChild(rainCanvas);
            ctx = rainCanvas.getContext('2d');
            window.addEventListener('resize', resize, { passive: true });
        }

        resize();
        drops = [];
        splashes = [];
        LAYER_CONFIGS.forEach(layer => {
            for (let i = 0; i < layer.count; i++) {
                drops.push(createDrop(layer, true));
            }
        });

        isRaining = true;
        rainCanvas.style.opacity = '1';
        if (!animationFrameId) {
            animationFrameId = requestAnimationFrame(render);
        }
    }

    function stopRain() {
        isRaining = false;
        if (rainCanvas) {
            rainCanvas.style.opacity = '0';
            setTimeout(() => {
                if (!isRaining && rainCanvas && rainCanvas.parentNode) {
                    if (animationFrameId) {
                        cancelAnimationFrame(animationFrameId);
                        animationFrameId = null;
                    }
                    ctx && ctx.clearRect(0, 0, width, height);
                }
            }, 400);
        }
    }

    const sharkElements = document.querySelectorAll('.mascot-shark-figure, .mascot-shark-img, .floating-shark-img');
    sharkElements.forEach(el => {
        el.style.cursor = 'pointer';
        el.setAttribute('title', '¡Haz clic para hacer llover / parar la lluvia!');
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            el.classList.add('shark-clicked');
            setTimeout(() => el.classList.remove('shark-clicked'), 400);

            if (isRaining) {
                stopRain();
                document.querySelectorAll('.hero-mascot-dock').forEach(dock => dock.classList.remove('raining-active'));
            } else {
                startRain();
                document.querySelectorAll('.hero-mascot-dock').forEach(dock => dock.classList.add('raining-active'));
            }
        });
    });
}
