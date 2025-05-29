// Klick-Sound für alle Buttons/Links
const clickSound = document.getElementById('click-sound');
if (clickSound) {
  clickSound.volume = 0.2;
  document.querySelectorAll('button, a').forEach(el =>
    el.addEventListener('click', () => {
      clickSound.currentTime = 0;
      clickSound.play();
    })
  );
}
