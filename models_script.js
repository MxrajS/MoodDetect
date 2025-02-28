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
        const displaySize = { width: video.width, height: video.height };
        faceapi.matchDimensions(canvas, displaySize);

        setInterval(async () => {
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceExpressions();

            if (detections.length > 0) {
                console.log("Erkannte Emotionen:", detections[0].expressions);
            }
        }, 500);
    });
}
start();