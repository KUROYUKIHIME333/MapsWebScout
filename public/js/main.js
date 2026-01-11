// GESTION DE LA SÉLECTION DES CHIPS ---
const chips = document.querySelectorAll('.chip');
const selectedTypes = new Set();

chips.forEach((chip) => {
	chip.addEventListener('click', () => {
		const value = chip.getAttribute('data-value');

		if (selectedTypes.has(value)) {
			selectedTypes.delete(value);
			chip.classList.remove('active');
		} else {
			selectedTypes.add(value);
			chip.classList.add('active');
		}
	});
});

// GÉOLOCALISATION AUTOMATIQUE ---
const getGeolocation = () => {
	if ('geolocation' in navigator) {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				document.getElementById('lat').value = position.coords.latitude;
				document.getElementById('lng').value = position.coords.longitude;
			},
			(error) => {
				console.warn('Erreur de géolocalisation:', error.message);
				alert('Veuillez autoriser la localisation pour utiliser le scanner.');
			}
		);
	} else {
		alert("La géolocalisation n'est pas supportée par votre navigateur.");
	}
};

// On lance la détection dès que la page est chargée
window.addEventListener('DOMContentLoaded', getGeolocation);

// ENVOI DU FORMULAIRE VIA AXIOS ---
const prospectForm = document.getElementById('prospectForm');
const btnScan = document.getElementById('btnScan');
const resultsContainer = document.getElementById('resultsContainer');

prospectForm.addEventListener('submit', async (e) => {
	e.preventDefault();

	// 1. Validation : Vérifier qu'au moins un type est sélectionné
	if (selectedTypes.size === 0) {
		alert("Choisissez au moins un secteur d'activité.");
		return;
	}

	// 2. Préparation des données
	const payload = {
		type: Array.from(selectedTypes),
		radius: parseInt(document.getElementById('radius').value, 10),
		latitude: parseFloat(document.getElementById('lat').value),
		longitude: parseFloat(document.getElementById('lng').value),
	};

	// 3. État de chargement UI
	btnScan.disabled = true;
	btnScan.innerHTML = '<span class="spinner"></span> Recherche en cours...';
	resultsContainer.style.opacity = '0.5';

	try {
		// 4. Envoi au serveur avec Fetch
		const response = await fetch('/scan', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload), // Fetch nécessite de transformer l'objet en JSON
		});

		// 5. Vérification du statut de la réponse
		if (!response.ok) {
			// Si le serveur renvoie une erreur (ex: 400 ou 500)
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.message || `Erreur serveur : ${response.status}`);
		}

		// 6. Récupération du HTML (le serveur renvoie le rendu de result.ejs)
		const htmlResults = await response.text();

		// 7. Injection et UI
		resultsContainer.innerHTML = htmlResults;
		resultsContainer.style.opacity = '1';
		resultsContainer.scrollIntoView({ behavior: 'smooth' });
	} catch (error) {
		console.error('Erreur Fetch:', error);
		alert(error.message || 'Une erreur est survenue lors du scan.');
	} finally {
		btnScan.disabled = false;
		btnScan.innerHTML = 'Lancer le scan';
	}
});
