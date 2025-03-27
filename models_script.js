
async function start() {
    // Modelle lokal laden
    await faceapi.nets.tinyFaceDetector.loadFromUri('models');
    await faceapi.nets.faceExpressionNet.loadFromUri('models');
    await faceapi.nets.faceLandmarkNet.loadFromUri('models');

    const video = document.getElementById('video');

    // Kamera aktivieren
    navigator.mediaDevices.getUserMedia({ video: {} })
        .then(stream => video.srcObject = stream);

    video.addEventListener('play', async () => {
        const canvas = faceapi.createCanvasFromMedia(video);
        document.body.append(canvas);
        const ctx = canvas.getContext('2d'); // Kontext für Canvas
        const displaySize = { width: video.width, height: video.height };
        faceapi.matchDimensions(canvas, displaySize);

        setInterval(async () => {
            const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors();
            // Zeichne die Erkennung (Rahmen um das Gesicht)
            faceapi.draw.drawDetections(canvas, detections); // Zeichnet Rechtecke um Gesichter
            faceapi.draw.drawFaceExpressions(canvas, detections); // Zeichnet Emotionen (optional)

            const options = new faceapi.draw.DrawBoxOptions({
                boxColor: 'red', // Rahmenfarbe
                lineWidth: 3     // Rahmenbreite
            });
            faceapi.draw.drawDetections(canvas, detections, options);
        }, 500);
    });
}

start();

async function testFaceDetection() {
    console.log("testFaceDetection gestartet...");
    await faceapi.nets.tinyFaceDetector.loadFromUri('models');
    const video = document.getElementById('video');

    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
        console.log("Gesicht erkannt?", detections.length > 0 ? "JA" : "NEIN", detections);
    }, 1000);
}

testFaceDetection();