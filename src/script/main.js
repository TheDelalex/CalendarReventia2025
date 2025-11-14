window.addEventListener("DOMContentLoaded", function () {
  const ouverts = JSON.parse(localStorage.getItem("calendrierOuvert") || "{}");
  const today = new Date();
  // Date de test
  today.setMonth(11); // 0=janvier, donc 11=décembre
  today.setDate(6);   // 6 décembre

  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  document.querySelectorAll(".calendar-cell").forEach((cell) => {
    const day = Number(cell.parentElement.getAttribute("data-day"));

    // Une case n'est accessible (côté INDEX) que si elle est <= jour courant ET en décembre
    const accessible = (currentMonth === 12 && day <= currentDay);

    if (accessible) {
      // Case ouverte : style après clic
      if (ouverts[day]) {
        cell.classList.add("ouvert");
      }
      cell.classList.remove("locked");
      cell.parentElement.style.pointerEvents = "";
      cell.removeAttribute("title");
    } else {
      // Case future : grise et non cliquable
      cell.classList.add("locked");
      cell.parentElement.style.pointerEvents = "none";
      cell.setAttribute("title", "Disponible le " + day + " décembre !");
    }

    // CLIC sur case possible uniquement si accessible (donc jamais pour jour futur)
    cell.parentElement.addEventListener("click", function (e) {
      if (cell.classList.contains("locked")) {
        e.preventDefault(); // Précaution: ça NOPE aussi le clic clavier
        return false;
      }
      if (!cell.classList.contains("locked")) {
    cell.classList.add("ouvert");
    cell.parentElement.style.pointerEvents = "none";
    ouverts[day] = true;
    localStorage.setItem("calendrierOuvert", JSON.stringify(ouverts));
    // Ouvre la page dans un nouvel onglet
    window.open(cell.parentElement.href, "_blank");
    // Empêche le changement d'onglet automatique (empêche la navigation du lien <a>)
    e.preventDefault();
  }
    });
  });

  // RESET bouton
  const resetBtn = document.getElementById("reset-ls");
  if (resetBtn) {
    resetBtn.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.removeItem("calendrierOuvert");
      window.location.reload();
    });
  }

  // Affichage de la date (.affiche_date)
  const mois = [
    "janvier","février","mars","avril","mai","juin",
    "juillet","août","septembre","octobre","novembre","décembre"
  ];
  const auj = new Date();
  auj.setMonth(11);
  auj.setDate(6);
  const texte = auj.getDate() + " " + mois[auj.getMonth()] + " " + auj.getFullYear();
  document.querySelectorAll('.affiche_date').forEach(e => { e.textContent = texte; });
});
