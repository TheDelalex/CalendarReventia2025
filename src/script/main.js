window.addEventListener('DOMContentLoaded', function() {
  // Récupérer l'objet d'état OU un objet vide
  const ouverts = JSON.parse(localStorage.getItem('calendrierOuvert') || '{}');
  document.querySelectorAll('.calendar-cell').forEach(cell => {
    // On récupère le numéro de la case dans data-day
    const day = cell.parentElement.href.match(/jour=(\d+)/)?.[1];

    // Applique la classe "ouvert" à la case SEULEMENT si ce jour a été cliqué
    if (ouverts[day]) cell.classList.add('ouvert');

    // Gère le clic
    cell.parentElement.addEventListener('click', function() {
      // Marque le jour dans l'objet, puis sauvegarde
      ouverts[day] = true;
      localStorage.setItem('calendrierOuvert', JSON.stringify(ouverts));
      cell.classList.add('ouvert');
      // Le lien s'ouvre normalement
    });
  });
  document.getElementById('reset-ls').addEventListener('click', function() {
  localStorage.removeItem('calendrierOuvert'); // Adapte le nom à ta clé si nécessaire
  window.location.reload();
});
});
