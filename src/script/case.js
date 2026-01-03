window.addEventListener("DOMContentLoaded", async function () {	
    // Générer un entier aléatoire entre 1 et 5
	const randomInt = Math.floor(Math.random() * 3) + 1;
	// Récupère le numéro du jour depuis l'URL
	const params = new URLSearchParams(window.location.search);
	const jour = Number(params.get('jour'));
    
	// 1) Récupérer la date/heure via WorldTimeAPI
	let today;
	try {
		const res = await fetch("https://worldtimeapi.org/api/timezone/Europe/Paris");
		if (!res.ok) throw new Error("WorldTimeAPI error");
		const data = await res.json();

		// data.datetime est une ISO date, on la convertit en objet Date JS
		today = new Date(data.datetime);
	} catch (e) {
		// En cas d’erreur API, on retombe sur l’heure locale du navigateur
		today = new Date();
	}
	today.setDate(25);
	today.setMonth(11); // Décembre (0-based)

	// Vérifie si la case est "ouverte" à la bonne date
	const estOuvert = (today.getMonth() + 1 > 12) || (today.getMonth() + 1 === 12 && today.getDate() >= jour);

	const zone = document.getElementById('contenu');
	const avert = document.getElementById('avertissement');
	const spanJour = document.getElementById('dateJour');

	const overlay = document.getElementById('overlay-jour');
	const overlayTexte = document.getElementById("overlay-texte");
	const overlayBtn = document.getElementById("overlay-btn");
	const audio = document.getElementById('audio-jour');
	const volumeBar = document.getElementById('volume-range');
	const musicToggle = document.getElementById('music-toggle');

	// Changement du titre de la page
	document.title = "Jour " + jour;

	// Gestion du volume
	if (audio && volumeBar && musicToggle) {
		audio.volume = parseFloat(volumeBar.value);
		volumeBar.addEventListener('input', () => {
			audio.volume = parseFloat(volumeBar.value);
		});

		musicToggle.addEventListener('click', () => {
			if (audio.paused) {
				audio.play().then(() => {
					musicToggle.textContent = "⏸";
				}).catch(() => { });
			} else {
				audio.pause();
				musicToggle.textContent = "⏵";
			}
		})
	}

	if (!estOuvert) {
		zone.style.display = "none";
		avert.style.display = "block";
		spanJour.textContent = jour || "?";
        avert.textContent = "Cette case ne peut être ouverte que le jour " + (jour || "?") + " décembre.";
	} else {
		// Affichage du contenu seulement au bon jour
		avert.style.display = "none";
		fetch('contenus.json')
			.then(response => {
				if (!response.ok) throw new Error('Erreur de chargement du contenu !');
				return response.json();
			})
			.then(contenus => {
				const zone = document.getElementById('contenu');
				if (contenus[jour]) {
					zone.innerHTML = contenus[jour];
				} else {
					zone.textContent = 'Aucune information pour ce jour.';
				}

				// Une fois le contenu injecté, on gère la scène d'intro + musique
				gereOverlayEtMusique();;
			})
			.catch(() => {
				zone.textContent = "Calendrier indisponible pour le moment.";
			});
	}

	// Fonction avec intro
	function gereOverlayEtMusique() {
		if (!overlay || !overlayBtn || !audio) return;
		if (!jour) return;

		const cleIntro = "introVue_jour" + jour;
		audio.src = `music/jour${jour}.mp3`; // fichier audio jourX.mp3

		// Si la scène a déjà été jouée pour cette case, ne rien refaire
		if (localStorage.getItem(cleIntro) === "1") {
			return;
		}
		musicToggle.textContent = "⏸";

		// On est déjà sûr qu'estOuvert est true ici, donc bonne date

		// Préparer visuel + son

		overlay.style.backgroundImage = `url('Images/Cadeau/cadeau${randomInt}.jpg')`;
		overlayTexte.textContent = "Bienvenue au jour numéro " + jour + " !";

		// Masquer le contenu le temps de l'intro
		zone.style.visibility = "hidden";
		overlay.style.display = "flex";

		overlayBtn.addEventListener('click', function () {
			// Marque l'intro comme vue pour cette case
			localStorage.setItem(cleIntro, "1");

			overlay.classList.add('fade-out');

			overlay.addEventListener('transitionend', () => {
				overlay.style.display = "none";
				zone.style.visibility = "visible";
				audio.play().catch(() => { });
			}, { once: true }); // Important
		})
	}
});