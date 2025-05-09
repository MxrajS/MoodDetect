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