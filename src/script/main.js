window.addEventListener('DOMContentLoaded', function() {
  // 1. État local (cases déjà ouvertes)
  const ouverts = JSON.parse(localStorage.getItem('calendrierOuvert') || '{}');
  const today = new Date();
  // Désactive la ligne ci-dessous en décembre réel !
  today.setMonth(11); today.setDate(6);
  const currentMonth = today.getMonth() + 1; // décembre === 12
  const currentDay = today.getDate();

  document.querySelectorAll('.calendar-cell').forEach(cell => {
    // Récupère N° jour dans data-day (à ajouter ou extraire de l'href)
    const day = cell.parentElement.href.match(/jour=(\d+)/)?.[1];
    // 2. Par rapport à la date, peut-on ouvrir cette case ?
    const accessible = (currentMonth > 12) || (currentMonth === 12 && Number(day) <= currentDay);

    // 3. Rétablit l'apparence "ouverte" si déjà cliquée avant
    if (ouverts[day]) {
      cell.classList.add('ouvert');
      cell.classList.remove('locked');
      cell.parentElement.classList.remove('locked-link');
      cell.parentElement.style.pointerEvents = "";
    } else if (!accessible) {
      cell.classList.add('locked');
      cell.parentElement.style.pointerEvents = "none"; // bloque le clic
      cell.setAttribute('title', "Disponible le " + day + " décembre !");
    } else {
      cell.classList.remove('locked');
      cell.parentElement.style.pointerEvents = "";
      cell.removeAttribute('title');
    }

    // 4. Lors du clic, si ouvert, marque dans localStorage
    cell.parentElement.addEventListener('click', function() {
      if (!cell.classList.contains('locked')) {
        cell.classList.add('ouvert');
        ouverts[day] = true;
        localStorage.setItem('calendrierOuvert', JSON.stringify(ouverts));
      }
      // Si la case est "locked", on bloque tout (pointerEvents déjà à "none")
    });
  });
});
