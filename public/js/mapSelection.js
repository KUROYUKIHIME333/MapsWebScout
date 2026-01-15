const latInput = document.querySelector('#lat');
const lngInput = document.querySelector('#lng');

const defaultCenterOfTheMap = [15.307, -4.3224];

// SOURCES
const planSource = new ol.source.OSM();
const satSource = new ol.source.XYZ({
	url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
	maxZoom: 19,
});

// CREER LES COUCHES (Satelitte et normal)
const tileLayer = new ol.layer.Tile({ source: planSource });

// COUCHE DE MARQUEUR ou Vector
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

// INIT MAP
const map = new ol.Map({
	target: 'map',
	layers: [tileLayer, markerLayer],
	view: new ol.View({
		center: ol.proj.fromLonLat(defaultCenterOfTheMap),
		zoom: 13,
	}),
});

// METTRE LE MARQUEUR ET REMPLIR LES INPUT
function setLocation(coords) {
	const lonLat = ol.proj.toLonLat(coords); // Conversion vers GPS

	latInput.value = lonLat[1].toFixed(6);
	lngInput.value = lonLat[0].toFixed(6);

	const feature = new ol.Feature({ geometry: new ol.geom.Point(coords) });
	markerSource.clear();
	markerSource.addFeature(feature);
}

// GESTION DE CLICK
map.on('click', function (evt) {
	setLocation(evt.coordinate);
});

// GEOLOCALISATION
if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition((pos) => {
		const coords = ol.proj.fromLonLat([pos.coords.longitude, pos.coords.latitude]);
		map.getView().animate({ center: coords, zoom: 14 });
		setLocation(coords);
	});
}

// CHANGER DE COUCHES (Satelitte ou autre)
function switchLayer(type) {
	tileLayer.setSource(type === 'plan' ? planSource : satSource);
	document.querySelectorAll('.layer-btn').forEach((btn) => btn.classList.remove('active'));
	event.target.classList.add('active');
}
