// Lógica específica para la página de Agenda HackaToB
document.addEventListener('DOMContentLoaded', () => {
    // Si viene con un hash en la URL (#dia1, #dia2, #hack-day3, etc.), activar esa tab
    const hash = window.location.hash;
    if (hash) {
        let targetId = hash.replace('#', '');
        if (targetId.startsWith('dia')) {
            targetId = 'hack-day' + targetId.replace('dia', '');
        } else if (!targetId.startsWith('hack-day')) {
            targetId = 'hack-' + targetId;
        }
        
        if (document.getElementById(targetId) && typeof switchHackDay === 'function') {
            switchHackDay(targetId);
        }
    }
});
