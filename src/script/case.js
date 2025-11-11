fetch('contenus.json')
  .then(r => r.json())
  .then(contenus => {
    const params = new URLSearchParams(window.location.search);
    const jour = params.get('jour');
    document.getElementById('contenu').innerHTML = contenus[jour] || "Jour inconnu.";
  });
