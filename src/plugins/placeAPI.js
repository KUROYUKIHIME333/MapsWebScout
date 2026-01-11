import fp from 'fastify-plugin';
import axios from 'axios';
import { placeNearbyApiUrl } from '../../apiUrls.js';

export default fp(async (fastify) => {
	fastify.decorate('findPlaces', async (type = [], radius = 0, longitude = 0, latitude = 0) => {
		try {
			// Utilisation de la config validée par @fastify/env
			const apiKey = fastify.config.PLACES_API_KEY;

			const headers = {
				'Content-Type': 'application/json',
				'X-Goog-Api-Key': apiKey,
				'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.types,places.location,places.rating',
			};

			// Vérification des paramètres
			if (!Array.isArray(type) || type.length === 0 || radius <= 0 || !Number.isFinite(radius)) {
				throw new Error('Paramètres de recherche invalides (type ou radius)');
			}

			const payload = {
				includedTypes: type, // Correction : 'includedTypes' avec un 's'
				maxResultCount: 20,
				locationRestriction: {
					circle: {
						center: {
							latitude: latitude,
							longitude: longitude,
						},
						radius: radius,
					},
				},
			};

			const response = await axios.post(placeNearbyApiUrl, payload, { headers });

			// Sécurité : Si Google ne trouve rien, 'places' peut être undefined
			const allPlaces = response.data.places || [];

			// Filtrage des établissements sans site web
			const responsesWithoutWebsites = allPlaces.filter((place) => !place.websiteUri);

			// Mapping propre pour ton EJS
			return responsesWithoutWebsites.map((place) => ({
				id: place.id,
				name: place.displayName?.text || 'Nom inconnu',
				address: place.formattedAddress,
				phoneNumber: place.nationalPhoneNumber,
				types: place.types,
				location: place.location,
				rating: place.rating,
			}));
		} catch (error) {
			console.error('Erreur Google API détaillée:', error.response?.data || error.message);
			throw error;
		}
	});
});
