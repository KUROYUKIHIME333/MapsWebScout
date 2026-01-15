// 1. Initialisation de la carte (vue par défaut 0,0)
const map = L.map('map').setView([-4.3224, 15.307], 13);
let marker;

// 2. Définition des couches (Layers)
const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '© OpenStreetMap',
});

const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EBP, and the GIS User Community',
});

// Ajouter la couche par défaut
osmLayer.addTo(map);

// 3. Ajouter le sélecteur de couches
const baseMaps = {
	Carte: osmLayer,
	Satellite: satelliteLayer,
};
L.control.layers(baseMaps).addTo(map);

// 4. Géolocalisation de l'utilisateur
if ('geolocation' in navigator) {
	navigator.geolocation.getCurrentPosition(
		(position) => {
			const { latitude, longitude } = position.coords;
			updateLocation(latitude, longitude, 15);
		},
		() => {
			console.log('Accès position refusé, centrage sur 0,0');
		}
	);
}

// 5. Fonction pour mettre à jour les inputs et le marqueur
function updateLocation(lat, lng, zoom = null) {
	if (zoom) map.setView([lat, lng], zoom);

	document.getElementById('lat').value = lat.toFixed(6);
	document.getElementById('lng').value = lng.toFixed(6);

	if (marker) {
		marker.setLatLng([lat, lng]);
	} else {
		marker = L.marker([lat, lng]).addTo(map);
	}
}

// 6. Événement clic sur la carte
map.on('click', function (e) {
	updateLocation(e.latlng.lat, e.latlng.lng);
});
