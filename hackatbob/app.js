document.addEventListener('DOMContentLoaded', () => {
    // 1. ROTADOR DE FRASES DEL HACKATOB
    const HACK_PHRASES = [
        "Innova. Conecta. Transforma.",
        "Convierte ideas en soluciones",
        "Transformación",
        "Tecnología",
        "17 al 20 de agosto",
        "4 días de aprendizaje",
        "Instituto Tecnológico de Costa Rica"
    ];

    const DISPLAY_TIME = 2200; // ms que se muestra cada frase
    const TRANSITION_TIME = 400; // ms de la animación de salida
    const phraseEl = document.getElementById('hackRotatorPhrase');

    if (phraseEl) {
        let currentIndex = 0;

        function showPhrase(index) {
            phraseEl.textContent = HACK_PHRASES[index];
            phraseEl.classList.remove('leaving');
            void phraseEl.offsetWidth; // Forzar reflow para reiniciar la animación
            phraseEl.classList.add('entering');
        }

        function nextPhrase() {
            phraseEl.classList.remove('entering');
            phraseEl.classList.add('leaving');
            setTimeout(() => {
                currentIndex = (currentIndex + 1) % HACK_PHRASES.length;
                showPhrase(currentIndex);
            }, TRANSITION_TIME);
        }

        showPhrase(0);
        setInterval(nextPhrase, DISPLAY_TIME + TRANSITION_TIME);
    }

    // 2. INTERACTIVIDAD DE LA MASCOTA SPARK Y CURSOR PERSONALIZADO CON RASTRO DE COMETA
    const mascot = document.getElementById('mascotSpark');
    let customCursor = document.getElementById('custom-spark-cursor');

    // Canvas dedicado para el rastro de cometa amarillo
    let trailCanvas = document.getElementById('spark-trail-canvas');
    if (!trailCanvas) {
        trailCanvas = document.createElement('canvas');
        trailCanvas.id = 'spark-trail-canvas';
        trailCanvas.style.position = 'fixed';
        trailCanvas.style.top = '0';
        trailCanvas.style.left = '0';
        trailCanvas.style.width = '100vw';
        trailCanvas.style.height = '100vh';
        trailCanvas.style.pointerEvents = 'none';
        trailCanvas.style.zIndex = '999998'; // Justo debajo del cursor (999999)
        document.body.appendChild(trailCanvas);
    }

    const ctx = trailCanvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        trailCanvas.width = window.innerWidth;
        trailCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const YELLOW_COLORS = [
        '#FFF566',
        '#FFD700',
        '#FFDF00',
        '#FFE600',
        '#FFC700',
        '#FFAA00'
    ];

    function createCometSparkles(x, y, count = 3) {
        for (let i = 0; i < count; i++) {
            particles.push({
                x: x + (Math.random() - 0.5) * 12,
                y: y + (Math.random() - 0.5) * 12,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5 + 0.5, // Leve caída/deriva
                size: Math.random() * 4.5 + 1.5,
                alpha: 1,
                decay: Math.random() * 0.025 + 0.02,
                color: YELLOW_COLORS[Math.floor(Math.random() * YELLOW_COLORS.length)]
            });
        }
    }

    function animateTrail() {
        ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= p.decay;
            p.size *= 0.97;

            if (p.alpha <= 0 || p.size <= 0.2) {
                particles.splice(i, 1);
                continue;
            }

            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.shadowColor = '#FFE600';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        requestAnimationFrame(animateTrail);
    }
    animateTrail();

    if (mascot) {
        // Crear elemento para el cursor personalizado
        if (!customCursor) {
            customCursor = document.createElement('div');
            customCursor.id = 'custom-spark-cursor';
            customCursor.innerHTML = `<img src="../imagenes/hackatob/spark.webp" alt="Cursor">`;
            document.body.appendChild(customCursor);
        }

        mascot.addEventListener('click', () => {
            // Animación de rebote (bounce)
            mascot.classList.add('mascot-clicked');
            setTimeout(() => {
                mascot.classList.remove('mascot-clicked');
            }, 500);

            // Cambiar el cursor a la mascota en toda la página
            const isActive = document.body.classList.toggle('mascot-cursor-active');

            if (isActive) {
                // Explosión inicial de chispas amarillas al activarse
                const rect = mascot.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                createCometSparkles(centerX, centerY, 30);
            }
        });

        // Actualizar posición del cursor personalizado y generar estela de cometa
        document.addEventListener('mousemove', (e) => {
            if (document.body.classList.contains('mascot-cursor-active')) {
                customCursor.style.left = e.clientX + 'px';
                customCursor.style.top = e.clientY + 'px';

                // Generar partículas de estela de cometa amarilla
                createCometSparkles(e.clientX, e.clientY, 3);
            }
        });
    }

    // 3. INTERACCIÓN DE PREMIOS (GIRO VERTICAL 3D / FLIP CARD)
    const prizeCardInners = document.querySelectorAll('.prize-card-inner');

    if (prizeCardInners.length) {
        prizeCardInners.forEach(card => {
            card.addEventListener('click', () => {
                card.classList.toggle('is-flipped');
            });
        });
    }

    // 4. ANIMACIÓN DE CONTEO PROGRESIVO DE MÉTRICAS (COUNT-UP)
    const metricNumbers = document.querySelectorAll('.metric-number');
    let animatedMetrics = false;

    function animateCounters() {
        const duration = 1800; // ms de animación
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing: easeOutExpo para una desaceleración suave y prémium
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

            metricNumbers.forEach(el => {
                const target = parseInt(el.getAttribute('data-target'), 10) || 0;
                const prefix = el.getAttribute('data-prefix') || '';
                const currentVal = Math.round(target * easeProgress);
                el.textContent = `${prefix}${currentVal}`;
            });

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    const metricsSection = document.querySelector('.hackatob-metrics-section');
    if (metricsSection && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animatedMetrics) {
                    animatedMetrics = true;
                    animateCounters();
                }
            });
        }, { threshold: 0.25 });

        observer.observe(metricsSection);
    } else {
        animateCounters();
    }
});
