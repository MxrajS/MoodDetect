// Klick-Sound für alle Buttons
const clickSound = document.getElementById('click-sound');
if (clickSound) {
  clickSound.volume = 0.2;
  document.querySelectorAll('button').forEach(btn =>
    btn.addEventListener('click', () => {
      clickSound.currentTime = 0;
      clickSound.play();
    })
  );
}

// DOM-Elemente
let videoStream = null;
const startBtn      = document.getElementById('start-camera');
const stopBtn       = document.getElementById('stop-camera');
const video         = document.getElementById('video');
const cameraBox     = document.getElementById('camera-box');
const emotionBox    = document.getElementById('emotion');
const errorMessage  = document.getElementById('error-message');
const ageEl         = document.getElementById('age');
const genderEl      = document.getElementById('gender');
const mainEmotionEl = document.getElementById('main-emotion');

// Übersetzungen
const genderMap = { male: 'männlich', female: 'weiblich' };
const emotionMap = {
  happy: 'glücklich',
  sad: 'traurig',
  angry: 'wütend',
  surprised: 'überrascht',
  neutral: 'neutral',
  fearful: 'ängstlich',
  disgusted: 'angeekelt'
};

// Farben pro Emotion (für Box-Hintergrund)
const emotionColorMap = {
  glücklich: "#c8f7c5",     // hellgrün
  traurig: "#cfe8ff",       // hellblau
  wütend: "#ffd4d4",        // rosa
  überrascht: "#fff6d1",    // gelblich
  neutral: "#eeeeee",       // grau
  ängstlich: "#ffe4cc",     // orange
  angeekelt: "#e8ffd9"      // mintgrün
};

// Alters-Sampling
let ageSamples = [], ageFixed = false, averageAge = null;
function startAgeCollection() {
  ageSamples = []; ageFixed = false; averageAge = null;
  ageEl.textContent = '…';
  setTimeout(() => {
    if (ageSamples.length) {
      averageAge = Math.round(ageSamples.reduce((a,b)=>a+b,0)/ageSamples.length);
      ageEl.textContent = `${averageAge} Jahre`;
    } else {
      ageEl.textContent = '–';
    }
    ageFixed = true;
  }, 15000);
}

// Kamera starten
function startCamera() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      videoStream = stream;
      video.srcObject = stream;
      video.play();

      cameraBox.style.display = 'block';
      emotionBox.style.display = 'block';
      startBtn.style.display  = 'none';
      stopBtn.style.display   = 'inline-block';
      errorMessage.textContent = '';
      startAgeCollection();
    })
    .catch(err => {
      console.error('Kamera-Fehler:', err);
      showError('Keine Kamera gefunden oder Zugriff verweigert!');
    });
}

// Kamera stoppen
function stopCamera() {
  if (videoStream) {
    videoStream.getTracks().forEach(t => t.stop());
    video.srcObject = null;
    videoStream = null;
  }
  cameraBox.style.display = 'none';
  emotionBox.style.display = 'none';
  stopBtn.style.display   = 'none';
  startBtn.style.display  = 'inline-block';
}

// Fehleranzeige
function showError(msg) {
  errorMessage.textContent = msg;
}

// Stable-Emotion & Confetti
let lastEmotion = null, emotionStart = 0, confettiFired = false;
function handleStableEmotion(emotion) {
  if (emotion !== lastEmotion) {
    lastEmotion = emotion;
    emotionStart = Date.now();
    confettiFired = false;
  } else if (emotion === 'happy' && !confettiFired && Date.now() - emotionStart >= 1000) {
    ['🎉','🎊','😊','🥳'].forEach(emoji => {
      const span = document.createElement('span');
      span.className = 'flying-emoji';
      span.textContent = emoji;
      span.style.left = `${Math.random()*window.innerWidth}px`;
      document.body.append(span);
      setTimeout(() => span.remove(), 3000);
    });
    confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    confettiFired = true;
  }
}

// Emotion Detection
async function detectEmotions() {
  if (!videoStream || !window.faceapi) return;

  const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceExpressions()
    .withAgeAndGender();

  if (detections.length > 0) {
    const d = detections[0];

    if (!ageFixed) ageSamples.push(Math.round(d.age));
    else ageEl.textContent = `${averageAge} Jahre`;

    genderEl.textContent = genderMap[d.gender] || d.gender;

    const main = Object.keys(d.expressions).reduce((a,b) =>
      d.expressions[a] > d.expressions[b] ? a : b
    );

    const mappedEmotion = emotionMap[main] || main;
    mainEmotionEl.textContent = mappedEmotion;

    // Farbe der Box je nach Emotion setzen
    const boxColor = emotionColorMap[mappedEmotion] || "#ffffff";
    emotionBox.style.backgroundColor = boxColor;

    handleStableEmotion(main);
  } else {
    if (!ageFixed) ageEl.textContent = '…';
    genderEl.textContent      = '–';
    mainEmotionEl.textContent = 'Kein Gesicht erkannt';
    emotionBox.style.backgroundColor = "#ffffff";
  }
}

// Modelle laden & Events binden
async function initialize() {
  if (!window.faceapi) {
    showError('face-api.js nicht geladen!');
    return;
  }
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('models'),
    faceapi.nets.faceExpressionNet.loadFromUri('models'),
    faceapi.nets.ageGenderNet.loadFromUri('models')
  ]);

  startBtn.addEventListener('click', startCamera);
  stopBtn.addEventListener('click', stopCamera);

  setInterval(detectEmotions, 500);
}

initialize();
