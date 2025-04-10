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
        faceapi.nets.ageGenderNet.loadFromUri('models') // <-- HINZUGEFÜGT, um Alter und Geschlecht zu erkennen.
    ]);
    console.log("Modelle erfolgreich geladen!");
}

async function start() {
    await loadModels(); // Warte, bis die Modelle vollständig geladen sind

    const video = document.getElementById('video');

    navigator.mediaDevices.getUserMedia({ video: {} })
        .then(stream => {
            video.srcObject = stream;
            video.play();
        })
        .catch(err => console.error("Fehler beim Zugriff auf die Kamera:", err));

    video.addEventListener('play', async () => {
        const canvas = faceapi.createCanvasFromMedia(video);
        document.body.append(canvas);
        const ctx = canvas.getContext('2d');
        const displaySize = { width: video.videoWidth, height: video.videoHeight };

        faceapi.matchDimensions(canvas, displaySize);

        setInterval(async () => {
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceExpressions()
                .withAgeAndGender(); // <-- HINZUGEFÜGT
        
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        
            detections.forEach(d => {
                console.log("Emotionen:", d.expressions);
                console.log("Geschlecht:", d.gender);
            });
            
        }, 500);
    });
}

start();
