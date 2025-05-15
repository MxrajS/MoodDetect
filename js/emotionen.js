const emotions = document.querySelectorAll('.emotion');
const infoBox = document.getElementById('info-box').querySelector('p');

emotions.forEach(emotion => {
  emotion.addEventListener('mouseover', () => {
    infoBox.textContent = emotion.dataset.info;
  });

  emotion.addEventListener('mouseout', () => {
    infoBox.textContent = 'Bewege die Maus über ein Emoji, um mehr zu erfahren.';
  });
});

fetch("navbar.html")
  .then(response => response.text())
  .then(data => {
    document.getElementById("navbar").innerHTML = data;

    const hamburger = document.getElementById("hamburger-toggle");
    const overlay = document.getElementById("nav-overlay");

    if (hamburger && overlay) {
      hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("open");
        overlay.classList.toggle("active");
      });

      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          hamburger.classList.remove("open");
          overlay.classList.remove("active");
        }
      });
    }
  });
