window.addEventListener("DOMContentLoaded", function () {
  const ouverts = JSON.parse(localStorage.getItem("calendrierOuvert") || "{}");

  const today = new Date();
  // Date de test
  today.setMonth(11); // 0=janvier, donc 11=décembre
  today.setDate(7); // 7 décembre

  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  const wrapper = document.getElementById("page-wrapper");

  const reset = this.document.querySelector(".reset");
  const switchBtn = this.document.querySelector(".btn-switch");

  const cells = this.document.querySelectorAll(".calendar-cell");
  const totalCells = cells.length;
  let loadedCases = 0;

  const audio = document.getElementById("bg-music");
  const volumeRange = document.getElementById("volume-range");
  const volumeBar = document.getElementById("volume-bar");
  const musicToggle = document.getElementById('music-toggle');

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
      if (audio && !audio.paused) {
        audio.pause();
        musicToggle.textContent = "⏵";
      }
      // Marquer comme ouverte
      cell.classList.add("ouvert");
      ouverts[day] = true;
      localStorage.setItem("calendrierOuvert", JSON.stringify(ouverts));

      // Effacer l'image (version simple)
      cell.classList.add("ouvert"); // l'img disparaît

      // Ouvrir la page du jour dans un nouvel onglet
      window.open(cell.parentElement.href, "_blank");
      e.preventDefault();
    });
  });

  if (switchBtn && wrapper) {
    switchBtn.addEventListener("click", function () {
      if (wrapper.classList.contains("show-opened")) {
        switchBtn.innerHTML = "Afficher les cases déjà ouvertes"
      }
      else {
        switchBtn.innerHTML = "Masquer les cases déjà ouvertes"
      }
      wrapper.classList.toggle("show-opened");
      
    });
  }

  var popup = document.getElementById("popup-bienvenue");
  var closeBtn = document.getElementById("close-popup");
  if (popup && closeBtn) {
    closeBtn.addEventListener("click", function () {
      popup.style.display = "none";
    });
  }

  const btnFermer = document.getElementById("close-popup");
  const chkNePlus = document.getElementById("popup-ne-plus-afficher");

  // Si l'utilisateur a déjà coché "ne plus afficher", on ne montre pas la popup
  if (localStorage.getItem("popupBienvenueMasquee") === "1") {
    if (popup) popup.style.display = "none";
  }

  if (popup && btnFermer && chkNePlus) {
    btnFermer.addEventListener("click", function () {
      if (chkNePlus.checked) {
        localStorage.setItem("popupBienvenueMasquee", "1");
      }
      popup.style.display = "none";
    });
  }

  // Affichage / masquage initial selon localStorage
  if (localStorage.getItem("popupBienvenueMasquee") === "1") {
    if (popup) popup.style.display = "none";
  } else {
    if (popup && wrapper) wrapper.classList.add("blur-background");
  }

  if (popup && btnFermer && wrapper) {
    btnFermer.addEventListener("click", function () {
      if (chkNePlus && chkNePlus.checked) {
        localStorage.setItem("popupBienvenueMasquee", "1");
      }
      popup.style.display = "none";
      wrapper.classList.remove("blur-background");
    });
  }

  // Gestion de la musique de fond et du volume
  if (audio && volumeRange && volumeBar) {
    audio.volume = parseFloat(volumeRange.value);

    // 1ère interaction utilisateur -> on lance la musique une seule fois
    let musicStarted = false;
    function startMusicOnce() {
      if (musicStarted) return;
      musicStarted = true;
      audio.play().catch(() => {
        alert("La musique de fond n'a pas pu démarrer automatiquement. Veuillez démarrer ce gros débile d'Alex");
      });
      // on peut aussi retirer cet écouteur si tu veux
      window.removeEventListener("click", startMusicOnce);
      window.removeEventListener("keydown", startMusicOnce);
    }

    if (localStorage.getItem("popupBienvenueMasquee") !== "1") {
      window.addEventListener("click", startMusicOnce);
      window.addEventListener("keydown", startMusicOnce);
      musicToggle.textContent = "⏸";
    }

    // Gestion du volume
    volumeRange.addEventListener("input", () => {
      audio.volume = parseFloat(volumeRange.value);
    });
    
    musicToggle.addEventListener('click', () => {
      if (audio.paused) {
        audio.play().then(() => {
          musicToggle.textContent = "⏸";
        }).catch(() => {});
      } else {
        audio.pause();
        musicToggle.textContent = "⏵";
      }
    })
  }

  if (reset) {
    reset.addEventListener("click", () => {
      this.localStorage.clear();
      window.location.reload()
    })
  }
});
