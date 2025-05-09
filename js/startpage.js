// Hamburger-Menü
const hamburgerToggle = document.getElementById("hamburger-toggle");
if (hamburgerToggle) {
    hamburgerToggle.addEventListener("click", function () {
        const navOverlay = document.getElementById("nav-overlay");
        if (navOverlay) {
            navOverlay.classList.toggle("active");
            document.body.classList.toggle("nav-open");
        }
    });
}

// Datenschutz Hinweis + Einverständnis-Logik
const privacyHintBtn = document.getElementById("privacy-hint");
if (privacyHintBtn) {
    privacyHintBtn.addEventListener("click", function () {
        const einverstanden = confirm(
            "Damit MoodDetect deine Emotionen erkennen kann, benötigen wir Zugriff auf deine Kamera. \n\n" +
            "Keine Sorge – es werden keinerlei Daten gespeichert oder übertragen. Alles bleibt lokal auf deinem Gerät. \n\n" +
            "Bist du einverstanden?"
        );

        if (einverstanden) {
            const startBtn = document.getElementById("start-camera");
            if (startBtn) {
                startBtn.style.display = "inline-block";
            }
        }
    });
}

let videoStream = null;

const startCameraBtn = document.getElementById("start-camera");
if (startCameraBtn) {
    startCameraBtn.addEventListener("click", function () {
        const videoElement = document.getElementById("video");
        const cameraBox = document.getElementById("camera-box");
        const errorMessage = document.getElementById("error-message");

        if (!videoElement || !cameraBox || !errorMessage) return;

        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {
                videoStream = stream;
                videoElement.srcObject = stream;
                videoElement.play();

                cameraBox.style.display = "block";
                errorMessage.textContent = "";

                createContinueButton();
            })
            .catch(function (err) {
                console.error("Fehler beim Zugriff auf die Kamera:", err);
                errorMessage.textContent = "Keine Kamera gefunden oder Zugriff verweigert!";
            });
    });
}

// Erstelle Weiter-Button zu index.html
function createContinueButton() {
    if (document.getElementById("continue-btn")) return;

    const continueBtn = document.createElement("button");
    continueBtn.id = "continue-btn";
    continueBtn.className = "btn btn-success highlight-btn mt-4";
    continueBtn.textContent = "Weiter zur Gesichtserkennung";

    continueBtn.addEventListener("click", function () {
        window.location.href = "index.html";
    });

    const cameraBox = document.getElementById("camera-box");
    if (cameraBox) {
        cameraBox.after(continueBtn);
    }
}
