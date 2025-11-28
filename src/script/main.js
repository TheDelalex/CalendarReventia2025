window.addEventListener("DOMContentLoaded", function () {
  const ouverts = JSON.parse(localStorage.getItem("calendrierOuvert") || "{}");

  const today = new Date();
  // Date de test
  today.setMonth(11); // 0=janvier, donc 11=décembre
  today.setDate(6); // 6 décembre

  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  const cells = this.document.querySelectorAll(".calendar-cell");
  const totalCells = cells.length;
  let loadedCases = 0;

  function onCaseLoaded() {
    loadedCases++;
    if (loadedCases >= totalCells) {
      const bgImg = new Image();
      bgImg.src = "Images/background.png";
      bgImg.onload = function () {
        document.getElementById("bg-img").src = bgImg.src;
      };
    }
  }

  cells.forEach((cell) => {
    const day = Number(cell.parentElement.getAttribute("data-day"));

    // Mettre pour chaque case un background image de la forme Images/Case/caseX.png
    // Et si l'image n'existe pas, mettre l'image contenu à Images/case.png
    const img = new Image();
    img.src = `Images/Case/case${day}.png`;
    img.onload = function () {
      cell.src = img.src; // on met l'image spécifique
      onCaseLoaded();
    };
    img.onerror = function () {
      cell.src = "Images/case.png"; // fallback si l'image n'existe pas
      onCaseLoaded();
    };

    // Une case n'est accessible (côté INDEX) que si elle est <= jour courant ET en décembre
    const accessible = currentMonth === 12 && day <= currentDay;
    if (accessible) {
      // Case ouverte : style après clic
      if (ouverts[day]) {
        cell.classList.add("ouvert");
      }
      cell.classList.remove("locked");
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
      // Marquer comme ouverte
      cell.classList.add("ouvert");
      ouverts[day] = true;
      localStorage.setItem("calendrierOuvert", JSON.stringify(ouverts));

      // Effacer l'image (version simple)
      cell.src = ""; // l'img disparaît

      // Ouvrir la page du jour dans un nouvel onglet
      window.open(cell.parentElement.href, "_blank");
      e.preventDefault();
    });
  });

  var popup = document.getElementById("popup-bienvenue");
  var closeBtn = document.getElementById("close-popup");
  if (popup && closeBtn) {
    closeBtn.addEventListener("click", function () {
      popup.style.display = "none";
    });
    // (optionnel) : fermer aussi avec un clic sur le fond noir
    popup.addEventListener("click", function (e) {
      if (e.target === popup) popup.style.display = "none";
    });
  }
});
