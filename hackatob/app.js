document.addEventListener('DOMContentLoaded', () => {
    // 1. ROTADOR DE FRASES DEL HACKATOB (BILINGÜE ES / EN)
    const HACK_PHRASES_ES = [
        "Innova. Conecta. Transforma.",
        "Convierte ideas en soluciones",
        "Transformación",
        "Tecnología",
        "17 al 20 de agosto",
        "4 días de aprendizaje",
        "Instituto Tecnológico de Costa Rica"
    ];

    const HACK_PHRASES_EN = [
        "Innovate. Connect. Transform.",
        "Turn ideas into solutions",
        "Transformation",
        "Technology",
        "August 17 to 20",
        "4 days of learning",
        "Costa Rica Institute of Technology"
    ];

    let currentPhrases = (localStorage.getItem('tob_lang') === 'en') ? HACK_PHRASES_EN : HACK_PHRASES_ES;

    const DISPLAY_TIME = 2200; // ms que se muestra cada frase
    const TRANSITION_TIME = 400; // ms de la animación de salida
    const phraseEl = document.getElementById('hackRotatorPhrase');

    if (phraseEl) {
        let currentIndex = 0;

        function showPhrase(index) {
            phraseEl.textContent = currentPhrases[index % currentPhrases.length];
            phraseEl.classList.remove('leaving');
            void phraseEl.offsetWidth; // Forzar reflow para reiniciar la animación
            phraseEl.classList.add('entering');
        }

        function nextPhrase() {
            phraseEl.classList.remove('entering');
            phraseEl.classList.add('leaving');
            setTimeout(() => {
                currentIndex = (currentIndex + 1) % currentPhrases.length;
                showPhrase(currentIndex);
            }, TRANSITION_TIME);
        }

        showPhrase(0);
        setInterval(nextPhrase, DISPLAY_TIME + TRANSITION_TIME);

        window.addEventListener('languageChanged', (e) => {
            const lang = e.detail?.lang || localStorage.getItem('tob_lang') || 'es';
            currentPhrases = (lang === 'en') ? HACK_PHRASES_EN : HACK_PHRASES_ES;
            showPhrase(currentIndex);
        });
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

    // 4. INTERACTIVIDAD DEL PROGRAMA / AGENDA DE 4 DÍAS
    const hackTabs = document.querySelectorAll('.hack-schedule-tab');
    hackTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetDayId = tab.getAttribute('aria-controls');
            if (targetDayId) {
                switchHackDay(targetDayId);
            }
        });
    });

    // 5. SECCIÓN FAQ INTERACTIVA (STACK DE TARJETAS CON DRAG-TO-DISMISS)
    initFaqStack();
});

// FUNCIÓN GLOBAL PARA CAMBIAR DE DÍA EN LA AGENDA HACKATOB
function switchHackDay(dayId) {
    const targetDay = document.getElementById(dayId);
    if (!targetDay) return;

    // 1. Desactivar todos los contenedores de días
    const allDays = document.querySelectorAll('.hack-schedule-day');
    allDays.forEach(day => {
        day.classList.remove('active-day');
    });

    // 2. Desactivar todos los botones de tabs
    const allTabs = document.querySelectorAll('.hack-schedule-tab');
    allTabs.forEach(tab => {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
    });

    // 3. Activar el día seleccionado
    targetDay.classList.add('active-day');

    // 4. Activar la tab correspondiente
    const activeTab = document.querySelector(`.hack-schedule-tab[aria-controls="${dayId}"]`) || document.getElementById(`hack-tab-${dayId.replace('hack-', '')}`);
    if (activeTab) {
        activeTab.classList.add('active');
        activeTab.setAttribute('aria-selected', 'true');
    }

    // 5. Animar de forma escalonada los items del timeline
    const timelineItems = targetDay.querySelectorAll('.hack-timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(12px)';
        item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';

        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 60);
    });
}

