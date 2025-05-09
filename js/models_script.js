async function loadModels() {
    if (!window.faceapi) {
        console.error("Fehler: face-api.js wurde nicht geladen!");
        return;
    }

    console.log("Lade Face-API Modelle...");
    await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('models'),
        faceapi.nets.faceExpressionNet.loadFromUri('models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('models'),
        faceapi.nets.ageGenderNet.loadFromUri('models')
    ]);
    console.log("Modelle erfolgreich geladen!");
}

async function start() {
    await loadModels();

    const video = document.getElementById('video');
    const infoDiv = document.getElementById("emotion");

    navigator.mediaDevices.getUserMedia({ video: {} })
        .then(stream => {
            video.srcObject = stream;
            video.play();
        })
        .catch(err => console.error("Fehler beim Zugriff auf die Kamera:", err));

    video.addEventListener('loadeddata', async () => {
        const canvas = faceapi.createCanvasFromMedia(video);
        document.body.append(canvas);
        const ctx = canvas.getContext('2d');
        const displaySize = { width: video.videoWidth, height: video.videoHeight };

        faceapi.matchDimensions(canvas, displaySize);

        setInterval(async () => {
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceExpressions()
                .withAgeAndGender();

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            faceapi.matchDimensions(canvas, displaySize);

            if (detections.length > 0) {
                const d = detections[0];
                const age = d.age.toFixed(0);
                const gender = d.gender;
                const expressions = d.expressions;
                const emotion = Object.keys(expressions).reduce((a, b) =>
                    expressions[a] > expressions[b] ? a : b
                );

                infoDiv.innerHTML = `
                    <strong>Alter:</strong> ${age}<br>
                    <strong>Geschlecht:</strong> ${gender}<br>
                    <strong>Emotion:</strong> ${emotion}
                `;
            } else {
                infoDiv.innerText = "Kein Gesicht erkannt.";
            }
        }, 500);
    });
}
start();