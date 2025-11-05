// Forzar el scroll al principio de la página en cada recarga.
// Esto evita que el navegador recuerde la última posición de scroll y asegura que el splash screen se vea.
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

window.addEventListener('load', () => {

    // --- CONFIGURACIÓN DE SPOTIFY ---
    // YA NO NECESITAMOS SPOTIFY. AHORA DEFINIMOS NUESTRA PROPIA LISTA.
    // Sube los archivos MP3 a tu proyecto y pon la ruta correcta aquí.
    const songList = [
        { title: 'Hipno CHAMPIONS LEAGUE', url: '../AUDIO/HIMNO UEFA CHAMPIONS LEAGUE LETRA.mp3' },
        { title: 'Perfect - Ed Sheeran', url: '../AUDIO/Ed Sheeran - Perfect.mp3' },
        // Añade más canciones aquí
    ];

    // Canción que sonará si el usuario no elige ninguna.
    // Puede ser la primera de la lista o una especial.
    let selectedSongUrl = songList[0].url; 

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
    function startInvitation(event) { // event puede ser undefined si se llama directamente
        // Si ya hay un audio, no hagas nada (evita doble ejecución)
        if (audio) return;

        // Si el clic vino del botón de música o sus hijos, no inicies la invitación.
        // Esta comprobación solo se hace si 'event' existe (es decir, si la función fue llamada por un clic)
        if (event) {
            const openModalBtn = document.getElementById('open-music-modal');
            if (openModalBtn && openModalBtn.contains(event.target)) {
                return; // Detiene la ejecución de esta función
            }
        }

        // Crea el elemento de audio con la canción seleccionada (o la por defecto)
        audio = new Audio(selectedSongUrl);
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

    // --- LÓGICA DEL MODAL DE MÚSICA ---
    const musicModal = document.getElementById('music-modal');
    const openModalBtn = document.getElementById('open-music-modal');
    const closeModalBtn = musicModal ? musicModal.querySelector('.close-modal') : null;
    const songListContainer = document.getElementById('song-list-container');

    // Elementos del nuevo modal de confirmación
    const confirmModal = document.getElementById('confirm-modal');
    const confirmSongTitle = document.getElementById('confirm-song-title');
    const confirmYesBtn = document.getElementById('confirm-yes-btn');
    const confirmNoBtn = document.getElementById('confirm-no-btn');

    let tempSong = { url: '', title: '' }; // Objeto temporal para guardar la canción seleccionada

    // Función para construir la lista de canciones en el modal
    function buildSongList() {
        if (!songListContainer) return;

        songList.forEach(song => {
            const item = document.createElement('div');
            item.className = 'song-list-item'; // Usaremos una nueva clase CSS
            item.textContent = song.title;
            
            item.addEventListener('click', () => {
                tempSong = { url: song.url, title: song.title };
                confirmSongTitle.textContent = tempSong.title;
                musicModal.style.display = 'none';
                confirmModal.style.display = 'flex';
            });

            songListContainer.appendChild(item);
        });
    }

    // Solo ejecuta la lógica del modal si los elementos existen en la página actual.
    if (musicModal && openModalBtn && closeModalBtn) {
        // Función para abrir el modal
        const openMusicModal = (e) => {
            e.stopPropagation(); // Evita que el clic inicie la invitación
            musicModal.style.display = 'flex';
        };

        // Event Listeners para el modal de búsqueda (para click y touch)
        openModalBtn.addEventListener('click', openMusicModal);
        openModalBtn.addEventListener('touchend', openMusicModal);


        closeModalBtn.addEventListener('click', () => {
            musicModal.style.display = 'none';
        });

        // Construimos la lista de canciones una sola vez
        buildSongList();
        
        // Event Listeners para el nuevo modal de confirmación
        confirmYesBtn.addEventListener('click', () => {
            // Asigna la canción seleccionada
            selectedSongUrl = tempSong.url;
            // Cierra el modal de confirmación
            confirmModal.style.display = 'none';
            // Inicia la invitación
            startInvitation();
        });

        confirmNoBtn.addEventListener('click', () => {
            // Cierra el modal de confirmación y vuelve a abrir el de búsqueda
            confirmModal.style.display = 'none';
            musicModal.style.display = 'flex';
        });
    }

    // El listener para iniciar la invitación ahora está en el splash screen completo
    splashScreen.addEventListener('click', startInvitation);
    // Añadimos también 'touchend' para el splash screen para consistencia en móviles
    splashScreen.addEventListener('touchend', (e) => {
        // Prevenimos que se dispare si el toque termina en un botón
        if (e.target.tagName === 'BUTTON') {
            return;
        }
        startInvitation(e);
    });
});