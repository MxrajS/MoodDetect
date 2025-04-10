let videoStream = null;
document.getElementById("start-camera").addEventListener("click", function () {
    startCamera();
});

document.getElementById("stop-camera").addEventListener("click", function () {
    stopCamera();
});

function startCamera() {
    const videoElement = document.getElementById("video");
    const cameraBox = document.getElementById("camera-box");
    const errorMessage = document.getElementById("error-message");
    const stopButton = document.getElementById("stop-camera");
    const startButton = document.getElementById("start-camera");

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            videoStream = stream;
            if ("srcObject" in videoElement) {
                videoElement.srcObject = stream;
            } else {
                videoElement.src = URL.createObjectURL(stream);
            }

            videoElement.play();
            cameraBox.style.display = "block";
            stopButton.style.display = "inline-block";
            startButton.style.display = "none";
            errorMessage.textContent = "";
        })
        .catch(function (err) {
            console.error("Fehler beim Zugriff auf die Kamera:", err);
            const errorMessage = document.getElementById("error-message");
            errorMessage.textContent = "Keine Kamera gefunden oder Zugriff verweigert!";
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
            })
        });

}

document.getElementById("start-camera").addEventListener("click", function () {
    document.getElementById("intro-text").style.display = "none"; // Intro-Text ausblenden
    document.getElementById("CameraAndEmotion").style.display = "flex"; // Divs einblenden
});

function stopCamera() {
    const videoElement = document.getElementById("video");
    const cameraBox = document.getElementById("camera-box");
    const stopButton = document.getElementById("stop-camera");
    const startButton = document.getElementById("start-camera");

    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
        videoElement.srcObject = null;
        cameraBox.style.display = "none";
        stopButton.style.display = "none";
        startButton.style.display = "inline-block";
    }
}

if (typeof faceapi === "undefined") {
    console.error("face-api.js wurde nicht geladen! Prüfe den Pfad oder lade die Datei korrekt ein.");
} else {
    console.log("face-api.js erfolgreich geladen.");
}


async function detectEmotions() {
    if (!videoStream) return;

    const videoElement = document.getElementById("video");
    const detections = await faceapi.detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender();

    if (detections.length > 0) {
        console.log("Erkannte Emotionen:", detections[0].expressions);
    } else {
        console.log("Kein Gesicht erkannt.");
    }
}

// Emotionen alle 500ms auslesen
setInterval(detectEmotions, 500);

