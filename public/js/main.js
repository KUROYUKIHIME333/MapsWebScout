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
				document.querySelector('#lat').value = position.coords.latitude;
				document.querySelector('#lng').value = position.coords.longitude;
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
const prospectForm = document.querySelector('#prospectForm');
const btnScan = document.querySelector('#btnScan');
const resultsContainer = document.querySelector('#resultsContainer');

prospectForm.addEventListener('submit', async (e) => {
	e.preventDefault();

	if (selectedTypes.size === 0) {
		alert("Choisissez au moins un secteur d'activité.");
		return;
	}

	const payload = {
		type: Array.from(selectedTypes),
		radius: parseInt(document.querySelector('#radius').value, 10),
		latitude: parseFloat(document.querySelector('#lat').value),
		longitude: parseFloat(document.querySelector('#lng').value),
	};

	btnScan.disabled = true;
	btnScan.innerHTML = 'Recherche en cours...';

	try {
		const response = await fetch('/scan', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		});

		if (response.ok) {
			// L'API a fini son travail et a stocké les données en session
			// On demande maintenant au navigateur de changer de page
			window.location.href = '/results';
		} else {
			const errorData = await response.json();
			throw new Error(errorData.message || 'Erreur lors du scan');
		}
	} catch (error) {
		console.error('Erreur:', error);
		alert(error.message);
		btnScan.disabled = false;
		btnScan.innerHTML = 'Lancer le scan';
	}
});
