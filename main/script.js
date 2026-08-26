console.log("%c¡Alto ahí!", "color: red; font-size: 50px; font-weight: bold; text-shadow: 2px 2px 0 #000;");
console.log("%cEsta es una función del navegador pensada para desarrolladores. Si alguien te indicó que copiaras y pegaras algo aquí, se trata de un ataque (Self-XSS) que le dará acceso a tu sesión o datos.", "font-size: 16px;");

document.addEventListener('DOMContentLoaded', () => {
    // Switch de idioma (ES/EN)
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            const texts = langToggle.querySelectorAll('.lang-text');
            const isES = texts[0].classList.contains('active');

            if (isES) {
                // Cambiar a EN
                texts[0].classList.remove('active');
                texts[1].classList.add('active');
                langToggle.setAttribute('data-lang', 'EN');
            } else {
                // Cambiar a ES
                texts[1].classList.remove('active');
                texts[0].classList.add('active');
                langToggle.setAttribute('data-lang', 'ES');
            }
        });
    }

    // Efecto transparente en hero, fondo sólido al bajar
    const navbar = document.getElementById('navbar');
    const heroSection = document.getElementById('hero');

    if (navbar) {
        const updateNavbar = () => {
            const heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;
            if (window.scrollY > heroHeight - 80) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', updateNavbar);
        updateNavbar(); // Ejecutar al cargar
    }



    // Lógica del menú hamburguesa
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileNav.classList.toggle('open');
        });
    }

    // Switch de idioma para móvil
    const langToggleMobile = document.getElementById('langToggleMobile');
    if (langToggleMobile) {
        langToggleMobile.addEventListener('click', () => {
            const texts = langToggleMobile.querySelectorAll('.lang-text');
            const isES = texts[0].classList.contains('active');

            if (isES) {
                texts[0].classList.remove('active');
                texts[1].classList.add('active');
                langToggleMobile.setAttribute('data-lang', 'EN');
                // Sincronizar con el principal
                if (langToggle && langToggle.getAttribute('data-lang') === 'ES') {
                    langToggle.click();
                }
            } else {
                texts[1].classList.remove('active');
                texts[0].classList.add('active');
                langToggleMobile.setAttribute('data-lang', 'ES');
                // Sincronizar con el principal
                if (langToggle && langToggle.getAttribute('data-lang') === 'EN') {
                    langToggle.click();
                }
            }
        });
    }

    // LÍNEA ROTATIVA DEL HERO
    const DISPLAY_TIME = 2000; // ms que se muestra cada frase (ajustar aquí)
    const TRANSITION_TIME = 400; // ms de la animación de salida (debe coincidir con phrase-leave en CSS)

    const phraseEl = document.getElementById('rotatorPhrase');
    if (phraseEl) {
        let PHRASES = [];
        let currentIndex = 0;

        const updatePhrases = () => {
            const lang = localStorage.getItem('tob_lang') || 'es';
            // Wait, we need to access translations object from lang.js which is loaded globally
            // translations[lang] exists because lang.js is loaded first
            const t = translations[lang] || translations.es;
            PHRASES = [
                { text: t.phrase_1 },
                { text: t.phrase_2 },
                { text: t.phrase_3 },
                { text: t.phrase_4 },
                { text: t.phrase_5 },
                { html: t.phrase_6 },
                { text: t.phrase_7 },
                { text: t.phrase_8 },
                { text: t.phrase_9 },
            ];
        };
        updatePhrases();

        window.addEventListener('languageChanged', () => {
            updatePhrases();
            showPhrase(currentIndex);
        });

        function showPhrase(index) {
            const phrase = PHRASES[index];
            if (!phrase) return;
            if (phrase.html) {
                phraseEl.innerHTML = phrase.html;
            } else {
                phraseEl.textContent = phrase.text;
            }
            phraseEl.classList.remove('leaving');
            void phraseEl.offsetWidth; // Forzar reflow para reiniciar la animación
            phraseEl.classList.add('entering');
        }

        function nextPhrase() {
            phraseEl.classList.remove('entering');
            phraseEl.classList.add('leaving');
            setTimeout(() => {
                currentIndex = (currentIndex + 1) % PHRASES.length;
                showPhrase(currentIndex);
            }, TRANSITION_TIME);
        }

        // Mostrar primera frase y arrancar el ciclo
        showPhrase(0);
        setInterval(nextPhrase, DISPLAY_TIME + TRANSITION_TIME);
    }

    // LÓGICA DEL HERO Y SISTEMA SOLAR
    // Contador de tiempo (hasta 18 agosto 2026 09:15:00)
    const countdownDate = new Date("August 18, 2026 09:15:00").getTime();
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    if (daysEl && hoursEl && minutesEl && secondsEl) {
        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = countdownDate - now;

            if (distance < 0) {
                // Evento ya empezó
                daysEl.innerText = "00";
                hoursEl.innerText = "00";
                minutesEl.innerText = "00";
                secondsEl.innerText = "00";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            daysEl.innerText = days < 10 ? "0" + days : days;
            hoursEl.innerText = hours < 10 ? "0" + hours : hours;
            minutesEl.innerText = minutes < 10 ? "0" + minutes : minutes;
            secondsEl.innerText = seconds < 10 ? "0" + seconds : seconds;
        };

        updateCountdown(); // Llamada inicial
        setInterval(updateCountdown, 1000); // Actualizar cada segundo
    }

    // Efecto parallax con el mouse para el sistema solar
    const solarSystem = document.getElementById('solarSystem');


    if (solarSystem && heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calcular el centro de la sección hero
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calcular la rotación en base a la distancia del centro (máximo 15 grados)
            const rotateX = ((y - centerY) / centerY) * -15;
            const rotateY = ((x - centerX) / centerX) * 15;

            // Aplicar transformación
            solarSystem.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        // Al sacar el mouse, volver al centro suavemente
        heroSection.addEventListener('mouseleave', () => {
            solarSystem.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
            solarSystem.style.transition = `transform 0.5s ease-out`;

            // Quitar transición después para que el movimiento del mouse sea responsivo de nuevo
            setTimeout(() => {
                solarSystem.style.transition = `transform 0.1s ease-out`;
            }, 500);
        });
    }

    // Animación de giro 3D / moneda al hacer clic o tocar el logo (isotipo)
    const heroLogo = document.getElementById('heroLogo');
    if (heroLogo) {
        const triggerSpin = () => {
            if (!heroLogo.classList.contains('coin-spin')) {
                heroLogo.classList.add('coin-spin');

                // Quitar clase después de la animación para poder repetirlo
                setTimeout(() => {
                    heroLogo.classList.remove('coin-spin');
                }, 1000);
            }
        };

        heroLogo.addEventListener('click', triggerSpin);
        heroLogo.addEventListener('touchstart', triggerSpin, { passive: true });
    }

    // Interactividad de planetas (atenuar los demás al hacer clic)
    const planets = document.querySelectorAll('.planet');
    const orbits = document.querySelectorAll('.orbit');

    if (planets.length > 0) {
        planets.forEach(planet => {
            planet.addEventListener('click', (e) => {
                e.stopPropagation(); // Evitar que el click llegue al document

                // Si ya estaba seleccionado, resetear todo
                if (planet.classList.contains('highlighted')) {
                    resetPlanets();
                    return;
                }

                // Resetear todos primero
                resetPlanets();

                // Aplicar estado seleccionado a este planeta
                planet.classList.add('highlighted');

                // Atenuar a los demás
                orbits.forEach(orbit => {
                    // Si el planeta clickeado no está dentro de esta órbita, atenuar la órbita completa
                    if (!orbit.contains(planet)) {
                        orbit.classList.add('dimmed');
                    }
                });

                // Atenuar también el sol (opcional, para resaltar más la palabra)
                if (heroLogo) heroLogo.classList.add('dimmed');
            });
        });

        // Clic fuera de los planetas resetea todo
        document.addEventListener('click', resetPlanets);

        function resetPlanets() {
            planets.forEach(p => p.classList.remove('highlighted'));
            orbits.forEach(o => o.classList.remove('dimmed'));
            if (heroLogo) heroLogo.classList.remove('dimmed');
        }
    }

    // PANTALLA DE CARGA
    // Bloquear el scroll mientras carga
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        const loader = document.getElementById("loader-wrapper");
        if (loader) {
            loader.classList.add("loader-hidden");
            // Restaurar el scroll
            document.body.style.overflow = '';
        }
    }, 1500);

    // ANIMACIÓN SCROLL REVEAL Y CONTADORES (ABOUT)
    function animateCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(numEl => {
            if (numEl.classList.contains('counted')) return;
            numEl.classList.add('counted');

            const target = parseInt(numEl.getAttribute('data-target'), 10);
            const suffix = numEl.getAttribute('data-suffix') || '';
            const duration = 2400; // 4s para que se aprecie cada número
            const startTime = performance.now();

            function updateCount(currentTime) {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);

                // Curva de progreso suave para apreciar la subida de números
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const currentVal = Math.floor(easeOut * target);

                numEl.textContent = currentVal + suffix;

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    numEl.textContent = target + suffix;
                }
            }

            requestAnimationFrame(updateCount);
        });
    }

    const aboutContainer = document.querySelector('.about-container');
    if (aboutContainer) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-active');
                    // Iniciar los contadores justo cuando aparecen los cuadros (Paso 3)
                    setTimeout(() => {
                        animateCounters();
                    }, 500);
                }
            });
        }, { threshold: 0.15 });

        observer.observe(aboutContainer);
    }

    // ★ STAR TRAIL CURSOR GLOBAL
    if (window.matchMedia('(pointer: fine)').matches) {

        const starCanvas = document.getElementById('globalStarCanvas');

        if (starCanvas) {
            const ctx = starCanvas.getContext('2d');

            function resizeCanvas() {
                starCanvas.width = window.innerWidth;
                starCanvas.height = window.innerHeight;
            }
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);

            const MAX_PARTICLES = 100;
            const SPAWN_PER_MOVE = 2;
            const LIFETIME_MIN = 500;
            const LIFETIME_MAX = 800;
            const COLORS = ['255,255,255', '33,208,255', '4,116,196'];

            let particles = [];
            let rafId = null;
            let isMouseIn = false;

            function spawnParticles(x, y) {
                if (particles.length >= MAX_PARTICLES) return;
                const count = Math.min(SPAWN_PER_MOVE, MAX_PARTICLES - particles.length);
                for (let i = 0; i < count; i++) {
                    const lifetime = LIFETIME_MIN + Math.random() * (LIFETIME_MAX - LIFETIME_MIN);
                    particles.push({
                        x: x + (Math.random() - 0.5) * 6,
                        y: y + (Math.random() - 0.5) * 6,
                        radius: 1.5 + Math.random() * 2,
                        color: COLORS[Math.floor(Math.random() * COLORS.length)],
                        alpha: 0.7 + Math.random() * 0.3,
                        vx: (Math.random() - 0.5) * 0.6,
                        vy: -0.3 - Math.random() * 0.5,
                        born: performance.now(),
                        lifetime,
                    });
                }
            }

            function drawFrame(now) {
                ctx.clearRect(0, 0, starCanvas.width, starCanvas.height);

                particles = particles.filter(p => {
                    const age = now - p.born;
                    const progress = age / p.lifetime;
                    if (progress >= 1) return false;

                    const alpha = p.alpha * (1 - progress);

                    ctx.save();
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = `rgba(${p.color}, ${alpha})`;
                    ctx.fillStyle = `rgba(${p.color}, ${alpha})`;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();

                    p.x += p.vx;
                    p.y += p.vy;

                    return true;
                });

                if (isMouseIn || particles.length > 0) {
                    rafId = requestAnimationFrame(drawFrame);
                } else {
                    rafId = null;
                }
            }

            function startLoop() {
                if (!rafId) {
                    rafId = requestAnimationFrame(drawFrame);
                }
            }

            const heroSection = document.getElementById('hero');
            if (heroSection) {
                heroSection.addEventListener('mousemove', (e) => {
                    isMouseIn = true;
                    startLoop();
                    spawnParticles(e.clientX, e.clientY);
                });

                heroSection.addEventListener('mouseleave', () => {
                    isMouseIn = false;
                });
            }
        }
    }

    // EFECTO TERMINAL TYPEWRITER (WHY ATTEND)
    const typewriterText = document.getElementById('typewriterText');
    const terminalWindow = document.getElementById('terminalWindow');

    if (typewriterText && terminalWindow) {
        // Función para obtener el texto actual según el idioma
        const getTerminalText = () => {
            const currentLang = localStorage.getItem('tob_lang') || 'es';
            if (currentLang === 'en') {
                return "Technology on Business (ToB) is a unique opportunity in Costa Rica for students, professionals, entrepreneurs, and tech enthusiasts who want to boost their personal and professional growth. Over two days, you will learn from industry experts, discover the trends transforming the world, strengthen your skills, and connect with people who share your interests.\n\nFurthermore, ToB 2026 is a completely free event open to the public, providing access to top-tier conferences, experiences, and networking.\n\nIf you are looking to learn, get inspired, and build connections that will drive your future, this is the place to do it.";
            } else {
                return "Technology on Business (ToB) es una oportunidad única en Costa Rica para estudiantes, profesionales, emprendedores y apasionados por la tecnología que desean impulsar su crecimiento personal y profesional. Durante dos días podrás aprender de expertos de la industria, descubrir las tendencias que transforman el mundo, fortalecer tus habilidades y conectar con personas que comparten tus intereses.\n\nAdemás, ToB 2026 es un evento completamente gratuito y abierto al público, brindando acceso a conferencias, experiencias y networking de alto nivel.\n\nSi buscas aprender, inspirarte y construir conexiones que impulsen tu futuro, este es el lugar para hacerlo.";
            }
        };

        let fullText = getTerminalText();
        let index = 0;
        let isTyping = false;
        let typingTimeout = null;

        // Escuchar cambios de idioma para actualizar en tiempo real
        window.addEventListener('languageChanged', (e) => {
            fullText = getTerminalText();
            if (isTyping) {
                if (index >= fullText.length) {
                    typewriterText.textContent = fullText;
                } else {
                    typewriterText.textContent = fullText.substring(0, index);
                }
            }
        });

        function typeWriter() {
            if (index < fullText.length) {
                typewriterText.textContent += fullText.charAt(index);
                index++;
                // Velocidad de tipeo variable (simula a un humano tecleando en terminal)
                const delay = Math.random() * 25 + 15;
                typingTimeout = setTimeout(typeWriter, delay);
            }
        }

        function restartTypewriter() {
            if (typingTimeout) clearTimeout(typingTimeout);
            typewriterText.textContent = '';
            index = 0;
            setTimeout(typeWriter, 400); // Pequeña pausa antes de reiniciar
        }

        // IntersectionObserver para activar el efecto solo cuando la terminal es visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !isTyping) {
                    isTyping = true;
                    // Breve pausa para simular el enter del comando
                    setTimeout(typeWriter, 600);
                    observer.unobserve(terminalWindow);
                }
            });
        }, { threshold: 0.4 });

        observer.observe(terminalWindow);

        // --- LÓGICA DE BOTONES DEL TERMINAL ---
        const termCloseBtn = document.getElementById('termCloseBtn');
        const termMinBtn = document.getElementById('termMinBtn');
        const termMaxBtn = document.getElementById('termMaxBtn');
        const sysErrorModal = document.getElementById('sysErrorModal');
        const sysErrorCloseBtn = document.getElementById('sysErrorCloseBtn');

        // Botón Rojo (Cerrar) -> Muestra Modal de Error
        if (termCloseBtn && sysErrorModal) {
            termCloseBtn.addEventListener('click', () => {
                sysErrorModal.classList.add('active');
            });
        }

        // Botón del Modal para cerrar el error
        if (sysErrorCloseBtn && sysErrorModal) {
            sysErrorCloseBtn.addEventListener('click', () => {
                sysErrorModal.classList.remove('active');
            });
        }

        // Botón Amarillo (Minimizar) -> Quita maximizado si lo tiene y reinicia el texto
        if (termMinBtn) {
            termMinBtn.addEventListener('click', () => {
                terminalWindow.classList.remove('maximized');
                restartTypewriter();
            });
        }

        // Botón Verde (Maximizar) -> Alterna maximizado y reinicia el texto
        if (termMaxBtn) {
            termMaxBtn.addEventListener('click', () => {
                terminalWindow.classList.toggle('maximized');
                restartTypewriter();
            });
        }
    }

    // Botón de registro con animación de avión de papel
    const btnPaperPlane = document.getElementById('btnPaperPlane');
    const planeIcon = document.getElementById('planeIcon');
    let isRegistering = false;

    if (btnPaperPlane && planeIcon) {
        btnPaperPlane.addEventListener('click', (e) => {
            e.preventDefault();

            if (isRegistering) return; // Debounce
            isRegistering = true;

            // Animar el avión
            planeIcon.classList.add('flying');

            // Redirigir tras finalizar la animación (~800ms)
            setTimeout(() => {
                // Cambiar por la URL final si es necesario (ej: Lu.ma)
                window.open('https://luma.com/technologyonbusiness', '_blank');

                // Resetear estado después de redirigir
                setTimeout(() => {
                    planeIcon.classList.remove('flying');
                    isRegistering = false;
                }, 500);
            }, 800);
        });
    }

    // BACK TO TOP (FOOTER)
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // LÓGICA DE SPEAKERS (Expositores)
    const speakersData = [
        { foto: "../imagenes/speakers/speaker01.webp", nombre: "Pedro Gutiérrez", puesto: "Avify", descripcion: "CEO de Avify. Compartirá el camino de construir una startup.", linkedin: "https://www.linkedin.com/in/peter-gg/", instagram: "#", charla: "Empresa de 0 a 1M" },
        { foto: "../imagenes/speakers/speaker02.webp", nombre: "Tamara Sancho", puesto: "P&G", descripcion: "Transformando el miedo en una herramienta de crecimiento profesional.", linkedin: "https://www.linkedin.com/in/tamarajudit/", instagram: "#", charla: "Extraordinary Fears" },
        { foto: "../imagenes/speakers/speaker03.webp", nombre: "Pilar Sánchez", puesto: "Avify", descripcion: "Líder de la industria compartiendo su visión en resiliencia.", linkedin: "https://www.linkedin.com/in/tamarajudit/?locale=Pilar%20S%C3%A1nchez%20Avify", instagram: "#", charla: "Panel Mujeres en Tech" },
        { foto: "../imagenes/speakers/speaker04.webp", nombre: "Wendy Badilla", puesto: "Microsoft", descripcion: "Experta de Microsoft enfocada en empoderamiento femenino en STEM.", linkedin: "https://www.linkedin.com/in/wendy-badilla-225630a0/", instagram: "#", charla: "Panel Mujeres en Tech" },
        { foto: "../imagenes/speakers/speaker05.webp", nombre: "Aaron Omodeo", puesto: "Doji Club", descripcion: "Especialista en finanzas prácticas y toma de decisiones de inversión.", linkedin: "https://www.linkedin.com/in/aaron-omodeo/", instagram: "#", charla: "Finanzas personales en inversiones" },
        { foto: "../imagenes/speakers/speaker12.webp", nombre: "Diego Loud", puesto: "Loud", descripcion: "Estrategias de mercadeo para conectar con audiencias saturadas.", linkedin: "https://www.linkedin.com/in/diegomartinezj/", instagram: "#", charla: "Mercadeo en la era digital" },
        { foto: "../imagenes/speakers/speaker07.webp", nombre: "María José Artavia", puesto: "Directora", descripcion: "Directora dando apertura oficial a TOB-ATI 2026.", linkedin: "#", instagram: "#", charla: "Inauguración" },
        { foto: "../imagenes/speakers/speaker08.webp", nombre: "Alek Castillo", puesto: "Lyfter", descripcion: "Experta en liderazgo adaptativo en entornos de cambio acelerado.", linkedin: "#", instagram: "#", charla: "Liderazgo en la era de la transformación digital" },
        { foto: "../imagenes/speakers/speaker09.webp", nombre: "Alejandro Hidalgo", puesto: "P&G", descripcion: "Aplicación de metodologías ágiles para entregar valor más rápido.", linkedin: "#", instagram: "#", charla: "Metodologías ágiles" },
        { foto: "../imagenes/speakers/speaker10.webp", nombre: "Gerardo Nájera", puesto: "Sefisa", descripcion: "Estrategias de ciberseguridad para proteger información vital.", linkedin: "#", instagram: "#", charla: "Ciberseguridad" },
        { foto: "../imagenes/speakers/speaker11.webp", nombre: "Karla Córdoba", puesto: "Aso Blockchain CR", descripcion: "Aplicaciones reales de la confianza digital más allá de cripto.", linkedin: "#", instagram: "#", charla: "Blockchain" },
        { foto: "../imagenes/speakers/speaker13.webp", nombre: "Ronald Arce", puesto: "INCAE", descripcion: "Cómo la IA está redefiniendo los modelos de negocio.", linkedin: "#", instagram: "#", charla: "IA" }
    ];

    const speakersGrid = document.getElementById('speakersGrid');
    const btnMoreSpeakers = document.getElementById('btn-more-speakers');

    function renderSpeakerCard(speaker, index, isHidden = false) {
        const hiddenClass = isHidden ? 'style="display:none;"' : '';
        const i18nId = String(index + 1).padStart(2, '0');

        return `
            <div class="speaker-simple-card" data-index="${index}" ${hiddenClass}>
                <div class="speaker-avatar-wrap">
                    <img src="${speaker.foto}" alt="${speaker.nombre}" class="speaker-avatar" loading="lazy">
                </div>
                <h3 class="speaker-simple-name" data-i18n="speaker_${i18nId}_name">${speaker.nombre}</h3>
                <p class="speaker-simple-role" data-i18n="speaker_${i18nId}_role">${speaker.puesto}</p>
            </div>
        `;
    }

    if (speakersGrid) {
        // Generar HTML, mostrando 6 tarjetas en la página principal
        const showAll = speakersGrid.hasAttribute('data-show-all');
        const cardsHTML = speakersData.map((sp, i) => renderSpeakerCard(sp, i, showAll ? false : i >= 6)).join('');
        speakersGrid.innerHTML = cardsHTML;
    }

    if (speakersGrid) {
        // Generar HTML, ocultando las tarjetas más allá del índice 5 si no tiene el atributo data-show-all
        const showAll = speakersGrid.hasAttribute('data-show-all');
        const cardsHTML = speakersData.map((sp, i) => renderSpeakerCard(sp, i, showAll ? false : i >= 6)).join('');
        speakersGrid.innerHTML = cardsHTML;
    }

    // MAPBOX E INTERACCIÓN DE UBICACIÓN (SCROLL ZOOM)
    const locationWrapper = document.getElementById('ubicacion');
    const layerEarth = document.getElementById('layerEarth');
    const layerContent = document.getElementById('layerContent');

    if (locationWrapper) {
        let isTicking = false;

        function updateLocationAnimation() {
            let rect = locationWrapper.getBoundingClientRect();
            let scrollDistance = rect.height - window.innerHeight;

            // Protección contra caché de CSS o fallos de cálculo (scrollDistance = 0 causa NaN)
            if (scrollDistance <= 0) {
                locationWrapper.style.height = '250vh';
                rect = locationWrapper.getBoundingClientRect();
                scrollDistance = rect.height - window.innerHeight;
            }

            // Progreso del 0 al 1
            let progress = -rect.top / scrollDistance;
            progress = Math.max(0, Math.min(1, progress));

            // --- TIERRA ---
            let earthScale = 1 + (progress * 4);
            let earthOpacity = 1;
            if (progress > 0.6) earthOpacity = 1 - ((progress - 0.6) / 0.4);

            // --- CONTENIDO FINAL ---
            let contentOpacity = 0;
            if (progress > 0.6) {
                contentOpacity = (progress - 0.6) / 0.4;
            }

            // Aplicar estilos defensivamente
            if (layerEarth) {
                layerEarth.style.transform = `scale(${earthScale})`;
                layerEarth.style.opacity = Math.max(0, Math.min(1, earthOpacity));
            }

            if (layerContent) {
                layerContent.style.opacity = Math.max(0, Math.min(1, contentOpacity));
                layerContent.style.pointerEvents = progress > 0.9 ? 'auto' : 'none';
            }

            isTicking = false;
        }

        window.addEventListener('scroll', () => {
            const rect = locationWrapper.getBoundingClientRect();
            if (rect.top <= window.innerHeight && rect.bottom >= 0) {
                if (!isTicking) {
                    requestAnimationFrame(updateLocationAnimation);
                    isTicking = true;
                }
            }
        });

        updateLocationAnimation();
    }

    if (typeof applyTranslations === 'function') {
        applyTranslations(localStorage.getItem('tob_lang') || 'es');
    }
});




