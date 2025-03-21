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
        const ctx = canvas.getContext('2d');
        const displaySize = { width: video.width, height: video.height };
        faceapi.matchDimensions(canvas, displaySize);

        setInterval(async () => {
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceExpressions();
        
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            ctx.save();
            ctx.translate(canvas.width, 0); 
            ctx.scale(-1, 1); // Spiegelt das Bild
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            ctx.restore(); // Kontext zurücksetzen
        
            faceapi.draw.drawDetections(canvas, detections);
            faceapi.draw.drawFaceExpressions(canvas, detections);
        
            if (detections.length > 0) {
                console.log("Erkannte Emotionen:", detections[0].expressions);
            }
        }, 500);
        
    });
}

start();