// ==========================================================================
// 6. FAQ INTERACTIVO CON MAZO DE TARJETAS APILADAS (DRAG-TO-DISMISS)
// ==========================================================================
function initFaqStack() {
    const deckWrapper = document.getElementById('faqDeckWrapper');
    const stackContainer = document.getElementById('faqStackContainer');
    const dotsWrapper = document.getElementById('faqDotsWrapper');
    const prevBtn = document.getElementById('faqPrevBtn');
    const nextBtn = document.getElementById('faqNextBtn');

    if (!stackContainer) return;

    const cards = Array.from(stackContainer.querySelectorAll('.faq-stack-card'));
    const totalCards = cards.length;
    if (totalCards === 0) return;

    let currentIndex = 0;
    let isDragging = false;
    let isAnimating = false;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let startTime = 0;
    let currentPointerId = null;

    // Generar dots de navegación accesibles
    if (dotsWrapper) {
        dotsWrapper.innerHTML = '';
        cards.forEach((_, idx) => {
            const dot = document.createElement('button');
            dot.className = `faq-dot ${idx === 0 ? 'active' : ''}`;
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', `Ir a pregunta ${idx + 1} de ${totalCards}`);
            dot.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
            dot.addEventListener('click', () => {
                if (isAnimating || currentIndex === idx) return;
                goToCard(idx);
            });
            dotsWrapper.appendChild(dot);
        });
    }

    // Configuración de las posiciones de la pila (Stack visual con cartas asomando)
    const STACK_CONFIG = [
        { translateY: 0, translateZ: 0, scale: 1, rotate: 0, opacity: 1, zIndex: 10, brightness: 1 },
        { translateY: 20, translateZ: -35, scale: 0.94, rotate: 2.5, opacity: 0.88, zIndex: 9, brightness: 0.92 },
        { translateY: 38, translateZ: -70, scale: 0.88, rotate: -2, opacity: 0.62, zIndex: 8, brightness: 0.82 },
        { translateY: 54, translateZ: -105, scale: 0.82, rotate: 1.2, opacity: 0.35, zIndex: 7, brightness: 0.72 }
    ];

    // Ajustar altura del contenedor dinámicamente según la tarjeta activa
    function updateContainerHeight() {
        const activeCard = cards[currentIndex];
        if (activeCard) {
            const cardHeight = activeCard.offsetHeight;
            stackContainer.style.minHeight = `${Math.max(cardHeight + 65, 290)}px`;
        }
    }

    // Actualizar la apariencia y posiciones de todas las tarjetas
    function updateStack(immediate = false) {
        cards.forEach((card, i) => {
            const diff = (i - currentIndex + totalCards) % totalCards;

            // Limpiar clases de estado
            card.classList.remove('is-dragging', 'is-flying-out');

            if (immediate) {
                card.style.transition = 'none';
            } else {
                card.style.transition = 'transform 0.45s cubic-bezier(0.34, 1.45, 0.64, 1), opacity 0.4s cubic-bezier(0.25, 1, 0.5, 1), filter 0.4s ease, box-shadow 0.4s ease';
            }

            if (diff < STACK_CONFIG.length) {
                const conf = STACK_CONFIG[diff];
                card.style.transform = `translate3d(0, ${conf.translateY}px, ${conf.translateZ}px) scale(${conf.scale}) rotate(${conf.rotate}deg)`;
                card.style.opacity = `${conf.opacity}`;
                card.style.zIndex = `${conf.zIndex}`;
                card.style.filter = `brightness(${conf.brightness})`;
                card.style.pointerEvents = diff === 0 ? 'auto' : 'none';
                card.setAttribute('aria-hidden', diff === 0 ? 'false' : 'true');
            } else {
                // Tarjetas ocultas en el fondo
                card.style.transform = 'translate3d(0, 70px, -140px) scale(0.76) rotate(0deg)';
                card.style.opacity = '0';
                card.style.zIndex = '1';
                card.style.filter = 'brightness(0.6)';
                card.style.pointerEvents = 'none';
                card.setAttribute('aria-hidden', 'true');
            }
        });

        // Actualizar dots
        if (dotsWrapper) {
            const dots = dotsWrapper.querySelectorAll('.faq-dot');
            dots.forEach((dot, idx) => {
                const isActive = idx === currentIndex;
                dot.classList.toggle('active', isActive);
                dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });
        }

        updateContainerHeight();
    }

    // Avanzar a la siguiente pregunta (descartar carta activa)
    function nextCard(direction = -1) {
        if (isAnimating) return;
        isAnimating = true;

        const activeCard = cards[currentIndex];
        if (!activeCard) return;

        const flyX = direction * (window.innerWidth > 600 ? window.innerWidth * 0.75 + 200 : window.innerWidth + 150);
        const flyRot = direction * 28;

        activeCard.classList.add('is-flying-out');
        activeCard.style.transform = `translate3d(${flyX}px, 20px, 0) rotate(${flyRot}deg) scale(0.95)`;
        activeCard.style.opacity = '0';

        setTimeout(() => {
            activeCard.classList.remove('is-flying-out');
            currentIndex = (currentIndex + 1) % totalCards;
            isAnimating = false;
            updateStack();
        }, 340);
    }

    // Volver a la pregunta anterior
    function prevCard() {
        if (isAnimating) return;
        isAnimating = true;

        const prevIndex = (currentIndex - 1 + totalCards) % totalCards;
        const incomingCard = cards[prevIndex];

        incomingCard.style.transition = 'none';
        incomingCard.style.transform = 'translate3d(-200px, -15px, 50px) scale(0.92) rotate(-15deg)';
        incomingCard.style.opacity = '0';
        incomingCard.style.zIndex = '12';
        incomingCard.setAttribute('aria-hidden', 'false');

        void incomingCard.offsetWidth; // Forzar reflow

        currentIndex = prevIndex;
        updateStack();

        setTimeout(() => {
            isAnimating = false;
        }, 450);
    }

    // Saltar a una pregunta específica
    function goToCard(targetIndex) {
        if (isAnimating || targetIndex === currentIndex) return;
        currentIndex = targetIndex;
        updateStack();
    }

    // ==========================================
    // GESTOS POINTER EVENTS (MOUSE & TOUCH DRAG)
    // ==========================================
    function onPointerDown(e) {
        // Solo responder si se interactúa con la carta frontal activa
        const activeCard = cards[currentIndex];
        if (isAnimating || !activeCard || e.target.closest('.faq-ctrl-btn') || e.target.closest('.faq-dot')) {
            return;
        }

        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        currentX = e.clientX;
        currentY = e.clientY;
        startTime = performance.now();
        currentPointerId = e.pointerId;

        try {
            activeCard.setPointerCapture(e.pointerId);
        } catch (err) {
            // Manejo silencioso en navegadores sin soporte completo
        }

        activeCard.classList.add('is-dragging');
    }

    function onPointerMove(e) {
        if (!isDragging) return;

        currentX = e.clientX;
        currentY = e.clientY;

        const deltaX = currentX - startX;
        const deltaY = (currentY - startY) * 0.25; // amortiguación vertical
        const cardWidth = cards[currentIndex].offsetWidth || 500;
        const rotation = (deltaX / cardWidth) * 18; // rotación física proporcional

        const activeCard = cards[currentIndex];
        activeCard.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0) rotate(${rotation}deg) scale(1.02)`;

        // Opacidad sutil mientras se aleja
        const pullProgress = Math.min(Math.abs(deltaX) / (cardWidth * 0.8), 1);
        activeCard.style.opacity = `${1 - pullProgress * 0.35}`;

        // Efecto físico sutil en la siguiente tarjeta del stack
        const nextIndex = (currentIndex + 1) % totalCards;
        const nextCardEl = cards[nextIndex];
        if (nextCardEl) {
            const nextProgress = Math.min(Math.abs(deltaX) / 220, 1);
            const nextY = 20 - (nextProgress * 14);
            const nextScale = 0.94 + (nextProgress * 0.04);
            const nextRot = 2.5 - (nextProgress * 2);
            nextCardEl.style.transform = `translate3d(0, ${nextY}px, -20px) scale(${nextScale}) rotate(${nextRot}deg)`;
            nextCardEl.style.opacity = `${0.88 + nextProgress * 0.1}`;
        }
    }

    function onPointerUp(e) {
        if (!isDragging) return;
        isDragging = false;

        const activeCard = cards[currentIndex];
        activeCard.classList.remove('is-dragging');

        if (currentPointerId !== null) {
            try {
                activeCard.releasePointerCapture(currentPointerId);
            } catch (err) {}
            currentPointerId = null;
        }

        const deltaX = currentX - startX;
        const deltaY = currentY - startY;
        const elapsed = performance.now() - startTime;
        const velocityX = Math.abs(deltaX) / (elapsed || 1);
        const cardWidth = activeCard.offsetWidth || 500;
        const threshold = Math.min(100, cardWidth * 0.25);

        // Si pasó el umbral de distancia o velocidad (flick rápido) -> Descartar
        if (Math.abs(deltaX) > threshold || (Math.abs(deltaX) > 40 && velocityX > 0.45)) {
            const direction = deltaX >= 0 ? 1 : -1;
            nextCard(direction);
        } else {
            // Si no pasó el umbral -> Regresar suavemente con rebote (spring easing)
            activeCard.style.transition = 'transform 0.48s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease';
            activeCard.style.transform = 'translate3d(0, 0, 0) scale(1) rotate(0deg)';
            activeCard.style.opacity = '1';

            // Restaurar siguiente tarjeta
            const nextIndex = (currentIndex + 1) % totalCards;
            const nextCardEl = cards[nextIndex];
            if (nextCardEl) {
                nextCardEl.style.transition = 'transform 0.45s ease, opacity 0.4s ease';
                nextCardEl.style.transform = `translate3d(0, ${STACK_CONFIG[1].translateY}px, ${STACK_CONFIG[1].translateZ}px) scale(${STACK_CONFIG[1].scale}) rotate(${STACK_CONFIG[1].rotate}deg)`;
                nextCardEl.style.opacity = `${STACK_CONFIG[1].opacity}`;
            }

            setTimeout(() => {
                activeCard.style.transition = '';
                if (nextCardEl) nextCardEl.style.transition = '';
            }, 500);
        }
    }

    // Vincular eventos de pointer al contenedor
    stackContainer.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    // Botones de control
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            prevCard();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            nextCard(-1);
        });
    }

    // Soporte de navegación por teclado accesible
    function handleKeydown(e) {
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextCard(-1);
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevCard();
        } else if (e.key === 'Enter' || e.key === ' ') {
            if (document.activeElement === deckWrapper) {
                e.preventDefault();
                nextCard(-1);
            }
        }
    }

    if (deckWrapper) {
        deckWrapper.addEventListener('keydown', handleKeydown);
    }

    window.addEventListener('resize', () => {
        updateContainerHeight();
    });

    // Iniciar el stack visual
    updateStack(true);
}