/* =========================================
   Coverflow Presentadores Logic + Modal ATI
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {

    const carouselTrack = document.getElementById('presenters-track');
    if (carouselTrack) {
        // Dinámicamente generar 3 presentadores
        const presentersData = [
            {
                foto: "../imagenes/host/presentador01.webp",
                nombre: "Anthony Fuentes",
                puesto: "Presentador/a oficial del ToB 2026",
                bio: "Software Engineer y estudiante de Ingeniería en Computación en el TEC. Fotógrafo y creador de contenido con más de 137 mil seguidores, combinando su pasión por la tecnología con la narrativa visual.",
                linkedin: "https://www.linkedin.com/in/anthony-fuentes-2595a7282/",
                instagram: "https://www.instagram.com/anthonyfuentes__/"
            },
            {
                foto: "../imagenes/host/presentador02.webp",
                nombre: "Dennis Rojas",
                puesto: "Presentador oficial del ToB 2026",
                bio: "Estudiante de ATI, fundador de Baulaapp y coordinador de HackaToB; apasionado por la naturaleza, el emprendimiento y crear proyectos con impacto.",
                linkedin: "https://www.linkedin.com/in/dennis-o-rojas-quesada-749056358/",
                instagram: "https://www.instagram.com/dennis_rojas11/",
                isComingSoon: false
            },
            {
                foto: "../imagenes/host/presentador03.png",
                nombre: "Julia Vargas Thompson",
                puesto: "Asistente Ejecutiva en McKinsey & Company",
                bio: "Asistente Ejecutiva con experiencia en gestión de agendas, coordinación de proyectos y organización de eventos. Experta en conectar personas, optimizar tiempos y cuidar cada detalle para lograr resultados efectivos. Creativa, organizada y orientada al trabajo en equipo, combina su experiencia profesional con su formación artística y científica. Una mirada que une estructura, creatividad y capacidad de gestión.",
                linkedin: "https://www.linkedin.com/in/julia-vargas-thompson-675545189/",
                instagram: "https://www.instagram.com/caraphhhernelia?igshid=YmMyMTA2M2Y%3D",
                isComingSoon: false
            }
        ];

        carouselTrack.innerHTML = presentersData.map((p, i) => {
            if (p.isComingSoon) {
                return `
                    <div class="lamina card" style="position: relative;">
                        <div style="position: absolute; top:0; left:0; width:100%; height:100%; backdrop-filter: blur(12px); background: rgba(0,0,0,0.3); z-index: 10; display: flex; align-items: center; justify-content: center; border-radius: 20px;">
                            <h3 data-i18n="presenter_coming_name" style="color: var(--color-cyan); font-size: 1.5rem; margin: 0; text-transform: uppercase; letter-spacing: 2px; text-shadow: 0 0 10px rgba(33, 208, 255, 0.5);">Pronto...</h3>
                        </div>
                        <div class="card-img-wrapper" style="opacity: 0.1; background: var(--bg-dark);">
                            <div style="width: 100%; height: 100%;"></div>
                        </div>
                        <div class="card-content" style="opacity: 0.1;">
                            <h3 style="background: rgba(255,255,255,0.2); width: 60%; height: 24px; border-radius: 4px; margin-bottom: 8px;"></h3>
                            <p style="background: rgba(255,255,255,0.2); width: 80%; height: 16px; border-radius: 4px; margin-bottom: 12px;"></p>
                            <p style="background: rgba(255,255,255,0.2); width: 100%; height: 48px; border-radius: 4px;"></p>
                        </div>
                    </div>
                `;
            }
            return `
                <div class="lamina card">
                    <div class="card-img-wrapper">
                        <img src="${p.foto}" alt="Presentador ${i + 1}">
                    </div>
                    <div class="card-content">
                        <h3 data-i18n="presenter_${i + 1}_name">${p.nombre}</h3>
                        <p class="presenter-event-role" data-i18n="presenter_${i + 1}_role">${p.puesto}</p>
                        <p data-i18n="presenter_${i + 1}_bio">${p.bio}</p>
                        <div class="presenter-socials">
                            <a href="${p.linkedin}" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="LinkedIn">
                                <svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                            </a>
                            <a href="${p.instagram}" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Instagram">
                                <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                            </a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        const cards = Array.from(carouselTrack.querySelectorAll('.card'));
        const nextBtn = document.getElementById('carousel-next');
        const prevBtn = document.getElementById('carousel-prev');
        const dotsContainer = document.getElementById('carousel-dots');

        let currentIndex = Math.floor(cards.length / 2);
        const total = cards.length;

        cards.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => { currentIndex = i; update(); });
            dotsContainer.appendChild(dot);
        });
        const dots = Array.from(dotsContainer.querySelectorAll('.dot'));

        function update() {
            cards.forEach((card, i) => {
                card.classList.remove('active', 'prev', 'next', 'prev-far', 'next-far');
                let dist = i - currentIndex;
                const half = Math.floor(total / 2);
                if (dist > half) dist -= total;
                if (dist < -half) dist += total;
                if (dist === 0) card.classList.add('active');
                else if (dist === -1) card.classList.add('prev');
                else if (dist === 1) card.classList.add('next');
                else if (dist === -2) card.classList.add('prev-far');
                else if (dist === 2) card.classList.add('next-far');
            });
            dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
        }

        prevBtn?.addEventListener('click', () => { currentIndex = (currentIndex - 1 + total) % total; update(); });
        nextBtn?.addEventListener('click', () => { currentIndex = (currentIndex + 1) % total; update(); });

        let dragging = false, startX = 0, diffX = 0;
        const THRESHOLD = 50;

        carouselTrack.addEventListener('mousedown', e => { dragging = true; startX = e.pageX; });
        window.addEventListener('mousemove', e => { if (dragging) diffX = e.pageX - startX; });
        window.addEventListener('mouseup', () => { if (!dragging) return; dragging = false; applySwipe(); });
        carouselTrack.addEventListener('touchstart', e => { dragging = true; startX = e.touches[0].clientX; }, { passive: true });
        window.addEventListener('touchmove', e => { if (dragging) diffX = e.touches[0].clientX - startX; }, { passive: true });
        window.addEventListener('touchend', () => { if (!dragging) return; dragging = false; applySwipe(); });

        function applySwipe() {
            if (diffX > THRESHOLD) currentIndex = (currentIndex - 1 + total) % total;
            else if (diffX < -THRESHOLD) currentIndex = (currentIndex + 1) % total;
            diffX = 0;
            update();
        }

        update();
    }

    const atiModal = document.getElementById('atiModal');
    const atiClose = document.getElementById('atiModalClose');

    if (atiModal) {
        atiClose?.addEventListener('click', closeAtiModal);
        atiModal.addEventListener('click', e => { if (e.target === atiModal) closeAtiModal(); });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && atiModal.classList.contains('active')) closeAtiModal();
        });
    }

    document.addEventListener('click', e => {
        const trigger = e.target.closest('.ati-modal-trigger');
        if (trigger) {
            e.preventDefault();
            openAtiModal(e);
        }
    });

    if (typeof applyTranslations === 'function') {
        applyTranslations(localStorage.getItem('tob_lang') || 'es');
    }

});

function openAtiModal(e) {
    e.preventDefault();
    const modal = document.getElementById('atiModal');
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAtiModal() {
    const modal = document.getElementById('atiModal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
}
