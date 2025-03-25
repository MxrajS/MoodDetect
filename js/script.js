let videoStream = null;
navigator.mediaDevices.enumerateDevices().then(devices => console.log(devices));

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
            
            // 🔥 NEU: Direkt den Stream an das Video-Element anhängen
            if ("srcObject" in videoElement) {
                videoElement.srcObject = stream;
            } else {
                videoElement.src = URL.createObjectURL(stream); // Fallback für ältere Browser
            }

            videoElement.play(); // 🎥 WICHTIG: Video abspielen
            cameraBox.style.display = "block";
            stopButton.style.display = "inline-block";
            startButton.style.display = "none"; 
            errorMessage.textContent = "";
        })
        
}

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
