document.addEventListener('DOMContentLoaded', () => {
  fetch('navbar.html')
    .then(r => r.text())
    .then(html => {
      document.getElementById('navbar').innerHTML = html;
      const hamburger = document.getElementById('hamburger-toggle');
      const overlay   = document.getElementById('nav-overlay');
      const clickSound= document.getElementById('click-sound');

      if (hamburger && overlay) {
        hamburger.addEventListener('click', () => {
          if (clickSound) {
            clickSound.currentTime = 0;
            clickSound.play();
          }
          hamburger.classList.toggle('open');
          overlay.classList.toggle('active');
          document.body.classList.toggle('nav-open');
        });
        overlay.addEventListener('click', e => {
          if (e.target === overlay) {
            hamburger.classList.remove('open');
            overlay.classList.remove('active');
            document.body.classList.remove('nav-open');
          }
        });
      }
      // Klick-Sound für Menü-Links
      if (clickSound) {
        document.querySelectorAll('#nav-overlay a').forEach(a =>
          a.addEventListener('click', () => {
            clickSound.currentTime = 0;
            clickSound.play();
          })
        );
      }
    })
    .catch(console.error);
});
