document.addEventListener('DOMContentLoaded', () => {

    // LOADER
    const loader = document.getElementById('loader-wrapper');
    if (loader) {
        window.addEventListener('load', () => {
            loader.classList.add('loader-hidden');
        });
        setTimeout(() => loader.classList.add('loader-hidden'), 1500);
    }

    // NAVBAR SCROLL (igual que el main)
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 60) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // HAMBURGER MENU
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileNav.classList.toggle('open');
        });

        // Cerrar menú al hacer click fuera
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !mobileNav.contains(e.target)) {
                menuToggle.classList.remove('active');
                mobileNav.classList.remove('open');
            }
        });
    }



    // ANIMACIÓN ENTRADA TIMELINE
    const timelineItems = document.querySelectorAll('.timeline-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, i * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(item);
    });

    const tabDay1 = document.getElementById('tab-day1');
    if (tabDay1) {
        tabDay1.addEventListener('click', () => switchDay('day1'));
    }

    const tabDay2 = document.getElementById('tab-day2');
    if (tabDay2) {
        tabDay2.addEventListener('click', () => switchDay('day2'));
    }

    // Inicializar interacción de lluvia al hacer clic en el tiburón
    initSharkRainToggle();

});

// SWITCH DE DÍAS (Función Global)
function switchDay(dayId) {
    // Ocultar todos los días
    document.querySelectorAll('.schedule-day').forEach(el => {
        el.classList.remove('active-day');
    });

    // Quitar active de todos los tabs
    document.querySelectorAll('.schedule-tab').forEach(el => {
        el.classList.remove('active');
    });

    // Mostrar el día seleccionado
    const target = document.getElementById(dayId);
    if (target) {
        target.classList.add('active-day');

        // Animar items del timeline nuevo
        const items = target.querySelectorAll('.timeline-item');
        items.forEach((item, i) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, i * 80 + 50);
        });
    }

    // Activar tab correspondiente
    const tabId = 'tab-' + dayId;
    const activeTab = document.getElementById(tabId);
    if (activeTab) activeTab.classList.add('active');
}

// =========================================================
// INTERACTIVE SHARK RAIN TOGGLE (Programa)
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

    const sharkElements = document.querySelectorAll('.mascot-shark-figure, .floating-shark-img');
    sharkElements.forEach(el => {
        el.style.cursor = 'pointer';
        el.setAttribute('title', '¡Haz clic para ver el aviso de clima!');
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            el.classList.add('shark-clicked');
            setTimeout(() => el.classList.remove('shark-clicked'), 400);

            const dock = el.closest('.hero-mascot-dock');
            const wasOpen = dock ? dock.classList.contains('bubble-open') : false;

            if (wasOpen) {
                dock && dock.classList.remove('bubble-open', 'raining-active');
                stopRain();
            } else {
                dock && dock.classList.add('bubble-open', 'raining-active');
                startRain();
            }
        });
    });

    // Close buttons inside bubbles
    document.querySelectorAll('.bubble-close-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const dock = btn.closest('.hero-mascot-dock');
            if (dock) {
                dock.classList.remove('bubble-open', 'raining-active');
            }
            stopRain();
        });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.hero-mascot-dock')) {
            document.querySelectorAll('.hero-mascot-dock.bubble-open').forEach(dock => {
                dock.classList.remove('bubble-open', 'raining-active');
            });
            stopRain();
        }
    });
}
