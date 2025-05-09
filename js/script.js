let videoStream = null;

// DOM-Elemente
const startBtn = document.getElementById("start-camera");
const stopBtn = document.getElementById("stop-camera");
const video = document.getElementById("video");
const cameraBox = document.getElementById("camera-box");
const errorMessage = document.getElementById("error-message");
const introText = document.getElementById("intro-text");
const cameraEmotionWrapper = document.getElementById("CameraAndEmotion");
const emotionBox = document.getElementById("emotion");

const ageEl = document.getElementById("age");
const genderEl = document.getElementById("gender");
const mainEmotionEl = document.getElementById("main-emotion");

// Altersberechnung
let ageSamples = [];
let ageFixed = false;
let averageAge = null;

// Hamburger-Menü
document.getElementById("hamburger-toggle").addEventListener("click", () => {
  document.getElementById("nav-overlay").classList.toggle("active");
});

// Kamera starten
startBtn.addEventListener("click", () => {
  alert("Hinweis: Die Alters- und Emotionserkennung kann ungenau sein und unterliegt Schwankungen.");
  introText.style.display = "none";
  cameraEmotionWrapper.style.display = "flex";
  startCamera();
  startAgeCollection();
});

// Kamera stoppen
stopBtn.addEventListener("click", stopCamera);

function startCamera() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      videoStream = stream;
      video.srcObject = stream;
      video.play();

      cameraBox.style.display = "block";
      emotionBox.style.display = "block";
      startBtn.style.display = "none";
      stopBtn.style.display = "inline-block";
      errorMessage.textContent = "";
    })
    .catch(err => {
      console.error("Fehler beim Zugriff auf die Kamera:", err);
      showError("Keine Kamera gefunden oder Zugriff verweigert!");
    });
}

function stopCamera() {
  if (videoStream) {
    videoStream.getTracks().forEach(track => track.stop());
    video.srcObject = null;
    videoStream = null;
  }
  cameraBox.style.display = "none";
  emotionBox.style.display = "none";
  startBtn.style.display = "inline-block";
  stopBtn.style.display = "none";
}

// Altersdurchschnitt nach 15 Sekunden sammeln
function startAgeCollection() {
  ageSamples = [];
  ageFixed = false;
  averageAge = null;
  ageEl.textContent = "…";

  setTimeout(() => {
    if (ageSamples.length > 0) {
      const sum = ageSamples.reduce((a, b) => a + b, 0);
      averageAge = Math.round(sum / ageSamples.length);
      ageEl.textContent = averageAge;
    } else {
      ageEl.textContent = "–";
    }
    ageFixed = true;
  }, 15000);
}

// Fehleranzeige visuell
function showError(msg) {
  errorMessage.textContent = msg;
  Object.assign(errorMessage.style, {
    color: "red",
    fontWeight: "bold",
    fontSize: "clamp(16px, 2vw, 24px)",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    background: "transparent",
    padding: "15px",
    display: "block",
    maxWidth: "80%",
  });
  document.querySelectorAll(".content").forEach(div => {
    div.style.display = "none";
  });
}

// Emotion Detection
async function detectEmotions() {
  if (!videoStream || typeof faceapi === "undefined") return;

  const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceExpressions()
    .withAgeAndGender();

  if (detections.length > 0) {
    const d = detections[0];
    const detectedAge = Math.round(d.age);
    const gender = d.gender;
    const expressions = d.expressions;
    const mainEmotion = Object.keys(expressions).reduce((a, b) =>
      expressions[a] > expressions[b] ? a : b
    );

    // Alter nur sammeln, nicht sofort anzeigen
    if (!ageFixed) {
      ageSamples.push(detectedAge);
    } else {
      ageEl.textContent = averageAge;
    }

    genderEl.textContent = gender;
    mainEmotionEl.textContent = mainEmotion;
  } else {
    if (!ageFixed) ageEl.textContent = "…";
    genderEl.textContent = "–";
    mainEmotionEl.textContent = "Kein Gesicht erkannt";
  }
}

// Modelle laden + Intervall starten
async function loadModels() {
  if (typeof faceapi === "undefined") {
    showError("face-api.js wurde nicht geladen!");
    return;
  }

  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("models"),
    faceapi.nets.faceExpressionNet.loadFromUri("models"),
    faceapi.nets.ageGenderNet.loadFromUri("models")
  ]);

  setInterval(detectEmotions, 500);
}

loadModels();
