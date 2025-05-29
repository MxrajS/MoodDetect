// Klick-Sound für alle Buttons/Links
const clickSound = document.getElementById('click-sound');
if (clickSound) {
  clickSound.volume = 0.2;
  document.querySelectorAll('button,a').forEach(el =>
    el.addEventListener('click', () => {
      clickSound.currentTime = 0;
      clickSound.play();
    })
  );
}

// Datenschutz-Hinweis
const privacyHintBtn = document.getElementById('privacy-hint');
if (privacyHintBtn) {
  privacyHintBtn.addEventListener('click', () => {
    const ok = confirm(
      'Damit MoodDetect deine Emotionen erkennen kann, benötigen wir Zugriff auf deine Kamera.\n\n' +
      'Keine Sorge – es werden keinerlei Daten gespeichert oder übertragen. Alles bleibt lokal auf deinem Gerät.\n\n' +
      'Bist du einverstanden?'
    );
    if (ok) {
      document.getElementById('start-camera').style.display = 'inline-block';
    }
  });
}

// Kamera-Logik
let videoStream = null;
const startCam = document.getElementById('start-camera');
const videoEl  = document.getElementById('video');
const camBox   = document.getElementById('camera-box');
const errMsg   = document.getElementById('error-message');

startCam.addEventListener('click', () => {
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
          <p>Bitte erlaube Zugriff im Browser oder überprüfe deine Kamera einstellungen.</p>
        </div>`;
    });
});

function createContinueButton() {
  if (document.getElementById('continue-btn')) return;
  const btn = document.createElement('button');
  btn.id = 'continue-btn';
  btn.className = 'btn btn-success highlight-btn mt-4';
  btn.textContent = 'Weiter zur Gesichtserkennung';
  btn.addEventListener('click', () => window.location.href = 'index.html');
  camBox.after(btn);
}
