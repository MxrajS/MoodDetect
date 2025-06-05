document.addEventListener('DOMContentLoaded', () => {
  const music            = document.getElementById('background-music');
  const video            = document.getElementById('background-video');
  const settingsMenu     = document.getElementById('settings-menu');
  const menuOverlay      = document.getElementById('menu-overlay');
  const btnToggleMusic   = document.getElementById('toggle-music');
  const btnToggleVideo   = document.getElementById('toggle-video');
  const btnToggleClick   = document.getElementById('toggle-clicksound');
  const clickSound       = document.getElementById('click-sound');
  const privacyHintBtn   = document.getElementById('privacy-hint');
  const startCameraBtn   = document.getElementById('start-camera');
  const videoEl          = document.getElementById('video');
  const camBox           = document.getElementById('camera-box');
  const errMsg           = document.getElementById('error-message');

  // ============================
  // 1) Klick-Sound persistentes Muten (aus localStorage lesen)
  // ============================
  const storedMute = localStorage.getItem('clickSoundMuted');
  if (clickSound && storedMute === 'true') {
    clickSound.muted = true;
  }

  // ============================
  // 2) Musik sofort mit 10 % abspielen
  // ============================
  if (music) {
    music.volume = 0.1; // 10 % Lautstärke
    // Versuche Autoplay – wenn Browser es zulässt, spielt sie sofort
    music.play().catch(() => {
      // Wenn Browser Autoplay blockiert, bleibt sie stumm/pause
      // Nutzer kann später über „Musik abspielen“ starten
    });
  }

  // ============================
  // 3) Datenschutzhinweis-Logik
  // ============================
  if (privacyHintBtn) {
    privacyHintBtn.addEventListener('click', () => {
      // Klick-Sound, falls nicht stumm
      if (clickSound && !clickSound.muted) {
        clickSound.currentTime = 0;
        clickSound.play();
      }
      const ok = confirm(
        'Damit MoodDetect deine Emotionen erkennen kann, benötigen wir Zugriff auf deine Kamera.\n\n' +
        'Keine Sorge – es werden keinerlei Daten gespeichert oder übertragen. Alles bleibt lokal auf deinem Gerät.\n\n' +
        'Bist du einverstanden?'
      );
      if (ok) {
        startCameraBtn.style.display = 'inline-block';
      }
    });
  }

  // ============================
  // 4) Kameralogik
  // ============================
  let videoStream = null;
  if (startCameraBtn) {
    startCameraBtn.addEventListener('click', () => {
      // Klick-Sound, falls nicht stumm
      if (clickSound && !clickSound.muted) {
        clickSound.currentTime = 0;
        clickSound.play();
      }
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(s => {
          videoStream = s;
          videoEl.srcObject = s;
          videoEl.play();
          camBox.style.display = 'block';
          createContinueButton();
        })
        .catch(e => {
          console.error(e);
          camBox.style.display = 'block';
          videoEl.style.display = 'none';
          camBox.innerHTML = `
            <div style="
              display:flex;flex-direction:column;
              align-items:center;justify-content:center;
              padding:30px;background:#fbeaea;
              border:2px dashed #f5c6cb;
              border-radius:12px; min-height:220px;
              text-align:center;
            ">
              <img src="./images/warning.svg" width="80" height="80" style="margin-bottom:20px;">
              <p class="fs-5 fw-bold text-danger">Kamerazugriff verweigert</p>
              <p>Bitte erlaube Zugriff im Browser oder überprüfe deine Kameraeinstellungen.</p>
            </div>`;
        });
    });
  }

  function createContinueButton() {
    if (document.getElementById('continue-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'continue-btn';
    btn.className = 'btn btn-success highlight-btn mt-4';
    btn.textContent = 'Weiter zur Gesichtserkennung';
    btn.addEventListener('click', () => window.location.href = 'index.html');
    camBox.after(btn);
  }

  // ============================
  // 5) Klick → Settings-Overlay toggeln
  // ============================
  if (settingsMenu) {
    settingsMenu.addEventListener('click', () => {
      // Klick-Sound, falls nicht stumm
      if (clickSound && !clickSound.muted) {
        clickSound.currentTime = 0;
        clickSound.play();
      }
      menuOverlay.classList.toggle('show');
      document.body.classList.toggle('nav-open'); // Optional: Video ausblenden
    });
  }

  // ============================
  // 6) Klick auf freien Bereich des Settings-Overlay schließt es
  // ============================
  if (menuOverlay) {
    menuOverlay.addEventListener('click', e => {
      if (e.target === menuOverlay) {
        menuOverlay.classList.remove('show');
        document.body.classList.remove('nav-open');
      }
    });
  }

  // ============================
  // 7) ESC-Taste schließt Settings-Overlay, falls offen
  // ============================
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menuOverlay.classList.contains('show')) {
      menuOverlay.classList.remove('show');
      document.body.classList.remove('nav-open');
    }
  });

  // ============================
  // 8) Musik pausieren / fortsetzen
  // ============================
  if (btnToggleMusic && music) {
    // Initialer Button-Text je nach pausiertem Zustand
    btnToggleMusic.textContent = music.paused ? 'Musik abspielen' : 'Musik pausieren';

    btnToggleMusic.addEventListener('click', () => {
      // Klick-Sound, falls nicht stumm
      if (clickSound && !clickSound.muted) {
        clickSound.currentTime = 0;
        clickSound.play();
      }

      if (music.paused) {
        music.play().catch(e => console.error('Fehler beim Abspielen der Musik:', e));
        btnToggleMusic.textContent = 'Musik pausieren';
      } else {
        music.pause();
        btnToggleMusic.textContent = 'Musik abspielen';
      }
    });
  }

  // ============================
  // 9) Video pausieren / fortsetzen
  // ============================
  if (btnToggleVideo && video) {
    // Initialer Button-Text
    btnToggleVideo.textContent = video.paused ? 'Video abspielen' : 'Video pausieren';

    btnToggleVideo.addEventListener('click', () => {
      // Klick-Sound, falls nicht stumm
      if (clickSound && !clickSound.muted) {
        clickSound.currentTime = 0;
        clickSound.play();
      }

      if (video.paused) {
        video.play();
        btnToggleVideo.textContent = 'Video pausieren';
      } else {
        video.pause();
        btnToggleVideo.textContent = 'Video abspielen';
      }
    });
  }

  // ============================
  // 10) Klickton stumm / aktivieren & persistieren
  // ============================
  if (btnToggleClick && clickSound) {
    // Initialer Button-Text je nach storedMute
    btnToggleClick.textContent = clickSound.muted ? 'Klickton an' : 'Klickton stumm';

    btnToggleClick.addEventListener('click', () => {
      clickSound.muted = !clickSound.muted;
      // Klick-Sound umschalten, Button-Text updaten
      btnToggleClick.textContent = clickSound.muted ? 'Klickton an' : 'Klickton stumm';
      // Persistiere den Zustand in localStorage
      localStorage.setItem('clickSoundMuted', clickSound.muted ? 'true' : 'false');
    });
  }
});
