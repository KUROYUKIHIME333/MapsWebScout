// 1. Définition des sources
const planSource = new ol.source.OSM();
const satSource = new ol.source.XYZ({
	url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
	maxZoom: 19,
});

// 2. Création des couches
const tileLayer = new ol.layer.Tile({ source: planSource });

// Couche pour le marqueur (Vector)
const markerSource = new ol.source.Vector();
const markerLayer = new ol.layer.Vector({
	source: markerSource,
	style: new ol.style.Style({
		image: new ol.style.Icon({
			anchor: [0.5, 1],
			src: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-64.png',
			scale: 0.5,
		}),
	}),
});

// 3. Initialisation de la carte
const map = new ol.Map({
	target: 'map',
	layers: [tileLayer, markerLayer],
	view: new ol.View({
		center: ol.proj.fromLonLat([15.307, -4.3224]),
		zoom: 13,
	}),
});

// 4. Fonction pour placer le marqueur et remplir les inputs
function setLocation(coords) {
	const lonLat = ol.proj.toLonLat(coords); // Conversion vers GPS

	document.getElementById('lat').value = lonLat[1].toFixed(6);
	document.getElementById('lng').value = lonLat[0].toFixed(6);

	const feature = new ol.Feature({ geometry: new ol.geom.Point(coords) });
	markerSource.clear();
	markerSource.addFeature(feature);
}

// 5. Gestion du clic
map.on('click', function (evt) {
	setLocation(evt.coordinate);
});

// 6. Géolocalisation
if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition((pos) => {
		const coords = ol.proj.fromLonLat([pos.coords.longitude, pos.coords.latitude]);
		map.getView().animate({ center: coords, zoom: 14 });
		setLocation(coords);
	});
}

// 7. Switcher de couche
function switchLayer(type) {
	tileLayer.setSource(type === 'plan' ? planSource : satSource);
	document.querySelectorAll('.layer-btn').forEach((btn) => btn.classList.remove('active'));
	event.target.classList.add('active');
}
