const dataContainer = document.querySelector('#data-container');
const rawResults = dataContainer ? dataContainer.getAttribute('data-leads') : null;

const results = rawResults ? JSON.parse(rawResults) : [];

console.log('Données des résultats:', results); //TODO: Supprimer cette ligne après débogage

const defaultCenterOfTheMap = [15.307, -4.3224];

// POPUP
const container = document.getElementById('popup');
const content = document.getElementById('popup-content');

// SOURCES
const planSource = new ol.source.OSM();
const satSource = new ol.source.XYZ({
	url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
	maxZoom: 19,
});

// COUCHES
const tileLayer = new ol.layer.Tile({ source: planSource });

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

// OVERLAY POUR LE POPUP
const overlay = new ol.Overlay({
	element: container,
	autoPan: false,
	offset: [0, -10],
});
map.addOverlay(overlay);

// MARQUEURS POUR CHAQUE RESULTAT
results.forEach((place) => {
	if (place.location && place.location.longitude && place.location.latitude) {
		const feature = new ol.Feature({
			geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(place.location.longitude), parseFloat(place.location.latitude)])),
			name: place.name,
			address: place.address,
			phoneNumber: place.phoneNumber,
			types: place.types,
			rating: place.rating,
			location: place.location,
		});

		feature.setId(place.id);
		markerSource.addFeature(feature);
	}
});

// SURVOL DU MARKER
map.on('pointermove', function (evt) {
	const feature = map.forEachFeatureAtPixel(evt.pixel, function (feat) {
		return feat;
	});

	if (feature && feature.get('name')) {
		map.getTargetElement().style.cursor = 'pointer';

		const name = feature.get('name');
		const address = feature.get('address');
		const phone = feature.get('phoneNumber');
		const types = feature.get('types');
		const rating = feature.get('rating');
		const location = feature.get('location');

		content.innerHTML = `
            <p style="margin: 0 0 5px 0;"><strong>${name}</strong></p>
            ${address ? `<p style="margin: 0; font-size: 0.9em;">${address}</p>` : ''}
            ${phone ? `<p style="margin: 0; font-size: 0.9em;">${phone}</p>` : ''}
            ${rating ? `<p style="margin: 0; font-size: 0.9em;">⭐ ${rating} / 5</p>` : ''}
            ${
				types && types.length > 0
					? `
                <div style="margin-top: 5px;">
                    <small>Types: ${types.join(', ')}</small>
                </div>
            `
					: ''
			}
        `;

		overlay.setPosition(evt.coordinate);
		container.style.display = 'block';
	} else {
		map.getTargetElement().style.cursor = '';
		container.style.display = 'none';
	}
});

// CENTRER SUR LES MARKERS
if (results.length > 0) {
	const extent = markerSource.getExtent();
	if (!ol.extent.isEmpty(extent)) {
		map.getView().fit(extent, {
			padding: [80, 80, 80, 80],
			duration: 1000,
			maxZoom: 16,
		});
	}
}
