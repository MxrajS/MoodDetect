// Hamburger-Menü Platzhalter
document.getElementById("hamburger-menu").addEventListener("click", function () {
    // hier kommt weiterer code hin
    console.log("Hamburger-Menü geklickt");
});

// Datenschutz Hinweis + Einverständnis-Logik
document.getElementById("privacy-hint").addEventListener("click", function () {
    const einverstanden = confirm(
        "Damit MoodDetect deine Emotionen erkennen kann, benötigen wir Zugriff auf deine Kamera. \n\n" +
        "Keine Sorge – es werden keinerlei Daten gespeichert oder übertragen. Alles bleibt lokal auf deinem Gerät. \n\n" +
        "Bist du einverstanden?"
    );

    if (einverstanden) {
        document.getElementById("start-camera").style.display = "inline-block";
    }
});

let videoStream = null;

document.getElementById("start-camera").addEventListener("click", function () {
    const videoElement = document.getElementById("video");
    const cameraBox = document.getElementById("camera-box");
    const errorMessage = document.getElementById("error-message");

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            videoStream = stream;
            videoElement.srcObject = stream;
            videoElement.play();

            // Kamera-Box anzeigen
            cameraBox.style.display = "block";
            errorMessage.textContent = "";

            // „Weiter“-Button erzeugen
            createContinueButton();
        })
        .catch(function (err) {
            console.error("Fehler beim Zugriff auf die Kamera:", err);
            errorMessage.textContent = "Keine Kamera gefunden oder Zugriff verweigert!";
        });
});

// Erstelle Weiter-Button zu index.html
function createContinueButton() {
    if (document.getElementById("continue-btn")) return; // bereits vorhanden

    const continueBtn = document.createElement("button");
    continueBtn.id = "continue-btn";
    continueBtn.className = "btn btn-success highlight-btn mt-4";
    continueBtn.textContent = "Weiter zur Gesichtserkennung";

    continueBtn.addEventListener("click", function () {
        window.location.href = "index.html";
    });

    // Füge ihn direkt NACH der Kamera-Box ein
    document.getElementById("camera-box").after(continueBtn);
}

