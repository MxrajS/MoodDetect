document.addEventListener('DOMContentLoaded', () => {
  // 1) Navbar HTML laden
  fetch('navbar.html')
    .then(r => r.text())
    .then(html => {
      document.getElementById('navbar').innerHTML = html;
      const hamburger = document.getElementById('hamburger-toggle');
      const overlay   = document.getElementById('nav-overlay');
      const clickSound= document.getElementById('click-sound');

      // 2) Lies aus localStorage, ob Klick-Sound stumm ist
      const storedMute = localStorage.getItem('clickSoundMuted');
      if (clickSound && storedMute === 'true') {
        clickSound.muted = true;
      }

      if (hamburger && overlay) {
        // 3) Klick auf Hamburger-Button (Ton + Toggle)
        hamburger.addEventListener('click', () => {
          if (clickSound && !clickSound.muted) {
            clickSound.currentTime = 0;
            clickSound.play();
          }
          hamburger.classList.toggle('open');
          overlay.classList.toggle('active');
          document.body.classList.toggle('nav-open');
        });

        // 4) Klick auf freien Bereich des Overlays schließt es
        overlay.addEventListener('click', e => {
          if (e.target === overlay) {
            hamburger.classList.remove('open');
            overlay.classList.remove('active');
            document.body.classList.remove('nav-open');
          }
        });

        // 5) ESC-Taste schließt das Hamburger-Overlay, falls offen
        document.addEventListener('keydown', e => {
          if (e.key === 'Escape' && overlay.classList.contains('active')) {
            hamburger.classList.remove('open');
            overlay.classList.remove('active');
            document.body.classList.remove('nav-open');
          }
        });
      }

      // 6) Klick-Sound für Menü-Links (nur wenn nicht stumm)
      if (clickSound) {
        document.querySelectorAll('#nav-overlay a').forEach(a =>
          a.addEventListener('click', () => {
            if (!clickSound.muted) {
              clickSound.currentTime = 0;
              clickSound.play();
            }
          })
        );
      }
    })
    .catch(console.error);
});
