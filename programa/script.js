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
