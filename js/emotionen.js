// Klick-Sound für alle Buttons/Links
const clickSound = document.getElementById('click-sound');
if (clickSound) {
  clickSound.volume = 0.2;
  document.querySelectorAll('button,a').forEach(el =>
    el.addEventListener('click', () => {
      clickSound.currentTime = 0;
      clickSound.play();
    })
  );
}

// Info-Box bei Hover
const emotions = document.querySelectorAll('.emotion');
const infoBox  = document.getElementById('info-box').querySelector('p');
emotions.forEach(em =>
  em.addEventListener('mouseover', () =>
    infoBox.textContent = em.dataset.info
  )
);
emotions.forEach(em =>
  em.addEventListener('mouseout', () =>
    infoBox.textContent = 'Bewege die Maus über ein Emoji, um mehr zu erfahren.'
  )
);
