// Forzar el scroll al principio de la página en cada recarga.
// Esto evita que el navegador recuerde la última posición de scroll y asegura que el splash screen se vea.
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

window.addEventListener('load', () => {

    // --- CONFIGURACIÓN DE SPOTIFY ---
    // Lista de canciones para la invitación principal.
    // Asegúrate de que los archivos 1.mp3, 2.mp3, etc., estén en la carpeta /AUDIO.
    const songList = [
        { title: 'Canción 2', url: './AUDIO/2.mp3' },
    ];

    // Selecciona una canción aleatoria de la lista para la invitación principal.
    const randomSong = songList[Math.floor(Math.random() * songList.length)];
    let selectedSongUrl = randomSong.url;

    let audio = null; // El elemento de audio se creará después

    // --- CONFIGURACIÓN DEL SLIDESHOW DE IMÁGENES ---

    // Añade aquí las rutas de las imágenes que quieres que roten en cada sección.
    const heroImages = [
        './IMG/IMG_6927.jpg',
        './IMG/IMG_6852.jpg',
        './IMG/IMG_6894.jpg'
    ];
    const ceremonyImages = [
        './IMG/IMG_6810.jpg',
        './IMG/IMG_6844.jpg'
    ];
    const countdownImages = [
        './IMG/IMG_6820.jpg',
        './IMG/IMG_6823.jpg'
    ];
    // Añade aquí las imágenes para la nueva sección del versículo
    const bibleVerseImages = [
        './IMG/IMG_6805.jpg',
        './IMG/IMG_6810.jpg'
    ];

    // Función para iniciar un slideshow en una sección específica
    function startSlideshow(sectionSelector, images, interval = 10000) {
        const section = document.querySelector(sectionSelector);
        if (!section) return;

        // Establece la imagen inicial
        section.style.setProperty('--bg-image-url', `url(${images[0]})`);

        let currentIndex = 0;

        setInterval(() => {
            currentIndex = (currentIndex + 1) % images.length;
            
            // 1. Oculta el fondo actual añadiendo una clase que activa la transición en CSS
            section.classList.add('fade-out');

            // 2. Después de la transición, cambia la imagen y la muestra de nuevo
            setTimeout(() => {
                section.style.setProperty('--bg-image-url', `url(${images[currentIndex]})`);
                // 3. Quita la clase para que la nueva imagen aparezca con la transición
                section.classList.remove('fade-out');
            }, 1000); // Debe coincidir con la duración de la transición en CSS

        }, interval); // Intervalo de 30 segundos
    }

    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.getElementById('main-content');

    // Función para iniciar la invitación (audio, contenido, etc.)
    function startInvitation() {
        // Si ya hay un audio, no hagas nada (evita doble ejecución)
        if (audio) return;

        // Crea el elemento de audio con la canción seleccionada (o la por defecto)
        audio = document.getElementById('miAudio') || new Audio(selectedSongUrl);
        audio.preload = 'auto';

        // Intenta reproducir el audio.
        audio.play().catch(e => {
            console.log("La reproducción automática fue bloqueada por el navegador.", e);
        });

        // Oculta la pantalla de bienvenida
        splashScreen.style.opacity = '0';

        // Espera a que la animación de salida del splash termine para quitarlo del DOM
        splashScreen.addEventListener('transitionend', () => {
            splashScreen.style.display = 'none';
        });

        // Muestra la tarjeta de invitación con una animación suave
        mainContent.style.visibility = 'visible';
        mainContent.style.opacity = '1';

        // --- GESTIÓN DEL INDICADOR DE SCROLL ---
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            // Hace visible el indicador de scroll una vez que el contenido principal carga
            scrollIndicator.style.opacity = '1';

            // Oculta el indicador de scroll la primera vez que el usuario hace scroll
            window.addEventListener('scroll', () => {
                scrollIndicator.style.opacity = '0';
            }, { once: true }); // { once: true } asegura que el listener se elimine después de ejecutarse una vez
        }


        // Inicia los slideshows una vez que el contenido es visible
        startSlideshow('.hero-section', heroImages);
        startSlideshow('.ceremony-section', ceremonyImages);
        startSlideshow('.countdown-section', countdownImages);
        startSlideshow('.bible-verse-section', bibleVerseImages);

        // --- INICIA EL CONTADOR REGRESIVO ---
        const weddingDate = new Date("2025-12-20T18:00:00").getTime();

        const countdownInterval = setInterval(() => {
            const now = new Date().getTime();
            const distance = weddingDate - now;

            if (distance < 0) {
                clearInterval(countdownInterval);
                // Cuando la fecha ha pasado, muestra el contador en 0.
                document.getElementById("countdown").innerHTML = `
                    <div><span>0</span>Días</div>
                    <div><span>0</span>Horas</div>
                    <div><span>0</span>Minutos</div>
                    <div><span>0</span>Segundos</div>
                `;
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById("countdown").innerHTML = `
                <div><span>${days}</span>Días</div>
                <div><span>${hours}</span>Horas</div>
                <div><span>${minutes}</span>Minutos</div>
                <div><span>${seconds}</span>Segundos</div>
            `;
        }, 1000);

    }

    // --- LÓGICA DE INICIO ---
    // Al hacer clic o tocar en cualquier parte de la pantalla de bienvenida, inicia la invitación.
    splashScreen.addEventListener('click', startInvitation);
    splashScreen.addEventListener('touchend', startInvitation);

    // --- LÓGICA PARA CERRAR LA INVITACIÓN ---
    const closeButton = document.getElementById('close-invitation-btn');

    const closePageHandler = (event) => {
        // Previene el comportamiento por defecto del enlace (que es recargar la página).
        event.preventDefault();
        // Intenta cerrar la pestaña actual del navegador.
        window.close();
    };

    if (closeButton) {
        closeButton.addEventListener('click', closePageHandler);
        closeButton.addEventListener('touchend', closePageHandler);
    }
});